# Mandi Price API — Future Enhancement Plans & Retention Policy

This document outlines planned future features, data retention policies, and optimization strategies for the **Mandi Price API**.

---

## 1. Automated 1-Year Rolling Data Retention Policy

### Problem
Without auto-purging, daily time-series data grows indefinitely (~3,500 rows/day = ~300 MB/year). While the Supabase Free Tier accommodates ~2 years of data (500 MB limit), long-term growth will eventually hit storage limits.

### Solution
Implement an automated 1-year rolling retention policy at the end of every daily ingestion run in `backend/scripts/ingest.js`:

```sql
DELETE FROM mandi_prices 
WHERE arrival_date < (CURRENT_DATE - INTERVAL '365 days');
```

### Benefits
- **Perpetual Free Tier Compliance**: Storage space will plateau at **~250 MB max** forever.
- **Zero Overhead**: Automatically runs during off-peak daily ingestion (15:00 UTC / 8:30 PM IST).
- **Fast Query Performance**: Keeps database indexes lightweight and optimized.

---

## 2. Additional Future Enhancements

### A. State Expansion (v2)
- Expand coverage to additional agricultural states: *Gujarat, Rajasthan, Tamil Nadu, Andhra Pradesh, Haryana*.

### B. Bulk Export & Download Endpoints
- Add `GET /v1/export/csv` and `GET /v1/export/json` endpoints allowing researchers to download state-wide crop datasets in bulk.

### C. In-Memory Query Caching
- Implement in-memory TTL caching (e.g. Node-Cache or Redis) for static endpoints (`/v1/states`, `/v1/commodities`, `/v1/markets`) to deliver sub-10ms response times.
