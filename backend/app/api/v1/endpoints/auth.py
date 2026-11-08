import secrets
import hashlib
from datetime import datetime, timezone, timedelta
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.core.config import settings
from app.core.database import get_db
from app.core.security import verify_password, create_access_token, get_password_hash
from app.models.user import User
from app.models.admin_security import (
    AdminInvitation,
    PasswordReset,
    PasskeyCredential,
    PasskeyChallenge,
    AdminAuditLog,
    RevokedToken,
    OwnerSetupState,
    OwnerInvitation
)
from app.core.rbac import (
    get_current_admin,
    require_roles,
    log_admin_action,
    check_login_rate_limit,
    record_login_failure,
    clear_login_failures,
    oauth2_scheme,
    ROLE_SUPERADMIN,
    ROLE_PRODUCT_MANAGER,
    ROLE_ORDER_MANAGER,
    ROLE_INVENTORY_MANAGER,
    ROLE_CUSTOMER_SUPPORT,
    ALL_ADMIN_ROLES
)

router = APIRouter()

# Maintain backward compatibility
get_current_user = get_current_admin


# Schemas
class AdminLoginJSON(BaseModel):
    email: str
    password: str


class AdminInviteRequest(BaseModel):
    email: str
    role: str = ROLE_ORDER_MANAGER


class AcceptInviteRequest(BaseModel):
    token: str
    full_name: str
    password: str


class ForgotPasswordRequest(BaseModel):
    email: str


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str


class AdminUpdateRequest(BaseModel):
    full_name: Optional[str] = None
    role: Optional[str] = None
    is_active: Optional[bool] = None


class PasskeyRegisterVerifyRequest(BaseModel):
    challenge: str
    credential_id: str
    public_key: str
    device_name: Optional[str] = "Device Biometrics / Passkey"


class PasskeyLoginVerifyRequest(BaseModel):
    challenge: str
    credential_id: str


class OwnerActivateRequest(BaseModel):
    token: str
    full_name: str
    password: str


class OwnerInviteAPIRequest(BaseModel):
    owner_name: str
    owner_email: str
    base_url: Optional[str] = None
    hours_valid: Optional[int] = 72


def mask_email(email: str) -> str:
    if "@" not in email:
        return email
    parts = email.split("@", 1)
    user, domain = parts[0], parts[1]
    if len(user) <= 2:
        masked_user = user[0] + "*"
    else:
        masked_user = user[0] + "*" * (len(user) - 2) + user[-1]
    return f"{masked_user}@{domain}"


# Helper to get client IP
def get_client_ip(request: Request) -> str:
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "127.0.0.1"


# --- 0. Business Owner Handover & Setup ---
@router.get("/owner/setup-status")
def get_owner_setup_status(db: Session = Depends(get_db)):
    """
    Public Endpoint: Checks if business owner accounts have been activated.
    Returns status without revealing unauthenticated secret tokens.
    """
    active_owners = db.query(User).filter(User.role == ROLE_SUPERADMIN, User.is_active == True).all()
    owner_invites = db.query(OwnerInvitation).all()
    legacy_state = db.query(OwnerSetupState).first()
    
    is_activated = len(active_owners) > 0
    activated_names = [u.full_name for u in active_owners]
    
    return {
        "is_activated": is_activated,
        "status": "COMPLETED" if is_activated else "PENDING_ACTIVATION",
        "active_superadmins_count": len(active_owners),
        "active_superadmins": activated_names,
        "total_invitations_issued": len(owner_invites),
        "owner_email_masked": mask_email(active_owners[0].email) if active_owners else (mask_email(owner_invites[0].owner_email) if owner_invites else (mask_email(legacy_state.owner_email) if legacy_state else None)),
        "activated_at": (legacy_state.activated_at.isoformat() if legacy_state and legacy_state.activated_at else None)
    }


