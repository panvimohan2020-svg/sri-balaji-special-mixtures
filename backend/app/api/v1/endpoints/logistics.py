import csv
import io
import json
import re
import urllib.parse
from datetime import datetime, timezone
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status, Query, UploadFile, File
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import desc, or_, func

from app.core.database import get_db
from app.models.logistics import ShipmentRecord, ServiceablePincode
from app.models.order import Order, OrderStatusHistory
from app.models.user import User
from app.schemas.logistics import (
    ShipmentCreateRequest, 
    ShipmentStatusUpdateRequest, 
    ShipmentResponse, 
    PincodeCheckResponse,
    ServiceablePincodeItem,
    PincodeCreateRequest,
    PincodeUpdateRequest
)
from app.api.v1.endpoints.auth import (
    get_current_user,
    require_roles,
    ROLE_SUPERADMIN,
    ROLE_ORDER_MANAGER,
    ROLE_INVENTORY_MANAGER
)

router = APIRouter()

WHATSAPP_DESK_NUMBER = "919861789602"

STATUS_LABELS = {
    "REGULAR": "Regular Delivery Available",
    "CUSTOM_TRANSIT": "Custom Transit Available",
    "PENDING_VERIFICATION": "Serviceability Pending",
    "UNAVAILABLE": "Currently Unavailable"
}

DEFAULT_TRANSPORT_MODES = [
    "State Roadlines",
    "Bus Cargo",
    "Regional Carrier Tempo",
    "Indian Post",
    "Private Transport Agencies"
]


def parse_list(val: Optional[str]) -> List[str]:
    """Parse comma-separated or JSON list of strings."""
    if not val:
        return []
    val = val.strip()
    if val.startswith("[") and val.endswith("]"):
        try:
            parsed = json.loads(val)
            if isinstance(parsed, list):
                return [str(x).strip() for x in parsed if str(x).strip()]
        except Exception:
            pass
    return [x.strip() for x in val.split(",") if x.strip()]


def generate_whatsapp_transit_link(
    pincode: str,
    city: Optional[str] = None,
    district: Optional[str] = None,
    state: Optional[str] = None,
    status_code: str = "CUSTOM_TRANSIT"
) -> str:
    """Generate pre-filled WhatsApp enquiry link for wholesale / transit desk."""
    status_label = STATUS_LABELS.get(status_code, "Custom Transit")
    loc_str = city or "N/A"
    dist_str = f"{district or ''}, {state or ''}".strip(", ") or "N/A"

    msg = (
        f"🚚 *REGIONAL ROAD TRANSPORT & TRANSIT ENQUIRY – SRI BALAJI*\n"
        f"━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
        f"📍 *PIN Code:* {pincode}\n"
        f"🏘️ *Village / Town:* {loc_str}\n"
        f"🗺️ *District / State:* {dist_str}\n"
        f"🏷️ *Coverage Status:* {status_label}\n"
        f"━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n"
        f"Namaste Sri Balaji Team, I would like to check transit arrangements, freight charges, and bulk dispatch schedules for my location."
    )
    return f"https://wa.me/{WHATSAPP_DESK_NUMBER}?text={urllib.parse.quote(msg)}"


