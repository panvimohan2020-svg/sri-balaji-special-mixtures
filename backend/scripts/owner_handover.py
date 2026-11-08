"""
Sri Balaji Special Mixtures – Business Owner Handover & Super Admin Provisioning Tool.
Used by the deployment developer to generate, verify, and deliver the one-time
Super Admin account activation credentials to the authentic business owner.
"""
import os
import sys
import argparse
import secrets
from datetime import datetime, timezone, timedelta

# Ensure backend directory is in path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.core.config import settings
from app.core.database import SessionLocal, Base, engine
from app.models.admin_security import OwnerSetupState
from app.models.user import User

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

def print_banner():
    print("=" * 72)
    print("  SRI BALAJI SPECIAL MIXTURES – BUSINESS OWNER SUPER ADMIN HANDOVER")
    print("  Official Developer Handover & Ownership Transition Protocol")
    print("=" * 72)

def main():
    parser = argparse.ArgumentParser(description="Sri Balaji Business Owner Handover Utility")
    parser.add_argument("--status", action="store_true", help="Check current owner activation status")
    parser.add_argument("--regenerate", action="store_true", help="Generate a fresh activation invitation token")
    parser.add_argument("--email", type=str, help="Configure or update the owner email address")
    args = parser.parse_args()

    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        owner_state = db.query(OwnerSetupState).first()
        target_email = (args.email or settings.BUSINESS_OWNER_EMAIL).strip().lower()

        if not owner_state:
            token = secrets.token_urlsafe(32)
            owner_state = OwnerSetupState(
                owner_email=target_email,
                activation_token=token,
                is_activated=False,
                expires_at=datetime.now(timezone.utc) + timedelta(days=30)
            )
            db.add(owner_state)
            db.commit()
            db.refresh(owner_state)
        elif args.email and not owner_state.is_activated:
            owner_state.owner_email = target_email
            owner_state.activation_token = secrets.token_urlsafe(32)
            owner_state.expires_at = datetime.now(timezone.utc) + timedelta(days=30)
            db.commit()
            db.refresh(owner_state)
            print(f"[*] Owner email updated to: {target_email} with fresh activation token.")
        elif args.regenerate:
            if owner_state.is_activated:
                print("[!] ERROR: Owner account has already been permanently activated!")
                print("    For security, initial setup cannot be regenerated once activated.")
                print(f"    Activated on: {owner_state.activated_at} by {owner_state.activated_by_name}")
                return
            owner_state.activation_token = secrets.token_urlsafe(32)
            owner_state.expires_at = datetime.now(timezone.utc) + timedelta(days=30)
            db.commit()
            db.refresh(owner_state)
            print("[*] Generated fresh activation invitation token.")

        print_banner()
        print(f"Business Enterprise : {settings.PROJECT_NAME}")
        print(f"Business Owner Name : {settings.BUSINESS_OWNER_NAME}")
        print(f"Designated Email    : {owner_state.owner_email}")
        print(f"Handover Status     : {'COMPLETED (Active Primary Super Admin)' if owner_state.is_activated else 'PENDING OWNER ACTIVATION'}")
        
        if owner_state.is_activated:
            print(f"Activated On        : {owner_state.activated_at.strftime('%d %B %Y, %I:%M %p UTC') if owner_state.activated_at else 'Verified'}")
            print(f"Activated By        : {owner_state.activated_by_name}")
            print("\n" + "-" * 72)
            print("  ADMINISTRATIVE ACCESS DETAILS:")
            print(f"  • Admin Login URL  : {FRONTEND_URL}/admin/login")
            print(f"  • Primary Email    : {owner_state.owner_email}")
            print("  • Role             : SUPERADMIN (Unrestricted Website Control)")
            print("-" * 72)
            print("[+] Initial handover is concluded. The business owner has full independent control.")
        else:
            activation_url = f"{FRONTEND_URL}/admin/owner-activation?token={owner_state.activation_token}"
            print(f"Token Expiration    : {owner_state.expires_at.strftime('%d %B %Y, %I:%M %p UTC')}")
            print("\n" + "-" * 72)
            print("  ACTION REQUIRED BY BUSINESS OWNER:")
            print("  Deliver the following secure activation link directly to Sri Adari Krishna Rao /")
            print("  Sri Adari Dilleshwar Rao to set their password and take complete website ownership:")
            print()
            print(f"  🔗 ACTIVATION LINK:")
            print(f"     {activation_url}")
            print()
            print(f"  🏛️ ADMIN LOGIN PORTAL (After Activation):")
            print(f"     {FRONTEND_URL}/admin/login")
            print("-" * 72)
            print("  SECURITY NOTICE:")
            print("  • The owner will set their own private password upon opening the activation link.")
            print("  • Upon activation, the initial setup process is permanently locked.")
            print("  • Developer bootstrap access is severed, leaving the owner as the sole Super Admin.")
            print("  • The Super Admin can then invite staff members (Order Manager, Product Manager, etc.).")
            print("=" * 72)

    finally:
        db.close()

if __name__ == "__main__":
    main()

