# Mandi Price API — Backend & Ingestion Architecture Guide

This document details the backend REST API implementation, database schema, data ingestion pipeline, validation rules, and error envelopes.

---

## 1. Monorepo Location & Tech Stack

- **Directory**: `backend/`
- **Runtime**: Node.js 22.x (native WebSocket requirement for Supabase v2)
- **Framework**: Express 4.x
- **Database**: Supabase (PostgreSQL)
- **Key Packages**: `@supabase/supabase-js`, `cors`, `express-rate-limit`, `dotenv`
- **Deployment Target**: Render (Web Service)

---

## 2. Directory Structure

```
backend/
├── src/
│   ├── index.js              # Express app, CORS, rate limiter, route mounting
│   ├── db.js                 # Supabase client singleton using SUPABASE_SERVICE_KEY
│   ├── validators.js         # Input validation & error envelope helpers
│   └── controllers/          # Endpoint handlers (states, commodities, markets, prices)
├── scripts/
│   ├── states.config.js     # Supported states configuration & canonical state mapper
│   └── ingest.js            # Ingestion script with pagination, pacing & deduplication
├── schema.sql                # Supabase database DDL table & index setup script
├── .env                      # Local environment configuration (PORT, SUPABASE_URL, etc.)
├── .env.example              # Environment variables template
└── package.json
```

---

## 3. Database Schema (`schema.sql`)

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

-- Disable Row Level Security for keyless API access
ALTER TABLE mandi_prices DISABLE ROW LEVEL SECURITY;
```

---

## 4. Ingestion Pipeline (`scripts/ingest.js`)

- **Data Source**: `data.gov.in` resource `9ef84268-d588-465a-a308-a864a43d0070`
- **Trigger**: GitHub Actions cron (`0 15 * * *` daily at 15:00 UTC / 8:30 PM IST) running on Node 22.x
- **Features**:
  - Paged fetching (`limit=100`, `offset` pagination).
  - Exponential backoff retry logic (up to 5 attempts).
  - Request pacing (400ms delay between pages) to respect rate limits.
  - Date converter (`DD/MM/YYYY` -> `YYYY-MM-DD`).
  - In-batch deduplication by composite key `(state, market, commodity, variety, arrival_date)` to prevent Postgres conflict batch errors.
  - Supabase upserts for idempotency.

---

## 5. API Endpoints & Envelopes

All routes are rate-limited to 100 requests per 15 minutes per IP.

| Endpoint | Method | Required Params | Optional Params | Purpose |
|---|---|---|---|---|
| `/` | `GET` | — | — | API welcome index & route directory |
| `/health` | `GET` | — | — | Health check status |
| `/v1/states` | `GET` | — | — | List supported states |
| `/v1/commodities` | `GET` | — | `state`, `market` | Distinct commodities list (supports state & market filtering) |
| `/v1/markets` | `GET` | `state` | — | Active mandis in a state |
| `/v1/prices` | `GET` | `state` OR `commodity` | `market`, `variety`, `date` | Latest crop price records |
| `/v1/prices/history` | `GET` | `state`, `commodity` | `market`, `from`, `to` | Trend data over date ranges |

### Standard Response Envelope (Success)
```json
{
  "success": true,
  "data": [ ... ],
  "meta": {
    "count": 42,
    "state": "Maharashtra",
    "market": "Katol APMC"
  }
}
```

### Standard Error Envelope
```json
{
  "success": false,
  "error": {
    "code": "MISSING_PARAM",
    "message": "Query parameter 'state' or 'commodity' is required."
  }
}
```
