from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel


class LoyaltyTransactionResponse(BaseModel):
    id: str
    transaction_type: str
    points: int
    balance_after: int
    description: str
    created_at: datetime

    class Config:
        from_attributes = True


class LoyaltyAccountResponse(BaseModel):
    id: str
    customer_id: str
    points_balance: int
    lifetime_points_earned: int
    lifetime_points_redeemed: int
    referral_code: str
    referral_link: str
    recent_transactions: List[LoyaltyTransactionResponse] = []

    class Config:
        from_attributes = True


class RedeemEstimateRequest(BaseModel):
    cart_amount: float
    points_to_redeem: int


class RedeemEstimateResponse(BaseModel):
    points_to_redeem: int
    points_discount: float
    max_redeemable_points: int
    final_cart_amount: float
    points_balance_remaining: int


class NotificationPreferenceUpdate(BaseModel):
    email_updates: Optional[bool] = None
    sms_updates: Optional[bool] = None
    whatsapp_updates: Optional[bool] = None
    promotional_push: Optional[bool] = None


class NotificationPreferenceResponse(BaseModel):
    customer_id: str
    email_updates: bool
    sms_updates: bool
    whatsapp_updates: bool
    promotional_push: bool

    class Config:
        from_attributes = True
