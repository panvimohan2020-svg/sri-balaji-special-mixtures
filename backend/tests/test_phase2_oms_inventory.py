import urllib.request
import urllib.parse
import json
import sys

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


def test_suite():
    print("=== STARTING PHASE 2 OMS & SMART INVENTORY VERIFICATION ===")

    # 1. Admin Login
    login_data = urllib.parse.urlencode({
        "username": "admin@sribalaji.com",
        "password": "BalajiAdmin2026!"
    }).encode("utf-8")
    status_code, token_resp = make_request(
        f"{BASE_URL}/auth/token",
        data=login_data.decode("utf-8"),
        headers={"Content-Type": "application/x-www-form-urlencoded"},
        method="POST"
    )
    assert status_code == 200, f"Login failed: {token_resp}"
    token = token_resp["access_token"]
    auth_header = {"Authorization": f"Bearer {token}"}
    print("[PASS] 1. Admin login authenticated successfully.")

    # 2. Get Products and select first variant
    status_code, products = make_request(f"{BASE_URL}/products/")
    assert status_code == 200 and len(products) > 0, "Failed to load products"
    first_product = products[0]
    first_variant = first_product["variants"][0]
    variant_id = first_variant["id"]
    print(f"[PASS] 2. Selected variant: {first_product['name']} ({first_variant['weight_label']}) [ID: {variant_id}]")

    # 3. Configure Inventory Tracking & Threshold
    status_code, config_resp = make_request(
        f"{BASE_URL}/inventory/variants/{variant_id}/config",
        data={"track_inventory": True, "min_stock_threshold": 10},
        headers=auth_header,
        method="PATCH"
    )
    assert status_code == 200, f"Config update failed: {config_resp}"
    print("[PASS] 3. Enabled inventory tracking with threshold = 10.")

    # 4. Set Opening Stock to 50
    status_code, adjust_resp = make_request(
        f"{BASE_URL}/inventory/variants/{variant_id}/adjust",
        data={
            "movement_type": "OPENING_STOCK",
            "quantity": 50,
            "notes": "Verified opening stock for Phase 2 test"
        },
        headers=auth_header,
        method="POST"
    )
    assert status_code == 200, f"Stock adjustment failed: {adjust_resp}"
    assert adjust_resp["new_stock"] == 50
    print(f"[PASS] 4. Set opening stock to 50. Stock quantity = {adjust_resp['new_stock']}.")

    # 5. Customer Submits Retail Enquiry (Enquiry Stage - Stock NOT deducted)
    order_payload = {
        "customer_name": "Ramesh Patnaik",
        "phone_number": "9876543210",
        "whatsapp_number": "9876543210",
        "order_type": "RETAIL",
        "fulfillment_type": "DELIVERY",
        "delivery_address": "Main Road, Paralakhemundi",
        "city": "Paralakhemundi",
        "state": "Odisha",
        "notes": "Please deliver in afternoon",
        "items": [
            {
                "variant_id": variant_id,
                "product_name": first_product["name"],
                "weight_label": first_variant["weight_label"],
                "quantity": 5
            }
        ]
    }
    status_code, order_resp = make_request(
        f"{BASE_URL}/orders/",
        data=order_payload,
        method="POST"
    )
    assert status_code == 201, f"Order creation failed: {order_resp}"
    order_id = order_resp["id"]
    order_number = order_resp["order_number"]
    assert order_resp["status"] == "NEW ENQUIRY"
    assert order_resp["inventory_deducted"] == False
    assert len(order_resp["status_history"]) >= 1
    print(f"[PASS] 5. Created customer order enquiry #{order_number}. Status: {order_resp['status']}, Total: Rs.{order_resp['total_estimated_amount']}.")

    # Verify inventory is still 50
    status_code, inv_items = make_request(f"{BASE_URL}/inventory/items", headers=auth_header)
    target_item = next(i for i in inv_items if i["variant_id"] == variant_id)
    assert target_item["stock_quantity"] == 50, "Stock should NOT be deducted on enquiry!"
    print(f"[PASS] 5b. Verified inventory unchanged (still {target_item['stock_quantity']}) after enquiry.")

    # 6. Admin transitions to CONTACTED
    status_code, update_resp = make_request(
        f"{BASE_URL}/orders/{order_id}/status",
        data={"status": "CONTACTED", "notes": "Called customer to confirm delivery address"},
        headers=auth_header,
        method="PATCH"
    )
    assert status_code == 200, f"Status update failed: {update_resp}"
    assert update_resp["new_status"] == "CONTACTED"
    print("[PASS] 6. Status updated to CONTACTED.")

    # 7. Admin CONFIRMS order -> Stock MUST be deducted by 5 (50 -> 45)
    status_code, confirm_resp = make_request(
        f"{BASE_URL}/orders/{order_id}/status",
        data={"status": "CONFIRMED", "notes": "Customer confirmed order via phone"},
        headers=auth_header,
        method="PATCH"
    )
    assert status_code == 200, f"Confirmation failed: {confirm_resp}"
    assert confirm_resp["inventory_deducted"] == True

    # Check inventory is now 45
    status_code, inv_items = make_request(f"{BASE_URL}/inventory/items", headers=auth_header)
    target_item = next(i for i in inv_items if i["variant_id"] == variant_id)
    assert target_item["stock_quantity"] == 45, f"Expected 45, got {target_item['stock_quantity']}"
    print(f"[PASS] 7. Order CONFIRMED: Inventory correctly deducted (50 -> {target_item['stock_quantity']}).")

    # 8. Admin adds internal note
    status_code, note_resp = make_request(
        f"{BASE_URL}/orders/{order_id}/admin-notes",
        data={"admin_notes": "VIP Retail customer. Packed in double carton."},
        headers=auth_header,
        method="PATCH"
    )
    assert status_code == 200
    print("[PASS] 8. Admin internal notes updated successfully.")

    # 9. Admin CANCELS the confirmed order -> Stock MUST be restored (45 -> 50)
    status_code, cancel_resp = make_request(
        f"{BASE_URL}/orders/{order_id}/status",
        data={"status": "CANCELLED", "notes": "Customer cancelled due to travel"},
        headers=auth_header,
        method="PATCH"
    )
    assert status_code == 200
    assert cancel_resp["inventory_deducted"] == False

    status_code, inv_items = make_request(f"{BASE_URL}/inventory/items", headers=auth_header)
    target_item = next(i for i in inv_items if i["variant_id"] == variant_id)
    assert target_item["stock_quantity"] == 50, f"Expected stock restored to 50, got {target_item['stock_quantity']}"
    print(f"[PASS] 9. Order CANCELLED: Stock restored back to {target_item['stock_quantity']}.")

    # 10. Test Low Stock Alert Generation
    # Adjust stock down to 8 (which is below threshold 10)
    status_code, adjust_resp = make_request(
        f"{BASE_URL}/inventory/variants/{variant_id}/adjust",
        data={"movement_type": "MANUAL_ADJUSTMENT", "quantity": 8, "notes": "Audited stock count"},
        headers=auth_header,
        method="POST"
    )
    assert status_code == 200
    assert adjust_resp["new_stock"] == 8

    status_code, alerts = make_request(f"{BASE_URL}/inventory/alerts", headers=auth_header)
    target_alert = next((a for a in alerts if a["variant_id"] == variant_id and not a["is_resolved"]), None)
    assert target_alert is not None, "Low stock alert should have been triggered!"
    print(f"[PASS] 10. Low-stock alert triggered: Available {target_alert['current_quantity']} <= Threshold {target_alert['threshold']}.")

    # Acknowledge alert
    alert_id = target_alert["id"]
    status_code, ack_resp = make_request(f"{BASE_URL}/inventory/alerts/{alert_id}/acknowledge", headers=auth_header, method="POST")
    assert status_code == 200
    print("[PASS] 10b. Alert acknowledged successfully.")

    # Replenish stock to 60 -> Alert should resolve automatically!
    status_code, _ = make_request(
        f"{BASE_URL}/inventory/variants/{variant_id}/adjust",
        data={"movement_type": "PURCHASE_INWARD", "quantity": 52, "notes": "Fresh batch from factory"},
        headers=auth_header,
        method="POST"
    )
    status_code, alerts_after = make_request(f"{BASE_URL}/inventory/alerts", headers=auth_header)
    unresolved = [a for a in alerts_after if a["variant_id"] == variant_id and not a["is_resolved"]]
    assert len(unresolved) == 0, "Alert should be resolved after replenishment!"
    print("[PASS] 10c. Alert resolved automatically upon replenishing stock above threshold.")

    # 11. Test Stock Movements Audit Log
    status_code, movements = make_request(f"{BASE_URL}/inventory/movements?variant_id={variant_id}", headers=auth_header)
    assert status_code == 200 and len(movements) >= 4, f"Expected >= 4 movements, got {len(movements)}"
    print(f"[PASS] 11. Audit log recorded {len(movements)} movements for variant.")

    # 12. Test Inventory Summary
    status_code, summary = make_request(f"{BASE_URL}/inventory/summary", headers=auth_header)
    assert status_code == 200
    print(f"[PASS] 12. Inventory summary: {summary}")

    print("\n=======================================================")
    print("ALL 12 BACKEND OMS & INVENTORY VERIFICATION TESTS PASSED!")
    print("=======================================================")

if __name__ == "__main__":
    test_suite()
