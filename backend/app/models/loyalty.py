import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Numeric, Text, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base


class LoyaltyAccount(Base):
    __tablename__ = "loyalty_accounts"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    customer_id = Column(String(36), ForeignKey("customers.id", ondelete="CASCADE"), unique=True, index=True, nullable=False)
    points_balance = Column(Integer, default=0, nullable=False)
    lifetime_points_earned = Column(Integer, default=0, nullable=False)
    lifetime_points_redeemed = Column(Integer, default=0, nullable=False)
    referral_code = Column(String(32), unique=True, index=True, nullable=False)
    referred_by_id = Column(String(36), ForeignKey("customers.id", ondelete="SET NULL"), nullable=True)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    customer = relationship("Customer", foreign_keys=[customer_id], backref="loyalty_account")
    referred_by = relationship("Customer", foreign_keys=[referred_by_id])
    transactions = relationship("LoyaltyTransaction", back_populates="account", cascade="all, delete-orphan", order_by="LoyaltyTransaction.created_at.desc()")


class LoyaltyTransaction(Base):
    __tablename__ = "loyalty_transactions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    account_id = Column(String(36), ForeignKey("loyalty_accounts.id", ondelete="CASCADE"), index=True, nullable=False)
    order_id = Column(String(36), ForeignKey("orders.id", ondelete="SET NULL"), nullable=True)
    transaction_type = Column(String(32), nullable=False)  # EARN, REDEEM, REFERRAL_BONUS, ADMIN_ADJUST
    points = Column(Integer, nullable=False)
    balance_after = Column(Integer, nullable=False)
    description = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    account = relationship("LoyaltyAccount", back_populates="transactions")
    order = relationship("Order")


class NotificationPreference(Base):
    __tablename__ = "notification_preferences"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    customer_id = Column(String(36), ForeignKey("customers.id", ondelete="CASCADE"), unique=True, index=True, nullable=False)
    email_updates = Column(Boolean, default=True, nullable=False)
    sms_updates = Column(Boolean, default=True, nullable=False)
    whatsapp_updates = Column(Boolean, default=True, nullable=False)
    promotional_push = Column(Boolean, default=False, nullable=False)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    customer = relationship("Customer", backref="notification_preference")
