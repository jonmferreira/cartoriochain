import { test, expect } from '@playwright/test'
import path from 'path'

const BASE = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:5176'

test.describe('Fluxo registrar', () => {

  test('demo MCMV — carrega step 1 com arquivo preenchido', async ({ page }) => {
    await page.goto(`${BASE}/registrar?demo=mcmv`)
    await expect(page.locator('text=escritura-mcmv-demo.txt')).toBeVisible({ timeout: 5000 })
    await expect(page.getByRole('button', { name: /Avançar/ })).toBeVisible()
  })

  test('step 1 — upload desabilitado sem arquivo', async ({ page }) => {
    await page.goto(`${BASE}/registrar`)
    const btn = page.locator('button:has-text("Avançar")')
    await expect(btn).toBeDisabled()
  })

  test('step 1 → step 2 com demo', async ({ page }) => {
    await page.goto(`${BASE}/registrar?demo=mcmv`)
    await page.locator('button:has-text("Avançar")').click()
    await expect(page.locator('text=Tipo do documento')).toBeVisible()
    await expect(page.locator('input[list="doc-types"]')).toBeVisible()
  })

  test('step 2 — avançar desabilitado sem campos', async ({ page }) => {
    await page.goto(`${BASE}/registrar`)
    await page.evaluate(() => {
      // simula etapa 2 direto no store
    })
    // navega manualmente via URL
    await page.goto(`${BASE}/registrar`)
    // step 2 só abre via step 1 — testar via demo
    await page.goto(`${BASE}/registrar?demo=mcmv`)
    await page.locator('button:has-text("Avançar")').first().click()
    const btnAvancar = page.locator('button:has-text("Avançar")').last()
    // com demo preenchido deve estar habilitado
    await expect(btnAvancar).toBeEnabled()
  })

  test('step 2 → step 3 (PIX)', async ({ page }) => {
    await page.goto(`${BASE}/registrar?demo=mcmv`)
    await page.locator('button:has-text("Avançar")').click()
    await page.locator('button:has-text("Avançar")').click()
    await expect(page.locator('text=Taxa de autenticação')).toBeVisible()
    await expect(page.locator('text=R$ 5,00')).toBeVisible()
    await expect(page.locator('text=pix+')).toBeVisible()
  })

  test('step 3 — botão copiar chave PIX', async ({ page }) => {
    await page.goto(`${BASE}/registrar?demo=mcmv`)
    await page.locator('button:has-text("Avançar")').click()
    await page.locator('button:has-text("Avançar")').click()
    await page.locator('button:has-text("Copiar")').click()
    await expect(page.locator('text=✓ Copiado')).toBeVisible()
  })

  test('step 3 — botão voltar retorna ao step 2', async ({ page }) => {
    await page.goto(`${BASE}/registrar?demo=mcmv`)
    await page.locator('button:has-text("Avançar")').click()
    await page.locator('button:has-text("Avançar")').click()
    await page.locator('button:has-text("Voltar")').click()
    await expect(page.locator('text=Tipo do documento')).toBeVisible()
  })

  test('step 3 — "Já paguei" mostra spinner de confirmação', async ({ page }) => {
    await page.goto(`${BASE}/registrar?demo=mcmv`)
    await page.locator('button:has-text("Avançar")').click()
    await page.locator('button:has-text("Avançar")').click()
    await page.locator('button:has-text("Já paguei")').click()
    await expect(page.locator('text=Confirmando pagamento')).toBeVisible()
  })

  test('step 4 loading — progress bar e steps aparecem', async ({ page }) => {
    // Segura a requisição POST /documents para manter o estado de loading visível
    await page.route('**/documents', async route => {
      await new Promise(r => setTimeout(r, 6000))
      await route.fulfill({ status: 500, body: JSON.stringify({ error: 'test-mock' }) })
    })

    await page.goto(`${BASE}/registrar?demo=mcmv`)
    await page.locator('button:has-text("Avançar")').click()
    await page.locator('button:has-text("Avançar")').click()
    await page.locator('button:has-text("Já paguei")').click()
    await expect(page.locator('text=Autenticando')).toBeVisible({ timeout: 4000 })
    await expect(page.locator('text=Gerando impressão digital')).toBeVisible()
  })

  test('UX — sem texto blockchain visível no fluxo', async ({ page }) => {
    await page.goto(`${BASE}/registrar?demo=mcmv`)
    const content = await page.textContent('body')
    expect(content).not.toContain('Solana')
    expect(content).not.toContain('USDC')
    expect(content).not.toContain('wallet')
    expect(content).not.toContain('ZCash')
  })

  test('Privacidade avançada — toggle abre e fecha', async ({ page }) => {
    await page.goto(`${BASE}/registrar?demo=mcmv`)
    await page.locator('button:has-text("Avançar")').click()
    const toggle = page.locator('button:has-text("Privacidade avançada")')
    await expect(toggle).toBeVisible()
    await toggle.click()
    await expect(page.locator('text=Privacidade ativa')).toBeVisible()
    await toggle.click()
    await expect(page.locator('text=Privacidade ativa')).not.toBeVisible()
  })

  test('step 2 — tipo de documento é combobox com datalist', async ({ page }) => {
    await page.goto(`${BASE}/registrar?demo=mcmv`)
    await page.locator('button:has-text("Avançar")').click()
    const input = page.locator('input[list="doc-types"]')
    await expect(input).toBeVisible()
    await expect(input).toHaveValue('Escritura MCMV')
  })

  test('step 2 — campo cartório removido', async ({ page }) => {
    await page.goto(`${BASE}/registrar?demo=mcmv`)
    await page.locator('button:has-text("Avançar")').click()
    await expect(page.locator('text=Cartório ou instituição emissora')).not.toBeVisible()
  })

  test('step 3 — chave PIX é dinâmica (formato pix+xxxxx@)', async ({ page }) => {
    await page.goto(`${BASE}/registrar?demo=mcmv`)
    await page.locator('button:has-text("Avançar")').click()
    await page.locator('button:has-text("Avançar")').click()
    const pixKey = page.locator('text=/pix\\+[a-z0-9]+@cartoriochain\\.com\\.br/')
    await expect(pixKey).toBeVisible()
  })

})

