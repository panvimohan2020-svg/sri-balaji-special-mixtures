from typing import Optional
from pydantic import BaseModel
from datetime import datetime


class CreatePaymentOrderRequest(BaseModel):
    order_id: str
    gateway: str = "RAZORPAY"


class RazorpayOrderResponse(BaseModel):
    key_id: str
    amount: int  # in paise
    currency: str = "INR"
    razorpay_order_id: str
    order_id: str
    order_number: str
    customer_name: str
    phone_number: str
    business_name: str = "Sri Balaji Special Mixtures"


class VerifyPaymentRequest(BaseModel):
    order_id: str
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str


class OfflinePaymentConfirmRequest(BaseModel):
    order_id: str
    payment_method: str  # OFFLINE_UPI, CASH_ON_DISPATCH, BANK_NEFT
    transaction_reference: str
    notes: Optional[str] = None


class PaymentTransactionResponse(BaseModel):
    id: str
    order_id: str
    order_number: Optional[str] = None
    transaction_reference: str
    gateway: str
    gateway_payment_id: Optional[str] = None
    amount: float
    currency: str
    status: str
    payment_method: Optional[str] = None
    error_code: Optional[str] = None
    error_description: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
