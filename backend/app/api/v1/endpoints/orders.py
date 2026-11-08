import random
import string
from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc, asc

from app.core.database import get_db
from app.models.order import Order, OrderItem, OrderStatusHistory
from app.models.variant import ProductVariant
from app.models.customer import CustomerNotification
from app.models.inventory import StockMovement
from app.models.loyalty import LoyaltyAccount, LoyaltyTransaction
from app.models.marketing import MarketingCoupon
from app.api.v1.endpoints.inventory import update_low_stock_status
from app.schemas.order import (
    OrderCreate, 
    OrderResponse, 
    OrderStatusUpdate, 
    OrderAdminNotesUpdate
)
from app.core.rbac import (
    require_roles,
    log_admin_action,
    ROLE_SUPERADMIN,
    ROLE_ORDER_MANAGER
)
from app.models.user import User

router = APIRouter()

VALID_STATUSES = [
    "NEW ENQUIRY",
    "CONTACTED",
    "CONFIRMED",
    "PREPARING",
    "READY FOR PICKUP / DISPATCHED",
    "DELIVERED",
    "CANCELLED",
    "REJECTED"
]


def generate_unique_order_number(db: Session) -> str:
    """Generates unique human-readable order reference like SB-2611-9876."""
    now = datetime.now(timezone.utc)
    date_prefix = now.strftime("%y%m")
    for _ in range(20):
        random_suffix = ''.join(random.choices(string.digits, k=4))
        candidate = f"SB-{date_prefix}-{random_suffix}"
        exists = db.query(Order).filter(Order.order_number == candidate).first()
        if not exists:
            return candidate
    # Fallback to 8 digits
    random_suffix = ''.join(random.choices(string.digits, k=6))
    return f"SB-{random_suffix}"


