from typing import Optional, Dict
from datetime import datetime
from pydantic import BaseModel, Field


class FeedbackSubmitRequest(BaseModel):
    author_name: str = Field(..., min_length=2, max_length=100)
    city: Optional[str] = Field(None, max_length=100)
    phone: Optional[str] = Field(None, max_length=20)
    rating: int = Field(..., ge=1, le=5)
    title: str = Field(..., min_length=3, max_length=150)
    comment: str = Field(..., min_length=10, max_length=1000)
    category: Optional[str] = Field("GENERAL", max_length=50)
    order_number: Optional[str] = None
    product_id: Optional[str] = None
    photo_url: Optional[str] = None


class FeedbackResponse(BaseModel):
    id: str
    author_name: str
    city: Optional[str] = None
    rating: int
    title: str
    comment: str
    category: str
    product_id: Optional[str] = None
    product_name: Optional[str] = None
    is_verified_purchase: bool
    photo_url: Optional[str] = None
    helpful_count: int
    created_at: datetime

    class Config:
        from_attributes = True


class FeedbackStatsResponse(BaseModel):
    average_rating: float
    total_reviews: int
    distribution: Dict[int, int]
