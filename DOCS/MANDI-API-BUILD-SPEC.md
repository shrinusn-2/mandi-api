# Mandi Price API — Build Spec (v1 / MVP)

Hand this document to your AI coding tool (Antigravity) as-is. It contains every decision needed to build and deploy this project. No further planning discussion needed — just build.

---

## 1. What This Project Is

A free, open, keyless REST API that serves daily agricultural mandi (wholesale market) prices for 5 Indian states, sourced from the Government of India's open data portal. Developers can query live and historical crop prices by state, commodity, and market.

**Users:** developers building agri-tech tools, price trackers, farmer-facing apps, and researchers — not farmers directly.

---

## 2. Data Source

- **Source:** data.gov.in — resource `9ef84268-d588-465a-a308-a864a43d0070` ("Current Daily Price of Various Commodities from Various Markets (Mandi)")
- **Owner:** Ministry of Agriculture and Farmers Welfare
- **API key:** `<YOUR_DATA_GOV_API_KEY>` (store in `.env`, never commit to repo)
- **Base URL:** `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070`
- **Format:** JSON. Max `limit=100` per call (confirmed working). Use `offset` for pagination.
- **Filter syntax:** `filters[state.keyword]=Maharashtra`

### Raw fields returned:
```
state, district, market, commodity, variety, grade,
arrival_date   (format: DD/MM/YYYY — MUST convert to YYYY-MM-DD before storing)
min_price, max_price, modal_price   (₹ per quintal, as numbers)
```

### States for v1 (confirmed spelling where checked):
- Maharashtra ✅ confirmed exact via live query
- Uttar Pradesh
- Punjab
- Madhya Pradesh
- Karnataka

⚠️ Note: government data has spelling quirks (e.g., Kerala appears as "Keralam", Odisha as "Odisha"). The ingestion script MUST log a warning if any configured state returns 0 records on a run — that's the signal to check spelling manually on data.gov.in.

---

## 3. Ingestion Pipeline

