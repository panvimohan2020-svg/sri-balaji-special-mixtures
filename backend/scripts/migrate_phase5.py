"""
Phase 5 Database Migration Script for Sri Balaji Special Mixtures
Adds Loyalty Program, Referrals, Marketing Coupons & Campaigns,
Notification Preferences, and Order Discount extensions.
"""
import os
import sqlite3
import uuid
from datetime import datetime, timezone, timedelta

def get_db_path():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    return os.path.join(base_dir, "sribalaji.db")

def migrate():
    db_path = get_db_path()
    print(f"Connecting to database at: {db_path}")
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()

    # 1. Add discount columns to orders table if missing
    order_cols = [c[1] for c in cur.execute("PRAGMA table_info(orders)").fetchall()]
    new_order_cols = [
        ("coupon_id", "VARCHAR(50)"),
        ("discount_amount", "FLOAT DEFAULT 0.0"),
        ("points_redeemed", "INTEGER DEFAULT 0"),
        ("points_discount", "FLOAT DEFAULT 0.0"),
    ]
    for col_name, col_def in new_order_cols:
        if col_name not in order_cols:
            print(f"Adding column '{col_name}' to 'orders' table...")
            cur.execute(f"ALTER TABLE orders ADD COLUMN {col_name} {col_def}")

    # 2. Loyalty Accounts Table
    cur.execute("""
    CREATE TABLE IF NOT EXISTS loyalty_accounts (
        id VARCHAR(36) PRIMARY KEY,
        customer_id VARCHAR(36) NOT NULL UNIQUE,
        points_balance INTEGER NOT NULL DEFAULT 0,
        lifetime_points_earned INTEGER NOT NULL DEFAULT 0,
        lifetime_points_redeemed INTEGER NOT NULL DEFAULT 0,
        referral_code VARCHAR(32) NOT NULL UNIQUE,
        referred_by_id VARCHAR(36),
        created_at DATETIME NOT NULL,
        updated_at DATETIME NOT NULL,
        FOREIGN KEY (customer_id) REFERENCES customers (id) ON DELETE CASCADE,
        FOREIGN KEY (referred_by_id) REFERENCES customers (id) ON DELETE SET NULL
    )
    """)
    cur.execute("CREATE INDEX IF NOT EXISTS ix_loyalty_accounts_customer_id ON loyalty_accounts(customer_id)")
    cur.execute("CREATE INDEX IF NOT EXISTS ix_loyalty_accounts_referral_code ON loyalty_accounts(referral_code)")

    # 3. Loyalty Transactions Table
    cur.execute("""
    CREATE TABLE IF NOT EXISTS loyalty_transactions (
        id VARCHAR(36) PRIMARY KEY,
        account_id VARCHAR(36) NOT NULL,
        order_id VARCHAR(36),
        transaction_type VARCHAR(32) NOT NULL,
        points INTEGER NOT NULL,
        balance_after INTEGER NOT NULL,
        description VARCHAR(255) NOT NULL,
        created_at DATETIME NOT NULL,
        FOREIGN KEY (account_id) REFERENCES loyalty_accounts (id) ON DELETE CASCADE,
        FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE SET NULL
    )
    """)
    cur.execute("CREATE INDEX IF NOT EXISTS ix_loyalty_txns_account_id ON loyalty_transactions(account_id)")

    # 4. Marketing Coupons Table
    cur.execute("""
    CREATE TABLE IF NOT EXISTS marketing_coupons (
        id VARCHAR(36) PRIMARY KEY,
        code VARCHAR(50) NOT NULL UNIQUE,
        description VARCHAR(255) NOT NULL,
        discount_type VARCHAR(20) NOT NULL,
        discount_value FLOAT NOT NULL,
        min_order_amount FLOAT NOT NULL DEFAULT 0.0,
        max_discount_cap FLOAT,
        valid_from DATETIME NOT NULL,
        valid_until DATETIME NOT NULL,
        usage_limit INTEGER NOT NULL DEFAULT 100,
        usage_count INTEGER NOT NULL DEFAULT 0,
        is_active BOOLEAN NOT NULL DEFAULT 1,
        created_at DATETIME NOT NULL,
        updated_at DATETIME NOT NULL
    )
    """)
    cur.execute("CREATE INDEX IF NOT EXISTS ix_marketing_coupons_code ON marketing_coupons(code)")

    # 5. Marketing Campaigns Table
    cur.execute("""
    CREATE TABLE IF NOT EXISTS marketing_campaigns (
        id VARCHAR(36) PRIMARY KEY,
        title VARCHAR(100) NOT NULL,
        subtitle VARCHAR(255) NOT NULL,
        badge_text VARCHAR(50) NOT NULL,
        cta_text VARCHAR(50) NOT NULL,
        cta_link VARCHAR(100) NOT NULL,
        banner_theme VARCHAR(50) NOT NULL,
        image_url VARCHAR(255),
        is_active BOOLEAN NOT NULL DEFAULT 1,
        start_date DATETIME,
        end_date DATETIME,
        created_at DATETIME NOT NULL
    )
    """)

    # 6. Notification Preferences Table
    cur.execute("""
    CREATE TABLE IF NOT EXISTS notification_preferences (
        id VARCHAR(36) PRIMARY KEY,
        customer_id VARCHAR(36) NOT NULL UNIQUE,
        email_updates BOOLEAN NOT NULL DEFAULT 1,
        sms_updates BOOLEAN NOT NULL DEFAULT 1,
        whatsapp_updates BOOLEAN NOT NULL DEFAULT 1,
        promotional_push BOOLEAN NOT NULL DEFAULT 0,
        created_at DATETIME NOT NULL,
        updated_at DATETIME NOT NULL,
        FOREIGN KEY (customer_id) REFERENCES customers (id) ON DELETE CASCADE
    )
    """)
    cur.execute("CREATE INDEX IF NOT EXISTS ix_notif_prefs_customer_id ON notification_preferences(customer_id)")

    # Seed Initial Coupons if empty
    now_utc = datetime.now(timezone.utc)
    one_year_later = now_utc + timedelta(days=365)
    existing_coupons = cur.execute("SELECT COUNT(*) FROM marketing_coupons").fetchone()[0]
    if existing_coupons == 0:
        print("Seeding initial authentic promotional coupons...")
        coupons = [
            (
                str(uuid.uuid4()),
                "BALAJI10",
                "10% discount on retail orders above Rs. 300",
                "PERCENTAGE",
                10.0,
                300.0,
                100.0,
                now_utc,
                one_year_later,
                500,
                0,
                1,
                now_utc,
                now_utc
            ),
            (
                str(uuid.uuid4()),
                "CRUNCHFEST",
                "Rs. 50 flat festival discount on orders above Rs. 400",
                "FIXED",
                50.0,
                400.0,
                50.0,
                now_utc,
                one_year_later,
                300,
                0,
                1,
                now_utc,
                now_utc
            ),
            (
                str(uuid.uuid4()),
                "FIRSTORDER",
                "Welcome offer: 15% off for first-time customers",
                "PERCENTAGE",
                15.0,
                250.0,
                75.0,
                now_utc,
                one_year_later,
                1000,
                0,
                1,
                now_utc,
                now_utc
            ),
            (
                str(uuid.uuid4()),
                "BULK5",
                "5% wholesale discount bonus on commercial orders above Rs. 2,000",
                "PERCENTAGE",
                5.0,
                2000.0,
                500.0,
                now_utc,
                one_year_later,
                200,
                0,
                1,
                now_utc,
                now_utc
            )
        ]
        cur.executemany("""
        INSERT INTO marketing_coupons (
            id, code, description, discount_type, discount_value, min_order_amount,
            max_discount_cap, valid_from, valid_until, usage_limit, usage_count,
            is_active, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, coupons)

    # Seed Initial Campaigns if empty
    existing_campaigns = cur.execute("SELECT COUNT(*) FROM marketing_campaigns").fetchone()[0]
    if existing_campaigns == 0:
        print("Seeding initial marketing campaigns...")
        campaigns = [
            (
                str(uuid.uuid4()),
                "Traditional Taste of Paralakhemundi",
                "Handcrafted crunchy savouries made with 30 years of pure heritage & aromatic South Odisha spices.",
                "FESTIVAL SPECIAL",
                "Explore Collections",
                "/bundles",
                "ROYAL_GOLD",
                None,
                1,
                now_utc,
                one_year_later,
                now_utc
            ),
            (
                str(uuid.uuid4()),
                "B2B Wholesale & Kirana Supply",
                "Factory-direct wholesale rates, flexible packaging from 250g to 10kg bulk cartons, and fast road transport.",
                "WHOLESALE DEALS",
                "Register as Dealer",
                "/dealer",
                "EMERALD_GREEN",
                None,
                1,
                now_utc,
                one_year_later,
                now_utc
            ),
            (
                str(uuid.uuid4()),
                "Crispy Tea-Time Combos",
                "Pair your evening chai with genuine Onion Mixture, Sev, and Masala Peanuts. Flat 10% off with code BALAJI10.",
                "TEA-TIME FAVORITES",
                "Shop Savouries",
                "/catalog",
                "DEEP_PURPLE",
                None,
                1,
                now_utc,
                one_year_later,
                now_utc
            )
        ]
        cur.executemany("""
        INSERT INTO marketing_campaigns (
            id, title, subtitle, badge_text, cta_text, cta_link, banner_theme,
            image_url, is_active, start_date, end_date, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, campaigns)

    conn.commit()
    conn.close()
    print("Phase 5 database migration completed successfully!")

if __name__ == "__main__":
    migrate()
