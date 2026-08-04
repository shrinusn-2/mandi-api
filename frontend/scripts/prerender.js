import { preview } from 'vite';
import puppeteer from 'puppeteer';
import { mkdirSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { ROUTES } from '../src/routes.js';
import { SITE_URL } from '../src/config.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, '..', 'dist');

function writeSitemap() {
  const urls = ROUTES.map(({ path, changefreq, priority }) => `  <url>
    <loc>${SITE_URL}${path}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  writeFileSync(join(distDir, 'sitemap.xml'), xml);
  console.log('Generated sitemap.xml from route manifest');
}

async function prerenderRoute(browser, base, route) {
  const page = await browser.newPage();
  try {
    await page.goto(`${base}${route.slice(1)}`, { waitUntil: 'networkidle0', timeout: 30000 });
    // networkidle0 already means data fetches settled; this only waits out
    // any still-visible loading spinner rather than a blind fixed delay.
    await page.waitForFunction(() => !document.querySelector('.spin'), { timeout: 10000 }).catch(() => {});

    const html = await page.content();
    const outDir = route === '/' ? distDir : join(distDir, route.slice(1));
    mkdirSync(outDir, { recursive: true });
    writeFileSync(join(outDir, 'index.html'), html);

    console.log(`Prerendered ${route} -> ${join(outDir, 'index.html')}`);
  } finally {
    await page.close();
  }
}

async function main() {
  const server = await preview({ preview: { port: 4173, strictPort: true } });
  const base = server.resolvedUrls.local[0];

  const browser = await puppeteer.launch({ headless: true });

  try {
    // Sequential on purpose: running these concurrently in one Chromium
    // instance was observed to occasionally race react-helmet-async's
    // title/meta commit under CPU contention, capturing a stale <title>
    // for whichever route lost the race. Correctness over the modest
    // build-time saving here.
    for (const route of ROUTES) {
      await prerenderRoute(browser, base, route.path);
    }
    writeSitemap();
  } finally {
    await browser.close();
    await new Promise((resolve) => server.httpServer.close(resolve));
  }
}

main().catch((err) => {
  console.error('Prerender failed:', err);
  process.exit(1);
});
