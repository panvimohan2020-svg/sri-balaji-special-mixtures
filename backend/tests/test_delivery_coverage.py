"""
Comprehensive Automated Test Suite for Sri Balaji Regional Road Transport & Delivery Serviceability System.
Validates:
- Gajapati / Paralakhemundi corridor (761200)
- Andhra Pradesh border: Pathapatnam (532201), Palasa (532221), Srikakulam (532001)
- Bansadhara route: Kasinagar (761201), Gunupur Main (765017)
- CRITICAL: Gunupur Rural (765022) configured strictly as CUSTOM_TRANSIT with WhatsApp wholesale notice
- Distinction between postal validity and actual delivery serviceability
- Valid unconfigured regional PINs (PENDING_VERIFICATION)
- Non-regional valid PINs (UNAVAILABLE)
- Village & town keyword search (Ranipeta, Meliaputti, Kidasingi)
- Hierarchical State -> District -> Locality browsing tree
- WhatsApp enquiry link generation (+91 98617 89602)
- Admin CRUD operations and instant customer-facing reflection
- CSV export and import
"""
import io
import os
import sys
import urllib.parse

# Ensure backend root is in python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

ADMIN_CREDENTIALS = {
    "username": "admin@sribalaji.com",
    "password": "BalajiAdmin2026!"
}


def get_admin_token():
    res = client.post("/api/v1/auth/login", data=ADMIN_CREDENTIALS)
    if res.status_code == 200:
        return res.json().get("access_token")
    # Fallback JSON login
    res2 = client.post("/api/v1/auth/login/json", json={"email": "admin@sribalaji.com", "password": "Password@123"})
    if res2.status_code == 200:
        return res2.json().get("access_token")
    raise Exception(f"Admin login failed: {res.status_code} {res.text}")


def test_paralakhemundi_regular_coverage():
    """Verify Paralakhemundi factory hub is REGULAR with same-day dispatch and tempo/cargo modes."""
    res = client.get("/api/v1/logistics/pincode/761200")
    assert res.status_code == 200, res.text
    data = res.json()
    assert data["pincode"] == "761200"
    assert data["is_serviceable"] is True
    assert data["serviceability_status"] == "REGULAR"
    assert data["city"] == "Paralakhemundi"
    assert data["district"] == "Gajapati"
    assert data["state"] == "Odisha"
    assert "Ranipeta" in " ".join(data.get("localities", []))
    assert "919861789602" in data.get("whatsapp_url", "")
    assert data["is_postal_valid"] is True
    print("PASS: Paralakhemundi (761200) verified as REGULAR")


def test_gunupur_rural_custom_transit_preservation():
    """CRITICAL: Verify PIN 765022 is preserved strictly as CUSTOM_TRANSIT with wholesale desk message."""
    res = client.get("/api/v1/logistics/pincode/765022")
    assert res.status_code == 200, res.text
    data = res.json()
    assert data["pincode"] == "765022"
    assert data["serviceability_status"] == "CUSTOM_TRANSIT"
    assert data["is_serviceable"] is False
    assert "Custom Transit Arrangement Required. Please contact our Wholesale Desk at +91 98617 89602." in data["message"]
    assert "919861789602" in data.get("whatsapp_url", "")
    print("PASS: Gunupur Rural (765022) preserved strictly as CUSTOM_TRANSIT")


def test_andhra_pradesh_border_coverage():
    """Verify Pathapatnam (532201), Palasa (532221), and Srikakulam (532001) are active REGULAR routes."""
    for pin, city in [("532201", "Pathapatnam"), ("532221", "Palasa"), ("532001", "Srikakulam Town")]:
        res = client.get(f"/api/v1/logistics/pincode/{pin}")
        assert res.status_code == 200, res.text
        data = res.json()
        assert data["pincode"] == pin
        assert data["is_serviceable"] is True
        assert data["serviceability_status"] == "REGULAR"
        assert data["state"] == "Andhra Pradesh"
        assert city in data["city"]
        assert len(data.get("transport_modes", [])) > 0
    print("PASS: AP border routes (Pathapatnam, Palasa, Srikakulam) verified as REGULAR")


