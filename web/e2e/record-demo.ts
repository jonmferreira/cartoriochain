/**
 * Grava o fluxo MCMV completo como vídeo MP4 para o demo do hackathon.
 * Roda em modo headed com viewport 1280x720.
 *
 * Uso:
 *   npx playwright test e2e/record-demo.ts --config e2e/record.config.ts
 *
 * Output: e2e/videos/demo-mcmv-*.webm  (converter p/ MP4 com ffmpeg depois)
 */

import { test } from '@playwright/test'

const BASE = 'http://localhost:5176'
const PAUSE = (ms: number) => new Promise(r => setTimeout(r, ms))

test('demo MCMV — gravação completa', async ({ page }) => {

  // ── Step 1 — Documento ────────────────────────────────────────────
  await page.goto(`${BASE}/registrar?demo=mcmv`)
  await PAUSE(2500)                             // deixa o usuário "ver" o estado

  // Foco no arquivo carregado
  await page.locator('text=escritura-mcmv-demo.txt').scrollIntoViewIfNeeded()
  await PAUSE(2000)

  await page.getByRole('button', { name: /Avançar/ }).click()
  await PAUSE(1000)

  // ── Step 2 — Informações ──────────────────────────────────────────
  await PAUSE(2500)

  // Abre privacidade avançada para mostrar ViewKey
  const togglePriv = page.locator('button:has-text("Privacidade avançada")')
  await togglePriv.click()
  await PAUSE(3000)                             // callout: "ZCash ViewKey cifrado aqui"
  await togglePriv.click()
  await PAUSE(1000)

  await page.getByRole('button', { name: /Avançar/ }).click()
  await PAUSE(1000)

  // ── Step 3 — Pagamento PIX ────────────────────────────────────────
  await PAUSE(3000)

  await page.locator('button:has-text("Copiar")').click()
  await PAUSE(1500)

  await page.locator('button:has-text("Já paguei")').click()
  await PAUSE(1000)

  // ── Step 4 — Loading (ZK Proof gerado aqui) ───────────────────────
  await PAUSE(2000)                             // callout: "ZK Proof gerado"
  await page.waitForSelector('text=Autenticando', { timeout: 4000 }).catch(() => {})
  await PAUSE(6000)                             // mostra todas as etapas de loading

  // ── Resultado (se API real respondeu) ─────────────────────────────
  const resultado = page.locator('.certificate')
  const temResultado = await resultado.isVisible().catch(() => false)
  if (temResultado) {
    await PAUSE(4000)
    await page.locator('button:has-text("Detalhes técnicos")').click().catch(() => {})
    await PAUSE(3000)
  }

  // ── Verificar ─────────────────────────────────────────────────────
  await page.goto(`${BASE}/verificar`)
  await PAUSE(3000)

  // Fade out final
  await PAUSE(2000)
})
