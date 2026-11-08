"""
Test Suite for Expanded Regional Delivery Coverage:
1. Verifies all 30 Odisha districts via /api/v1/logistics/districts/odisha
2. Verifies new regional PINs:
   - Angul (759122) -> REGULAR
   - Serango (761208) -> REGULAR
   - Gurandi (761210) -> REGULAR
   - Nandigam (532204) -> REGULAR
   - Ichchapuram (532312) -> REGULAR
   - Chhatrapur (761020) -> REGULAR
3. Verifies Autocomplete endpoint (/api/v1/logistics/autocomplete)
4. Verifies multi-attribute search across PIN, mandal, village, town, district
5. Verifies unavailable PIN handling
"""
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

OFFICIAL_30_ODISHA = [
    "Angul", "Balangir", "Balasore", "Bargarh", "Bhadrak", "Boudh", "Cuttack",
    "Deogarh", "Dhenkanal", "Gajapati", "Ganjam", "Jagatsinghpur", "Jajpur",
    "Jharsuguda", "Kalahandi", "Kandhamal", "Kendrapara", "Kendujhar", "Khordha",
    "Koraput", "Malkangiri", "Mayurbhanj", "Nabarangpur", "Nayagarh", "Nuapada",
    "Puri", "Rayagada", "Sambalpur", "Subarnapur", "Sundargarh"
]


def test_30_odisha_districts():
    res = client.get("/api/v1/logistics/districts/odisha")
    assert res.status_code == 200, res.text
    data = res.json()
    assert data["total_districts"] == 30, f"Expected 30 districts, got {data['total_districts']}"
    dist_names = [d["district_name"] for d in data["districts"]]
    for expected in OFFICIAL_30_ODISHA:
        assert expected in dist_names, f"Missing district: {expected}"
    print("PASS: All 30 official Odisha districts returned with real status")


def test_expanded_pins():
    test_cases = [
        ("759122", "Angul", "REGULAR"),
        ("761208", "Serango", "REGULAR"),
        ("761210", "Gurandi", "REGULAR"),
        ("532204", "Nandigam", "REGULAR"),
        ("532312", "Ichchapuram", "REGULAR"),
        ("761020", "Chhatrapur", "REGULAR"),
    ]
    for pin, city, expected_status in test_cases:
        res = client.get(f"/api/v1/logistics/pincode/{pin}")
        assert res.status_code == 200, res.text
        data = res.json()
        assert data["serviceability_status"] == expected_status, f"{pin} {city} status mismatch: {data['serviceability_status']}"
        assert data["is_serviceable"] is True
        print(f"PASS: {city} ({pin}) verified as {expected_status}")


def test_autocomplete_endpoint():
    res = client.get("/api/v1/logistics/autocomplete?q=Serango")
    assert res.status_code == 200
    suggestions = res.json()
    assert len(suggestions) > 0
    assert any(s["pincode"] == "761208" for s in suggestions)
    print("PASS: Autocomplete for 'Serango' returned 761208")

    res2 = client.get("/api/v1/logistics/autocomplete?q=Pathapatnam")
    assert res2.status_code == 200
    suggestions2 = res2.json()
    assert any(s["pincode"] == "532201" for s in suggestions2)
    print("PASS: Autocomplete for 'Pathapatnam' returned 532201")


def test_mandal_and_locality_search():
    queries = ["Gosani", "Ranipeta", "Adava", "Chandragiri", "Garabandha"]
    for q in queries:
        res = client.get(f"/api/v1/logistics/search?q={q}")
        assert res.status_code == 200
        data = res.json()
        assert data["count"] > 0, f"Expected search results for query: {q}"
        print(f"PASS: Locality/mandal search for '{q}' returned {data['count']} matches")


def test_unavailable_pin():
    # Test random non-corridor PIN (e.g., Delhi 110001)
    res = client.get("/api/v1/logistics/pincode/110001")
    assert res.status_code == 200
    data = res.json()
    assert data["serviceability_status"] == "UNAVAILABLE"
    assert data["is_serviceable"] is False
    assert "Currently Unavailable" in data["status_label"]
    print("PASS: Non-serviceable PIN 110001 properly distinguished as UNAVAILABLE")


if __name__ == "__main__":
    test_30_odisha_districts()
    test_expanded_pins()
    test_autocomplete_endpoint()
    test_mandal_and_locality_search()
    test_unavailable_pin()
    print("\nALL EXPANDED COVERAGE TESTS PASSED 100%!")
