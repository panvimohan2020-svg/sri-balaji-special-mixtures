from datetime import datetime, timezone, timedelta
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from sqlalchemy import func
from jose import jwt, JWTError

from app.core.config import settings
from app.core.database import get_db
from app.core.security import get_password_hash, verify_password, ALGORITHM
from app.models.customer import Customer, CustomerAddress, CustomerNotification
from app.models.admin_security import OwnerInvitation, OwnerSetupState
from app.models.order import Order
from app.schemas.customer import (
    CustomerRegisterRequest,
    CustomerLoginRequest,
    CustomerOTPRequest,
    CustomerResponse,
    CustomerAuthResponse,
    CustomerProfileUpdate,
    AddressCreate,
    AddressUpdate,
    AddressResponse,
    NotificationResponse
)
from app.schemas.order import OrderResponse
from app.core.rbac import (
    require_roles,
    log_admin_action,
    ROLE_SUPERADMIN,
    ROLE_ORDER_MANAGER,
    ROLE_CUSTOMER_SUPPORT
)
from app.models.user import User

router = APIRouter()
security_bearer = HTTPBearer(auto_error=False)


def create_customer_token(customer_id: str, phone: str) -> str:
    expires = datetime.now(timezone.utc) + timedelta(days=30)
    payload = {
        "sub": customer_id,
        "phone": phone,
        "type": "customer",
        "exp": expires
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=ALGORITHM)


def get_current_customer(
    auth: Optional[HTTPAuthorizationCredentials] = Depends(security_bearer),
    db: Session = Depends(get_db)
) -> Customer:
    if not auth or not auth.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Customer authentication required. Please sign in.",
            headers={"WWW-Authenticate": "Bearer"}
        )
    try:
        payload = jwt.decode(auth.credentials, settings.SECRET_KEY, algorithms=[ALGORITHM])
        customer_id: str = payload.get("sub")
        token_type: str = payload.get("type")
        if not customer_id or token_type != "customer":
            raise HTTPException(status_code=401, detail="Invalid customer credentials")
    except JWTError:
        raise HTTPException(status_code=401, detail="Session expired or invalid. Please sign in again.")

    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if not customer or not customer.is_active:
        raise HTTPException(status_code=401, detail="Customer account disabled or not found.")
    return customer


@router.post("/request-otp")
def request_otp(data: CustomerOTPRequest, db: Session = Depends(get_db)):
    phone = data.phone_number.strip().replace(" ", "").replace("-", "")
    if len(phone) < 10:
        raise HTTPException(status_code=400, detail="Invalid mobile number.")
    # For local test / sandbox environment, OTP is standardized to 123456
    return {
        "message": f"OTP sent to +91 {phone[-10:]}",
        "phone": phone,
        "sandbox_otp_hint": "123456 (Development Mode)"
    }


@router.post("/register", response_model=CustomerAuthResponse)
def register_customer(data: CustomerRegisterRequest, db: Session = Depends(get_db)):
    phone = data.phone_number.strip().replace(" ", "").replace("-", "")
    if len(phone) < 10:
        raise HTTPException(status_code=400, detail="Please enter a valid 10-digit mobile number.")

    existing = db.query(Customer).filter(Customer.phone_number == phone).first()
    if existing:
        raise HTTPException(status_code=400, detail="Account with this phone number already exists. Please log in.")

    # Guard: Reserve business owner and administrative emails for the Staff & Admin Portal
    clean_email = data.email.strip().lower() if data.email else None
    if clean_email:
        reserved_owner_emails = {
            "sribalajispecialmixtures@gmail.com",
            settings.BUSINESS_OWNER_EMAIL.strip().lower(),
            settings.FIRST_SUPERUSER_EMAIL.strip().lower()
        }
        is_owner_invite = db.query(OwnerInvitation).filter(func.lower(OwnerInvitation.owner_email) == clean_email).first()
        is_admin_user = db.query(User).filter(func.lower(User.email) == clean_email).first()
        is_owner_state = db.query(OwnerSetupState).filter(func.lower(OwnerSetupState.owner_email) == clean_email).first()
        if clean_email in reserved_owner_emails or is_owner_invite or is_admin_user or is_owner_state:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="This email address is reserved exclusively for the Staff & Admin Portal and cannot be registered as a retail customer account."
            )

    hashed_pw = get_password_hash(data.password) if data.password else None
    customer = Customer(
        phone_number=phone,
        full_name=data.full_name.strip(),
        email=clean_email,
        hashed_password=hashed_pw,
        is_verified=True,
        is_active=True
    )
    db.add(customer)
    db.commit()
    db.refresh(customer)

    token = create_customer_token(customer.id, customer.phone_number)
    return {
        "access_token": token,
        "token_type": "bearer",
        "customer": customer
    }


