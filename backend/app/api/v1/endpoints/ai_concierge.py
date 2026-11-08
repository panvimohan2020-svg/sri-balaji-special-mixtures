import re
import urllib.parse
from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.core.database import get_db
from app.models.product import Product
from app.models.order import Order
from app.models.logistics import ServiceablePincode, ShipmentRecord
from app.schemas.ai import AIChatRequest, AIChatResponse, ProductRecommendationItem

router = APIRouter()

# Authentic Brand Knowledge Base
SRI_BALAJI_KNOWLEDGE = {
    "brand": "Sri Balaji Special Mixtures",
    "name": "Balaji Mitra",
    "subtitle": "Sri Balaji Crisp & Flavour Assistant",
    "location": "Gandhi School Road, Near Post Office, Paralakhemundi, Gajapati, Odisha – 761200",
    "founder": "Sri Adari Krishna Rao (30+ Years Heritage since 1995)",
    "phone": "+91 94371 35342 / +91 77353 33542",
    "whatsapp": "+91 98617 89602",
    "shelf_life": "45 to 60 days in airtight packaging",
    "oil_quality": "High quality refined peanut and vegetable oils, batch tested for fresh crispness and aroma",
    "vegetarian": "100% Pure Vegetarian with zero animal derivatives and no chemical preservatives"
}


@router.get("/status")
def get_ai_status():
    """
    Public Endpoint: Check Balaji Mitra AI assistant service status.
    Returns online indicator only when service is running.
    """
    return {
        "status": "online",
        "name": "Balaji Mitra",
        "subtitle": "Sri Balaji Crisp & Flavour Assistant",
        "brand": "Sri Balaji Special Mixtures",
        "version": "2.0",
        "operational": True,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }


def build_recommendation_item(prod: Product) -> ProductRecommendationItem:
    variant = prod.variants[0] if prod.variants else None
    price = float(variant.retail_price) if variant and variant.retail_price else 60.0
    weight = variant.weight_label if variant else "250g"
    img = prod.images[0].image_url if prod.images else None
    name_lower = (prod.name or "").lower()

    if prod.spice_level:
        spice = f"{prod.spice_level.capitalize()} 🌶️" if "SPICY" in prod.spice_level.upper() else f"{prod.spice_level.capitalize()} ✨"
    else:
        if any(k in name_lower for k in ["spicy", "hot", "chilli"]):
            spice = "Spicy 🔥🔥🔥"
        elif any(k in name_lower for k in ["onion", "mixture", "pakoda", "boondi"]):
            spice = "Medium Spicy 🌶️"
        elif any(k in name_lower for k in ["sweet", "sugar"]):
            spice = "Mild / Sweet 🍯"
        else:
            spice = "Mild / Savoury ✨"

    pairing = "Perfect with hot ginger milk tea or south Indian filter coffee."
    if "kastha" in name_lower or "gatiya" in name_lower:
        pairing = "Diwali Special festive crunch! Melt-in-the-mouth besan ribbons seasoned with aromatic ajwain."
    elif "chuda" in name_lower:
        pairing = "Crispy beaten rice snack, great for light evening snacking or rainy days."
    elif "chips" in name_lower:
        pairing = "Golden salted potato wafers, loved by kids and families."

    return ProductRecommendationItem(
        id=prod.id,
        name=prod.name,
        category=prod.category.name if prod.category else "Savouries",
        price=price,
        weight_label=weight,
        description=prod.description or "Authentic handmade savoury from Sri Balaji, Paralakhemundi.",
        image_url=img,
        spice_level=spice,
        pairing_notes=pairing
    )


