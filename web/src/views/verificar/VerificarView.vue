<template>
  <div class="page vrfy-root">
    <div class="wrap-sm vrfy-stack">

      <!-- Header -->
      <div class="anim-slide-up vrfy-header">
        <div class="eyebrow" style="margin-bottom:8px;">Verificação pública · Sem conta</div>
        <h1 class="page-title">Verificar documento</h1>
      </div>

      <!-- Formulário de busca -->
      <div class="anim-slide-up anim-delay-1 card vrfy-form">

        <!-- Scanner QR -->
        <button class="btn-qr" @click="abrirScanner">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="square" aria-hidden="true">
            <rect x="2" y="2" width="5" height="5"/><rect x="11" y="2" width="5" height="5"/>
            <rect x="2" y="11" width="5" height="5"/>
            <rect x="3.5" y="3.5" width="2" height="2" fill="currentColor" stroke="none"/>
            <rect x="12.5" y="3.5" width="2" height="2" fill="currentColor" stroke="none"/>
            <rect x="3.5" y="12.5" width="2" height="2" fill="currentColor" stroke="none"/>
            <path d="M11 12h2m2 0h1M11 14v2M13 11v1M15 13v3"/>
          </svg>
          Escanear QR code do documento
        </button>

        <div class="vrfy-or-divider">
          <div class="vrfy-or-line"></div>
          <span class="eyebrow" style="letter-spacing:0.06em;">ou</span>
          <div class="vrfy-or-line"></div>
        </div>

        <div>
          <label class="label">Código de verificação</label>
          <div class="vrfy-input-row">
            <input
              v-model="docId"
              class="inp vrfy-input"
              type="text"
              placeholder="Cole o código do documento ou link de verificação"
              @keyup.enter="verificar"
            />
            <button
              class="btn btn-primary vrfy-submit-btn"
              :disabled="!docId.trim() || carregando"
              @click="verificar"
            >
              {{ carregando ? '...' : '◎ Verificar' }}
            </button>
          </div>
        </div>

        <!-- Verificação avançada — auditores -->
        <div>
          <button class="eyebrow vrfy-advanced-btn" @click="avancadoAberto = !avancadoAberto">
            {{ avancadoAberto ? '▲' : '▼' }} Verificação avançada (auditores)
          </button>
          <div v-if="avancadoAberto" class="vrfy-hash-wrap">
            <label class="label">Hash do arquivo <span style="font-weight:500; text-transform:none; letter-spacing:0;">— re-valida se o conteúdo não foi alterado</span></label>
            <input v-model="docHashHex" class="inp inp-mono" type="text" placeholder="SHA-256 hex do arquivo original" />
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="carregando" class="anim-fade vrfy-loading">
        <div class="progress-track"><div class="progress-fill" style="width:70%; animation:progressFill 1.8s ease infinite;" /></div>
        <div class="eyebrow vrfy-loading-text">Verificando autenticidade...</div>
      </div>

      <!-- Erro -->
      <div v-if="erro && !carregando" class="anim-fade msg-error">
        <span>⚠</span><span>{{ erro }}</span>
      </div>

      <!-- ═══ RESULTADO ════════════════════════════════════ -->
      <div v-if="resultado && !carregando">

        <!-- Não encontrado -->
        <div v-if="!resultado.documento && !resultado.erro" class="anim-slide-up card vrfy-notfound">
          <div class="vrfy-notfound-row">
            <div class="vrfy-notfound-icon">?</div>
            <div>
              <div style="font-size:14px; font-weight:800; color:var(--color-text);">Documento não encontrado</div>
              <p class="body-sm" style="margin-top:4px;">Verifique se o código está correto. Se tiver o arquivo original, use a verificação avançada abaixo.</p>
            </div>
          </div>
        </div>

        <!-- Válido / Revogado -->
        <div v-if="resultado.documento" class="certificate" :class="{ 'vrfy-cert-revoked': resultado.documento.revoked }">
          <div v-if="resultado.documento.revoked" class="vrfy-cert-revoked-bar" />

          <div class="vrfy-cert-padding">

            <!-- Status -->
            <div class="vrfy-status-row">
              <div class="vrfy-status-icon" :class="resultado.documento.revoked ? 'vrfy-status-icon--revoked' : 'vrfy-status-icon--valid'">
                {{ resultado.documento.revoked ? '✗' : '✓' }}
              </div>
              <div>
                <div class="eyebrow" :class="resultado.documento.revoked ? 'vrfy-status-label--revoked' : 'vrfy-status-label--valid'">
                  {{ resultado.documento.revoked ? 'Documento revogado' : 'Documento válido e autenticado' }}
                </div>
                <div class="vrfy-doc-type">{{ resultado.documento.doc_type }}</div>
                <div class="body-sm vrfy-cartorio">{{ resultado.documento.cartorio_id }}</div>
              </div>
            </div>

            <!-- Campos -->
            <div class="vrfy-fields">
              <div class="data-row">
                <span class="data-row-label">Registrado em</span>
                <span class="data-row-value" style="font-size:14px;">{{ formatarData(resultado.documento.registered_at) }}</span>
              </div>
              <div v-if="resultado.documento.viewkey_payload" class="data-row">
                <span class="data-row-label">Privacidade do signatário</span>
                <span class="data-row-value" style="color:var(--color-emerald);">Dados protegidos ✓</span>
              </div>
              <div v-if="resultado.documento.revoked" class="vrfy-revoke-reason">
                Motivo da revogação: {{ resultado.documento.revoke_reason || 'Não informado' }}
              </div>
            </div>

          </div>

          <!-- Detalhes técnicos -->
          <div class="vrfy-cert-tech">
            <button class="tech-toggle" @click="detalhesAbertos = !detalhesAbertos">
              <span>{{ detalhesAbertos ? '▲' : '▼' }}</span>
              Detalhes técnicos
            </button>
            <div v-if="detalhesAbertos" class="tech-grid">
              <div class="tech-row"><span class="tech-label">Hash SHA-256</span><span class="tech-val">{{ resultado.documento.doc_hash }}</span></div>
              <div class="tech-row"><span class="tech-label">Irys TX</span><span class="tech-val">{{ resultado.documento.irys_tx_id }}</span></div>
              <div class="tech-row"><span class="tech-label">ZK Commitment</span><span class="tech-val">{{ resultado.documento.signer_commitment }}</span></div>
              <div class="tech-row"><span class="tech-label">Autoridade</span><span class="tech-val">{{ resultado.documento.authority }}</span></div>
            </div>
          </div>

        </div>
      </div>

    </div>

    <!-- Overlay câmera QR -->
    <Teleport to="body">
    <div v-if="qrAtivo" class="qr-overlay" @click.self="fecharScanner">
    <div class="qr-modal">
      <div class="eyebrow vrfy-qr-header">Aponte para o QR code do documento</div>
      <div class="vrfy-qr-frame">
        <video ref="videoEl" autoplay playsinline muted class="vrfy-qr-video" />
        <div class="vrfy-qr-crosshair">
          <div class="vrfy-qr-corner vrfy-qr-corner--tl"></div>
          <div class="vrfy-qr-corner vrfy-qr-corner--tr"></div>
          <div class="vrfy-qr-corner vrfy-qr-corner--bl"></div>
          <div class="vrfy-qr-corner vrfy-qr-corner--br"></div>
        </div>
      </div>
      <canvas ref="canvasEl" style="display:none;" />
      <div v-if="qrErro" class="body-xs vrfy-qr-error">{{ qrErro }}</div>
      <button class="btn btn-secondary btn-sm vrfy-qr-cancel" @click="fecharScanner">✕ Cancelar</button>
    </div>
    </div>
    </Teleport>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { verificarDocumento } from './integrations'
