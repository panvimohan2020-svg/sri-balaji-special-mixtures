from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.variant import ProductVariant
from app.models.product import Product
from app.models.inventory import StockMovement, LowStockAlert
from app.schemas.inventory import (
    StockAdjustmentRequest,
    StockMovementResponse,
    InventoryConfigUpdate,
    LowStockAlertResponse
)
from app.core.rbac import (
    require_roles,
    log_admin_action,
    ROLE_SUPERADMIN,
    ROLE_INVENTORY_MANAGER
)
from app.models.user import User

router = APIRouter()


def update_low_stock_status(variant: ProductVariant, db: Session, admin_name: str = "Admin"):
    """Evaluates low stock alerts for a variant based on threshold and tracking."""
    if not variant.track_inventory:
        # If tracking disabled, resolve active alerts
        active_alerts = db.query(LowStockAlert).filter(
            LowStockAlert.variant_id == variant.id,
            LowStockAlert.is_resolved == False
        ).all()
        for a in active_alerts:
            a.is_resolved = True
            a.resolved_at = datetime.now(timezone.utc)
        return

    is_low = variant.stock_quantity <= variant.min_stock_threshold
    active_alert = db.query(LowStockAlert).filter(
        LowStockAlert.variant_id == variant.id,
        LowStockAlert.is_resolved == False
    ).first()

    if is_low:
        if not active_alert:
            alert = LowStockAlert(
                variant_id=variant.id,
                current_quantity=variant.stock_quantity,
                threshold=variant.min_stock_threshold,
                is_acknowledged=False
            )
            db.add(alert)
        else:
            active_alert.current_quantity = variant.stock_quantity
            active_alert.threshold = variant.min_stock_threshold
    else:
        if active_alert:
            active_alert.is_resolved = True
            active_alert.resolved_at = datetime.now(timezone.utc)


@router.get("/summary")
def get_inventory_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([ROLE_SUPERADMIN, ROLE_INVENTORY_MANAGER]))
):
    """Admin: Overview statistics of inventory and stock health."""
    variants = db.query(ProductVariant).all()
    total_variants = len(variants)
    tracked_count = sum(1 for v in variants if v.track_inventory)
    unconfigured_count = sum(1 for v in variants if not v.is_opening_stock_set and not v.track_inventory)
    
    low_stock_count = db.query(LowStockAlert).filter(
        LowStockAlert.is_resolved == False
    ).count()

    total_movements = db.query(StockMovement).count()

    return {
        "total_variants": total_variants,
        "tracked_variants": tracked_count,
        "unconfigured_variants": unconfigured_count,
        "active_low_stock_alerts": low_stock_count,
        "total_movements_logged": total_movements
    }


@router.get("/items")
def get_inventory_items(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([ROLE_SUPERADMIN, ROLE_INVENTORY_MANAGER]))
):
    """Admin: List all product variants with stock metrics and tracking status."""
    variants = db.query(ProductVariant).join(Product).all()
    results = []
    for v in variants:
        results.append({
            "variant_id": v.id,
            "product_id": v.product_id,
            "product_name": v.product.name if v.product else "Unknown Product",
            "weight_label": v.weight_label,
            "weight_in_grams": v.weight_in_grams,
            "retail_price": float(v.retail_price) if v.retail_price else 0.0,
            "wholesale_price": float(v.wholesale_price) if v.wholesale_price else 0.0,
            "stock_quantity": v.stock_quantity,
            "is_in_stock": v.is_in_stock,
            "track_inventory": v.track_inventory,
            "min_stock_threshold": v.min_stock_threshold,
            "is_opening_stock_set": v.is_opening_stock_set,
            "is_low_stock": v.track_inventory and (v.stock_quantity <= v.min_stock_threshold),
            "sku": v.sku
        })
    return results


@router.patch("/variants/{variant_id}/config")
def update_inventory_config(
    variant_id: str,
    config_in: InventoryConfigUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([ROLE_SUPERADMIN, ROLE_INVENTORY_MANAGER]))
):
    """Admin: Configure tracking toggle and minimum threshold for a variant."""
    variant = db.query(ProductVariant).filter(ProductVariant.id == variant_id).first()
    if not variant:
        raise HTTPException(status_code=404, detail="Variant not found.")

    variant.track_inventory = config_in.track_inventory
    variant.min_stock_threshold = max(0, config_in.min_stock_threshold)
    
    update_low_stock_status(variant, db, getattr(current_user, "full_name", "Admin"))
    db.commit()
    db.refresh(variant)

    log_admin_action(
        db,
        admin_email=current_user.email,
        action="INVENTORY_CONFIG_UPDATE",
        entity="Variant",
        entity_id=variant.id,
        details=f"Updated config: track_inventory={variant.track_inventory}, min_threshold={variant.min_stock_threshold}"
    )

    return {
        "message": "Inventory configuration updated",
        "variant_id": variant.id,
        "track_inventory": variant.track_inventory,
        "min_stock_threshold": variant.min_stock_threshold
    }


