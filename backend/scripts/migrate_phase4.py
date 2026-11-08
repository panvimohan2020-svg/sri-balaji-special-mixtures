import sqlite3
import datetime
import uuid

def migrate():
    con = sqlite3.connect('backend/sribalaji.db')
    cursor = con.cursor()
    
    # 1. Update orders table with dealer_id and quotation_id
    cursor.execute("PRAGMA table_info(orders);")
    order_cols = [row[1] for row in cursor.fetchall()]
    
    new_order_cols = [
        ("dealer_id", "VARCHAR(36)"),
        ("quotation_id", "VARCHAR(36)")
    ]
    for col_name, col_type in new_order_cols:
        if col_name not in order_cols:
            print(f"Adding column '{col_name}' to orders table...")
            cursor.execute(f"ALTER TABLE orders ADD COLUMN {col_name} {col_type};")

    # 2. Create dealer_profiles table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS dealer_profiles (
        id VARCHAR(36) PRIMARY KEY,
        customer_id VARCHAR(36) NOT NULL,
        business_name VARCHAR(150) NOT NULL,
        business_category VARCHAR(80) NOT NULL,
        owner_name VARCHAR(120) NOT NULL,
        phone_number VARCHAR(25) NOT NULL,
        email VARCHAR(120),
        gstin VARCHAR(25),
        pan_number VARCHAR(20),
        business_address TEXT NOT NULL,
        city VARCHAR(80) DEFAULT 'Paralakhemundi',
        state VARCHAR(80) DEFAULT 'Odisha',
        pin_code VARCHAR(15) DEFAULT '761200',
        status VARCHAR(30) DEFAULT 'PENDING_VERIFICATION',
        pricing_tier VARCHAR(40) DEFAULT 'STANDARD_WHOLESALE',
        wholesale_requirements TEXT,
        credit_limit NUMERIC(12, 2) DEFAULT 0.00,
        credit_days INTEGER DEFAULT 0,
        admin_notes TEXT,
        verified_at DATETIME,
        verified_by VARCHAR(120),
        created_at DATETIME NOT NULL,
        updated_at DATETIME NOT NULL,
        FOREIGN KEY(customer_id) REFERENCES customers(id) ON DELETE CASCADE
    );
    """)
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_dealer_customer ON dealer_profiles(customer_id);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_dealer_status ON dealer_profiles(status);")

    # 3. Create wholesale_quotations table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS wholesale_quotations (
        id VARCHAR(36) PRIMARY KEY,
        quote_number VARCHAR(32) NOT NULL UNIQUE,
        dealer_id VARCHAR(36),
        customer_id VARCHAR(36),
        recipient_name VARCHAR(120) NOT NULL,
        business_name VARCHAR(150),
        phone_number VARCHAR(25) NOT NULL,
        email VARCHAR(120),
        delivery_address TEXT,
        city VARCHAR(80) DEFAULT 'Paralakhemundi',
        state VARCHAR(80) DEFAULT 'Odisha',
        pin_code VARCHAR(15) DEFAULT '761200',
        status VARCHAR(30) DEFAULT 'DRAFT',
        subtotal NUMERIC(12, 2) DEFAULT 0.00,
        delivery_charges NUMERIC(10, 2) DEFAULT 0.00,
        total_amount NUMERIC(12, 2) DEFAULT 0.00,
        total_weight_kg NUMERIC(8, 2) DEFAULT 0.00,
        valid_until DATETIME NOT NULL,
        terms_and_conditions TEXT,
        notes TEXT,
        converted_order_id VARCHAR(36),
        created_by VARCHAR(120) DEFAULT 'Admin',
        created_at DATETIME NOT NULL,
        updated_at DATETIME NOT NULL,
        FOREIGN KEY(dealer_id) REFERENCES dealer_profiles(id) ON DELETE SET NULL,
        FOREIGN KEY(customer_id) REFERENCES customers(id) ON DELETE SET NULL,
        FOREIGN KEY(converted_order_id) REFERENCES orders(id) ON DELETE SET NULL
    );
    """)
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_quotations_quote_num ON wholesale_quotations(quote_number);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_quotations_dealer ON wholesale_quotations(dealer_id);")

    # 4. Create quotation_items table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS quotation_items (
        id VARCHAR(36) PRIMARY KEY,
        quotation_id VARCHAR(36) NOT NULL,
        variant_id VARCHAR(36),
        product_name VARCHAR(160) NOT NULL,
        weight_label VARCHAR(50) NOT NULL,
        unit_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
        quantity INTEGER NOT NULL DEFAULT 1,
        subtotal NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
        FOREIGN KEY(quotation_id) REFERENCES wholesale_quotations(id) ON DELETE CASCADE,
        FOREIGN KEY(variant_id) REFERENCES product_variants(id) ON DELETE SET NULL
    );
    """)
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_quote_items_quotation ON quotation_items(quotation_id);")

    # 5. Create shipment_records table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS shipment_records (
        id VARCHAR(36) PRIMARY KEY,
        order_id VARCHAR(36) NOT NULL UNIQUE,
        courier_partner VARCHAR(100) NOT NULL DEFAULT 'Regional Transport / Local Van',
        tracking_number VARCHAR(100) NOT NULL,
        tracking_url VARCHAR(500),
        dispatch_date DATETIME NOT NULL,
        estimated_delivery_date DATETIME,
        actual_delivery_date DATETIME,
        shipping_charges NUMERIC(10, 2) DEFAULT 0.00,
        status VARCHAR(40) DEFAULT 'DISPATCHED',
        destination_pincode VARCHAR(15),
        recipient_name VARCHAR(120),
        recipient_phone VARCHAR(25),
        delivery_address TEXT,
        notes TEXT,
        created_at DATETIME NOT NULL,
        updated_at DATETIME NOT NULL,
        FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE
    );
    """)
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_shipments_order ON shipment_records(order_id);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_shipments_tracking ON shipment_records(tracking_number);")

    # 6. Create serviceable_pincodes table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS serviceable_pincodes (
        id VARCHAR(36) PRIMARY KEY,
        pincode VARCHAR(15) NOT NULL UNIQUE,
        city VARCHAR(80) NOT NULL,
        district VARCHAR(80) NOT NULL,
        state VARCHAR(80) NOT NULL DEFAULT 'Odisha',
        zone_name VARCHAR(80) DEFAULT 'South Odisha Hub',
        is_active BOOLEAN DEFAULT 1,
        min_delivery_days INTEGER DEFAULT 1,
        max_delivery_days INTEGER DEFAULT 3,
        standard_shipping_rate NUMERIC(8, 2) DEFAULT 0.00,
        cod_available BOOLEAN DEFAULT 1
    );
    """)
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_pincodes_pincode ON serviceable_pincodes(pincode);")

    # 7. Seed authentic regional PIN codes
    pincodes_to_seed = [
        ("761200", "Paralakhemundi", "Gajapati", "Odisha", "Local Paralakhemundi Zone", 1, 1, 0.0, True),
        ("761201", "Kasinagar", "Gajapati", "Odisha", "Gajapati District", 1, 2, 40.0, True),
        ("761206", "Mohana", "Gajapati", "Odisha", "Gajapati District", 1, 2, 50.0, True),
        ("761211", "Rayagada (Gajapati)", "Gajapati", "Odisha", "Gajapati District", 1, 2, 50.0, True),
        ("760001", "Berhampur (Main)", "Ganjam", "Odisha", "South Odisha Regional Hub", 1, 2, 50.0, True),
        ("760002", "Berhampur (Bada Bazar)", "Ganjam", "Odisha", "South Odisha Regional Hub", 1, 2, 50.0, True),
        ("760004", "Berhampur (Industrial)", "Ganjam", "Odisha", "South Odisha Regional Hub", 1, 2, 50.0, True),
        ("765001", "Rayagada (Town)", "Rayagada", "Odisha", "South Odisha Regional Hub", 2, 3, 60.0, True),
        ("765002", "Rayagada (J.K. Pur)", "Rayagada", "Odisha", "South Odisha Regional Hub", 2, 3, 60.0, True),
        ("765017", "Gunupur", "Rayagada", "Odisha", "South Odisha Regional Hub", 1, 2, 50.0, True),
        ("532201", "Pathapatnam", "Srikakulam", "Andhra Pradesh", "Border Interstate Hub", 1, 2, 40.0, True),
        ("532001", "Srikakulam Town", "Srikakulam", "Andhra Pradesh", "Border Interstate Hub", 2, 3, 60.0, True),
        ("751001", "Bhubaneswar", "Khordha", "Odisha", "State Capital Distributor Hub", 2, 4, 80.0, True),
        ("753001", "Cuttack", "Cuttack", "Odisha", "Commercial Wholesale Hub", 2, 4, 80.0, True)
    ]

    for pin, city, dist, state, zone, min_d, max_d, rate, cod in pincodes_to_seed:
        cursor.execute("SELECT id FROM serviceable_pincodes WHERE pincode = ?;", (pin,))
        if not cursor.fetchone():
            cursor.execute("""
            INSERT INTO serviceable_pincodes (id, pincode, city, district, state, zone_name, is_active, min_delivery_days, max_delivery_days, standard_shipping_rate, cod_available)
            VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?, ?, ?);
            """, (str(uuid.uuid4()), pin, city, dist, state, zone, min_d, max_d, rate, cod))

    con.commit()
    con.close()
    print("Phase 4 Database migration and regional PIN code seeding completed successfully!")

if __name__ == '__main__':
    migrate()