import type { VerificarResult } from './types'

export default defineComponent({
  name: 'VerificarView',

  data() {
    return {
      docId: (this.$route.params.docId as string) ?? '',
      docHashHex: '',
      avancadoAberto: false,
      carregando: false,
      erro: null as string | null,
      resultado: null as VerificarResult | null,
      detalhesAbertos: false,
      qrAtivo: false,
      qrErro: null as string | null,
      streamRef: null as MediaStream | null,
      animFrameId: null as number | null,
    }
  },

  unmounted() {
    this.fecharScanner()
  },

  async created() {
    if (this.docId) await this.verificar()
  },

  methods: {
    async verificar() {
      const id = this.docId.trim()
      if (!id) return
      this.carregando = true
      this.erro = null
      this.resultado = null

      try {
        this.resultado = await verificarDocumento(id, this.docHashHex.trim() || undefined)
      } catch (e: unknown) {
        const err = e as { message?: string }
        this.erro = err.message ?? 'Erro ao verificar documento.'
      } finally {
        this.carregando = false
      }
    },

    formatarData(ts: number): string {
      return new Date(ts * 1000).toLocaleString('pt-BR', { dateStyle: 'long', timeStyle: 'short' })
    },

    async abrirScanner() {
      this.qrErro = null
      if (!('BarcodeDetector' in window)) {
        this.erro = 'Leitura de QR não suportada neste navegador. Use Chrome ou cole o código manualmente.'
        return
      }
      this.qrAtivo = true
      await this.$nextTick()
      try {
        const video = this.$refs.videoEl as HTMLVideoElement
        const canvas = this.$refs.canvasEl as HTMLCanvasElement
        this.streamRef = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        video.srcObject = this.streamRef

        const detector = new (window as any).BarcodeDetector({ formats: ['qr_code'] })

        const scan = async () => {
          if (!this.qrAtivo) return
          if (video.readyState >= video.HAVE_ENOUGH_DATA) {
            canvas.width = video.videoWidth
            canvas.height = video.videoHeight
            canvas.getContext('2d')!.drawImage(video, 0, 0)
            try {
              const codes = await detector.detect(canvas)
              if (codes.length > 0) {
                const raw: string = codes[0].rawValue
                const match = raw.match(/verificar\/([^?&#/]+)/) ?? raw.match(/[?&]id=([^&#]+)/)
                this.docId = match ? match[1] : raw
                this.fecharScanner()
                await this.verificar()
                return
              }
            } catch { /* frame inválido, continua */ }
          }
          this.animFrameId = requestAnimationFrame(scan)
        }
        this.animFrameId = requestAnimationFrame(scan)
      } catch {
        this.qrErro = 'Não foi possível acessar a câmera. Verifique as permissões do navegador.'
      }
    },

    fecharScanner() {
      this.qrAtivo = false
      if (this.animFrameId !== null) { cancelAnimationFrame(this.animFrameId); this.animFrameId = null }
      if (this.streamRef) { this.streamRef.getTracks().forEach(t => t.stop()); this.streamRef = null }
    },
  },
})
</script>

<style src="./verificar.css"></style>

<style scoped>
.btn-qr {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 14px 20px;
  background: var(--color-ink);
  color: var(--color-text);
  border: 2px solid var(--color-ink);
  font-size: 13px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  cursor: pointer;
  transition: background 0.15s cubic-bezier(0.32,0.72,0,1), color 0.15s;
}
.btn-qr:hover {
  background: var(--color-emerald);
  border-color: var(--color-emerald);
}
.btn-qr:focus-visible {
  outline: 3px solid var(--color-yellow);
  outline-offset: 3px;
}

.qr-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.88);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
}
.qr-modal {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 24px;
  background: var(--color-ink);
  border: 2px solid var(--color-ink-2);
}

@media (prefers-reduced-motion: reduce) {
  .btn-qr { transition: none; }
}
</style>