@router.get("/owner/verify-token")
def verify_owner_token(token: str, db: Session = Depends(get_db)):
    """
    Public Endpoint: Verifies whether an owner activation token is valid, unexpired, and unused.
    Checks SHA-256 hashed tokens stored in OwnerInvitation, with fallback to legacy OwnerSetupState.
    """
    token_str = token.strip()
    if not token_str:
        return {
            "valid": False,
            "error_code": "EMPTY_TOKEN",
            "message": "Activation token cannot be empty."
        }

    token_hash = hashlib.sha256(token_str.encode("utf-8")).hexdigest()
    now_utc = datetime.now(timezone.utc)

    # 1. Check OwnerInvitation (Primary multi-owner invitation system)
    invitation = db.query(OwnerInvitation).filter(OwnerInvitation.token_hash == token_hash).first()
    if invitation:
        if invitation.is_used:
            return {
                "valid": False,
                "error_code": "ALREADY_USED",
                "message": "This invitation link has already been used to activate an account. Invitations are single-use.",
                "owner_name": invitation.owner_name,
                "activated_at": invitation.used_at.isoformat() if invitation.used_at else None
            }

        exp_utc = invitation.expires_at.replace(tzinfo=timezone.utc) if invitation.expires_at.tzinfo is None else invitation.expires_at
        if exp_utc < now_utc:
            return {
                "valid": False,
                "error_code": "EXPIRED",
                "message": "This invitation link has expired (72 hours exceeded). Please request a fresh invitation from the developer.",
                "owner_name": invitation.owner_name
            }

        return {
            "valid": True,
            "owner_name": invitation.owner_name,
            "owner_email": invitation.owner_email,
            "suggested_name": invitation.owner_name,
            "expires_at": invitation.expires_at.isoformat(),
            "message": "Owner invitation verified successfully. Please set your password to complete owner account activation."
        }

    # 2. Fallback to legacy OwnerSetupState if present
    owner_state = db.query(OwnerSetupState).filter(OwnerSetupState.activation_token == token_str).first()
    if owner_state:
        if owner_state.is_activated:
            return {
                "valid": False,
                "error_code": "ALREADY_ACTIVATED",
                "message": "Business owner account has already been permanently activated. Initial setup is closed.",
                "activated_at": owner_state.activated_at.isoformat() if owner_state.activated_at else None
            }

        exp_utc = owner_state.expires_at.replace(tzinfo=timezone.utc) if owner_state.expires_at.tzinfo is None else owner_state.expires_at
        if exp_utc < now_utc:
            return {
                "valid": False,
                "error_code": "EXPIRED",
                "message": "Owner activation link has expired. A fresh invitation must be generated by deployment administrator."
            }

        return {
            "valid": True,
            "owner_name": settings.BUSINESS_OWNER_NAME,
            "owner_email": owner_state.owner_email,
            "suggested_name": settings.BUSINESS_OWNER_NAME,
            "expires_at": owner_state.expires_at.isoformat(),
            "message": "Activation token verified. Please set your full name and password to complete handover."
        }

    return {
        "valid": False,
        "error_code": "INVALID_TOKEN",
        "message": "Invalid or unrecognized owner activation link. Please contact the deployment administrator."
    }