@router.post("/", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def submit_order(order_in: OrderCreate, db: Session = Depends(get_db)):
    """
    Public endpoint: Customer submits a cart enquiry (Retail or Wholesale).
    Calculates prices server-side using authentic DB rates.
    Generates a unique order reference number.
    Does NOT deduct inventory at the enquiry stage.
    """
    if not order_in.items:
        raise HTTPException(status_code=400, detail="Order must contain at least one item.")

    calculated_items = []
    total_amount = 0.0
    total_weight_kg = 0.0
    is_wholesale = order_in.order_type.upper() == "WHOLESALE"

    for item_in in order_in.items:
        unit_price = item_in.unit_price or 0.0
        weight_in_grams = 250
        product_name = item_in.product_name
        weight_label = item_in.weight_label

        if item_in.variant_id:
            variant = db.query(ProductVariant).filter(ProductVariant.id == item_in.variant_id).first()
            if variant:
                weight_in_grams = variant.weight_in_grams or 250
                weight_label = variant.weight_label
                if variant.product:
                    product_name = variant.product.name

                # Authentic price calculation
                if is_wholesale:
                    unit_price = float(variant.wholesale_price or variant.retail_price or 0.0)
                else:
                    unit_price = float(variant.retail_price or 0.0)

        item_subtotal = round(unit_price * item_in.quantity, 2)
        total_amount += item_subtotal
        total_weight_kg += round((weight_in_grams * item_in.quantity) / 1000.0, 2)

        calculated_items.append({
            "variant_id": item_in.variant_id,
            "product_name": product_name,
            "weight_label": weight_label,
            "unit_price": unit_price,
            "quantity": item_in.quantity,
            "subtotal": item_subtotal
        })

    order_number = generate_unique_order_number(db)
    
    # Calculate discounts
    discount_amount = float(order_in.discount_amount or 0.0)
    points_discount = float(order_in.points_discount or 0.0)
    final_amount = max(0.0, round(total_amount - discount_amount - points_discount, 2))

    new_order = Order(
        order_number=order_number,
        customer_id=order_in.customer_id,
        customer_name=order_in.customer_name.strip(),
        phone_number=order_in.phone_number.strip(),
        whatsapp_number=order_in.whatsapp_number.strip() if order_in.whatsapp_number else order_in.phone_number.strip(),
        business_name=order_in.business_name.strip() if order_in.business_name else None,
        order_type="WHOLESALE" if is_wholesale else "RETAIL",
        fulfillment_type=order_in.fulfillment_type or "DELIVERY",
        status="NEW ENQUIRY",
        payment_status="UNPAID",
        payment_method=order_in.payment_method or "WHATSAPP_CONFIRMATION",
        coupon_id=order_in.coupon_code,
        discount_amount=discount_amount,
        points_redeemed=order_in.points_redeemed or 0,
        points_discount=points_discount,
        total_estimated_amount=final_amount,
        total_estimated_weight_kg=round(total_weight_kg, 2),
        delivery_address=order_in.delivery_address,
        city=order_in.city,
        state=order_in.state,
        pin_code=order_in.pin_code,
        notes=order_in.notes,
        inventory_deducted=False
    )
    db.add(new_order)
    db.flush()

    # Track coupon usage if valid
    if order_in.coupon_code:
        coupon = db.query(MarketingCoupon).filter(MarketingCoupon.code == order_in.coupon_code.strip().upper()).first()
        if coupon:
            coupon.usage_count += 1

    # Deduct redeemed points if applicable
    if order_in.points_redeemed and order_in.points_redeemed > 0 and order_in.customer_id:
        loyalty_acc = db.query(LoyaltyAccount).filter(LoyaltyAccount.customer_id == order_in.customer_id).first()
        if loyalty_acc and loyalty_acc.points_balance >= order_in.points_redeemed:
            loyalty_acc.points_balance -= order_in.points_redeemed
            loyalty_acc.lifetime_points_redeemed += order_in.points_redeemed
            loyalty_acc.updated_at = datetime.now(timezone.utc)
            db.add(LoyaltyTransaction(
                account_id=loyalty_acc.id,
                order_id=new_order.id,
                transaction_type="REDEEM",
                points=-order_in.points_redeemed,
                balance_after=loyalty_acc.points_balance,
                description=f"Redeemed on order #{order_number}",
                created_at=datetime.now(timezone.utc)
            ))

    for item_data in calculated_items:
        order_item = OrderItem(order_id=new_order.id, **item_data)
        db.add(order_item)

    # Initial Status History
    status_entry = OrderStatusHistory(
        order_id=new_order.id,
        from_status=None,
        to_status="NEW ENQUIRY",
        notes="Order enquiry submitted by customer via storefront",
        changed_by="Customer"
    )
    db.add(status_entry)

    # If customer is registered, send customer notification
    if new_order.customer_id:
        notif = CustomerNotification(
            customer_id=new_order.customer_id,
            order_id=new_order.id,
            type="ORDER_PLACED",
            title="Order Placed",
            message=f"Your order #{new_order.order_number} has been received. Estimated amount: Rs.{new_order.total_estimated_amount}."
        )
        db.add(notif)

    db.commit()
    db.refresh(new_order)
    return new_order


@router.get("/", response_model=List[OrderResponse])
def get_orders(
    search: Optional[str] = Query(None, description="Search by order number, customer name, or phone"),
    order_type: Optional[str] = Query(None, description="Filter RETAIL or WHOLESALE"),
    status: Optional[str] = Query(None, description="Filter by status"),
    sort_order: str = Query("desc", regex="^(asc|desc)$"),
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([ROLE_SUPERADMIN, ROLE_ORDER_MANAGER]))
):
    """
    Admin: Search, filter, and inspect incoming order enquiries and confirmed orders.
    """
    query = db.query(Order)

    if order_type:
        query = query.filter(Order.order_type == order_type.upper())

    if status:
        query = query.filter(Order.status == status)

    if search:
        search_term = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Order.order_number.ilike(search_term),
                Order.customer_name.ilike(search_term),
                Order.phone_number.ilike(search_term),
                Order.business_name.ilike(search_term)
            )
        )

    if sort_order == "asc":
        query = query.order_by(asc(Order.created_at))
    else:
        query = query.order_by(desc(Order.created_at))

    return query.offset(skip).limit(limit).all()


