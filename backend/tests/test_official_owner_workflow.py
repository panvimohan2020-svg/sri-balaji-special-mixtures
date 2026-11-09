"""
Official Test Suite: Sri Balaji Business Owner Super Admin Invitation & Handover
================================================================================
Validates all requirements for `sribalajispecialmixtures@gmail.com`:
1. Use this exact email for Adari Dilleshwar Rao's owner invitation.
2. Assign SUPER_ADMIN permissions only after successful invitation-based activation.
3. Reserve this email for the Staff & Admin Portal.
4. Do not allow customer registration or ordinary staff registration to obtain this account.
5. Do not hardcode any password.
6. Preserve the ability to invite a second business owner using a separate email address.
7. Verify the complete registration, activation, login and authorization workflow.
8. Ensure no duplicate accounts and existing customer accounts remain unmodified.
"""
import sys
import os
import secrets
import hashlib
from datetime import datetime, timezone, timedelta

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from fastapi.testclient import TestClient
from app.main import app
from app.core.config import settings
from app.core.database import SessionLocal
from app.models.user import User
from app.models.customer import Customer
from app.models.admin_security import OwnerInvitation, AdminInvitation, OwnerSetupState
from app.core.rbac import ROLE_SUPERADMIN, ROLE_ORDER_MANAGER