@router.get("/pincode/{pincode}", response_model=PincodeCheckResponse)
def check_pincode_serviceability(pincode: str, db: Session = Depends(get_db)):
    """
    Public Endpoint: Checks if a customer/dealer PIN code is serviceable by Sri Balaji.
    Classifies into 4 categories:
      - REGULAR: Supported scheduled road transport.
      - CUSTOM_TRANSIT: Requires special transport arrangements.
      - PENDING_VERIFICATION: Coverage needs business verification.
      - UNAVAILABLE: No confirmed delivery arrangement.
    Distinguishes postal validity from actual Sri Balaji delivery coverage.
    Preserves Gunupur PIN 765022 as CUSTOM_TRANSIT.
    """
    clean_pin = pincode.strip()

    # Postal format validation
    is_valid_format = bool(re.match(r"^[1-9][0-9]{5}$", clean_pin))
    if not is_valid_format:
        return {
            "pincode": clean_pin,
            "is_serviceable": False,
            "serviceability_status": "UNAVAILABLE",
            "status_label": STATUS_LABELS["UNAVAILABLE"],
            "city": None,
            "district": None,
            "state": None,
            "zone_name": None,
            "localities": [],
            "transport_modes": [],
            "transit_duration_label": None,
            "min_delivery_days": 0,
            "max_delivery_days": 0,
            "standard_shipping_rate": 0.0,
            "delivery_charges_text": "N/A",
            "cod_available": False,
            "daily_transit_available": False,
            "delivery_conditions": None,
            "message": "Invalid PIN code format. Please enter a valid 6-digit Indian postal PIN code.",
            "whatsapp_url": generate_whatsapp_transit_link(clean_pin, status_code="UNAVAILABLE"),
            "is_postal_valid": False
        }

    # Query database for exact registered record
    record = db.query(ServiceablePincode).filter(
        ServiceablePincode.pincode == clean_pin
    ).first()

    if record and record.is_active:
        status_code = (record.serviceability_status or "REGULAR").upper()
        localities_list = parse_list(record.localities)
        modes_list = parse_list(record.transport_modes) or ["State Roadlines", "Bus Cargo"]

        # Standard customer-friendly messaging per category
        if status_code == "CUSTOM_TRANSIT":
            message = "Custom Transit Arrangement Required. Please contact our Wholesale Desk at +91 98617 89602."
            is_serviceable = False
        elif status_code == "REGULAR":
            message = f"Regular Delivery Available: Supported scheduled road transport via {record.zone_name or 'regional carrier'} ({record.transit_duration_label or f'{record.min_delivery_days}-{record.max_delivery_days} days'})."
            is_serviceable = True
        elif status_code == "PENDING_VERIFICATION":
            message = "Serviceability Pending: Route coverage needs business verification. Contact wholesale desk at +91 98617 89602 for custom transit quotes."
            is_serviceable = False
        else:
            message = "Currently Unavailable: No confirmed delivery arrangement. Contact wholesale desk +91 98617 89602."
            is_serviceable = False

        return {
            "pincode": record.pincode,
            "is_serviceable": is_serviceable,
            "serviceability_status": status_code,
            "status_label": STATUS_LABELS.get(status_code, "Custom Transit Available"),
            "city": record.city,
            "district": record.district,
            "state": record.state,
            "zone_name": record.zone_name,
            "localities": localities_list,
            "transport_modes": modes_list,
            "transit_duration_label": record.transit_duration_label or f"{record.min_delivery_days}-{record.max_delivery_days} Days",
            "min_delivery_days": record.min_delivery_days or 1,
            "max_delivery_days": record.max_delivery_days or 3,
            "standard_shipping_rate": float(record.standard_shipping_rate or 0.0),
            "delivery_charges_text": record.delivery_charges_text or f"₹{record.standard_shipping_rate} flat / carton",
            "cod_available": bool(record.cod_available),
            "daily_transit_available": bool(record.daily_transit_available),
            "delivery_conditions": record.delivery_conditions,
            "message": message,
            "whatsapp_url": generate_whatsapp_transit_link(record.pincode, record.city, record.district, record.state, status_code),
            "is_postal_valid": True
        }

    # Geographically valid Indian PIN code, but NOT in confirmed active routes
    # Recognize regional prefix zones: Odisha (75xxxx, 76xxxx) or Andhra Pradesh (50xxxx - 53xxxx)
    is_regional = clean_pin.startswith(("75", "76", "50", "51", "52", "53"))
    if is_regional:
        status_code = "PENDING_VERIFICATION"
        status_label = STATUS_LABELS[status_code]
        message = "Serviceability Pending: Geographically valid PIN code in regional corridor, but scheduled route requires business verification. Contact our Wholesale Desk at +91 98617 89602."
    else:
        status_code = "UNAVAILABLE"
        status_label = STATUS_LABELS[status_code]
        message = "Currently Unavailable: PIN code currently outside confirmed regional delivery routes. Special bulk transit can be arranged via Indian Post / private transport. Contact +91 98617 89602."

    return {
        "pincode": clean_pin,
        "is_serviceable": False,
        "serviceability_status": status_code,
        "status_label": status_label,
        "city": "Regional Destination",
        "district": "Unverified District",
        "state": "Odisha / Andhra Pradesh" if is_regional else "India",
        "zone_name": "Out of Direct Network",
        "localities": [],
        "transport_modes": ["Indian Post", "Private Transport Agencies"],
        "transit_duration_label": "3-5 Days (Upon Booking)",
        "min_delivery_days": 3,
        "max_delivery_days": 5,
        "standard_shipping_rate": 0.0,
        "delivery_charges_text": "Custom Freight Quote",
        "cod_available": False,
        "daily_transit_available": False,
        "delivery_conditions": "Special bulk dispatch requires wholesale coordinator confirmation.",
        "message": message,
        "whatsapp_url": generate_whatsapp_transit_link(clean_pin, status_code=status_code),
        "is_postal_valid": True
    }


