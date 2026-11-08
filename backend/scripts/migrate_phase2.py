import sqlite3
import datetime

def migrate():
    con = sqlite3.connect('backend/sribalaji.db')
    cursor = con.cursor()
    
    # 1. Inspect orders table columns
    cursor.execute("PRAGMA table_info(orders);")
    order_cols = [row[1] for row in cursor.fetchall()]
    
    new_order_cols = [
        ("fulfillment_type", "VARCHAR(30) DEFAULT 'DELIVERY'"),
        ("admin_notes", "TEXT"),
        ("confirmed_at", "DATETIME"),
        ("dispatched_at", "DATETIME"),
        ("delivered_at", "DATETIME"),
        ("cancelled_at", "DATETIME"),
        ("inventory_deducted", "BOOLEAN DEFAULT 0"),
        ("updated_at", "DATETIME")
    ]
    for col_name, col_type in new_order_cols:
        if col_name not in order_cols:
            print(f"Adding column '{col_name}' to orders table...")
            cursor.execute(f"ALTER TABLE orders ADD COLUMN {col_name} {col_type};")

    # 2. Inspect product_variants table columns
    cursor.execute("PRAGMA table_info(product_variants);")
    variant_cols = [row[1] for row in cursor.fetchall()]
    
    new_variant_cols = [
        ("track_inventory", "BOOLEAN DEFAULT 0"),
        ("min_stock_threshold", "INTEGER DEFAULT 5"),
        ("is_opening_stock_set", "BOOLEAN DEFAULT 0")
    ]
    for col_name, col_type in new_variant_cols:
        if col_name not in variant_cols:
            print(f"Adding column '{col_name}' to product_variants table...")
            cursor.execute(f"ALTER TABLE product_variants ADD COLUMN {col_name} {col_type};")

    # 3. Create order_status_history table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS order_status_history (
        id VARCHAR(36) PRIMARY KEY,
        order_id VARCHAR(36) NOT NULL,
        from_status VARCHAR(30),
        to_status VARCHAR(30) NOT NULL,
        notes TEXT,
        changed_by VARCHAR(120) DEFAULT 'Admin',
        created_at DATETIME NOT NULL,
        FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE
    );
    """)
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_status_history_order ON order_status_history(order_id);")

    # 4. Create stock_movements table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS stock_movements (
        id VARCHAR(36) PRIMARY KEY,
        variant_id VARCHAR(36) NOT NULL,
        movement_type VARCHAR(40) NOT NULL,
        quantity_change INTEGER NOT NULL,
        previous_stock INTEGER NOT NULL,
        new_stock INTEGER NOT NULL,
        reference_id VARCHAR(64),
        notes TEXT,
        created_by VARCHAR(120) DEFAULT 'Admin',
        created_at DATETIME NOT NULL,
        FOREIGN KEY(variant_id) REFERENCES product_variants(id) ON DELETE CASCADE
    );
    """)
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_stock_movements_variant ON stock_movements(variant_id);")

    # 5. Create low_stock_alerts table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS low_stock_alerts (
        id VARCHAR(36) PRIMARY KEY,
        variant_id VARCHAR(36) NOT NULL,
        current_quantity INTEGER NOT NULL,
        threshold INTEGER NOT NULL,
        is_acknowledged BOOLEAN DEFAULT 0,
        acknowledged_at DATETIME,
        acknowledged_by VARCHAR(120),
        is_resolved BOOLEAN DEFAULT 0,
        resolved_at DATETIME,
        created_at DATETIME NOT NULL,
        FOREIGN KEY(variant_id) REFERENCES product_variants(id) ON DELETE CASCADE
    );
    """)
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_low_stock_variant ON low_stock_alerts(variant_id);")

    con.commit()
    con.close()
    print("Migration completed successfully!")

if __name__ == '__main__':
    migrate()
