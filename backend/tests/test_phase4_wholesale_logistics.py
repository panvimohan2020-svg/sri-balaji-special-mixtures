import urllib.request
import urllib.parse
import json
import time

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


def test_phase4():
    print("=== STARTING PHASE 4 WHOLESALE DEALER & LOGISTICS VERIFICATION ===")

    # 1. Admin Login
    admin_data = urllib.parse.urlencode({"username": "admin@sribalaji.com", "password": "BalajiAdmin2026!"}).encode("utf-8")
    status_code, admin_auth = make_request(
        f"{BASE_URL}/auth/token",
        data=admin_data.decode("utf-8"),
        headers={"Content-Type": "application/x-www-form-urlencoded"},
        method="POST"
    )
    assert status_code == 200, f"Admin login failed: {admin_auth}"
    admin_header = {"Authorization": f"Bearer {admin_auth['access_token']}"}
    print("[PASS] 1. Administrator authenticated successfully.")

    # 2. Register a Dealer Customer
    dealer_phone = f"99{int(time.time() * 100) % 100000000:08d}"
    status_code, cust_auth = make_request(
        f"{BASE_URL}/customers/login",
        data={"phone_number": dealer_phone, "otp": "123456"},
        method="POST"
    )
    assert status_code == 200
    dealer_token = cust_auth["access_token"]
    dealer_header = {"Authorization": f"Bearer {dealer_token}"}
    print(f"[PASS] 2. B2B Customer signed in. ID: {cust_auth['customer']['id']}")

    # 3. Submit Dealer Application
    dealer_payload = {
        "business_name": "Maa Tarini Wholesale Kirana",
        "business_category": "Kirana Store",
        "owner_name": "Bikash Sahu",
        "phone_number": dealer_phone,
        "email": "bikash.kirana@example.com",
        "gstin": "21AAAAA0000A1Z5",
        "business_address": "Shop No 14, Main Market, Kasinagar",
        "city": "Kasinagar",
        "state": "Odisha",
        "pin_code": "761201",
        "wholesale_requirements": "Requires 100kg mixture and chips monthly"
    }
    status_code, app_resp = make_request(
        f"{BASE_URL}/dealers/apply",
        data=dealer_payload,
        headers=dealer_header,
        method="POST"
    )
    assert status_code == 200
    dealer_id = app_resp["id"]
    assert app_resp["status"] == "PENDING_VERIFICATION"
    print(f"[PASS] 3. Dealer application submitted: #{dealer_id} (Status: {app_resp['status']}).")

    # 4. Admin Reviews & Approves Dealer
    status_code, all_dealers = make_request(f"{BASE_URL}/dealers/", headers=admin_header)
    assert status_code == 200 and len(all_dealers) >= 1
    
    status_code, approve_resp = make_request(
        f"{BASE_URL}/dealers/{dealer_id}/status",
        data={
            "status": "APPROVED",
            "pricing_tier": "DISTRIBUTOR",
            "credit_limit": 50000.0,
            "credit_days": 15,
            "admin_notes": "Verified Kasinagar Kirana business. Tier: Regional Distributor."
        },
        headers=admin_header,
        method="PATCH"
    )
    assert status_code == 200
    assert approve_resp["status"] == "APPROVED"
    print(f"[PASS] 4. Admin approved dealer: {approve_resp['business_name']} as {approve_resp['pricing_tier']}.")

    # 5. Dealer Checks Portal Summary
    status_code, portal_summary = make_request(f"{BASE_URL}/dealers/portal-summary", headers=dealer_header)
    assert status_code == 200
    assert portal_summary["is_approved_dealer"] == True
    assert portal_summary["pricing_tier"] == "DISTRIBUTOR"
    print(f"[PASS] 5. Dealer portal verified: Active Tier = {portal_summary['pricing_tier']}.")

    # 6. Admin Generates Wholesale Quotation
    status_code, prods = make_request(f"{BASE_URL}/products/")
    v1 = prods[0]["variants"][0]
    
    quote_payload = {
        "dealer_id": dealer_id,
        "recipient_name": "Bikash Sahu",
        "business_name": "Maa Tarini Wholesale Kirana",
        "phone_number": dealer_phone,
        "delivery_address": "Main Market, Kasinagar",
        "city": "Kasinagar",
        "delivery_charges": 150.0,
        "valid_days": 15,
        "items": [
            {
                "variant_id": v1["id"],
                "product_name": prods[0]["name"],
                "weight_label": v1["weight_label"],
                "unit_price": float(v1["wholesale_price"] or 60.0),
                "quantity": 20
            }
        ]
    }
    status_code, quote_resp = make_request(f"{BASE_URL}/quotations/", data=quote_payload, headers=admin_header, method="POST")
    assert status_code == 201
    quote_id = quote_resp["id"]
    quote_number = quote_resp["quote_number"]
    assert quote_resp["status"] == "SENT"
    assert quote_resp["delivery_charges"] == 150.0
    print(f"[PASS] 6. Quotation generated: #{quote_number} (Amount: Rs.{quote_resp['total_amount']}).")

    # 7. Convert Quotation to Confirmed Order
    status_code, conv_resp = make_request(f"{BASE_URL}/quotations/{quote_id}/convert-to-order", headers=admin_header, method="POST")
    assert status_code == 200
    order_id = conv_resp["order_id"]
    order_number = conv_resp["order_number"]
    print(f"[PASS] 7. Quotation converted to Order #{order_number} (Status: {conv_resp['status']}).")

    # 8. Check PIN Code Serviceability
    # Serviceable Paralakhemundi
    status_code, pin_check1 = make_request(f"{BASE_URL}/logistics/pincode/761200")
    assert status_code == 200 and pin_check1["is_serviceable"] == True
    print(f"[PASS] 8a. PIN 761200 verified serviceable ({pin_check1['city']}, {pin_check1['zone_name']}).")

    # Serviceable Berhampur
    status_code, pin_check2 = make_request(f"{BASE_URL}/logistics/pincode/760001")
    assert status_code == 200 and pin_check2["is_serviceable"] == True
    print(f"[PASS] 8b. PIN 760001 verified serviceable ({pin_check2['city']}).")

    # Non-serviceable PIN
    status_code, pin_check3 = make_request(f"{BASE_URL}/logistics/pincode/110001")
    assert status_code == 200 and pin_check3["is_serviceable"] == False
    print("[PASS] 8c. Outside region PIN 110001 correctly marked non-serviceable.")

    # 9. Admin Creates Shipment Record
    ship_payload = {
        "order_id": order_id,
        "courier_partner": "Gajapati Regional Express",
        "tracking_number": "GRE-2611-9876",
        "shipping_charges": 150.0,
        "status": "DISPATCHED",
        "destination_pincode": "761201",
        "notes": "Packed in 2 heavy-duty wholesale corrugated cartons."
    }
    status_code, ship_resp = make_request(f"{BASE_URL}/logistics/shipments", data=ship_payload, headers=admin_header, method="POST")
    assert status_code == 201
    shipment_id = ship_resp["id"]
    assert ship_resp["status"] == "DISPATCHED"
    print(f"[PASS] 9. Shipment created for Order #{order_number} (Tracking: {ship_resp['tracking_number']}).")

    # 10. Customer / Dealer Tracks Shipment
    status_code, track_ship = make_request(f"{BASE_URL}/logistics/shipments/order/{order_id}")
    assert status_code == 200
    assert track_ship["tracking_number"] == "GRE-2611-9876"
    assert track_ship["courier_partner"] == "Gajapati Regional Express"
    print("[PASS] 10. Shipment tracking retrieved successfully.")

    # 11. Admin Marks Shipment Delivered
    status_code, deliv_resp = make_request(
        f"{BASE_URL}/logistics/shipments/{shipment_id}/status",
        data={"status": "DELIVERED", "notes": "Handed over to Bikash Sahu at shop counter."},
        headers=admin_header,
        method="PATCH"
    )
    assert status_code == 200
    assert deliv_resp["status"] == "DELIVERED"
    print("[PASS] 11. Shipment marked as DELIVERED.")

    print("\n=======================================================")
    print("ALL 11 PHASE 4 BACKEND INTEGRATION TESTS PASSED!")
    print("=======================================================")

if __name__ == '__main__':
    test_phase4()
