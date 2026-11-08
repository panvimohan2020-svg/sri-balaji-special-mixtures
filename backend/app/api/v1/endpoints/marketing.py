import uuid
from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.core.database import get_db
from app.core.rbac import (
    require_roles,
    log_admin_action,
    ROLE_SUPERADMIN,
    ROLE_PRODUCT_MANAGER
)
from app.models.user import User
from app.models.marketing import MarketingCoupon, MarketingCampaign
from app.schemas.marketing import (
    CouponValidateRequest,
    CouponValidateResponse,
    CouponCreateRequest,
    CouponResponse,
    CampaignCreateRequest,
    CampaignResponse
)

router = APIRouter()


@router.post("/coupons/validate", response_model=CouponValidateResponse)
def validate_coupon(
    data: CouponValidateRequest,
    db: Session = Depends(get_db)
):
    """Customer: Verify coupon code applicability and calculate precise savings."""
    clean_code = data.code.strip().upper()
    coupon = db.query(MarketingCoupon).filter(MarketingCoupon.code == clean_code).first()

    if not coupon:
        return {
            "is_valid": False,
            "coupon_code": clean_code,
            "discount_amount": 0.0,
            "final_cart_amount": data.cart_amount,
            "message": f"Coupon code '{clean_code}' is not recognized."
        }

    now_utc = datetime.now(timezone.utc)
    if not coupon.is_active:
        return {
            "is_valid": False,
            "coupon_code": clean_code,
            "discount_amount": 0.0,
            "final_cart_amount": data.cart_amount,
            "message": "This coupon code is currently inactive."
        }

    valid_from = coupon.valid_from.replace(tzinfo=timezone.utc) if coupon.valid_from.tzinfo is None else coupon.valid_from
    valid_until = coupon.valid_until.replace(tzinfo=timezone.utc) if coupon.valid_until.tzinfo is None else coupon.valid_until

    if now_utc < valid_from or now_utc > valid_until:
        return {
            "is_valid": False,
            "coupon_code": clean_code,
            "discount_amount": 0.0,
            "final_cart_amount": data.cart_amount,
            "message": "This coupon code has expired."
        }

    if coupon.usage_count >= coupon.usage_limit:
        return {
            "is_valid": False,
            "coupon_code": clean_code,
            "discount_amount": 0.0,
            "final_cart_amount": data.cart_amount,
            "message": "Maximum usage limit reached for this coupon."
        }

    if data.cart_amount < coupon.min_order_amount:
        return {
            "is_valid": False,
            "coupon_code": clean_code,
            "discount_amount": 0.0,
            "final_cart_amount": data.cart_amount,
            "message": f"Minimum cart amount of Rs. {coupon.min_order_amount:.0f} required for coupon '{clean_code}'."
        }

    # Calculate discount
    if coupon.discount_type == "PERCENTAGE":
        calc_discount = (coupon.discount_value / 100.0) * data.cart_amount
        if coupon.max_discount_cap and calc_discount > coupon.max_discount_cap:
            calc_discount = coupon.max_discount_cap
    else:  # FIXED
        calc_discount = min(coupon.discount_value, data.cart_amount)

    calc_discount = round(calc_discount, 2)
    final_amount = max(0.0, round(data.cart_amount - calc_discount, 2))

    return {
        "is_valid": True,
        "coupon_code": clean_code,
        "discount_amount": calc_discount,
        "final_cart_amount": final_amount,
        "discount_type": coupon.discount_type,
        "discount_value": coupon.discount_value,
        "message": f"Coupon '{clean_code}' applied! You saved Rs. {calc_discount:.2f}."
    }


@router.get("/campaigns", response_model=List[CampaignResponse])
def get_active_campaigns(db: Session = Depends(get_db)):
    """Public: Retrieve active marketing banners and promotional festival highlights."""
    now_utc = datetime.now(timezone.utc)
    campaigns = db.query(MarketingCampaign).filter(MarketingCampaign.is_active == True).order_by(desc(MarketingCampaign.created_at)).all()
    # Filter by dates if set
    valid_campaigns = []
    for c in campaigns:
        if c.start_date:
            sd = c.start_date.replace(tzinfo=timezone.utc) if c.start_date.tzinfo is None else c.start_date
            if now_utc < sd:
                continue
        if c.end_date:
            ed = c.end_date.replace(tzinfo=timezone.utc) if c.end_date.tzinfo is None else c.end_date
            if now_utc > ed:
                continue
        valid_campaigns.append(c)
    return valid_campaigns


# --- Admin Marketing Endpoints ---

@router.get("/admin/coupons", response_model=List[CouponResponse])
def list_admin_coupons(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([ROLE_SUPERADMIN, ROLE_PRODUCT_MANAGER]))
):
    """Admin: List all promotional and discount coupons."""
    return db.query(MarketingCoupon).order_by(desc(MarketingCoupon.created_at)).all()


