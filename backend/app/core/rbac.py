from datetime import datetime, timezone, timedelta
from typing import List, Optional
from fastapi import Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from app.core.security import ALGORITHM
from app.models.user import User
from app.models.admin_security import RevokedToken, AdminAuditLog

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/token", auto_error=False)

# Standard Sri Balaji Roles
ROLE_SUPERADMIN = "SUPERADMIN"
ROLE_PRODUCT_MANAGER = "PRODUCT_MANAGER"
ROLE_ORDER_MANAGER = "ORDER_MANAGER"
ROLE_INVENTORY_MANAGER = "INVENTORY_MANAGER"
ROLE_CUSTOMER_SUPPORT = "CUSTOMER_SUPPORT"

ALL_ADMIN_ROLES = [
    ROLE_SUPERADMIN,
    ROLE_PRODUCT_MANAGER,
    ROLE_ORDER_MANAGER,
    ROLE_INVENTORY_MANAGER,
    ROLE_CUSTOMER_SUPPORT,
]

# Simple in-memory rate limiter for login protection
# Key: client_ip or identifier -> list of failed attempt timestamps
_login_failures = {}


def check_login_rate_limit(client_id: str, max_attempts: int = 5, window_seconds: int = 600) -> bool:
    """Returns True if within limit, False if rate limited (exceeded max_attempts in window_seconds)."""
    now = datetime.now(timezone.utc)
    attempts = _login_failures.get(client_id, [])
    cutoff = now - timedelta(seconds=window_seconds)
    # prune old attempts
    attempts = [t for t in attempts if t > cutoff]
    _login_failures[client_id] = attempts
    return len(attempts) < max_attempts


def record_login_failure(client_id: str):
    now = datetime.now(timezone.utc)
    attempts = _login_failures.get(client_id, [])
    attempts.append(now)
    _login_failures[client_id] = attempts


def clear_login_failures(client_id: str):
    if client_id in _login_failures:
        _login_failures.pop(client_id, None)


def log_admin_action(
    db: Session,
    admin_email: str,
    action: str,
    entity: str,
    entity_id: Optional[str] = None,
    details: Optional[str] = None,
    ip_address: Optional[str] = None,
):
    try:
        log_entry = AdminAuditLog(
            admin_email=admin_email,
            action=action,
            entity=entity,
            entity_id=str(entity_id) if entity_id else None,
            details=details,
            ip_address=ip_address,
            created_at=datetime.now(timezone.utc),
        )
        db.add(log_entry)
        db.commit()
    except Exception as e:
        db.rollback()
        print(f"[AdminAuditLog Error]: {e}")


def get_current_admin(
    token: Optional[str] = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials or missing token",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if not token:
        raise credentials_exception

    # Check revoked tokens blacklist
    revoked = db.query(RevokedToken).filter(RevokedToken.token == token).first()
    if revoked:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session has been revoked or logged out. Please sign in again.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Administrator account is suspended or deactivated. Contact Super Admin.",
        )

    if user.role not in ALL_ADMIN_ROLES:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: User lacks administrative credentials.",
        )

    return user


def require_roles(allowed_roles: List[str]):
    def role_checker(current_user: User = Depends(get_current_admin)) -> User:
        # SUPERADMIN always has total privileges
        if current_user.role == ROLE_SUPERADMIN:
            return current_user

        if current_user.role in allowed_roles:
            return current_user

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Forbidden: Insufficient privileges. Required role in {allowed_roles}, your role is '{current_user.role}'.",
        )
    return role_checker