@router.get("/search")
def search_pincodes_and_locations(
    q: Optional[str] = Query(None, description="Search by PIN code, village name, town, district, or state"),
    query: Optional[str] = Query(None, description="Alias for q"),
    db: Session = Depends(get_db)
):
    """
    Public Endpoint: Comprehensive multi-attribute search across:
    - 6-digit PIN code
    - Village name / locality
    - Town or city name
    - District name
    - State name
    Supports either ?q=... or ?query=... parameters.
    """
    search_term = (q or query or "").strip()
    if len(search_term) < 2:
        return []

    search_pattern = f"%{search_term}%"

    records = db.query(ServiceablePincode).filter(
        ServiceablePincode.is_active == True,
        or_(
            ServiceablePincode.pincode.ilike(search_pattern),
            ServiceablePincode.city.ilike(search_pattern),
            ServiceablePincode.district.ilike(search_pattern),
            ServiceablePincode.state.ilike(search_pattern),
            ServiceablePincode.localities.ilike(search_pattern),
            ServiceablePincode.zone_name.ilike(search_pattern)
        )
    ).limit(30).all()

    results = []
    for r in records:
        status_code = (r.serviceability_status or "REGULAR").upper()
        localities_list = parse_list(r.localities)
        modes_list = parse_list(r.transport_modes) or ["State Roadlines", "Bus Cargo"]

        if status_code == "CUSTOM_TRANSIT":
            msg = "Custom Transit Arrangement Required. Please contact our Wholesale Desk at +91 98617 89602."
            is_serv = False
        elif status_code == "REGULAR":
            msg = f"Regular Delivery Available: Supported scheduled road transport via {r.zone_name}."
            is_serv = True
        elif status_code == "PENDING_VERIFICATION":
            msg = "Serviceability Pending: Route coverage needs business verification."
            is_serv = False
        else:
            msg = "Currently Unavailable: No confirmed delivery arrangement."
            is_serv = False

        results.append({
            "id": r.id,
            "pincode": r.pincode,
            "city": r.city,
            "district": r.district,
            "state": r.state,
            "zone_name": r.zone_name,
            "serviceability_status": status_code,
            "status_label": STATUS_LABELS.get(status_code, "Custom Transit"),
            "is_serviceable": is_serv,
            "localities": localities_list,
            "transport_modes": modes_list,
            "transit_duration_label": r.transit_duration_label or f"{r.min_delivery_days}-{r.max_delivery_days} Days",
            "standard_shipping_rate": float(r.standard_shipping_rate or 0.0),
            "delivery_charges_text": r.delivery_charges_text or f"₹{r.standard_shipping_rate} flat / carton",
            "cod_available": bool(r.cod_available),
            "daily_transit_available": bool(r.daily_transit_available),
            "delivery_conditions": r.delivery_conditions,
            "message": msg,
            "whatsapp_url": generate_whatsapp_transit_link(r.pincode, r.city, r.district, r.state, status_code)
        })

    return {
        "query": search_term,
        "count": len(results),
        "results": results
    }


@router.get("/autocomplete")
def autocomplete_locations(
    q: Optional[str] = Query(None, description="Search term for suggestions"),
    db: Session = Depends(get_db)
):
    """
    Public Endpoint: Rapid autocomplete suggestions for customer delivery search.
    Returns matched location name, PIN code, district, state, and serviceability status.
    """
    search_term = (q or "").strip()
    if len(search_term) < 1:
        return []

    search_pattern = f"%{search_term}%"
    records = db.query(ServiceablePincode).filter(
        ServiceablePincode.is_active == True,
        or_(
            ServiceablePincode.pincode.ilike(search_pattern),
            ServiceablePincode.city.ilike(search_pattern),
            ServiceablePincode.district.ilike(search_pattern),
            ServiceablePincode.localities.ilike(search_pattern)
        )
    ).limit(10).all()

    suggestions = []
    for r in records:
        status_code = (r.serviceability_status or "REGULAR").upper()
        # Find which specific locality/village matched if any
        matched_locality = None
        if r.localities and search_term.lower() in r.localities.lower():
            for loc in parse_list(r.localities):
                if search_term.lower() in loc.lower():
                    matched_locality = loc
                    break

        display_label = f"{r.city}, {r.district}, {r.state} – {r.pincode}"
        if matched_locality and matched_locality.lower() != r.city.lower():
            display_label = f"{matched_locality} ({r.city}), {r.district} – {r.pincode}"

        suggestions.append({
            "pincode": r.pincode,
            "city": r.city,
            "district": r.district,
            "state": r.state,
            "matched_locality": matched_locality,
            "display_label": display_label,
            "serviceability_status": status_code,
            "status_label": STATUS_LABELS.get(status_code, "Custom Transit Available"),
            "is_serviceable": status_code == "REGULAR"
        })

    return suggestions


