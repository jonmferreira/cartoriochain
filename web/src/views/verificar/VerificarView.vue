<template>
  <div style="background:#1B231D; min-height:100vh; padding:40px 24px;">
    <div style="max-width:600px; margin:0 auto; display:flex; flex-direction:column; gap:28px;">

      <!-- Header -->
      <div class="anim-slide-up">
        <div style="font-size:11px; font-weight:800; letter-spacing:0.1em; text-transform:uppercase; color:#4F5E50; margin-bottom:8px;">Verificação pública · Sem conta</div>
        <h1 style="font-family:var(--font-display); font-weight:900; font-size:32px; text-transform:uppercase; letter-spacing:-1px; color:#F7EACB; line-height:1;">Verificar documento</h1>
      </div>

      <!-- Formulário de busca -->
      <div class="anim-slide-up anim-delay-1 card" style="display:flex; flex-direction:column; gap:16px;">

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

        <div style="display:flex; align-items:center; gap:10px;">
          <div style="flex:1; height:1px; background:#D1C09F;"></div>
          <span style="font-size:11px; font-weight:700; color:#D1C09F; text-transform:uppercase; letter-spacing:0.06em;">ou</span>
          <div style="flex:1; height:1px; background:#D1C09F;"></div>
        </div>

        <div>
          <label class="label">Código de verificação</label>
          <div style="display:flex; gap:0;">
            <input
              v-model="docId"
              class="inp"
              type="text"
              placeholder="Cole o código do documento ou link de verificação"
              style="flex:1; border-right:none;"
              @keyup.enter="verificar"
            />
            <button
              class="btn btn-primary"
              style="border-left:none; white-space:nowrap;"
              :disabled="!docId.trim() || carregando"
              @click="verificar"
            >
              {{ carregando ? '...' : '◎ Verificar' }}
            </button>
          </div>
        </div>


        <!-- Verificação avançada — auditores -->
        <div>
          <button
            style="font-size:11px; font-weight:700; color:#4F5E50; background:none; border:none; cursor:pointer; padding:0; letter-spacing:0.04em;"
            @click="avancadoAberto = !avancadoAberto"
          >{{ avancadoAberto ? '▲' : '▼' }} Verificação avançada (auditores)</button>
          <div v-if="avancadoAberto" style="margin-top:10px;">
            <label class="label">Hash do arquivo <span style="font-weight:500; text-transform:none; letter-spacing:0;">— re-valida se o conteúdo não foi alterado</span></label>
            <input v-model="docHashHex" class="inp inp-mono" type="text" placeholder="SHA-256 hex do arquivo original" />
          </div>
        </div>
      </div>

      <!-- Loading shimmer -->
      <div v-if="carregando" class="anim-fade" style="display:flex; flex-direction:column; gap:12px;">
        <div class="progress-track"><div class="progress-fill" style="width:70%; animation:progressFill 1.8s ease infinite;" /></div>
        <div style="font-size:13px; font-weight:700; color:#4F5E50; text-align:center;">Verificando autenticidade...</div>
      </div>

      <!-- Erro -->
      <div v-if="erro && !carregando" class="anim-fade msg-error">
        <span>⚠</span><span>{{ erro }}</span>
      </div>

      <!-- ═══ RESULTADO ════════════════════════════════════ -->
      <div v-if="resultado && !carregando">

        <!-- Não encontrado -->
        <div v-if="!resultado.documento && !resultado.erro" class="anim-slide-up card" style="border-color:#D1C09F;">
          <div style="display:flex; align-items:center; gap:16px;">
            <div style="width:48px; height:48px; background:#243029; border:2px solid #3A4F3E; display:flex; align-items:center; justify-content:center; font-size:24px; flex-shrink:0;">?</div>
            <div>
              <div style="font-size:14px; font-weight:800; color:#F7EACB;">Documento não encontrado</div>
              <div style="font-size:13px; color:#4F5E50; margin-top:4px;">Verifique se o código está correto. Se tiver o arquivo original, use a verificação avançada abaixo.</div>
            </div>
          </div>
        </div>

        <!-- Válido / Revogado -->
        <div v-if="resultado.documento" class="certificate" :style="resultado.documento.revoked ? 'border-color:#9B1C1C;' : ''">
          <div v-if="resultado.documento.revoked" style="height:6px; background:#9B1C1C; margin:-1px -1px 0;" />

          <div style="padding:24px;">

            <!-- Status -->
            <div style="display:flex; align-items:flex-start; gap:16px; padding-bottom:20px; border-bottom:2px solid #3A4F3E; margin-bottom:20px;">
              <div :style="resultado.documento.revoked ? 'background:#9B1C1C' : 'background:#008C4C'" style="width:48px; height:48px; display:flex; align-items:center; justify-content:center; font-size:24px; flex-shrink:0; animation:checkPop 0.4s ease 0.2s both; color:white;">
                {{ resultado.documento.revoked ? '✗' : '✓' }}
              </div>
              <div>
                <div :style="resultado.documento.revoked ? 'color:#9B1C1C' : 'color:#008C4C'" style="font-size:11px; font-weight:800; letter-spacing:0.1em; text-transform:uppercase; margin-bottom:4px;">
                  {{ resultado.documento.revoked ? 'Documento revogado' : 'Documento válido e autenticado' }}
                </div>
                <div style="font-size:22px; font-weight:900; text-transform:uppercase; letter-spacing:-0.5px; color:#F7EACB;">{{ resultado.documento.doc_type }}</div>
                <div style="font-size:14px; color:#4F5E50; margin-top:4px;">{{ resultado.documento.cartorio_id }}</div>
              </div>
            </div>

            <!-- Campos limpos -->
            <div style="display:flex; flex-direction:column; gap:12px; margin-bottom:20px;">
              <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #3A4F3E; padding-bottom:12px;">
                <span style="font-size:12px; color:#4F5E50; font-weight:600;">Registrado em</span>
                <span style="font-size:14px; font-weight:700; color:#F7EACB;">{{ formatarData(resultado.documento.registered_at) }}</span>
              </div>
              <div v-if="resultado.documento.viewkey_payload" style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #3A4F3E; padding-bottom:12px;">
                <span style="font-size:12px; color:#4F5E50; font-weight:600;">Privacidade do signatário</span>
                <span class="tag tag-green">Dados protegidos ✓</span>
              </div>
              <div v-if="resultado.documento.revoked" style="padding:12px; background:#2B0D0D; border:1.5px solid #9B1C1C;">
                <span style="font-size:13px; font-weight:700; color:#9B1C1C;">Motivo da revogação: {{ resultado.documento.revoke_reason || 'Não informado' }}</span>
              </div>
            </div>

          </div>

          <!-- Detalhes técnicos -->
          <div style="border-top:2px solid #3A4F3E; padding:16px 24px;">
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

    <!-- Overlay câmera QR — dentro do root, Teleport move pro body em runtime -->
    <Teleport to="body">
    <div v-if="qrAtivo" class="qr-overlay" @click.self="fecharScanner">
    <div class="qr-modal">
      <div style="font-size:11px; font-weight:800; letter-spacing:0.1em; text-transform:uppercase; color:#A8D5B5; margin-bottom:12px;">Aponte para o QR code do documento</div>
      <div style="position:relative; width:280px; height:280px; border:3px solid #FFD23F;">
        <video ref="videoEl" autoplay playsinline muted style="width:100%; height:100%; object-fit:cover; display:block;" />
        <!-- mira -->
        <div style="position:absolute; inset:0; pointer-events:none;">
          <div style="position:absolute; top:16px; left:16px; width:24px; height:24px; border-top:3px solid #FFD23F; border-left:3px solid #FFD23F;"></div>
          <div style="position:absolute; top:16px; right:16px; width:24px; height:24px; border-top:3px solid #FFD23F; border-right:3px solid #FFD23F;"></div>
          <div style="position:absolute; bottom:16px; left:16px; width:24px; height:24px; border-bottom:3px solid #FFD23F; border-left:3px solid #FFD23F;"></div>
          <div style="position:absolute; bottom:16px; right:16px; width:24px; height:24px; border-bottom:3px solid #FFD23F; border-right:3px solid #FFD23F;"></div>
        </div>
      </div>
      <canvas ref="canvasEl" style="display:none;" />
      <div v-if="qrErro" style="font-size:12px; color:#FFD23F; margin-top:12px; text-align:center; max-width:260px;">{{ qrErro }}</div>
      <button class="btn btn-secondary btn-sm" style="margin-top:16px; border-color:#4F5E50; color:#D1C09F; cursor:pointer;" @click="fecharScanner">✕ Cancelar</button>
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

<style scoped>
.btn-qr {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 14px 20px;
  background: #1B231D;
  color: #F7EACB;
  border: 2px solid #1B231D;
  font-size: 13px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  cursor: pointer;
  transition: background 0.15s cubic-bezier(0.32,0.72,0,1), color 0.15s;
}
.btn-qr:hover {
  background: #008C4C;
  border-color: #008C4C;
}
.btn-qr:focus-visible {
  outline: 3px solid #FFD23F;
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
  background: #1B231D;
  border: 2px solid #2C3A2F;
}

@media (prefers-reduced-motion: reduce) {
  .btn-qr { transition: none; }
}
</style>
