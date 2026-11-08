import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Numeric, Text, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base


class Order(Base):
    __tablename__ = "orders"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    order_number = Column(String(32), unique=True, index=True, nullable=False)
    customer_id = Column(String(36), ForeignKey("customers.id", ondelete="SET NULL"), nullable=True, index=True)
    dealer_id = Column(String(36), ForeignKey("dealer_profiles.id", ondelete="SET NULL"), nullable=True, index=True)
    quotation_id = Column(String(36), ForeignKey("wholesale_quotations.id", ondelete="SET NULL"), nullable=True, index=True)
    customer_name = Column(String(120), nullable=False)
    phone_number = Column(String(25), nullable=False)
    whatsapp_number = Column(String(25), nullable=True)
    business_name = Column(String(150), nullable=True)  # Kirana, Supermarket, Distributor
    order_type = Column(String(20), default="RETAIL")  # WHOLESALE / RETAIL
    fulfillment_type = Column(String(30), default="DELIVERY")  # DELIVERY / PICKUP
    status = Column(String(30), default="NEW ENQUIRY")  # NEW ENQUIRY, CONTACTED, CONFIRMED, PREPARING, READY FOR PICKUP / DISPATCHED, DELIVERED, CANCELLED, REJECTED
    payment_status = Column(String(30), default="UNPAID")  # UNPAID, PENDING, PAID, FAILED, REFUND_INITIATED, REFUNDED
    payment_method = Column(String(50), default="WHATSAPP_CONFIRMATION")
    paid_at = Column(DateTime, nullable=True)
    total_estimated_amount = Column(Numeric(12, 2), default=0.00)
    total_estimated_weight_kg = Column(Numeric(8, 2), default=0.00)
    
    coupon_id = Column(String(50), nullable=True)
    discount_amount = Column(Numeric(10, 2), default=0.00)
    points_redeemed = Column(Integer, default=0)
    points_discount = Column(Numeric(10, 2), default=0.00)
    
    delivery_address = Column(Text, nullable=True)
    city = Column(String(80), nullable=True)
    state = Column(String(80), nullable=True)
    pin_code = Column(String(15), nullable=True)
    notes = Column(Text, nullable=True)
    admin_notes = Column(Text, nullable=True)

    inventory_deducted = Column(Boolean, default=False)
    confirmed_at = Column(DateTime, nullable=True)
    dispatched_at = Column(DateTime, nullable=True)
    delivered_at = Column(DateTime, nullable=True)
    cancelled_at = Column(DateTime, nullable=True)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    customer = relationship("Customer", back_populates="orders")
    dealer = relationship("DealerProfile", back_populates="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
    status_history = relationship("OrderStatusHistory", back_populates="order", cascade="all, delete-orphan", order_by="OrderStatusHistory.created_at.desc()")
    payments = relationship("PaymentTransaction", back_populates="order", cascade="all, delete-orphan", order_by="PaymentTransaction.created_at.desc()")
    shipment = relationship("ShipmentRecord", back_populates="order", uselist=False, cascade="all, delete-orphan")


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


class OrderStatusHistory(Base):
    __tablename__ = "order_status_history"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    order_id = Column(String(36), ForeignKey("orders.id", ondelete="CASCADE"), nullable=False, index=True)
    from_status = Column(String(30), nullable=True)
    to_status = Column(String(30), nullable=False)
    notes = Column(Text, nullable=True)
    changed_by = Column(String(120), default="Admin")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    order = relationship("Order", back_populates="status_history")


class WholesaleEnquiry(Base):
    __tablename__ = "wholesale_enquiries"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    contact_name = Column(String(120), nullable=False)
    business_name = Column(String(150), nullable=True)
    phone_number = Column(String(25), nullable=False)
    email = Column(String(120), nullable=True)
    city = Column(String(80), nullable=True)
    state = Column(String(80), nullable=True)
    expected_monthly_volume = Column(String(100), nullable=True)
    message = Column(Text, nullable=True)
    status = Column(String(30), default="NEW")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
