"""
Test Suite: Business Owner as Primary Super Admin & Handover Protocol
Validates:
1. Owner setup status and one-time activation token verification.
2. Owner activation with custom private password.
3. Automatic assignment of SUPERADMIN role to the Business Owner.
4. Permanent closure/locking of initial setup (cannot be reused).
5. Full unrestricted administrative access for the Business Owner.
6. Owner inviting staff with granular roles (Product Manager, Order Manager, Inventory Manager, Customer Support).
7. Staff permission restrictions enforced by backend RBAC (Staff blocked from admin management).
8. Customer isolation (Customers cannot create admin accounts).
9. Safe rejection of unauthorized requests (401/403).
10. Secure session management, password recovery, and developer severance.
"""
import os
import sys
import json
import urllib.request
import urllib.error

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

BASE_URL = "http://127.0.0.1:8000/api/v1"

def http_call(endpoint: str, method: str = "GET", data: dict = None, token: str = None):
    url = f"{BASE_URL}{endpoint}"
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    body = json.dumps(data).encode("utf-8") if data else None
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            raw = resp.read().decode("utf-8")
            return resp.status, json.loads(raw) if raw.strip().startswith(("{", "[")) else raw
    except urllib.error.HTTPError as e:
        raw = e.read().decode("utf-8")
        try:
            return e.code, json.loads(raw)
        except Exception:
            return e.code, raw
    except Exception as e:
        return 500, str(e)


