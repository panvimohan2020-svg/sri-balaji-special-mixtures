import random
import string
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.order import Order, OrderItem
from app.schemas.order import OrderCreate, OrderResponse
from app.api.v1.endpoints.auth import get_current_user

router = APIRouter()


def generate_order_number() -> str:
    digits = ''.join(random.choices(string.digits, k=6))
    return f"SB-{digits}"


@router.post("/", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def submit_order(order_in: OrderCreate, db: Session = Depends(get_db)):
    """Public endpoint to record a submitted cart/order enquiry."""
    order_data = order_in.model_dump(exclude={"items"})
    order = Order(
        order_number=generate_order_number(),
        status="ENQUIRY",
        **order_data
    )
    db.add(order)
    db.flush()

    for item_in in order_in.items:
        order_item = OrderItem(order_id=order.id, **item_in.model_dump())
        db.add(order_item)

    db.commit()
    db.refresh(order)
    return order


@router.get("/", response_model=List[OrderResponse])
def get_all_orders(
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Admin-only endpoint to inspect submitted orders and wholesale inquiries."""
    return db.query(Order).order_by(Order.created_at.desc()).offset(skip).limit(limit).all()


@router.patch("/{order_id}/status")
def update_order_status(
    order_id: str,
    status: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Admin-only endpoint to update order workflow status."""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")
    order.status = status
    db.commit()
    return {"message": "Status updated", "status": order.status}

