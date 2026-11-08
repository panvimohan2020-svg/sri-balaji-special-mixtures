import os
import requests
import sqlite3

def run_task1_verification():
    print("=== STARTING TASK 1: KASTHA GATIYA VERIFICATION ===")
    base_url = "http://127.0.0.1:8000"
    
    # 1. Verify single product endpoint
    res = requests.get(f"{base_url}/api/v1/products/kastha-gatiya")
    assert res.status_code == 200, f"Expected 200, got {res.status_code}"
    p = res.json()
    print("[PASS] 1. API endpoint /api/v1/products/kastha-gatiya returned 200 OK.")
    
    # 2. Verify name and brand
    assert p["name"] == "Kastha Gatiya", f"Unexpected name: {p['name']}"
    assert p["food_classification"] == "VEGETARIAN", "Classification must be VEGETARIAN"
    print("[PASS] 2. Product Name is 'Kastha Gatiya', Pure Vegetarian.")
    
    # 3. Verify description
    expected_desc = "Special festive Diwali-26 launch by Sri Balaji Special Mixtures! Handcrafted, melt-in-the-mouth crispy Kastha Gatiya (కాస్తా గటియా), prepared with premium gram flour, carom seeds (ajwain), and authentic traditional spices. 100% pure vegetarian, fresh, and free from preservatives. Taste the Tradition!"
    assert p["description"] == expected_desc, f"Description mismatch:\nGot: {p['description']}\nExpected: {expected_desc}"
    print("[PASS] 3. Description matches verified authentic text.")
    
    # 4. Verify weight variants & pricing
    variants = {v["weight_label"]: v for v in p["variants"]}
    assert "250g" in variants, "250g variant missing"
    assert variants["250g"]["retail_price"] == 60.0, f"250g retail price should be 60, got {variants['250g']['retail_price']}"
    assert variants["250g"]["wholesale_price"] == 48.0, f"250g wholesale price should be 48, got {variants['250g']['wholesale_price']}"
    
    assert "500g" in variants, "500g variant missing"
    assert variants["500g"]["retail_price"] == 120.0, f"500g retail price should be 120, got {variants['500g']['retail_price']}"
    assert variants["500g"]["wholesale_price"] == 95.0, f"500g wholesale price should be 95, got {variants['500g']['wholesale_price']}"
    
    assert "1kg" in variants, "1kg variant missing"
    assert variants["1kg"]["retail_price"] == 240.0, f"1kg retail price should be 240, got {variants['1kg']['retail_price']}"
    assert variants["1kg"]["wholesale_price"] == 185.0, f"1kg wholesale price should be 185, got {variants['1kg']['wholesale_price']}"
    
    assert "5kg Bulk Carton" in variants, "5kg Bulk Carton variant missing"
    assert variants["5kg Bulk Carton"]["retail_price"] == 1150.0, f"5kg Bulk retail price should be 1150, got {variants['5kg Bulk Carton']['retail_price']}"
    assert variants["5kg Bulk Carton"]["wholesale_price"] == 900.0, f"5kg Bulk wholesale price should be 900, got {variants['5kg Bulk Carton']['wholesale_price']}"
    print("[PASS] 4. All 4 weight variants (250g, 500g, 1kg, 5kg) & pricing verified.")
    
    # 5. Verify product images on disk and frontend public directory
    img_path = "frontend/public/images/products/kastha-gatiya.png"
    assert os.path.exists(img_path), f"Primary image {img_path} does not exist"
    assert os.path.getsize(img_path) > 100000, "Image file size should be substantial"
    print(f"[PASS] 5. Primary image asset exists ({os.path.getsize(img_path)} bytes).")
    
    # 6. Verify catalogue uniqueness (no duplication)
    res_all = requests.get(f"{base_url}/api/v1/products/")
    all_products = res_all.json()
    kastha_count = sum(1 for prod in all_products if prod["slug"] == "kastha-gatiya" or prod["name"] == "Kastha Gatiya")
    assert kastha_count == 1, f"Expected exactly 1 Kastha Gatiya in catalogue, found {kastha_count}"
    print(f"[PASS] 6. Exact catalogue uniqueness confirmed (Found exactly {kastha_count} instance).")
    
    # 7. Verify search API
    for q in ["gatiya", "kastha"]:
        res_search = requests.get(f"{base_url}/api/v1/products/?search={q}")
        search_names = [prod["name"] for prod in res_search.json()]
        assert "Kastha Gatiya" in search_names, f"Query '{q}' did not return Kastha Gatiya. Results: {search_names}"
    print("[PASS] 7. Search API verified for 'gatiya' and 'kastha'.")
    
    # 8. Verify Homepage does NOT have dedicated spotlight section
    with open("frontend/src/pages/HomePage.tsx", "r", encoding="utf-8") as f:
        hp_content = f.read()
    assert "Special Item for Diwali-26 • New Launch" not in hp_content, "Promotional spotlight must be removed from HomePage"
    assert "EXCLUSIVE NEW LAUNCH SPOTLIGHT" not in hp_content, "Spotlight section must be removed from HomePage"
    print("[PASS] 8. Restrictions verified: Dedicated promotional spotlight successfully removed from HomePage.")

    print("\n=======================================================")
    print("ALL TASK 1 TESTS PASSED SUCCESSFULLY! PROCEEDING TO TASK 2.")
    print("=======================================================")

if __name__ == "__main__":
    run_task1_verification()