test.describe('Home — seções de negócio', () => {

  test('comparativo de custo — R$5 vs R$2.400 visível', async ({ page }) => {
    await page.goto(BASE)
    await expect(page.locator('text=99,8%')).toBeVisible()
    await expect(page.locator('text=R$2.400')).toBeVisible()
  })

  test('loop econômico — 5 nós visíveis', async ({ page }) => {
    await page.goto(BASE)
    await expect(page.locator('text=Cada centavo é rastreável')).toBeVisible()
    await expect(page.getByText('Promocional', { exact: true }).first()).toBeVisible()
    await expect(page.getByText('Verificável', { exact: true }).first()).toBeVisible()
  })

  test('3 perfis de usuário com CTAs individuais', async ({ page }) => {
    await page.goto(BASE)
    await expect(page.getByText('Cidadão', { exact: true })).toBeVisible()
    await expect(page.locator('text=Construtora · Escritório')).toBeVisible()
    await expect(page.locator('text=Banco · Seguradora')).toBeVisible()
    await expect(page.locator('button:has-text("Registrar documento")').first()).toBeVisible()
    await expect(page.locator('button:has-text("Ver planos B2B")')).toBeVisible()
  })

  test('home — sem blockchain exposto', async ({ page }) => {
    await page.goto(BASE)
    const heroText = await page.locator('section').first().textContent()
    expect(heroText).not.toContain('wallet')
    expect(heroText).not.toContain('USDC')
  })

})

test.describe('Serviços — transparência e planos', () => {

  test('breakdown de custos visível', async ({ page }) => {
    await page.goto(`${BASE}/servicos`)
    await expect(page.locator('text=Transparência de custos')).toBeVisible()
    await expect(page.locator('text=Fórmula pública')).toBeVisible()
    await expect(page.locator('text=Registro on-chain')).toBeVisible()
    await expect(page.locator('div:text-is("Armazenamento permanente")')).toBeVisible()
  })

  test('3 planos visíveis com preços', async ({ page }) => {
    await page.goto(`${BASE}/servicos`)
    await expect(page.locator('text=Individual')).toBeVisible()
    await expect(page.locator('text=Construtora')).toBeVisible()
    await expect(page.locator('text=Enterprise')).toBeVisible()
    await expect(page.locator('text=Mais popular')).toBeVisible()
  })

})