@router.post("/variants/{variant_id}/adjust")
def adjust_stock(
    variant_id: str,
    adjustment: StockAdjustmentRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([ROLE_SUPERADMIN, ROLE_INVENTORY_MANAGER]))
):
    """Admin: Record opening stock, incoming shipment, damaged stock, or manual adjustment."""
    variant = db.query(ProductVariant).filter(ProductVariant.id == variant_id).first()
    if not variant:
        raise HTTPException(status_code=404, detail="Variant not found.")

    prev_stock = variant.stock_quantity or 0
    qty = adjustment.quantity
    m_type = adjustment.movement_type.upper()
    admin_name = getattr(current_user, "full_name", "Admin") or current_user.email

    if m_type == "OPENING_STOCK":
        if qty < 0:
            raise HTTPException(status_code=400, detail="Opening stock cannot be negative.")
        new_stock = qty
        qty_change = new_stock - prev_stock
        variant.is_opening_stock_set = True
        variant.track_inventory = True

    elif m_type == "PURCHASE_INWARD":
        if qty <= 0:
            raise HTTPException(status_code=400, detail="Inward purchase quantity must be greater than zero.")
        new_stock = prev_stock + qty
        qty_change = qty

    elif m_type == "DAMAGE_DISCARD":
        if qty <= 0:
            raise HTTPException(status_code=400, detail="Damage quantity must be greater than zero.")
        if prev_stock - qty < 0:
            raise HTTPException(status_code=400, detail=f"Cannot discard {qty} units. Current stock is only {prev_stock}. Negative stock prevented.")
        new_stock = prev_stock - qty
        qty_change = -qty

    elif m_type == "MANUAL_ADJUSTMENT":
        # qty is treated as target new stock
        if qty < 0:
            raise HTTPException(status_code=400, detail="Stock cannot be set to a negative number. Negative stock prevented.")
        new_stock = qty
        qty_change = new_stock - prev_stock

    else:
        raise HTTPException(status_code=400, detail=f"Invalid movement type '{adjustment.movement_type}'.")

    variant.stock_quantity = new_stock
    variant.is_in_stock = new_stock > 0

    # Record Movement
    movement = StockMovement(
        variant_id=variant.id,
        movement_type=m_type,
        quantity_change=qty_change,
        previous_stock=prev_stock,
        new_stock=new_stock,
        reference_id=adjustment.reference_id,
        notes=adjustment.notes,
        created_by=admin_name
    )
    db.add(movement)

    update_low_stock_status(variant, db, admin_name)
    db.commit()
    db.refresh(variant)

    log_admin_action(
        db,
        admin_email=current_user.email,
        action="STOCK_ADJUSTMENT",
        entity="Variant",
        entity_id=variant.id,
        details=f"Stock adjusted via {m_type}: {prev_stock} -> {new_stock} (change: {qty_change:+d})"
    )

    return {
        "message": f"Stock updated via {m_type}",
        "variant_id": variant.id,
        "previous_stock": prev_stock,
        "new_stock": new_stock,
        "quantity_change": qty_change,
        "is_in_stock": variant.is_in_stock,
        "track_inventory": variant.track_inventory
    }


@router.get("/movements", response_model=List[StockMovementResponse])
def get_stock_movements(
    variant_id: Optional[str] = None,
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([ROLE_SUPERADMIN, ROLE_INVENTORY_MANAGER]))
):
    """Admin: View audit history of all inventory movements."""
    query = db.query(StockMovement)
    if variant_id:
        query = query.filter(StockMovement.variant_id == variant_id)
    return query.order_by(StockMovement.created_at.desc()).offset(skip).limit(limit).all()


@router.get("/alerts")
def get_low_stock_alerts(
    unresolved_only: bool = True,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([ROLE_SUPERADMIN, ROLE_INVENTORY_MANAGER]))
):
    """Admin: View active low-stock alerts."""
    query = db.query(LowStockAlert).join(ProductVariant).join(Product)
    if unresolved_only:
        query = query.filter(LowStockAlert.is_resolved == False)

    alerts = query.order_by(LowStockAlert.created_at.desc()).all()
    results = []
    for a in alerts:
        results.append({
            "id": a.id,
            "variant_id": a.variant_id,
            "product_name": a.variant.product.name if a.variant and a.variant.product else "Unknown",
            "weight_label": a.variant.weight_label if a.variant else "N/A",
            "current_quantity": a.current_quantity,
            "threshold": a.threshold,
            "is_acknowledged": a.is_acknowledged,
            "acknowledged_at": a.acknowledged_at,
            "acknowledged_by": a.acknowledged_by,
            "is_resolved": a.is_resolved,
            "resolved_at": a.resolved_at,
            "created_at": a.created_at
        })
    return results


@router.post("/alerts/{alert_id}/acknowledge")
def acknowledge_alert(
    alert_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([ROLE_SUPERADMIN, ROLE_INVENTORY_MANAGER]))
):
    """Admin: Acknowledge a low stock alert."""
    alert = db.query(LowStockAlert).filter(LowStockAlert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found.")
    alert.is_acknowledged = True
    alert.acknowledged_at = datetime.now(timezone.utc)
    alert.acknowledged_by = getattr(current_user, "full_name", "Admin") or current_user.email
    db.commit()

    log_admin_action(
        db,
        admin_email=current_user.email,
        action="ALERT_ACKNOWLEDGED",
        entity="LowStockAlert",
        entity_id=alert.id,
        details=f"Acknowledged low stock alert for variant {alert.variant_id}"
    )

    return {"message": "Alert acknowledged", "alert_id": alert.id}
