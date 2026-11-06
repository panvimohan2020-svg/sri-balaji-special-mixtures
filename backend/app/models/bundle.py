import uuid
from sqlalchemy import Column, String, Integer, Numeric, Boolean, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base


class Bundle(Base):
    __tablename__ = "bundles"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(150), nullable=False)
    slug = Column(String(180), nullable=False, unique=True, index=True)
    description = Column(Text, nullable=True)
    image_url = Column(String(500), nullable=True)
    bundle_price = Column(Numeric(10, 2), nullable=True)
    is_active = Column(Boolean, default=True)

    items = relationship("BundleItem", back_populates="bundle", cascade="all, delete-orphan")


class BundleItem(Base):
    __tablename__ = "bundle_items"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    bundle_id = Column(String(36), ForeignKey("bundles.id", ondelete="CASCADE"), nullable=False, index=True)
    product_id = Column(String(36), ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    variant_id = Column(String(36), ForeignKey("product_variants.id", ondelete="CASCADE"), nullable=True)
    quantity = Column(Integer, default=1)

    bundle = relationship("Bundle", back_populates="items")

