from fastapi import APIRouter
from app.api.v1.endpoints import (
    auth, 
    categories, 
    products, 
    orders, 
    enquiries, 
    settings, 
    inventory, 
    customers, 
    payments,
    dealers,
    quotations,
    logistics,
    loyalty,
    marketing,
    ai_concierge,
    analytics,
    feedback
)

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Admin Authentication"])
api_router.include_router(customers.router, prefix="/customers", tags=["Customer Accounts"])
api_router.include_router(dealers.router, prefix="/dealers", tags=["B2B Wholesale Dealers"])
api_router.include_router(quotations.router, prefix="/quotations", tags=["Wholesale Quotations"])
api_router.include_router(logistics.router, prefix="/logistics", tags=["Logistics & Shipping"])
api_router.include_router(loyalty.router, prefix="/loyalty", tags=["Customer Loyalty & Referrals"])
api_router.include_router(marketing.router, prefix="/marketing", tags=["Marketing & Campaigns"])
api_router.include_router(feedback.router, prefix="/feedback", tags=["Customer Feedback & Reviews"])
api_router.include_router(ai_concierge.router, prefix="/ai", tags=["AI Snack Concierge"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["Business Analytics"])
api_router.include_router(categories.router, prefix="/categories", tags=["Categories"])
api_router.include_router(products.router, prefix="/products", tags=["Products"])
api_router.include_router(orders.router, prefix="/orders", tags=["Order Management"])
api_router.include_router(payments.router, prefix="/payments", tags=["Payment Processing"])
api_router.include_router(inventory.router, prefix="/inventory", tags=["Smart Inventory"])
api_router.include_router(enquiries.router, prefix="/enquiries", tags=["Wholesale Enquiries"])
api_router.include_router(settings.router, prefix="/settings", tags=["Business Settings"])
