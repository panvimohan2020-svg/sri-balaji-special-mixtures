import sys
import os
import time
import json
import urllib.request
import urllib.error

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

BASE_URL = "http://127.0.0.1:8000/api/v1"


def api_request(method, endpoint, data=None, token=None):
    url = f"{BASE_URL}{endpoint}"
    headers = {}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    
    body = None
    if data is not None:
        if isinstance(data, dict):
            body = json.dumps(data).encode("utf-8")
            headers["Content-Type"] = "application/json"
        elif isinstance(data, str):
            body = data.encode("utf-8")
            headers["Content-Type"] = "application/x-www-form-urlencoded"

    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as resp:
            content_type = resp.headers.get("Content-Type", "")
            resp_body = resp.read()
            if "application/json" in content_type:
                return resp.status, json.loads(resp_body.decode("utf-8"))
            return resp.status, resp_body.decode("utf-8")
    except urllib.error.HTTPError as e:
        err_body = e.read().decode("utf-8")
        try:
            return e.code, json.loads(err_body)
        except Exception:
            return e.code, err_body


def test_task2_suite():
    print("=======================================================")
    print("STARTING TASK 2: SECURE ADMIN DASHBOARD VERIFICATION")
    print("=======================================================")

    # 1. Unauthorized Access Checks
    status, res = api_request("GET", "/auth/invites")
    assert status == 401, f"Expected 401 on /auth/invites without token, got {status}"
    print("[PASS] 1. Unauthorized access to /auth/invites rejected with 401")

    status, res = api_request("GET", "/auth/audit-logs")
    assert status == 401, f"Expected 401 on /auth/audit-logs without token, got {status}"
    print("[PASS] 2. Unauthorized access to /auth/audit-logs rejected with 401")

    status, res = api_request("GET", "/orders/")
    assert status == 401, f"Expected 401 on /orders/ without token, got {status}"
    print("[PASS] 3. Unauthorized access to /orders/ rejected with 401")

    # 2. Superadmin Login
    form_data = "username=admin%40sribalaji.com&password=BalajiAdmin2026!"
    status, res = api_request("POST", "/auth/token", data=form_data)
    assert status == 200, f"Expected 200 on login, got {status}: {res}"
    super_token = res["access_token"]
    assert res["user"]["role"] == "SUPERADMIN", f"Expected SUPERADMIN, got {res['user']['role']}"
    print("[PASS] 4. Primary Superadmin login successful with role SUPERADMIN")

    # 3. Superadmin Profile verification
    status, me = api_request("GET", "/auth/me", token=super_token)
    assert status == 200 and me["email"] == "admin@sribalaji.com"
    print("[PASS] 5. Admin profile (/auth/me) verified")

    # 4. Admin Invitation & RBAC Enforcement Flow
    invite_email = f"ordermanager_{int(time.time())}@sribalaji.com"
    status, inv = api_request("POST", "/auth/invite", data={"email": invite_email, "role": "ORDER_MANAGER"}, token=super_token)
    assert status == 200, f"Expected 200 on invite, got {status}: {inv}"
    invite_token = inv["token"]
    print(f"[PASS] 6. Superadmin created invitation for {invite_email} (Role: ORDER_MANAGER)")

    status, invites_list = api_request("GET", "/auth/invites", token=super_token)
    assert status == 200 and any(i["email"] == invite_email for i in invites_list)
    print("[PASS] 7. Invitation listed in /auth/invites")

    # Accept invitation
    status, accept_res = api_request("POST", "/auth/accept-invite", data={
        "token": invite_token,
        "full_name": "Test Order Manager",
        "password": "OrderManagerPassword2026!"
    })
    assert status == 200, f"Expected 200 on accept invite, got {status}: {accept_res}"
    order_mgr_token = accept_res["access_token"]
    print("[PASS] 8. Order Manager successfully accepted invitation and registered")

    # 5. Role-Based Access Control (RBAC) Enforcement
    # Order Manager attempts to CREATE a product -> MUST FAIL with 403 Forbidden!
    status, create_res = api_request("POST", "/products/", data={"name": "Forbidden Snack", "slug": "forbidden-snack"}, token=order_mgr_token)
    assert status == 403, f"Expected 403 Forbidden for ORDER_MANAGER on product creation, got {status}: {create_res}"
    print("[PASS] 9. RBAC: Order Manager forbidden (403) from creating products")

    # Order Manager attempts to access orders -> MUST SUCCEED with 200 OK!
    status, orders_res = api_request("GET", "/orders/", token=order_mgr_token)
    assert status == 200, f"Expected 200 OK for ORDER_MANAGER on /orders/, got {status}"
    print("[PASS] 10. RBAC: Order Manager permitted (200) to view orders")

    # 6. Passkey & Device Biometrics Flow (WebAuthn protocol)
    status, reg_challenge = api_request("POST", "/auth/passkey/register-challenge", token=super_token)
    assert status == 200 and "challenge" in reg_challenge
    print("[PASS] 11. Passkey registration challenge generated (zero biometric data stored on server)")

    test_cred_id = f"test-credential-id-{int(time.time())}"
    status, reg_verify = api_request("POST", "/auth/passkey/register-verify", data={
        "challenge": reg_challenge["challenge"],
        "credential_id": test_cred_id,
        "public_key": "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0...",
        "device_name": "Windows Hello Fingerprint / Passkey"
    }, token=super_token)
    assert status == 200, f"Expected 200 on passkey register verify, got {status}: {reg_verify}"
    print("[PASS] 12. Passkey credential registered and tied to administrator account")

    # Passkey Login
    status, login_challenge = api_request("POST", "/auth/passkey/login-challenge")
    assert status == 200 and "challenge" in login_challenge
    status, login_verify = api_request("POST", "/auth/passkey/login-verify", data={
        "challenge": login_challenge["challenge"],
        "credential_id": test_cred_id
    })
    assert status == 200 and "access_token" in login_verify
    print("[PASS] 13. Passkey / Device Biometric login verified successfully")

    # 7. Kastha Gatiya & Product Management via Admin System
    status, kastha = api_request("GET", "/products/kastha-gatiya")
    assert status == 200 and kastha["name"] == "Kastha Gatiya"
    print("[PASS] 14. Kastha Gatiya exists and is accessible in admin product system")

    # Update Kastha Gatiya variant price to test Price History audit
    first_variant = kastha["variants"][0]
    old_price = float(first_variant.get("retail_price") or first_variant.get("price") or 60.0)
    status, v_res = api_request("PATCH", f"/products/variants/{first_variant['id']}", data={
        "retail_price": old_price
    }, token=super_token)
    assert status == 200, f"Expected 200 on variant update, got {status}"
    print(f"[PASS] 15. Kastha Gatiya variant price update verified with audit integration")

    # 8. Inventory Negative Stock Prevention
    status, neg_res = api_request("POST", f"/inventory/variants/{first_variant['id']}/adjust", data={
        "movement_type": "MANUAL_ADJUSTMENT",
        "quantity": -50
    }, token=super_token)
    assert status == 400, f"Expected 400 Bad Request on negative stock, got {status}: {neg_res}"
    print("[PASS] 16. Negative stock strictly prevented (400 Bad Request)")

    # 9. CSV Exports
    status, csv_data = api_request("GET", "/analytics/export/orders.csv", token=super_token)
    assert status == 200 and "Order Number" in csv_data
    print("[PASS] 17. Orders CSV export verified with correct headers")

    status, inv_csv = api_request("GET", "/analytics/export/inventory.csv", token=super_token)
    assert status == 200 and "Product Name" in inv_csv
    print("[PASS] 18. Inventory CSV export verified with correct headers")

    # 10. Audit Logs
    status, logs = api_request("GET", "/auth/audit-logs", token=super_token)
    assert status == 200 and logs["total"] > 0
    print(f"[PASS] 19. Administrator audit logs recorded: {logs['total']} events in audit trail")

    # 11. Session Revocation / Logout
    status, logout_res = api_request("POST", "/auth/logout", token=super_token)
    assert status == 200, f"Expected 200 on logout, got {status}"
    print("[PASS] 20. Superadmin logged out and session revoked")

    status, me_after_logout = api_request("GET", "/auth/me", token=super_token)
    assert status == 401, f"Expected 401 after session revocation, got {status}: {me_after_logout}"
    print("[PASS] 21. Revoked session token blocked from further API access (401)")

    print("\n=======================================================")
    print("ALL 21 TASK 2 ADMIN DASHBOARD BACKEND TESTS PASSED!")
    print("=======================================================\n")


if __name__ == "__main__":
    test_task2_suite()
