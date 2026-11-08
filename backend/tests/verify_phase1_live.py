import urllib.request
import urllib.parse
import json

def run_checks():
    print("=== SRI BALAJI API AUDIT VERIFICATION ===")
    
    # 1. Health check
    req = urllib.request.urlopen("http://127.0.0.1:8000/api/health")
    print("1. Health Status:", req.getcode(), json.loads(req.read()))

    # 2. Products check
    req = urllib.request.urlopen("http://127.0.0.1:8000/api/v1/products")
    products = json.loads(req.read())
    print(f"2. Products count: {len(products)}")

    # 3. Settings check
    req = urllib.request.urlopen("http://127.0.0.1:8000/api/v1/settings")
    settings = json.loads(req.read())
    print(f"3. Business Settings count: {len(settings)}")
    print(f"   WhatsApp: {settings.get('whatsapp_number')}, Phone: {settings.get('contact_number')}")

    # 4. Auth login check
    data = urllib.parse.urlencode({"username": "admin@sribalaji.com", "password": "AdminPassword123!"}).encode()
    auth_req = urllib.request.Request(
        "http://127.0.0.1:8000/api/v1/auth/login",
        data=data,
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    auth_resp = urllib.request.urlopen(auth_req)
    token = json.loads(auth_resp.read())
    access_token = token.get("access_token")
    print(f"4. Admin Auth Successful: token_type={token.get('token_type')}, token_len={len(access_token)}")

    # 5. Test PATCH variant stock and price update
    first_prod = products[0]
    variant = first_prod["variants"][0]
    var_id = variant["id"]
    print(f"5. Testing variant #{var_id} for {first_prod['name']} ({variant['weight']})")
    
    current_stock = variant.get("is_in_stock", True)
    patch_payload = json.dumps({"is_in_stock": current_stock, "retail_price": variant["retail_price"]}).encode()
    patch_req = urllib.request.Request(
        f"http://127.0.0.1:8000/api/v1/products/variants/{var_id}",
        data=patch_payload,
        headers={"Content-Type": "application/json", "Authorization": f"Bearer {access_token}"},
        method="PATCH"
    )
    patch_resp = urllib.request.urlopen(patch_req)
    updated = json.loads(patch_resp.read())
    print(f"   PATCH success: Variant #{updated['id']} is_in_stock={updated['is_in_stock']} price=Rs.{updated['retail_price']}")

    # 6. Test Orders list
    orders_req = urllib.request.Request(
        "http://127.0.0.1:8000/api/v1/orders",
        headers={"Authorization": f"Bearer {access_token}"}
    )
    orders_resp = urllib.request.urlopen(orders_req)
    orders = json.loads(orders_resp.read())
    print(f"6. Orders count in DB: {len(orders)}")
    if orders:
        latest = orders[0]
        print(f"   Latest Order: #{latest.get('id')} - {latest.get('customer_name')} - Rs.{latest.get('total_amount')} ({latest.get('order_type')})")

    print("=== ALL LIVE API VERIFICATIONS PASSED ===")

if __name__ == "__main__":
    run_checks()