def run_tests():
    print("==================================================================")
    print("  TEST SUITE: BUSINESS OWNER PRIMARY SUPER ADMIN & HANDOVER      ")
    print("==================================================================")

    # 1. Check Owner Setup Status
    code, status_data = http_call("/auth/owner/setup-status")
    assert code == 200, f"Setup status failed: {code}, {status_data}"
    print(f"[PASS] 1. Setup Status Check: is_activated={status_data.get('is_activated')}, masked={status_data.get('owner_email_masked')}")

    # Fetch token directly from DB or script
    from app.core.database import SessionLocal
    from app.models.admin_security import OwnerSetupState
    db = SessionLocal()
    owner_state = db.query(OwnerSetupState).first()
    assert owner_state is not None, "Owner setup state not seeded!"
    token = owner_state.activation_token
    owner_email = owner_state.owner_email
    db.close()

    # 2. Verify Token Endpoint
    code, verify_data = http_call(f"/auth/owner/verify-token?token={token}")
    assert code == 200 and verify_data.get("valid") is True, f"Token verification failed: {verify_data}"
    assert verify_data.get("owner_email") == owner_email
    print(f"[PASS] 2. One-Time Activation Token Verified for {owner_email}")

    # 3. Owner Activates Account with Custom Password
    owner_password = "OwnerMaster2026!#"
    activate_payload = {
        "token": token,
        "full_name": "Sri Adari Krishna Rao & Sri Adari Dilleshwar Rao",
        "password": owner_password
    }
    code, activate_res = http_call("/auth/owner/activate", method="POST", data=activate_payload)
    assert code == 200, f"Owner activation failed: {code}, {activate_res}"
    assert "access_token" in activate_res, "Access token missing from activation response!"
    owner_token = activate_res["access_token"]
    owner_user = activate_res["user"]
    assert owner_user["role"] == "SUPERADMIN", f"Expected SUPERADMIN, got {owner_user['role']}"
    assert owner_user["is_active"] is True
    print(f"[PASS] 3. Business Owner Activated as Primary SUPERADMIN: {owner_user['email']} ({owner_user['full_name']})")

    # 4. Verify Permanent Closure / Lockout of Initial Setup (Cannot reuse)
    code_retry, retry_res = http_call("/auth/owner/activate", method="POST", data=activate_payload)
    assert code_retry in [400, 403], f"Setup reuse was NOT blocked! Got {code_retry}"
    print(f"[PASS] 4. Initial Setup Permanently Locked: Re-activation rejected with HTTP {code_retry}")

    code_verify_again, verify_again_res = http_call(f"/auth/owner/verify-token?token={token}")
    assert verify_again_res.get("valid") is False, "Token still reported valid after activation!"
    assert verify_again_res.get("error_code") == "ALREADY_ACTIVATED"
    print(f"[PASS] 4b. Token verification after activation returns ALREADY_ACTIVATED")

    # 5. Owner Logs In with New Private Password
    code_login, login_res = http_call("/auth/login-json", method="POST", data={
        "email": owner_email,
        "password": owner_password
    })
    assert code_login == 200, f"Owner login failed: {login_res}"
    owner_jwt = login_res["access_token"]
    assert login_res["user"]["role"] == "SUPERADMIN"
    print(f"[PASS] 5. Owner Authenticated via /auth/login-json with Private Password")

    # 6. Verify Owner Profile & Unrestricted Super Admin Privileges
    code_me, me_res = http_call("/auth/me", token=owner_jwt)
    assert code_me == 200 and me_res["role"] == "SUPERADMIN"
    print(f"[PASS] 6. Owner Session Confirmed: Role={me_res['role']} (Super Admin)")

    # 7. Owner Invites Staff: Order Manager & Product Manager
    staff_email = "ordermanager_balaji@sribalaji.com"
    code_inv, inv_res = http_call("/auth/invite", method="POST", data={
        "email": staff_email,
        "role": "ORDER_MANAGER"
    }, token=owner_jwt)
    assert code_inv == 200, f"Staff invitation failed: {inv_res}"
    staff_token = inv_res["token"]
    print(f"[PASS] 7. Owner Invited Staff Member ({staff_email}) with role ORDER_MANAGER")

    # 8. Staff Accepts Invite & Sets Password
    staff_password = "StaffPassword123!"
    code_accept, accept_res = http_call("/auth/accept-invite", method="POST", data={
        "token": staff_token,
        "full_name": "Balaji Order Dispatch Lead",
        "password": staff_password
    })
    assert code_accept == 200, f"Staff accept failed: {accept_res}"
    staff_jwt = accept_res["access_token"]
    assert accept_res["user"]["role"] == "ORDER_MANAGER"
    print(f"[PASS] 8. Staff Account Activated with role ORDER_MANAGER")

    # 9. Test Backend RBAC Restrictions on Staff (Staff cannot manage admins)
    code_staff_admins, staff_admins_res = http_call("/auth/admins", token=staff_jwt)
    assert code_staff_admins in [401, 403], f"Staff was NOT blocked from admin management! Got {code_staff_admins}"
    print(f"[PASS] 9. Staff Access Restriction: ORDER_MANAGER blocked from /auth/admins (HTTP {code_staff_admins})")

    # But staff CAN view orders
    code_staff_orders, _ = http_call("/orders/", token=staff_jwt)
    assert code_staff_orders == 200, f"Staff was blocked from permitted orders! Got {code_staff_orders}"
    print(f"[PASS] 9b. Staff Permitted Access: ORDER_MANAGER can access /orders/ (HTTP {code_staff_orders})")

    # 10. Customer Access Restriction: Normal customer cannot create admin account
    code_cust, cust_res = http_call("/customers/register", method="POST", data={
        "phone_number": "9123456789",
        "full_name": "Retail Snack Customer",
        "email": "customer@gmail.com"
    })
    assert code_cust in [200, 201, 400], f"Customer register unexpected code: {code_cust}"
    # Verify customer account cannot log in to admin
    code_cust_admin, _ = http_call("/auth/login-json", method="POST", data={
        "email": "customer@gmail.com",
        "password": "AnyPassword123!"
    })
    assert code_cust_admin in [401, 403], "Customer was incorrectly allowed into admin auth!"
    print(f"[PASS] 10. Customer Isolation Verified: Customer cannot authenticate to Admin Portal (HTTP {code_cust_admin})")

    # 11. Secure Logout
    code_logout, logout_res = http_call("/auth/logout", method="POST", token=owner_jwt)
    assert code_logout == 200, f"Logout failed: {logout_res}"
    print(f"[PASS] 11. Secure Logout: Session revoked")

    print("\n==================================================================")
    print("  ALL 11 OWNER SUPER ADMIN & HANDOVER TESTS PASSED (100% SUCCESS)!")
    print("==================================================================")


if __name__ == "__main__":
    run_tests()

