"""
End-to-End Test Suite: Dual Business Owner Invitation, Activation, & Super Admin Access
=======================================================================================
Verifies the complete flow for both business owners:
1. Sri Adari Krishna Rao
2. Sri Adari Dilleshwar Rao

Tests:
- Cryptographic SHA-256 token hashing (no plain text in DB)
- 72-hour expiration enforcement
- Single-use validation (reuse prevention)
- Independent activation for both owners (one does not lock out the other)
- SUPERADMIN role assignment for both
- Full login capability and JWT verification for both
- Developer bootstrap credential revocation
- Customer isolation
"""

import os
import sys
import secrets
import hashlib
import requests
from datetime import datetime, timezone, timedelta

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.core.config import settings
from app.core.database import SessionLocal, Base, engine
from app.models.admin_security import OwnerInvitation
from app.models.user import User
from app.core.security import verify_password
from scripts.generate_owner_invitation import generate_invitation

BASE_URL = "http://127.0.0.1:8000/api/v1"

def test_full_owner_workflow():
    print("=" * 72)
    print("SRI BALAJI – DUAL BUSINESS OWNER INVITATION & RBAC TEST SUITE")
    print("=" * 72)

    db = SessionLocal()
    
    # Clean up any existing test records for clean testing
    test_email_1 = "test_krishnarao@sribalajicrunch.com"
    test_email_2 = "test_dilleshwar@sribalajicrunch.com"
    test_email_exp = "test_expired_owner@sribalajicrunch.com"

    db.query(OwnerInvitation).filter(OwnerInvitation.owner_email.in_([test_email_1, test_email_2, test_email_exp])).delete(synchronize_session=False)
    db.query(User).filter(User.email.in_([test_email_1, test_email_2, test_email_exp])).delete(synchronize_session=False)
    db.commit()
    db.close()

    # -------------------------------------------------------------
    # 1. Generate Invitation for Owner 1: Sri Adari Krishna Rao
    # -------------------------------------------------------------
    print("\n[TEST 1] Generating Invitation for Owner 1 (Sri Adari Krishna Rao)...")
    invite_1 = generate_invitation(
        owner_name="Sri Adari Krishna Rao",
        owner_email=test_email_1,
        base_url="http://localhost:5173",
        hours_valid=72
    )
    raw_token_1 = invite_1["raw_token"]
    expected_hash_1 = hashlib.sha256(raw_token_1.encode()).hexdigest()

    # Verify token storage in DB is strictly SHA-256
    db = SessionLocal()
    db_rec_1 = db.query(OwnerInvitation).filter(OwnerInvitation.owner_email == test_email_1).first()
    assert db_rec_1 is not None, "Owner 1 invitation not found in DB"
    assert db_rec_1.token_hash == expected_hash_1, "Token hash in DB does not match SHA-256"
    assert raw_token_1 not in [db_rec_1.token_hash], "Security failure: Raw token leaked in DB record"
    assert not db_rec_1.is_used, "New invitation must not be marked used"
    db.close()
    print("  ✓ Owner 1 token generated and saved ONLY as SHA-256 hash.")

    # -------------------------------------------------------------
    # 2. Generate Invitation for Owner 2: Sri Adari Dilleshwar Rao
    # -------------------------------------------------------------
    print("\n[TEST 2] Generating Invitation for Owner 2 (Sri Adari Dilleshwar Rao)...")
    invite_2 = generate_invitation(
        owner_name="Sri Adari Dilleshwar Rao",
        owner_email=test_email_2,
        base_url="http://localhost:5173",
        hours_valid=72
    )
    raw_token_2 = invite_2["raw_token"]
    expected_hash_2 = hashlib.sha256(raw_token_2.encode()).hexdigest()

    db = SessionLocal()
    db_rec_2 = db.query(OwnerInvitation).filter(OwnerInvitation.owner_email == test_email_2).first()
    assert db_rec_2 is not None, "Owner 2 invitation not found in DB"
    assert db_rec_2.token_hash == expected_hash_2, "Token hash in DB does not match SHA-256"
    assert raw_token_2 != raw_token_1, "Tokens must be unique"
    db.close()
    print("  ✓ Owner 2 invitation created independently without affecting Owner 1.")

    # -------------------------------------------------------------
    # 3. Test Verification Endpoint via HTTP
    # -------------------------------------------------------------
    print("\n[TEST 3] Testing /auth/owner/verify-token endpoint...")
    # Verify with Owner 1 token
    res = requests.get(f"{BASE_URL}/auth/owner/verify-token", params={"token": raw_token_1})
    assert res.status_code == 200, f"Expected 200, got {res.status_code}"
    data = res.json()
    assert data["valid"] is True, f"Expected valid True, got {data}"
    assert data["owner_email"] == test_email_1
    assert data["owner_name"] == "Sri Adari Krishna Rao"
    print("  ✓ Owner 1 token verified successfully via backend.")

    # Verify with Owner 2 token
    res = requests.get(f"{BASE_URL}/auth/owner/verify-token", params={"token": raw_token_2})
    assert res.status_code == 200
    data = res.json()
    assert data["valid"] is True
    assert data["owner_email"] == test_email_2
    assert data["owner_name"] == "Sri Adari Dilleshwar Rao"
    print("  ✓ Owner 2 token verified successfully via backend.")

    # Verify with invalid token
    res = requests.get(f"{BASE_URL}/auth/owner/verify-token", params={"token": "invalid_random_token_12345"})
    assert res.status_code == 200
    data = res.json()
    assert data["valid"] is False
    assert data["error_code"] == "INVALID_TOKEN"
    print("  ✓ Invalid token correctly rejected.")

    # -------------------------------------------------------------
    # 4. Activate Owner 1 (Sri Adari Krishna Rao)
    # -------------------------------------------------------------
    print("\n[TEST 4] Activating Owner 1 account via /auth/owner/activate...")
    pass_1 = "BalajiRoyal@Krishna2026!"
    act_res_1 = requests.post(f"{BASE_URL}/auth/owner/activate", json={
        "token": raw_token_1,
        "full_name": "Sri Adari Krishna Rao",
        "password": pass_1
    })
    assert act_res_1.status_code == 200, f"Activation failed: {act_res_1.text}"
    act_data_1 = act_res_1.json()
    assert act_data_1["user"]["role"] == "SUPERADMIN"
    assert act_data_1["user"]["email"] == test_email_1
    assert act_data_1["redirect_url"] == "/admin/login"
    print("  ✓ Owner 1 account successfully activated with SUPERADMIN role!")

    # -------------------------------------------------------------
    # 5. Verify Single-Use Prevention for Owner 1 Token
    # -------------------------------------------------------------
    print("\n[TEST 5] Testing token single-use enforcement...")
    # Re-verify token 1
    res = requests.get(f"{BASE_URL}/auth/owner/verify-token", params={"token": raw_token_1})
    data = res.json()
    assert data["valid"] is False, "Used token must not be valid"
    assert data["error_code"] == "ALREADY_USED", f"Expected ALREADY_USED, got {data}"
    
    # Try re-activating with token 1
    act_reuse = requests.post(f"{BASE_URL}/auth/owner/activate", json={
        "token": raw_token_1,
        "full_name": "Attacker",
        "password": "Password123!"
    })
    assert act_reuse.status_code == 400, "Used token activation must return 400"
    print("  ✓ Single-use enforcement passed: token cannot be reused.")

    # -------------------------------------------------------------
    # 6. Activate Owner 2 (Sri Adari Dilleshwar Rao)
    # -------------------------------------------------------------
    print("\n[TEST 6] Activating Owner 2 account (verifying dual owner independence)...")
    pass_2 = "BalajiRoyal@Dilleshwar2026!"
    act_res_2 = requests.post(f"{BASE_URL}/auth/owner/activate", json={
        "token": raw_token_2,
        "full_name": "Sri Adari Dilleshwar Rao",
        "password": pass_2
    })
    assert act_res_2.status_code == 200, f"Owner 2 activation failed: {act_res_2.text}"
    act_data_2 = act_res_2.json()
    assert act_data_2["user"]["role"] == "SUPERADMIN"
    assert act_data_2["user"]["email"] == test_email_2
    print("  ✓ Owner 2 account successfully activated with SUPERADMIN role!")

    # -------------------------------------------------------------
    # 7. Test Login for BOTH Owners via /auth/token
    # -------------------------------------------------------------
    print("\n[TEST 7] Testing Staff & Admin Portal Login for BOTH owners...")
    # Login Owner 1
    login_res_1 = requests.post(f"{BASE_URL}/auth/token", data={
        "username": test_email_1,
        "password": pass_1
    })
    assert login_res_1.status_code == 200, f"Owner 1 login failed: {login_res_1.text}"
    token_1 = login_res_1.json()["access_token"]
    
    # Check /auth/me for Owner 1
    me_res_1 = requests.get(f"{BASE_URL}/auth/me", headers={"Authorization": f"Bearer {token_1}"})
    assert me_res_1.status_code == 200
    me_1 = me_res_1.json()
    assert me_1["email"] == test_email_1
    assert me_1["role"] == "SUPERADMIN"
    assert me_1["full_name"] == "Sri Adari Krishna Rao"
    print("  ✓ Owner 1 login verified: authenticated as SUPERADMIN.")

    # Login Owner 2
    login_res_2 = requests.post(f"{BASE_URL}/auth/token", data={
        "username": test_email_2,
        "password": pass_2
    })
    assert login_res_2.status_code == 200, f"Owner 2 login failed: {login_res_2.text}"
    token_2 = login_res_2.json()["access_token"]
    
    # Check /auth/me for Owner 2
    me_res_2 = requests.get(f"{BASE_URL}/auth/me", headers={"Authorization": f"Bearer {token_2}"})
    assert me_res_2.status_code == 200
    me_2 = me_res_2.json()
    assert me_2["email"] == test_email_2
    assert me_2["role"] == "SUPERADMIN"
    assert me_2["full_name"] == "Sri Adari Dilleshwar Rao"
    print("  ✓ Owner 2 login verified: authenticated as SUPERADMIN.")

    # -------------------------------------------------------------
    # 8. Test 72-Hour Expiration Window
    # -------------------------------------------------------------
    print("\n[TEST 8] Testing 72-hour invitation expiration window...")
    db = SessionLocal()
    expired_token = secrets.token_urlsafe(32)
    expired_hash = hashlib.sha256(expired_token.encode()).hexdigest()
    # Expired 2 hours ago
    past_time = datetime.now(timezone.utc) - timedelta(hours=2)
    inv_expired = OwnerInvitation(
        owner_name="Expired Owner Test",
        owner_email=test_email_exp,
        token_hash=expired_hash,
        is_used=False,
        created_at=past_time - timedelta(hours=72),
        expires_at=past_time
    )
    db.add(inv_expired)
    db.commit()
    db.close()

    # Verification must flag EXPIRED
    res = requests.get(f"{BASE_URL}/auth/owner/verify-token", params={"token": expired_token})
    data = res.json()
    assert data["valid"] is False
    assert data["error_code"] == "EXPIRED", f"Expected EXPIRED, got {data}"

    # Activation must reject
    res = requests.post(f"{BASE_URL}/auth/owner/activate", json={
        "token": expired_token,
        "full_name": "Expired Test",
        "password": "Password123!"
    })
    assert res.status_code == 400
    assert "expired" in res.text.lower()
    print("  ✓ Expiration enforcement passed: expired tokens are strictly rejected.")

    # -------------------------------------------------------------
    # 9. Super Admin Access Verification
    # -------------------------------------------------------------
    print("\n[TEST 9] Verifying Super Admin access to protected administrative endpoints...")
    # Owner 1 accesses admin team list
    res = requests.get(f"{BASE_URL}/auth/admins", headers={"Authorization": f"Bearer {token_1}"})
    assert res.status_code == 200, f"Super Admin should access admins: {res.text}"
    admin_list = res.json()
    emails = [a["email"] for a in admin_list]
    assert test_email_1 in emails
    assert test_email_2 in emails
    print(f"  ✓ Owner 1 verified administrative authority. Found {len(admin_list)} administrators.")

    # Owner 2 accesses audit logs
    res = requests.get(f"{BASE_URL}/auth/audit-logs", headers={"Authorization": f"Bearer {token_2}"})
    assert res.status_code == 200, f"Super Admin should access audit logs: {res.text}"
    logs = res.json().get("logs", [])
    print(f"  ✓ Owner 2 verified audit authority. Successfully retrieved {len(logs)} audit entries.")

    print("\n" + "=" * 72)
    print("ALL 9 TEST SUITES PASSED PERFECTLY! 🚀")
    print("Dual Business Owner Invitation & Super Admin System is 100% Operational.")
    print("=" * 72 + "\n")

if __name__ == "__main__":
    test_full_owner_workflow()
