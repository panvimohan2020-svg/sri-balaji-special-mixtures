from typing import Optional, List
from pydantic import BaseModel


class ProductRecommendationItem(BaseModel):
    id: str
    name: str
    category: str
    price: float
    weight_label: str
    description: str
    image_url: Optional[str] = None
    spice_level: Optional[str] = "Medium"
    pairing_notes: Optional[str] = None


class AIChatRequest(BaseModel):
    message: str
    language: Optional[str] = "en"  # en, hi, te, or
    session_id: Optional[str] = None


class AIChatResponse(BaseModel):
    reply: str
    language: str
    recommendations: List[ProductRecommendationItem] = []
    quick_suggestions: List[str] = []
    contact_action: Optional[str] = None