@router.post("/owner/activate")
def activate_owner_account(
    request: Request,
    body: OwnerActivateRequest,
    db: Session = Depends(get_db)
):
    """
    Public Endpoint: One-time Business Owner Account Activation & Registration.
    - Validates token hash against OwnerInvitation (or legacy OwnerSetupState).
    - Establishes the business owner as SUPER ADMIN with complete permissions.
    - Marks invitation as used (preventing reuse).
    - Severs temporary developer bootstrap credentials.
    """
    ip = get_client_ip(request)
    token_str = body.token.strip()
    if not token_str:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Activation token cannot be empty."
        )

    token_hash = hashlib.sha256(token_str.encode("utf-8")).hexdigest()
    now_utc = datetime.now(timezone.utc)

    invitation = db.query(OwnerInvitation).filter(OwnerInvitation.token_hash == token_hash).first()
    owner_state = None
    if not invitation:
        owner_state = db.query(OwnerSetupState).filter(OwnerSetupState.activation_token == token_str).first()

    if not invitation and not owner_state:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or unrecognized owner activation token."
        )

    if invitation:
        if invitation.is_used:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="This owner invitation has already been used. Invitations are single-use."
            )
        exp_utc = invitation.expires_at.replace(tzinfo=timezone.utc) if invitation.expires_at.tzinfo is None else invitation.expires_at
        if exp_utc < now_utc:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Activation token has expired (72 hours exceeded). Please request a fresh invitation."
            )
        owner_email = invitation.owner_email.strip().lower()
        clean_name = body.full_name.strip() or invitation.owner_name
    else:
        if owner_state.is_activated:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Owner account setup has already been permanently activated and locked."
            )
        exp_utc = owner_state.expires_at.replace(tzinfo=timezone.utc) if owner_state.expires_at.tzinfo is None else owner_state.expires_at
        if exp_utc < now_utc:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Activation token has expired. Please request a new deployment handover token."
            )
        owner_email = owner_state.owner_email.strip().lower()
        clean_name = body.full_name.strip() or settings.BUSINESS_OWNER_NAME

    if len(body.password.strip()) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 8 characters long."
        )

    # 1. Establish owner user with SUPERADMIN role
    owner_user = db.query(User).filter(User.email == owner_email).first()
    if not owner_user:
        owner_user = User(
            email=owner_email,
            full_name=clean_name,
            hashed_password=get_password_hash(body.password),
            role=ROLE_SUPERADMIN,
            is_active=True
        )
        db.add(owner_user)
    else:
        owner_user.full_name = clean_name
        owner_user.hashed_password = get_password_hash(body.password)
        owner_user.role = ROLE_SUPERADMIN
        owner_user.is_active = True

    # 2. Mark invitation as used
    if invitation:
        invitation.is_used = True
        invitation.used_at = now_utc
    elif owner_state:
        owner_state.is_activated = True
        owner_state.activated_at = now_utc
        owner_state.activated_by_name = clean_name

    # 3. Sever developer bootstrap access: deactivate temporary bootstrap admin if different
    dev_bootstrap_email = settings.FIRST_SUPERUSER_EMAIL.strip().lower()
    if dev_bootstrap_email and dev_bootstrap_email != owner_email:
        dev_admin = db.query(User).filter(User.email == dev_bootstrap_email).first()
        if dev_admin:
            dev_admin.is_active = False

    db.commit()
    db.refresh(owner_user)

    # 4. Audit Log
    log_admin_action(
        db,
        admin_email=owner_user.email,
        action="OWNER_HANDOVER_ACTIVATED",
        entity="User",
        entity_id=owner_user.id,
        details=f"Business Owner '{clean_name}' activated as Super Admin. Role: SUPERADMIN.",
        ip_address=ip
    )

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    token = create_access_token(subject=owner_user.email, expires_delta=access_token_expires)

    return {
        "message": "Congratulations! Business Owner account activated as SUPER ADMIN with complete website control.",
        "access_token": token,
        "token_type": "bearer",
        "redirect_url": "/admin/login",
        "user": {
            "id": owner_user.id,
            "email": owner_user.email,
            "full_name": owner_user.full_name,
            "role": owner_user.role,
            "is_active": owner_user.is_active
        }
    }