@router.post("/admin/coupons", response_model=CouponResponse)
def create_coupon(
    data: CouponCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([ROLE_SUPERADMIN, ROLE_PRODUCT_MANAGER]))
):
    """Admin: Issue a new promotional discount coupon code."""
    clean_code = data.code.strip().upper()
    existing = db.query(MarketingCoupon).filter(MarketingCoupon.code == clean_code).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"Coupon code '{clean_code}' already exists.")

    now_utc = datetime.now(timezone.utc)
    coupon = MarketingCoupon(
        code=clean_code,
        description=data.description,
        discount_type=data.discount_type.upper(),
        discount_value=data.discount_value,
        min_order_amount=data.min_order_amount,
        max_discount_cap=data.max_discount_cap,
        valid_from=data.valid_from or now_utc,
        valid_until=data.valid_until or (now_utc.replace(year=now_utc.year + 1)),
        usage_limit=data.usage_limit,
        is_active=data.is_active,
        created_at=now_utc,
        updated_at=now_utc
    )
    db.add(coupon)
    db.commit()
    db.refresh(coupon)

    log_admin_action(
        db,
        admin_email=current_user.email,
        action="COUPON_CREATED",
        entity="MarketingCoupon",
        entity_id=coupon.id,
        details=f"Created coupon '{coupon.code}' with {coupon.discount_type} {coupon.discount_value}"
    )

    return coupon


@router.patch("/admin/coupons/{coupon_id}/toggle")
def toggle_coupon_status(
    coupon_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([ROLE_SUPERADMIN, ROLE_PRODUCT_MANAGER]))
):
    """Admin: Toggle active status of a coupon."""
    coupon = db.query(MarketingCoupon).filter(MarketingCoupon.id == coupon_id).first()
    if not coupon:
        raise HTTPException(status_code=404, detail="Coupon not found")
    coupon.is_active = not coupon.is_active
    coupon.updated_at = datetime.now(timezone.utc)
    db.commit()

    log_admin_action(
        db,
        admin_email=current_user.email,
        action="COUPON_STATUS_TOGGLE",
        entity="MarketingCoupon",
        entity_id=coupon.id,
        details=f"Toggled coupon '{coupon.code}' active state to {coupon.is_active}"
    )

    return {"message": f"Coupon '{coupon.code}' is now {'Active' if coupon.is_active else 'Inactive'}", "is_active": coupon.is_active}


@router.delete("/admin/coupons/{coupon_id}")
def delete_coupon(
    coupon_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([ROLE_SUPERADMIN, ROLE_PRODUCT_MANAGER]))
):
    """Admin: Delete a discount coupon code."""
    coupon = db.query(MarketingCoupon).filter(MarketingCoupon.id == coupon_id).first()
    if not coupon:
        raise HTTPException(status_code=404, detail="Coupon not found")
    code = coupon.code
    db.delete(coupon)
    db.commit()

    log_admin_action(
        db,
        admin_email=current_user.email,
        action="COUPON_DELETED",
        entity="MarketingCoupon",
        entity_id=coupon_id,
        details=f"Deleted coupon '{code}'"
    )

    return {"message": f"Coupon '{code}' deleted successfully"}


@router.get("/admin/campaigns", response_model=List[CampaignResponse])
def list_admin_campaigns(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([ROLE_SUPERADMIN, ROLE_PRODUCT_MANAGER]))
):
    """Admin: List all festival banners and promotional campaigns."""
    return db.query(MarketingCampaign).order_by(desc(MarketingCampaign.created_at)).all()


@router.post("/admin/campaigns", response_model=CampaignResponse)
def create_campaign(
    data: CampaignCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([ROLE_SUPERADMIN, ROLE_PRODUCT_MANAGER]))
):
    """Admin: Launch a new festival or seasonal marketing banner."""
    campaign = MarketingCampaign(
        title=data.title,
        subtitle=data.subtitle,
        badge_text=data.badge_text,
        cta_text=data.cta_text,
        cta_link=data.cta_link,
        banner_theme=data.banner_theme,
        image_url=data.image_url,
        is_active=data.is_active,
        start_date=data.start_date,
        end_date=data.end_date,
        created_at=datetime.now(timezone.utc)
    )
    db.add(campaign)
    db.commit()
    db.refresh(campaign)

    log_admin_action(
        db,
        admin_email=current_user.email,
        action="CAMPAIGN_CREATED",
        entity="MarketingCampaign",
        entity_id=campaign.id,
        details=f"Launched campaign '{campaign.title}'"
    )

    return campaign


@router.patch("/admin/campaigns/{campaign_id}/toggle")
def toggle_campaign_status(
    campaign_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([ROLE_SUPERADMIN, ROLE_PRODUCT_MANAGER]))
):
    """Admin: Enable or disable a promotional campaign banner."""
    campaign = db.query(MarketingCampaign).filter(MarketingCampaign.id == campaign_id).first()
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    campaign.is_active = not campaign.is_active
    db.commit()

    log_admin_action(
        db,
        admin_email=current_user.email,
        action="CAMPAIGN_STATUS_TOGGLE",
        entity="MarketingCampaign",
        entity_id=campaign.id,
        details=f"Toggled campaign '{campaign.title}' active state to {campaign.is_active}"
    )

    return {"message": f"Campaign '{campaign.title}' is now {'Active' if campaign.is_active else 'Inactive'}", "is_active": campaign.is_active}
