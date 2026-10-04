<template>
  <div style="background:#F7EACB; min-height:100vh; padding:40px 24px;">
    <div style="max-width:600px; margin:0 auto; display:flex; flex-direction:column; gap:28px;">

      <!-- Header -->
      <div class="anim-slide-up">
        <div style="font-size:11px; font-weight:800; letter-spacing:0.1em; text-transform:uppercase; color:#4F5E50; margin-bottom:8px;">Cartório Digital</div>
        <h1 style="font-family:var(--font-display); font-weight:900; font-size:32px; text-transform:uppercase; letter-spacing:-1px; color:#1B231D; line-height:1;">Registrar documento</h1>
      </div>

      <!-- Steps indicator -->
      <div class="anim-slide-up anim-delay-1" style="display:flex; align-items:center;">
        <template v-for="(s, i) in etapas" :key="i">
          <div style="display:flex; align-items:center; gap:8px;">
            <div class="step-num" :class="{ active: etapa === i+1, done: etapa > i+1 }">
              <span v-if="etapa > i+1">✓</span>
              <span v-else>{{ i+1 }}</span>
            </div>
            <span class="step-label" :class="{ active: etapa === i+1 }">{{ s }}</span>
          </div>
          <div v-if="i < etapas.length-1" class="step-connector" />
        </template>
      </div>

      <!-- Banner demo -->
      <div v-if="modoDemo" class="anim-fade" style="background:#FFD23F; border:2px solid #1B231D; padding:12px 16px; display:flex; align-items:center; gap:10px;">
        <span style="font-size:16px;">🏠</span>
        <span style="font-size:13px; font-weight:700; color:#1B231D;">Demo MCMV — Escritura pré-preenchida. Clique em avançar para ver o fluxo completo.</span>
      </div>

      <!-- ═══ ETAPA 1: Documento ════════════════════════ -->
      <div v-if="etapa === 1" class="anim-slide-up" style="display:flex; flex-direction:column; gap:20px;">
        <div class="card">
          <label class="label">Documento</label>
          <div class="upload-area" :class="{ 'has-file': !!arquivo }" @click="($refs.fileInput as HTMLInputElement).click()" @dragover.prevent @drop.prevent="onDrop">
            <input ref="fileInput" type="file" accept=".pdf,.doc,.docx,.txt" @change="onArquivoChange" />
            <div v-if="!arquivo" style="display:flex; flex-direction:column; align-items:center; gap:10px;">
              <span style="font-size:32px; color:#4F5E50;">⬆</span>
              <div style="font-size:13px; font-weight:700; color:#1B231D;">Clique ou arraste o documento aqui</div>
              <div style="font-size:11px; color:#4F5E50;">PDF, DOC, DOCX, TXT</div>
            </div>
            <div v-else style="display:flex; flex-direction:column; align-items:center; gap:8px;">
              <span style="font-size:32px;">✓</span>
              <div style="font-size:13px; font-weight:800; color:#008C4C;">{{ arquivo.name }}</div>
              <div style="font-size:11px; color:#4F5E50;">{{ (arquivo.size/1024).toFixed(1) }} KB — clique para trocar</div>
            </div>
          </div>
        </div>

        <button class="btn btn-primary" style="align-self:flex-end;" :disabled="!arquivo" @click="etapa=2">
          Avançar →
        </button>
      </div>

      <!-- ═══ ETAPA 2: Metadados ════════════════════════ -->
      <div v-if="etapa === 2" class="anim-slide-up" style="display:flex; flex-direction:column; gap:20px;">
        <div class="card" style="display:flex; flex-direction:column; gap:18px;">

          <div>
            <label class="label">Tipo do documento</label>
            <input v-model="form.docType" class="inp" type="text" placeholder="ex: Escritura, Contrato de compra e venda, Procuração" maxlength="32" />
          </div>

          <div>
            <label class="label">Cartório / Instituição</label>
            <input v-model="form.cartorioId" class="inp" type="text" placeholder="ex: 1º Ofício de Notas do Rio de Janeiro" maxlength="32" />
          </div>

          <!-- Privacidade ZCash — painel avançado -->
          <div class="vk-section">
            <button class="vk-toggle" @click="vkAberto = !vkAberto">
              <span>🔒</span>
              <span>Privacidade ZCash ViewKey</span>
              <span style="margin-left:4px; color:#D1C09F;">{{ vkAberto ? '▲' : '▼' }}</span>
            </button>
            <p style="font-size:12px; color:#D1C09F; margin-top:6px; line-height:1.5;">Cifra os dados do signatário on-chain. Só o titular da ViewKey pode descriptografar — LGPD nativa.</p>
            <div v-if="vkAberto" style="margin-top:12px;">
              <label class="label" style="color:#D1C09F;">Payload ViewKey (JSON cifrado)</label>
              <textarea
                v-model="form.viewkeyPayload"
                rows="3"
                class="inp inp-mono"
                placeholder='{"v":"zcash-vk-v1","payload":"...","hint":"zxviews1..."}'
                style="background:#2C3A2F; border-color:#4F5E50; color:#F7EACB; resize:none;"
              />
            </div>
          </div>
        </div>

        <div style="display:flex; gap:12px; justify-content:space-between;">
          <button class="btn btn-secondary btn-sm" @click="etapa=1">← Voltar</button>
          <button class="btn btn-primary" :disabled="!form.docType || !form.cartorioId" @click="registrar">
            ✓ Autenticar documento
          </button>
        </div>
      </div>

      <!-- ═══ LOADING ════════════════════════════════════ -->
      <div v-if="carregando" class="anim-fade card" style="display:flex; flex-direction:column; gap:20px;">
        <div style="font-size:13px; font-weight:800; text-transform:uppercase; letter-spacing:0.06em; color:#1B231D;">Autenticando...</div>

        <div class="progress-track">
          <div class="progress-fill" :style="`width:${progressoPct}%;`" />
        </div>

        <div style="display:flex; flex-direction:column; gap:0;">
          <div v-for="(step, i) in loadingSteps" :key="i" class="loading-step" :class="{ active: loadingEtapa === i, done: loadingEtapa > i }">
            <div class="loading-dot" />
            <span style="font-size:13px; font-weight:600; color:#1B231D;">{{ step }}</span>
          </div>
        </div>
      </div>

      <!-- Erro -->
      <div v-if="erro && !carregando" class="anim-fade msg-error">
        <span>⚠</span>
        <span>{{ erro }}</span>
      </div>

      <!-- ═══ RESULTADO ═══════════════════════════════════ -->
      <div v-if="resultado && !carregando" class="certificate">
        <div style="padding:24px 24px 0;">

          <div style="display:flex; align-items:flex-start; gap:16px; padding-bottom:20px; border-bottom:2px solid #1B231D;">
            <div class="certificate-check">
              <span style="color:white; font-size:24px;">✓</span>
            </div>
            <div>
              <div style="font-size:11px; font-weight:800; letter-spacing:0.1em; text-transform:uppercase; color:#008C4C; margin-bottom:4px;">Documento autenticado</div>
              <div style="font-size:20px; font-weight:900; text-transform:uppercase; letter-spacing:-0.5px; color:#1B231D;">{{ form.docType }}</div>
              <div style="font-size:13px; color:#4F5E50; margin-top:4px;">{{ form.cartorioId }}</div>
            </div>
          </div>

          <div style="padding:16px 0; display:flex; flex-direction:column; gap:10px;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span style="font-size:12px; color:#4F5E50; font-weight:600;">Registrado em</span>
              <span style="font-size:13px; font-weight:700; color:#1B231D;">{{ formatarData(resultado.registered_at) }}</span>
            </div>
            <div v-if="resultado.viewkey_payload" style="display:flex; justify-content:space-between; align-items:center;">
              <span style="font-size:12px; color:#4F5E50; font-weight:600;">Privacidade</span>
              <span class="tag tag-green">ZCash ViewKey ativo</span>
            </div>
          </div>

          <div style="padding:16px 0 0; border-top:2px solid #EFE0BA; display:flex; gap:10px; flex-wrap:wrap;">
            <button class="btn btn-primary btn-sm" @click="copiarLink">↗ Copiar link de verificação</button>
            <button class="btn btn-secondary btn-sm" @click="verificarAgora">◎ Verificar agora</button>
          </div>

        </div>

        <!-- Detalhes técnicos -->
        <div style="background:#EFE0BA; border-top:2px solid #D1C09F; padding:16px 24px;">
          <button class="tech-toggle" @click="detalhesAbertos = !detalhesAbertos">
            <span>{{ detalhesAbertos ? '▲' : '▼' }}</span>
            Detalhes técnicos
          </button>
          <div v-if="detalhesAbertos" class="tech-grid">
            <div class="tech-row"><span class="tech-label">Doc ID</span><span class="tech-val">{{ resultado.docId }}</span></div>
            <div class="tech-row"><span class="tech-label">Hash SHA-256</span><span class="tech-val">{{ resultado.doc_hash }}</span></div>
            <div class="tech-row"><span class="tech-label">Irys TX</span><span class="tech-val">{{ resultado.irys_tx_id }}</span></div>
            <div class="tech-row"><span class="tech-label">ZK Commitment</span><span class="tech-val">{{ resultado.signer_commitment }}</span></div>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { registrarDocumento } from './integrations'
