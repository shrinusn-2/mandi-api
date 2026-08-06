# Mandi Price API — Frontend Architecture & Reference Guide

This document details the complete frontend application architecture, design system, component hierarchy, and user-facing features for the **Mandi Price API** developer portal.

---

## 1. Monorepo Location & Tech Stack

- **Directory**: `frontend/`
- **Framework**: React 18 + Vite 6
- **Routing**: `react-router-dom` (real per-page URLs: `/`, `/playground`, `/docs`, `/status`, `/blog`, `/blog/:slug`, plus a `*` 404 route)
- **SEO**: `react-helmet-async` for per-page metadata (including `og:site_name`) and JSON-LD structured data (`WebSite` + `Organization` + `SoftwareApplication` on the homepage, `BlogPosting` on blog posts), plus a Puppeteer-based build-time static-prerender step (`scripts/prerender.js`) and `public/llms.txt` for AI-agent discoverability
- **Styling**: Vanilla CSS (`src/index.css`) — an earthy/harvest "mandi rate-board" design system (slate-green base, turmeric-gold/rust accents) with custom CSS tokens
- **Icons**: `lucide-react`
- **Charts**: `chart.js` + `react-chartjs-2`
- **Fonts**: Big Shoulders Display (headings), IBM Plex Sans (body), JetBrains Mono (data/code)
- **Deployment Target**: Vercel (SPA routing via `vercel.json`; static files/prerendered routes are served before the SPA rewrite applies)

---

## 2. Directory Structure

```
frontend/
├── public/
├── scripts/
│   └── prerender.js            # Postbuild: prerenders each route to static HTML, generates sitemap.xml/robots.txt
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # Top nav; collapses to a hamburger menu below 720px (hamburger + StatusBadge share a `.nav-right-cluster` flex group so they render together, not centered)
│   │   ├── StatusBadge.jsx     # Live health checker & latency ping (with warm-up detection)
│   │   ├── CustomSelect.jsx    # Searchable dropdown with search bar & checkmarks
│   │   ├── RegionSelector.jsx  # Thin wrapper around CustomSelect, preset to the supported states list
│   │   ├── CodeSnippet.jsx     # Multi-language code snippet generator (cURL, JS, Python, Go)
│   │   ├── AiSpecButton.jsx    # "Build with AI" prompt spec copy & .md download component
│   │   ├── JsonViewer.jsx      # Syntax-highlighted JSON payload viewer
│   │   ├── PriceChart.jsx      # Chart.js line graph for price trend visualizer
│   │   └── Seo.jsx             # Shared <Helmet> wrapper: title/description/canonical/OG/Twitter/JSON-LD
│   ├── data/
│   │   └── aiSpec.js           # Static high-density LLM prompt specification string
│   ├── pages/
│   │   ├── HomePage.jsx        # Hero = live "rate board" widget fetching real prices, not a tagline
│   │   ├── PlaygroundPage.jsx  # High-density split console (no vertical scrolling)
│   │   ├── DocsPage.jsx        # Complete API reference documentation with IntersectionObserver ScrollSpy
│   │   ├── StatusPage.jsx      # System status & operational metrics dashboard
│   │   ├── NotFoundPage.jsx    # 404 page for the `*` route, marked noindex
│   │   └── blog/
│   │       ├── BlogIndexPage.jsx   # /blog — lists all posts from blogRoutes.js
│   │       ├── BlogPostPage.jsx    # /blog/:slug — looks up the post component by slug, renders via BlogPostLayout
│   │       ├── BlogPostLayout.jsx  # Shared chrome: Seo + BlogPosting JSON-LD + title/date wrapper
│   │       └── posts/              # One JSX file per article (no MDX dependency — plain component bodies)
│   ├── routes.js               # Single route manifest: path, nav label, SEO title/description, sitemap priority (4 core app routes)
│   ├── blogRoutes.js           # Same pattern as routes.js, JSX-free, for the blog index + posts (kept separate since posts are added independently of the core app routes)
│   ├── utils.js                # Shared helpers (e.g. formatIngestionTime)
│   ├── config.js               # API_BASE_URL / SITE_URL resolution — works under both Vite and plain Node (prerender.js)
│   ├── App.jsx                 # react-router <Routes> shell, built from routes.js
│   ├── main.jsx                # React DOM entry point (wraps App in BrowserRouter + HelmetProvider)
│   └── index.css               # Design system tokens, micro-animations & resets
├── vite.config.js              # Vite bundler & dev server proxy config
├── vercel.json                 # Vercel SPA rewrite rule (/index.html) — only applies when no static file matches
└── package.json                 # postbuild script runs scripts/prerender.js after `vite build`
```

