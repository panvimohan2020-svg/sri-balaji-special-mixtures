import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Boolean, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base


class Customer(Base):
    __tablename__ = "customers"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    phone_number = Column(String(25), unique=True, index=True, nullable=False)
    email = Column(String(120), unique=True, index=True, nullable=True)
    full_name = Column(String(120), nullable=False)
    hashed_password = Column(String(255), nullable=True)
    is_verified = Column(Boolean, default=True)
    is_active = Column(Boolean, default=True)
    default_address_id = Column(String(36), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    last_login = Column(DateTime, nullable=True)

    addresses = relationship("CustomerAddress", back_populates="customer", cascade="all, delete-orphan", order_by="CustomerAddress.is_default.desc()")
    orders = relationship("Order", back_populates="customer")
    notifications = relationship("CustomerNotification", back_populates="customer", cascade="all, delete-orphan", order_by="CustomerNotification.created_at.desc()")
    payments = relationship("PaymentTransaction", back_populates="customer")
    dealer_profile = relationship("DealerProfile", back_populates="customer", uselist=False, cascade="all, delete-orphan")


class CustomerAddress(Base):
    __tablename__ = "customer_addresses"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    customer_id = Column(String(36), ForeignKey("customers.id", ondelete="CASCADE"), nullable=False, index=True)
    label = Column(String(50), default="Home")  # Home, Work, Shop, Other
    recipient_name = Column(String(120), nullable=False)
    phone_number = Column(String(25), nullable=False)
    address_line = Column(Text, nullable=False)
    city = Column(String(80), default="Paralakhemundi")
    state = Column(String(80), default="Odisha")
    pin_code = Column(String(15), default="761200")
    is_default = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    customer = relationship("Customer", back_populates="addresses")


class CustomerNotification(Base):
    __tablename__ = "customer_notifications"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    customer_id = Column(String(36), ForeignKey("customers.id", ondelete="CASCADE"), nullable=False, index=True)
    order_id = Column(String(36), ForeignKey("orders.id", ondelete="CASCADE"), nullable=True)
    type = Column(String(50), nullable=False)  # ORDER_PLACED, PAYMENT_CONFIRMED, ORDER_CONFIRMED, ORDER_DISPATCHED, ORDER_DELIVERED
    title = Column(String(150), nullable=False)
    message = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    customer = relationship("Customer", back_populates="notifications")
    order = relationship("Order")
