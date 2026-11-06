import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Numeric, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base


class Order(Base):
    __tablename__ = "orders"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    order_number = Column(String(32), unique=True, index=True, nullable=False)
    customer_name = Column(String(120), nullable=False)
    phone_number = Column(String(25), nullable=False)
    whatsapp_number = Column(String(25), nullable=True)
    business_name = Column(String(150), nullable=True)  # Kirana, Supermarket, Distributor
    order_type = Column(String(20), default="WHOLESALE")  # WHOLESALE / RETAIL
    status = Column(String(30), default="ENQUIRY")  # ENQUIRY, WHATSAPP_INITIATED, CONTACTED, CONFIRMED, DISPATCHED, COMPLETED, CANCELLED
    total_estimated_amount = Column(Numeric(12, 2), default=0.00)
    total_estimated_weight_kg = Column(Numeric(8, 2), default=0.00)
    
    delivery_address = Column(Text, nullable=True)
    city = Column(String(80), nullable=True)
    state = Column(String(80), nullable=True)
    pin_code = Column(String(15), nullable=True)
    notes = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    order_id = Column(String(36), ForeignKey("orders.id", ondelete="CASCADE"), nullable=False, index=True)
    variant_id = Column(String(36), ForeignKey("product_variants.id", ondelete="SET NULL"), nullable=True)
    product_name = Column(String(160), nullable=False)
    weight_label = Column(String(50), nullable=False)
    unit_price = Column(Numeric(10, 2), nullable=False, default=0.00)
    quantity = Column(Integer, nullable=False, default=1)
    subtotal = Column(Numeric(12, 2), nullable=False, default=0.00)

    order = relationship("Order", back_populates="items")


class WholesaleEnquiry(Base):
    __tablename__ = "wholesale_enquiries"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    contact_name = Column(String(120), nullable=False)
    business_name = Column(String(150), nullable=True)
    phone_number = Column(String(25), nullable=False)
    email = Column(String(120), nullable=True)
    city = Column(String(80), nullable=True)
    state = Column(String(80), nullable=True)
    expected_monthly_volume = Column(String(100), nullable=True)  # e.g., "50kg - 100kg", "500kg+"
    message = Column(Text, nullable=True)
    status = Column(String(30), default="NEW")  # NEW, CONTACTED, QUOTED, CONVERTED, CLOSED
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

