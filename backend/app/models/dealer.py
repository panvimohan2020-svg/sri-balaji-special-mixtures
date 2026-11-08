import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Numeric, Integer, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base


class DealerProfile(Base):
    __tablename__ = "dealer_profiles"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    customer_id = Column(String(36), ForeignKey("customers.id", ondelete="CASCADE"), nullable=False, index=True)
    business_name = Column(String(150), nullable=False)
    business_category = Column(String(80), nullable=False)  # Kirana Store, Supermarket, Grocery Retailer, Tea/Snacks Vendor, Food Distributor, Wholesaler
    owner_name = Column(String(120), nullable=False)
    phone_number = Column(String(25), nullable=False, index=True)
    email = Column(String(120), nullable=True)
    gstin = Column(String(25), nullable=True)
    pan_number = Column(String(20), nullable=True)
    business_address = Column(Text, nullable=False)
    city = Column(String(80), default="Paralakhemundi")
    state = Column(String(80), default="Odisha")
    pin_code = Column(String(15), default="761200")
    status = Column(String(30), default="PENDING_VERIFICATION", index=True)  # PENDING_VERIFICATION, APPROVED, REJECTED, SUSPENDED
    pricing_tier = Column(String(40), default="STANDARD_WHOLESALE")  # STANDARD_WHOLESALE, DISTRIBUTOR, SUPERMARKET
    wholesale_requirements = Column(Text, nullable=True)
    credit_limit = Column(Numeric(12, 2), default=0.00)
    credit_days = Column(Integer, default=0)
    admin_notes = Column(Text, nullable=True)
    verified_at = Column(DateTime, nullable=True)
    verified_by = Column(String(120), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    customer = relationship("Customer", back_populates="dealer_profile")
    orders = relationship("Order", back_populates="dealer")
    quotations = relationship("WholesaleQuotation", back_populates="dealer")
