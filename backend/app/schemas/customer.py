from typing import Optional, List
from pydantic import BaseModel, Field
from datetime import datetime


class CustomerBase(BaseModel):
    phone_number: str
    full_name: str
    email: Optional[str] = None


class CustomerRegisterRequest(CustomerBase):
    password: Optional[str] = None


class CustomerLoginRequest(BaseModel):
    phone_number: str
    password: Optional[str] = None
    otp: Optional[str] = None


class CustomerOTPRequest(BaseModel):
    phone_number: str


class CustomerResponse(CustomerBase):
    id: str
    is_verified: bool
    default_address_id: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class CustomerAuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    customer: CustomerResponse


class CustomerProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[str] = None


class AddressBase(BaseModel):
    label: str = "Home"
    recipient_name: str
    phone_number: str
    address_line: str
    city: str = "Paralakhemundi"
    state: str = "Odisha"
    pin_code: str = "761200"
    is_default: bool = False


class AddressCreate(AddressBase):
    pass


class AddressUpdate(BaseModel):
    label: Optional[str] = None
    recipient_name: Optional[str] = None
    phone_number: Optional[str] = None
    address_line: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    pin_code: Optional[str] = None
    is_default: Optional[bool] = None


class AddressResponse(AddressBase):
    id: str
    customer_id: str
    created_at: datetime

    class Config:
        from_attributes = True


class NotificationResponse(BaseModel):
    id: str
    customer_id: str
    order_id: Optional[str] = None
    type: str
    title: str
    message: str
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True
