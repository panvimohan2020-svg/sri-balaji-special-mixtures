import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Float, Text, DateTime, Boolean
from app.core.database import Base


class MarketingCoupon(Base):
    __tablename__ = "marketing_coupons"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    code = Column(String(50), unique=True, index=True, nullable=False)
    description = Column(String(255), nullable=False)
    discount_type = Column(String(20), nullable=False)  # PERCENTAGE, FIXED
    discount_value = Column(Float, nullable=False)
    min_order_amount = Column(Float, default=0.0, nullable=False)
    max_discount_cap = Column(Float, nullable=True)
    valid_from = Column(DateTime, nullable=False)
    valid_until = Column(DateTime, nullable=False)
    usage_limit = Column(Integer, default=100, nullable=False)
    usage_count = Column(Integer, default=0, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)


class MarketingCampaign(Base):
    __tablename__ = "marketing_campaigns"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String(100), nullable=False)
    subtitle = Column(String(255), nullable=False)
    badge_text = Column(String(50), nullable=False)
    cta_text = Column(String(50), nullable=False)
    cta_link = Column(String(100), nullable=False)
    banner_theme = Column(String(50), default="ROYAL_GOLD", nullable=False)
    image_url = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    start_date = Column(DateTime, nullable=True)
    end_date = Column(DateTime, nullable=True)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
