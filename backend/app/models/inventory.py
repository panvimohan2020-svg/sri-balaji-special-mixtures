import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Boolean, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base


class StockMovement(Base):
    __tablename__ = "stock_movements"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    variant_id = Column(String(36), ForeignKey("product_variants.id", ondelete="CASCADE"), nullable=False, index=True)
    movement_type = Column(String(40), nullable=False)  # OPENING_STOCK, PURCHASE_INWARD, ORDER_CONFIRMATION, ORDER_CANCELLATION_RESTORE, DAMAGE_DISCARD, MANUAL_ADJUSTMENT
    quantity_change = Column(Integer, nullable=False)  # Can be positive or negative
    previous_stock = Column(Integer, nullable=False)
    new_stock = Column(Integer, nullable=False)
    reference_id = Column(String(64), nullable=True)  # Order number, Invoice number, or Adjustment reason
    notes = Column(Text, nullable=True)
    created_by = Column(String(120), default="Admin")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    variant = relationship("ProductVariant", back_populates="stock_movements")


class LowStockAlert(Base):
    __tablename__ = "low_stock_alerts"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    variant_id = Column(String(36), ForeignKey("product_variants.id", ondelete="CASCADE"), nullable=False, index=True)
    current_quantity = Column(Integer, nullable=False)
    threshold = Column(Integer, nullable=False)
    is_acknowledged = Column(Boolean, default=False)
    acknowledged_at = Column(DateTime, nullable=True)
    acknowledged_by = Column(String(120), nullable=True)
    is_resolved = Column(Boolean, default=False)
    resolved_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    variant = relationship("ProductVariant", back_populates="low_stock_alerts")