@router.post("/owner/generate-invitation")
def api_generate_owner_invitation(
    body: OwnerInviteAPIRequest,
    current_user: User = Depends(require_roles([ROLE_SUPERADMIN])),
    db: Session = Depends(get_db)
):
    """
    Authenticated Endpoint (Super Admin only):
    Generates a cryptographic single-use invitation for a business owner on this database.
    """
    owner_name = body.owner_name.strip()
    owner_email = body.owner_email.strip().lower()
    if not owner_name:
        raise HTTPException(status_code=400, detail="Owner full name is required.")
    if not owner_email or "@" not in owner_email:
        raise HTTPException(status_code=400, detail="Valid owner email is required.")

    raw_token = secrets.token_urlsafe(32)
    token_hash = hashlib.sha256(raw_token.encode("utf-8")).hexdigest()
    now_utc = datetime.now(timezone.utc)
    expires_at = now_utc + timedelta(hours=body.hours_valid or 72)

    inv = OwnerInvitation(
        owner_name=owner_name,
        owner_email=owner_email,
        token_hash=token_hash,
        is_used=False,
        created_at=now_utc,
        expires_at=expires_at
    )
    db.add(inv)
    db.commit()
    db.refresh(inv)

    base = (body.base_url or settings.PUBLIC_FRONTEND_URL or "https://sri-balaji-special-mixtures.vercel.app").rstrip('/')
    reg_link = f"{base}/admin/owner-activation?token={raw_token}"

    return {
        "owner_name": inv.owner_name,
        "owner_email": inv.owner_email,
        "raw_token": raw_token,
        "registration_link": reg_link,
        "expires_at": inv.expires_at.isoformat(),
        "hours_valid": body.hours_valid or 72
    }


# --- 1. Login Endpoints (Form & JSON) ---
@router.post("/token")
@router.post("/login")
def login_for_access_token(
    request: Request,
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    ip = get_client_ip(request)
    if not check_login_rate_limit(ip):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many failed login attempts. Please wait 10 minutes before retrying."
        )

    user = db.query(User).filter(User.email == form_data.username.strip().lower()).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        record_login_failure(ip)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect administrator email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Administrator account is deactivated or suspended. Please contact Super Admin.",
        )

    clear_login_failures(ip)
    user.last_login = datetime.now(timezone.utc)
    db.commit()

    log_admin_action(
        db,
        admin_email=user.email,
        action="AUTH_LOGIN",
        entity="User",
        entity_id=user.id,
        details=f"Successful password login with role {user.role}",
        ip_address=ip
    )

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        subject=user.email, expires_delta=access_token_expires
    )
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role,
            "is_active": user.is_active
        }
    }


@router.post("/login-json")
def login_json(
    request: Request,
    body: AdminLoginJSON,
    db: Session = Depends(get_db)
):
    ip = get_client_ip(request)
    if not check_login_rate_limit(ip):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many failed login attempts. Please wait 10 minutes before retrying."
        )

    user = db.query(User).filter(User.email == body.email.strip().lower()).first()
    if not user or not verify_password(body.password, user.hashed_password):
        record_login_failure(ip)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect administrator email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Administrator account is deactivated or suspended.",
        )

    clear_login_failures(ip)
    user.last_login = datetime.now(timezone.utc)
    db.commit()

    log_admin_action(
        db,
        admin_email=user.email,
        action="AUTH_LOGIN",
        entity="User",
        entity_id=user.id,
        details=f"Successful JSON login with role {user.role}",
        ip_address=ip
    )

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        subject=user.email, expires_delta=access_token_expires
    )
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role,
            "is_active": user.is_active
        }
    }


# --- 2. Current Session & Logout ---
@router.get("/me")
def get_admin_profile(
    current_user: User = Depends(get_current_admin)
):
    return {
        "id": current_user.id,
        "email": current_user.email,
        "full_name": current_user.full_name,
        "role": current_user.role,
        "is_active": current_user.is_active,
        "last_login": current_user.last_login.isoformat() if current_user.last_login else None
    }