- **Trigger:** GitHub Actions scheduled workflow, once daily at **15:00 UTC (8:30 PM IST)** — source data typically updates ~07:00 UTC, this gives buffer.
- **Logic per run:**
  1. For each of the 5 states, call the API with `filters[state.keyword]=<State>`, `limit=100`, looping `offset` until `offset >= total`.
  2. For each record: convert `arrival_date` DD/MM/YYYY → YYYY-MM-DD.
  3. Upsert into Supabase `mandi_prices` table using the unique constraint (see schema below) — safe to re-run, no duplicates.
  4. Log per-state record counts. If any state returns 0, log a clear warning (don't fail silently).
  5. Wrap each API call in retry logic (3 attempts, exponential backoff) for transient failures.
- **Expected volume:** ~250–600 records/state/day → ~15–25 API calls total per run. Well within any rate limit.

---

## 4. Database — Supabase (Postgres)

**Why Supabase over flat JSON files (unlike the calendar API):** mandi prices are a daily-changing time series, not static yearly data. Flat files can't do efficient date-range/filter queries at scale. A real indexed DB is required here.

```sql
CREATE TABLE mandi_prices (
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

CREATE INDEX idx_state_commodity_date ON mandi_prices (state, commodity, arrival_date);
CREATE INDEX idx_market ON mandi_prices (market);
```

Use the **service_role key** in the backend/ingestion script (server-side only, never exposed to frontend). Use the **anon key** only if the frontend ever queries Supabase directly (it won't in v1 — frontend only talks to our own Express API).

---

## 5. API Design

All routes prefixed `/v1`. No API key required (open, like the calendar API). Rate-limited by IP (`express-rate-limit`, 100 req/15min per IP as a starting default).

| Endpoint | Required params | Optional params | Purpose |
|---|---|---|---|
| `GET /v1/states` | — | — | List the 5 supported states |
| `GET /v1/commodities` | — | `state` | List distinct commodities (optionally scoped to a state) |
| `GET /v1/markets` | `state` | — | List mandis in a state |
| `GET /v1/prices` | `state` OR `commodity` | `market`, `commodity`, `variety`, `date` | Latest prices matching filters |
| `GET /v1/prices/history` | `state`, `commodity` | `market`, `from`, `to` | Trend data over a date range. If `market` omitted, average `modal_price` across all markets in that state for each date. |

### Response envelope (success):
```json
{
  "success": true,
  "data": [ ... ],
  "meta": { "count": 42, "state": "Maharashtra", "commodity": "Onion" }
}
```

### Response envelope (error):
```json
{
  "success": false,
  "error": { "code": "MISSING_PARAM", "message": "state or commodity is required" }
}
```

### Validation rules:
- `/prices` returns `400` if neither `state` nor `commodity` is given (never return unbounded data).
- `date` params validated as real calendar dates, format `YYYY-MM-DD`.
- Unknown `state` value → `404` with list of valid states in the error message.

---

## 6. Repo Structure

```
mandi-price-api/
  backend/
    src/
      index.js              # Express app, route mounting, CORS, rate limit
      db.js                 # Supabase client init
      validators.js         # param validation helpers
      controllers/
        prices.js
        states.js
        commodities.js
        markets.js
    scripts/
      ingest.js              # daily pull + upsert script (called by GH Actions)
      states.config.js       # the 5 states, exact govt spellings
    .env.example             # SUPABASE_URL, SUPABASE_SERVICE_KEY, DATA_GOV_API_KEY
    package.json
  frontend/
    # same structure/pattern as the calendar-api frontend:
    # HomePage, PlaygroundPage, DocsPage, StatusPage
    # RegionSelector → reuse pattern but for State + Commodity dropdowns
    # JsonViewer, CodeSnippet, StatusBadge → reuse as-is
  .github/
    workflows/
      daily-ingest.yml       # cron: 0 15 * * * (UTC), runs scripts/ingest.js
  README.md
```

---

## 7. Deployment

- **Backend:** Render (free tier, same cold-start behavior as calendar API — reuse the same "waking up" UX pattern in frontend)
- **Frontend:** Vercel
- **DB:** Supabase (already created by user)
- **Ingestion:** GitHub Actions (not Render — avoids relying on a sleeping free-tier server for the cron)

---

## 8. MVP "Done" Definition

- [ ] All 5 endpoints working and deployed
- [ ] Daily ingestion running automatically via GitHub Actions, writing to Supabase
- [ ] At least 5 states populated, multiple days of history accumulated
- [ ] Frontend: Home page + Playground page minimum (Docs/Status can follow later)
- [ ] `/prices` and `/prices/history` both tested with real filter combinations
- [ ] Zero-record warning logging confirmed working (test by temporarily misspelling a state)

---

## 9. Exact Tech Stack (do not substitute)

**Backend:**
- Node.js 20.x, Express 4.x
- Packages: `express`, `cors`, `express-rate-limit`, `@supabase/supabase-js`, `dotenv`, `node-fetch` (or native `fetch`)

**Frontend:**
- React (Vite), same stack as the calendar-api frontend — not Next.js, not plain HTML
- Deployed to Vercel exactly as the calendar-api frontend was (same `vercel.json` SPA rewrite pattern)

### `backend/.env.example`
```
PORT=3000
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key_here
DATA_GOV_API_KEY=your_data_gov_api_key_here
```

### GitHub Actions secrets (set in repo Settings → Secrets → Actions)
- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`
- `DATA_GOV_API_KEY`

`daily-ingest.yml` reads these as `${{ secrets.SUPABASE_URL }}` etc. — never hardcoded in the workflow file or committed anywhere.

### `/prices/history` aggregation logic (when `market` is omitted)
```sql
SELECT arrival_date, AVG(modal_price) AS avg_modal_price
FROM mandi_prices
WHERE state = $1 AND commodity = $2 AND arrival_date BETWEEN $3 AND $4
GROUP BY arrival_date
ORDER BY arrival_date;
```
When `market` IS provided, skip the GROUP BY/AVG — return raw rows for that specific market instead.

---

## 10. Open Items Antigravity Should Flag Back (not resolved here)

- Confirm exact govt spelling for Uttar Pradesh, Punjab, Madhya Pradesh, Karnataka on first ingestion run (watch the warning logs).
- Confirm data.gov.in daily call quota doesn't get hit (unlikely at ~20 calls/day, but verify).
