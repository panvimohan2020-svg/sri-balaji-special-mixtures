import re
from datetime import datetime, timezone, timedelta
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import desc, func

from app.core.database import get_db
from app.core.rbac import (
    require_roles,
    log_admin_action,
    ROLE_SUPERADMIN,
    ROLE_CUSTOMER_SUPPORT
)
from app.models.user import User
from app.models.feedback import CustomerFeedback
from app.models.order import Order
from app.models.product import Product
from app.schemas.feedback import FeedbackSubmitRequest, FeedbackResponse, FeedbackStatsResponse

router = APIRouter()

SPAM_URL_PATTERN = re.compile(r"(https?://|www\.|\.com|\.org|\.io|\.net|\.ru|\.xyz)", re.IGNORECASE)


@router.post("/submit", response_model=Dict[str, Any], status_code=status.HTTP_201_CREATED)
def submit_feedback(
    payload: FeedbackSubmitRequest,
    db: Session = Depends(get_db)
):
    """
    Public Customer Feedback Submission.
    Includes anti-spam URL protection, duplicate prevention, and verified purchase validation against Orders.
    """
    author = payload.author_name.strip()
    title = payload.title.strip()
    comment = payload.comment.strip()

    # 1. Spam check: Reject URLs in reviews
    if SPAM_URL_PATTERN.search(comment) or SPAM_URL_PATTERN.search(title):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Links and URLs are not permitted in customer reviews to maintain authenticity and prevent spam."
        )

    # 2. Duplicate prevention (last 10 mins from same author & title)
    ten_mins_ago = datetime.now(timezone.utc) - timedelta(minutes=10)
    existing_dup = db.query(CustomerFeedback).filter(
        CustomerFeedback.customer_name == author,
        CustomerFeedback.title == title,
        CustomerFeedback.created_at >= ten_mins_ago
    ).first()
    if existing_dup:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="A similar review was recently submitted. Thank you for your feedback!"
        )

    # 3. Verified Purchase verification against authentic Orders table
    is_verified = False
    linked_order_id = None
    if payload.order_number:
        clean_order_num = payload.order_number.strip().upper()
        matching_order = db.query(Order).filter(Order.order_number == clean_order_num).first()
        if matching_order:
            is_verified = True
            linked_order_id = matching_order.id

    # 4. Resolve Product name if product_id supplied
    prod_name = None
    if payload.product_id:
        prod = db.query(Product).filter(Product.id == payload.product_id).first()
        if prod:
            prod_name = prod.name

    # 5. Create Feedback record
    feedback = CustomerFeedback(
        order_id=linked_order_id,
        order_number=payload.order_number.strip().upper() if payload.order_number else None,
        customer_name=author,
        customer_phone=payload.phone.strip() if payload.phone else None,
        customer_city=payload.city.strip() if payload.city else "Paralakhemundi",
        product_id=payload.product_id,
        product_name=prod_name,
        category=payload.category.upper() if payload.category else "GENERAL",
        rating=payload.rating,
        title=title,
        comment=comment,
        photo_url=payload.photo_url,
        is_verified_purchase=is_verified,
        is_approved=True,  # Standard legitimate reviews are approved by default
        helpful_count=0
    )
    db.add(feedback)
    db.commit()
    db.refresh(feedback)

    return {
        "success": True,
        "id": feedback.id,
        "is_verified_purchase": feedback.is_verified_purchase,
        "message": "Thank you for your valuable feedback! Your review has been recorded."
    }


