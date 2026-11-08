from typing import Optional
from pydantic import BaseModel
from datetime import datetime


class StockMovementBase(BaseModel):
    variant_id: str
    movement_type: str  # OPENING_STOCK, PURCHASE_INWARD, ORDER_CONFIRMATION, ORDER_CANCELLATION_RESTORE, DAMAGE_DISCARD, MANUAL_ADJUSTMENT
    quantity_change: int
    notes: Optional[str] = None
    reference_id: Optional[str] = None


class StockMovementResponse(BaseModel):
    id: str
    variant_id: str
    movement_type: str
    quantity_change: int
    previous_stock: int
    new_stock: int
    reference_id: Optional[str] = None
    notes: Optional[str] = None
    created_by: str
    created_at: datetime

    class Config:
        from_attributes = True


class StockAdjustmentRequest(BaseModel):
    movement_type: str  # OPENING_STOCK, PURCHASE_INWARD, DAMAGE_DISCARD, MANUAL_ADJUSTMENT
    quantity: int  # Positive integer representing the quantity to add, deduct, or set
    notes: Optional[str] = None
    reference_id: Optional[str] = None


class InventoryConfigUpdate(BaseModel):
    track_inventory: bool
    min_stock_threshold: int = 5


class LowStockAlertResponse(BaseModel):
    id: str
    variant_id: str
    product_name: str
    weight_label: str
    current_quantity: int
    threshold: int
    is_acknowledged: bool
    acknowledged_at: Optional[datetime] = None
    acknowledged_by: Optional[str] = None
    is_resolved: bool
    resolved_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True
