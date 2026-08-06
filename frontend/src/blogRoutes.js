// Plain-data blog post manifest — mirrors routes.js on purpose (same rationale:
// scripts/prerender.js imports this under plain Node, so it must stay free of
// JSX/component imports). App.jsx/BlogIndexPage.jsx map slugs to their actual
// JSX bodies separately in pages/blog/posts/.
export const BLOG_INDEX_ROUTE = {
  path: '/blog',
  navLabel: 'Blog',
  title: 'Blog — Mandi & APMC Market Data Guides | Mandi Price API',
  description: 'Guides on Indian mandi/APMC price data, Agmarknet, and data.gov.in — for developers building with agricultural market data.',
  changefreq: 'weekly',
  priority: '0.7'
};

export const BLOG_POSTS = [
  {
    path: '/blog/agmarknet-api-alternative',
    title: 'Agmarknet API Alternative: A Free, Keyless Way to Get Mandi Prices in India',
    description: 'Agmarknet and data.gov.in require a registration key and have inconsistent fields. Here is a free, keyless alternative for daily Indian mandi price data.',
    date: '2026-08-06',
    keywords: ['agmarknet api alternative', 'free agmarknet api', 'mandi price api'],
    changefreq: 'monthly',
    priority: '0.6'
  },
  {
    path: '/blog/apmc-mandi-price-data-guide',
    title: "APMC Mandi Price Data in India: A Developer's Guide (2026)",
    description: 'What APMC mandi price data actually is, which states and commodities are covered, and how to query it programmatically — a complete reference for developers.',
    date: '2026-08-06',
    keywords: ['apmc price data api', 'apmc mandi price api india', 'mandi price data'],
    changefreq: 'monthly',
    priority: '0.6'
  },
  {
    path: '/blog/data-gov-in-vs-mandi-api',
    title: 'data.gov.in Mandi Price API vs. a Simpler Alternative: A Side-by-Side Guide',
    description: 'Comparing the official data.gov.in mandi price API (API key, rate limits, inconsistent fields) against a keyless alternative, with real request/response examples.',
    date: '2026-08-06',
    keywords: ['data.gov.in mandi price api key', 'wholesale crop price api india'],
    changefreq: 'monthly',
    priority: '0.6'
  }
];
