import random
import string
from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc

from app.core.database import get_db
from app.models.customer import Customer
from app.models.dealer import DealerProfile
from app.models.order import Order
from app.models.quotation import WholesaleQuotation
from app.schemas.dealer import DealerApplyRequest, DealerStatusUpdate, DealerResponse
from app.core.rbac import (
    require_roles,
    log_admin_action,
    ROLE_SUPERADMIN,
    ROLE_ORDER_MANAGER
)
from app.models.user import User
from app.api.v1.endpoints.customers import get_current_customer

router = APIRouter()


@router.post("/apply", response_model=DealerResponse)
def apply_for_dealer(
    data: DealerApplyRequest,
    db: Session = Depends(get_db),
    current_customer: Customer = Depends(get_current_customer)
):
    """
    Customer submits a wholesale dealer application.
    Stored with PENDING_VERIFICATION for admin review.
    """
    existing_profile = db.query(DealerProfile).filter(
        DealerProfile.customer_id == current_customer.id
    ).first()

    now_utc = datetime.now(timezone.utc)
    if existing_profile:
        # Update existing application
        existing_profile.business_name = data.business_name.strip()
        existing_profile.business_category = data.business_category.strip()
        existing_profile.owner_name = data.owner_name.strip()
        existing_profile.phone_number = data.phone_number.strip()
        existing_profile.email = data.email.strip() if data.email else None
        existing_profile.gstin = data.gstin.strip().upper() if data.gstin else None
        existing_profile.pan_number = data.pan_number.strip().upper() if data.pan_number else None
        existing_profile.business_address = data.business_address.strip()
        existing_profile.city = data.city.strip()
        existing_profile.state = data.state.strip()
        existing_profile.pin_code = data.pin_code.strip()
        existing_profile.wholesale_requirements = data.wholesale_requirements
        existing_profile.updated_at = now_utc
        db.commit()
        db.refresh(existing_profile)
        return existing_profile

    new_profile = DealerProfile(
        customer_id=current_customer.id,
        business_name=data.business_name.strip(),
        business_category=data.business_category.strip(),
        owner_name=data.owner_name.strip(),
        phone_number=data.phone_number.strip(),
        email=data.email.strip() if data.email else None,
        gstin=data.gstin.strip().upper() if data.gstin else None,
        pan_number=data.pan_number.strip().upper() if data.pan_number else None,
        business_address=data.business_address.strip(),
        city=data.city.strip(),
        state=data.state.strip(),
        pin_code=data.pin_code.strip(),
        status="PENDING_VERIFICATION",
        pricing_tier="STANDARD_WHOLESALE",
        wholesale_requirements=data.wholesale_requirements,
        created_at=now_utc,
        updated_at=now_utc
    )
    db.add(new_profile)
    db.commit()
    db.refresh(new_profile)
    return new_profile


@router.get("/me", response_model=Optional[DealerResponse])
def get_my_dealer_profile(
    db: Session = Depends(get_db),
    current_customer: Customer = Depends(get_current_customer)
):
    """
    Returns authenticated customer's dealer profile if applied.
    """
    profile = db.query(DealerProfile).filter(
        DealerProfile.customer_id == current_customer.id
    ).first()
    return profile


