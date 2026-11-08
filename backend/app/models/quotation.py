import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Numeric, Integer, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base


class WholesaleQuotation(Base):
    __tablename__ = "wholesale_quotations"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    quote_number = Column(String(32), unique=True, index=True, nullable=False)
    dealer_id = Column(String(36), ForeignKey("dealer_profiles.id", ondelete="SET NULL"), nullable=True, index=True)
    customer_id = Column(String(36), ForeignKey("customers.id", ondelete="SET NULL"), nullable=True)
    recipient_name = Column(String(120), nullable=False)
    business_name = Column(String(150), nullable=True)
    phone_number = Column(String(25), nullable=False)
    email = Column(String(120), nullable=True)
    delivery_address = Column(Text, nullable=True)
    city = Column(String(80), default="Paralakhemundi")
    state = Column(String(80), default="Odisha")
    pin_code = Column(String(15), default="761200")
    status = Column(String(30), default="DRAFT")  # DRAFT, SENT, ACCEPTED, CONVERTED, EXPIRED, CANCELLED
    subtotal = Column(Numeric(12, 2), default=0.00)
    delivery_charges = Column(Numeric(10, 2), default=0.00)
    total_amount = Column(Numeric(12, 2), default=0.00)
    total_weight_kg = Column(Numeric(8, 2), default=0.00)
    valid_until = Column(DateTime, nullable=False)
    terms_and_conditions = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)
    converted_order_id = Column(String(36), ForeignKey("orders.id", ondelete="SET NULL"), nullable=True)
    created_by = Column(String(120), default="Admin")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    dealer = relationship("DealerProfile", back_populates="quotations")
    items = relationship("QuotationItem", back_populates="quotation", cascade="all, delete-orphan")
    converted_order = relationship("Order", foreign_keys=[converted_order_id])


class QuotationItem(Base):
    __tablename__ = "quotation_items"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    quotation_id = Column(String(36), ForeignKey("wholesale_quotations.id", ondelete="CASCADE"), nullable=False, index=True)
    variant_id = Column(String(36), ForeignKey("product_variants.id", ondelete="SET NULL"), nullable=True)
    product_name = Column(String(160), nullable=False)
    weight_label = Column(String(50), nullable=False)
    unit_price = Column(Numeric(10, 2), nullable=False, default=0.00)
    quantity = Column(Integer, nullable=False, default=1)
    subtotal = Column(Numeric(12, 2), nullable=False, default=0.00)

    quotation = relationship("WholesaleQuotation", back_populates="items")
    variant = relationship("ProductVariant")
