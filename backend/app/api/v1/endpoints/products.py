from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.core.database import get_db
from app.models.product import Product, ProductImage
from app.models.variant import ProductVariant
from app.models.admin_security import PriceHistory
from app.schemas.product import ProductCreate, ProductUpdate, ProductResponse, VariantResponse, VariantUpdate
from app.core.rbac import (
    require_roles,
    log_admin_action,
    ROLE_SUPERADMIN,
    ROLE_PRODUCT_MANAGER
)
from app.models.user import User

router = APIRouter()


@router.get("/admin/all", response_model=List[ProductResponse])
def get_all_products_admin(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([ROLE_SUPERADMIN, ROLE_PRODUCT_MANAGER]))
):
    """Admin-only endpoint to list all products including drafts and unavailable ones."""
    return db.query(Product).order_by(Product.created_at.desc()).all()


@router.get("/", response_model=List[ProductResponse])
def get_products(
    category_id: Optional[str] = None,
    taste: Optional[str] = None,
    spice_level: Optional[str] = None,
    search: Optional[str] = None,
    featured: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    """Public endpoint to list products with optional category, taste, spice, and search filters."""
    query = db.query(Product).filter(Product.is_available == True)

    if category_id:
        query = query.filter(Product.category_id == category_id)
    if spice_level:
        query = query.filter(Product.spice_level == spice_level.upper())
    if featured is not None:
        query = query.filter(Product.is_featured == featured)
    if search:
        search_fmt = f"%{search.lower()}%"
        query = query.filter(
            (Product.name.ilike(search_fmt)) |
            (Product.description.ilike(search_fmt)) |
            (Product.ingredients.ilike(search_fmt))
        )
    if taste:
        query = query.filter(Product.taste_profiles.ilike(f"%{taste}%"))

    return query.order_by(Product.created_at.desc()).all()


@router.get("/{slug}", response_model=ProductResponse)
def get_product_by_slug(slug: str, db: Session = Depends(get_db)):
    """Public endpoint to fetch a single product with full variants and images."""
    product = db.query(Product).filter(Product.slug == slug).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found.")
    return product


@router.post("/", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(
    product_in: ProductCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([ROLE_SUPERADMIN, ROLE_PRODUCT_MANAGER]))
):
    """Admin-only endpoint to add a new snack and its weight variants."""
    existing = db.query(Product).filter(Product.slug == product_in.slug).first()
    if existing:
        raise HTTPException(status_code=400, detail="Product with this slug already exists.")

    product_data = product_in.model_dump(exclude={"variants", "images"})
    product = Product(**product_data)
    db.add(product)
    db.flush()

    # Create variants
    for v_in in product_in.variants:
        variant = ProductVariant(product_id=product.id, **v_in.model_dump())
        db.add(variant)

    # Create images
    for img_in in product_in.images:
        image = ProductImage(product_id=product.id, **img_in.model_dump())
        db.add(image)

    db.commit()
    db.refresh(product)

    log_admin_action(
        db,
        admin_email=current_user.email,
        action="PRODUCT_CREATED",
        entity="Product",
        entity_id=product.id,
        details=f"Created product '{product.name}' (slug: {product.slug})"
    )

    return product


@router.put("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: str,
    product_in: ProductUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([ROLE_SUPERADMIN, ROLE_PRODUCT_MANAGER]))
):
    """Admin-only endpoint to update product information or availability."""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found.")

    update_data = product_in.model_dump(exclude_unset=True)
    changed_fields = []
    for field, value in update_data.items():
        if getattr(product, field) != value:
            changed_fields.append(f"{field}: {getattr(product, field)} -> {value}")
            setattr(product, field, value)

    db.commit()
    db.refresh(product)

    log_admin_action(
        db,
        admin_email=current_user.email,
        action="PRODUCT_UPDATED",
        entity="Product",
        entity_id=product.id,
        details=f"Updated product '{product.name}'. Changes: {', '.join(changed_fields) if changed_fields else 'None'}"
    )

    return product


@router.patch("/variants/{variant_id}", response_model=VariantResponse)
def update_variant(
    variant_id: str,
    variant_in: VariantUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([ROLE_SUPERADMIN, ROLE_PRODUCT_MANAGER]))
):
    """Admin-only endpoint to update stock status or prices of a weight variant with audit trail."""
    variant = db.query(ProductVariant).filter(ProductVariant.id == variant_id).first()
    if not variant:
        raise HTTPException(status_code=404, detail="Variant not found.")

    update_data = variant_in.model_dump(exclude_unset=True)
    
    # Check if price changed to record price history audit
    old_retail = float(variant.retail_price or 0.0)
    old_wholesale = float(variant.wholesale_price) if variant.wholesale_price else None
    
    for field, value in update_data.items():
        setattr(variant, field, value)

    new_retail = float(variant.retail_price or 0.0)
    new_wholesale = float(variant.wholesale_price) if variant.wholesale_price else None

    if new_retail != old_retail or new_wholesale != old_wholesale:
        history = PriceHistory(
            product_id=variant.product_id,
            variant_id=variant.id,
            variant_weight=variant.weight_label,
            old_retail_price=old_retail,
            new_retail_price=new_retail,
            old_wholesale_price=old_wholesale,
            new_wholesale_price=new_wholesale,
            changed_by=current_user.email,
            reason="Admin dashboard price update"
        )
        db.add(history)

        log_admin_action(
            db,
            admin_email=current_user.email,
            action="PRICE_CHANGED",
            entity="Variant",
            entity_id=variant.id,
            details=f"Price update for variant {variant.weight_label}: Retail ₹{old_retail} -> ₹{new_retail}, Wholesale ₹{old_wholesale} -> ₹{new_wholesale}"
        )

    db.commit()
    db.refresh(variant)
    return variant


@router.get("/{product_id}/price-history")
def get_product_price_history(
    product_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([ROLE_SUPERADMIN, ROLE_PRODUCT_MANAGER]))
):
    """View price audit history for a specific product and all its weight variants."""
    history = db.query(PriceHistory).filter(
        PriceHistory.product_id == product_id
    ).order_by(desc(PriceHistory.created_at)).all()

    return [
        {
            "id": h.id,
            "product_id": h.product_id,
            "variant_id": h.variant_id,
            "variant_weight": h.variant_weight,
            "old_retail_price": h.old_retail_price,
            "new_retail_price": h.new_retail_price,
            "old_wholesale_price": h.old_wholesale_price,
            "new_wholesale_price": h.new_wholesale_price,
            "changed_by": h.changed_by,
            "reason": h.reason,
            "created_at": h.created_at.isoformat() if h.created_at else None
        }
        for h in history
    ]


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(
    product_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([ROLE_SUPERADMIN, ROLE_PRODUCT_MANAGER]))
):
    """Admin-only endpoint to delete a product."""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found.")

    product_name = product.name
    db.delete(product)
    db.commit()

    log_admin_action(
        db,
        admin_email=current_user.email,
        action="PRODUCT_DELETED",
        entity="Product",
        entity_id=product_id,
        details=f"Deleted product '{product_name}'"
    )
    return None
