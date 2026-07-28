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
│   │   ├── CustomSelect.jsx    # Searchable glassmorphism dropdown with search bar & checkmarks
│   │   ├── RegionSelector.jsx  # Searchable state selector dropdown
│   │   ├── CodeSnippet.jsx     # Multi-language code snippet generator (cURL, JS, Python, Go)
│   │   ├── AiSpecButton.jsx    # "Build with AI" prompt spec copy & .md download component
│   │   ├── JsonViewer.jsx      # Syntax-highlighted JSON payload viewer
│   │   └── PriceChart.jsx     # Chart.js line graph for price trend visualizer
│   ├── data/
│   │   └── aiSpec.js           # Static high-density LLM prompt specification string
│   ├── pages/
│   │   ├── HomePage.jsx        # Hero landing page with AI spec banner & live demo
│   │   ├── PlaygroundPage.jsx  # Cascading request console (State -> Market -> Commodity)
│   │   ├── DocsPage.jsx        # Complete API reference documentation with sidebar nav & AI spec
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

### `AiSpecButton.jsx` & `aiSpec.js`
- Banner component featured on `HomePage` and `DocsPage`.
- Contains a structured Markdown prompt specification optimized for LLMs (*ChatGPT, Claude, Gemini, Antigravity*).
- Features **"Copy Spec for AI"** (copies to clipboard) and **"Download .md"** (downloads `MANDI-API-SPEC.md`).

### `PlaygroundPage.jsx`
- **Cascading Selection Order**:
  1. **Step 1: Select State** (e.g. *Maharashtra*)
  2. **Step 2: Select Market / Mandi** (e.g. *Katol APMC* or *All Markets*)
  3. **Step 3: Select Commodity / Crop** (dynamically queried based on State AND selected Market)
- **Zero Empty Results**: Selecting a specific market automatically filters crops to **only those actually traded in that mandi**, guaranteeing 100% valid non-zero results.
- **Dual Visualizer**: Toggle tabs between **"Pretty JSON"** (`JsonViewer`) and **"Price Chart"** (`PriceChart`).

### `CustomSelect.jsx`
- Custom glassmorphism dropdown component with integrated real-time search input bar.
- Used for State, Market/Mandi, and Commodity/Crop selection.
- Features search filtering, sublabel/district badges, checkmark selection, and click-outside closing.

### `DocsPage.jsx`
- Complete API reference documentation with sticky sidebar section navigation (`Overview`, `states`, `commodities`, `markets`, `prices`, `history`, `errors`), parameter tables, syntax-highlighted code snippets, and `AiSpecButton`.

### `StatusBadge.jsx`
- Sends dynamic health check pings to `${API_BASE_URL}/health`.
- Measures roundtrip response latency (e.g. `API Live (142ms)`).
- Automatic warm-up timeout detection: If the backend container is asleep and takes >2.5 seconds to respond, it smoothly transitions to `Backend Sleeping (Waking up...)`.

### `CodeSnippet.jsx`
- Multi-language snippet generator for **cURL**, **JavaScript (fetch)**, **Python (requests)**, and **Go (net/http)**.
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
