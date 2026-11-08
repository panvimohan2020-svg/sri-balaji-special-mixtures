import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Numeric, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base


class PaymentTransaction(Base):
    __tablename__ = "payment_transactions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    order_id = Column(String(36), ForeignKey("orders.id", ondelete="CASCADE"), nullable=False, index=True)
    customer_id = Column(String(36), ForeignKey("customers.id", ondelete="SET NULL"), nullable=True, index=True)
    transaction_reference = Column(String(64), unique=True, index=True, nullable=False)
    gateway = Column(String(30), default="RAZORPAY")  # RAZORPAY, OFFLINE_UPI, CASH_ON_DISPATCH, BANK_NEFT
    gateway_order_id = Column(String(128), index=True, nullable=True)  # order_xxx from Razorpay
    gateway_payment_id = Column(String(128), index=True, nullable=True)  # pay_xxx from Razorpay
    gateway_signature = Column(String(255), nullable=True)
    amount = Column(Numeric(12, 2), nullable=False)
    currency = Column(String(10), default="INR")
    status = Column(String(30), default="PENDING")  # UNPAID, PENDING, PAID, FAILED, REFUND_INITIATED, REFUNDED
    payment_method = Column(String(50), nullable=True)  # UPI, CARD, NETBANKING, WALLET, COD
    error_code = Column(String(100), nullable=True)
    error_description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    order = relationship("Order", back_populates="payments")
    customer = relationship("Customer", back_populates="payments")