@router.get("/districts/odisha")
def get_odisha_districts_overview(db: Session = Depends(get_db)):
    """
    Public Endpoint: Returns all 30 official Odisha districts with actual verified delivery availability.
    Includes Angul, Balangir, Kendujhar, Deogarh, Malkangiri, etc. with primary hub and status.
    """
    records = db.query(ServiceablePincode).filter(
        ServiceablePincode.is_active == True,
        ServiceablePincode.state == "Odisha"
    ).all()

    grouped: Dict[str, List[Any]] = {}
    for r in records:
        d = r.district
        if not d:
            continue
        if d not in grouped:
            grouped[d] = []
        grouped[d].append(r)

    OFFICIAL_30_ODISHA = [
        "Angul", "Balangir", "Balasore", "Bargarh", "Bhadrak", "Boudh", "Cuttack",
        "Deogarh", "Dhenkanal", "Gajapati", "Ganjam", "Jagatsinghpur", "Jajpur",
        "Jharsuguda", "Kalahandi", "Kandhamal", "Kendrapara", "Kendujhar", "Khordha",
        "Koraput", "Malkangiri", "Mayurbhanj", "Nabarangpur", "Nayagarh", "Nuapada",
        "Puri", "Rayagada", "Sambalpur", "Subarnapur", "Sundargarh"
    ]

    district_results = []
    for dist_name in OFFICIAL_30_ODISHA:
        recs = grouped.get(dist_name, [])
        if recs:
            # Sort with regular delivery first, then town hub
            sorted_recs = sorted(recs, key=lambda x: (x.serviceability_status != "REGULAR", len(x.pincode)))
            primary = sorted_recs[0]
            status_code = (primary.serviceability_status or "REGULAR").upper()
            status_label = STATUS_LABELS.get(status_code, "Custom Transit")
            transit_label = primary.transit_duration_label or f"{primary.min_delivery_days}-{primary.max_delivery_days} Days"
            modes = parse_list(primary.transport_modes) or ["State Roadlines", "Bus Cargo"]
            charges = primary.delivery_charges_text or f"₹{primary.standard_shipping_rate} flat / carton"
            loc_list = [{"city": r.city, "pincode": r.pincode, "status": r.serviceability_status} for r in recs]
            district_results.append({
                "district_name": dist_name,
                "hub_city": primary.city,
                "primary_pincode": primary.pincode,
                "serviceability_status": status_code,
                "status_label": status_label,
                "is_serviceable": status_code == "REGULAR",
                "transit_duration_label": transit_label,
                "transport_modes": modes,
                "delivery_charges_text": charges,
                "location_count": len(loc_list),
                "locations": loc_list
            })
        else:
            district_results.append({
                "district_name": dist_name,
                "hub_city": f"{dist_name} Town",
                "primary_pincode": "",
                "serviceability_status": "PENDING_VERIFICATION",
                "status_label": "Route Verification Required",
                "is_serviceable": False,
                "transit_duration_label": "2-4 Days (Upon Booking)",
                "transport_modes": ["State Roadlines", "Bus Cargo"],
                "delivery_charges_text": "Custom Freight Quote",
                "location_count": 0,
                "locations": []
            })

    return {
        "state": "Odisha",
        "total_districts": len(district_results),
        "districts": district_results
    }


@router.get("/coverage/hierarchy")
def get_coverage_hierarchy(db: Session = Depends(get_db)):
    """
    Public Endpoint: Returns hierarchical State -> District -> Locations tree for customer navigation.
    Allows customers to browse nearby villages, towns, and PIN codes interactively.
    """
    records = db.query(ServiceablePincode).filter(ServiceablePincode.is_active == True).order_by(
        ServiceablePincode.state,
        ServiceablePincode.district,
        ServiceablePincode.city
    ).all()

    tree: Dict[str, Dict[str, List[Any]]] = {}
    for r in records:
        state = r.state or "Odisha"
        district = r.district or "General"
        if state not in tree:
            tree[state] = {}
        if district not in tree[state]:
            tree[state][district] = []

        status_code = (r.serviceability_status or "REGULAR").upper()
        tree[state][district].append({
            "id": r.id,
            "pincode": r.pincode,
            "city": r.city,
            "serviceability_status": status_code,
            "status_label": STATUS_LABELS.get(status_code, "Custom Transit"),
            "is_serviceable": status_code == "REGULAR",
            "localities": parse_list(r.localities),
            "transport_modes": parse_list(r.transport_modes),
            "transit_duration_label": r.transit_duration_label or f"{r.min_delivery_days}-{r.max_delivery_days} Days",
            "standard_shipping_rate": float(r.standard_shipping_rate or 0.0),
            "delivery_charges_text": r.delivery_charges_text,
            "whatsapp_url": generate_whatsapp_transit_link(r.pincode, r.city, r.district, r.state, status_code)
        })

    formatted_states = []
    for state_name, districts_map in tree.items():
        dist_list = []
        for dist_name, locations in districts_map.items():
            dist_list.append({
                "district_name": dist_name,
                "locations_count": len(locations),
                "locations": locations
            })
        formatted_states.append({
            "state_name": state_name,
            "districts_count": len(dist_list),
            "districts": dist_list
        })

    return {
        "total_records": len(records),
        "supported_transport_methods": DEFAULT_TRANSPORT_MODES,
        "states": formatted_states
    }


