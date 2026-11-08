import io
import csv
from datetime import datetime, timezone, timedelta
from typing import Optional, Dict, Any, List
from fastapi import APIRouter, Depends, Query, Response
from sqlalchemy.orm import Session
from sqlalchemy import func, desc

from app.core.database import get_db
from app.core.rbac import (
    require_roles,
    ROLE_SUPERADMIN,
    ROLE_ORDER_MANAGER,
    ROLE_PRODUCT_MANAGER,
    ROLE_INVENTORY_MANAGER
)
from app.models.user import User
from app.models.order import Order, OrderItem
from app.models.dealer import DealerProfile
from app.models.customer import Customer
from app.models.product import Product
from app.models.variant import ProductVariant
from app.models.marketing_event import MarketingEvent
from app.schemas.marketing_event import EventLogRequest

router = APIRouter()


@router.get("/dashboard-summary")
def get_analytics_summary(
    period: str = Query("all", regex="^(all|30days|7days|today)$"),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([ROLE_SUPERADMIN, ROLE_ORDER_MANAGER, ROLE_PRODUCT_MANAGER, ROLE_INVENTORY_MANAGER]))
):
    """
    Admin: Comprehensive business analytics and intelligence.
    Calculates confirmed sales, AOV, retail vs wholesale split, top selling snacks,
    and repeat customer rates strictly adhering to verified accounting rules.
    """
    now_utc = datetime.now(timezone.utc)
    start_date = None
    if period == "today":
        start_date = now_utc.replace(hour=0, minute=0, second=0, microsecond=0)
    elif period == "7days":
        start_date = now_utc - timedelta(days=7)
    elif period == "30days":
        start_date = now_utc - timedelta(days=30)

    # Base query for orders
    order_query = db.query(Order)
    if start_date:
        order_query = order_query.filter(Order.created_at >= start_date)

    all_orders = order_query.all()

    # Distinguish statuses strictly
    enquiry_orders = [o for o in all_orders if o.status in ["NEW ENQUIRY", "CONTACTED"]]
    confirmed_orders = [o for o in all_orders if o.status in ["CONFIRMED", "PREPARING", "READY FOR PICKUP / DISPATCHED", "DELIVERED"]]
    delivered_orders = [o for o in all_orders if o.status == "DELIVERED"]
    cancelled_orders = [o for o in all_orders if o.status in ["CANCELLED", "REJECTED"]]
    paid_orders = [o for o in all_orders if o.payment_status == "PAID"]

    # Confirmed Revenue Calculation (STRICT: only confirmed or delivered orders)
    confirmed_revenue = sum(float(o.total_estimated_amount or 0.0) for o in confirmed_orders)
    paid_revenue = sum(float(o.total_estimated_amount or 0.0) for o in paid_orders)

    # Retail vs Wholesale Split
    retail_confirmed = [o for o in confirmed_orders if o.order_type == "RETAIL"]
    wholesale_confirmed = [o for o in confirmed_orders if o.order_type == "WHOLESALE"]

    retail_revenue = sum(float(o.total_estimated_amount or 0.0) for o in retail_confirmed)
    wholesale_revenue = sum(float(o.total_estimated_amount or 0.0) for o in wholesale_confirmed)

    # Average Order Value (AOV) on confirmed orders
    aov = (confirmed_revenue / len(confirmed_orders)) if len(confirmed_orders) > 0 else 0.0

    # Total weight dispatched/confirmed
    total_weight_kg = sum(float(o.total_estimated_weight_kg or 0.0) for o in confirmed_orders)

    # Top selling snack varieties from confirmed orders
    confirmed_ids = [o.id for o in confirmed_orders]
    top_products_data = []
    if confirmed_ids:
        items = db.query(
            OrderItem.product_name,
            func.sum(OrderItem.quantity).label("total_qty"),
            func.sum(OrderItem.subtotal).label("total_subtotal")
        ).filter(OrderItem.order_id.in_(confirmed_ids)).group_by(OrderItem.product_name).order_by(desc("total_qty")).limit(5).all()

        for item in items:
            top_products_data.append({
                "product_name": item[0],
                "total_quantity": int(item[1] or 0),
                "total_revenue": float(item[2] or 0.0)
            })

    # Repeat customer rate
    total_customers = db.query(Customer).count()
    repeat_customers = 0
    if total_customers > 0:
        customer_order_counts = db.query(
            Order.customer_id,
            func.count(Order.id)
        ).filter(Order.customer_id != None, Order.status.in_(["CONFIRMED", "DELIVERED"])).group_by(Order.customer_id).all()
        repeat_customers = sum(1 for c, count in customer_order_counts if count > 1)
    repeat_customer_rate = round((repeat_customers / max(1, total_customers)) * 100, 1)

    # Dealer activity
    total_dealers = db.query(DealerProfile).count()
    approved_dealers = db.query(DealerProfile).filter(DealerProfile.status == "APPROVED").count()

    # Timeline points for charts (last 7 or 14 intervals)
    trend_data = []
    days_to_plot = 7 if period in ["today", "7days"] else 14
    for i in range(days_to_plot - 1, -1, -1):
        day_date = (now_utc - timedelta(days=i)).date()
        day_start = datetime(day_date.year, day_date.month, day_date.day, 0, 0, 0, tzinfo=timezone.utc)
        day_end = day_start + timedelta(days=1)
        day_orders = [o for o in confirmed_orders if day_start <= (o.created_at.replace(tzinfo=timezone.utc) if o.created_at.tzinfo is None else o.created_at) < day_end]
        day_rev = sum(float(o.total_estimated_amount or 0.0) for o in day_orders)
        trend_data.append({
            "date": day_date.strftime("%d %b"),
            "revenue": day_rev,
            "orders_count": len(day_orders)
        })

    return {
        "period": period,
        "confirmed_revenue": round(confirmed_revenue, 2),
        "paid_revenue": round(paid_revenue, 2),
        "retail_revenue": round(retail_revenue, 2),
        "wholesale_revenue": round(wholesale_revenue, 2),
        "total_orders_count": len(all_orders),
        "confirmed_orders_count": len(confirmed_orders),
        "enquiry_orders_count": len(enquiry_orders),
        "delivered_orders_count": len(delivered_orders),
        "cancelled_orders_count": len(cancelled_orders),
        "paid_orders_count": len(paid_orders),
        "average_order_value": round(aov, 2),
        "total_weight_kg": round(total_weight_kg, 2),
        "repeat_customer_rate": repeat_customer_rate,
        "total_dealers": total_dealers,
        "approved_dealers": approved_dealers,
        "top_selling_products": top_products_data,
        "trend_data": trend_data
    }


