import os
from typing import List

try:
    from pydantic_settings import BaseSettings

    class Settings(BaseSettings):
        PROJECT_NAME: str = "Sri Balaji Snacks API"
        API_V1_STR: str = "/api/v1"
        SECRET_KEY: str = os.getenv("SECRET_KEY", "sri-balaji-development-super-secret-key-38472983")
        ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24

        DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./sribalaji.db")
        FIRST_SUPERUSER_EMAIL: str = os.getenv("FIRST_SUPERUSER_EMAIL", "admin@sribalaji.com")
        FIRST_SUPERUSER_PASSWORD: str = os.getenv("FIRST_SUPERUSER_PASSWORD", "BalajiAdmin2026!")

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

        @property
        def cors_origins(self) -> List[str]:
            return [origin.strip() for origin in self.BACKEND_CORS_ORIGINS.split(",") if origin.strip()]

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

        DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./sribalaji.db")
        FIRST_SUPERUSER_EMAIL: str = os.getenv("FIRST_SUPERUSER_EMAIL", "admin@sribalaji.com")
        FIRST_SUPERUSER_PASSWORD: str = os.getenv("FIRST_SUPERUSER_PASSWORD", "BalajiAdmin2026!")

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

        @property
        def cors_origins(self) -> List[str]:
            return [origin.strip() for origin in self.BACKEND_CORS_ORIGINS.split(",") if origin.strip()]

    settings = PlainSettings()
