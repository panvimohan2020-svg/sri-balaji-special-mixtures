import uuid
from sqlalchemy import Column, String, Integer, Numeric, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base


class ProductVariant(Base):
    __tablename__ = "product_variants"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    product_id = Column(String(36), ForeignKey("products.id", ondelete="CASCADE"), nullable=False, index=True)
    weight_label = Column(String(50), nullable=False)  # '100g', '250g', '500g', '1kg', '5kg Bulk'
    weight_in_grams = Column(Integer, nullable=False, default=250)
    retail_price = Column(Numeric(10, 2), nullable=True)
    wholesale_price = Column(Numeric(10, 2), nullable=True)
    stock_quantity = Column(Integer, default=0)
    is_in_stock = Column(Boolean, default=True)
    sku = Column(String(64), unique=True, nullable=True)

    # Phase 2 Inventory Attributes
    track_inventory = Column(Boolean, default=False)
    min_stock_threshold = Column(Integer, default=5)
    is_opening_stock_set = Column(Boolean, default=False)

    product = relationship("Product", back_populates="variants")
    stock_movements = relationship("StockMovement", back_populates="variant", cascade="all, delete-orphan", order_by="StockMovement.created_at.desc()")
    low_stock_alerts = relationship("LowStockAlert", back_populates="variant", cascade="all, delete-orphan", order_by="LowStockAlert.created_at.desc()")