@router.post("/chat", response_model=AIChatResponse)
def concierge_chat(
    data: AIChatRequest,
    db: Session = Depends(get_db)
):
    """
    Intelligent Sri Balaji Shopping Assistant (Balaji Mitra).
    Answers customer questions on:
    - Products, Kastha Gatiya & Diwali Special 2026
    - Tea pairings, spice levels & ingredients
    - Delivery PIN code checking & road transport routes
    - Real-time order tracking
    - B2B wholesale terms & Kirana store bulk cartons
    Supports English, Odia, Telugu, and Hindi with authentic brand tone.
    """
    msg = data.message.strip().lower()
    lang = (data.language or "en").lower()

    # Load all live products from DB
    products = db.query(Product).filter(Product.is_available == True).all()

    recommendations: List[ProductRecommendationItem] = []
    quick_suggestions: List[str] = [
        "Tell me about the new launch Kastha Gatiya",
        "Which snack is suitable with evening tea?",
        "Which products are spicy?",
        "Bulk cartons for Kirana stores"
    ]
    contact_action = None

    # ----------------------------------------------------
    # INTENT 1: REAL-TIME ORDER TRACKING
    # ----------------------------------------------------
    order_match = re.search(r"\b(sb-[a-z0-9\-]+)\b", msg)
    if order_match or any(k in msg for k in ["track", "order status", "where is my order", "consignment", "awb", "sb-"]):
        if order_match:
            order_num = order_match.group(1).upper()
            order = db.query(Order).filter(Order.order_number.ilike(f"%{order_num}%")).first()
            if order:
                shipment = db.query(ShipmentRecord).filter(ShipmentRecord.order_id == order.id).first()
                if shipment:
                    reply = (
                        f"📦 **Order #{order.order_number} Status:**\n\n"
                        f"• **Status:** {order.status}\n"
                        f"• **Courier / Partner:** {shipment.courier_partner}\n"
                        f"• **Tracking / LR No:** `{shipment.tracking_number}`\n"
                        f"• **Dispatched:** {shipment.dispatch_date.strftime('%d %b %Y') if shipment.dispatch_date else 'Recently'}\n"
                        f"• **Destination:** {shipment.destination_pincode or order.pin_code}\n\n"
                        f"Track full details on our live tracking page: `/track/{order.order_number}`"
                    )
                else:
                    reply = (
                        f"📦 **Order #{order.order_number}:**\n\n"
                        f"• **Status:** {order.status}\n"
                        f"• **Customer:** {order.customer_name}\n"
                        f"• **Total Amount:** ₹{order.total_estimated_amount or 0}\n"
                        f"• **Placed On:** {order.created_at.strftime('%d %b %Y') if order.created_at else 'Today'}\n\n"
                        f"Your fresh batch is currently being prepared and packaged at our Paralakhemundi facility. You will receive LR tracking as soon as it is handed to road transport!"
                    )
            else:
                reply = f"Could not locate order **{order_num}**. Please verify your order ID from your confirmation SMS/WhatsApp or email, or track directly at `/track`."
        else:
            reply = (
                "To track your parcel or wholesale consignment, please enter your **Order Number** (e.g. `SB-2026-XXXX` or `SB-986589`). "
                "You can also check real-time dispatch updates on our [Order Tracking Page](/track)."
            )
            quick_suggestions = [
                "Track my order",
                "Contact Wholesale Desk",
                "Kastha Gatiya price",
                "Evening tea snacks"
            ]

    # ----------------------------------------------------
    # INTENT 2: PIN CODE DELIVERY SERVICEABILITY LOOKUP
    # ----------------------------------------------------
    elif any(k in msg for k in ["deliver", "pincode", "pin code", "serviceable", "delivery to", "area"]) or re.search(r"(?<!sb-)\b([1-9][0-9]{5})\b", msg):
        pin_match = re.search(r"(?<!sb-)\b([1-9][0-9]{5})\b", msg)
        clean_pin = pin_match.group(1) if pin_match else None
        
        if clean_pin:
            record = db.query(ServiceablePincode).filter(ServiceablePincode.pincode == clean_pin).first()
            if record:
                st = (record.serviceability_status or "REGULAR").upper()
                if st == "CUSTOM_TRANSIT":
                    contact_action = f"https://wa.me/919861789602?text={urllib.parse.quote(f'Namaste Sri Balaji Team, I am requesting custom transit for PIN {clean_pin} ({record.city}, {record.district}).')}"
                    reply = (
                        f"🚚 **PIN {clean_pin} – {record.city} ({record.district}, {record.state}):**\n\n"
                        f"⚠️ **Custom Transit Arrangement Required:** Scheduled direct daily roadlines are not automated for this rural sector, but we routinely ship custom cartons via Indian Post and private transport agencies.\n\n"
                        f"Please contact our Wholesale Desk at **+91 98617 89602** to confirm the fastest transit arrangement!"
                    )
                elif st == "REGULAR":
                    reply = (
                        f"🚚 **PIN {clean_pin} – {record.city} ({record.district}, {record.state}):**\n\n"
                        f"✅ **Regular Delivery Available!** Dispatched directly via {record.zone_name or 'regional transport routes'}.\n"
                        f"⏱️ **Estimated Transit:** {record.transit_duration_label or f'{record.min_delivery_days}-{record.max_delivery_days} Days'}\n"
                        f"📦 **Freight Charge:** {record.delivery_charges_text or f'₹{record.standard_shipping_rate} flat / carton'}\n"
                        f"🚐 **Daily Dispatch:** {'Yes (Daily scheduled trips)' if record.daily_transit_available else 'Weekly scheduled trips'}\n"
                        f"💳 **Payment:** {'COD & Prepaid Available' if record.cod_available else 'Prepaid'}"
                    )
                elif st == "PENDING_VERIFICATION":
                    contact_action = f"https://wa.me/919861789602?text={urllib.parse.quote(f'Namaste, I want to check delivery feasibility for PIN {clean_pin}.')}"
                    reply = (
                        f"ℹ️ **PIN {clean_pin} – {record.city} ({record.district}):**\n\n"
                        f"This PIN is geographically recognized in our regional corridor, but specific scheduled tempo routes are currently undergoing business verification. "
                        f"Our team can arrange custom transport for bulk cartons (>25kg). WhatsApp our desk at **+91 98617 89602**."
                    )
                else:
                    reply = f"❌ **PIN {clean_pin}** is currently outside our direct scheduled transport routes. Custom bulk transit can be arranged via private transport agencies by contacting our wholesale desk at **+91 98617 89602**."
            else:
                # Unregistered PIN
                is_regional = clean_pin.startswith(("75", "76", "50", "51", "52", "53"))
                contact_action = f"https://wa.me/919861789602?text={urllib.parse.quote(f'Namaste, checking delivery to PIN {clean_pin}')}"
                if is_regional:
                    reply = (
                        f"📍 **PIN {clean_pin}** is in our regional South Odisha / Andhra corridor. "
                        f"While scheduled daily road dispatch is not yet automated for this specific PIN, we routinely fulfill orders through local bus cargo or private carriers. "
                        f"Please tap below to confirm with our Wholesale Desk at **+91 98617 89602**."
                    )
                else:
                    reply = (
                        f"📍 **PIN {clean_pin}** is outside our regional roadline network. "
                        f"We can dispatch bulk consignments across India via Indian Post Speed Post or VRL / safe transport. "
                        f"Connect with our wholesale desk at **+91 98617 89602**."
                    )
        else:
            reply = (
                "We provide scheduled regional road transport across **all 30 Odisha districts** (Gajapati, Ganjam, Rayagada, Koraput, Kandhamal, Coastal Odisha) and **neighbouring Andhra Pradesh** (Pathapatnam, Kasinagar border, Palasa, Tekkali, Srikakulam).\n\n"
                "Please enter your **6-digit PIN code** (e.g. `761200`, `765022`, `532201`) to check the exact route, transit duration, and freight rate!"
            )
            quick_suggestions = [
                "Check Paralakhemundi 761200",
                "Check Gunupur 765022",
                "Check Pathapatnam 532201",
                "Check Palasa 532221"
            ]

    # ----------------------------------------------------
    # INTENT 3: KASTHA GATIYA / NEW FESTIVE LAUNCH 2026
    # ----------------------------------------------------
    elif any(k in msg for k in ["kastha", "gatiya", "new launch", "launch", "diwali", "festive delight"]):
        recs = [p for p in products if any(k in p.name.lower() for k in ["gatiya", "kastha"])]
        if not recs:
            recs = [p for p in products if "mixture" in p.name.lower()][:2]
        recommendations = [build_recommendation_item(p) for p in recs]

        if lang == "or":
            reply = (
                "🌟 **ଶ୍ରୀ ବାଲାଜୀ ନୂତନ ଲଞ୍ଚ – କାସ୍ତା ଗଟିଆ (Kastha Gatiya - Diwali Special 2026)!**\n\n"
                "• **ସ୍ୱାଦ:** ମୁହଁରେ ମିଳାଇଯାଉଥିବା କୁରକୁରିଆ ପାରମ୍ପରିକ ଗଟିଆ, ଖାଣ୍ଟି ବେସନ, ଜୁଆଣି (Ajwain) ଓ ସୁଗନ୍ଧିତ ମସଲାରେ ପ୍ରସ୍ତୁତ।\n"
                "• **ରିଟେଲ ମୂଲ୍ୟ:** ୨୫୦ଗ୍ରାମ୍ - ₹୬୦ | ୫୦୦ଗ୍ରାମ୍ - ₹୧୨୦ | ୧ କିଗ୍ରା - ₹୨୪୦\n"
                "• **ହୋଲସେଲ ମୂଲ୍ୟ:** ୫ କିଗ୍ରା କାର୍ଟନ୍ ସ୍ୱତନ୍ତ୍ର ହୋଲସେଲ ଦରରେ ଉପଲବ୍ଧ (₹୪୮/୨୫୦ଗ୍ରାମ୍)।\n"
                "• ୧୦୦% ଶୁଦ୍ଧ ଶାକାହାରୀ, କୌଣସି ପ୍ରିଜରଭେଟିଭ୍ ବିନା ସତେଜ ପ୍ରସ୍ତୁତ!"
            )
        elif lang == "te":
            reply = (
                "🌟 **శ్రీ బాలాజీ సరికొత్త సమర్పణ – కాస్తా గటియా (Kastha Gatiya - Diwali Special 2026)!**\n\n"
                "• **రుచి:** నోట్లో వేస్తే కరిగిపోయే కరకరలాడే కాస్తా గటియా! స్వచ్ఛమైన శనగపిండి, వాము (Ajwain), మరియు సంప్రదాయ సుగంధ ద్రవ్యాలతో తయారుచేయబడింది.\n"
                "• **రిటైల్ ధరలు:** 250 గ్రా – ₹60 | 500 గ్రా – ₹120 | 1 కేజీ – ₹240\n"
                "• **హోల్సేల్ ధరలు:** 5 కేజీ బల్క్ కార్టన్లు కిరాణా వ్యాపారులకు ప్రత్యేక రాయితీ ధరకే లభిస్తాయి.\n"
                "• 100% స్వచ్ఛమైన శాకాహారం, ప్రిజర్వేటివ్స్ లేని తాజా రుచి!"
            )
        elif lang == "hi":
            reply = (
                "🌟 **श्री बालाजी का नया धमाकेदार लॉन्च – कास्ता गटिया (Kastha Gatiya - Diwali Special 2026)!**\n\n"
                "• **स्वाद:** मुंह में घुल जाने वाली खस्ता और कुरकुरी गटिया, शुद्ध बेसन, अजवायन और पारंपरिक मसालों से निर्मित।\n"
                "• **खुदरा मूल्य:** 250g – ₹60 | 500g – ₹120 | 1kg – ₹240 | 5kg कार्टन – ₹1,150\n"
                "• **थोक मूल्य:** किराना और सुपरमार्केट के लिए 250g पैक मात्र ₹48 थोक दर पर उपलब्ध।\n"
                "• 100% शुद्ध शाकाहारी, बिना किसी केमिकल या प्रिजर्वेटिव के ताजा तैयार!"
            )
        else:
            reply = (
                "🌟 **Brand New Launch: Kastha Gatiya (Diwali Special 2026)**\n\n"
                "Special festive launch by Sri Balaji Special Mixtures! Handcrafted, melt-in-the-mouth crispy Kastha Gatiya (కాస్తా గటియా / କାସ୍ତା ଗଟିଆ), prepared with premium gram flour, carom seeds (ajwain), and authentic traditional spices.\n\n"
                "• **Retail Pricing:** 250g – **₹60** | 500g – **₹120** | 1kg – **₹240** | 5kg Bulk Carton – **₹1,150**\n"
                "• **Wholesale Rates (B2B):** 250g – **₹48** | 500g – **₹95** | 1kg – **₹185** | 5kg – **₹900**\n"
                "• **Purity:** 100% Pure Vegetarian, freshly fried in premium oil with zero preservatives.\n"
                "• **Tagline:** *Taste the Tradition... Festive Delight!*"
            )
        quick_suggestions = [
            "Add Kastha Gatiya to cart",
            "Which snack is suitable with evening tea?",
            "Bulk cartons for Kirana stores",
            "Check delivery PIN code"
        ]

    # ----------------------------------------------------
    # INTENT 4: TEA-TIME & EVENING SNACK PAIRINGS
    # ----------------------------------------------------
    elif any(k in msg for k in ["tea", "chai", "coffee", "evening", "nashta", "pairing", "snack"]):
        recs = [p for p in products if any(k in p.name.lower() for k in ["onion", "murrukulu", "chuda", "gatiya"])]
        if not recs:
            recs = products[:3]
        recommendations = [build_recommendation_item(p) for p in recs[:3]]

        if lang == "or":
            reply = (
                "☕ **ସନ୍ଧ୍ୟା ଚାହା (Evening Tea) ପାଇଁ ଶ୍ରୀ ବାଲାଜୀଙ୍କ ସର୍ବୋତ୍ତମ ପସନ୍ଦ:**\n\n"
                "1. **ସ୍ପେଶାଲ ଅନିଅନ୍ ମିକ୍ସଚର୍:** କ୍ରିସ୍ପି ଭଜା ପିଆଜ ଓ କାଜୁ ସହିତ ଅନନ୍ୟ ସ୍ୱାଦ।\n"
                "2. **କାସ୍ତା ଗଟିଆ:** ନୂଆ ଦିୱାଲୀ ସ୍ପେଶାଲ, ଚାହା ସହିତ ନରମ ଓ କୁରକୁରିଆ।\n"
                "3. **କର କର ମୁରୁକୁଲୁ:** ଖାଣ୍ଟି ଓଡ଼ିଶା ଚାଉଳ ଓ ରାଶି ଯୁକ୍ତ ସ୍ନାକ୍ସ।"
            )
        elif lang == "te":
            reply = (
                "☕ **సాయంత్రం టీ లేదా కాఫీతో శ్రీ బాలాజీ టాప్ స్నాక్స్:**\n\n"
                "1. **ఆనియన్ మిక్చర్ (Onion Mixture):** కరకరలాడే ఉల్లిపాయలు, జీడిపప్పుతో తయారైన రాయల్ రుచి.\n"
                "2. **కాస్తా గటియా (Kastha Gatiya):** సరికొత్త సమర్పణ, టీతో అద్భుతంగా సరిపోతుంది.\n"
                "3. **కర్ కర్ మురుకులు (Kar Kar Murrukulu):** నూనె తక్కువ, మంచి క్రంచీ రుచి."
            )
        elif lang == "hi":
            reply = (
                "☕ **शाम की चाय के साथ श्री बालाजी के टॉप 3 स्नैक्स:**\n\n"
                "1. **स्पेशल अनियन मिक्सचर:** कुरकुरे तले प्याज, काजू और मूंगफली का लाजवाब स्वाद।\n"
                "2. **कास्ता गटिया (न्यू लॉन्च):** अजवायन की महक और खस्तापन जो चाय के स्वाद को दोगुना कर दे।\n"
                "3. **कर कर मुरुक्कू:** शुद्ध चावल और उड़द आटे से बना पारंपरिक साउथ ओडिशा स्नैक।"
            )
        else:
            reply = (
                "☕ **Best Evening Tea & Coffee Pairings from Sri Balaji:**\n\n"
                "1. **Special Onion Mixture:** Our signature creation! Slow-fried golden onions, roasted cashews, and peanuts in spicy gram flour ribbons. Pairs magnificently with strong ginger tea.\n"
                "2. **Kastha Gatiya (New Launch):** Delicate carom seed (ajwain) aroma with melt-in-the-mouth flakiness. The ultimate festive chai companion!\n"
                "3. **Kar Kar Murrukulu & Chuda Mixture:** Light, crunchy, and non-greasy for a comforting evening bite."
            )
        quick_suggestions = [
            "Tell me about Kastha Gatiya",
            "Which products are spicy?",
            "Difference between Onion & Chuda Mixture?",
            "Check delivery PIN code"
        ]

    # ----------------------------------------------------
    # INTENT 5: SPICY SAVOURIES & CHILLI HEAT
    # ----------------------------------------------------
    elif any(k in msg for k in ["spicy", "hot", "tikha", "jhal", "mirchi", "chilli", "heat"]):
        recs = [p for p in products if (p.spice_level and "SPICY" in p.spice_level.upper()) or any(k in p.name.lower() for k in ["pakodi", "onion", "boondi", "murrukulu"])]
        recs.sort(key=lambda p: 0 if (p.spice_level and "SPICY" in p.spice_level.upper()) else 1)
        if not recs:
            recs = products[:3]
        recommendations = [build_recommendation_item(p) for p in recs[:3]]

        reply = (
            "🌶️ **Sri Balaji Spice Index – From Mild to Super Zesty:**\n\n"
            "• **Hot & Spicy (🔥🔥🔥):** Special Onion Pakodi & Masala Boondi – Blended with fresh sun-dried Guntur and South Odisha chillies, garlic, and curry leaves.\n"
            "• **Medium Spicy (🌶️):** Special Onion Mixture, Kastha Gatiya & Special Mixture – Balanced warmth with savory aromatic spices.\n"
            "• **Mild & Crunchy (✨):** Chuda Mixture (Poha) & Classic Sev – Very gentle on the palate, ideal for kids and light snacking."
        )
        quick_suggestions = [
            "Tell me about Kastha Gatiya",
            "Which snack is suitable with evening tea?",
            "Bulk cartons for Kirana stores",
            "Check Paralakhemundi delivery"
        ]

    # ----------------------------------------------------
    # INTENT 6: BULK / WHOLESALE CARTONS & KIRANA STORES
    # ----------------------------------------------------
    elif any(k in msg for k in ["bulk", "wholesale", "kirana", "supermarket", "distributor", "carton", "dealer", "b2b", "moq"]):
        recs = [p for p in products if any(k in p.name.lower() for k in ["gatiya", "onion", "mixture"])][:3]
        if not recs:
            recs = products[:3]
        recommendations = [build_recommendation_item(p) for p in recs]
        contact_action = f"https://wa.me/919861789602?text={urllib.parse.quote('Hello Sri Balaji Wholesale Desk, I am interested in bulk carton distribution for my store.')}"

        reply = (
            "📦 **Sri Balaji B2B Wholesale & Kirana Store Distribution:**\n\n"
            "We supply grocery shops, Kiranas, supermarkets, and event caterers with factory-direct freshness from Paralakhemundi:\n\n"
            "• **Pack Sizes:** 250g, 500g, 1kg retail airtight pouches and 3kg, 5kg, 10kg commercial master cartons.\n"
            "• **Wholesale Margin:** Generous 20% to 30% dealer margins with verified GST invoices.\n"
            "• **Minimum Order Quantity (MOQ):** Just 25kg across mixed varieties for wholesale rates.\n"
            "• **Dispatch:** Daily scheduled roadlines, bus cargo, and regional tempos across Odisha & Northern Andhra Pradesh.\n\n"
            "Register directly at our [B2B Dealer Portal](/dealer) or tap below to message our Wholesale Desk at **+91 98617 89602**."
        )
        quick_suggestions = [
            "What is wholesale price of Kastha Gatiya?",
            "Check delivery PIN code",
            "What is minimum order quantity?",
            "Which snack is suitable with evening tea?"
        ]

    # ----------------------------------------------------
    # INTENT 7: INGREDIENTS, QUALITY & VEGETARIAN STATUS
    # ----------------------------------------------------
    elif any(k in msg for k in ["ingredient", "oil", "shelf life", "expiry", "pure veg", "vegetarian", "preservative", "chemical"]):
        reply = (
            "🌿 **Sri Balaji Purity & Quality Assurance:**\n\n"
            "• **100% Pure Vegetarian:** Prepared in a dedicated vegetarian facility with zero animal fats or additives.\n"
            "• **Pure Besan & Spices:** Grade-A gram flour, hand-selected peanuts, premium whole cashews, and ground spices.\n"
            "• **Healthy Refined Oils:** Deep-fried in batch-tested high-quality vegetable & peanut oil, never reused or degraded.\n"
            "• **Zero Chemical Preservatives:** Authentic traditional shelf life of **45 to 60 days** in high-barrier airtight pouches.\n"
            "• **Heritage Craftsmanship:** 30 years of authentic recipe heritage by founder Sri Adari Krishna Rao."
        )
        quick_suggestions = [
            "Tell me about Kastha Gatiya",
            "Which snack is suitable with evening tea?",
            "Bulk cartons for Kirana stores",
            "Where is your store located?"
        ]

    # ----------------------------------------------------
    # INTENT 8: RETAIL PRICING & RATE OVERVIEW
    # ----------------------------------------------------
    elif any(k in msg for k in ["retail price", "price", "prices", "rate", "cost", "how much", "mrp", "rate chart"]):
        recs = [p for p in products if any(k in p.name.lower() for k in ["gatiya", "onion", "mixture", "murrukulu"])][:4]
        if not recs:
            recs = products[:3]
        recommendations = [build_recommendation_item(p) for p in recs]

        reply = (
            "🏷️ **Sri Balaji Verified Retail Pricing & Pack Sizes:**\n\n"
            "• **Kastha Gatiya (Diwali Special 2026):** 250g – **₹60** | 500g – **₹120** | 1kg – **₹240** | 5kg Bulk Carton – **₹1,150**\n"
            "• **Special Onion Mixture (Signature):** 250g – **₹60** | 500g – **₹120** | 1kg – **₹240**\n"
            "• **Special Mixture (Traditional):** 250g – **₹55** | 500g – **₹110** | 1kg – **₹220**\n"
            "• **Kar Kar Murrukulu:** 250g – **₹55** | 500g – **₹110**\n"
            "• **Chuda Mixture (Poha):** 250g – **₹50** | 500g – **₹100**\n\n"
            "All items are prepared fresh with 100% pure vegetarian ingredients. You can select your desired weight variant and add directly to your bag in our [Shop Catalogue](/catalog)!"
        )
        quick_suggestions = [
            "Tell me about Kastha Gatiya",
            "Do you offer wholesale orders?",
            "Which snack is suitable with evening tea?",
            "Check delivery PIN code"
        ]

    # ----------------------------------------------------
    # INTENT 9: STORE LOCATION, CONTACT & SUPPORT DESK
    # ----------------------------------------------------
    elif any(k in msg for k in ["contact", "phone", "call", "whatsapp", "number", "reach", "talk to", "support", "where", "location", "address", "shop", "factory", "founder", "paralakhemundi", "heritage"]):
        contact_action = f"https://wa.me/919861789602?text={urllib.parse.quote('Namaste Sri Balaji Team, I would like to get in touch with your store.')}"
        reply = (
            "🏛️ **Sri Balaji Special Mixtures – Flagship Heritage Store & Contact:**\n\n"
            f"📍 **Address:** {SRI_BALAJI_KNOWLEDGE['location']}\n"
            f"👑 **Master Craftsmen:** {SRI_BALAJI_KNOWLEDGE['founder']}\n"
            f"📞 **Phone Hotline:** {SRI_BALAJI_KNOWLEDGE['phone']}\n"
            f"💬 **WhatsApp Live Desk:** **+91 98617 89602**\n\n"
            "Serving thousands of families and merchants across South Odisha and coastal Andhra Pradesh since 1995. Come visit our store or order online with scheduled regional delivery!"
        )
        quick_suggestions = [
            "Tell me about Kastha Gatiya",
            "What are your retail prices?",
            "Do you offer wholesale orders?",
            "Check delivery PIN code"
        ]

    # ----------------------------------------------------
    # INTENT 10: HOW TO PLACE AN ORDER
    # ----------------------------------------------------
    elif any(k in msg for k in ["how to order", "how can i order", "place an order", "how to place", "how to buy", "buy online", "purchase"]):
        reply = (
            "🛍️ **How to Place Your Order with Sri Balaji:**\n\n"
            "1. **Explore the Catalogue:** Visit our [Shop Page](/catalog) to browse our fresh mixtures, murrukulu, and new Kastha Gatiya.\n"
            "2. **Select Weights:** Choose your required size (250g, 500g, 1kg or 5kg Carton) and click **Add to Bag**.\n"
            "3. **Check Serviceability:** Enter your **6-digit PIN code** to view delivery schedules and freight charges.\n"
            "4. **Fast Checkout:** Place your order via Cash on Dispatch or tap **Order on WhatsApp** for instant assistance!\n\n"
            "For commercial bulk orders (>25kg), visit our [B2B Dealer Portal](/dealer) or connect with our wholesale team."
        )
        quick_suggestions = [
            "Tell me about Kastha Gatiya",
            "What are your retail prices?",
            "Do you deliver to Gunupur?",
            "Do you offer wholesale orders?"
        ]

    # ----------------------------------------------------
    # FALLBACK / WELCOMING GREETING
    # ----------------------------------------------------
    else:
        recs = [p for p in products if any(k in p.name.lower() for k in ["gatiya", "onion", "mixture"])][:3]
        if not recs:
            recs = products[:3]
        recommendations = [build_recommendation_item(p) for p in recs]

        if lang == "or":
            reply = (
                "ନମସ୍କାର! 🙏 ମୁଁ **ବାଲାଜୀ ମିତ୍ର (Balaji Mitra)**, ଶ୍ରୀ ବାଲାଜୀ ସ୍ପେଶାଲ ମିକ୍ସଚର୍ସର ଆପଣଙ୍କ ବ୍ୟକ୍ତିଗତ ସ୍ନାକ୍ସ ସହାୟକ। "
                "ଆମର ସ୍ୱାଦିଷ୍ଟ ମିକ୍ସଚର୍, ନୂତନ ଲଞ୍ଚ 'କାସ୍ତା ଗଟିଆ', ଚାହା ସହିତ ସ୍ନାକ୍ସ, ମୂଲ୍ୟ ବା ହୋଲସେଲ ବାବଦରେ ମୋତେ ପଚାରନ୍ତୁ। ମୁଁ ସାହାଯ୍ୟ କରି ଖୁସି ହେବି!"
            )
        elif lang == "te":
            reply = (
                "నమస్తే! 🙏 నేను **బాలాజీ మిత్ర (Balaji Mitra)**, శ్రీ బాలాజీ స్పెషల్ మిక్చర్స్ పర్సనల్ స్నాక్ అసిస్టెంట్. "
                "మా కొత్త సమర్పణ 'కాస్తా గటియా', టీ స్నాక్స్, కారం లెవెల్స్ లేదా హోల్సేల్ బల్క్ కార్టన్ల గురించి నన్ను ఏదైనా అడగండి. మీకు సాయపడటం నాకెంతో ఆనందం!"
            )
        elif lang == "hi":
            reply = (
                "नमस्ते! 🙏 मैं **बालाजी मित्र (Balaji Mitra)** हूँ, श्री बालाजी स्पेशल मिक्सचर्स का आपका पर्सनल स्नैक डिस्कवरी असिस्टेंट। "
                "हमारे नए लॉन्च 'कास्ता गटिया', शाम की चाय की जोड़ी, मसालों के स्तर या थोक आर्डरों के बारे में आप मुझसे कुछ भी पूछ सकते हैं!"
            )
        else:
            reply = (
                "Namaste! 🙏 I am **Balaji Mitra**, your personal snack discovery assistant. "
                "Ask me anything about our delicious mixtures, spice levels, evening tea pairings, product availability, order tracking or wholesale enquiries. I'm happy to help!"
            )

    return AIChatResponse(
        reply=reply,
        language=lang,
        recommendations=recommendations,
        quick_suggestions=quick_suggestions,
        contact_action=contact_action
    )
