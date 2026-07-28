# Mandi Price API — Frontend Architecture & Reference Guide

This document details the complete frontend application architecture, design system, component hierarchy, and user-facing features for the **Mandi Price API** developer portal.

---

## 1. Monorepo Location & Tech Stack

- **Directory**: `frontend/`
- **Framework**: React 18 + Vite 6
- **Styling**: Vanilla CSS (`src/index.css`) dark-mode design system with glassmorphism effects and custom CSS tokens
- **Icons**: `lucide-react`
- **Charts**: `chart.js` + `react-chartjs-2`
- **Deployment Target**: Vercel (SPA routing via `vercel.json`)

---

## 2. Directory Structure

```
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # Top navigation header & brand logo
│   │   ├── StatusBadge.jsx     # Live health checker & latency ping (with warm-up detection)
│   │   ├── RegionSelector.jsx  # Searchable autocomplete dropdown for 5 Indian states
│   │   ├── CodeSnippet.jsx     # Multi-language code snippet generator (cURL, JS, Python, Go)
│   │   ├── JsonViewer.jsx      # Syntax-highlighted JSON payload viewer
│   │   └── PriceChart.jsx     # Chart.js line graph for price trend visualizer
│   ├── pages/
│   │   ├── HomePage.jsx        # Hero landing page, quick start, interactive live demo
│   │   ├── PlaygroundPage.jsx  # Interactive request console with dynamic backend dropdowns
│   │   ├── DocsPage.jsx        # Complete API reference documentation with sidebar nav
│   │   └── StatusPage.jsx      # System status & operational metrics dashboard
│   ├── config.js               # Dynamic base URL resolution (VITE_API_URL || localhost:3000)
│   ├── App.jsx                 # Main SPA view switcher shell
│   ├── main.jsx                # React DOM entry point
│   └── index.css               # Design system tokens, micro-animations & resets
├── vite.config.js              # Vite bundler & dev server proxy config
├── vercel.json                 # Vercel SPA rewrite rule (/index.html)
└── package.json
```

---

## 3. Key Components & Specifications

### `Navbar.jsx`
- Persistent top navigation header holding logo, interactive page switchers (`Overview`, `Playground`, `Docs`, `Status`), and `StatusBadge`.

### `PlaygroundPage.jsx`
- Terminal-style interactive API request builder console.
- **Dynamic Backend Dropdowns**:
  - Automatically queries `GET /v1/commodities?state=<SelectedState>` and `GET /v1/markets?state=<SelectedState>` when the state changes.
  - Dynamically populates selectable crop options (*Onion, Wheat, Potato, etc.*) and APMC mandis (*Nagpur APMC, Pune APMC, etc.*) — **0 text typing required, 0 spelling mistakes**.
- **Dual Visualizer**: Toggle tabs between **"Pretty JSON"** (`JsonViewer`) and **"Price Chart"** (`PriceChart`).

### `DocsPage.jsx`
- Complete API reference documentation with sticky sidebar section navigation (`Overview`, `states`, `commodities`, `markets`, `prices`, `history`, `errors`), parameter tables, and syntax-highlighted code snippets.

### `StatusBadge.jsx`
- Sends dynamic health check pings to `${API_BASE_URL}/health`.
- Measures roundtrip response latency (e.g. `API Live (142ms)`).
- Automatic warm-up timeout detection: If the backend container is asleep and takes >2.5 seconds to respond, it smoothly transitions to `Backend Sleeping (Waking up...)`.

### `RegionSelector.jsx`
- Searchable autocomplete dropdown for the 5 supported Indian states (*Maharashtra, Uttar Pradesh, Punjab, Madhya Pradesh, Karnataka*).
- Instant search filtering, click-outside handling, and active item checkmark styling.

### `CodeSnippet.jsx`
- Multi-language snippet generator for **cURL**, **JavaScript (fetch)**, **Python (requests)**, and **Go (net/http)**.
- Robust prop fallback (`path || url`) preventing undefined property errors.
- One-click copy to clipboard with feedback animation.

---

## 4. Environment Configuration & Connection to Backend

- **Base URL Resolution** (`src/config.js`):
  - Local Development: Defaults to `http://localhost:3000`.
  - Production (Vercel): Reads `VITE_API_URL` environment variable (e.g. `https://mandi-api.onrender.com`).
- **SPA Routing Rewrite** (`vercel.json`):
  ```json
  {
    "rewrites": [
      { "source": "/(.*)", "destination": "/index.html" }
    ]
  }
  ```
