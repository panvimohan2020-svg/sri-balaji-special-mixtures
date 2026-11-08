import random
import string
from datetime import datetime, timezone, timedelta
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc

from app.core.database import get_db
from app.models.quotation import WholesaleQuotation, QuotationItem
from app.models.dealer import DealerProfile
from app.models.variant import ProductVariant
from app.models.order import Order, OrderItem, OrderStatusHistory
from app.schemas.quotation import QuotationCreateRequest, QuotationResponse
from app.core.rbac import (
    require_roles,
    log_admin_action,
    ROLE_SUPERADMIN,
    ROLE_ORDER_MANAGER
)
from app.models.user import User
from app.api.v1.endpoints.orders import generate_unique_order_number

router = APIRouter()


def generate_unique_quote_number(db: Session) -> str:
    now = datetime.now(timezone.utc)
    date_prefix = now.strftime("%y%m")
    for _ in range(20):
        random_suffix = ''.join(random.choices(string.digits, k=4))
        candidate = f"SB-QT-{date_prefix}-{random_suffix}"
        exists = db.query(WholesaleQuotation).filter(WholesaleQuotation.quote_number == candidate).first()
        if not exists:
            return candidate
    return f"SB-QT-{now.strftime('%H%M%S')}"


@router.post("/", response_model=QuotationResponse, status_code=status.HTTP_201_CREATED)
def create_wholesale_quotation(
    quote_in: QuotationCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([ROLE_SUPERADMIN, ROLE_ORDER_MANAGER]))
):
    """
    Admin: Generate a professional B2B quotation with authentic wholesale pricing.
    """
    if not quote_in.items:
        raise HTTPException(status_code=400, detail="Quotation must contain at least one item.")

    now_utc = datetime.now(timezone.utc)
    valid_until = now_utc + timedelta(days=max(1, quote_in.valid_days))

    subtotal = 0.0
    total_weight_kg = 0.0
    calculated_items = []

    for it in quote_in.items:
        unit_price = it.unit_price
        weight_in_grams = 250
        product_name = it.product_name
        weight_label = it.weight_label

        if it.variant_id:
            variant = db.query(ProductVariant).filter(ProductVariant.id == it.variant_id).first()
            if variant:
                weight_in_grams = variant.weight_in_grams or 250
                weight_label = variant.weight_label
                if variant.product:
                    product_name = variant.product.name
                if not it.unit_price:
                    unit_price = float(variant.wholesale_price or variant.retail_price or 0.0)

        item_subtotal = round(unit_price * it.quantity, 2)
        subtotal += item_subtotal
        total_weight_kg += round((weight_in_grams * it.quantity) / 1000.0, 2)

        calculated_items.append({
            "variant_id": it.variant_id,
            "product_name": product_name,
            "weight_label": weight_label,
            "unit_price": unit_price,
            "quantity": it.quantity,
            "subtotal": item_subtotal
        })

    total_amount = round(subtotal + (quote_in.delivery_charges or 0.0), 2)
    quote_number = generate_unique_quote_number(db)
    admin_name = getattr(current_user, "full_name", "Admin") or "Admin"

    quotation = WholesaleQuotation(
        quote_number=quote_number,
        dealer_id=quote_in.dealer_id,
        customer_id=quote_in.customer_id,
        recipient_name=quote_in.recipient_name.strip(),
        business_name=quote_in.business_name.strip() if quote_in.business_name else None,
        phone_number=quote_in.phone_number.strip(),
        email=quote_in.email.strip() if quote_in.email else None,
        delivery_address=quote_in.delivery_address,
        city=quote_in.city,
        state=quote_in.state,
        pin_code=quote_in.pin_code,
        status="SENT",
        subtotal=subtotal,
        delivery_charges=round(quote_in.delivery_charges, 2),
        total_amount=total_amount,
        total_weight_kg=round(total_weight_kg, 2),
        valid_until=valid_until,
        terms_and_conditions=quote_in.terms_and_conditions,
        notes=quote_in.notes,
        created_by=admin_name,
        created_at=now_utc,
        updated_at=now_utc
    )
    db.add(quotation)
    db.flush()

    for item_data in calculated_items:
        q_item = QuotationItem(quotation_id=quotation.id, **item_data)
        db.add(q_item)

    db.commit()
    db.refresh(quotation)

    log_admin_action(
        db,
        admin_email=current_user.email,
        action="QUOTATION_CREATED",
        entity="WholesaleQuotation",
        entity_id=quotation.id,
        details=f"Created quotation #{quotation.quote_number} for {quotation.business_name} (₹{quotation.total_amount})"
    )

    return quotation


