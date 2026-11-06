from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.product import Product, ProductImage
from app.models.variant import ProductVariant
from app.schemas.product import ProductCreate, ProductUpdate, ProductResponse
from app.api.v1.endpoints.auth import get_current_user

router = APIRouter()


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
    current_user = Depends(get_current_user)
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
    return product


@router.put("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: str,
    product_in: ProductUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Admin-only endpoint to update product information or availability."""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found.")

    update_data = product_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(product, field, value)

    db.commit()
    db.refresh(product)
    return product


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(
    product_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Admin-only endpoint to delete a product."""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found.")
    db.delete(product)
    db.commit()
    return None

