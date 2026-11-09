"""
Sri Balaji Special Mixtures – Business Owner Invitation & Handover Utility
==========================================================================
Generates cryptographically secure, single-use, 72-hour expiring registration links
for the authentic business owners (Sri Adari Krishna Rao & Sri Adari Dilleshwar Rao).

Security Architecture:
- Raw tokens are NEVER stored in the database.
- Only SHA-256 hashes are persisted in the `owner_invitations` table.
- Multi-owner support: Both owners receive separate accounts with SUPERADMIN privileges.
- Single-use validation: Links cannot be reused once activated.
"""

import os
import sys
import argparse
import secrets
import hashlib
from datetime import datetime, timezone, timedelta

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.core.config import settings
from app.core.database import SessionLocal, Base, engine
from app.models.admin_security import OwnerInvitation
from app.models.user import User


def get_frontend_url(override_url: str = None) -> str:
    if override_url:
        return override_url.rstrip('/')
    
    # Priority: PUBLIC_FRONTEND_URL -> FRONTEND_URL -> settings.PUBLIC_FRONTEND_URL -> default
    url = (
        os.getenv("PUBLIC_FRONTEND_URL")
        or os.getenv("FRONTEND_URL")
        or getattr(settings, "PUBLIC_FRONTEND_URL", None)
        or "http://localhost:5173"
    )
    return url.rstrip('/')


def check_production_warning(url: str):
    env = (os.getenv("ENVIRONMENT") or getattr(settings, "ENVIRONMENT", "development")).lower()
    is_localhost = "localhost" in url or "127.0.0.1" in url
    if env == "production" and is_localhost:
        print("\n" + "!" * 72)
        print("  ⚠️  WARNING: Running in PRODUCTION mode with a localhost URL!")
        print(f"  Current URL: {url}")
        print("  Set PUBLIC_FRONTEND_URL in your .env to your live domain (e.g. https://sribalajicrunch.com)")
        print("!" * 72 + "\n")


def generate_invitation(owner_name: str, owner_email: str, base_url: str, hours_valid: int = 72) -> dict:
    """
    Creates a new OwnerInvitation record with a SHA-256 hashed token.
    Returns the raw unhashed token and metadata for the developer to copy.
    """
    owner_name = owner_name.strip()
    owner_email = owner_email.strip().lower()
    
    if not owner_name:
        raise ValueError("Owner full name is required.")
    if not owner_email or "@" not in owner_email:
        raise ValueError("A valid owner email address is required.")

    # 1. Generate 256-bit cryptographically secure raw token
    raw_token = secrets.token_urlsafe(32)
    
    # 2. Hash token with SHA-256 for persistent database storage
    token_hash = hashlib.sha256(raw_token.encode("utf-8")).hexdigest()
    
    # 3. Calculate expiration window (default 72 hours)
    now_utc = datetime.now(timezone.utc)
    expires_at = now_utc + timedelta(hours=hours_valid)
    
    # 4. Save to database
    db = SessionLocal()
    try:
        # Invalidate any prior pending unused invitations for this owner email
        db.query(OwnerInvitation).filter(
            OwnerInvitation.owner_email == owner_email,
            OwnerInvitation.is_used == False
        ).delete()

        invitation = OwnerInvitation(
            owner_name=owner_name,
            owner_email=owner_email,
            token_hash=token_hash,
            is_used=False,
            created_at=now_utc,
            expires_at=expires_at
        )
        db.add(invitation)
        db.commit()
        db.refresh(invitation)
    finally:
        db.close()

    registration_link = f"{base_url}/admin/owner-activation?token={raw_token}"
    
    return {
        "owner_name": owner_name,
        "owner_email": owner_email,
        "raw_token": raw_token,
        "token_hash": token_hash,
        "registration_link": registration_link,
        "expires_at": expires_at,
        "hours_valid": hours_valid
    }