@router.post("/login", response_model=CustomerAuthResponse)
def login_customer(data: CustomerLoginRequest, db: Session = Depends(get_db)):
    phone = data.phone_number.strip().replace(" ", "").replace("-", "")
    customer = db.query(Customer).filter(Customer.phone_number == phone).first()

    # If customer doesn't exist, allow auto-creation on valid OTP verification (OTP login flow)
    if not customer:
        if data.otp == "123456":
            customer = Customer(
                phone_number=phone,
                full_name=f"Customer {phone[-4:]}",
                is_verified=True,
                is_active=True
            )
            db.add(customer)
            db.commit()
            db.refresh(customer)
        else:
            raise HTTPException(status_code=404, detail="Customer account not found. Please register or enter valid OTP.")

    # Validate either password or OTP
    if data.password:
        if not customer.hashed_password or not verify_password(data.password, customer.hashed_password):
            raise HTTPException(status_code=401, detail="Incorrect password. Use OTP login or reset password.")
    elif data.otp:
        if data.otp != "123456":
            raise HTTPException(status_code=401, detail="Invalid OTP code entered.")
    else:
        raise HTTPException(status_code=400, detail="Password or OTP required for login.")

    customer.last_login = datetime.now(timezone.utc)
    db.commit()

    token = create_customer_token(customer.id, customer.phone_number)
    return {
        "access_token": token,
        "token_type": "bearer",
        "customer": customer
    }


@router.get("/me", response_model=CustomerResponse)
def get_profile(current_customer: Customer = Depends(get_current_customer)):
    return current_customer


@router.patch("/me", response_model=CustomerResponse)
def update_profile(
    data: CustomerProfileUpdate,
    db: Session = Depends(get_db),
    current_customer: Customer = Depends(get_current_customer)
):
    if data.full_name is not None:
        current_customer.full_name = data.full_name.strip()
    if data.email is not None:
        clean_email = data.email.strip().lower() if data.email else None
        if clean_email:
            reserved_owner_emails = {
                "sribalajispecialmixtures@gmail.com",
                settings.BUSINESS_OWNER_EMAIL.strip().lower(),
                settings.FIRST_SUPERUSER_EMAIL.strip().lower()
            }
            is_owner_invite = db.query(OwnerInvitation).filter(func.lower(OwnerInvitation.owner_email) == clean_email).first()
            is_admin_user = db.query(User).filter(func.lower(User.email) == clean_email).first()
            is_owner_state = db.query(OwnerSetupState).filter(func.lower(OwnerSetupState.owner_email) == clean_email).first()
            if clean_email in reserved_owner_emails or is_owner_invite or is_admin_user or is_owner_state:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="This email address is reserved exclusively for the Staff & Admin Portal."
                )
        current_customer.email = clean_email
    db.commit()
    db.refresh(current_customer)
    return current_customer


# --- Customer Addresses ---

@router.get("/addresses", response_model=List[AddressResponse])
def get_addresses(
    db: Session = Depends(get_db),
    current_customer: Customer = Depends(get_current_customer)
):
    return db.query(CustomerAddress).filter(
        CustomerAddress.customer_id == current_customer.id
    ).order_by(CustomerAddress.is_default.desc(), CustomerAddress.created_at.desc()).all()


@router.post("/addresses", response_model=AddressResponse)
def create_address(
    data: AddressCreate,
    db: Session = Depends(get_db),
    current_customer: Customer = Depends(get_current_customer)
):
    # If default is requested, unset other defaults
    if data.is_default:
        db.query(CustomerAddress).filter(
            CustomerAddress.customer_id == current_customer.id
        ).update({"is_default": False})

    address = CustomerAddress(
        customer_id=current_customer.id,
        **data.model_dump()
    )
    db.add(address)
    db.flush()

    if data.is_default:
        current_customer.default_address_id = address.id

    db.commit()
    db.refresh(address)
    return address


@router.patch("/addresses/{address_id}", response_model=AddressResponse)
def update_address(
    address_id: str,
    data: AddressUpdate,
    db: Session = Depends(get_db),
    current_customer: Customer = Depends(get_current_customer)
):
    address = db.query(CustomerAddress).filter(
        CustomerAddress.id == address_id,
        CustomerAddress.customer_id == current_customer.id
    ).first()
    if not address:
        raise HTTPException(status_code=404, detail="Address not found.")

    update_dict = data.model_dump(exclude_unset=True)
    if update_dict.get("is_default"):
        db.query(CustomerAddress).filter(
            CustomerAddress.customer_id == current_customer.id
        ).update({"is_default": False})
        current_customer.default_address_id = address.id

    for k, v in update_dict.items():
        setattr(address, k, v)

    db.commit()
    db.refresh(address)
    return address


