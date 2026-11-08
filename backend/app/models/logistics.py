import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Numeric, Integer, Boolean, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base


class ShipmentRecord(Base):
    __tablename__ = "shipment_records"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    order_id = Column(String(36), ForeignKey("orders.id", ondelete="CASCADE"), unique=True, index=True, nullable=False)
    courier_partner = Column(String(100), default="Regional Transport / Local Van")  # Regional Transport, DTDC, Delhivery, Local Van, Counter Pickup
    tracking_number = Column(String(100), index=True, nullable=False)  # AWB / Consignment / LR Number
    tracking_url = Column(String(500), nullable=True)
    dispatch_date = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    estimated_delivery_date = Column(DateTime, nullable=True)
    actual_delivery_date = Column(DateTime, nullable=True)
    shipping_charges = Column(Numeric(10, 2), default=0.00)
    status = Column(String(40), default="DISPATCHED")  # AWAITING_DISPATCH, READY_FOR_PICKUP, DISPATCHED, IN_TRANSIT, OUT_FOR_DELIVERY, DELIVERED, DELIVERY_FAILED, RETURNED
    destination_pincode = Column(String(15), nullable=True)
    recipient_name = Column(String(120), nullable=True)
    recipient_phone = Column(String(25), nullable=True)
    delivery_address = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    order = relationship("Order", back_populates="shipment")


class ServiceablePincode(Base):
    __tablename__ = "serviceable_pincodes"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    pincode = Column(String(15), unique=True, index=True, nullable=False)
    city = Column(String(80), nullable=False)
    district = Column(String(80), nullable=False)
    state = Column(String(80), default="Odisha")
    zone_name = Column(String(80), default="South Odisha Hub")
    is_active = Column(Boolean, default=True)
    min_delivery_days = Column(Integer, default=1)
    max_delivery_days = Column(Integer, default=3)
    standard_shipping_rate = Column(Numeric(8, 2), default=0.00)
    cod_available = Column(Boolean, default=True)

    # Expanded Regional Road Transport & Serviceability fields
    serviceability_status = Column(String(40), default="REGULAR")  # REGULAR, CUSTOM_TRANSIT, PENDING_VERIFICATION, UNAVAILABLE
    localities = Column(Text, nullable=True)  # Comma-separated list of villages, mandals, sub-areas
    transport_modes = Column(Text, nullable=True)  # JSON or comma-separated list: State Roadlines, Bus Cargo, Regional Carrier Tempo, Indian Post, Private Transport Agencies
    transit_duration_label = Column(String(80), default="1-2 Days")
    delivery_charges_text = Column(String(120), default="Standard Freight")
    delivery_conditions = Column(Text, nullable=True)
    daily_transit_available = Column(Boolean, default=True)
    notes = Column(Text, nullable=True)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
