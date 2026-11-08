import sqlite3
import datetime

def migrate():
    con = sqlite3.connect('backend/sribalaji.db')
    cursor = con.cursor()
    
    # 1. Update orders table
    cursor.execute("PRAGMA table_info(orders);")
    order_cols = [row[1] for row in cursor.fetchall()]
    
    new_order_cols = [
        ("customer_id", "VARCHAR(36)"),
        ("payment_status", "VARCHAR(30) DEFAULT 'UNPAID'"),
        ("payment_method", "VARCHAR(50) DEFAULT 'WHATSAPP_CONFIRMATION'"),
        ("paid_at", "DATETIME")
    ]
    for col_name, col_type in new_order_cols:
        if col_name not in order_cols:
            print(f"Adding column '{col_name}' to orders table...")
            cursor.execute(f"ALTER TABLE orders ADD COLUMN {col_name} {col_type};")

    # 2. Create customers table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS customers (
        id VARCHAR(36) PRIMARY KEY,
        phone_number VARCHAR(25) NOT NULL UNIQUE,
        email VARCHAR(120),
        full_name VARCHAR(120) NOT NULL,
        hashed_password VARCHAR(255),
        is_verified BOOLEAN DEFAULT 1,
        is_active BOOLEAN DEFAULT 1,
        default_address_id VARCHAR(36),
        created_at DATETIME NOT NULL,
        last_login DATETIME
    );
    """)
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone_number);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);")

    # 3. Create customer_addresses table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS customer_addresses (
        id VARCHAR(36) PRIMARY KEY,
        customer_id VARCHAR(36) NOT NULL,
        label VARCHAR(50) DEFAULT 'Home',
        recipient_name VARCHAR(120) NOT NULL,
        phone_number VARCHAR(25) NOT NULL,
        address_line TEXT NOT NULL,
        city VARCHAR(80) DEFAULT 'Paralakhemundi',
        state VARCHAR(80) DEFAULT 'Odisha',
        pin_code VARCHAR(15) DEFAULT '761200',
        is_default BOOLEAN DEFAULT 0,
        created_at DATETIME NOT NULL,
        FOREIGN KEY(customer_id) REFERENCES customers(id) ON DELETE CASCADE
    );
    """)
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_addresses_customer ON customer_addresses(customer_id);")

    # 4. Create payment_transactions table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS payment_transactions (
        id VARCHAR(36) PRIMARY KEY,
        order_id VARCHAR(36) NOT NULL,
        customer_id VARCHAR(36),
        transaction_reference VARCHAR(64) NOT NULL UNIQUE,
        gateway VARCHAR(30) DEFAULT 'RAZORPAY',
        gateway_order_id VARCHAR(128),
        gateway_payment_id VARCHAR(128),
        gateway_signature VARCHAR(255),
        amount NUMERIC(12, 2) NOT NULL,
        currency VARCHAR(10) DEFAULT 'INR',
        status VARCHAR(30) DEFAULT 'PENDING',
        payment_method VARCHAR(50),
        error_code VARCHAR(100),
        error_description TEXT,
        created_at DATETIME NOT NULL,
        updated_at DATETIME NOT NULL,
        FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY(customer_id) REFERENCES customers(id) ON DELETE SET NULL
    );
    """)
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_payments_order ON payment_transactions(order_id);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_payments_tx_ref ON payment_transactions(transaction_reference);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_payments_gw_order ON payment_transactions(gateway_order_id);")

    # 5. Create customer_notifications table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS customer_notifications (
        id VARCHAR(36) PRIMARY KEY,
        customer_id VARCHAR(36) NOT NULL,
        order_id VARCHAR(36),
        type VARCHAR(50) NOT NULL,
        title VARCHAR(150) NOT NULL,
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT 0,
        created_at DATETIME NOT NULL,
        FOREIGN KEY(customer_id) REFERENCES customers(id) ON DELETE CASCADE,
        FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE
    );
    """)
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_notifications_customer ON customer_notifications(customer_id);")

    con.commit()
    con.close()
    print("Phase 3 Database migration completed successfully!")

if __name__ == '__main__':
    migrate()
