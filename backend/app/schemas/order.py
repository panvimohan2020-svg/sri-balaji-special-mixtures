from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime


class OrderItemBase(BaseModel):
    variant_id: Optional[str] = None
    product_name: str
    weight_label: str
    unit_price: float
    quantity: int = 1
    subtotal: float


class OrderItemResponse(OrderItemBase):
    id: str
    order_id: str

    class Config:
        from_attributes = True


class OrderCreate(BaseModel):
    customer_name: str
    phone_number: str
    whatsapp_number: Optional[str] = None
    business_name: Optional[str] = None
    order_type: str = "WHOLESALE"
    delivery_address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    pin_code: Optional[str] = None
    notes: Optional[str] = None
    total_estimated_amount: float
    total_estimated_weight_kg: float
    items: List[OrderItemBase]


class OrderResponse(BaseModel):
    id: str
    order_number: str
    customer_name: str
    phone_number: str
    whatsapp_number: Optional[str] = None
    business_name: Optional[str] = None
    order_type: str
    status: str
    total_estimated_amount: float
    total_estimated_weight_kg: float
    delivery_address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    pin_code: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime
    items: List[OrderItemResponse] = []

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

