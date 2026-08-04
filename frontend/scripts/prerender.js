import { preview } from 'vite';
import puppeteer from 'puppeteer';
import { mkdirSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, '..', 'dist');

const ROUTES = ['/', '/playground', '/docs', '/status'];

async function main() {
  const server = await preview({ preview: { port: 4173, strictPort: true } });
  const base = server.resolvedUrls.local[0];

  const browser = await puppeteer.launch({ headless: true });

  try {
    for (const route of ROUTES) {
      const page = await browser.newPage();
      await page.goto(`${base}${route.slice(1)}`, { waitUntil: 'networkidle0', timeout: 30000 });
      await new Promise((resolve) => setTimeout(resolve, 300));

      const html = await page.content();
      const outDir = route === '/' ? distDir : join(distDir, route.slice(1));
      mkdirSync(outDir, { recursive: true });
      writeFileSync(join(outDir, 'index.html'), html);

      console.log(`Prerendered ${route} -> ${join(outDir, 'index.html')}`);
      await page.close();
    }
  } finally {
    await browser.close();
    await new Promise((resolve) => server.httpServer.close(resolve));
  }
}

main().catch((err) => {
  console.error('Prerender failed:', err);
  process.exit(1);
});
