from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel


class CouponValidateRequest(BaseModel):
    code: str
    cart_amount: float
    order_type: Optional[str] = "RETAIL"


class CouponValidateResponse(BaseModel):
    is_valid: bool
    coupon_code: str
    discount_amount: float
    final_cart_amount: float
    message: str
    discount_type: Optional[str] = None
    discount_value: Optional[float] = None


class CouponCreateRequest(BaseModel):
    code: str
    description: str
    discount_type: str  # PERCENTAGE, FIXED
    discount_value: float
    min_order_amount: float = 0.0
    max_discount_cap: Optional[float] = None
    valid_from: Optional[datetime] = None
    valid_until: Optional[datetime] = None
    usage_limit: int = 100
    is_active: bool = True


class CouponResponse(BaseModel):
    id: str
    code: str
    description: str
    discount_type: str
    discount_value: float
    min_order_amount: float
    max_discount_cap: Optional[float]
    valid_from: datetime
    valid_until: datetime
    usage_limit: int
    usage_count: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class CampaignCreateRequest(BaseModel):
    title: str
    subtitle: str
    badge_text: str
    cta_text: str
    cta_link: str
    banner_theme: str = "ROYAL_GOLD"
    image_url: Optional[str] = None
    is_active: bool = True
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None


class CampaignResponse(BaseModel):
    id: str
    title: str
    subtitle: str
    badge_text: str
    cta_text: str
    cta_link: str
    banner_theme: str
    image_url: Optional[str]
    is_active: bool
    start_date: Optional[datetime]
    end_date: Optional[datetime]
    created_at: datetime

    class Config:
        from_attributes = True