def list_invitations():
    """Display all current owner invitations and their status."""
    db = SessionLocal()
    try:
        invitations = db.query(OwnerInvitation).order_by(OwnerInvitation.created_at.desc()).all()
        users = db.query(User).filter(User.role == "SUPERADMIN").all()
        
        print("\n" + "=" * 76)
        print("  SRI BALAJI SPECIAL MIXTURES – BUSINESS OWNER ACCOUNTS & INVITATIONS")
        print("=" * 76)
        
        print("\n[ACTIVE SUPER ADMIN ACCOUNTS]")
        if not users:
            print("  (No activated Super Admin accounts found yet)")
        else:
            for u in users:
                status_icon = "🟢 Active" if u.is_active else "🔴 Inactive"
                print(f"  • {u.full_name} <{u.email}> | Role: {u.role} | Status: {status_icon}")

        print("\n[ISSUED OWNER INVITATIONS]")
        if not invitations:
            print("  (No owner invitations issued yet)")
        else:
            now_utc = datetime.now(timezone.utc)
            for inv in invitations:
                exp = inv.expires_at.replace(tzinfo=timezone.utc) if inv.expires_at.tzinfo is None else inv.expires_at
                is_expired = exp < now_utc
                if inv.is_used:
                    status_str = f"✅ ACTIVATED (Used at {inv.used_at.strftime('%Y-%m-%d %H:%M UTC') if inv.used_at else 'Recorded'})"
                elif is_expired:
                    status_str = f"❌ EXPIRED (Expired at {exp.strftime('%Y-%m-%d %H:%M UTC')})"
                else:
                    remaining = exp - now_utc
                    hours_rem = int(remaining.total_seconds() // 3600)
                    status_str = f"⏳ PENDING ACTIVATION ({hours_rem}h remaining, expires {exp.strftime('%Y-%m-%d %H:%M UTC')})"
                
                print(f"  • Owner: {inv.owner_name}")
                print(f"    Email: {inv.owner_email}")
                print(f"    Status: {status_str}")
                print(f"    Token Hash (SHA-256): {inv.token_hash[:16]}... (raw token not stored)")
                print()
        print("=" * 76 + "\n")
    finally:
        db.close()


def generate_invitation_remote(api_url: str, owner_name: str, owner_email: str, base_url: str, admin_pwd: str = "BalajiAdmin2026!", hours_valid: int = 72) -> dict:
    import requests
    api_url = api_url.rstrip('/')
    # 1. Login to get token
    login_res = requests.post(
        f"{api_url}/api/v1/auth/token",
        data={"username": "admin@sribalaji.com", "password": admin_pwd},
        timeout=30
    )
    if login_res.status_code != 200:
        raise RuntimeError(f"Authentication failed with live API at {api_url}: {login_res.text}")
    token = login_res.json()["access_token"]

    # 2. Call generate invitation endpoint
    gen_res = requests.post(
        f"{api_url}/api/v1/auth/owner/generate-invitation",
        json={
            "owner_name": owner_name,
            "owner_email": owner_email,
            "base_url": base_url,
            "hours_valid": hours_valid
        },
        headers={"Authorization": f"Bearer {token}"},
        timeout=30
    )
    if gen_res.status_code != 200:
        raise RuntimeError(f"Failed to generate invitation on live API: {gen_res.text}")
    
    data = gen_res.json()
    return {
        "owner_name": data["owner_name"],
        "owner_email": data["owner_email"],
        "raw_token": data["raw_token"],
        "registration_link": data["registration_link"],
        "expires_at": datetime.fromisoformat(data["expires_at"].replace("Z", "+00:00")),
        "hours_valid": hours_valid
    }


def main():
    parser = argparse.ArgumentParser(description="Sri Balaji Business Owner Invitation Generator")
    parser.add_argument("--name", type=str, help="Full name of the business owner (e.g. 'Sri Adari Krishna Rao')")
    parser.add_argument("--email", type=str, help="Actual email address of the business owner")
    parser.add_argument("--hours", type=int, default=72, help="Invitation validity window in hours (default: 72)")
    parser.add_argument("--url", type=str, help="Override public website URL (default: PUBLIC_FRONTEND_URL from env)")
    parser.add_argument("--api", type=str, help="Target remote API URL (e.g. 'https://sri-balaji-special-mixtures.onrender.com')")
    parser.add_argument("--admin-password", type=str, default="BalajiAdmin2026!", help="Super Admin password for remote API")
    parser.add_argument("--list", action="store_true", help="List all current invitations and active Super Admin accounts")
    
    args = parser.parse_args()

    # Ensure tables exist
    Base.metadata.create_all(bind=engine)

    if args.list:
        list_invitations()
        return

    base_url = get_frontend_url(args.url)
    check_production_warning(base_url)

    owner_name = args.name
    owner_email = args.email

    # Interactive input if flags not provided
    if not owner_name:
        print("\n" + "=" * 60)
        print("  Sri Balaji – Business Owner Invitation Generator")
        print("=" * 60)
        print("Enter the details of the business owner to invite:\n")
        try:
            owner_name = input("Owner Full Name (e.g. Sri Adari Krishna Rao): ").strip()
        except (KeyboardInterrupt, EOFError):
            print("\nAborted.")
            sys.exit(1)

    if not owner_email:
        try:
            owner_email = input("Owner Email Address: ").strip()
        except (KeyboardInterrupt, EOFError):
            print("\nAborted.")
            sys.exit(1)

    if not owner_name or not owner_email:
        print("\n[!] Error: Both owner full name and email address are required.")
        sys.exit(1)

    try:
        if args.api:
            result = generate_invitation_remote(
                api_url=args.api,
                owner_name=owner_name,
                owner_email=owner_email,
                base_url=base_url,
                admin_pwd=args.admin_password,
                hours_valid=args.hours
            )
        else:
            result = generate_invitation(
                owner_name=owner_name,
                owner_email=owner_email,
                base_url=base_url,
                hours_valid=args.hours
            )
    except Exception as exc:
        print(f"\n[!] Failed to generate owner invitation: {exc}")
        sys.exit(1)

    expires_str = result["expires_at"].strftime("%d %B %Y, %I:%M %p UTC")

    # Clean, formatted output matching exact specification
    print("\n" + "=" * 72)
    print("Sri Balaji – Owner Invitation Generated")
    print("=" * 72)
    print(f"Owner: {result['owner_name']}")
    print(f"Email: {result['owner_email']}")
    print(f"Registration Link: {result['registration_link']}")
    print(f"Expires: {expires_str} ({result['hours_valid']} hours from generation)")
    print("=" * 72)
    print("\nNext Steps:")
    print("1. Copy the Registration Link above.")
    print("2. Send it privately to the owner via WhatsApp or private channel.")
    print("3. When the owner opens the link, they will set their password and activate their Super Admin account.")
    print("4. Repeat this script for the other owner (e.g. Sri Adari Dilleshwar Rao) as needed.\n")


if __name__ == "__main__":
    main()

