import uuid
import string
import random
from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.core.database import get_db
from app.api.v1.endpoints.auth import get_current_user
from app.models.customer import Customer
from app.models.loyalty import LoyaltyAccount, LoyaltyTransaction, NotificationPreference
from app.schemas.loyalty import (
    LoyaltyAccountResponse,
    LoyaltyTransactionResponse,
    RedeemEstimateRequest,
    RedeemEstimateResponse,
    NotificationPreferenceUpdate,
    NotificationPreferenceResponse
)
from app.api.v1.endpoints.customers import get_current_customer

router = APIRouter()


def generate_referral_code(customer_name: Optional[str], phone: str) -> str:
    clean_name = "".join(filter(str.isalnum, customer_name or "BALAJI")).upper()[:6] or "BALAJI"
    suffix = phone[-4:] if len(phone) >= 4 else f"{random.randint(1000, 9999)}"
    return f"SB-{clean_name}-{suffix}"


def get_or_create_loyalty_account(db: Session, customer: Customer) -> LoyaltyAccount:
    account = db.query(LoyaltyAccount).filter(LoyaltyAccount.customer_id == customer.id).first()
    if not account:
        code = generate_referral_code(customer.full_name, customer.phone_number)
        # Ensure code uniqueness
        counter = 1
        while db.query(LoyaltyAccount).filter(LoyaltyAccount.referral_code == code).first():
            code = f"{code[:12]}-{counter}"
            counter += 1

        account = LoyaltyAccount(
            customer_id=customer.id,
            points_balance=50,  # 50 welcome points for new account!
            lifetime_points_earned=50,
            lifetime_points_redeemed=0,
            referral_code=code,
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc)
        )
        db.add(account)
        db.flush()

        # Log welcome points
        welcome_txn = LoyaltyTransaction(
            account_id=account.id,
            transaction_type="EARN",
            points=50,
            balance_after=50,
            description="Welcome Bonus: 50 Balaji Crunch Points credited",
            created_at=datetime.now(timezone.utc)
        )
        db.add(welcome_txn)
        db.commit()
        db.refresh(account)

    return account


@router.get("/my-account", response_model=LoyaltyAccountResponse)
def get_my_loyalty_account(
    db: Session = Depends(get_db),
    customer: Customer = Depends(get_current_customer)
):
    """Customer: View reward points balance, referral code, and recent transaction log."""
    account = get_or_create_loyalty_account(db, customer)
    txns = db.query(LoyaltyTransaction).filter(LoyaltyTransaction.account_id == account.id).order_by(desc(LoyaltyTransaction.created_at)).limit(20).all()

    return {
        "id": account.id,
        "customer_id": customer.id,
        "points_balance": account.points_balance,
        "lifetime_points_earned": account.lifetime_points_earned,
        "lifetime_points_redeemed": account.lifetime_points_redeemed,
        "referral_code": account.referral_code,
        "referral_link": f"/register?ref={account.referral_code}",
        "recent_transactions": [
            {
                "id": t.id,
                "transaction_type": t.transaction_type,
                "points": t.points,
                "balance_after": t.balance_after,
                "description": t.description,
                "created_at": t.created_at
            } for t in txns
        ]
    }


@router.post("/redeem-estimate", response_model=RedeemEstimateResponse)
def estimate_redemption(
    data: RedeemEstimateRequest,
    db: Session = Depends(get_db),
    customer: Customer = Depends(get_current_customer)
):
    """Calculate maximum allowed points redemption against cart total (1 point = Rs. 1, max 25% of cart)."""
    account = get_or_create_loyalty_account(db, customer)
    
    # Policy: 1 point = Rs. 1.00; Max 25% of order can be paid with points
    max_discount_allowed = round(data.cart_amount * 0.25, 2)
    max_points_allowed = min(account.points_balance, int(max_discount_allowed))

    requested = min(data.points_to_redeem, max_points_allowed)
    requested = max(0, requested)

    points_discount = float(requested)
    final_amount = max(0.0, round(data.cart_amount - points_discount, 2))
    remaining = account.points_balance - requested

    return {
        "points_to_redeem": requested,
        "points_discount": points_discount,
        "max_redeemable_points": max_points_allowed,
        "final_cart_amount": final_amount,
        "points_balance_remaining": remaining
    }


@router.get("/preferences", response_model=NotificationPreferenceResponse)
def get_preferences(
    db: Session = Depends(get_db),
    customer: Customer = Depends(get_current_customer)
):
    """Get customer communication channel preferences (Email, SMS, WhatsApp, Push)."""
    pref = db.query(NotificationPreference).filter(NotificationPreference.customer_id == customer.id).first()
    if not pref:
        pref = NotificationPreference(
            customer_id=customer.id,
            email_updates=True,
            sms_updates=True,
            whatsapp_updates=True,
            promotional_push=False,
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc)
        )
        db.add(pref)
        db.commit()
        db.refresh(pref)

    return pref


@router.patch("/preferences", response_model=NotificationPreferenceResponse)
def update_preferences(
    data: NotificationPreferenceUpdate,
    db: Session = Depends(get_db),
    customer: Customer = Depends(get_current_customer)
):
    """Update customer communication channel preferences with explicit consent."""
    pref = db.query(NotificationPreference).filter(NotificationPreference.customer_id == customer.id).first()
    if not pref:
        pref = NotificationPreference(
            customer_id=customer.id,
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc)
        )
        db.add(pref)

    if data.email_updates is not None:
        pref.email_updates = data.email_updates
    if data.sms_updates is not None:
        pref.sms_updates = data.sms_updates
    if data.whatsapp_updates is not None:
        pref.whatsapp_updates = data.whatsapp_updates
    if data.promotional_push is not None:
        pref.promotional_push = data.promotional_push

    pref.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(pref)
    return pref


# --- Admin Endpoints ---

@router.get("/admin/accounts")
def list_loyalty_accounts(
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Admin: Overview of customer loyalty points, referral network, and total points liability."""
    accounts = db.query(LoyaltyAccount).order_by(desc(LoyaltyAccount.points_balance)).offset(skip).limit(limit).all()
    results = []
    for a in accounts:
        cust = a.customer
        results.append({
            "id": a.id,
            "customer_id": a.customer_id,
            "customer_name": cust.full_name if cust else "Unknown",
            "phone_number": cust.phone_number if cust else "N/A",
            "points_balance": a.points_balance,
            "lifetime_points_earned": a.lifetime_points_earned,
            "lifetime_points_redeemed": a.lifetime_points_redeemed,
            "referral_code": a.referral_code,
            "created_at": a.created_at
        })
    return results


@router.post("/admin/adjust-points")
def admin_adjust_points(
    customer_id: str,
    points: int,
    reason: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Admin: Manual adjustment of loyalty points with mandatory audit reason."""
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    account = get_or_create_loyalty_account(db, customer)
    new_balance = max(0, account.points_balance + points)
    account.points_balance = new_balance
    if points > 0:
        account.lifetime_points_earned += points
    else:
        account.lifetime_points_redeemed += abs(points)
    account.updated_at = datetime.now(timezone.utc)

    txn = LoyaltyTransaction(
        account_id=account.id,
        transaction_type="ADMIN_ADJUST",
        points=points,
        balance_after=new_balance,
        description=f"Admin Adjustment ({current_user.email}): {reason}",
        created_at=datetime.now(timezone.utc)
    )
    db.add(txn)
    db.commit()

    return {
        "message": f"Points successfully adjusted by {points}. New balance: {new_balance}",
        "new_balance": new_balance
    }
