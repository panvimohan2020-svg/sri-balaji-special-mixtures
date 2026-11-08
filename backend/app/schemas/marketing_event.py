from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field


class EventLogRequest(BaseModel):
    event_type: str = Field(..., max_length=50)
    utm_source: Optional[str] = Field("direct", max_length=100)
    utm_medium: Optional[str] = Field(None, max_length=100)
    utm_campaign: Optional[str] = Field(None, max_length=100)
    utm_content: Optional[str] = Field(None, max_length=100)
    page_url: Optional[str] = Field(None, max_length=500)
    product_id: Optional[str] = None
    order_id: Optional[str] = None
    session_id: Optional[str] = None


class FunnelStep(BaseModel):
    step_name: str
    count: int
    conversion_from_prev: float


class CampaignAttribution(BaseModel):
    source: str
    campaign: Optional[str] = None
    visitors: int
    enquiries_count: int
    orders_count: int
    revenue: float


class MarketingFunnelResponse(BaseModel):
    funnel: List[FunnelStep]
    attributions: List[CampaignAttribution]
