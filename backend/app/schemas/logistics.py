from typing import Optional, List
from pydantic import BaseModel
from datetime import datetime


class ShipmentCreateRequest(BaseModel):
    order_id: str
    courier_partner: str = "Regional Transport / Local Van"
    tracking_number: str
    tracking_url: Optional[str] = None
    dispatch_date: Optional[datetime] = None
    estimated_delivery_date: Optional[datetime] = None
    shipping_charges: float = 0.0
    status: str = "DISPATCHED"  # AWAITING_DISPATCH, READY_FOR_PICKUP, DISPATCHED, IN_TRANSIT, OUT_FOR_DELIVERY, DELIVERED
    destination_pincode: Optional[str] = None
    recipient_name: Optional[str] = None
    recipient_phone: Optional[str] = None
    delivery_address: Optional[str] = None
    notes: Optional[str] = None


class ShipmentStatusUpdateRequest(BaseModel):
    status: str
    actual_delivery_date: Optional[datetime] = None
    notes: Optional[str] = None


class ShipmentResponse(BaseModel):
    id: str
    order_id: str
    order_number: Optional[str] = None
    courier_partner: str
    tracking_number: str
    tracking_url: Optional[str] = None
    dispatch_date: datetime
    estimated_delivery_date: Optional[datetime] = None
    actual_delivery_date: Optional[datetime] = None
    shipping_charges: float
    status: str
    destination_pincode: Optional[str] = None
    recipient_name: Optional[str] = None
    recipient_phone: Optional[str] = None
    delivery_address: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class PincodeCheckResponse(BaseModel):
    pincode: str
    is_serviceable: bool
    serviceability_status: str = "REGULAR"  # REGULAR, CUSTOM_TRANSIT, PENDING_VERIFICATION, UNAVAILABLE
    status_label: str = "Regular Delivery Available"
    city: Optional[str] = None
    district: Optional[str] = None
    state: Optional[str] = None
    zone_name: Optional[str] = None
    localities: Optional[List[str]] = []
    transport_modes: Optional[List[str]] = []
    transit_duration_label: Optional[str] = "1-2 Days"
    min_delivery_days: int = 1
    max_delivery_days: int = 3
    standard_shipping_rate: float = 0.0
    delivery_charges_text: Optional[str] = "Standard Freight"
    cod_available: bool = True
    daily_transit_available: bool = True
    delivery_conditions: Optional[str] = None
    message: str
    whatsapp_url: Optional[str] = None
    is_postal_valid: bool = True


class ServiceablePincodeItem(BaseModel):
    id: str
    pincode: str
    city: str
    district: str
    state: str
    zone_name: str
    is_active: bool
    serviceability_status: str = "REGULAR"
    localities: Optional[str] = None
    transport_modes: Optional[str] = None
    transit_duration_label: Optional[str] = "1-2 Days"
    delivery_charges_text: Optional[str] = "Standard Freight"
    delivery_conditions: Optional[str] = None
    daily_transit_available: bool = True
    min_delivery_days: int = 1
    max_delivery_days: int = 3
    standard_shipping_rate: float = 0.0
    cod_available: bool = True
    notes: Optional[str] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class PincodeCreateRequest(BaseModel):
    pincode: str
    city: str
    district: str
    state: str = "Odisha"
    zone_name: Optional[str] = "South Odisha Hub"
    is_active: bool = True
    serviceability_status: str = "REGULAR"
    localities: Optional[str] = None
    transport_modes: Optional[str] = None
    transit_duration_label: Optional[str] = "1-2 Days"
    delivery_charges_text: Optional[str] = "Standard Freight"
    delivery_conditions: Optional[str] = None
    daily_transit_available: bool = True
    min_delivery_days: int = 1
    max_delivery_days: int = 3
    standard_shipping_rate: float = 0.0
    cod_available: bool = True
    notes: Optional[str] = None


class PincodeUpdateRequest(BaseModel):
    pincode: Optional[str] = None
    city: Optional[str] = None
    district: Optional[str] = None
    state: Optional[str] = None
    zone_name: Optional[str] = None
    is_active: Optional[bool] = None
    serviceability_status: Optional[str] = None
    localities: Optional[str] = None
    transport_modes: Optional[str] = None
    transit_duration_label: Optional[str] = None
    delivery_charges_text: Optional[str] = None
    delivery_conditions: Optional[str] = None
    daily_transit_available: Optional[bool] = None
    min_delivery_days: Optional[int] = None
    max_delivery_days: Optional[int] = None
    standard_shipping_rate: Optional[float] = None
    cod_available: Optional[bool] = None
    notes: Optional[str] = None

