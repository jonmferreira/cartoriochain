const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE_URL = 'http://localhost:5176';
const OUTPUT_DIR = path.join(__dirname, 'output');
const FFMPEG = 'C:\\Users\\domai\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-9.0.2-full_build\\bin\\ffmpeg.exe';

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function smoothScroll(page, target) {
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'smooth' }), target);
  await sleep(800);
}

async function recordDemo() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const browser = await chromium.launch({
    headless: false,
    args: ['--window-size=1280,720', '--window-position=0,0', '--disable-blink-features=AutomationControlled'],
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    recordVideo: { dir: OUTPUT_DIR, size: { width: 1280, height: 720 } },
  });

  const page = await context.newPage();

  // ── Cena 1: Home — Hero (15s) ─────────────────────────────────────
  console.log('[1/7] Home — hero...');
  await page.goto(`${BASE_URL}/`);
  await sleep(3000); // animações carregam

  await smoothScroll(page, 300);
  await sleep(2500); // problema / solução

  await smoothScroll(page, 700);
  await sleep(2500); // como funciona

  await smoothScroll(page, 1200);
  await sleep(2500); // para quem

  await smoothScroll(page, 1700);
  await sleep(2500); // CTA final

  await smoothScroll(page, 0);
  await sleep(1500);

  // ── Cena 2: Registrar — Step 1 (12s) ─────────────────────────────
  console.log('[2/7] Registrar — passo 1...');
  await page.goto(`${BASE_URL}/registrar?demo=mcmv`);
  await sleep(3000);

  // Mostra upload area
  await sleep(4000);

  // Click avançar
  const btnAvancar = page.locator('button:has-text("Avançar")');
  await btnAvancar.click();
  await sleep(4000);

  // ── Cena 3: Registrar — Step 2 — ZCash (18s) ─────────────────────
  console.log('[3/7] Registrar — passo 2 ZCash...');
  await sleep(3000); // formulário carregado

  // Abre painel ZCash
  const btnVK = page.locator('button.vk-toggle, button:has-text("ZCash"), button:has-text("ViewKey")').first();
  const vkVisible = await btnVK.isVisible().catch(() => false);
  if (vkVisible) {
    await btnVK.click();
    await sleep(5000); // mostra campo cifrado
    await btnVK.click(); // fecha
    await sleep(2000);
  }

  await sleep(3000); // pausa antes de submeter

  // ── Cena 4: Loading animation (20s) ──────────────────────────────
  console.log('[4/7] Submetendo — loading...');
  const btnAutenticar = page.locator('button:has-text("Autenticar")');
  await btnAutenticar.click();
  await sleep(18000); // aguarda animação dos 4 steps + chamada API

  // ── Cena 5: Resultado — Certificado (20s) ────────────────────────
  console.log('[5/7] Certificado...');
  await sleep(3000);

  await smoothScroll(page, 500);
  await sleep(3000);

  // Expande detalhes técnicos
  const btnDetalhes = page.locator('button.tech-toggle').first();
  const detalhesVisible = await btnDetalhes.isVisible().catch(() => false);
  if (detalhesVisible) {
    await btnDetalhes.click();
    await sleep(5000); // mostra hashes, TX ID
    await btnDetalhes.click();
    await sleep(2000);
  }

  await sleep(4000);

  // ── Cena 6: Verificar documento (25s) ────────────────────────────
  console.log('[6/7] Verificar...');
  await page.goto(`${BASE_URL}/verificar`);
  await sleep(3000);

  const inputDoc = page.locator('input[placeholder*="ID"], input[placeholder*="Cole"]').first();
  const inputVisible = await inputDoc.isVisible().catch(() => false);
  if (inputVisible) {
    await inputDoc.click();
    await sleep(500);
    await inputDoc.type('mcmv-escritura-demo-2024', { delay: 60 });
    await sleep(2000);

    const btnVerificar = page.locator('button:has-text("Verificar")').first();
    await btnVerificar.click();
    await sleep(6000); // aguarda busca + resultado

    await smoothScroll(page, 400);
    await sleep(5000); // mostra certificado de verificação

    // Expande detalhes técnicos
    const btnDetalhesV = page.locator('button.tech-toggle').first();
    const dvVisible = await btnDetalhesV.isVisible().catch(() => false);
    if (dvVisible) {
      await btnDetalhesV.click();
      await sleep(4000);
    }
  }

  // ── Cena 7: CTA final — Home (10s) ───────────────────────────────
  console.log('[7/7] Volta à home...');
  await page.goto(`${BASE_URL}/`);
  await sleep(4000);

  await smoothScroll(page, 0);
  await sleep(5000);

  // ── Salva ─────────────────────────────────────────────────────────
  await context.close();
  await browser.close();

  const files = fs.readdirSync(OUTPUT_DIR).filter(f => f.endsWith('.webm'));
  if (files.length === 0) {
    console.log('⚠  Nenhum vídeo encontrado');
    return;
  }

  const webm = path.join(OUTPUT_DIR, files[files.length - 1]);
  const mp4  = webm.replace('.webm', '.mp4');
  console.log(`\nWebM: ${webm}`);

  const { execSync } = require('child_process');
  try {
    execSync(`"${FFMPEG}" -y -i "${webm}" -c:v libx264 -preset fast -crf 22 -pix_fmt yuv420p "${mp4}"`, { stdio: 'inherit' });
    console.log(`\n✅ MP4: ${mp4}`);
  } catch {
    console.log(`\n⚠  Converter manualmente:\n   ffmpeg -i "${webm}" -c:v libx264 "${mp4}"`);
  }
}

recordDemo().catch(err => {
  console.error('Erro:', err);
  process.exit(1);
});