@router.get("/pincodes")
def list_serviceable_pincodes(db: Session = Depends(get_db)):
    """List all registered active regional delivery distribution areas."""
    return db.query(ServiceablePincode).filter(ServiceablePincode.is_active == True).all()


# ========================================================
# ADMIN DELIVERY COVERAGE MANAGEMENT ENDPOINTS
# Protected with require_roles([ROLE_SUPERADMIN, ROLE_ORDER_MANAGER])
# ========================================================

@router.get("/admin/pincodes")
def admin_list_pincodes(
    search: Optional[str] = None,
    state: Optional[str] = None,
    district: Optional[str] = None,
    status: Optional[str] = None,
    skip: int = 0,
    limit: int = 250,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([ROLE_SUPERADMIN, ROLE_ORDER_MANAGER, ROLE_INVENTORY_MANAGER]))
):
    """Admin: Search, filter and list all registered PIN code coverage entries."""
    query = db.query(ServiceablePincode)

    if search:
        s = f"%{search.strip()}%"
        query = query.filter(
            or_(
                ServiceablePincode.pincode.ilike(s),
                ServiceablePincode.city.ilike(s),
                ServiceablePincode.district.ilike(s),
                ServiceablePincode.localities.ilike(s)
            )
        )
    if state:
        query = query.filter(ServiceablePincode.state == state)
    if district:
        query = query.filter(ServiceablePincode.district == district)
    if status:
        query = query.filter(ServiceablePincode.serviceability_status == status.upper())

    total = query.count()
    records = query.order_by(
        ServiceablePincode.state,
        ServiceablePincode.district,
        ServiceablePincode.pincode
    ).offset(skip).limit(limit).all()

    return {
        "total": total,
        "records": records
    }


@router.post("/admin/pincodes", status_code=status.HTTP_201_CREATED)
def admin_create_pincode(
    data: PincodeCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([ROLE_SUPERADMIN, ROLE_ORDER_MANAGER]))
):
    """Admin: Add a new regional PIN code coverage entry."""
    clean_pin = data.pincode.strip()
    if not re.match(r"^[1-9][0-9]{5}$", clean_pin):
        raise HTTPException(status_code=400, detail="Invalid 6-digit Indian PIN code format.")

    existing = db.query(ServiceablePincode).filter(ServiceablePincode.pincode == clean_pin).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"PIN code {clean_pin} is already registered in the system.")

    new_pin = ServiceablePincode(
        pincode=clean_pin,
        city=data.city.strip(),
        district=data.district.strip(),
        state=data.state.strip(),
        zone_name=data.zone_name or "South Odisha Hub",
        is_active=data.is_active,
        serviceability_status=data.serviceability_status.upper(),
        localities=data.localities,
        transport_modes=data.transport_modes or json.dumps(["State Roadlines", "Bus Cargo"]),
        transit_duration_label=data.transit_duration_label or f"{data.min_delivery_days}-{data.max_delivery_days} Days",
        delivery_charges_text=data.delivery_charges_text or f"₹{data.standard_shipping_rate} flat / carton",
        delivery_conditions=data.delivery_conditions,
        daily_transit_available=data.daily_transit_available,
        min_delivery_days=data.min_delivery_days,
        max_delivery_days=data.max_delivery_days,
        standard_shipping_rate=data.standard_shipping_rate,
        cod_available=data.cod_available,
        notes=data.notes,
        updated_at=datetime.now(timezone.utc)
    )
    db.add(new_pin)
    db.commit()
    db.refresh(new_pin)
    return new_pin