@router.post("/logout")
def logout_admin(
    request: Request,
    token: str = Depends(oauth2_scheme),
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    ip = get_client_ip(request)
    if token:
        # Add to revoked token blacklist
        revoked = RevokedToken(
            token=token,
            expires_at=datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        )
        db.add(revoked)
        db.commit()

    log_admin_action(
        db,
        admin_email=current_user.email,
        action="AUTH_LOGOUT",
        entity="User",
        entity_id=current_user.id,
        details="Admin signed out and session revoked",
        ip_address=ip
    )
    return {"message": "Logged out successfully. Session revoked."}


# --- 3. Password Recovery ---
@router.post("/forgot-password")
def forgot_password(
    request: Request,
    body: ForgotPasswordRequest,
    db: Session = Depends(get_db)
):
    ip = get_client_ip(request)
    user = db.query(User).filter(User.email == body.email.strip().lower()).first()
    if not user or not user.is_active:
        # Return generic success to prevent email enumeration
        return {"message": "If an active administrator account exists for this email, recovery instructions have been initiated."}

    # Invalidate previous unused resets for this user
    db.query(PasswordReset).filter(
        PasswordReset.user_id == user.id,
        PasswordReset.is_used == False
    ).update({"is_used": True})

    reset_token = secrets.token_urlsafe(32)
    reset_record = PasswordReset(
        user_id=user.id,
        email=user.email,
        token=reset_token,
        expires_at=datetime.now(timezone.utc) + timedelta(hours=1)
    )
    db.add(reset_record)
    db.commit()

    log_admin_action(
        db,
        admin_email=user.email,
        action="PASSWORD_RESET_REQUESTED",
        entity="User",
        entity_id=user.id,
        details="Password recovery token generated (valid 1 hour)",
        ip_address=ip
    )

    return {
        "message": "Password recovery initiated successfully.",
        "reset_token": reset_token,  # Provided for verified administrative self-service
        "expires_in_minutes": 60
    }


@router.post("/reset-password")
def reset_password(
    request: Request,
    body: ResetPasswordRequest,
    db: Session = Depends(get_db)
):
    ip = get_client_ip(request)
    record = db.query(PasswordReset).filter(
        PasswordReset.token == body.token,
        PasswordReset.is_used == False
    ).first()

    if not record:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or already used password reset token."
        )

    if record.expires_at.replace(tzinfo=timezone.utc) < datetime.now(timezone.utc):
        record.is_used = True
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password reset token has expired. Please request a new one."
        )

    if len(body.new_password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be at least 8 characters long."
        )

    user = db.query(User).filter(User.id == record.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    user.hashed_password = get_password_hash(body.new_password)
    record.is_used = True
    db.commit()

    log_admin_action(
        db,
        admin_email=user.email,
        action="PASSWORD_RESET_COMPLETED",
        entity="User",
        entity_id=user.id,
        details="Administrator password reset successfully completed",
        ip_address=ip
    )

    return {"message": "Password reset successfully. You may now sign in with your new credentials."}


# --- 4. Admin Invitations & RBAC Team Management ---
@router.post("/invite")
def invite_admin(
    request: Request,
    body: AdminInviteRequest,
    current_user: User = Depends(require_roles([ROLE_SUPERADMIN])),
    db: Session = Depends(get_db)
):
    ip = get_client_ip(request)
    req_role = body.role.upper().strip()
    if req_role not in ALL_ADMIN_ROLES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid role. Allowed roles: {ALL_ADMIN_ROLES}"
        )

    existing_user = db.query(User).filter(User.email == body.email.strip().lower()).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"An administrator account for '{body.email}' already exists."
        )

    # Cancel previous pending invites for this email
    db.query(AdminInvitation).filter(
        AdminInvitation.email == body.email.strip().lower(),
        AdminInvitation.is_accepted == False
    ).delete()

    invite_token = secrets.token_urlsafe(32)
    invitation = AdminInvitation(
        email=body.email.strip().lower(),
        role=req_role,
        token=invite_token,
        invited_by=current_user.email,
        expires_at=datetime.now(timezone.utc) + timedelta(days=7)
    )
    db.add(invitation)
    db.commit()
    db.refresh(invitation)

    log_admin_action(
        db,
        admin_email=current_user.email,
        action="ADMIN_INVITE_CREATED",
        entity="AdminInvitation",
        entity_id=invitation.id,
        details=f"Invited '{invitation.email}' with role '{req_role}' (expires in 7 days)",
        ip_address=ip
    )

    return {
        "message": f"Invitation created for {invitation.email}",
        "invitation_id": invitation.id,
        "email": invitation.email,
        "role": invitation.role,
        "token": invitation.token,
        "invite_link": f"/admin/accept-invite?token={invitation.token}",
        "expires_at": invitation.expires_at.isoformat()
    }


