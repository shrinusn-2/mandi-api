# Mandi Price API (v1 / MVP)

[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC_BY--NC--SA_4.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc-sa/4.0/)

Originally created by shrinusn-2 — first released July 2026. Open for community use and contribution under the license below.

Free, open, keyless REST API serving daily agricultural mandi (wholesale market) prices across 5 major Indian states, sourced from the Government of India's open data portal (`data.gov.in`).

---

## 🌟 Key Features

- **Open & Keyless:** No developer registration or API key required.
- **5 Supported Indian States:** Maharashtra, Uttar Pradesh, Punjab, Madhya Pradesh, Karnataka.
- **Daily Automated Ingestion:** Scheduled daily pull at 15:00 UTC (8:30 PM IST) via GitHub Actions.
- **Rate Limited:** Protected by `express-rate-limit` (100 requests per 15 minutes per IP).
- **Developer Portal & Interactive Playground:** Dark mode React portal with live request testing, code generators, JSON output viewer, and trend visualizer graphs.

---

## 📁 Repository Architecture

```
mandi-api/
├── DOCS/
│   └── MANDI-API-BUILD-SPEC.md
├── backend/
│   ├── src/
│   │   ├── index.js             # Express app, rate limiter, CORS, routes
│   │   ├── db.js                # Supabase client singleton setup
│   │   ├── validators.js        # Input validation & error envelope helpers
│   │   └── controllers/
│   │       ├── states.js        # GET /v1/states
│   │       ├── commodities.js   # GET /v1/commodities
│   │       ├── markets.js       # GET /v1/markets
│   │       └── prices.js        # GET /v1/prices & GET /v1/prices/history
│   ├── scripts/
│   │   ├── states.config.js    # State names & government spellings config
│   │   └── ingest.js           # Daily pull & upsert script
│   ├── schema.sql               # Supabase database table & index creation SQL
│   ├── .env                     # Local environment configuration
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/         # Navbar, StatusBadge, CodeSnippet, JsonViewer, PriceChart
│   │   ├── pages/              # HomePage, PlaygroundPage, DocsPage, StatusPage
│   │   ├── App.jsx
│   │   └── index.css            # Dark mode glassmorphism design system
│   ├── vite.config.js
│   ├── vercel.json              # Vercel SPA rewrite configuration
│   └── package.json
└── .github/
    └── workflows/
        └── daily-ingest.yml     # Daily GitHub Actions ingestion workflow
```

---

## 🚀 Quick Start Guide

### 1. Database Setup (Supabase)

Copy and execute [`backend/schema.sql`](file:///e:/mandi-api/backend/schema.sql) in your [Supabase SQL Editor](https://supabase.com/dashboard):

```sql
CREATE TABLE IF NOT EXISTS mandi_prices (
  id BIGSERIAL PRIMARY KEY,
  state TEXT NOT NULL,
  district TEXT NOT NULL,
  market TEXT NOT NULL,
  commodity TEXT NOT NULL,
  variety TEXT,
  grade TEXT,
  arrival_date DATE NOT NULL,
  min_price NUMERIC,
  max_price NUMERIC,
  modal_price NUMERIC,
  fetched_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (state, market, commodity, variety, arrival_date)
);

CREATE INDEX IF NOT EXISTS idx_state_commodity_date ON mandi_prices (state, commodity, arrival_date);
CREATE INDEX IF NOT EXISTS idx_market ON mandi_prices (market);
```

### 2. Backend Setup

```bash
cd backend
npm install
npm run dev
```

### 3. Run Ingestion Script Manually

```bash
cd backend
npm run ingest
```

### 4. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 📖 API Endpoints Reference

All endpoints are prefixed with `/v1`:

| Endpoint | Method | Required Params | Optional Params | Purpose |
|---|---|---|---|---|
| `/v1/states` | `GET` | — | — | List supported 5 Indian states |
| `/v1/commodities` | `GET` | — | `state` | List distinct commodities |
| `/v1/markets` | `GET` | `state` | — | List active mandis in a state |
| `/v1/prices` | `GET` | `state` OR `commodity` | `market`, `variety`, `date` | Latest crop prices matching filters |
| `/v1/prices/history` | `GET` | `state`, `commodity` | `market`, `from`, `to` | Trend data over date ranges |

### Standard Response Envelope

```json
{
  "success": true,
  "data": [
    {
      "state": "Maharashtra",
      "district": "Nagpur",
      "market": "Nagpur APMC",
      "commodity": "Onion",
      "variety": "Local",
      "arrival_date": "2026-07-28",
      "min_price": 1200,
      "max_price": 1800,
      "modal_price": 1500
    }
  ],
  "meta": {
    "count": 1,
    "state": "Maharashtra",
    "commodity": "Onion"
  }
}
```

---

## 🔒 GitHub Actions Secrets Configuration

In your GitHub repository under **Settings → Secrets and variables → Actions**, add:

- `SUPABASE_URL`: Your Supabase Project URL (`https://msdegzurpcbtaumdlmqc.supabase.co`)
- `SUPABASE_SERVICE_KEY`: Your Supabase Service Role API Key
- `DATA_GOV_API_KEY`: `<YOUR_DATA_GOV_API_KEY>`

---

## 📄 License

This project is licensed under CC BY-NC-SA 4.0 — you're free to use, modify, and learn from this code for personal and non-commercial projects, with attribution. Commercial use or launching a competing paid service using this code is not permitted without permission. See [LICENSE](LICENSE) for details.
