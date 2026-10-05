const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

// Requer dev server local rodando: cd web && npm run dev
// Para usar producao: https://cartoriochain-web-privacy-week.dom-ai-jonathan.workers.dev
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
    args: [
      '--window-size=1920,1080',
      '--window-position=0,0',
      '--start-fullscreen',
      '--disable-blink-features=AutomationControlled',
    ],
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: { dir: OUTPUT_DIR, size: { width: 1920, height: 1080 } },
    permissions: ['clipboard-read', 'clipboard-write'],
  });

  const page = await context.newPage();

  // Oculta scrollbar em todas as páginas (sem afetar scroll funcional)
  await page.addInitScript(() => {
    const style = document.createElement('style');
    style.textContent = '::-webkit-scrollbar { display: none !important; } * { scrollbar-width: none !important; }';
    document.head.appendChild(style);
  });

  // ── Cena 1: Home — problema e solução (8s) ────────────────────────
  console.log('[1/6] Home...');
  await page.goto(`${BASE_URL}/`);
  await sleep(1500); // hero visível

  await smoothScroll(page, 400);
  await sleep(1500); // seção problema

  await smoothScroll(page, 800);
  await sleep(1500); // comparativo R$5 vs R$2.400

  await smoothScroll(page, 1200);
  await sleep(1000); // mais conteúdo

  await smoothScroll(page, 0);
  await sleep(1000);

  // ── Cena 2: Registrar — Step 1 upload (4s) ────────────────────────
  console.log('[2/6] Step 1 — upload...');
  await page.goto(`${BASE_URL}/registrar?demo=mcmv`);
  await sleep(1500); // arquivo pré-carregado visível

  await page.locator('button:has-text("Avançar")').click();

  // ── Cena 3: Step 2 — ZCash ViewKey (foco da trilha) (20s) ────────
  console.log('[3/6] Step 2 — ZCash ViewKey...');

  // Aguarda step 2 carregar antes de tentar clicar
  await page.waitForSelector('text=Tipo do documento', { timeout: 10000 });
  await sleep(2000); // pausa para gravação

  // Abre painel Privacidade avançada (ZCash ViewKey)
  const btnPriv = page.locator('button:has-text("Privacidade avançada")');
  await btnPriv.waitFor({ state: 'visible', timeout: 10000 });
  await btnPriv.click();
  await sleep(1500);

  // Pausa longa mostrando o campo ViewKey cifrado — ponto central ZCash
  await sleep(7000);

  // Fecha painel
  await btnPriv.click();
  await sleep(1500);

  // Avança para step 3 (PIX)
  await page.locator('button:has-text("Avançar")').click();

  // ── Cena 4: Step 3 — PIX (6s) ────────────────────────────────────
  console.log('[4/6] Step 3 — PIX...');
  await page.waitForSelector('text=Taxa de autenticação', { timeout: 10000 });
  await sleep(2500); // código PIX visível

  await page.locator('button:has-text("Já paguei")').click();
  await sleep(1000);

  // ── Cena 5: Step 4 — ZK proof sendo gerado (20s) ─────────────────
  console.log('[5/6] Loading — ZK proof...');
  await sleep(3000); // "Confirmando pagamento" → "Autenticando"
  await sleep(5000); // "Gerando impressão digital SHA-256"
  await sleep(5000); // "Gerando prova ZK (Noir UltraHonk)"
  await sleep(5000); // "Registrando na Solana" + Irys
  // Aguarda resultado (pode demorar até 15s na API real)
  try {
    await page.waitForSelector('text=Documento autenticado', { timeout: 20000 });
  } catch {
    // API pode retornar erro em DEMO_MODE — continua o vídeo
  }
  await sleep(2000);

  // ── Cena 6: Verificar (22s) ───────────────────────────────────────
  console.log('[6/6] Verificar...');

  // Tenta capturar o docId do store Pinia para verificação real
  let docId = null;
  try {
    docId = await page.evaluate(() => {
      const raw = localStorage.getItem('registrar');
      if (!raw) return null;
      return JSON.parse(raw).docId || null;
    });
  } catch { /* ignora */ }

  await page.goto(`${BASE_URL}/verificar`);
  await sleep(2500);

  const inputDoc = page.locator('input[placeholder*="ID"], input[placeholder*="Cole"], input[placeholder*="código"]').first();
  const inputVisible = await inputDoc.isVisible().catch(() => false);
  if (inputVisible) {
    await inputDoc.click();
    await sleep(400);

    const idToType = docId || 'mcmv-escritura-demo-2024';
    await inputDoc.type(idToType, { delay: 60 });
    await sleep(1500);

    await page.locator('button:has-text("Verificar")').first().click();
    await sleep(5000); // aguarda busca + resultado

    await smoothScroll(page, 300);
    await sleep(4000); // mostra certificado ZK verificado

    // Expande detalhes técnicos se disponível
    const btnDetalhes = page.locator('button.tech-toggle, button:has-text("Detalhes")').first();
    const dvVisible = await btnDetalhes.isVisible().catch(() => false);
    if (dvVisible) {
      await btnDetalhes.click();
      await sleep(4000); // mostra ZK proof hash + TX Solana
    }
  }

  await sleep(2000);

  // ── Cena final: volta para a home ─────────────────────────────────
  console.log('[fim] Voltando para home...');
  await page.goto(`${BASE_URL}/`);
  await sleep(1000);
  await smoothScroll(page, 400);
  await sleep(1500);
  await smoothScroll(page, 0);
  await sleep(2000);

  // ── Salva ─────────────────────────────────────────────────────────
  await context.close();
  await browser.close();

  const files = fs.readdirSync(OUTPUT_DIR)
    .filter(f => f.endsWith('.webm'))
    .sort((a, b) => fs.statSync(path.join(OUTPUT_DIR, b)).mtimeMs - fs.statSync(path.join(OUTPUT_DIR, a)).mtimeMs);

  if (files.length === 0) {
    console.log('Nenhum webm encontrado em', OUTPUT_DIR);
    return;
  }

  const webm = path.join(OUTPUT_DIR, files[0]);
  const mp4  = webm.replace('.webm', '-zcast.mp4');
  console.log(`\nWebM: ${webm}`);

  const { execSync } = require('child_process');
  try {
    execSync(`"${FFMPEG}" -y -i "${webm}" -c:v libx264 -preset fast -crf 20 -pix_fmt yuv420p "${mp4}"`, { stdio: 'inherit' });
    console.log(`\n✅ MP4: ${mp4}`);
    console.log('\nDuração alvo: 1:45–1:57');
    console.log('Próximo passo: adicionar trilha sonora (ver C:\\Projetos\\sons-para-demo.md)');
  } catch {
    console.log(`\nConverter manualmente:\n  ffmpeg -i "${webm}" -c:v libx264 "${mp4}"`);
  }
}

recordDemo().catch(err => {
  console.error('Erro:', err);
  process.exit(1);
});