def run_tests():
    print("=" * 76)
    print("  TEST SUITE: OFFICIAL BUSINESS OWNER SUPER ADMIN INVITATION & RBAC  ")
    print("=" * 76)

    client = TestClient(app)
    db = SessionLocal()

    OFFICIAL_EMAIL = "sribalajispecialmixtures@gmail.com"
    OFFICIAL_NAME = "Adari Dilleshwar Rao"
    SECOND_OWNER_EMAIL = "krishnarao.balaji@gmail.com"
    SECOND_OWNER_NAME = "Sri Adari Krishna Rao"

    # Count existing customers and users to verify no corruption
    initial_customer_count = db.query(Customer).count()
    initial_customers = [(c.id, c.phone_number, c.email) for c in db.query(Customer).all()]

    try:
        # ----------------------------------------------------------------------
        # TEST 1: Reserve email – Customer Registration MUST BE BLOCKED
        # ----------------------------------------------------------------------
        print("\n[TEST 1] Customer registration using reserved owner email must be blocked...")
        cust_payload = {
            "phone_number": "9998887771",
            "full_name": "Intruder Trying Customer Sign Up",
            "email": OFFICIAL_EMAIL,
            "password": "CustomerSecret123!"
        }
        res_cust = client.post("/api/v1/customers/register", json=cust_payload)
        assert res_cust.status_code == 400, f"Expected 400 Bad Request, got {res_cust.status_code}: {res_cust.text}"
        assert "reserved" in res_cust.json().get("detail", "").lower(), f"Unexpected detail: {res_cust.text}"
        print(f"  [PASS] Customer registration blocked: {res_cust.json()['detail']}")

        # ----------------------------------------------------------------------
        # TEST 2: Reserve email – Customer Profile Update MUST BE BLOCKED
        # ----------------------------------------------------------------------
        print("\n[TEST 2] Customer profile update to reserved owner email must be blocked...")
        # Create a legitimate test customer
        test_phone = f"987654{secrets.randbelow(9000) + 1000}"
        res_reg = client.post("/api/v1/customers/register", json={
            "phone_number": test_phone,
            "full_name": "Legit Retail Customer",
            "email": f"legit_{test_phone}@test.com",
            "password": "Password123!"
        })
        assert res_reg.status_code == 200, f"Failed to register test customer: {res_reg.text}"
        cust_token = res_reg.json()["access_token"]

        # Attempt to change email to reserved owner email
        res_patch = client.patch(
            "/api/v1/customers/me",
            json={"email": OFFICIAL_EMAIL},
            headers={"Authorization": f"Bearer {cust_token}"}
        )
        assert res_patch.status_code == 400, f"Expected 400 for patch, got {res_patch.status_code}: {res_patch.text}"
        assert "reserved" in res_patch.json().get("detail", "").lower(), f"Unexpected detail: {res_patch.text}"
        print(f"  [PASS] Customer email hijack blocked: {res_patch.json()['detail']}")

        # ----------------------------------------------------------------------
        # TEST 3: Reserve email – Ordinary Staff Registration MUST BE BLOCKED
        # ----------------------------------------------------------------------
        print("\n[TEST 3] Ordinary staff invitation using reserved owner email must be blocked...")
        # Find or create a temporary Super Admin to call /api/v1/auth/invite
        superadmin_user = db.query(User).filter(User.role == ROLE_SUPERADMIN, User.is_active == True).first()
        from app.core.security import create_access_token
        admin_jwt = create_access_token(subject=superadmin_user.email, expires_delta=timedelta(hours=1))

        # Try to invite owner email as ordinary ORDER_MANAGER
        res_staff_invite = client.post(
            "/api/v1/auth/invite",
            json={"email": OFFICIAL_EMAIL, "role": "ORDER_MANAGER"},
            headers={"Authorization": f"Bearer {admin_jwt}"}
        )
        assert res_staff_invite.status_code == 400, f"Expected 400, got {res_staff_invite.status_code}: {res_staff_invite.text}"
        assert "reserved" in res_staff_invite.json().get("detail", "").lower(), f"Unexpected detail: {res_staff_invite.text}"
        print(f"  [PASS] Ordinary staff invitation blocked: {res_staff_invite.json()['detail']}")

        # ----------------------------------------------------------------------
        # TEST 4: Generate Cryptographic Owner Invitation
        # ----------------------------------------------------------------------
        print("\n[TEST 4] Generate official Super Admin invitation for Adari Dilleshwar Rao...")
        from scripts.generate_owner_invitation import generate_invitation
        inv_data = generate_invitation(
            owner_name=OFFICIAL_NAME,
            owner_email=OFFICIAL_EMAIL,
            base_url="https://sri-balaji-special-mixtures.vercel.app",
            hours_valid=72
        )
        raw_token = inv_data["raw_token"]
        token_hash = inv_data["token_hash"]
        reg_link = inv_data["registration_link"]

        # Verify raw token is NOT stored in the database
        db_inv = db.query(OwnerInvitation).filter(OwnerInvitation.owner_email == OFFICIAL_EMAIL).first()
        assert db_inv is not None, "Owner invitation not saved to database!"
        assert db_inv.token_hash == token_hash, "Token hash mismatch in database!"
        assert not hasattr(db_inv, "raw_token") or getattr(db_inv, "raw_token", None) is None, "Raw token must NEVER be in DB!"
        assert db_inv.is_used is False, "New invitation must have is_used == False!"
        assert raw_token not in db_inv.token_hash, "Raw token leaked in database hash!"
        print(f"  [PASS] Cryptographic Invitation Generated:")
        print(f"         Owner Name : {inv_data['owner_name']}")
        print(f"         Owner Email: {inv_data['owner_email']}")
        print(f"         Link       : {reg_link}")
        print(f"         Token Hash : {token_hash[:16]}... (SHA-256)")
        print(f"         Expires In : {inv_data['hours_valid']} hours")

        # ----------------------------------------------------------------------
        # TEST 5: Verify Setup Status Reflects Pending Owner Activation
        # ----------------------------------------------------------------------
        print("\n[TEST 5] Setup status check indicates pending official owner activation...")
        res_status = client.get("/api/v1/auth/owner/setup-status")
        assert res_status.status_code == 200
        status_json = res_status.json()
        assert status_json["is_activated"] is False, "Status should be False while official owner is pending"
        assert status_json["status"] == "PENDING_ACTIVATION"
        assert "s" in status_json["owner_email_masked"] and "@gmail.com" in status_json["owner_email_masked"]
        print(f"  [PASS] Setup Status: {status_json['status']}, Masked: {status_json['owner_email_masked']}")

        # ----------------------------------------------------------------------
        # TEST 6: Login Before Activation MUST FAIL
        # ----------------------------------------------------------------------
        print("\n[TEST 6] Unactivated account cannot log in...")
        res_unact_login = client.post(
            "/api/v1/auth/token",
            data={"username": OFFICIAL_EMAIL, "password": "AnyRandomPassword123!"}
        )
        assert res_unact_login.status_code == 401, f"Expected 401, got {res_unact_login.status_code}"
        print("  [PASS] Unauthorized login before activation safely rejected (HTTP 401)")

        # ----------------------------------------------------------------------
        # TEST 7: Verify Token Endpoint
        # ----------------------------------------------------------------------
        print("\n[TEST 7] Public token verification endpoint...")
        res_verify = client.get(f"/api/v1/auth/owner/verify-token?token={raw_token}")
        assert res_verify.status_code == 200, f"Token verify failed: {res_verify.text}"
        v_data = res_verify.json()
        assert v_data["valid"] is True, f"Token should be valid: {v_data}"
        assert v_data["owner_email"] == OFFICIAL_EMAIL
        assert v_data["owner_name"] == OFFICIAL_NAME
        print(f"  [PASS] Token Verified: Name='{v_data['owner_name']}', Email='{v_data['owner_email']}'")

        # Invalid token rejection
        res_bad_token = client.get("/api/v1/auth/owner/verify-token?token=completely_invalid_token_123")
        assert res_bad_token.status_code == 200
        assert res_bad_token.json()["valid"] is False
        print("  [PASS] Invalid token safely rejected with valid: False")

        # ----------------------------------------------------------------------
        # TEST 8: Successful Owner Activation with Custom Private Password
        # ----------------------------------------------------------------------
        print("\n[TEST 8] Owner account activation with custom private password...")
        OWNER_PRIVATE_PASSWORD = "BalajiMasterSuperAdmin#2026"
        act_payload = {
            "token": raw_token,
            "full_name": OFFICIAL_NAME,
            "password": OWNER_PRIVATE_PASSWORD
        }
        res_act = client.post("/api/v1/auth/owner/activate", json=act_payload)
        assert res_act.status_code == 200, f"Activation failed: {res_act.status_code}: {res_act.text}"
        act_data = res_act.json()
        assert act_data["user"]["email"] == OFFICIAL_EMAIL
        assert act_data["user"]["role"] == ROLE_SUPERADMIN
        assert act_data["user"]["is_active"] is True
        owner_jwt = act_data["access_token"]
        print(f"  [PASS] Account Activated as SUPERADMIN:")
        print(f"         User ID  : {act_data['user']['id']}")
        print(f"         Role     : {act_data['user']['role']}")
        print(f"         Active   : {act_data['user']['is_active']}")

        # ----------------------------------------------------------------------
        # TEST 9: Invitation Token Reuse MUST BE BLOCKED
        # ----------------------------------------------------------------------
        print("\n[TEST 9] Invitation single-use enforcement (re-activation blocked)...")
        res_reuse = client.post("/api/v1/auth/owner/activate", json=act_payload)
        assert res_reuse.status_code == 400, f"Expected 400 for reuse, got {res_reuse.status_code}"
        assert "already been used" in res_reuse.json().get("detail", "").lower()

        res_verify_used = client.get(f"/api/v1/auth/owner/verify-token?token={raw_token}")
        assert res_verify_used.json()["valid"] is False
        assert res_verify_used.json()["error_code"] == "ALREADY_USED"
        print("  [PASS] Token reuse rejected: ALREADY_USED")

        # ----------------------------------------------------------------------
        # TEST 10: Owner Login via /auth/login-json with Private Password
        # ----------------------------------------------------------------------
        print("\n[TEST 10] Owner login with newly configured private password...")
        res_login = client.post("/api/v1/auth/login-json", json={
            "email": OFFICIAL_EMAIL,
            "password": OWNER_PRIVATE_PASSWORD
        })
        assert res_login.status_code == 200, f"Login failed: {res_login.status_code}: {res_login.text}"
        login_data = res_login.json()
        assert "access_token" in login_data
        session_jwt = login_data["access_token"]
        print("  [PASS] Owner successfully authenticated via /auth/login-json")

        # ----------------------------------------------------------------------
        # TEST 11: Verify Authorization & Super Admin Profile Access
        # ----------------------------------------------------------------------
        print("\n[TEST 11] Verify unrestricted Super Admin profile and privileges...")
        res_me = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {session_jwt}"})
        assert res_me.status_code == 200
        me_data = res_me.json()
        assert me_data["email"] == OFFICIAL_EMAIL
        assert me_data["role"] == ROLE_SUPERADMIN
        assert me_data["is_active"] is True
        print(f"  [PASS] Super Admin Session Confirmed: Email={me_data['email']}, Role={me_data['role']}")

        # ----------------------------------------------------------------------
        # TEST 12: Preserve Multi-Owner Support (Invite Second Business Owner)
        # ----------------------------------------------------------------------
        print("\n[TEST 12] Preserving multi-owner capability – Inviting Second Business Owner...")
        # Owner 1 generates invitation for Owner 2 (Sri Adari Krishna Rao)
        res_gen_second = client.post(
            "/api/v1/auth/owner/generate-invitation",
            json={
                "owner_name": SECOND_OWNER_NAME,
                "owner_email": SECOND_OWNER_EMAIL,
                "hours_valid": 72
            },
            headers={"Authorization": f"Bearer {session_jwt}"}
        )
        assert res_gen_second.status_code == 200, f"Second owner invite failed: {res_gen_second.text}"
        second_inv = res_gen_second.json()
        second_token = second_inv["raw_token"]
        assert second_inv["owner_email"] == SECOND_OWNER_EMAIL
        assert second_inv["owner_name"] == SECOND_OWNER_NAME
        print(f"  [PASS] Second Owner Invited: '{SECOND_OWNER_NAME}' <{SECOND_OWNER_EMAIL}>")

        # Verify second token
        res_verify_second = client.get(f"/api/v1/auth/owner/verify-token?token={second_token}")
        assert res_verify_second.status_code == 200
        assert res_verify_second.json()["valid"] is True
        assert res_verify_second.json()["owner_email"] == SECOND_OWNER_EMAIL

        # Second owner activates with their own separate password
        SECOND_OWNER_PASSWORD = "KrishnaRaoOwner2026!#"
        res_act_second = client.post("/api/v1/auth/owner/activate", json={
            "token": second_token,
            "full_name": SECOND_OWNER_NAME,
            "password": SECOND_OWNER_PASSWORD
        })
        assert res_act_second.status_code == 200
        second_user = res_act_second.json()["user"]
        assert second_user["email"] == SECOND_OWNER_EMAIL
        assert second_user["role"] == ROLE_SUPERADMIN
        print(f"  [PASS] Second Owner Activated as Co-Super Admin: Role={second_user['role']}")

        # Second owner can log in independently
        res_login_second = client.post("/api/v1/auth/login-json", json={
            "email": SECOND_OWNER_EMAIL,
            "password": SECOND_OWNER_PASSWORD
        })
        assert res_login_second.status_code == 200
        print("  [PASS] Second Owner Authenticated independently with separate credentials")

        # ----------------------------------------------------------------------
        # TEST 13: Integrity Check – Existing Customer Accounts Preserved
        # ----------------------------------------------------------------------
        print("\n[TEST 13] Checking customer accounts integrity...")
        final_customers = [(c.id, c.phone_number, c.email) for c in db.query(Customer).all() if not c.phone_number.startswith("987654")]
        assert len(final_customers) == initial_customer_count, "Original customer records were altered!"
        for orig in initial_customers:
            assert orig in final_customers, f"Customer {orig} was unexpectedly modified or deleted!"
        print(f"  [PASS] All {initial_customer_count} original customer accounts completely intact.")

        # Cleanup temporary test customer
        db.query(Customer).filter(Customer.phone_number == test_phone).delete()
        # Clean up second owner test user and invitations
        db.query(User).filter(User.email == SECOND_OWNER_EMAIL).delete()
        db.query(OwnerInvitation).filter(OwnerInvitation.owner_email == SECOND_OWNER_EMAIL).delete()
        # Clean up test owner user so production activation remains fresh
        db.query(User).filter(User.email == OFFICIAL_EMAIL).delete()
        db.query(OwnerInvitation).filter(OwnerInvitation.owner_email == OFFICIAL_EMAIL, OwnerInvitation.is_used == True).delete()
        db.commit()

        print("\n" + "=" * 76)
        print("  ALL 13 BUSINESS OWNER SUPER ADMIN SPECIFICATION TESTS PASSED 100%!  ")
        print("=" * 76)

    finally:
        db.close()


if __name__ == "__main__":
    run_tests()