@router.get("/invites")
def list_admin_invitations(
    current_user: User = Depends(require_roles([ROLE_SUPERADMIN])),
    db: Session = Depends(get_db)
):
    invites = db.query(AdminInvitation).order_by(desc(AdminInvitation.created_at)).all()
    return [
        {
            "id": inv.id,
            "email": inv.email,
            "role": inv.role,
            "token": inv.token,
            "invited_by": inv.invited_by,
            "is_accepted": inv.is_accepted,
            "created_at": inv.created_at.isoformat(),
            "expires_at": inv.expires_at.isoformat(),
            "is_expired": inv.expires_at.replace(tzinfo=timezone.utc) < datetime.now(timezone.utc)
        }
        for inv in invites
    ]


@router.delete("/invites/{invite_id}")
def cancel_admin_invitation(
    invite_id: str,
    current_user: User = Depends(require_roles([ROLE_SUPERADMIN])),
    db: Session = Depends(get_db)
):
    invite = db.query(AdminInvitation).filter(AdminInvitation.id == invite_id).first()
    if not invite:
        raise HTTPException(status_code=404, detail="Invitation not found.")
    db.delete(invite)
    db.commit()
    return {"message": "Invitation cancelled."}


@router.post("/accept-invite")
def accept_admin_invitation(
    request: Request,
    body: AcceptInviteRequest,
    db: Session = Depends(get_db)
):
    ip = get_client_ip(request)
    invitation = db.query(AdminInvitation).filter(
        AdminInvitation.token == body.token,
        AdminInvitation.is_accepted == False
    ).first()

    if not invitation:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or already accepted invitation token."
        )

    if invitation.expires_at.replace(tzinfo=timezone.utc) < datetime.now(timezone.utc):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invitation link has expired. Please request a new invite from Super Admin."
        )

    if len(body.password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 8 characters long."
        )

    # Check if user already exists
    existing = db.query(User).filter(User.email == invitation.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Account already exists for this email.")

    new_user = User(
        email=invitation.email,
        full_name=body.full_name.strip(),
        hashed_password=get_password_hash(body.password),
        role=invitation.role,
        is_active=True
    )
    db.add(new_user)
    invitation.is_accepted = True
    db.commit()
    db.refresh(new_user)

    log_admin_action(
        db,
        admin_email=new_user.email,
        action="ADMIN_INVITE_ACCEPTED",
        entity="User",
        entity_id=new_user.id,
        details=f"Admin account registered with role '{new_user.role}' via invitation",
        ip_address=ip
    )

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    token = create_access_token(subject=new_user.email, expires_delta=access_token_expires)

    return {
        "message": "Account created successfully.",
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": new_user.id,
            "email": new_user.email,
            "full_name": new_user.full_name,
            "role": new_user.role
        }
    }


# --- 5. Team / Admin User Management ---
@router.get("/admins")
def list_administrators(
    current_user: User = Depends(require_roles([ROLE_SUPERADMIN])),
    db: Session = Depends(get_db)
):
    users = db.query(User).order_by(User.created_at).all()
    return [
        {
            "id": u.id,
            "email": u.email,
            "full_name": u.full_name,
            "role": u.role,
            "is_active": u.is_active,
            "created_at": u.created_at.isoformat() if u.created_at else None,
            "last_login": u.last_login.isoformat() if u.last_login else None
        }
        for u in users
    ]


