from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime


class QuotationItemBase(BaseModel):
    variant_id: Optional[str] = None
    product_name: str
    weight_label: str
    unit_price: float
    quantity: int = 1
    subtotal: Optional[float] = None


class QuotationItemResponse(QuotationItemBase):
    id: str
    quotation_id: str
    subtotal: float

    class Config:
        from_attributes = True


class QuotationCreateRequest(BaseModel):
    dealer_id: Optional[str] = None
    customer_id: Optional[str] = None
    recipient_name: str
    business_name: Optional[str] = None
    phone_number: str
    email: Optional[str] = None
    delivery_address: Optional[str] = None
    city: str = "Paralakhemundi"
    state: str = "Odisha"
    pin_code: str = "761200"
    delivery_charges: float = 0.0
    valid_days: int = 15
    terms_and_conditions: Optional[str] = "1. Quotation valid for 15 days from issue date.\n2. Goods dispatched from Gandhi School Road, Paralakhemundi.\n3. Cash on Dispatch or UPI confirmation before dispatch."
    notes: Optional[str] = None
    items: List[QuotationItemBase]


class QuotationResponse(BaseModel):
    id: str
    quote_number: str
    dealer_id: Optional[str] = None
    customer_id: Optional[str] = None
    recipient_name: str
    business_name: Optional[str] = None
    phone_number: str
    email: Optional[str] = None
    delivery_address: Optional[str] = None
    city: str
    state: str
    pin_code: str
    status: str
    subtotal: float
    delivery_charges: float
    total_amount: float
    total_weight_kg: float
    valid_until: datetime
    terms_and_conditions: Optional[str] = None
    notes: Optional[str] = None
    converted_order_id: Optional[str] = None
    created_by: str
    created_at: datetime
    updated_at: datetime
    items: List[QuotationItemResponse] = []

    class Config:
        from_attributes = True