@router.put("/admin/pincodes/{pincode_id}")
def admin_update_pincode(
    pincode_id: str,
    data: PincodeUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([ROLE_SUPERADMIN, ROLE_ORDER_MANAGER]))
):
    """Admin: Update regional PIN code coverage details, status, or transport modes."""
    record = db.query(ServiceablePincode).filter(ServiceablePincode.id == pincode_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="PIN code coverage record not found.")

    if data.pincode is not None:
        clean_pin = data.pincode.strip()
        if not re.match(r"^[1-9][0-9]{5}$", clean_pin):
            raise HTTPException(status_code=400, detail="Invalid 6-digit Indian PIN code format.")
        # Check uniqueness if changed
        if clean_pin != record.pincode:
            dup = db.query(ServiceablePincode).filter(ServiceablePincode.pincode == clean_pin).first()
            if dup:
                raise HTTPException(status_code=400, detail=f"PIN code {clean_pin} is already taken by another record.")
            record.pincode = clean_pin

    if data.city is not None:
        record.city = data.city.strip()
    if data.district is not None:
        record.district = data.district.strip()
    if data.state is not None:
        record.state = data.state.strip()
    if data.zone_name is not None:
        record.zone_name = data.zone_name.strip()
    if data.is_active is not None:
        record.is_active = data.is_active
    if data.serviceability_status is not None:
        record.serviceability_status = data.serviceability_status.upper()
    if data.localities is not None:
        record.localities = data.localities
    if data.transport_modes is not None:
        record.transport_modes = data.transport_modes
    if data.transit_duration_label is not None:
        record.transit_duration_label = data.transit_duration_label
    if data.delivery_charges_text is not None:
        record.delivery_charges_text = data.delivery_charges_text
    if data.delivery_conditions is not None:
        record.delivery_conditions = data.delivery_conditions
    if data.daily_transit_available is not None:
        record.daily_transit_available = data.daily_transit_available
    if data.min_delivery_days is not None:
        record.min_delivery_days = data.min_delivery_days
    if data.max_delivery_days is not None:
        record.max_delivery_days = data.max_delivery_days
    if data.standard_shipping_rate is not None:
        record.standard_shipping_rate = data.standard_shipping_rate
    if data.cod_available is not None:
        record.cod_available = data.cod_available
    if data.notes is not None:
        record.notes = data.notes

    record.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(record)
    return record


@router.delete("/admin/pincodes/{pincode_id}")
def admin_delete_pincode(
    pincode_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([ROLE_SUPERADMIN, ROLE_ORDER_MANAGER]))
):
    """Admin: Remove a PIN code from coverage or deactivate it."""
    record = db.query(ServiceablePincode).filter(ServiceablePincode.id == pincode_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="PIN code coverage record not found.")

    pin_num = record.pincode
    db.delete(record)
    db.commit()
    return {"message": f"PIN code {pin_num} deleted successfully", "id": pincode_id}


@router.get("/admin/pincodes/export.csv")
def admin_export_pincodes_csv(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([ROLE_SUPERADMIN, ROLE_ORDER_MANAGER]))
):
    """Admin: Export all PIN code coverage records as a CSV spreadsheet."""
    records = db.query(ServiceablePincode).order_by(
        ServiceablePincode.state,
        ServiceablePincode.district,
        ServiceablePincode.pincode
    ).all()

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow([
        "pincode", "city", "district", "state", "zone_name", "serviceability_status",
        "localities", "transport_modes", "transit_duration_label", "standard_shipping_rate",
        "delivery_charges_text", "delivery_conditions", "daily_transit_available",
        "min_delivery_days", "max_delivery_days", "cod_available", "is_active", "notes"
    ])

    for r in records:
        writer.writerow([
            r.pincode,
            r.city,
            r.district,
            r.state,
            r.zone_name,
            r.serviceability_status,
            r.localities or "",
            r.transport_modes or "",
            r.transit_duration_label or "",
            r.standard_shipping_rate or 0,
            r.delivery_charges_text or "",
            r.delivery_conditions or "",
            1 if r.daily_transit_available else 0,
            r.min_delivery_days or 1,
            r.max_delivery_days or 3,
            1 if r.cod_available else 0,
            1 if r.is_active else 0,
            r.notes or ""
        ])

    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=sri_balaji_delivery_coverage.csv"}
    )