@router.get("/portal-summary")
def get_dealer_portal_summary(
    db: Session = Depends(get_db),
    current_customer: Customer = Depends(get_current_customer)
):
    """
    B2B Dealer Dashboard metrics (Orders, Quotations, Pricing Tier).
    """
    profile = db.query(DealerProfile).filter(
        DealerProfile.customer_id == current_customer.id
    ).first()

    if not profile or profile.status != "APPROVED":
        return {
            "is_approved_dealer": False,
            "status": profile.status if profile else "NOT_REGISTERED",
            "message": "Dealer verification pending or not applied."
        }

    # Fetch dealer wholesale orders
    orders = db.query(Order).filter(
        or_(
            Order.dealer_id == profile.id,
            (Order.customer_id == current_customer.id) & (Order.order_type == "WHOLESALE")
        )
    ).order_by(desc(Order.created_at)).all()

    quotations = db.query(WholesaleQuotation).filter(
        WholesaleQuotation.dealer_id == profile.id
    ).order_by(desc(WholesaleQuotation.created_at)).all()

    total_spend = sum(float(o.total_estimated_amount or 0.0) for o in orders if o.status not in ["CANCELLED", "REJECTED"])

    return {
        "is_approved_dealer": True,
        "dealer_id": profile.id,
        "business_name": profile.business_name,
        "pricing_tier": profile.pricing_tier,
        "credit_limit": float(profile.credit_limit or 0.0),
        "credit_days": profile.credit_days,
        "total_orders_count": len(orders),
        "total_spend_amount": round(total_spend, 2),
        "quotations_count": len(quotations),
        "recent_orders": [
            {
                "order_number": o.order_number,
                "created_at": o.created_at,
                "status": o.status,
                "payment_status": o.payment_status,
                "amount": float(o.total_estimated_amount),
                "weight_kg": float(o.total_estimated_weight_kg)
            } for o in orders[:5]
        ]
    }


# --- Admin Dealer CRM Endpoints ---

@router.get("/", response_model=List[DealerResponse])
def list_dealers(
    status: Optional[str] = Query(None, description="Filter by dealer status"),
    search: Optional[str] = Query(None, description="Search by business name or phone"),
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([ROLE_SUPERADMIN, ROLE_ORDER_MANAGER]))
):
    """
    Admin: Review and manage wholesale dealer applications and CRM.
    """
    query = db.query(DealerProfile)

    if status:
        query = query.filter(DealerProfile.status == status.upper())

    if search:
        s = f"%{search.strip()}%"
        query = query.filter(
            or_(
                DealerProfile.business_name.ilike(s),
                DealerProfile.owner_name.ilike(s),
                DealerProfile.phone_number.ilike(s),
                DealerProfile.city.ilike(s)
            )
        )

    return query.order_by(desc(DealerProfile.created_at)).offset(skip).limit(limit).all()


@router.patch("/{dealer_id}/status")
def update_dealer_status(
    dealer_id: str,
    update_in: DealerStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([ROLE_SUPERADMIN, ROLE_ORDER_MANAGER]))
):
    """
    Admin: Approve, reject, suspend, or update commercial terms for a dealer.
    """
    dealer = db.query(DealerProfile).filter(DealerProfile.id == dealer_id).first()
    if not dealer:
        raise HTTPException(status_code=404, detail="Dealer profile not found.")

    admin_name = getattr(current_user, "full_name", "Admin") or current_user.email
    now_utc = datetime.now(timezone.utc)

    dealer.status = update_in.status.upper()
    if update_in.status.upper() == "APPROVED" and not dealer.verified_at:
        dealer.verified_at = now_utc
        dealer.verified_by = admin_name

    if update_in.pricing_tier:
        dealer.pricing_tier = update_in.pricing_tier.upper()
    if update_in.credit_limit is not None:
        dealer.credit_limit = max(0.0, update_in.credit_limit)
    if update_in.credit_days is not None:
        dealer.credit_days = max(0, update_in.credit_days)
    if update_in.admin_notes:
        dealer.admin_notes = update_in.admin_notes

    dealer.updated_at = now_utc
    db.commit()
    db.refresh(dealer)

    log_admin_action(
        db,
        admin_email=current_user.email,
        action="DEALER_STATUS_UPDATE",
        entity="DealerProfile",
        entity_id=dealer.id,
        details=f"Dealer '{dealer.business_name}' status set to {dealer.status}, Tier: {dealer.pricing_tier}"
    )

    return {
        "message": f"Dealer status updated to {dealer.status}",
        "dealer_id": dealer.id,
        "business_name": dealer.business_name,
        "status": dealer.status,
        "pricing_tier": dealer.pricing_tier
    }