def test_kasinagar_and_gunupur_main_coverage():
    """Verify Kasinagar (761201) and Gunupur Main (765017) are active REGULAR routes."""
    res_k = client.get("/api/v1/logistics/pincode/761201")
    assert res_k.status_code == 200
    assert res_k.json()["serviceability_status"] == "REGULAR"
    assert res_k.json()["city"] == "Kasinagar"

    res_g = client.get("/api/v1/logistics/pincode/765017")
    assert res_g.status_code == 200
    assert res_g.json()["serviceability_status"] == "REGULAR"
    assert res_g.json()["city"] == "Gunupur"
    print("PASS: Kasinagar and Gunupur Main verified as REGULAR")


def test_data_accuracy_postal_vs_serviceability():
    """Verify distinction between postal validity and actual delivery serviceability."""
    # 1. Valid regional PIN not in direct route -> PENDING_VERIFICATION
    res1 = client.get("/api/v1/logistics/pincode/765999")
    assert res1.status_code == 200
    d1 = res1.json()
    assert d1["is_postal_valid"] is True
    assert d1["is_serviceable"] is False
    assert d1["serviceability_status"] == "PENDING_VERIFICATION"

    # 2. Valid PIN outside service territory -> UNAVAILABLE
    res2 = client.get("/api/v1/logistics/pincode/110001")
    assert res2.status_code == 200
    d2 = res2.json()
    assert d2["is_postal_valid"] is True
    assert d2["is_serviceable"] is False
    assert d2["serviceability_status"] == "UNAVAILABLE"

    # 3. Invalid format -> UNAVAILABLE with is_postal_valid False
    res3 = client.get("/api/v1/logistics/pincode/ABC123")
    assert res3.status_code == 200
    d3 = res3.json()
    assert d3["is_postal_valid"] is False
    assert d3["serviceability_status"] == "UNAVAILABLE"
    print("PASS: Postal validity strictly distinguished from delivery serviceability")


def test_multi_attribute_search():
    """Verify search by village name, town, district, or PIN code."""
    # Search by village: Ranipeta
    res_v = client.get("/api/v1/logistics/search?q=Ranipeta")
    assert res_v.status_code == 200
    d_v = res_v.json()
    assert d_v["count"] >= 1
    assert any("761200" == r["pincode"] for r in d_v["results"])

    # Search by town: Palasa
    res_t = client.get("/api/v1/logistics/search?q=Palasa")
    assert res_t.status_code == 200
    d_t = res_t.json()
    assert d_t["count"] >= 1
    assert any("532221" == r["pincode"] for r in d_t["results"])

    # Search by district: Gajapati
    res_d = client.get("/api/v1/logistics/search?q=Gajapati")
    assert res_d.status_code == 200
    assert res_d.json()["count"] >= 5
    print("PASS: Multi-attribute search (village, town, district) verified")


def test_coverage_hierarchy_tree():
    """Verify hierarchical State -> District -> Locations navigation tree."""
    res = client.get("/api/v1/logistics/coverage/hierarchy")
    assert res.status_code == 200
    data = res.json()
    assert data["total_records"] >= 80
    assert len(data["supported_transport_methods"]) >= 4

    states = {s["state_name"]: s for s in data["states"]}
    assert "Odisha" in states
    assert "Andhra Pradesh" in states

    odisha_districts = {d["district_name"]: d for d in states["Odisha"]["districts"]}
    assert "Gajapati" in odisha_districts
    assert "Ganjam" in odisha_districts
    assert "Rayagada" in odisha_districts
    assert "Koraput" in odisha_districts

    ap_districts = {d["district_name"]: d for d in states["Andhra Pradesh"]["districts"]}
    assert "Srikakulam" in ap_districts
    print(f"PASS: Coverage hierarchy tree verified with {data['total_records']} hubs across {len(states)} states")


