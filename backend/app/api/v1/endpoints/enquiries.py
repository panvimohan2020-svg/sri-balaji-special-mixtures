from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.order import WholesaleEnquiry
from app.schemas.order import WholesaleEnquiryCreate, WholesaleEnquiryResponse
from app.api.v1.endpoints.auth import get_current_user

router = APIRouter()


@router.post("/", response_model=WholesaleEnquiryResponse, status_code=status.HTTP_201_CREATED)
def submit_wholesale_enquiry(enquiry_in: WholesaleEnquiryCreate, db: Session = Depends(get_db)):
    """Public endpoint to record wholesale B2B inquiries."""
    enquiry = WholesaleEnquiry(**enquiry_in.model_dump())
    db.add(enquiry)
    db.commit()
    db.refresh(enquiry)
    return enquiry


@router.get("/", response_model=List[WholesaleEnquiryResponse])
def get_wholesale_enquiries(
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Admin-only endpoint to review incoming B2B partner leads."""
    return db.query(WholesaleEnquiry).order_by(WholesaleEnquiry.created_at.desc()).offset(skip).limit(limit).all()

