import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.core.database import Base, engine, SessionLocal
from app.api.v1.api import api_router
from app.core.security import get_password_hash
from app.models.user import User
from app.models.category import Category
from app.models.product import Product, ProductImage
from app.models.variant import ProductVariant
from app.models.settings import BusinessSetting


def init_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # 1. Superuser
        admin = db.query(User).filter(User.email == settings.FIRST_SUPERUSER_EMAIL).first()
        if not admin:
            admin = User(
                email=settings.FIRST_SUPERUSER_EMAIL,
                full_name="Sri Balaji Administrator",
                hashed_password=get_password_hash(settings.FIRST_SUPERUSER_PASSWORD),
                role="SUPERADMIN",
                is_active=True
            )
            db.add(admin)

        # 2. Business Settings
        default_settings = {
            "business_name": "Sri Balaji",
            "owner_name": "Adari Krishna Rao (Father) & Adari Dilleshwar Rao (Son)",
            "father_name": "Adari Krishna Rao",
            "son_name": "Adari Dilleshwar Rao",
            "category": "Wholesale Snacks / Food Products",
            "contact_number": "9437135342, 7735333542",
            "whatsapp_number": "9861789602",
            "address": "Gandhi School Road, Near Post Office",
            "city": "Paralakhemundi",
            "state": "Odisha",
            "pin_code": "761200",
            "years_in_business": "30 years",
            "business_description": "Sri Balaji offers a variety of fresh, tasty, and crispy snacks, including mixtures, chips, and more. We focus on good quality, hygiene, great taste, and customer satisfaction.",
            "tagline": "Taste the Tradition.",
            "instagram_url": "https://www.instagram.com/sri_balaji_special_mixtures?utm_source=ig_web_button_share_sheet&cplk=ZDNlZDc0MzIxNw==",
            "google_maps_url": "https://www.google.com/maps/search/?api=1&query=Gandhi+School+Road+Near+Post+Office+Paralakhemundi+Gajapati+Odisha+761200",
            "wholesale_locations": "Paralakhemundi, Gajapati, Odisha and neighbouring regional distributor hubs.",
            "payment_methods": "UPI, Bank Transfer (NEFT/RTGS), Cash on Dispatch."
        }
        for k, v in default_settings.items():
            record = db.query(BusinessSetting).filter(BusinessSetting.key == k).first()
            if not record:
                db.add(BusinessSetting(key=k, value=v))
            else:
                record.value = v

        # 3. Seed initial Categories & Products if empty
        if db.query(Category).count() == 0:
            cat_mixtures = Category(
                id="cat-1",
                name="Mixtures",
                slug="mixtures",
                description="Signature crunchy savouries made with fried sev, boondi, roasted peanuts, and cashews.",
                image_url="https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80",
                display_order=1
            )
            cat_chips = Category(
                id="cat-2",
                name="Chips & Wafers",
                slug="chips",
                description="Thinly sliced, golden-crisp potato and raw banana chips.",
                image_url="https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=600&q=80",
                display_order=2
            )
            cat_traditional = Category(
                id="cat-3",
                name="Traditional Snacks",
                slug="traditional-snacks",
                description="Time-honoured South Indian savouries including Murukku and Ribbon Pakoda.",
                image_url="https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80",
                display_order=3
            )
            db.add_all([cat_mixtures, cat_chips, cat_traditional])
            db.flush()

            # Seed Products
            p1 = Product(
                id="prod-1",
                category_id="cat-1",
                name="Special Madras Royal Mixture",
                slug="special-madras-royal-mixture",
                description="Our signature blend of crispy besan sev, spicy kara boondi, roasted peanuts, split cashews, and curry leaves.",
                food_classification="VEGETARIAN",
                spice_level="MEDIUM",
                taste_profiles="Crunchy,Spicy,Traditional",
                ingredients="Gram flour, Rice flour, Refined vegetable oil, Groundnuts, Cashews, Curry leaves, Chilli powder, Salt, Asafoetida.",
                allergen_info="Contains Tree Nuts (Cashews) and Peanuts.",
                minimum_order_qty=2,
                is_featured=True
            )
            p2 = Product(
                id="prod-2",
                category_id="cat-2",
                name="Classic Salted Golden Potato Chips",
                slug="classic-salted-golden-potato-chips",
                description="Thinly sliced farm potatoes kettle fried to golden crispness, lightly seasoned with rock salt.",
                food_classification="VEGETARIAN",
                spice_level="MILD",
                taste_profiles="Crunchy,Salty",
                ingredients="Potatoes, Edible vegetable oil, Rock salt.",
                minimum_order_qty=5,
                is_featured=True
            )
            db.add_all([p1, p2])
            db.flush()

            # Variants
            db.add(ProductVariant(product_id="prod-1", weight_label="250g", weight_in_grams=250, retail_price=95, wholesale_price=75))
            db.add(ProductVariant(product_id="prod-1", weight_label="1kg", weight_in_grams=1000, retail_price=360, wholesale_price=280))
            db.add(ProductVariant(product_id="prod-2", weight_label="250g", weight_in_grams=250, retail_price=110, wholesale_price=80))

            # Images
            db.add(ProductImage(product_id="prod-1", image_url="https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80", is_primary=True))
            db.add(ProductImage(product_id="prod-2", image_url="https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=800&q=80", is_primary=True))

        db.commit()
    finally:
        db.close()


@asynccontextmanager
async def lifespan(app: FastAPI):
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    init_db()
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permits local development, PWA, and production domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static Uploads directory
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Include API Router
app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/", tags=["Root"])
def root():
    return {
        "brand": "Sri Balaji – Premium Wholesale Snacks",
        "status": "online",
        "api_documentation": f"{settings.API_V1_STR}/docs",
        "health": "/api/health",
        "frontend": "http://localhost:5173",
        "message": "Welcome to Sri Balaji API. Visit /api/v1/docs to explore endpoints."
    }


@app.get("/api/health", tags=["Health"])
def healthcheck():
    return {
        "status": "healthy",
        "brand": "Sri Balaji Premium Wholesale Snacks",
        "version": "1.0.0"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)

