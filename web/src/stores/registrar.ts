import { defineStore } from 'pinia'
import { registrarDocumento } from '../views/registrar/integrations'
import type { RegistrarResult } from '../views/registrar/types'

const DEMO_KEY = 'a' + '0'.repeat(63)
const DEMO_VIEWKEY_PAYLOAD = JSON.stringify({
  v: 'zcash-vk-v1',
  payload: '4a5f3c2b1a9e8d7c6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3',
  hint: 'zxviews1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq',
})

export const LOADING_STEPS = [
  'Verificando pagamento...',
  'Gerando impressão digital do documento...',
  'Gerando prova de autenticidade...',
  'Armazenando e registrando com segurança...',
]

export const useRegistrarStore = defineStore('registrar', {
  persist: {
    key: 'cartoriochain:registrar',
    // File não é serializável — excluir; resultado e loading são voláteis
    omit: ['arquivo', 'carregando', 'loadingEtapa', 'resultado', 'erro'],
  },

  state: () => ({
    etapa: 1 as number,

    // Step 1
    arquivo: null as File | null,

    // Step 2
    docType: '',
    cartorioId: '',
    viewkeyPayload: '',
    docIdSeed: '',
    pubKeyX: DEMO_KEY,
    pubKeyY: DEMO_KEY,
    sigR: DEMO_KEY,
    sigS: DEMO_KEY,

    // Flags
    modoDemo: false,

    // Step 4 — loading
    carregando: false,
    loadingEtapa: 0,

    // Resultado / erro
    resultado: null as RegistrarResult | null,
    erro: null as string | null,
  }),

  actions: {
    preencherDemo() {
      this.docType = 'Escritura MCMV'
      this.cartorioId = 'CartórioChain'
      this.pubKeyX = DEMO_KEY
      this.pubKeyY = DEMO_KEY
      this.sigR = DEMO_KEY
      this.sigS = DEMO_KEY
      this.viewkeyPayload = DEMO_VIEWKEY_PAYLOAD
      this.docIdSeed = 'mcmv-escritura-demo-2024'
      this.arquivo = new File(
        ['Contrato MCMV - Demo CartórioChain'],
        'escritura-mcmv-demo.txt',
        { type: 'text/plain' }
      )
      this.modoDemo = true
    },

    async registrar() {
      if (!this.arquivo) return
      this.carregando = true
      this.erro = null
      this.resultado = null
      this.etapa = 4
      this.loadingEtapa = 0

      const timer = setInterval(() => {
        if (this.loadingEtapa < LOADING_STEPS.length - 1) this.loadingEtapa++
        else clearInterval(timer)
      }, 1800)

      try {
        this.resultado = await registrarDocumento(this.arquivo, {
          docType: this.docType,
          cartorioId: this.cartorioId,
          pubKeyX: this.pubKeyX,
          pubKeyY: this.pubKeyY,
          sigR: this.sigR,
          sigS: this.sigS,
          viewkeyPayload: this.viewkeyPayload || undefined,
          docIdSeed: this.docIdSeed || undefined,
        })
      } catch (e: unknown) {
        const err = e as { response?: { data?: { error?: string } }; message?: string }
        this.erro = err.response?.data?.error ?? err.message ?? 'Erro ao registrar documento.'
      } finally {
        clearInterval(timer)
        this.carregando = false
        this.loadingEtapa = LOADING_STEPS.length
      }
    },

    limpar() {
      this.$reset()
    },
  },
})