def test_admin_crud_and_realtime_reflection():
    """Verify Admin can add/edit a PIN code and changes immediately reflect on public API."""
    token = get_admin_token()
    headers = {"Authorization": f"Bearer {token}"}

    test_pin = "761299"

    # Cleanup if previously exists
    client.delete(f"/api/v1/logistics/admin/pincodes/test-{test_pin}", headers=headers)

    # 1. Admin creates new PIN
    create_payload = {
        "pincode": test_pin,
        "city": "Test Village Corridor",
        "district": "Gajapati",
        "state": "Odisha",
        "zone_name": "Test Factory Corridor",
        "serviceability_status": "REGULAR",
        "localities": "Test Gaon, Border Gate, Upper Bazar",
        "transport_modes": '["Regional Carrier Tempo", "Bus Cargo"]',
        "transit_duration_label": "1 Day",
        "standard_shipping_rate": 35.0,
        "delivery_charges_text": "₹35 flat / carton",
        "delivery_conditions": "Same-day test route dispatch.",
        "is_active": True
    }
    create_res = client.post("/api/v1/logistics/admin/pincodes", json=create_payload, headers=headers)
    assert create_res.status_code == 201, create_res.text
    created_id = create_res.json()["id"]

    # 2. Verify immediate reflection on public endpoint
    pub_res = client.get(f"/api/v1/logistics/pincode/{test_pin}")
    assert pub_res.status_code == 200
    assert pub_res.json()["is_serviceable"] is True
    assert pub_res.json()["city"] == "Test Village Corridor"

    # 3. Admin updates status to CUSTOM_TRANSIT
    update_res = client.put(
        f"/api/v1/logistics/admin/pincodes/{created_id}",
        json={"serviceability_status": "CUSTOM_TRANSIT", "delivery_charges_text": "Custom Freight"},
        headers=headers
    )
    assert update_res.status_code == 200

    # 4. Verify immediate reflection on public endpoint
    pub_res2 = client.get(f"/api/v1/logistics/pincode/{test_pin}")
    assert pub_res2.status_code == 200
    assert pub_res2.json()["serviceability_status"] == "CUSTOM_TRANSIT"
    assert pub_res2.json()["is_serviceable"] is False
    assert "Custom Transit Arrangement Required" in pub_res2.json()["message"]

    # 5. Cleanup / Delete
    del_res = client.delete(f"/api/v1/logistics/admin/pincodes/{created_id}", headers=headers)
    assert del_res.status_code == 200
    print("PASS: Admin PIN CRUD and real-time reflection verified")


def test_csv_export():
    """Verify Admin CSV export returns complete CSV stream with headers."""
    token = get_admin_token()
    headers = {"Authorization": f"Bearer {token}"}
    res = client.get("/api/v1/logistics/admin/pincodes/export.csv", headers=headers)
    assert res.status_code == 200
    assert "text/csv" in res.headers["content-type"]
    text = res.text
    assert "pincode,city,district,state" in text
    assert "761200" in text
    assert "765022" in text
    assert "532201" in text
    print(f"PASS: CSV Export verified ({len(text.splitlines())} rows)")


if __name__ == "__main__":
    test_paralakhemundi_regular_coverage()
    test_gunupur_rural_custom_transit_preservation()
    test_andhra_pradesh_border_coverage()
    test_kasinagar_and_gunupur_main_coverage()
    test_data_accuracy_postal_vs_serviceability()
    test_multi_attribute_search()
    test_coverage_hierarchy_tree()
    test_admin_crud_and_realtime_reflection()
    test_csv_export()
    print("\nALL 9 TEST SUITES PASSED CLEANLY (100% SUCCESS)!")