import type { RegistrarPayload, RegistrarResult } from './types'

const DEMO_KEY = 'a' + '0'.repeat(63)
const DEMO_VIEWKEY_PAYLOAD = JSON.stringify({
  v: 'zcash-vk-v1',
  payload: '4a5f3c2b1a9e8d7c6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3',
  hint: 'zxviews1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq',
})

const DEMO_MCMV = {
  docType: 'Escritura MCMV',
  cartorioId: '1º Ofício RJ — CRIO-RJ-001',
  pubKeyX: DEMO_KEY,
  pubKeyY: DEMO_KEY,
  sigR: DEMO_KEY,
  sigS: DEMO_KEY,
  viewkeyPayload: DEMO_VIEWKEY_PAYLOAD,
  docIdSeed: 'mcmv-escritura-demo-2024',
}

const LOADING_STEPS = [
  'Calculando hash SHA-256 do documento...',
  'Gerando prova ZK de autenticidade...',
  'Armazenando permanentemente no Irys...',
  'Registrando na Solana...',
]

export default defineComponent({
  name: 'RegistrarView',

  data() {
    return {
      etapa: 1,
      etapas: ['Documento', 'Informações', 'Resultado'],
      arquivo: null as File | null,
      form: {
        docType: '',
        cartorioId: '',
        pubKeyX: '',
        pubKeyY: '',
        sigR: '',
        sigS: '',
        viewkeyPayload: '',
        docIdSeed: '',
      } as RegistrarPayload,
      modoDemo: false,
      vkAberto: false,
      carregando: false,
      loadingEtapa: 0,
      loadingSteps: LOADING_STEPS,
      loadingTimer: null as ReturnType<typeof setInterval> | null,
      erro: null as string | null,
      resultado: null as RegistrarResult | null,
      detalhesAbertos: false,
    }
  },

  computed: {
    progressoPct(): number {
      return Math.round(((this.loadingEtapa + 0.5) / this.loadingSteps.length) * 100)
    },
  },

  created() {
    if (this.$route.query.demo === 'mcmv') {
      Object.assign(this.form, DEMO_MCMV)
      this.modoDemo = true
      this.arquivo = new File(['Contrato MCMV - Demo CartórioChain'], 'escritura-mcmv-demo.txt', { type: 'text/plain' })
    }
  },

  beforeUnmount() {
    if (this.loadingTimer) clearInterval(this.loadingTimer)
  },

  methods: {
    onArquivoChange(e: Event) {
      const input = e.target as HTMLInputElement
      const file = input.files?.[0] ?? null
      this.setArquivo(file)
    },

    onDrop(e: DragEvent) {
      const file = e.dataTransfer?.files?.[0] ?? null
      this.setArquivo(file)
    },

    setArquivo(file: File | null) {
      this.arquivo = file
      if (file && !this.form.pubKeyX) {
        // Auto-popula chaves demo para não bloquear o fluxo
        Object.assign(this.form, {
          pubKeyX: DEMO_KEY, pubKeyY: DEMO_KEY,
          sigR: DEMO_KEY, sigS: DEMO_KEY,
        })
      }
    },

    iniciarLoadingAnimation() {
      this.loadingEtapa = 0
      this.loadingTimer = setInterval(() => {
        if (this.loadingEtapa < this.loadingSteps.length - 1) {
          this.loadingEtapa++
        } else {
          clearInterval(this.loadingTimer!)
        }
      }, 1800)
    },

    async registrar() {
      if (!this.arquivo) return
      this.carregando = true
      this.erro = null
      this.resultado = null
      this.etapa = 3
      this.iniciarLoadingAnimation()

      try {
        this.resultado = await registrarDocumento(this.arquivo, this.form)
      } catch (e: unknown) {
        const err = e as { response?: { data?: { error?: string } }; message?: string }
        this.erro = err.response?.data?.error ?? err.message ?? 'Erro ao registrar documento.'
      } finally {
        if (this.loadingTimer) clearInterval(this.loadingTimer)
        this.carregando = false
        this.loadingEtapa = this.loadingSteps.length
      }
    },

    copiarLink() {
      if (this.resultado) {
        navigator.clipboard.writeText(this.resultado.verificarUrl)
      }
    },

    verificarAgora() {
      if (this.resultado) {
        this.$router.push(`/verificar/${this.resultado.docId}`)
      }
    },

    formatarData(ts: number): string {
      return new Date(ts * 1000).toLocaleString('pt-BR', { dateStyle: 'long', timeStyle: 'short' })
    },
  },
})
</script>
