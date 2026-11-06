"""Reseed database with real authentic Sri Balaji snack catalog and verified prices."""
import os
import sys

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.database import engine, Base, SessionLocal
from app.models import Category, Product, ProductVariant, ProductImage, BusinessSetting

def reseed():
    db = SessionLocal()
    try:
        # Clear existing product data
        db.query(ProductImage).delete()
        db.query(ProductVariant).delete()
        db.query(Product).delete()
        db.query(Category).delete()
        db.commit()

        # 1. Categories
        categories = [
            Category(
                id="cat-1",
                name="Special Mixtures",
                slug="mixtures",
                description="Sri Balaji signature crispy mixtures made with fried besan sev, spicy boondi, roasted groundnuts, and aromatic curry leaves.",
                image_url="/images/products/onion-mixture.png",
                display_order=1
            ),
            Category(
                id="cat-2",
                name="Chips & Wafers",
                slug="chips",
                description="Golden-crisp savoury corn chips, potato wafers, and crunchy snack bites seasoned with traditional spices.",
                image_url="/images/brand/seven-flavors-lineup.png",
                display_order=2
            ),
            Category(
                id="cat-3",
                name="Traditional Snacks",
                slug="traditional-snacks",
                description="Classic South Indian and Odisha savouries including Kar Kar Murrukulu, Crispy Rings Chegodilu, and Ribbon Pakoda.",
                image_url="/images/products/kar-kar-murrukulu.png",
                display_order=3
            ),
            Category(
                id="cat-4",
                name="Spicy Crunchies",
                slug="spicy-snacks",
                description="Crispy Peanuts Pakodi, spicy mixture blends, and fiery crunchies for spice lovers.",
                image_url="/images/products/crispy-peanuts-pakodi.png",
                display_order=4
            ),
            Category(
                id="cat-5",
                name="Special Savouries",
                slug="special-snacks",
                description="Festive celebration savouries, Gujarat Mix Chivda, Kaju Biscuits Mixture, and multi-flavour combo packs.",
                image_url="/images/products/gujarat-mix-chivda.png",
                display_order=5
            ),
        ]
        db.add_all(categories)
        db.commit()

        # 2. Products
        products = [
            Product(
                id="prod-1",
                category_id="cat-1",
                name="Onion Mixture",
                slug="onion-mixture",
                description="Sri Balaji's authentic signature Onion Mixture prepared with crispy golden besan sev, roasted peanuts, crunchy fried onions, and fragrant curry leaves.",
                food_classification="VEGETARIAN",
                spice_level="MEDIUM",
                taste_profiles="Crunchy,Savory,Traditional",
                ingredients="Gram flour (Besan), Crispy fried onions, Refined edible vegetable oil, Roasted groundnuts, Curry leaves, Red chilli powder, Rock salt, Asafoetida (Hing).",
                allergen_info="Contains Groundnuts (Peanuts). 100% Pure Vegetarian.",
                minimum_order_qty=2,
                is_featured=True
            ),
            Product(
                id="prod-2",
                category_id="cat-1",
                name="Chuda Mixture (Poha Mixture)",
                slug="chuda-mixture",
                description="Crispy roasted and lightly fried flattened rice (chuda/poha) tossed with roasted groundnuts, crispy sev, curry leaves, and traditional mild aromatic spices.",
                food_classification="VEGETARIAN",
                spice_level="MILD",
                taste_profiles="Crunchy,Light,Traditional",
                ingredients="Flattened rice (Chuda/Poha), Groundnuts, Bengal gram flour, Edible vegetable oil, Curry leaves, Turmeric, Rock salt, Mild spice blend.",
                allergen_info="Contains Groundnuts (Peanuts). 100% Pure Vegetarian.",
                minimum_order_qty=2,
                is_featured=True
            ),
            Product(
                id="prod-3",
                category_id="cat-4",
                name="Crispy Peanuts Pakodi",
                slug="crispy-peanuts-pakodi",
                description="Plump high-grade groundnuts double-coated in spicy seasoned chickpea flour batter and fried to a deep golden, crunchy perfection.",
                food_classification="VEGETARIAN",
                spice_level="SPICY",
                taste_profiles="Crunchy,Spicy,Nutty",
                ingredients="Selected Groundnuts, Bengal gram flour (Besan), Rice flour, Edible vegetable oil, Red chilli powder, Garlic hint, Salt, Hing.",
                allergen_info="Contains Groundnuts (Peanuts). 100% Pure Vegetarian.",
                minimum_order_qty=2,
                is_featured=True
            ),
            Product(
                id="prod-4",
                category_id="cat-3",
                name="Crispy Rings (Chegodilu)",
                slug="crispy-rings",
                description="Classic traditional savory ring snacks (Chegodilu) made from rice flour dough seasoned with sesame seeds, cumin, and mild spices with an irresistible snap.",
                food_classification="VEGETARIAN",
                spice_level="MEDIUM",
                taste_profiles="Crispy,Savory,Traditional",
                ingredients="Rice flour, Moong dal, Edible vegetable oil, White sesame seeds, Cumin seeds, Rock salt, Mild red chilli.",
                allergen_info="Contains Sesame. 100% Pure Vegetarian.",
                minimum_order_qty=2,
                is_featured=True
            ),
            Product(
                id="prod-5",
                category_id="cat-5",
                name="Kaju Biscuits Mixture",
                slug="kaju-biscuits-mixture",
                description="Special savory cashew-shaped crispy diamond biscuits blended with spicy fine sev, roasted peanuts, and traditional seasonings.",
                food_classification="VEGETARIAN",
                spice_level="MILD",
                taste_profiles="Crunchy,Savory,Special",
                ingredients="Wheat flour, Gram flour, Groundnuts, Edible vegetable oil, Cumin, Carom seeds (Ajwain), Rock salt, Spices.",
                allergen_info="Contains Wheat (Gluten) and Groundnuts. 100% Pure Vegetarian.",
                minimum_order_qty=2,
                is_featured=True
            ),
            Product(
                id="prod-6",
                category_id="cat-3",
                name="Kar Kar Murrukulu",
                slug="kar-kar-murrukulu",
                description="Sri Balaji's signature tea-time snack. Thin, ultra-crispy golden murruku spirals enriched with white sesame seeds, cumin, and traditional seasoning.",
                food_classification="VEGETARIAN",
                spice_level="MEDIUM",
                taste_profiles="Crispy,Crunchy,Traditional",
                ingredients="Rice flour, Bengal gram flour, Edible vegetable oil, White sesame seeds, Cumin seeds, Salt, Pure spices.",
                allergen_info="Contains Sesame. 100% Pure Vegetarian.",
                minimum_order_qty=2,
                is_featured=True
            ),
            Product(
                id="prod-7",
                category_id="cat-1",
                name="Gujarat Mix Chivda",
                slug="gujarat-mix-chivda",
                description="A delightful sweet, salty, and mildly spicy Gujarati style specialty chivda loaded with crunchy cashews, roasted peanuts, curry leaves, and raisins.",
                food_classification="VEGETARIAN",
                spice_level="MILD",
                taste_profiles="Sweet & Spicy,Crunchy,Special",
                ingredients="Thin flattened rice (Poha), Cashew nuts, Golden raisins, Groundnuts, Edible vegetable oil, Curry leaves, Powdered sugar, Rock salt, Spices.",
                allergen_info="Contains Tree Nuts (Cashews) and Groundnuts. 100% Pure Vegetarian.",
                minimum_order_qty=2,
                is_featured=True
            ),
            Product(
                id="prod-8",
                category_id="cat-5",
                name="Seven Flavors Signature Collection",
                slug="seven-flavors-collection",
                description="The complete tasting set of Sri Balaji's 7 signature freshly prepared airtight pouches: Onion Mixture, Chuda Mixture, Mong Dal Mixture, Spicy Mixture, Bundi Mixture, Corn Chips Mixture, and Crispy Murrukulu.",
                food_classification="VEGETARIAN",
                spice_level="MEDIUM",
                taste_profiles="Crunchy,Spicy,Special",
                ingredients="Assorted gram flour savouries, roasted pulses, peanuts, cashew nuts, flattened rice, corn flakes, and authentic spices.",
                allergen_info="Contains Groundnuts (Peanuts) and Tree Nuts. 100% Pure Vegetarian.",
                minimum_order_qty=1,
                is_featured=True
            ),
            Product(
                id="prod-9",
                category_id="cat-3",
                name="Wholesale Commercial Bulk Pack",
                slug="wholesale-commercial-bulk-pack",
                description="Authentic wholesale bulk assortment in heavy-duty clear transparent packs as prepared for kirana stores, grocery merchants, tea vendors, and distributors across Paralakhemundi.",
                food_classification="VEGETARIAN",
                spice_level="MEDIUM",
                taste_profiles="Traditional,Crunchy,Wholesale",
                ingredients="Assorted fresh batches of Ribbon Pakoda, Mixture, Boondi, Sev, and Peanuts.",
                allergen_info="Contains Groundnuts. 100% Pure Vegetarian.",
                minimum_order_qty=1,
                is_featured=False
            ),
        ]
        db.add_all(products)
        db.commit()

        # 3. Variants
        variants = [
            # prod-1: Onion Mixture
            ProductVariant(product_id="prod-1", weight_label="250g", weight_in_grams=250, retail_price=60, wholesale_price=48, sku="SBOM-250G"),
            ProductVariant(product_id="prod-1", weight_label="500g", weight_in_grams=500, retail_price=120, wholesale_price=95, sku="SBOM-500G"),
            ProductVariant(product_id="prod-1", weight_label="1kg", weight_in_grams=1000, retail_price=240, wholesale_price=185, sku="SBOM-1KG"),
            # prod-2: Chuda Mixture
            ProductVariant(product_id="prod-2", weight_label="250g", weight_in_grams=250, retail_price=60, wholesale_price=48, sku="SBCM-250G"),
            ProductVariant(product_id="prod-2", weight_label="500g", weight_in_grams=500, retail_price=120, wholesale_price=95, sku="SBCM-500G"),
            ProductVariant(product_id="prod-2", weight_label="1kg", weight_in_grams=1000, retail_price=240, wholesale_price=185, sku="SBCM-1KG"),
            # prod-3: Crispy Peanuts Pakodi
            ProductVariant(product_id="prod-3", weight_label="250g", weight_in_grams=250, retail_price=60, wholesale_price=50, sku="SBPP-250G"),
            ProductVariant(product_id="prod-3", weight_label="500g", weight_in_grams=500, retail_price=130, wholesale_price=105, sku="SBPP-500G"),
            ProductVariant(product_id="prod-3", weight_label="1kg", weight_in_grams=1000, retail_price=260, wholesale_price=205, sku="SBPP-1KG"),
            # prod-4: Crispy Rings
            ProductVariant(product_id="prod-4", weight_label="250g", weight_in_grams=250, retail_price=60, wholesale_price=48, sku="SBCR-250G"),
            ProductVariant(product_id="prod-4", weight_label="500g", weight_in_grams=500, retail_price=120, wholesale_price=95, sku="SBCR-500G"),
            ProductVariant(product_id="prod-4", weight_label="1kg", weight_in_grams=1000, retail_price=240, wholesale_price=185, sku="SBCR-1KG"),
            # prod-5: Kaju Biscuits Mixture
            ProductVariant(product_id="prod-5", weight_label="250g", weight_in_grams=250, retail_price=60, wholesale_price=48, sku="SBKB-250G"),
            ProductVariant(product_id="prod-5", weight_label="500g", weight_in_grams=500, retail_price=120, wholesale_price=95, sku="SBKB-500G"),
            # prod-6: Kar Kar Murrukulu
            ProductVariant(product_id="prod-6", weight_label="250g", weight_in_grams=250, retail_price=60, wholesale_price=48, sku="SBKM-250G"),
            ProductVariant(product_id="prod-6", weight_label="500g", weight_in_grams=500, retail_price=120, wholesale_price=95, sku="SBKM-500G"),
            # prod-7: Gujarat Mix Chivda
            ProductVariant(product_id="prod-7", weight_label="250g", weight_in_grams=250, retail_price=60, wholesale_price=48, sku="SBGC-250G"),
            ProductVariant(product_id="prod-7", weight_label="500g", weight_in_grams=500, retail_price=120, wholesale_price=95, sku="SBGC-500G"),
            # prod-8: Seven Flavors Combo
            ProductVariant(product_id="prod-8", weight_label="7 x 250g Combo Pack", weight_in_grams=1750, retail_price=399, wholesale_price=315, sku="SBSF-7X250G"),
            ProductVariant(product_id="prod-8", weight_label="7 x 500g Family Pack", weight_in_grams=3500, retail_price=799, wholesale_price=630, sku="SBSF-7X500G"),
            # prod-9: Wholesale Bulk Pack
            ProductVariant(product_id="prod-9", weight_label="3kg Wholesale Bag", weight_in_grams=3000, retail_price=720, wholesale_price=540, sku="SBWB-3KG"),
            ProductVariant(product_id="prod-9", weight_label="5kg Commercial Carton", weight_in_grams=5000, retail_price=1150, wholesale_price=880, sku="SBWB-5KG"),
        ]
        db.add_all(variants)
        db.commit()

        # 4. Images
        images = [
            ProductImage(product_id="prod-1", image_url="/images/products/onion-mixture.png", is_primary=True),
            ProductImage(product_id="prod-2", image_url="/images/products/chuda-mixture.png", is_primary=True),
            ProductImage(product_id="prod-3", image_url="/images/products/crispy-peanuts-pakodi.png", is_primary=True),
            ProductImage(product_id="prod-4", image_url="/images/products/crispy-rings.png", is_primary=True),
            ProductImage(product_id="prod-5", image_url="/images/products/kaju-biscuits-mixture.png", is_primary=True),
            ProductImage(product_id="prod-6", image_url="/images/products/kar-kar-murrukulu.png", is_primary=True),
            ProductImage(product_id="prod-7", image_url="/images/products/gujarat-mix-chivda.png", is_primary=True),
            ProductImage(product_id="prod-8", image_url="/images/brand/seven-flavors-lineup.png", is_primary=True),
            ProductImage(product_id="prod-9", image_url="/images/brand/wholesale-counter.png", is_primary=True),
        ]
        db.add_all(images)
        db.commit()

        print(f"Successfully seeded {len(products)} authentic products, {len(categories)} categories, {len(variants)} variants, and {len(images)} images!")
    finally:
        db.close()

if __name__ == "__main__":
    reseed()
