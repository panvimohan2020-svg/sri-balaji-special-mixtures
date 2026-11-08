"""
Automated Test Suite for Balaji Mitra – Sri Balaji AI Snack Discovery & Customer Assistant.
Validates:
- Live service health check (/api/v1/ai/status)
- Quick suggestion query 1: Tell me about the new launch Kastha Gatiya
- Quick suggestion query 2: Which snack is suitable with evening tea?
- Quick suggestion query 3: Which products are spicy?
- Quick suggestion query 4: Bulk cartons for Kirana stores
- Real-time delivery PIN code inquiry (761200 & Gunupur 765022 Custom Transit)
- Real-time order tracking inquiry
- Multilingual responses in English, Odia, Telugu, and Hindi
- Contextual WhatsApp action links (+91 98617 89602)
"""
import os
import sys

# Ensure backend root is in python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_ai_status_endpoint():
    """Verify Balaji Mitra healthcheck returns online status and correct identity."""
    res = client.get("/api/v1/ai/status")
    assert res.status_code == 200, res.text
    data = res.json()
    assert data["status"] == "online"
    assert data["name"] == "Balaji Mitra"
    assert "Crisp & Flavour Assistant" in data["subtitle"]
    assert data["operational"] is True
    print("PASS: Balaji Mitra status endpoint verified (Online)")


def test_kastha_gatiya_inquiry():
    """Verify AI accurately describes new launch Kastha Gatiya with pricing and ajwain."""
    payload = {
        "message": "Tell me about the new launch Kastha Gatiya",
        "language": "en"
    }
    res = client.post("/api/v1/ai/chat", json=payload)
    assert res.status_code == 200, res.text
    data = res.json()
    reply = data["reply"]
    assert "Kastha Gatiya" in reply
    assert "Diwali Special 2026" in reply
    assert "60" in reply  # ₹60 for 250g
    assert "ajwain" in reply.lower() or "carom" in reply.lower()
    assert len(data.get("recommendations", [])) > 0
    assert any("gatiya" in r["name"].lower() or "kastha" in r["name"].lower() for r in data["recommendations"])
    print("PASS: Kastha Gatiya inquiry verified with verified pricing and ingredients")


def test_evening_tea_pairing_inquiry():
    """Verify AI recommends tea-time pairings like Onion Mixture and Murrukulu."""
    payload = {
        "message": "Which snack is suitable with evening tea?",
        "language": "en"
    }
    res = client.post("/api/v1/ai/chat", json=payload)
    assert res.status_code == 200, res.text
    data = res.json()
    reply = data["reply"]
    assert "tea" in reply.lower() or "coffee" in reply.lower()
    assert "Onion Mixture" in reply or "Murrukulu" in reply
    assert len(data.get("recommendations", [])) > 0
    print("PASS: Evening tea pairings inquiry verified")


def test_spicy_snacks_inquiry():
    """Verify AI returns spice ratings and spicy mixtures."""
    payload = {
        "message": "Which products are spicy?",
        "language": "en"
    }
    res = client.post("/api/v1/ai/chat", json=payload)
    assert res.status_code == 200, res.text
    data = res.json()
    reply = data["reply"]
    assert "Spicy" in reply or "Hot" in reply
    assert len(data.get("recommendations", [])) > 0
    print("PASS: Spicy snacks inquiry verified")


def test_bulk_kirana_wholesale_inquiry():
    """Verify AI answers Kirana store inquiries with carton sizes, MOQ, and wholesale desk."""
    payload = {
        "message": "Bulk cartons for Kirana stores",
        "language": "en"
    }
    res = client.post("/api/v1/ai/chat", json=payload)
    assert res.status_code == 200, res.text
    data = res.json()
    reply = data["reply"]
    assert "Wholesale" in reply or "Kirana" in reply
    assert "25kg" in reply or "carton" in reply.lower()
    assert "919861789602" in reply or "919861789602" in data.get("contact_action", "")
    print("PASS: Bulk cartons for Kirana stores inquiry verified")


def test_live_pincode_inquiry_regular():
    """Verify AI queries live database for Paralakhemundi PIN 761200."""
    payload = {
        "message": "Can you deliver to PIN code 761200?",
        "language": "en"
    }
    res = client.post("/api/v1/ai/chat", json=payload)
    assert res.status_code == 200, res.text
    data = res.json()
    reply = data["reply"]
    assert "761200" in reply
    assert "Paralakhemundi" in reply
    assert "Regular Delivery Available" in reply
    print("PASS: Live PIN code check (761200 - Regular) verified in chat")


def test_live_pincode_inquiry_custom_transit():
    """Verify AI queries live database for Gunupur Rural 765022 and reports Custom Transit."""
    payload = {
        "message": "Is delivery available to 765022?",
        "language": "en"
    }
    res = client.post("/api/v1/ai/chat", json=payload)
    assert res.status_code == 200, res.text
    data = res.json()
    reply = data["reply"]
    assert "765022" in reply
    assert "Custom Transit" in reply
    assert "98617 89602" in reply
    print("PASS: Live PIN code check (765022 - Custom Transit) verified in chat")


def test_multilingual_responses():
    """Verify Balaji Mitra responds in Odia, Telugu, and Hindi."""
    # Odia
    res_or = client.post("/api/v1/ai/chat", json={"message": "ନମସ୍କାର", "language": "or"})
    assert res_or.status_code == 200
    assert "ବାଲାଜୀ" in res_or.json()["reply"] or "ଶ୍ରୀ ବାଲାଜୀ" in res_or.json()["reply"]

    # Telugu
    res_te = client.post("/api/v1/ai/chat", json={"message": "నమస్కారం", "language": "te"})
    assert res_te.status_code == 200
    assert "బాలాజీ" in res_te.json()["reply"] or "శ్రీ బాలాజీ" in res_te.json()["reply"]

    # Hindi
    res_hi = client.post("/api/v1/ai/chat", json={"message": "कास्ता गटिया के बारे में बताएं", "language": "hi"})
    assert res_hi.status_code == 200
    assert "कास्ता गटिया" in res_hi.json()["reply"] or "गटिया" in res_hi.json()["reply"]

    print("PASS: Multilingual AI responses (Odia, Telugu, Hindi) verified")


def test_order_tracking_inquiry():
    """Verify AI handles real-time order tracking queries."""
    payload = {
        "message": "Track order SB-986589",
        "language": "en"
    }
    res = client.post("/api/v1/ai/chat", json=payload)
    assert res.status_code == 200, res.text
    data = res.json()
    reply = data["reply"]
    assert "SB-986589" in reply
    assert "ENQUIRY" in reply or "Status" in reply
    print("PASS: Real-time order tracking (SB-986589) verified in chat")


if __name__ == "__main__":
    test_ai_status_endpoint()
    test_kastha_gatiya_inquiry()
    test_evening_tea_pairing_inquiry()
    test_spicy_snacks_inquiry()
    test_bulk_kirana_wholesale_inquiry()
    test_live_pincode_inquiry_regular()
    test_live_pincode_inquiry_custom_transit()
    test_order_tracking_inquiry()
    test_multilingual_responses()
    print("\nALL 9 BALAJI MITRA TEST SUITES PASSED (100% SUCCESS)!")

