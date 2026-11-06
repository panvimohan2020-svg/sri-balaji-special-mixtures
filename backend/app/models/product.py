import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Boolean, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    category_id = Column(String(36), ForeignKey("categories.id", ondelete="RESTRICT"), nullable=False, index=True)
    name = Column(String(160), nullable=False, index=True)
    slug = Column(String(180), nullable=False, unique=True, index=True)
    description = Column(Text, nullable=True)
    
    # Classification & Attributes
    food_classification = Column(String(30), default="VEGETARIAN")  # VEGETARIAN / NON_VEGETARIAN
    spice_level = Column(String(30), default="MEDIUM")  # MILD, MEDIUM, SPICY, EXTRA_SPICY
    taste_profiles = Column(String(255), default="Crunchy,Traditional")  # Comma-separated or JSON string
    
    # Food Transparency (Owner verified only)
    ingredients = Column(Text, nullable=True)
    allergen_info = Column(Text, nullable=True)
    packaging_info = Column(String(255), default="Airtight food-grade pouch to retain crispness")
    
    # Wholesale & Stock
    minimum_order_qty = Column(Integer, default=1)
    is_available = Column(Boolean, default=True)
    is_featured = Column(Boolean, default=False)
    
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    category = relationship("Category", back_populates="products")
    variants = relationship("ProductVariant", back_populates="product", cascade="all, delete-orphan", order_by="ProductVariant.weight_in_grams")
    images = relationship("ProductImage", back_populates="product", cascade="all, delete-orphan", order_by="ProductImage.display_order")


class ProductImage(Base):
    __tablename__ = "product_images"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    product_id = Column(String(36), ForeignKey("products.id", ondelete="CASCADE"), nullable=False, index=True)
    image_url = Column(String(500), nullable=False)
    alt_text = Column(String(200), nullable=True)
    is_primary = Column(Boolean, default=False)
    display_order = Column(Integer, default=0)

    product = relationship("Product", back_populates="images")