@router.get("/track/{order_number}")
def track_order(
    order_number: str,
    phone: Optional[str] = Query(None, description="Verification phone number"),
    db: Session = Depends(get_db)
):
    """
    Public Order Tracking:
    Allows customers to track their order status timeline.
    Validates phone match if provided to ensure customer privacy.
    """
    clean_num = order_number.strip().upper()
    order = db.query(Order).filter(Order.order_number == clean_num).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order reference not found. Please check your order ID.")

    if phone:
        clean_input = phone.strip().replace(" ", "").replace("-", "")[-10:]
        clean_order_phone = order.phone_number.strip().replace(" ", "").replace("-", "")[-10:]
        if clean_input != clean_order_phone:
            raise HTTPException(status_code=403, detail="Phone number does not match this order.")

    masked_phone = f"{order.phone_number[:2]}****{order.phone_number[-4:]}" if len(order.phone_number) >= 6 else "****"

    return {
        "id": order.id,
        "order_number": order.order_number,
        "customer_name": order.customer_name,
        "masked_phone": masked_phone,
        "status": order.status,
        "payment_status": order.payment_status or "UNPAID",
        "payment_method": order.payment_method or "WHATSAPP_CONFIRMATION",
        "order_type": order.order_type,
        "fulfillment_type": order.fulfillment_type or "DELIVERY",
        "total_estimated_amount": float(order.total_estimated_amount or 0.0),
        "total_estimated_weight_kg": float(order.total_estimated_weight_kg or 0.0),
        "delivery_address": order.delivery_address,
        "city": order.city,
        "state": order.state,
        "pin_code": order.pin_code,
        "created_at": order.created_at,
        "confirmed_at": order.confirmed_at,
        "dispatched_at": order.dispatched_at,
        "delivered_at": order.delivered_at,
        "cancelled_at": order.cancelled_at,
        "items": [
            {
                "product_name": item.product_name,
                "weight_label": item.weight_label,
                "quantity": item.quantity,
                "unit_price": float(item.unit_price),
                "subtotal": float(item.subtotal)
            } for item in order.items
        ],
        "status_history": [
            {
                "from_status": h.from_status,
                "to_status": h.to_status,
                "notes": h.notes,
                "changed_by": h.changed_by,
                "created_at": h.created_at
            } for h in order.status_history
        ]
    }


@router.get("/{order_id}", response_model=OrderResponse)
def get_order_by_id(
    order_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([ROLE_SUPERADMIN, ROLE_ORDER_MANAGER]))
):
    """Admin: Get single order details with items and complete status history."""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")
    return order


