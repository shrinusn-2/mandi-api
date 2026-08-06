# Mandi Price API (v1 / MVP)

[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC_BY--NC--SA_4.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc-sa/4.0/)

Originally created by shrinivas-sn — first released July 2026. Open for community use and contribution under the license below.

Free, open, keyless REST API serving daily agricultural mandi (wholesale market) prices across 5 major Indian states, sourced from the Government of India's open data portal (`data.gov.in`).

---

## 🌟 Key Features

- **Open & Keyless:** No developer registration or API key required.
- **5 Supported Indian States:** Maharashtra, Uttar Pradesh, Punjab, Madhya Pradesh, Karnataka.
- **Real Per-Page Routes:** `react-router-dom` gives `/`, `/playground`, `/docs`, and `/status` their own crawlable URLs, plus a `404` fallback — no longer a single-page tab switcher.
- **SEO Foundation:** Per-page metadata (title/description/canonical/OG/Twitter) via `react-helmet-async`, JSON-LD structured data, and a build-time static-prerender step (Puppeteer) so crawlers get real HTML per route, not an empty shell. `robots.txt` and `sitemap.xml` are generated from the same route manifest at build time.
- **Mobile-Responsive:** Collapsing hamburger nav, fluid type, and single-column layouts below 768px.
- **Earthy/Harvest Design System:** A mandi rate-board–inspired visual identity (slate-green base, turmeric-gold/rust accents) instead of a generic dark-glass SaaS look — see `frontend/src/index.css`.
- **Live Rate Board:** The homepage hero fetches and renders real current prices instead of marketing copy.
- **Searchable Custom Dropdowns:** Custom dropdowns with built-in real-time search bars (`CustomSelect.jsx`); `RegionSelector.jsx` is a thin state-list wrapper around it.
- **Cascading Filter Logic:** Step 1 State ➔ Step 2 Market ➔ Step 3 Crop (guarantees 100% valid non-zero results).
- **Build With AI Prompt Spec:** One-click copy/downloadable Markdown API spec optimized for LLMs (*ChatGPT, Claude, Gemini, Antigravity*).
- **Dynamic Ingestion Timestamp Badge:** Live IST timestamp badge tracking exact Supabase ingestion time (`latest_fetched_at`).
- **Docs Page ScrollSpy:** `IntersectionObserver` tracking active sections automatically as developers scroll.
- **Daily Automated Ingestion:** Scheduled daily pull at 15:00 UTC (8:30 PM IST) via GitHub Actions running on Node.js 22.x.
- **Rate Limited:** Protected by `express-rate-limit` (100 requests per 15 minutes per IP).
- **Developer Portal & Interactive Playground:** React portal with live request testing, code generators, JSON output viewer, and trend visualizer graphs.

---

## 📁 Repository Architecture

```
mandi-api/
├── LICENSE                      # CC BY-NC-SA 4.0 International License
├── README.md                    # Repository documentation & quick start guide
├── DOCS/                        # Technical Architecture & Developer Guides
│   ├── MANDI-API-BUILD-SPEC.md   # Initial build specification blueprint
│   ├── FRONTEND.md               # Frontend architecture, components & ScrollSpy specs
│   ├── BACKEND.md                # Backend REST API, schema & Node 22.x ingestion pipeline
│   ├── FULL-API-APP.md           # End-to-end full-stack system architecture blueprint
│   └── FUTURE-PLAN.md            # 1-year rolling retention policy & roadmap
├── backend/                      # Node 22.x + Express 4.x REST API & Ingestion Pipeline
│   ├── src/
│   │   ├── index.js             # Express app, rate limiter, CORS, routes
│   │   ├── db.js                # Supabase client singleton setup
│   │   ├── validators.js        # Input validation & error envelope helpers
│   │   └── controllers/
│   │       ├── states.js        # GET /v1/states
│   │       ├── commodities.js   # GET /v1/commodities (supports state & market filtering)
│   │       ├── markets.js       # GET /v1/markets
│   │       └── prices.js        # GET /v1/prices & GET /v1/prices/history
│   ├── scripts/
│   │   ├── states.config.js    # State names & government spellings config
│   │   └── ingest.js           # Daily pull, pacing, deduplication & upsert script
│   ├── schema.sql               # Supabase database table & index creation SQL
│   ├── .env                     # Local environment configuration
│   └── package.json
├── frontend/                     # React 18 + Vite 6 Developer Portal
│   ├── public/
│   │   ├── favicon.png          # App icon & tab favicon
│   │   └── logo.png             # Brand logo emblem
│   ├── scripts/
│   │   └── prerender.js        # Postbuild static-prerender + sitemap.xml/robots.txt generator
│   ├── src/
│   │   ├── components/         # Navbar, StatusBadge, CustomSelect, RegionSelector, AiSpecButton, CodeSnippet, JsonViewer, PriceChart, Seo
│   │   ├── pages/              # HomePage, PlaygroundPage, DocsPage, StatusPage, NotFoundPage
│   │   ├── data/
│   │   │   └── aiSpec.js       # Static LLM prompt spec module
│   │   ├── routes.js           # Single route manifest (paths, nav labels, SEO titles/descriptions)
│   │   ├── utils.js            # Shared formatters (e.g. formatIngestionTime)
│   │   ├── config.js           # Base URL + SITE_URL resolution (Vite and plain-Node safe)
│   │   ├── App.jsx             # react-router routes shell
│   │   └── index.css            # Earthy/harvest mandi rate-board design system
│   ├── vite.config.js
│   ├── vercel.json              # Vercel SPA rewrite configuration (static files still win over the rewrite)
│   └── package.json
└── .github/
    └── workflows/
        └── daily-ingest.yml     # Daily GitHub Actions ingestion workflow (Node 22.x)
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

For a production build (`npm run build`), set `VITE_SITE_URL` to the real deployed frontend domain (e.g. `https://mandi-api.vercel.app`) — it's used for canonical/OG tags, `sitemap.xml`, and `robots.txt`, all generated at build time by `scripts/prerender.js`. Without it, these fall back to a placeholder domain.

---

## 📖 API Endpoints Reference

All endpoints are prefixed with `/v1`:

| Endpoint | Method | Required Params | Optional Params | Purpose |
|---|---|---|---|---|
| `/v1/states` | `GET` | — | — | List supported 5 Indian states |
| `/v1/commodities` | `GET` | — | `state`, `market` | List distinct commodities (supports market filter) |
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
      "modal_price": 1500,
      "fetched_at": "2026-07-28T20:31:05.000Z"
    }
  ],
  "meta": {
    "count": 1,
    "state": "Maharashtra",
    "commodity": "Onion",
    "latest_fetched_at": "2026-07-28T20:31:05.000Z"
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
