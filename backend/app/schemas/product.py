from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime


class VariantBase(BaseModel):
    weight_label: str
    weight_in_grams: int = 250
    retail_price: Optional[float] = None
    wholesale_price: Optional[float] = None
    stock_quantity: int = 100
    is_in_stock: bool = True
    sku: Optional[str] = None


class VariantCreate(VariantBase):
    pass


class VariantUpdate(BaseModel):
    weight_label: Optional[str] = None
    weight_in_grams: Optional[int] = None
    retail_price: Optional[float] = None
    wholesale_price: Optional[float] = None
    stock_quantity: Optional[int] = None
    is_in_stock: Optional[bool] = None
    sku: Optional[str] = None


class VariantResponse(VariantBase):
    id: str
    product_id: str

    class Config:
        from_attributes = True


class ProductImageBase(BaseModel):
    image_url: str
    alt_text: Optional[str] = None
    is_primary: bool = False
    display_order: int = 0


class ProductImageResponse(ProductImageBase):
    id: str
    product_id: str

    class Config:
        from_attributes = True


class ProductBase(BaseModel):
    category_id: str
    name: str
    slug: str
    description: Optional[str] = None
    food_classification: str = "VEGETARIAN"
    spice_level: str = "MEDIUM"
    taste_profiles: str = "Crunchy,Traditional"
    ingredients: Optional[str] = None
    allergen_info: Optional[str] = None
    packaging_info: Optional[str] = "Airtight moisture-barrier food-grade pouch"
    minimum_order_qty: int = 1
    is_available: bool = True
    is_featured: bool = False


class ProductCreate(ProductBase):
    variants: List[VariantCreate] = []
    images: List[ProductImageBase] = []


class ProductUpdate(BaseModel):
    category_id: Optional[str] = None
    name: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    food_classification: Optional[str] = None
    spice_level: Optional[str] = None
    taste_profiles: Optional[str] = None
    ingredients: Optional[str] = None
    allergen_info: Optional[str] = None
    packaging_info: Optional[str] = None
    minimum_order_qty: Optional[int] = None
    is_available: Optional[bool] = None
    is_featured: Optional[bool] = None


class ProductResponse(ProductBase):
    id: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    variants: List[VariantResponse] = []
    images: List[ProductImageResponse] = []

    class Config:
        from_attributes = True

