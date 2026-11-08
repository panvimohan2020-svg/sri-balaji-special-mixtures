import os
import secrets
from datetime import datetime, timezone, timedelta
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.core.database import Base, engine, SessionLocal
from app.api.v1.api import api_router
from app.core.security import get_password_hash
from app.models.user import User
from app.models.admin_security import OwnerSetupState, OwnerInvitation
from app.models.category import Category
from app.models.product import Product, ProductImage
from app.models.variant import ProductVariant
from app.models.settings import BusinessSetting
from app.models.order import Order, OrderItem, OrderStatusHistory, WholesaleEnquiry
from app.models.inventory import StockMovement, LowStockAlert
from app.models.customer import Customer, CustomerAddress, CustomerNotification
from app.models.payment import PaymentTransaction
from app.models.dealer import DealerProfile
from app.models.quotation import WholesaleQuotation, QuotationItem
from app.models.logistics import ShipmentRecord, ServiceablePincode


def init_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # 1. Superuser Bootstrap (Temporary dev baseline until owner activation)
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

        # 1b. Initial Business Owner Handover State
        owner_state = db.query(OwnerSetupState).first()
        if not owner_state:
            token = secrets.token_urlsafe(32)
            owner_state = OwnerSetupState(
                owner_email=settings.BUSINESS_OWNER_EMAIL,
                activation_token=token,
                is_activated=False,
                expires_at=datetime.now(timezone.utc) + timedelta(days=30)
            )
            db.add(owner_state)
            db.commit()

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
            import seed_data
            seed_data.reseed()

        # 4. Seed initial Serviceable Pincodes if empty
        if db.query(ServiceablePincode).count() == 0:
            try:
                from scripts.migrate_and_seed_coverage import COVERAGE_DATA
                for item in COVERAGE_DATA:
                    db.add(ServiceablePincode(**item))
                db.commit()
            except Exception as e:
                print(f"[WARN] Failed to auto-seed pincodes: {e}")

        # 4b. Ensure all 30 Odisha districts & expanded regional hubs are synchronized
        try:
            from scripts.expand_regional_coverage import expand_coverage
            expand_coverage()
        except Exception as e:
            print(f"[WARN] Coverage expansion check: {e}")
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
    allow_origins=settings.cors_origins,
    allow_origin_regex=r"^https?://([a-zA-Z0-9-]+\.)*(vercel\.app|netlify\.app|onrender\.com|railway\.app|sribalaji.*|localhost|127\.0\.0\.1)(:\d+)?$",
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