@router.post("/admin/pincodes/bulk-import")
async def admin_bulk_import_pincodes(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([ROLE_SUPERADMIN, ROLE_ORDER_MANAGER]))
):
    """Admin: Bulk import or update PIN codes through a CSV file."""
    content = await file.read()
    try:
        decoded = content.decode("utf-8-sig")
    except Exception:
        decoded = content.decode("latin-1")

    reader = csv.DictReader(io.StringIO(decoded))
    imported_count = 0
    updated_count = 0
    now_utc = datetime.now(timezone.utc)

    for row in reader:
        pin = row.get("pincode", "").strip()
        if not pin or not re.match(r"^[1-9][0-9]{5}$", pin):
            continue

        existing = db.query(ServiceablePincode).filter(ServiceablePincode.pincode == pin).first()
        city = row.get("city", "").strip() or "Regional Hub"
        district = row.get("district", "").strip() or "Regional District"
        state = row.get("state", "").strip() or "Odisha"
        status_code = (row.get("serviceability_status") or "REGULAR").strip().upper()
        if status_code not in STATUS_LABELS:
            status_code = "REGULAR"

        if existing:
            existing.city = city
            existing.district = district
            existing.state = state
            if row.get("zone_name"):
                existing.zone_name = row.get("zone_name").strip()
            existing.serviceability_status = status_code
            if row.get("localities") is not None:
                existing.localities = row.get("localities").strip()
            if row.get("transport_modes") is not None:
                existing.transport_modes = row.get("transport_modes").strip()
            if row.get("transit_duration_label") is not None:
                existing.transit_duration_label = row.get("transit_duration_label").strip()
            if row.get("standard_shipping_rate"):
                try:
                    existing.standard_shipping_rate = float(row.get("standard_shipping_rate"))
                except ValueError:
                    pass
            if row.get("delivery_charges_text") is not None:
                existing.delivery_charges_text = row.get("delivery_charges_text").strip()
            if row.get("delivery_conditions") is not None:
                existing.delivery_conditions = row.get("delivery_conditions").strip()
            if row.get("daily_transit_available") is not None:
                existing.daily_transit_available = str(row.get("daily_transit_available")).lower() in ("1", "true", "yes")
            if row.get("is_active") is not None:
                existing.is_active = str(row.get("is_active")).lower() in ("1", "true", "yes")
            existing.updated_at = now_utc
            updated_count += 1
        else:
            new_rec = ServiceablePincode(
                pincode=pin,
                city=city,
                district=district,
                state=state,
                zone_name=row.get("zone_name", "South Odisha Hub").strip(),
                serviceability_status=status_code,
                localities=row.get("localities", "").strip(),
                transport_modes=row.get("transport_modes", '["State Roadlines", "Bus Cargo"]').strip(),
                transit_duration_label=row.get("transit_duration_label", "1-2 Days").strip(),
                delivery_charges_text=row.get("delivery_charges_text", "Standard Freight").strip(),
                delivery_conditions=row.get("delivery_conditions", "").strip(),
                daily_transit_available=str(row.get("daily_transit_available", "1")).lower() in ("1", "true", "yes"),
                standard_shipping_rate=float(row.get("standard_shipping_rate") or 40.0),
                min_delivery_days=int(row.get("min_delivery_days") or 1),
                max_delivery_days=int(row.get("max_delivery_days") or 3),
                cod_available=str(row.get("cod_available", "1")).lower() in ("1", "true", "yes"),
                is_active=str(row.get("is_active", "1")).lower() in ("1", "true", "yes"),
                notes=row.get("notes", "").strip(),
                updated_at=now_utc
            )
            db.add(new_rec)
            imported_count += 1

    db.commit()
    return {
        "message": f"CSV import finished: {imported_count} new PIN codes added, {updated_count} existing PIN codes updated.",
        "imported": imported_count,
        "updated": updated_count
    }


# ========================================================
# EXISTING SHIPMENT RECORDING & TRACKING ENDPOINTS
# ========================================================

