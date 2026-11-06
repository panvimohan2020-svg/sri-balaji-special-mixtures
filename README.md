# Sri Balaji – Premium Wholesale Snacks Digital Platform

A modern, high-performance, and visually stunning digital business platform and installable Progressive Web App (PWA) built for **Sri Balaji Wholesale Snacks**.

---

## 🌟 Key Features

1. **Dual B2B Wholesale & Retail Engine:**
   - Multi-weight selection (100g, 250g, 500g, 1kg, 5kg bulk cartons).
   - One-click toggle between **Wholesale B2B Pricing** and **Retail Consumer Pricing**.
   - Minimum Order Quantity (MOQ) enforcement for bulk wholesale orders.

2. **Automated WhatsApp Order Quotation Generator:**
   - Translates customer cart selections into properly formatted, itemized WhatsApp order quotations including customer name, shop/firm name, city, packaging sizes, quantities, and estimated subtotal.
   - Built-in guardrails stating that orders are confirmed upon vendor inventory verification.

3. **Interactive Snack Taste Discovery:**
   - Filter savouries by flavor profile: *🔥 Fiery & Spicy*, *✨ Ultra Crunchy*, *🏛️ Traditional South Indian*, *🍃 Mild & Crispy*, *🧂 Hand-Salted*, and *⭐ Bestsellers*.

4. **Installable Progressive Web App (PWA):**
   - Service worker with Workbox offline catalog caching.
   - Custom standalone app shell with thumb-accessible 5-tab Mobile Bottom Navigation (`Home`, `Catalog`, `Search`, `Cart`, `Wholesale`).
   - Custom in-app Add to Home Screen (A2HS) installation prompt.

5. **Food Safety & Authenticity Guardrail:**
   - Strictly displays verified business parameters (FSSAI, batch preparation method, quality oils, storage guidelines).
   - Clear placeholders for unverified details preventing false claims or certifications.

6. **Secure Admin Dashboard:**
   - JWT-secured management portal at `/admin/login`.
   - Real-time stock toggle (`In Stock` / `Out of Stock`).
   - Price and weight variant management.
   - Live updates to business contact details (phone, WhatsApp, timings, address).

---

## 🛠️ Technology Stack

- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, Lucide React, Zustand state store, `vite-plugin-pwa`.
- **Backend:** Python 3.9+, FastAPI (ASGI), Pydantic v2, SQLAlchemy 2.0 ORM, bcrypt, python-jose (JWT).
- **Database:** PostgreSQL (production-ready) / SQLite (zero-config local development).

---

## 🚀 Quick Start (Local Development)

### 1. Run the Backend API
```powershell
cd backend
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
- Interactive Swagger API Docs: `http://127.0.0.1:8000/api/v1/docs`
- Healthcheck Endpoint: `http://127.0.0.1:8000/api/health`

### 2. Run the Frontend & PWA
```powershell
cd frontend
npm run dev
```
- Open your browser at: `http://localhost:5173`

---

## 🔐 Admin Dashboard Credentials

- **URL:** `http://localhost:5173/admin/login`
- **Default Email:** `admin@sribalaji.com`
- **Default Password:** `BalajiAdmin2026!`

---

## 🧪 Automated API Test Suite

Run the comprehensive test suite verifying health, categories, products, settings, authentication, and order submission:
```powershell
python backend/tests/test_api.py
```

