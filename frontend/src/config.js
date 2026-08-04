/**
 * Mandi Price API Configuration
 * Dynamically resolves base URL from VITE_API_URL or defaults to localhost in dev
 */
// import.meta.env is populated when this runs through Vite (dev/build).
// scripts/prerender.js imports this file under plain Node, where that's
// undefined but process.env still carries VITE_-prefixed vars set by the
// deploy platform (e.g. Vercel) — check both so the value is consistent
// between the bundled app and the postbuild prerender/sitemap generation.
const viteEnv = (typeof import.meta !== 'undefined' && import.meta.env) || {};
const nodeEnv = (typeof process !== 'undefined' && process.env) || {};

export const API_BASE_URL = viteEnv.VITE_API_URL || nodeEnv.VITE_API_URL || 'http://localhost:3000';

// TODO: replace with the real production domain before deploying
export const SITE_URL = viteEnv.VITE_SITE_URL || nodeEnv.VITE_SITE_URL || 'https://mandi-api.example.com';

export const SUPPORTED_STATES = [
  'Maharashtra',
  'Uttar Pradesh',
  'Punjab',
  'Madhya Pradesh',
  'Karnataka'
];