@router.post("/shipments", response_model=ShipmentResponse, status_code=status.HTTP_201_CREATED)
def create_shipment(
    ship_in: ShipmentCreateRequest,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Admin: Record shipment details, courier partner, and tracking LR/consignment number.
    """
    order = db.query(Order).filter(Order.id == ship_in.order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")

    existing_shipment = db.query(ShipmentRecord).filter(ShipmentRecord.order_id == ship_in.order_id).first()
    now_utc = datetime.now(timezone.utc)

    if existing_shipment:
        existing_shipment.courier_partner = ship_in.courier_partner
        existing_shipment.tracking_number = ship_in.tracking_number.strip()
        existing_shipment.tracking_url = ship_in.tracking_url
        existing_shipment.shipping_charges = ship_in.shipping_charges
        existing_shipment.status = ship_in.status
        existing_shipment.destination_pincode = ship_in.destination_pincode or order.pin_code
        existing_shipment.recipient_name = ship_in.recipient_name or order.customer_name
        existing_shipment.recipient_phone = ship_in.recipient_phone or order.phone_number
        existing_shipment.delivery_address = ship_in.delivery_address or order.delivery_address
        existing_shipment.notes = ship_in.notes
        existing_shipment.updated_at = now_utc
        db.commit()
        db.refresh(existing_shipment)
        return existing_shipment

    shipment = ShipmentRecord(
        order_id=order.id,
        courier_partner=ship_in.courier_partner,
        tracking_number=ship_in.tracking_number.strip(),
        tracking_url=ship_in.tracking_url,
        dispatch_date=ship_in.dispatch_date or now_utc,
        estimated_delivery_date=ship_in.estimated_delivery_date,
        shipping_charges=ship_in.shipping_charges,
        status=ship_in.status,
        destination_pincode=ship_in.destination_pincode or order.pin_code,
        recipient_name=ship_in.recipient_name or order.customer_name,
        recipient_phone=ship_in.recipient_phone or order.phone_number,
        delivery_address=ship_in.delivery_address or order.delivery_address,
        notes=ship_in.notes,
        created_at=now_utc,
        updated_at=now_utc
    )
    db.add(shipment)

    # Update order status to DISPATCHED
    order.status = "READY FOR PICKUP / DISPATCHED"
    order.dispatched_at = now_utc

    # Log status history
    admin_name = getattr(current_user, "full_name", "Admin") or "Admin"
    db.add(OrderStatusHistory(
        order_id=order.id,
        from_status=order.status,
        to_status="READY FOR PICKUP / DISPATCHED",
        notes=f"Dispatched via {ship_in.courier_partner}. Tracking/LR: {ship_in.tracking_number}",
        changed_by=admin_name
    ))

    db.commit()
    db.refresh(shipment)
    return shipment


@router.get("/shipments", response_model=List[ShipmentResponse])
def get_all_shipments(
    status: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Admin: Monitor all active and fulfilled logistics shipments."""
    query = db.query(ShipmentRecord).join(Order)
    if status:
        query = query.filter(ShipmentRecord.status == status.upper())
    
    shipments = query.order_by(desc(ShipmentRecord.dispatch_date)).offset(skip).limit(limit).all()
    results = []
    for s in shipments:
        results.append({
            "id": s.id,
            "order_id": s.order_id,
            "order_number": s.order.order_number if s.order else None,
            "courier_partner": s.courier_partner,
            "tracking_number": s.tracking_number,
            "tracking_url": s.tracking_url,
            "dispatch_date": s.dispatch_date,
            "estimated_delivery_date": s.estimated_delivery_date,
            "actual_delivery_date": s.actual_delivery_date,
            "shipping_charges": float(s.shipping_charges or 0.0),
            "status": s.status,
            "destination_pincode": s.destination_pincode,
            "recipient_name": s.recipient_name,
            "recipient_phone": s.recipient_phone,
            "delivery_address": s.delivery_address,
            "notes": s.notes,
            "created_at": s.created_at,
            "updated_at": s.updated_at
        })
    return results


@router.get("/shipments/order/{order_id}")
def get_shipment_by_order(order_id: str, db: Session = Depends(get_db)):
    """Customer & Dealer: Get shipment tracking details for an order."""
    shipment = db.query(ShipmentRecord).filter(ShipmentRecord.order_id == order_id).first()
    if not shipment:
        raise HTTPException(status_code=404, detail="Shipment not yet created for this order.")
    return {
        "id": shipment.id,
        "order_id": shipment.order_id,
        "courier_partner": shipment.courier_partner,
        "tracking_number": shipment.tracking_number,
        "tracking_url": shipment.tracking_url,
        "dispatch_date": shipment.dispatch_date,
        "estimated_delivery_date": shipment.estimated_delivery_date,
        "actual_delivery_date": shipment.actual_delivery_date,
        "status": shipment.status,
        "destination_pincode": shipment.destination_pincode,
        "delivery_address": shipment.delivery_address
    }


@router.patch("/shipments/{shipment_id}/status")
def update_shipment_status(
    shipment_id: str,
    data: ShipmentStatusUpdateRequest,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Admin: Update shipment progress status (e.g. IN_TRANSIT, DELIVERED)."""
    shipment = db.query(ShipmentRecord).filter(ShipmentRecord.id == shipment_id).first()
    if not shipment:
        raise HTTPException(status_code=404, detail="Shipment record not found.")

    admin_name = getattr(current_user, "full_name", "Admin") or "Admin"
    now_utc = datetime.now(timezone.utc)
    target_status = data.status.upper()

    shipment.status = target_status
    shipment.updated_at = now_utc
    if target_status == "DELIVERED":
        shipment.actual_delivery_date = data.actual_delivery_date or now_utc
        if shipment.order:
            shipment.order.status = "DELIVERED"
            shipment.order.delivered_at = now_utc
            db.add(OrderStatusHistory(
                order_id=shipment.order.id,
                from_status=shipment.order.status,
                to_status="DELIVERED",
                notes=f"Shipment confirmed delivered. {data.notes or ''}".strip(),
                changed_by=admin_name
            ))

    db.commit()
    db.refresh(shipment)
    return {"message": f"Shipment status updated to {shipment.status}", "status": shipment.status}