@router.get("/", response_model=List[QuotationResponse])
def get_quotations(
    dealer_id: Optional[str] = None,
    search: Optional[str] = None,
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([ROLE_SUPERADMIN, ROLE_ORDER_MANAGER]))
):
    """Admin: List and search all generated wholesale quotations."""
    query = db.query(WholesaleQuotation)
    if dealer_id:
        query = query.filter(WholesaleQuotation.dealer_id == dealer_id)
    if search:
        s = f"%{search.strip()}%"
        query = query.filter(
            or_(
                WholesaleQuotation.quote_number.ilike(s),
                WholesaleQuotation.recipient_name.ilike(s),
                WholesaleQuotation.business_name.ilike(s),
                WholesaleQuotation.phone_number.ilike(s)
            )
        )
    return query.order_by(desc(WholesaleQuotation.created_at)).offset(skip).limit(limit).all()


@router.get("/{quote_id_or_num}", response_model=QuotationResponse)
def get_quotation_by_id_or_number(
    quote_id_or_num: str,
    db: Session = Depends(get_db)
):
    """Public / Dealer: View quotation details and print preview."""
    quote = db.query(WholesaleQuotation).filter(
        or_(
            WholesaleQuotation.id == quote_id_or_num,
            WholesaleQuotation.quote_number == quote_id_or_num.upper()
        )
    ).first()
    if not quote:
        raise HTTPException(status_code=404, detail="Quotation not found.")
    return quote


@router.post("/{quote_id}/convert-to-order")
def convert_quotation_to_order(
    quote_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([ROLE_SUPERADMIN, ROLE_ORDER_MANAGER]))
):
    """
    Admin: Convert accepted quotation directly into a confirmed wholesale order.
    """
    quote = db.query(WholesaleQuotation).filter(WholesaleQuotation.id == quote_id).first()
    if not quote:
        raise HTTPException(status_code=404, detail="Quotation not found.")

    if quote.status == "CONVERTED" and quote.converted_order_id:
        raise HTTPException(status_code=400, detail="Quotation already converted to an order.")

    now_utc = datetime.now(timezone.utc)
    order_number = generate_unique_order_number(db)

    order = Order(
        order_number=order_number,
        dealer_id=quote.dealer_id,
        quotation_id=quote.id,
        customer_id=quote.customer_id,
        customer_name=quote.recipient_name,
        business_name=quote.business_name,
        phone_number=quote.phone_number,
        whatsapp_number=quote.phone_number,
        order_type="WHOLESALE",
        fulfillment_type="DELIVERY",
        status="CONFIRMED",
        payment_status="UNPAID",
        payment_method="WHATSAPP_CONFIRMATION",
        total_estimated_amount=quote.total_amount,
        total_estimated_weight_kg=quote.total_weight_kg,
        delivery_address=quote.delivery_address,
        city=quote.city,
        state=quote.state,
        pin_code=quote.pin_code,
        notes=f"Converted from Quotation #{quote.quote_number}. {quote.notes or ''}".strip(),
        inventory_deducted=False
    )
    db.add(order)
    db.flush()

    for item in quote.items:
        order_item = OrderItem(
            order_id=order.id,
            variant_id=item.variant_id,
            product_name=item.product_name,
            weight_label=item.weight_label,
            unit_price=item.unit_price,
            quantity=item.quantity,
            subtotal=item.subtotal
        )
        db.add(order_item)

    # Status history
    db.add(OrderStatusHistory(
        order_id=order.id,
        from_status=None,
        to_status="CONFIRMED",
        notes=f"Created and confirmed via Quotation #{quote.quote_number}",
        changed_by=getattr(current_user, "full_name", "Admin") or "Admin"
    ))

    quote.status = "CONVERTED"
    quote.converted_order_id = order.id
    quote.updated_at = now_utc

    db.commit()
    db.refresh(order)

    log_admin_action(
        db,
        admin_email=current_user.email,
        action="QUOTATION_CONVERTED",
        entity="WholesaleQuotation",
        entity_id=quote.id,
        details=f"Converted quotation #{quote.quote_number} to Order #{order.order_number}"
    )

    return {
        "message": f"Quotation converted to Order #{order.order_number}",
        "order_id": order.id,
        "order_number": order.order_number,
        "status": order.status
    }
