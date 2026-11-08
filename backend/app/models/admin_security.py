import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Boolean, DateTime, Integer, Float, Text
from app.core.database import Base


class AdminInvitation(Base):
    __tablename__ = "admin_invitations"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String(120), index=True, nullable=False)
    role = Column(String(30), nullable=False, default="ORDER_MANAGER")  # SUPERADMIN, PRODUCT_MANAGER, ORDER_MANAGER, INVENTORY_MANAGER, CUSTOMER_SUPPORT
    token = Column(String(100), unique=True, index=True, nullable=False)
    invited_by = Column(String(120), nullable=False)
    is_accepted = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    expires_at = Column(DateTime, nullable=False)


class PasswordReset(Base):
    __tablename__ = "password_resets"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), index=True, nullable=False)
    email = Column(String(120), index=True, nullable=False)
    token = Column(String(100), unique=True, index=True, nullable=False)
    is_used = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    expires_at = Column(DateTime, nullable=False)


class PasskeyCredential(Base):
    __tablename__ = "passkey_credentials"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), index=True, nullable=False)
    credential_id = Column(String(255), unique=True, index=True, nullable=False)
    public_key = Column(Text, nullable=False)  # Public key only! Biometrics stay exclusively on device enclave
    sign_count = Column(Integer, default=0)
    device_name = Column(String(120), default="Device Biometrics / Passkey")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    last_used_at = Column(DateTime, nullable=True)


class PasskeyChallenge(Base):
    __tablename__ = "passkey_challenges"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    challenge = Column(String(255), unique=True, nullable=False)
    user_id = Column(String(36), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    expires_at = Column(DateTime, nullable=False)


class AdminAuditLog(Base):
    __tablename__ = "admin_audit_logs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    admin_email = Column(String(120), index=True, nullable=False)
    action = Column(String(100), nullable=False)  # e.g., AUTH_LOGIN, PRODUCT_UPDATE, PRICE_CHANGE, ORDER_UPDATE, STOCK_ADJUST
    entity = Column(String(60), nullable=False)   # Product, Variant, Order, Stock, User, Review, Settings
    entity_id = Column(String(100), nullable=True)
    details = Column(Text, nullable=True)
    ip_address = Column(String(60), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class PriceHistory(Base):
    __tablename__ = "price_history"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    product_id = Column(String(36), index=True, nullable=False)
    variant_id = Column(String(36), index=True, nullable=False)
    variant_weight = Column(String(50), nullable=True)
    old_retail_price = Column(Float, nullable=False)
    new_retail_price = Column(Float, nullable=False)
    old_wholesale_price = Column(Float, nullable=True)
    new_wholesale_price = Column(Float, nullable=True)
    changed_by = Column(String(120), nullable=False)
    reason = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class RevokedToken(Base):
    __tablename__ = "revoked_tokens"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    token = Column(String(500), unique=True, index=True, nullable=False)
    revoked_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    expires_at = Column(DateTime, nullable=False)


class OwnerSetupState(Base):
    __tablename__ = "owner_setup_state"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    owner_email = Column(String(120), nullable=False)
    activation_token = Column(String(100), unique=True, index=True, nullable=False)
    is_activated = Column(Boolean, default=False)
    activated_at = Column(DateTime, nullable=True)
    activated_by_name = Column(String(120), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    expires_at = Column(DateTime, nullable=False)


class OwnerInvitation(Base):
    """
    Cryptographic Owner Invitation for Business Owner Handover.
    Stores ONLY SHA-256 hash of the one-time token in the database.
    Supports individual accounts for both Sri Adari Krishna Rao and Sri Adari Dilleshwar Rao.
    Single-use with strict 72-hour expiration window.
    """
    __tablename__ = "owner_invitations"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    owner_name = Column(String(120), nullable=False)
    owner_email = Column(String(120), index=True, nullable=False)
    token_hash = Column(String(64), unique=True, index=True, nullable=False)
    is_used = Column(Boolean, default=False)
    used_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    expires_at = Column(DateTime, nullable=False)



