# Mandi Price API — Complete Full-Stack Architecture Blueprint

This document provides a comprehensive end-to-end technical overview of the complete **Mandi Price API** service, monorepo layout, data flow, deployment pipeline, and operational procedures.

---

## 1. Project Overview & Business Value

### Purpose
The **Mandi Price API** is a free, open, keyless REST API serving daily agricultural mandi (wholesale market) prices for major Indian states, sourced directly from the Government of India's open data portal (`data.gov.in`).

### Key Highlights
- **Zero Friction**: Keyless, open API requiring no sign-up or registration.
- **5 Major Indian States**: Maharashtra, Uttar Pradesh, Punjab, Madhya Pradesh, Karnataka.
- **Real Per-Page Routes & SEO**: `react-router-dom` routing, per-page metadata (`react-helmet-async`), JSON-LD, and a build-time Puppeteer prerender step so each route ships real crawlable HTML — plus a generated `sitemap.xml`/`robots.txt` from a single route manifest.
- **Mobile-Responsive**: Collapsing nav, fluid type, single-column layouts below 768px.
- **Searchable Custom Dropdowns**: Integrated real-time search input bar (`CustomSelect.jsx`) for State, Market, and Crop selectors.
- **Cascading Filter Order**: Step 1 State ➔ Step 2 Market ➔ Step 3 Crop (guarantees 100% valid non-zero results).
- **Build With AI Prompt Spec**: One-click copy/downloadable Markdown spec for LLMs (*ChatGPT, Claude, Gemini, Antigravity*).
- **Dynamic Ingestion Timestamp Badge**: Live IST timestamp badge tracking exact Supabase ingestion time (`latest_fetched_at`).
- **Docs ScrollSpy**: `IntersectionObserver` in `DocsPage.jsx` tracking active sections automatically as developers scroll.
- **Real-Time Data Ingestion**: Automated daily pull at 15:00 UTC (8:30 PM IST) fetching ~3,500 records daily running on Node 22.x.
- **Developer Portal**: React-based portal (earthy/harvest "mandi rate-board" design system) with interactive API playground, multi-language code generators (cURL, JS, Python, Go), JSON response viewer, and price trend visualizer graph.

---

## 2. End-to-End System Architecture

```
                               ┌─────────────────────────┐
                               │   data.gov.in Portal    │
                               │ (Ministry of Ag. API)   │
                               └────────────┬────────────┘
                                            │
                                            │ Daily Cron (15:00 UTC / Node 22.x)
                                            ▼
┌────────────────────────┐     ┌─────────────────────────┐
│     Supabase DB        │ ◄───┤  GitHub Actions Cron    │
│  (Postgres Database)   │     │ (backend/scripts/ingest)│
└───────────▲────────────┘     └─────────────────────────┘
            │
            │ Reads Price Records
            │
┌───────────┴────────────┐     ┌─────────────────────────┐
│ Node Express Server    │ ◄───┤   React Developer UI    │
│  (Render Backend API)  │     │   (Vercel Portal App)   │
└────────────────────────┘     └─────────────────────────┘
```

---

## 3. Monorepo Directory Layout

```
mandi-api/
├── LICENSE                       # CC BY-NC-SA 4.0 International License
├── README.md                     # Main repository overview & setup guide
├── DOCS/
│   ├── MANDI-API-BUILD-SPEC.md   # Initial build specification blueprint
│   ├── FRONTEND.md               # Detailed frontend architecture, components & ScrollSpy specs
│   ├── BACKEND.md                # Detailed backend API, schema & Node 22.x ingestion specs
│   ├── FULL-API-APP.md           # Master full-stack architecture blueprint
│   └── FUTURE-PLAN.md            # 1-year rolling retention policy & roadmap
├── backend/                      # Express 4.x REST API & Ingestion script
│   ├── src/
│   │   ├── index.js              # Express app entry & route definitions
│   │   ├── db.js                 # Supabase client singleton setup
│   │   ├── validators.js         # Input validation & error envelope helpers
│   │   └── controllers/          # Endpoint handlers (states, commodities, markets, prices)
│   ├── scripts/
│   │   ├── states.config.js      # Supported state configurations
│   │   └── ingest.js             # Data ingestion pipeline
│   ├── schema.sql                # PostgreSQL DDL table setup
│   ├── .env                      # Local environment variables
│   └── package.json
├── frontend/                     # React 18 + Vite 6 Developer Portal
│   ├── public/
│   │   ├── favicon.png           # App icon & tab favicon
│   │   └── logo.png              # Brand emblem logo
│   ├── scripts/
│   │   └── prerender.js          # Postbuild: prerenders routes, generates sitemap.xml/robots.txt
│   ├── src/
│   │   ├── components/           # Navbar, StatusBadge, CustomSelect, RegionSelector, AiSpecButton, CodeSnippet, JsonViewer, PriceChart, Seo
│   │   ├── pages/                # HomePage, PlaygroundPage, DocsPage, StatusPage, NotFoundPage
│   │   ├── data/
│   │   │   └── aiSpec.js         # Static LLM prompt spec module
│   │   ├── routes.js             # Route manifest (paths, nav labels, SEO titles/descriptions)
│   │   ├── utils.js              # Shared formatters
│   │   ├── config.js             # API_BASE_URL / SITE_URL resolver (Vite + plain-Node safe)
│   │   ├── App.jsx               # react-router <Routes> shell
│   │   └── index.css             # Earthy/harvest design system
│   ├── vite.config.js            # Vite configuration & proxy settings
│   ├── vercel.json               # Vercel SPA rewrite rule
│   └── package.json
└── .github/
    └── workflows/
        └── daily-ingest.yml      # GitHub Actions daily cron workflow (Node 22.x)
```

---

## 4. Environment Variables Reference

| Environment Variable | Target Location | Description |
|---|---|---|
| `PORT` | Backend / Render | Port number for Express server (default `3000`) |
| `SUPABASE_URL` | Backend / Render / GH Actions | Supabase project URL (`https://xxxx.supabase.co`) |
| `SUPABASE_SERVICE_KEY` | Backend / Render / GH Actions | Supabase API key |
| `DATA_GOV_API_KEY` | Backend / Render / GH Actions | Government open data API key |
| `VITE_API_URL` | Frontend / Vercel | Production backend base URL (`https://mandi-api.onrender.com`) |
| `VITE_SITE_URL` | Frontend / Vercel | Production frontend domain (`https://mandi-api.vercel.app`) — used for canonical/OG tags, `sitemap.xml`, `robots.txt` |

---

## 5. Deployment Guide

1. **Database Setup**: Execute `backend/schema.sql` in Supabase SQL Editor.
2. **Backend (Render)**: Deploy `backend/` as Web Service with `node src/index.js` start command.
3. **Frontend (Vercel)**: Deploy `frontend/` with `VITE_API_URL` pointing to the Render URL and `VITE_SITE_URL` pointing to the frontend's own Vercel domain. The build runs `vite build` then a `postbuild` prerender step (`scripts/prerender.js`) — on Vercel this uses `@sparticuz/chromium` instead of puppeteer's default Chrome, since Vercel's build container is missing the shared libraries the default one needs. If prerendering fails for any reason, the build still succeeds and ships the plain SPA output rather than blocking the deploy.
4. **Daily Ingestion**: Configure GitHub Actions secrets (`SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `DATA_GOV_API_KEY`) on Node 22.x runner.

---

## 6. License & Attribution

This project is licensed under **CC BY-NC-SA 4.0** (Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International). Copyright (c) 2026 shrinusn-2.