---

## 3. Key Components & Specifications

### Routing & SEO (`routes.js`, `blogRoutes.js`, `Seo.jsx`, `scripts/prerender.js`)
- `routes.js` is the single source of truth for the 4 core app routes — path, nav label, SEO title/description, and sitemap `changefreq`/`priority`. `App.jsx` and `Navbar.jsx` both derive from it, so adding a route only means editing this one file.
- `Seo.jsx` is a shared `<Helmet>` wrapper each page calls with its title/description/path (and optional `structuredData`/`noindex`); collapses what used to be a repeated 10-line block per page. Also sets `og:site_name` on every page — added specifically because Google was displaying "Vercel" instead of "Mandi Price API" as the SERP site name (no `og:site_name` + no `Organization` entity for it to attribute the site to).
- `scripts/prerender.js` runs as an npm `postbuild` step after `vite build`: it launches a headless Chrome (via `puppeteer` locally, `@sparticuz/chromium` on Vercel — see §4), visits each route on a local `vite preview` server (now `ROUTES` + `BLOG_INDEX_ROUTE` + `BLOG_POSTS` combined), and writes the fully-rendered HTML to `dist/<route>/index.html` so crawlers get real content instead of an empty shell. It also generates `dist/sitemap.xml` and `dist/robots.txt` from the combined route list + `SITE_URL`. Each route prerenders independently (a single failure doesn't fail the build), and if Chrome can't launch at all, the script logs it and still ships the plain `vite build` SPA output rather than blocking the deploy.

### Blog (`blogRoutes.js`, `pages/blog/`)
- Added to target real search terms the site wasn't ranking for at all (it previously only surfaced for its own exact name). `blogRoutes.js` mirrors `routes.js`'s JSX-free pattern so it can be imported the same way by `prerender.js` under plain Node.
- 3 launch articles (`pages/blog/posts/`): `agmarknet-api-alternative`, `apmc-mandi-price-data-guide`, `data-gov-in-vs-mandi-api` — each targets specific researched keywords and links to `/docs` + `/playground`.
- `BlogPostPage.jsx` maps `:slug` → post component via a plain object lookup (`POST_COMPONENTS`) rather than dynamic imports, since there are only a handful of posts.
- One article was also cross-posted to dev.to with `canonical_url` pointing back here (no duplicate-content penalty), and the site was submitted to `public-apis/public-apis` under the Government category for a backlink.

### `DocsPage.jsx`
- **IntersectionObserver ScrollSpy**: Real-time active section tracking as the user scrolls down the page. The sticky sidebar navigation tab (`Overview`, `states`, `commodities`, `markets`, `prices`, `history`, `errors`) automatically updates and highlights based on viewport visibility.

### `PlaygroundPage.jsx`
- **High-Density Split Console**:
  - **Left Panel (360px)**: Compact Request Builder controls (Step 1 State, Step 2 Market, Step 3 Commodity, Execute button).
  - **Right Panel (Flex: 1)**: Integrated Output Console featuring **Pretty JSON**, **Price Chart**, and **Code Generator** tabs side-by-side.
- **Zero Scrolling**: Request controls, JSON response, and price charts fit into a single laptop screen fold.

### `CustomSelect.jsx`
- Custom dropdown component with integrated real-time search input bar.
- Used for State, Market/Mandi, and Commodity/Crop selection.
- Features search filtering, sublabel/district badges, checkmark selection, and click-outside closing.
- `RegionSelector.jsx` is just a preset wrapper around this component (label + `SUPPORTED_STATES` + `MapPin` icon) rather than a separate dropdown implementation.

### `AiSpecButton.jsx` & `aiSpec.js`
- Banner component featured on `HomePage` and `DocsPage`.
- Contains a structured Markdown prompt specification optimized for LLMs (*ChatGPT, Claude, Gemini, Antigravity*).
- Features **"Copy Spec for AI"** (copies to clipboard) and **"Download .md"** (downloads `MANDI-API-SPEC.md`).

### `StatusBadge.jsx`
- Sends dynamic health check pings to `${API_BASE_URL}/health`.
- Measures roundtrip response latency (e.g. `API Live (142ms)`).
- Automatic warm-up timeout detection: If the backend container is asleep and takes >2.5 seconds to respond, it smoothly transitions to `Backend Sleeping (Waking up...)`.

### `CodeSnippet.jsx`
- Multi-language snippet generator for **cURL**, **JavaScript (fetch)**, **Python (requests)**, and **Go (net/http)**.
- One-click copy to clipboard with feedback animation.

### Mobile Layout Fixes (index.css, Navbar.jsx, HomePage.jsx, DocsPage.jsx)
- Verified live at a 412px viewport (Chrome iframe probe measuring `scrollWidth`) that the site required pinch-zoom to read on phones. Root causes and fixes, in case similar layout code is added elsewhere:
  - **`.nav-container`** is `display:flex; justify-content:space-between`. Below 720px `.nav-links` disappears, leaving 3 flex items (logo, hamburger, status pill) — `space-between` centered the hamburger instead of pairing it with the pill. Fixed by wrapping the hamburger button + `<StatusBadge/>` in `.nav-right-cluster` so there are always exactly 2 groups.
  - **`.rate-board-row`** (HomePage rate board): the commodity/market text wrapper had `minWidth:0` but no explicit shrinkable `flex-basis`, so long real market names rendered at full content width and blew out the page instead of ellipsizing (the ellipsis CSS on `.rate-board-commodity`/`.rate-board-market` was already correct, just never got a bounded parent). Fixed by adding `flex: '1 1 0%'` alongside `minWidth: 0`.
  - **`.sidebar-grid` / `.console-grid`** (Docs sidebar, Playground console): the `@media (max-width:768px)` override set `grid-template-columns: 1fr`, but CSS Grid's implicit auto-min-size still let wide content (the Docs scroll-spy nav) force the column past the viewport. Fixed with `minmax(0, 1fr)` + `min-width:0` on the grid children — this is the standard fix for that CSS Grid gotcha.
  - Docs' two parameter `<table>`s (`/v1/commodities`, `/v1/markets`) had no horizontal-scroll wrapper, unlike the blog post tables (`pages/blog/posts/DataGovInVsMandiApi.jsx`). Wrapped both in `overflowX:auto` divs as a preventive measure.
- Desktop (≥768px/720px) is unaffected by all of the above — only the mobile media-query paths changed.

---

## 4. Environment Configuration & Connection to Backend

- **Base URL Resolution** (`src/config.js`):
  - Local Development: Defaults to `http://localhost:3000`.
  - Production (Vercel): Reads `VITE_API_URL` environment variable (e.g. `https://mandi-api.onrender.com`).
  - `SITE_URL` works the same way via `VITE_SITE_URL` (e.g. `https://mandi-api.vercel.app`) — used for canonical tags, OG tags, `sitemap.xml`, and `robots.txt`. `config.js` checks both `import.meta.env` (Vite) and `process.env` (plain Node), since `scripts/prerender.js` imports it outside the Vite pipeline.
- **SPA Routing Rewrite** (`vercel.json`):
  ```json
  {
    "rewrites": [
      { "source": "/(.*)", "destination": "/index.html" }
    ]
  }
  ```
  Static files (including the prerendered `dist/<route>/index.html` files) are served before this rewrite runs — confirmed against Vercel's routing precedence — so this rewrite only acts as the SPA fallback for paths without a prerendered snapshot.
- **Prerendering on Vercel**: Vercel's build container is missing the shared libraries (`libnspr4.so` etc.) puppeteer's default bundled Chrome needs. `scripts/prerender.js` detects `process.env.VERCEL` and uses `@sparticuz/chromium` (a Chrome build made for serverless/build containers) in that case; local dev keeps using puppeteer's own Chrome unchanged.
- **Google Search Console verification**: `public/google<id>.html` is the GSC ownership-verification file (static, served as-is at the site root by Vercel) — required once to add the site to Search Console and submit `sitemap.xml`. Not app functionality; safe to ignore/leave in place.
