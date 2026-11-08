import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from app.core.database import Base


class CustomerFeedback(Base):
    __tablename__ = "customer_feedback"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    order_id = Column(String(36), ForeignKey("orders.id"), nullable=True, index=True)
    order_number = Column(String(50), nullable=True, index=True)
    customer_id = Column(String(36), ForeignKey("customers.id"), nullable=True, index=True)
    customer_name = Column(String(100), nullable=False)
    customer_phone = Column(String(20), nullable=True)
    customer_city = Column(String(100), nullable=True)
    product_id = Column(String(36), ForeignKey("products.id"), nullable=True, index=True)
    product_name = Column(String(150), nullable=True)
    
    # Categories: PRODUCT_QUALITY, PACKAGING, TASTE, WEBSITE_EXPERIENCE, DELIVERY, GENERAL
    category = Column(String(50), default="GENERAL", index=True)
    rating = Column(Integer, nullable=False)  # 1 to 5
    title = Column(String(150), nullable=False)
    comment = Column(Text, nullable=False)
    photo_url = Column(String(500), nullable=True)
    
    is_verified_purchase = Column(Boolean, default=False, index=True)
    is_approved = Column(Boolean, default=True, index=True)
    helpful_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)

    # Relationships
    order = relationship("Order", backref="feedback", lazy="joined")
    customer = relationship("Customer", backref="feedback_list", lazy="joined")
    product = relationship("Product", backref="reviews", lazy="joined")
