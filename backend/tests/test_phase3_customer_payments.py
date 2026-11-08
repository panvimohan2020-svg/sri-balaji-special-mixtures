import urllib.request
import urllib.parse
import json
import hmac
import hashlib

BASE_URL = "http://127.0.0.1:8000/api/v1"

def make_request(url, data=None, headers=None, method="GET"):
    if headers is None:
        headers = {}
    if data is not None and isinstance(data, (dict, list)):
        data = json.dumps(data).encode("utf-8")
        headers["Content-Type"] = "application/json"
    elif data is not None and isinstance(data, str):
        data = data.encode("utf-8")
    
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as response:
            return response.getcode(), json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        error_body = e.read().decode("utf-8")
        try:
            return e.code, json.loads(error_body)
        except:
            return e.code, {"detail": error_body}


def test_phase3():
    print("=== STARTING PHASE 3 CUSTOMER ACCOUNTS & PAYMENT TESTS ===")

    # 1. Customer OTP Request
    test_phone = "9861789602"
    status_code, otp_resp = make_request(
        f"{BASE_URL}/customers/request-otp",
        data={"phone_number": test_phone},
        method="POST"
    )
    assert status_code == 200, f"OTP request failed: {otp_resp}"
    print("[PASS] 1. Customer requested OTP successfully.")

    # 2. Customer Registration / Login
    status_code, auth_resp = make_request(
        f"{BASE_URL}/customers/login",
        data={"phone_number": test_phone, "otp": "123456"},
        method="POST"
    )
    assert status_code == 200, f"Login failed: {auth_resp}"
    cust_token = auth_resp["access_token"]
    cust_id = auth_resp["customer"]["id"]
    cust_header = {"Authorization": f"Bearer {cust_token}"}
    print(f"[PASS] 2. Customer login authenticated. ID: {cust_id}")

    # 3. Update Customer Profile
    status_code, profile = make_request(
        f"{BASE_URL}/customers/me",
        data={"full_name": "Suresh Mohapatra", "email": "suresh.odisha@example.com"},
        headers=cust_header,
        method="PATCH"
    )
    assert status_code == 200
    assert profile["full_name"] == "Suresh Mohapatra"
    print("[PASS] 3. Customer profile updated successfully.")

    # 4. Add Saved Address
    address_payload = {
        "label": "Home",
        "recipient_name": "Suresh Mohapatra",
        "phone_number": test_phone,
        "address_line": "House No 42, Badi Sahi",
        "city": "Paralakhemundi",
        "state": "Odisha",
        "pin_code": "761200",
        "is_default": True
    }
    status_code, address = make_request(
        f"{BASE_URL}/customers/addresses",
        data=address_payload,
        headers=cust_header,
        method="POST"
    )
    assert status_code == 200
    address_id = address["id"]
    print(f"[PASS] 4. Saved address created with ID: {address_id}")

    # List Addresses
    status_code, addr_list = make_request(f"{BASE_URL}/customers/addresses", headers=cust_header)
    assert status_code == 200 and len(addr_list) >= 1
    print(f"[PASS] 4b. Customer has {len(addr_list)} saved address(es).")

    # 5. Customer places an Order linked to their account
    status_code, prods = make_request(f"{BASE_URL}/products/")
    first_var = prods[0]["variants"][0]
    
    order_payload = {
        "customer_id": cust_id,
        "customer_name": "Suresh Mohapatra",
        "phone_number": test_phone,
        "order_type": "RETAIL",
        "fulfillment_type": "DELIVERY",
        "delivery_address": address["address_line"],
        "city": address["city"],
        "state": address["state"],
        "pin_code": address["pin_code"],
        "payment_method": "RAZORPAY_UPI",
        "items": [
            {
                "variant_id": first_var["id"],
                "product_name": prods[0]["name"],
                "weight_label": first_var["weight_label"],
                "quantity": 2
            }
        ]
    }
    status_code, order = make_request(f"{BASE_URL}/orders/", data=order_payload, method="POST")
    assert status_code == 201
    order_id = order["id"]
    order_number = order["order_number"]
    assert order["payment_status"] == "UNPAID"
    print(f"[PASS] 5. Customer order created: #{order_number} (Status: {order['status']}, Payment: {order['payment_status']})")

    # 6. Public Order Tracking (with phone verification)
    status_code, track = make_request(f"{BASE_URL}/orders/track/{order_number}?phone={test_phone}")
    assert status_code == 200
    assert track["order_number"] == order_number
    assert track["status"] == "NEW ENQUIRY"
    print(f"[PASS] 6. Order tracking verified for #{order_number}.")

    # 7. Create Razorpay Payment Order
    status_code, rzp_order = make_request(
        f"{BASE_URL}/payments/create-order",
        data={"order_id": order_id, "gateway": "RAZORPAY"},
        method="POST"
    )
    assert status_code == 200
    rzp_order_id = rzp_order["razorpay_order_id"]
    print(f"[PASS] 7. Payment order created: {rzp_order_id} for Rs.{rzp_order['amount']/100}.")

    # 8. Verify Payment Signature (generate valid HMAC SHA256)
    rzp_pay_id = "pay_test_sribalaji_987654"
    secret = "sribalaji_rzp_secret_key_demo"
    valid_signature = hmac.new(
        secret.encode("utf-8"),
        f"{rzp_order_id}|{rzp_pay_id}".encode("utf-8"),
        hashlib.sha256
    ).hexdigest()

    status_code, verify_resp = make_request(
        f"{BASE_URL}/payments/verify",
        data={
            "order_id": order_id,
            "razorpay_order_id": rzp_order_id,
            "razorpay_payment_id": rzp_pay_id,
            "razorpay_signature": valid_signature
        },
        method="POST"
    )
    assert status_code == 200, f"Verify failed: {verify_resp}"
    assert verify_resp["payment_status"] == "PAID"
    print(f"[PASS] 8. Razorpay signature verified! Order payment status: PAID.")

    # Duplicate payment callback check (Idempotency)
    status_code, dup_resp = make_request(
        f"{BASE_URL}/payments/verify",
        data={
            "order_id": order_id,
            "razorpay_order_id": rzp_order_id,
            "razorpay_payment_id": rzp_pay_id,
            "razorpay_signature": valid_signature
        },
        method="POST"
    )
    assert status_code == 200 and dup_resp["payment_status"] == "PAID"
    print("[PASS] 8b. Idempotency check: Duplicate payment verification safely handled.")

    # 9. Verify Customer Order History & Notifications
    status_code, cust_orders = make_request(f"{BASE_URL}/customers/orders", headers=cust_header)
    assert status_code == 200 and len(cust_orders) >= 1
    found_order = next(o for o in cust_orders if o["order_number"] == order_number)
    assert found_order["payment_status"] == "PAID"
    print(f"[PASS] 9. Customer 'My Orders' shows verified order #{order_number} with status PAID.")

    status_code, notifs = make_request(f"{BASE_URL}/customers/notifications", headers=cust_header)
    assert status_code == 200 and len(notifs) >= 1
    print(f"[PASS] 9b. Customer received {len(notifs)} notification(s): '{notifs[0]['title']}'.")

    # 10. Admin Payment Management Inspection
    # Login admin
    login_data = urllib.parse.urlencode({"username": "admin@sribalaji.com", "password": "BalajiAdmin2026!"}).encode("utf-8")
    status_code, admin_auth = make_request(
        f"{BASE_URL}/auth/token",
        data=login_data.decode("utf-8"),
        headers={"Content-Type": "application/x-www-form-urlencoded"},
        method="POST"
    )
    admin_header = {"Authorization": f"Bearer {admin_auth['access_token']}"}
    status_code, txns = make_request(f"{BASE_URL}/payments/transactions", headers=admin_header)
    assert status_code == 200 and len(txns) >= 1
    target_txn = next(t for t in txns if t["order_id"] == order_id)
    assert target_txn["status"] == "PAID"
    print(f"[PASS] 10. Admin payments dashboard lists transaction {target_txn['transaction_reference']} as PAID.")

    print("\n=======================================================")
    print("ALL 10 PHASE 3 BACKEND INTEGRATION TESTS PASSED!")
    print("=======================================================")

if __name__ == '__main__':
    test_phase3()
