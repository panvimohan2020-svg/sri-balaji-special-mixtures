# SRI BALAJI SPECIAL MIXTURES – SHOP-LEVEL STANDARD OPERATING PROCEDURES (SOP)
**Location:** Gandhi School Road, Near Post Office, Paralakhemundi, Gajapati, Odisha – 761200  
**Proprietors:** Adari Krishna Rao & Adari Dilleshwar Rao  
**Operating Systems:** Executive OMS • Smart Inventory • B2B Dealer Portal • Logistics Hub

---

## 1. DAILY STORE & KITCHEN OPENING CHECKLIST (07:30 AM – 08:30 AM)
1. **Physical Frying & Spice Check:**
   - Verify fresh groundnut oil quality and temperature control in the brass frying vessels.
   - Inspect daily ground spice batches (chilli powder, hing, roasted curry leaves, black salt).
2. **Digital System Check:**
   - Log in to Sri Balaji Central Management Portal (`/admin`).
   - Review the **Smart Inventory** tab for any **Low-Stock Alerts** triggered overnight.
   - Check the **Orders (OMS)** tab for new customer enquiries received via website or WhatsApp.
3. **Database Safety Backup:**
   - Run the automated daily backup command:
     ```bash
     python backend/scripts/db_backup_recovery.py --backup
     ```
   - Verify integrity check returns `[INTEGRITY] PRAGMA check: ok`.

---

## 2. RETAIL ORDER FULFILLMENT WORKFLOW (STEP-BY-STEP)
```
Customer Places Order 
  ↳ Status: NEW ENQUIRY (Stock Unchanged)
      ↳ Admin Reviews Items & Delivery Address
          ↳ Status: CONTACTED / CONFIRMED
              ↳ System Deducts Stock Automatically
                  ↳ Kitchen Packs in Moisture-Barrier Pouches
                      ↳ Dispatch / Handover ➔ Status: DELIVERED
```

1. **Step 1: Receipt of Order:**
   - When a customer submits an order (via Cart or WhatsApp Enquiry), the order status is set to `NEW ENQUIRY`.
   - Inventory is **NOT deducted** at enquiry stage to prevent inventory exhaustion from unconfirmed orders.
2. **Step 2: Customer Contact:**
   - Click the WhatsApp/Call button on the order row to confirm customer address and readiness.
   - Change order status to `CONTACTED`.
3. **Step 3: Confirmation & Stock Reservation:**
   - Once payment is confirmed or COD accepted, set status to `CONFIRMED`.
   - The Smart Inventory engine automatically reserves and deducts stock, logging an audit trail (`StockMovement`).
4. **Step 4: Packing:**
   - Pack mixtures in sealed food-grade moisture barrier pouches (250g / 500g).
   - Ensure the batch freshness label and Sri Balaji authentic branding are affixed.
5. **Step 5: Handover & Delivery:**
   - For local Paralakhemundi counter orders: Handover to customer and mark `DELIVERED`.
   - For delivery orders: Assign delivery partner and mark `DELIVERED` upon completion.
   - Revenue is strictly accounted into confirmed business metrics once confirmed/delivered.

---

## 3. B2B WHOLESALE & DEALER ORDER WORKFLOW
1. **Dealer Application Review:**
   - Review incoming dealer applications in `B2B Dealers (CRM)` tab.
   - Verify shop name, owner phone, and PIN code (Kirana store, Supermarket, Distributor).
   - Assign commercial tier: `RETAILER` (15% margin), `WHOLESALER` (20% margin), or `DISTRIBUTOR` (25% margin).
   - Click `Approve Dealer`.
2. **Wholesale Quotations:**
   - Generate official digital quotes with MOQ validation (minimum 2 pkgs per standard variety; 1 bulk sack).
   - Quotes include destination freight estimates and payment terms (Advance / Credit terms).
3. **Consignment Packaging & Logistics Dispatch:**
   - Bulk savouries are packed in heavy-gauge poly-bags inside 3-ply/5-ply corrugated transit cartons.
   - In `Logistics & Dispatch` tab, click `Create Shipment`:
     - Select courier: *Regional Bus Cargo / Lorry / Local Express Courier*.
     - Enter consignment/docket number and freight charges.
     - Set status to `IN_TRANSIT`.
   - Share tracking URL with dealer for real-time tracking (`/track`).

---

## 4. CANCELLATIONS, RETURNS & COMPLAINT RESOLUTION
1. **Order Cancellation Before Dispatch:**
   - If customer requests cancellation before dispatch, change status to `CANCELLED`.
   - The Smart Inventory system **automatically restores** the reserved stock back into active inventory.
2. **Complaints & Crunch Guarantee:**
   - Sri Balaji guarantees 90-day crispness under proper sealed storage.
   - In case of pouch puncture during transit, review photo submitted by customer.
   - Issue a replacement packet in the next dispatch or refund via original payment channel.

---

## 5. CUSTOMER FEEDBACK & REVIEW MODERATION
1. Customers submit reviews via the public website (`/` or `/catalog`).
2. The anti-spam engine blocks spam links, invalid ratings, and duplicate rapid submissions.
3. If an order number is provided, the system matches it against authentic database records and awards the **Verified Buyer** badge.
4. Admins can view all reviews in the portal and toggle visibility with one click.