@router.post("/event", status_code=201)
def log_marketing_event(
    payload: EventLogRequest,
    db: Session = Depends(get_db)
):
    """
    Privacy-conscious event tracking for conversion funnel and UTM attribution.
    Logs page views, product views, cart additions, checkouts, and enquiries without capturing PII.
    """
    clean_source = (payload.utm_source or "direct").lower()
    event = MarketingEvent(
        event_type=payload.event_type.upper(),
        utm_source=clean_source,
        utm_medium=payload.utm_medium,
        utm_campaign=payload.utm_campaign,
        utm_content=payload.utm_content,
        page_url=payload.page_url,
        product_id=payload.product_id,
        order_id=payload.order_id,
        anonymous_session_id=payload.session_id
    )
    db.add(event)
    db.commit()
    return {"success": True, "event_id": event.id}


@router.get("/marketing-funnel")
def get_marketing_funnel(
    period: str = Query("all", regex="^(all|30days|7days|today)$"),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([ROLE_SUPERADMIN, ROLE_ORDER_MANAGER, ROLE_PRODUCT_MANAGER]))
):
    """
    Admin: Privacy-conscious marketing funnel and UTM campaign attribution analysis.
    Measures genuine conversion from Visitor -> Product View -> Add to Bag -> Checkout -> Enquiries/Orders.
    """
    now_utc = datetime.now(timezone.utc)
    start_date = None
    if period == "today":
        start_date = now_utc.replace(hour=0, minute=0, second=0, microsecond=0)
    elif period == "7days":
        start_date = now_utc - timedelta(days=7)
    elif period == "30days":
        start_date = now_utc - timedelta(days=30)

    # Base event query
    query = db.query(MarketingEvent)
    order_q = db.query(Order)
    if start_date:
        query = query.filter(MarketingEvent.created_at >= start_date)
        order_q = order_q.filter(Order.created_at >= start_date)

    events = query.all()
    orders = order_q.all()

    # Step counts
    visitors_count = len(set(e.anonymous_session_id for e in events if e.anonymous_session_id)) or len(events)
    page_views = sum(1 for e in events if e.event_type == "PAGE_VIEW")
    product_views = sum(1 for e in events if e.event_type == "PRODUCT_VIEW")
    add_to_cart = sum(1 for e in events if e.event_type == "ADD_TO_CART")
    checkout_starts = sum(1 for e in events if e.event_type == "CHECKOUT_START")
    whatsapp_enquiries = sum(1 for e in events if e.event_type == "WHATSAPP_ENQUIRY") or len([o for o in orders if o.status in ["NEW ENQUIRY", "CONTACTED"]])
    orders_completed = sum(1 for e in events if e.event_type == "ORDER_COMPLETED") or len([o for o in orders if o.status in ["CONFIRMED", "DELIVERED"]])

    # Build Funnel with percentage dropoffs
    funnel_steps = [
        {"step": "Website Visitors", "count": max(visitors_count, 1), "pct": 100.0},
        {"step": "Product Explorations", "count": product_views, "pct": round((product_views / max(1, visitors_count)) * 100, 1)},
        {"step": "Added to Bag", "count": add_to_cart, "pct": round((add_to_cart / max(1, product_views or 1)) * 100, 1)},
        {"step": "Checkout Started", "count": checkout_starts, "pct": round((checkout_starts / max(1, add_to_cart or 1)) * 100, 1)},
        {"step": "WhatsApp Enquiries / Orders", "count": (whatsapp_enquiries + orders_completed), "pct": round(((whatsapp_enquiries + orders_completed) / max(1, checkout_starts or 1)) * 100, 1)}
    ]

    # Attribution Breakdown (Instagram vs Google vs QR Pouch vs Direct vs WhatsApp)
    sources = set(e.utm_source for e in events if e.utm_source)
    if not sources:
        sources = {"direct", "instagram", "qr_pouch"}

    attributions = []
    for s in sorted(sources):
        src_events = [e for e in events if e.utm_source == s]
        src_sessions = len(set(e.anonymous_session_id for e in src_events if e.anonymous_session_id)) or len(src_events)
        src_enquiries = sum(1 for e in src_events if e.event_type in ["WHATSAPP_ENQUIRY", "ORDER_COMPLETED"])
        
        attributions.append({
            "source": s.title(),
            "visitors": src_sessions,
            "events_count": len(src_events),
            "enquiries_count": src_enquiries,
            "conversion_rate": round((src_enquiries / max(1, src_sessions)) * 100, 1)
        })

    return {
        "period": period,
        "total_tracked_events": len(events),
        "funnel": funnel_steps,
        "attributions": attributions
    }


