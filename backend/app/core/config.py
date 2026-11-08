import os
from typing import List

_backend_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
_default_db = os.path.join(_backend_dir, "sribalaji.db").replace("\\", "/")

try:
    from pydantic_settings import BaseSettings

    class Settings(BaseSettings):
        PROJECT_NAME: str = "Sri Balaji Snacks API"
        API_V1_STR: str = "/api/v1"
        SECRET_KEY: str = os.getenv("SECRET_KEY", "sri-balaji-development-super-secret-key-38472983")
        ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24

        DATABASE_URL: str = os.getenv("DATABASE_URL", f"sqlite:///{_default_db}")
        FIRST_SUPERUSER_EMAIL: str = os.getenv("FIRST_SUPERUSER_EMAIL", "admin@sribalaji.com")
        FIRST_SUPERUSER_PASSWORD: str = os.getenv("FIRST_SUPERUSER_PASSWORD", "BalajiAdmin2026!")

        BUSINESS_OWNER_EMAIL: str = os.getenv("BUSINESS_OWNER_EMAIL", "owner@sribalaji.com")
        BUSINESS_OWNER_NAME: str = os.getenv("BUSINESS_OWNER_NAME", "Sri Adari Krishna Rao & Sri Adari Dilleshwar Rao")

        PUBLIC_FRONTEND_URL: str = os.getenv("PUBLIC_FRONTEND_URL", "http://localhost:5173")
        ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")

        UPLOAD_DIR: str = os.getenv("UPLOAD_DIR", os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "uploads"))
        BACKEND_CORS_ORIGINS: str = os.getenv("BACKEND_CORS_ORIGINS", "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173")

        DEFAULT_WHATSAPP_NUMBER: str = os.getenv("DEFAULT_WHATSAPP_NUMBER", "9861789602")
        DEFAULT_CONTACT_PHONE: str = os.getenv("DEFAULT_CONTACT_PHONE", "9437135342, 7735333542")
        DEFAULT_STORE_ADDRESS: str = os.getenv("DEFAULT_STORE_ADDRESS", "Gandhi School Road, Near Post Office")
        DEFAULT_STORE_CITY: str = os.getenv("DEFAULT_STORE_CITY", "Paralakhemundi")
        DEFAULT_STORE_STATE: str = os.getenv("DEFAULT_STORE_STATE", "Odisha")
        DEFAULT_STORE_PIN: str = os.getenv("DEFAULT_STORE_PIN", "761200")
        DEFAULT_OWNER_NAME: str = os.getenv("DEFAULT_OWNER_NAME", "Adari Krishna Rao (Father) & Adari Dilleshwar Rao (Son)")
        DEFAULT_TAGLINE: str = os.getenv("DEFAULT_TAGLINE", "Taste the Tradition.")
        DEFAULT_INSTAGRAM: str = os.getenv("DEFAULT_INSTAGRAM", "https://www.instagram.com/sri_balaji_special_mixtures?utm_source=ig_web_button_share_sheet&cplk=ZDNlZDc0MzIxNw==")

        # Payment Gateway Config (Razorpay)
        RAZORPAY_KEY_ID: str = os.getenv("RAZORPAY_KEY_ID", "rzp_test_sribalaji_demo")
        RAZORPAY_KEY_SECRET: str = os.getenv("RAZORPAY_KEY_SECRET", "sribalaji_rzp_secret_key_demo")
        RAZORPAY_WEBHOOK_SECRET: str = os.getenv("RAZORPAY_WEBHOOK_SECRET", "sribalaji_webhook_secret_demo")

        @property
        def cors_origins(self) -> List[str]:
            origins = [origin.strip() for origin in self.BACKEND_CORS_ORIGINS.split(",") if origin.strip()]
            if self.PUBLIC_FRONTEND_URL and self.PUBLIC_FRONTEND_URL.strip():
                front_url = self.PUBLIC_FRONTEND_URL.strip().rstrip('/')
                if front_url not in origins:
                    origins.append(front_url)
            return origins

        class Config:
            case_sensitive = True
            env_file = ".env"

    settings = Settings()

