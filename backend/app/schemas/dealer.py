from typing import Optional
from pydantic import BaseModel
from datetime import datetime


class DealerApplyRequest(BaseModel):
    business_name: str
    business_category: str  # Kirana Store, Supermarket, Grocery Retailer, Tea/Snacks Vendor, Food Distributor, Wholesaler
    owner_name: str
    phone_number: str
    email: Optional[str] = None
    gstin: Optional[str] = None
    pan_number: Optional[str] = None
    business_address: str
    city: str = "Paralakhemundi"
    state: str = "Odisha"
    pin_code: str = "761200"
    wholesale_requirements: Optional[str] = None


class DealerStatusUpdate(BaseModel):
    status: str  # PENDING_VERIFICATION, APPROVED, REJECTED, SUSPENDED
    pricing_tier: Optional[str] = None  # STANDARD_WHOLESALE, DISTRIBUTOR, SUPERMARKET
    credit_limit: Optional[float] = None
    credit_days: Optional[int] = None
    admin_notes: Optional[str] = None


class DealerResponse(BaseModel):
    id: str
    customer_id: str
    business_name: str
    business_category: str
    owner_name: str
    phone_number: str
    email: Optional[str] = None
    gstin: Optional[str] = None
    pan_number: Optional[str] = None
    business_address: str
    city: str
    state: str
    pin_code: str
    status: str
    pricing_tier: str
    wholesale_requirements: Optional[str] = None
    credit_limit: float
    credit_days: int
    admin_notes: Optional[str] = None
    verified_at: Optional[datetime] = None
    verified_by: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
