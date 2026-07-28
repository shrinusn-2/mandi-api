/**
 * Mandi Price API — High-Density Markdown Spec for LLMs & AI Coding Assistants
 * Hand this prompt to ChatGPT, Claude, Gemini, or Antigravity to generate integration code.
 */
export const MANDI_API_LLM_SPEC = `# Mandi Price API — AI Integration & Developer Specification

The Mandi Price API is a free, open, keyless REST API serving daily agricultural mandi (wholesale market) prices for Indian states, sourced from data.gov.in.

---

## Base URL & Authentication

- **Base URL**: https://mandi-api.onrender.com/v1
- **Authentication**: None required (Keyless & Open)
- **Rate Limit**: 100 requests per 15 minutes per IP address
- **Format**: Standard JSON envelopes

---

## Supported Indian States (v1)

1. Maharashtra
2. Uttar Pradesh
3. Punjab
4. Madhya Pradesh
5. Karnataka

---

## API Endpoints Reference

### 1. List Supported States
- **Endpoint**: GET /v1/states
- **Parameters**: None
- **Response**: Array of supported state strings

### 2. List Commodities / Crops
- **Endpoint**: GET /v1/commodities
- **Parameters**:
  - \`state\` (optional): Filter crops by state name (e.g., Maharashtra)
  - \`market\` (optional): Filter crops by specific APMC market (e.g., Katol APMC)
- **Response**: Array of distinct commodity strings

### 3. List Markets / Mandis
- **Endpoint**: GET /v1/markets
- **Parameters**:
  - \`state\` (required): State name (e.g., Uttar Pradesh)
- **Response**: Array of market objects \`[{ "market": "Aliganj APMC", "district": "Etah" }]\`

### 4. Fetch Daily Mandi Prices
- **Endpoint**: GET /v1/prices
- **Parameters**:
  - \`state\` (required if commodity omitted): State name
  - \`commodity\` (required if state omitted): Crop name (e.g., Onion, Wheat, Potato)
  - \`market\` (optional): Specific APMC mandi name
  - \`variety\` (optional): Crop variety
  - \`date\` (optional): Date in YYYY-MM-DD format
- **Response**: Array of price records with min_price, max_price, modal_price (₹/Quintal)

### 5. Fetch Price History & Trends
- **Endpoint**: GET /v1/prices/history
- **Parameters**:
  - \`state\` (required): State name
  - \`commodity\` (required): Crop name
  - \`market\` (optional): Specific market name (if omitted, aggregates average modal prices across the state)
  - \`from\` (optional): Start date YYYY-MM-DD
  - \`to\` (optional): End date YYYY-MM-DD
- **Response**: Time-series array of daily price averages or raw market trend rows

---

## Standard JSON Response Envelope

\`\`\`json
{
  "success": true,
  "data": [
    {
      "state": "Maharashtra",
      "district": "Nagpur",
      "market": "Nagpur APMC",
      "commodity": "Onion",
      "variety": "Local",
      "grade": "FAQ",
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
\`\`\`
`;
