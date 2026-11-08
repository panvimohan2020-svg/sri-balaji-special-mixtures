import sqlite3
import datetime

conn = sqlite3.connect('backend/sribalaji.db')
cursor = conn.cursor()

cursor.execute("SELECT id FROM products WHERE id = 'prod-10' OR slug = 'kastha-gatiya'")
existing = cursor.fetchone()

now = datetime.datetime.now(datetime.timezone.utc).isoformat()

if not existing:
    cursor.execute('''
        INSERT INTO products (
            id, category_id, name, slug, description, food_classification,
            spice_level, taste_profiles, ingredients, allergen_info,
            packaging_info, minimum_order_qty, is_available, is_featured,
            created_at, updated_at
        ) VALUES (
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
        )
    ''', (
        'prod-10',
        'cat-3',
        'Kastha Gatiya',
        'kastha-gatiya',
        'Special festive Diwali-26 launch by Sri Balaji Special Mixtures! Handcrafted melt-in-the-mouth crispy Kastha Gatiya (కాస్తా గటియా) prepared with premium gram flour, carom seeds (ajwain), and authentic traditional spices. 100% pure vegetarian, fresh, and free of preservatives. Taste the Tradition!',
        'VEGETARIAN',
        'MEDIUM',
        'Crispy,Festive,Traditional',
        'Premium Bengal gram flour (Besan), Refined edible vegetable oil, Carom seeds (Ajwain), Black pepper hint, Rock salt, Traditional spices.',
        '100% Pure Vegetarian. Hygienically prepared with zero chemical preservatives.',
        'Special festive airtight moisture-barrier sealed food-grade pouch preserving crispness for 90 days.',
        2,
        1,
        1,
        now,
        now
    ))
    
    # Insert variants
    variants = [
        ('v-10-1', 'prod-10', '250g', 250, 60.0, 48.0, 500, 1, 'SBKG-250G', 1, 50, 1),
        ('v-10-2', 'prod-10', '500g', 500, 120.0, 95.0, 350, 1, 'SBKG-500G', 1, 30, 1),
        ('v-10-3', 'prod-10', '1kg', 1000, 240.0, 185.0, 200, 1, 'SBKG-1KG', 1, 20, 1),
        ('v-10-4', 'prod-10', '5kg Bulk Carton', 5000, 1150.0, 900.0, 75, 1, 'SBKG-5KG', 1, 10, 1),
    ]
    cursor.executemany('''
        INSERT INTO product_variants (
            id, product_id, weight_label, weight_in_grams, retail_price,
            wholesale_price, stock_quantity, is_in_stock, sku,
            track_inventory, min_stock_threshold, is_opening_stock_set
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', variants)
    
    # Insert images
    images = [
        ('img-10-1', 'prod-10', '/images/products/kastha-gatiya.png', 'Sri Balaji Kastha Gatiya Authentic Pack and Fresh Snack Bowl', 1, 1),
        ('img-10-2', 'prod-10', '/images/products/kastha-gatiya-promo.png', 'Sri Balaji Kastha Gatiya Diwali-26 Official Promotional Artwork', 0, 2),
        ('img-10-3', 'prod-10', '/images/products/kastha-gatiya-pack.png', 'Sri Balaji Kastha Gatiya Sealed Packet Close-up', 0, 3),
    ]
    cursor.executemany('''
        INSERT INTO product_images (
            id, product_id, image_url, alt_text, is_primary, display_order
        ) VALUES (?, ?, ?, ?, ?, ?)
    ''', images)
    
    conn.commit()
    print('Kastha Gatiya (prod-10) successfully inserted into SQLite database!')
else:
    print('Product prod-10 already exists in DB.')

conn.close()

