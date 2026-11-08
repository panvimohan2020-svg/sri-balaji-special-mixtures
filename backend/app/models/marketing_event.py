import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, Index

from app.core.database import Base


class MarketingEvent(Base):
    __tablename__ = "marketing_events"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    
    # Event Types: PAGE_VIEW, PRODUCT_VIEW, ADD_TO_CART, CHECKOUT_START, WHATSAPP_ENQUIRY, ORDER_COMPLETED
    event_type = Column(String(50), nullable=False, index=True)
    
    # Attribution
    utm_source = Column(String(100), nullable=True, default="direct", index=True)
    utm_medium = Column(String(100), nullable=True)
    utm_campaign = Column(String(100), nullable=True, index=True)
    utm_content = Column(String(100), nullable=True)
    
    page_url = Column(String(500), nullable=True)
    product_id = Column(String(36), nullable=True, index=True)
    order_id = Column(String(36), nullable=True, index=True)
    anonymous_session_id = Column(String(64), nullable=True, index=True)
    
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)


Index("idx_marketing_source_event", MarketingEvent.utm_source, MarketingEvent.event_type)