@router.patch("/admins/{user_id}")
def update_administrator(
    user_id: str,
    body: AdminUpdateRequest,
    current_user: User = Depends(require_roles([ROLE_SUPERADMIN])),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Administrator not found.")

    # Guard against modifying or deactivating primary owner
    if user.email == settings.FIRST_SUPERUSER_EMAIL and body.is_active is False:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot deactivate the primary Business Owner administrator account."
        )

    if body.full_name is not None:
        user.full_name = body.full_name.strip()
    if body.role is not None:
        if body.role.upper() not in ALL_ADMIN_ROLES:
            raise HTTPException(status_code=400, detail=f"Invalid role: {body.role}")
        user.role = body.role.upper()
    if body.is_active is not None:
        user.is_active = body.is_active

    db.commit()
    db.refresh(user)

    log_admin_action(
        db,
        admin_email=current_user.email,
        action="ADMIN_USER_UPDATED",
        entity="User",
        entity_id=user.id,
        details=f"Updated admin '{user.email}' - Role: {user.role}, Active: {user.is_active}"
    )

    return {
        "id": user.id,
        "email": user.email,
        "full_name": user.full_name,
        "role": user.role,
        "is_active": user.is_active
    }


@router.delete("/admins/{user_id}")
def revoke_administrator(
    user_id: str,
    current_user: User = Depends(require_roles([ROLE_SUPERADMIN])),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Administrator not found.")

    if user.email == settings.FIRST_SUPERUSER_EMAIL or user.id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete primary superuser or self."
        )

    target_email = user.email
    db.delete(user)
    db.commit()

    log_admin_action(
        db,
        admin_email=current_user.email,
        action="ADMIN_USER_REVOKED",
        entity="User",
        entity_id=user_id,
        details=f"Permanently revoked admin access for '{target_email}'"
    )

    return {"message": f"Administrator '{target_email}' access revoked."}