@router.delete("/addresses/{address_id}")
def delete_address(
    address_id: str,
    db: Session = Depends(get_db),
    current_customer: Customer = Depends(get_current_customer)
):
    address = db.query(CustomerAddress).filter(
        CustomerAddress.id == address_id,
        CustomerAddress.customer_id == current_customer.id
    ).first()
    if not address:
        raise HTTPException(status_code=404, detail="Address not found.")

    db.delete(address)
    db.commit()
    return {"message": "Address deleted successfully"}


# --- Customer Orders ---

@router.get("/orders", response_model=List[OrderResponse])
def get_customer_orders(
    db: Session = Depends(get_db),
    current_customer: Customer = Depends(get_current_customer)
):
    return db.query(Order).filter(
        (Order.customer_id == current_customer.id) | (Order.phone_number == current_customer.phone_number)
    ).order_by(Order.created_at.desc()).all()


# --- Customer Notifications ---

@router.get("/notifications", response_model=List[NotificationResponse])
def get_notifications(
    db: Session = Depends(get_db),
    current_customer: Customer = Depends(get_current_customer)
):
    return db.query(CustomerNotification).filter(
        CustomerNotification.customer_id == current_customer.id
    ).order_by(CustomerNotification.created_at.desc()).limit(30).all()


@router.patch("/notifications/{notification_id}/read")
def mark_notification_read(
    notification_id: str,
    db: Session = Depends(get_db),
    current_customer: Customer = Depends(get_current_customer)
):
    notif = db.query(CustomerNotification).filter(
        CustomerNotification.id == notification_id,
        CustomerNotification.customer_id == current_customer.id
    ).first()
    if notif:
        notif.is_read = True
        db.commit()
    return {"message": "Notification marked as read"}


# --- Admin Customer Management Endpoints ---

@router.get("/admin/all")
def get_all_customers_admin(
    search: Optional[str] = None,
    limit: int = 100,
    offset: int = 0,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([ROLE_SUPERADMIN, ROLE_ORDER_MANAGER, ROLE_CUSTOMER_SUPPORT]))
):
    """Admin: Access verified retail customer registry with order counts."""
    query = db.query(Customer)
    if search:
        s = f"%{search.strip()}%"
        query = query.filter((Customer.full_name.ilike(s)) | (Customer.phone_number.ilike(s)) | (Customer.email.ilike(s)))

    total = query.count()
    customers = query.order_by(Customer.created_at.desc()).offset(offset).limit(limit).all()

    results = []
    for c in customers:
        order_count = db.query(Order).filter(
            (Order.customer_id == c.id) | (Order.phone_number == c.phone_number)
        ).count()
        results.append({
            "id": c.id,
            "full_name": c.full_name,
            "phone_number": c.phone_number,
            "email": c.email,
            "is_active": c.is_active,
            "created_at": c.created_at.isoformat() if c.created_at else None,
            "total_orders": order_count
        })

    return {"total": total, "customers": results}


@router.get("/admin/{customer_id}")
def get_customer_details_admin(
    customer_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([ROLE_SUPERADMIN, ROLE_ORDER_MANAGER, ROLE_CUSTOMER_SUPPORT]))
):
    """Admin: Get deep profile of a customer including addresses and order history."""
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found.")

    addresses = db.query(CustomerAddress).filter(CustomerAddress.customer_id == customer.id).all()
    orders = db.query(Order).filter(
        (Order.customer_id == customer.id) | (Order.phone_number == customer.phone_number)
    ).order_by(Order.created_at.desc()).all()

    return {
        "customer": {
            "id": customer.id,
            "full_name": customer.full_name,
            "phone_number": customer.phone_number,
            "email": customer.email,
            "is_active": customer.is_active,
            "created_at": customer.created_at.isoformat() if customer.created_at else None
        },
        "addresses": [
            {
                "id": a.id,
                "label": a.label,
                "address_line1": a.address_line1,
                "address_line2": a.address_line2,
                "city": a.city,
                "state": a.state,
                "pin_code": a.pin_code,
                "is_default": a.is_default
            }
            for a in addresses
        ],
        "orders": [
            {
                "id": o.id,
                "order_number": o.order_number,
                "status": o.status,
                "order_type": o.order_type,
                "total_estimated_amount": float(o.total_estimated_amount or 0.0),
                "created_at": o.created_at.isoformat() if o.created_at else None
            }
            for o in orders
        ]
    }


@router.patch("/admin/{customer_id}/toggle-status")
def toggle_customer_status(
    customer_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([ROLE_SUPERADMIN, ROLE_CUSTOMER_SUPPORT]))
):
    """Admin: Toggle active status of a customer account."""
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found.")

    customer.is_active = not customer.is_active
    db.commit()

    log_admin_action(
        db,
        admin_email=current_user.email,
        action="CUSTOMER_STATUS_TOGGLE",
        entity="Customer",
        entity_id=customer.id,
        details=f"Customer '{customer.phone_number}' active status set to {customer.is_active}"
    )

    return {"id": customer.id, "is_active": customer.is_active}
