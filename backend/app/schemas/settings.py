from typing import Optional
from pydantic import BaseModel
from datetime import datetime


class BusinessSettingBase(BaseModel):
    key: str
    value: str
    description: Optional[str] = None


class BusinessSettingResponse(BusinessSettingBase):
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class UserBase(BaseModel):
    email: str
    full_name: Optional[str] = None
    role: str = "SUPERADMIN"
    is_active: bool = True


class UserLogin(BaseModel):
    email: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None

