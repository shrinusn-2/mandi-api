-- Mandi Price API Supabase Schema Setup
-- Run this script in your Supabase SQL Editor (https://supabase.com/dashboard)

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

-- Disable Row Level Security (RLS) for open API insert/upsert & select access
ALTER TABLE mandi_prices DISABLE ROW LEVEL SECURITY;
