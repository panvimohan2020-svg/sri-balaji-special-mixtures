from typing import List, Optional
from pydantic import BaseModel, Field
from datetime import datetime


class OrderStatusHistoryResponse(BaseModel):
    id: str
    order_id: str
    from_status: Optional[str] = None
    to_status: str
    notes: Optional[str] = None
    changed_by: str
    created_at: datetime

    class Config:
        from_attributes = True


class OrderItemBase(BaseModel):
    variant_id: Optional[str] = None
    product_name: str
    weight_label: str
    unit_price: Optional[float] = 0.0
    quantity: int = Field(default=1, ge=1)
    subtotal: Optional[float] = 0.0


class OrderItemResponse(BaseModel):
    id: str
    order_id: str
    variant_id: Optional[str] = None
    product_name: str
    weight_label: str
    unit_price: float
    quantity: int
    subtotal: float

    class Config:
        from_attributes = True


class OrderCreate(BaseModel):
    customer_id: Optional[str] = None
    customer_name: str
    phone_number: str
    whatsapp_number: Optional[str] = None
    business_name: Optional[str] = None
    order_type: str = "RETAIL"  # RETAIL / WHOLESALE
    fulfillment_type: str = "DELIVERY"  # DELIVERY / PICKUP
    delivery_address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    pin_code: Optional[str] = None
    notes: Optional[str] = None
    payment_method: Optional[str] = "WHATSAPP_CONFIRMATION"
    coupon_code: Optional[str] = None
    discount_amount: Optional[float] = 0.0
    points_redeemed: Optional[int] = 0
    points_discount: Optional[float] = 0.0
    total_estimated_amount: Optional[float] = 0.0
    total_estimated_weight_kg: Optional[float] = 0.0
    items: List[OrderItemBase]


class OrderStatusUpdate(BaseModel):
    status: str
    notes: Optional[str] = None
    changed_by: Optional[str] = "Admin"


class OrderAdminNotesUpdate(BaseModel):
    admin_notes: str


class OrderResponse(BaseModel):
    id: str
    order_number: str
    customer_name: str
    phone_number: str
    whatsapp_number: Optional[str] = None
    business_name: Optional[str] = None
    order_type: str
    fulfillment_type: Optional[str] = "DELIVERY"
    status: str
    payment_status: Optional[str] = "UNPAID"
    payment_method: Optional[str] = "WHATSAPP_CONFIRMATION"
    paid_at: Optional[datetime] = None
    customer_id: Optional[str] = None
    total_estimated_amount: float
    total_estimated_weight_kg: float
    coupon_id: Optional[str] = None
    discount_amount: Optional[float] = 0.0
    points_redeemed: Optional[int] = 0
    points_discount: Optional[float] = 0.0
    delivery_address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    pin_code: Optional[str] = None
    notes: Optional[str] = None
    admin_notes: Optional[str] = None
    inventory_deducted: Optional[bool] = False
    confirmed_at: Optional[datetime] = None
    dispatched_at: Optional[datetime] = None
    delivered_at: Optional[datetime] = None
    cancelled_at: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    items: List[OrderItemResponse] = []
    status_history: List[OrderStatusHistoryResponse] = []

    class Config:
        from_attributes = True


class WholesaleEnquiryCreate(BaseModel):
    contact_name: str
    business_name: Optional[str] = None
    phone_number: str
    email: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    expected_monthly_volume: Optional[str] = None
    message: Optional[str] = None


class WholesaleEnquiryResponse(WholesaleEnquiryCreate):
    id: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
