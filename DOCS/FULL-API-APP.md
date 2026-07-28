# Mandi Price API — Complete Full-Stack Architecture Blueprint

This document provides a comprehensive end-to-end technical overview of the complete **Mandi Price API** service, monorepo layout, data flow, deployment pipeline, and operational procedures.

---

## 1. Project Overview & Business Value

### Purpose
The **Mandi Price API** is a free, open, keyless REST API serving daily agricultural mandi (wholesale market) prices for major Indian states, sourced directly from the Government of India's open data portal (`data.gov.in`).

### Key Highlights
- **Zero Friction**: Keyless, open API requiring no sign-up or registration.
- **5 Major Indian States**: Maharashtra, Uttar Pradesh, Punjab, Madhya Pradesh, Karnataka.
- **Real-Time Data Ingestion**: Automated daily pull at 15:00 UTC (8:30 PM IST) fetching ~3,500 records daily.
- **Developer Portal**: React-based dark-mode portal with interactive API playground, multi-language code generators (cURL, JS, Python, Go), JSON response viewer, and price trend visualizer graph.

---

## 2. End-to-End System Architecture

```
                               ┌─────────────────────────┐
                               │   data.gov.in Portal    │
                               │ (Ministry of Ag. API)   │
                               └────────────┬────────────┘
                                            │
                                            │ Daily Cron (15:00 UTC)
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
├── DOCS/
│   ├── MANDI-API-BUILD-SPEC.md   # Initial build specification
│   ├── FRONTEND.md               # Detailed frontend architecture & UI specs
│   ├── BACKEND.md                # Detailed backend API & ingestion script specs
│   └── FULL-API-APP.md           # Master full-stack architecture blueprint
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
│   ├── src/
│   │   ├── components/           # Navbar, StatusBadge, RegionSelector, CodeSnippet, PriceChart
│   │   ├── pages/                # HomePage, PlaygroundPage, DocsPage, StatusPage
│   │   ├── config.js             # Base URL resolver
│   │   ├── App.jsx               # SPA view shell
│   │   └── index.css             # Glassmorphism design system
│   ├── vite.config.js            # Vite configuration & proxy settings
│   ├── vercel.json               # Vercel SPA rewrite rule
│   └── package.json
└── .github/
    └── workflows/
        └── daily-ingest.yml      # GitHub Actions daily cron workflow
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

---

## 5. Deployment Guide

1. **Database Setup**: Execute `backend/schema.sql` in Supabase SQL Editor.
2. **Backend (Render)**: Deploy `backend/` as Web Service with `node src/index.js` start command.
3. **Frontend (Vercel)**: Deploy `frontend/` with `VITE_API_URL` pointing to Render URL.
4. **Daily Ingestion**: Configure GitHub Actions secrets (`SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `DATA_GOV_API_KEY`).
