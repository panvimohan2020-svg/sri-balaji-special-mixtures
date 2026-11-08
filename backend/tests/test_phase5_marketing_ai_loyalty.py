"""
Phase 5 Comprehensive Backend Test Suite for Sri Balaji Special Mixtures:
- Marketing Coupons & Validation Engine
- Active Festival Campaigns & Banners
- AI Snack Discovery Concierge (Balaji Mitra) with Multilingual Understanding
- Customer Loyalty Points, Welcome Credits & Referral Codes
- Notification Channel Preferences
- Advanced Business Analytics & Confirmed Revenue Accounting
"""
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


def test_phase5():
    print("=== STARTING PHASE 5 MARKETING, AI, LOYALTY & ANALYTICS VERIFICATION ===")

    # 1. Admin Authentication
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

    # 2. Marketing Coupons Validation
    status_code, valid_c1 = make_request(
        f"{BASE_URL}/marketing/coupons/validate",
        data={"code": "BALAJI10", "cart_amount": 500.0},
        method="POST"
    )
    assert status_code == 200
    assert valid_c1["is_valid"] == True
    assert valid_c1["discount_amount"] == 50.0  # 10% of 500
    assert valid_c1["final_cart_amount"] == 450.0
    print(f"[PASS] 2. Coupon BALAJI10 validated: Discount Rs. {valid_c1['discount_amount']} on Rs. 500 cart.")

    # 2b. Min amount check
    status_code, under_min = make_request(
        f"{BASE_URL}/marketing/coupons/validate",
        data={"code": "BALAJI10", "cart_amount": 100.0},
        method="POST"
    )
    assert status_code == 200
    assert under_min["is_valid"] == False
    print("[PASS] 2b. Coupon min amount threshold enforced properly.")

    # 3. Active Marketing Campaigns
    status_code, campaigns = make_request(f"{BASE_URL}/marketing/campaigns")
    assert status_code == 200
    assert len(campaigns) >= 1
    print(f"[PASS] 3. Active marketing campaigns retrieved: {len(campaigns)} campaign banners active.")

    # 4. AI Snack Discovery Concierge (Balaji Mitra)
    status_code, ai_tea = make_request(
        f"{BASE_URL}/ai/chat",
        data={"message": "Which snack is suitable with evening tea?", "language": "en"},
        method="POST"
    )
    assert status_code == 200
    assert len(ai_tea["recommendations"]) > 0
    assert "Onion Mixture" in ai_tea["reply"] or "Mixture" in ai_tea["reply"]
    print(f"[PASS] 4. AI Assistant tea-time recommendation: {len(ai_tea['recommendations'])} grounded products returned.")

    # 4b. AI Spicy Inquiry
    status_code, ai_spicy = make_request(
        f"{BASE_URL}/ai/chat",
        data={"message": "Which products are spicy?", "language": "en"},
        method="POST"
    )
    assert status_code == 200
    assert any("Spicy" in r["spice_level"] for r in ai_spicy["recommendations"])
    print("[PASS] 4b. AI Assistant accurately filtered spicy snack profiles.")

    # 4c. AI Onion vs Chuda Mixture Comparison
    status_code, ai_diff = make_request(
        f"{BASE_URL}/ai/chat",
        data={"message": "What is the difference between Onion Mixture and Chuda Mixture?", "language": "en"},
        method="POST"
    )
    assert status_code == 200
    assert "poha" in ai_diff["reply"].lower() or "beaten rice" in ai_diff["reply"].lower()
    print("[PASS] 4c. AI Assistant accurately detailed authentic culinary differences.")

    # 4d. AI Multilingual test (Odia & Hindi)
    status_code, ai_odia = make_request(
        f"{BASE_URL}/ai/chat",
        data={"message": "Which snack is suitable with evening tea?", "language": "or"},
        method="POST"
    )
    assert status_code == 200
    assert "ଶ୍ରୀ ବାଲାଜୀ" in ai_odia["reply"] or "ଚାହା" in ai_odia["reply"]
    print("[PASS] 4d. AI Assistant generated verified Odia regional response.")

    # 5. Customer Loyalty Account & Referral System
    test_phone = f"97{int(time.time() * 100) % 100000000:08d}"
    status_code, cust_auth = make_request(
        f"{BASE_URL}/customers/login",
        data={"phone_number": test_phone, "otp": "123456"},
        method="POST"
    )
    assert status_code == 200
    cust_token = cust_auth["access_token"]
    cust_header = {"Authorization": f"Bearer {cust_token}"}

    status_code, loyalty_acc = make_request(f"{BASE_URL}/loyalty/my-account", headers=cust_header)
    assert status_code == 200
    assert loyalty_acc["points_balance"] == 50  # 50 welcome points
    assert loyalty_acc["referral_code"].startswith("SB-")
    print(f"[PASS] 5. Customer loyalty account verified: 50 welcome points, Referral Code: {loyalty_acc['referral_code']}")

    # 6. Loyalty Points Redemption Estimation
    status_code, redeem_est = make_request(
        f"{BASE_URL}/loyalty/redeem-estimate",
        data={"cart_amount": 400.0, "points_to_redeem": 30},
        headers=cust_header,
        method="POST"
    )
    assert status_code == 200
    assert redeem_est["points_discount"] == 30.0
    assert redeem_est["final_cart_amount"] == 370.0
    assert redeem_est["points_balance_remaining"] == 20
    print(f"[PASS] 6. Loyalty redemption estimate: 30 pts -> Rs. 30 discount (Cart: Rs. 400 -> Rs. 370).")

    # 7. Notification Channel Preferences
    status_code, pref_res = make_request(
        f"{BASE_URL}/loyalty/preferences",
        data={"whatsapp_updates": True, "promotional_push": True},
        headers=cust_header,
        method="PATCH"
    )
    assert status_code == 200
    assert pref_res["promotional_push"] == True
    print("[PASS] 7. Customer notification channel preferences updated with explicit consent.")

    # 8. Advanced Business Analytics Summary
    status_code, analytics_summary = make_request(f"{BASE_URL}/analytics/dashboard-summary?period=all", headers=admin_header)
    assert status_code == 200
    assert "confirmed_revenue" in analytics_summary
    assert "retail_revenue" in analytics_summary
    assert "wholesale_revenue" in analytics_summary
    assert "average_order_value" in analytics_summary
    assert "top_selling_products" in analytics_summary
    assert "repeat_customer_rate" in analytics_summary
    print(f"[PASS] 8. Analytics summary calculated: Confirmed Rev: Rs. {analytics_summary['confirmed_revenue']}, AOV: Rs. {analytics_summary['average_order_value']}, Top Products: {len(analytics_summary['top_selling_products'])}")

    print("\n=======================================================")
    print("ALL 8 PHASE 5 BACKEND VERIFICATION TESTS PASSED SUCCESSFULLY! 🎉")
    print("=======================================================\n")

if __name__ == "__main__":
    test_phase5()
