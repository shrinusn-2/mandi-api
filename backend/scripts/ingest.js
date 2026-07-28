require('dotenv').config();
const { supabase } = require('../src/db');
const { SUPPORTED_STATES } = require('./states.config');

const API_KEY = process.env.DATA_GOV_API_KEY || '579b464db66ec23bdd000001f24daa775e784d04427814ae73877b05';
const RESOURCE_ID = '9ef84268-d588-465a-a308-a864a43d0070';
const BASE_URL = `https://api.data.gov.in/resource/${RESOURCE_ID}`;

function convertDate(dateStr) {
  if (!dateStr) return null;
  const parts = dateStr.trim().split('/');
  if (parts.length === 3) {
    const [day, month, year] = parts;
    return `${year.padStart(4, '20')}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  return dateStr;
}

async function fetchWithRetry(url, maxRetries = 5) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status} ${res.statusText}`);
      }
      return await res.json();
    } catch (err) {
      if (attempt === maxRetries) throw err;
      const delay = Math.pow(2, attempt) * 1500;
      console.warn(`Attempt ${attempt} failed for state query: ${err.message}. Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

function deduplicateRecords(records) {
  const map = new Map();
  records.forEach(r => {
    const key = `${r.state}|${r.market}|${r.commodity}|${r.variety}|${r.arrival_date}`.toLowerCase();
    map.set(key, r);
  });
  return Array.from(map.values());
}

async function ingestState(state) {
  console.log(`\n========================================`);
  console.log(`Fetching Mandi prices for state: "${state}"...`);
  console.log(`========================================`);

  const limit = 100;
  let offset = 0;
  let totalRecords = 0;
  let fetchedCount = 0;
  let upsertedCount = 0;
  let tableMissingError = false;

  do {
    const url = `${BASE_URL}?api-key=${API_KEY}&format=json&limit=${limit}&offset=${offset}&filters[state.keyword]=${encodeURIComponent(state)}`;
    const data = await fetchWithRetry(url);

    if (offset === 0) {
      totalRecords = data.total || 0;
      console.log(`Total reported records for ${state}: ${totalRecords}`);
    }

    const records = data.records || [];
    if (records.length === 0) break;

    fetchedCount += records.length;

    const transformed = records.map(r => ({
      state: r.state || state,
      district: r.district || 'Unknown',
      market: r.market || 'Unknown',
      commodity: r.commodity || 'Unknown',
      variety: r.variety || 'Other',
      grade: r.grade || 'Local',
      arrival_date: convertDate(r.arrival_date),
      min_price: r.min_price !== undefined && r.min_price !== null ? parseFloat(r.min_price) : null,
      max_price: r.max_price !== undefined && r.max_price !== null ? parseFloat(r.max_price) : null,
      modal_price: r.modal_price !== undefined && r.modal_price !== null ? parseFloat(r.modal_price) : null,
      fetched_at: new Date().toISOString()
    })).filter(r => r.arrival_date);

    const uniqueBatch = deduplicateRecords(transformed);

    if (uniqueBatch.length > 0) {
      const { data: upsertData, error } = await supabase
        .from('mandi_prices')
        .upsert(uniqueBatch, {
          onConflict: 'state,market,commodity,variety,arrival_date',
          ignoreDuplicates: false
        });

      if (error) {
        if (error.message.includes('Could not find the table') || error.code === 'PGRST205' || error.message.includes('does not exist')) {
          tableMissingError = true;
          console.error(`\n❌ TABLE MISSING ERROR: The Supabase table "mandi_prices" does not exist in your database.`);
          console.error(`👉 ACTION REQUIRED: Run backend/schema.sql in your Supabase SQL Editor.`);
          break;
        } else {
          console.error(`❌ Error upserting records for ${state}:`, error.message);
        }
      } else {
        upsertedCount += uniqueBatch.length;
      }
    }

    offset += limit;
    // Pacing delay (400ms) between pagination calls to stay under government burst limits
    await new Promise(resolve => setTimeout(resolve, 400));
  } while (offset < totalRecords && !tableMissingError);

  if (fetchedCount === 0) {
    console.warn(`\n⚠️ WARNING: State "${state}" returned 0 records on this ingestion run! Please check spelling on data.gov.in if this persists.\n`);
  } else {
    console.log(`✅ Processed state "${state}": ${fetchedCount} records fetched, ${upsertedCount} records upserted.`);
  }

  return { state, fetchedCount, upsertedCount, tableMissingError };
}

async function runIngestion() {
  console.log(`Starting Daily Mandi Price Ingestion at ${new Date().toISOString()}...`);
  const summary = [];

  for (const state of SUPPORTED_STATES) {
    try {
      const res = await ingestState(state);
      summary.push(res);
      if (res.tableMissingError) break;
    } catch (err) {
      console.error(`❌ Ingestion failed for state "${state}":`, err.message);
      summary.push({ state, fetchedCount: 0, upsertedCount: 0, error: err.message });
    }
  }

  console.log(`\n========================================`);
  console.log(`INGESTION COMPLETE SUMMARY:`);
  console.log(`========================================`);
  console.table(summary);
}

runIngestion();