except Exception:
    class PlainSettings:
        PROJECT_NAME: str = "Sri Balaji Snacks API"
        API_V1_STR: str = "/api/v1"
        SECRET_KEY: str = os.getenv("SECRET_KEY", "sri-balaji-development-super-secret-key-38472983")
        ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24

        DATABASE_URL: str = os.getenv("DATABASE_URL", f"sqlite:///{_default_db}")
        FIRST_SUPERUSER_EMAIL: str = os.getenv("FIRST_SUPERUSER_EMAIL", "admin@sribalaji.com")
        FIRST_SUPERUSER_PASSWORD: str = os.getenv("FIRST_SUPERUSER_PASSWORD", "BalajiAdmin2026!")

        BUSINESS_OWNER_EMAIL: str = os.getenv("BUSINESS_OWNER_EMAIL", "owner@sribalaji.com")
        BUSINESS_OWNER_NAME: str = os.getenv("BUSINESS_OWNER_NAME", "Sri Adari Krishna Rao & Sri Adari Dilleshwar Rao")

        PUBLIC_FRONTEND_URL: str = os.getenv("PUBLIC_FRONTEND_URL", "http://localhost:5173")
        ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")

        UPLOAD_DIR: str = os.getenv("UPLOAD_DIR", os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "uploads"))
        BACKEND_CORS_ORIGINS: str = os.getenv("BACKEND_CORS_ORIGINS", "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173")

        DEFAULT_WHATSAPP_NUMBER: str = os.getenv("DEFAULT_WHATSAPP_NUMBER", "9861789602")
        DEFAULT_CONTACT_PHONE: str = os.getenv("DEFAULT_CONTACT_PHONE", "9437135342, 7735333542")
        DEFAULT_STORE_ADDRESS: str = os.getenv("DEFAULT_STORE_ADDRESS", "Gandhi School Road, Near Post Office")
        DEFAULT_STORE_CITY: str = os.getenv("DEFAULT_STORE_CITY", "Paralakhemundi")
        DEFAULT_STORE_STATE: str = os.getenv("DEFAULT_STORE_STATE", "Odisha")
        DEFAULT_STORE_PIN: str = os.getenv("DEFAULT_STORE_PIN", "761200")
        DEFAULT_OWNER_NAME: str = os.getenv("DEFAULT_OWNER_NAME", "Adari Krishna Rao (Father) & Adari Dilleshwar Rao (Son)")
        DEFAULT_TAGLINE: str = os.getenv("DEFAULT_TAGLINE", "Taste the Tradition.")
        DEFAULT_INSTAGRAM: str = os.getenv("DEFAULT_INSTAGRAM", "https://www.instagram.com/sri_balaji_special_mixtures?utm_source=ig_web_button_share_sheet&cplk=ZDNlZDc0MzIxNw==")

        # Payment Gateway Config (Razorpay)
        RAZORPAY_KEY_ID: str = os.getenv("RAZORPAY_KEY_ID", "rzp_test_sribalaji_demo")
        RAZORPAY_KEY_SECRET: str = os.getenv("RAZORPAY_KEY_SECRET", "sribalaji_rzp_secret_key_demo")
        RAZORPAY_WEBHOOK_SECRET: str = os.getenv("RAZORPAY_WEBHOOK_SECRET", "sribalaji_webhook_secret_demo")

        @property
        def cors_origins(self) -> List[str]:
            origins = [origin.strip() for origin in self.BACKEND_CORS_ORIGINS.split(",") if origin.strip()]
            if self.PUBLIC_FRONTEND_URL and self.PUBLIC_FRONTEND_URL.strip():
                front_url = self.PUBLIC_FRONTEND_URL.strip().rstrip('/')
                if front_url not in origins:
                    origins.append(front_url)
            return origins

    settings = PlainSettings()