@router.patch("/{order_id}/status")
def update_order_status(
    order_id: str,
    status_in: OrderStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([ROLE_SUPERADMIN, ROLE_ORDER_MANAGER]))
):
    """
    Admin: Update order lifecycle status with automatic inventory reservation and restoration.
    """
    target_status = status_in.status.strip()
    if target_status not in VALID_STATUSES:
        raise HTTPException(
            status_code=400, 
            detail=f"Invalid status '{target_status}'. Allowed: {', '.join(VALID_STATUSES)}"
        )

    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")

    old_status = order.status
    if old_status == target_status:
        return {"message": "Status unchanged", "status": order.status}

    admin_name = getattr(current_user, "full_name", "Admin") or status_in.changed_by or "Admin"
    now_utc = datetime.now(timezone.utc)

    # 1. If transitioning to CONFIRMED and inventory hasn't been deducted yet
    if target_status == "CONFIRMED" and not order.inventory_deducted:
        # Revalidate stock availability before confirming
        for item in order.items:
            if item.variant_id:
                variant = db.query(ProductVariant).filter(ProductVariant.id == item.variant_id).first()
                if variant and variant.track_inventory:
                    if variant.stock_quantity < item.quantity:
                        raise HTTPException(
                            status_code=400,
                            detail=f"Insufficient inventory for {item.product_name} ({item.weight_label}). "
                                   f"Available: {variant.stock_quantity}, Required: {item.quantity}. "
                                   f"Please replenish stock before confirming."
                        )

        # Deduct stock safely with transactions
        for item in order.items:
            if item.variant_id:
                variant = db.query(ProductVariant).filter(ProductVariant.id == item.variant_id).first()
                if variant and variant.track_inventory:
                    prev_stock = variant.stock_quantity
                    new_stock = prev_stock - item.quantity
                    variant.stock_quantity = new_stock
                    variant.is_in_stock = new_stock > 0

                    movement = StockMovement(
                        variant_id=variant.id,
                        movement_type="ORDER_CONFIRMATION",
                        quantity_change=-item.quantity,
                        previous_stock=prev_stock,
                        new_stock=new_stock,
                        reference_id=order.order_number,
                        notes=f"Reserved for confirmed order {order.order_number}",
                        created_by=admin_name
                    )
                    db.add(movement)
                    update_low_stock_status(variant, db, admin_name)

        order.inventory_deducted = True
        order.confirmed_at = now_utc

        # Award Loyalty points if customer exists (1 point per Rs. 20)
        if order.customer_id:
            loyalty_acc = db.query(LoyaltyAccount).filter(LoyaltyAccount.customer_id == order.customer_id).first()
            if loyalty_acc:
                earned_pts = max(1, int(float(order.total_estimated_amount or 0.0) / 20.0))
                loyalty_acc.points_balance += earned_pts
                loyalty_acc.lifetime_points_earned += earned_pts
                loyalty_acc.updated_at = now_utc
                db.add(LoyaltyTransaction(
                    account_id=loyalty_acc.id,
                    order_id=order.id,
                    transaction_type="EARN",
                    points=earned_pts,
                    balance_after=loyalty_acc.points_balance,
                    description=f"Earned {earned_pts} pts from confirmed order #{order.order_number}",
                    created_at=now_utc
                ))

    # 2. If transitioning from confirmed/reserved to CANCELLED or REJECTED
    elif target_status in ["CANCELLED", "REJECTED"] and order.inventory_deducted:
        for item in order.items:
            if item.variant_id:
                variant = db.query(ProductVariant).filter(ProductVariant.id == item.variant_id).first()
                if variant and variant.track_inventory:
                    prev_stock = variant.stock_quantity
                    new_stock = prev_stock + item.quantity
                    variant.stock_quantity = new_stock
                    variant.is_in_stock = True

                    movement = StockMovement(
                        variant_id=variant.id,
                        movement_type="ORDER_CANCELLATION_RESTORE",
                        quantity_change=item.quantity,
                        previous_stock=prev_stock,
                        new_stock=new_stock,
                        reference_id=order.order_number,
                        notes=f"Restored from {target_status} order {order.order_number}",
                        created_by=admin_name
                    )
                    db.add(movement)
                    update_low_stock_status(variant, db, admin_name)

        order.inventory_deducted = False
        order.cancelled_at = now_utc

        # Restore redeemed loyalty points if any were used
        if order.customer_id and (order.points_redeemed or 0) > 0:
            loyalty_acc = db.query(LoyaltyAccount).filter(LoyaltyAccount.customer_id == order.customer_id).first()
            if loyalty_acc:
                loyalty_acc.points_balance += order.points_redeemed
                loyalty_acc.lifetime_points_redeemed = max(0, loyalty_acc.lifetime_points_redeemed - order.points_redeemed)
                loyalty_acc.updated_at = now_utc
                db.add(LoyaltyTransaction(
                    account_id=loyalty_acc.id,
                    order_id=order.id,
                    transaction_type="ADMIN_ADJUST",
                    points=order.points_redeemed,
                    balance_after=loyalty_acc.points_balance,
                    description=f"Restored {order.points_redeemed} redeemed pts from cancelled order #{order.order_number}",
                    created_at=now_utc
                ))

    # 3. Track other lifecycle timestamps
    elif target_status == "READY FOR PICKUP / DISPATCHED":
        order.dispatched_at = now_utc
    elif target_status == "DELIVERED":
        order.delivered_at = now_utc

    order.status = target_status
    order.updated_at = now_utc

    # Record Status History
    history_entry = OrderStatusHistory(
        order_id=order.id,
        from_status=old_status,
        to_status=target_status,
        notes=status_in.notes or f"Status transitioned from {old_status} to {target_status}",
        changed_by=admin_name
    )
    db.add(history_entry)
    db.commit()
    db.refresh(order)

    log_admin_action(
        db,
        admin_email=current_user.email,
        action="ORDER_STATUS_UPDATE",
        entity="Order",
        entity_id=order.id,
        details=f"Order {order.order_number} status changed from '{old_status}' to '{target_status}'"
    )

    return {
        "message": f"Order status updated to {target_status}",
        "order_id": order.id,
        "order_number": order.order_number,
        "old_status": old_status,
        "new_status": target_status,
        "inventory_deducted": order.inventory_deducted
    }


@router.patch("/{order_id}/admin-notes")
def update_order_admin_notes(
    order_id: str,
    notes_in: OrderAdminNotesUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([ROLE_SUPERADMIN, ROLE_ORDER_MANAGER]))
):
    """Admin: Save internal administrative notes on an order."""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")

    order.admin_notes = notes_in.admin_notes
    order.updated_at = datetime.now(timezone.utc)
    db.commit()

    log_admin_action(
        db,
        admin_email=current_user.email,
        action="ORDER_NOTE_ADDED",
        entity="Order",
        entity_id=order.id,
        details=f"Updated internal admin notes on order {order.order_number}"
    )

    return {"message": "Admin notes saved successfully", "order_id": order.id}