@router.get("/public")
def get_public_feedback(
    product_id: Optional[str] = None,
    limit: int = Query(20, le=50),
    db: Session = Depends(get_db)
):
    """
    Public: Retrieve approved customer reviews and overall rating metrics.
    """
    query = db.query(CustomerFeedback).filter(CustomerFeedback.is_approved == True)
    if product_id:
        query = query.filter(CustomerFeedback.product_id == product_id)

    total_count = query.count()
    reviews = query.order_by(desc(CustomerFeedback.created_at)).limit(limit).all()

    # Calculate average rating & distribution
    avg_rating = 5.0
    distribution = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
    if total_count > 0:
        ratings_sum = db.query(func.sum(CustomerFeedback.rating)).filter(CustomerFeedback.is_approved == True)
        if product_id:
            ratings_sum = ratings_sum.filter(CustomerFeedback.product_id == product_id)
        avg_rating = round(float(ratings_sum.scalar() or 0.0) / total_count, 1)

        counts = db.query(CustomerFeedback.rating, func.count(CustomerFeedback.id)).filter(
            CustomerFeedback.is_approved == True
        )
        if product_id:
            counts = counts.filter(CustomerFeedback.product_id == product_id)
        for r_val, count in counts.group_by(CustomerFeedback.rating).all():
            if r_val in distribution:
                distribution[r_val] = int(count)

    return {
        "average_rating": avg_rating,
        "total_reviews": total_count,
        "distribution": distribution,
        "reviews": [
            {
                "id": r.id,
                "author_name": r.customer_name,
                "city": r.customer_city or "Paralakhemundi",
                "rating": r.rating,
                "title": r.title,
                "comment": r.comment,
                "category": r.category,
                "product_name": r.product_name,
                "is_verified_purchase": r.is_verified_purchase,
                "photo_url": r.photo_url,
                "helpful_count": r.helpful_count or 0,
                "created_at": r.created_at.isoformat() if r.created_at else None
            }
            for r in reviews
        ]
    }


@router.post("/{feedback_id}/helpful")
def mark_feedback_helpful(feedback_id: str, db: Session = Depends(get_db)):
    """Increment helpful votes on a feedback review."""
    item = db.query(CustomerFeedback).filter(CustomerFeedback.id == feedback_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Review not found.")
    item.helpful_count = (item.helpful_count or 0) + 1
    db.commit()
    return {"success": True, "helpful_count": item.helpful_count}


@router.get("/admin/all")
def get_all_feedback_admin(
    status_filter: Optional[str] = None,
    category: Optional[str] = None,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([ROLE_SUPERADMIN, ROLE_CUSTOMER_SUPPORT]))
):
    """Admin: Access complete feedback ledger with contact and verification details."""
    query = db.query(CustomerFeedback)
    if status_filter == "pending":
        query = query.filter(CustomerFeedback.is_approved == False)
    elif status_filter == "approved":
        query = query.filter(CustomerFeedback.is_approved == True)
    if category:
        query = query.filter(CustomerFeedback.category == category.upper())

    total = query.count()
    items = query.order_by(desc(CustomerFeedback.created_at)).limit(limit).all()

    return {
        "total": total,
        "items": [
            {
                "id": r.id,
                "customer_name": r.customer_name,
                "customer_phone": r.customer_phone,
                "customer_city": r.customer_city,
                "order_number": r.order_number,
                "rating": r.rating,
                "title": r.title,
                "comment": r.comment,
                "category": r.category,
                "product_name": r.product_name,
                "is_verified_purchase": r.is_verified_purchase,
                "is_approved": r.is_approved,
                "helpful_count": r.helpful_count,
                "created_at": r.created_at.isoformat() if r.created_at else None
            }
            for r in items
        ]
    }


@router.patch("/admin/{feedback_id}/toggle-approval")
def toggle_feedback_approval(
    feedback_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([ROLE_SUPERADMIN, ROLE_CUSTOMER_SUPPORT]))
):
    """Admin: Approve or hide a customer review."""
    item = db.query(CustomerFeedback).filter(CustomerFeedback.id == feedback_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Review not found.")
    item.is_approved = not item.is_approved
    db.commit()

    log_admin_action(
        db,
        admin_email=current_user.email,
        action="REVIEW_APPROVAL_TOGGLE",
        entity="CustomerFeedback",
        entity_id=item.id,
        details=f"Review approval set to {item.is_approved} for '{item.title}' by {item.customer_name}"
    )

    return {"success": True, "id": item.id, "is_approved": item.is_approved}


@router.delete("/admin/{feedback_id}")
def delete_feedback(
    feedback_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([ROLE_SUPERADMIN, ROLE_CUSTOMER_SUPPORT]))
):
    """Admin: Permanently delete inappropriate or spam customer review."""
    item = db.query(CustomerFeedback).filter(CustomerFeedback.id == feedback_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Review not found.")
    
    title = item.title
    db.delete(item)
    db.commit()

    log_admin_action(
        db,
        admin_email=current_user.email,
        action="REVIEW_DELETED",
        entity="CustomerFeedback",
        entity_id=feedback_id,
        details=f"Deleted review '{title}'"
    )

    return {"success": True, "message": "Review deleted successfully."}
