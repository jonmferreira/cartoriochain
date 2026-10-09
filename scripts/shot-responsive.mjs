/**
 * Screenshots responsivos (375px) das páginas principais para achar quebras de layout.
 * Uso: node shot-responsive.mjs [baseURL]   (default: prod pages.dev)
 * Requer o Chromium do Playwright (já instalado em web/).
 */
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const BASE = process.argv[2] || 'https://cartoriochain.pages.dev';
const OUT = 'scripts/.shots';
const pages = [
  ['home', '/'],
  ['registrar', '/registrar?demo=mcmv'],
  ['verificar', '/verificar'],
  ['servicos', '/servicos'],
];

mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 375, height: 812 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();

for (const [name, path] of pages) {
  await page.goto(BASE + path, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(600);
  // Detecta overflow horizontal (sinal de quebra em mobile)
  const overflow = await page.evaluate(() => {
    const de = document.documentElement;
    return { scrollW: de.scrollWidth, clientW: de.clientWidth, overflow: de.scrollWidth - de.clientWidth };
  });
  await page.screenshot({ path: `${OUT}/375-${name}.png`, fullPage: true });
  console.log(`${name.padEnd(12)} overflow-x: ${overflow.overflow}px (scroll ${overflow.scrollW} / client ${overflow.clientW})`);
}

await browser.close();
console.log('shots em', OUT);