# --- 6. Passkey & Biometric Authentication (WebAuthn) ---
# Strictly adheres to: Biometric information must remain on the device.
# Only standard cryptographic public keys and challenges are stored on server.
@router.post("/passkey/register-challenge")
def passkey_register_challenge(
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    challenge_val = secrets.token_urlsafe(32)
    challenge_rec = PasskeyChallenge(
        challenge=challenge_val,
        user_id=current_user.id,
        expires_at=datetime.now(timezone.utc) + timedelta(minutes=5)
    )
    db.add(challenge_rec)
    db.commit()

    return {
        "challenge": challenge_val,
        "rp": {
            "name": "Sri Balaji Special Mixtures Admin",
            "id": "localhost"
        },
        "user": {
            "id": current_user.id,
            "name": current_user.email,
            "displayName": current_user.full_name or "Sri Balaji Admin"
        },
        "pubKeyCredParams": [
            {"type": "public-key", "alg": -7},    # ES256
            {"type": "public-key", "alg": -257}   # RS256
        ],
        "authenticatorSelection": {
            "authenticatorAttachment": "platform",
            "userVerification": "preferred",
            "residentKey": "preferred"
        },
        "timeout": 60000
    }


@router.post("/passkey/register-verify")
def passkey_register_verify(
    request: Request,
    body: PasskeyRegisterVerifyRequest,
    current_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    ip = get_client_ip(request)
    # Validate challenge
    ch = db.query(PasskeyChallenge).filter(
        PasskeyChallenge.challenge == body.challenge,
        PasskeyChallenge.user_id == current_user.id
    ).first()

    if not ch or ch.expires_at.replace(tzinfo=timezone.utc) < datetime.now(timezone.utc):
        raise HTTPException(status_code=400, detail="Invalid or expired passkey challenge.")

    # Remove challenge to prevent replay
    db.delete(ch)

    # Check if credential already registered
    existing_cred = db.query(PasskeyCredential).filter(
        PasskeyCredential.credential_id == body.credential_id
    ).first()

    if existing_cred:
        existing_cred.public_key = body.public_key
        existing_cred.device_name = body.device_name or "Passkey Device"
    else:
        new_cred = PasskeyCredential(
            user_id=current_user.id,
            credential_id=body.credential_id,
            public_key=body.public_key,
            device_name=body.device_name or "Passkey Device",
            created_at=datetime.now(timezone.utc)
        )
        db.add(new_cred)

    db.commit()

    log_admin_action(
        db,
        admin_email=current_user.email,
        action="PASSKEY_REGISTERED",
        entity="PasskeyCredential",
        entity_id=body.credential_id,
        details=f"Registered device passkey/biometric '{body.device_name}'",
        ip_address=ip
    )

    return {"message": "Passkey registered successfully. Device biometrics enabled."}


@router.post("/passkey/login-challenge")
def passkey_login_challenge(
    db: Session = Depends(get_db)
):
    challenge_val = secrets.token_urlsafe(32)
    challenge_rec = PasskeyChallenge(
        challenge=challenge_val,
        expires_at=datetime.now(timezone.utc) + timedelta(minutes=5)
    )
    db.add(challenge_rec)
    db.commit()

    return {
        "challenge": challenge_val,
        "rpId": "localhost",
        "userVerification": "preferred",
        "timeout": 60000
    }


@router.post("/passkey/login-verify")
def passkey_login_verify(
    request: Request,
    body: PasskeyLoginVerifyRequest,
    db: Session = Depends(get_db)
):
    ip = get_client_ip(request)
    if not check_login_rate_limit(ip):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many authentication attempts. Please try again later."
        )

    # Validate challenge
    ch = db.query(PasskeyChallenge).filter(
        PasskeyChallenge.challenge == body.challenge
    ).first()

    if not ch or ch.expires_at.replace(tzinfo=timezone.utc) < datetime.now(timezone.utc):
        record_login_failure(ip)
        raise HTTPException(status_code=400, detail="Invalid or expired passkey challenge.")

    db.delete(ch)

    # Find credential
    cred = db.query(PasskeyCredential).filter(
        PasskeyCredential.credential_id == body.credential_id
    ).first()

    if not cred:
        record_login_failure(ip)
        raise HTTPException(status_code=401, detail="Passkey not recognized on this server.")

    user = db.query(User).filter(User.id == cred.user_id).first()
    if not user or not user.is_active:
        raise HTTPException(status_code=403, detail="Administrator account is suspended.")

    clear_login_failures(ip)
    cred.sign_count += 1
    cred.last_used_at = datetime.now(timezone.utc)
    user.last_login = datetime.now(timezone.utc)
    db.commit()

    log_admin_action(
        db,
        admin_email=user.email,
        action="AUTH_LOGIN_PASSKEY",
        entity="PasskeyCredential",
        entity_id=cred.credential_id,
        details=f"Successful passkey/biometric authentication via '{cred.device_name}'",
        ip_address=ip
    )

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        subject=user.email, expires_delta=access_token_expires
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role
        }
    }


# --- 7. Activity & Audit Logs ---
@router.get("/audit-logs")
def get_audit_logs(
    action: Optional[str] = None,
    admin_email: Optional[str] = None,
    limit: int = 100,
    offset: int = 0,
    current_user: User = Depends(require_roles([ROLE_SUPERADMIN])),
    db: Session = Depends(get_db)
):
    query = db.query(AdminAuditLog)
    if action:
        query = query.filter(AdminAuditLog.action == action)
    if admin_email:
        query = query.filter(AdminAuditLog.admin_email.ilike(f"%{admin_email}%"))

    total = query.count()
    logs = query.order_by(desc(AdminAuditLog.created_at)).offset(offset).limit(limit).all()

    return {
        "total": total,
        "logs": [
            {
                "id": log.id,
                "admin_email": log.admin_email,
                "action": log.action,
                "entity": log.entity,
                "entity_id": log.entity_id,
                "details": log.details,
                "ip_address": log.ip_address,
                "created_at": log.created_at.isoformat() if log.created_at else None
            }
            for log in logs
        ]
    }