# --- CSV Export Endpoints ---
@router.get("/export/orders.csv")
def export_orders_csv(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([ROLE_SUPERADMIN, ROLE_ORDER_MANAGER]))
):
    """Export verified order records as downloadable CSV."""
    orders = db.query(Order).order_by(desc(Order.created_at)).all()
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow([
        "Order Number",
        "Date",
        "Order Type",
        "Customer Name",
        "Customer Phone",
        "Status",
        "Payment Status",
        "Estimated Total (INR)",
        "Delivery City",
        "Pin Code"
    ])

    for o in orders:
        writer.writerow([
            o.order_number,
            o.created_at.strftime("%Y-%m-%d %H:%M:%S") if o.created_at else "",
            o.order_type,
            o.customer_name or "N/A",
            o.phone_number or o.whatsapp_number or "N/A",
            o.status,
            o.payment_status,
            f"{float(o.total_estimated_amount or 0.0):.2f}",
            o.city or "",
            o.pin_code or ""
        ])

    csv_data = output.getvalue()
    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=sri_balaji_orders.csv"}
    )


@router.get("/export/inventory.csv")
def export_inventory_csv(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([ROLE_SUPERADMIN, ROLE_INVENTORY_MANAGER]))
):
    """Export product inventory status as downloadable CSV."""
    variants = db.query(ProductVariant).join(Product).all()
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow([
        "Product Name",
        "Weight Variant",
        "Retail Price (INR)",
        "Wholesale Price (INR)",
        "Current Stock Quantity",
        "Min Stock Threshold",
        "Track Inventory",
        "Stock Status"
    ])

    for v in variants:
        is_low = v.track_inventory and (v.stock_quantity <= v.min_stock_threshold)
        status_label = "LOW STOCK" if is_low else ("IN STOCK" if v.is_in_stock else "OUT OF STOCK")
        writer.writerow([
            v.product.name if v.product else "Unknown",
            v.weight_label,
            f"{float(v.retail_price or 0.0):.2f}",
            f"{float(v.wholesale_price or 0.0):.2f}" if v.wholesale_price else "N/A",
            v.stock_quantity,
            v.min_stock_threshold,
            "YES" if v.track_inventory else "NO",
            status_label
        ])

    csv_data = output.getvalue()
    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=sri_balaji_inventory.csv"}
    )


@router.get("/export/customers.csv")
def export_customers_csv(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([ROLE_SUPERADMIN, ROLE_ORDER_MANAGER]))
):
    """Export customer directory as downloadable CSV."""
    customers = db.query(Customer).order_by(desc(Customer.created_at)).all()
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow([
        "Customer ID",
        "Full Name",
        "Phone Number",
        "Email",
        "Registered Date",
        "Is Active"
    ])

    for c in customers:
        writer.writerow([
            c.id,
            c.full_name or "",
            c.phone_number,
            c.email or "",
            c.created_at.strftime("%Y-%m-%d %H:%M:%S") if c.created_at else "",
            "Active" if c.is_active else "Inactive"
        ])

    csv_data = output.getvalue()
    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=sri_balaji_customers.csv"}
    )


@router.get("/export/dealers.csv")
def export_dealers_csv(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([ROLE_SUPERADMIN, ROLE_ORDER_MANAGER]))
):
    """Export wholesale dealer directory as downloadable CSV."""
    dealers = db.query(DealerProfile).order_by(desc(DealerProfile.created_at)).all()
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow([
        "Business Name",
        "Contact Person",
        "Phone",
        "City",
        "State",
        "GSTIN",
        "Status",
        "Pricing Tier",
        "Created Date"
    ])

    for d in dealers:
        writer.writerow([
            d.business_name,
            d.owner_name or "N/A",
            d.phone_number,
            d.city,
            d.state,
            d.gstin or "",
            d.status,
            d.pricing_tier or "STANDARD",
            d.created_at.strftime("%Y-%m-%d %H:%M:%S") if d.created_at else ""
        ])

    csv_data = output.getvalue()
    return Response(
        content=csv_data,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=sri_balaji_dealers.csv"}
    )


