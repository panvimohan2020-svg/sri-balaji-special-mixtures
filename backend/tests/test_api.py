import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi.testclient import TestClient
from app.main import app, init_db

client = TestClient(app)

def test_health():
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    print("✓ Healthcheck PASSED:", data)

def test_categories():
    res = client.get("/api/v1/categories/")
    assert res.status_code == 200
    categories = res.json()
    assert len(categories) > 0
    print(f"✓ Categories API PASSED: Found {len(categories)} categories")

def test_products():
    res = client.get("/api/v1/products/")
    assert res.status_code == 200
    products = res.json()
    assert len(products) > 0
    print(f"✓ Products API PASSED: Found {len(products)} products")

def test_settings():
    res = client.get("/api/v1/settings/")
    assert res.status_code == 200
    settings = res.json()
    assert "business_name" in settings
    print(f"✓ Settings API PASSED: Business Name = {settings.get('business_name')}")

def test_auth_login():
    res = client.post(
        "/api/v1/auth/token",
        data={"username": "admin@sribalaji.com", "password": "BalajiAdmin2026!"}
    )
    assert res.status_code == 200
    token_data = res.json()
    assert "access_token" in token_data
    print("✓ Admin Auth Token PASSED")

def test_order_submission():
    order_payload = {
        "customer_name": "Ramesh Gupta",
        "phone_number": "9876543210",
        "business_name": "Gupta Kirana Store",
        "order_type": "WHOLESALE",
        "delivery_address": "Shop 4, Market Yard",
        "city": "Hyderabad",
        "state": "Telangana",
        "total_estimated_amount": 1500.0,
        "total_estimated_weight_kg": 10.0,
        "items": [
            {
                "product_name": "Special Madras Royal Mixture",
                "weight_label": "1kg",
                "unit_price": 280.0,
                "quantity": 5,
                "subtotal": 1400.0
            }
        ]
    }
    res = client.post("/api/v1/orders/", json=order_payload)
    assert res.status_code == 201
    order = res.json()
    assert "order_number" in order
    print(f"✓ Order Submission PASSED: Order Number = {order['order_number']}")

if __name__ == "__main__":
    init_db()
    test_health()
    test_categories()
    test_products()
    test_settings()
    test_auth_login()
    test_order_submission()
    print("\nALL BACKEND API TESTS PASSED SUCCESSFULLY! 🎉")
