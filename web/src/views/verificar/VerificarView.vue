<template>
  <div style="background:#F7EACB; min-height:100vh; padding:40px 24px;">
    <div style="max-width:600px; margin:0 auto; display:flex; flex-direction:column; gap:28px;">

      <!-- Header -->
      <div class="anim-slide-up">
        <div style="font-size:11px; font-weight:800; letter-spacing:0.1em; text-transform:uppercase; color:#4F5E50; margin-bottom:8px;">Verificação pública · Sem conta</div>
        <h1 style="font-family:var(--font-display); font-weight:900; font-size:32px; text-transform:uppercase; letter-spacing:-1px; color:#1B231D; line-height:1;">Verificar documento</h1>
      </div>

      <!-- Formulário de busca -->
      <div class="anim-slide-up anim-delay-1 card" style="display:flex; flex-direction:column; gap:16px;">
        <div>
          <label class="label">ID do documento</label>
          <div style="display:flex; gap:0;">
            <input
              v-model="docId"
              class="inp"
              type="text"
              placeholder="Cole o ID ou hash do documento"
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

        <div>
          <label class="label">Hash do arquivo <span style="font-weight:500; text-transform:none; letter-spacing:0;">— opcional, para re-validar conteúdo</span></label>
          <input v-model="docHashHex" class="inp inp-mono" type="text" placeholder="SHA-256 hex do arquivo original" />
        </div>
      </div>

      <!-- Loading shimmer -->
      <div v-if="carregando" class="anim-fade" style="display:flex; flex-direction:column; gap:12px;">
        <div class="progress-track"><div class="progress-fill" style="width:70%; animation:progressFill 1.8s ease infinite;" /></div>
        <div style="font-size:13px; font-weight:700; color:#4F5E50; text-align:center;">Consultando blockchain...</div>
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
            <div style="width:48px; height:48px; background:#EFE0BA; border:2px solid #D1C09F; display:flex; align-items:center; justify-content:center; font-size:24px; flex-shrink:0;">?</div>
            <div>
              <div style="font-size:14px; font-weight:800; color:#1B231D;">Documento não encontrado</div>
              <div style="font-size:13px; color:#4F5E50; margin-top:4px;">Verifique se o ID está correto ou tente o hash SHA-256 do arquivo.</div>
            </div>
          </div>
        </div>

        <!-- Válido / Revogado -->
        <div v-if="resultado.documento" class="certificate" :style="resultado.documento.revoked ? 'border-color:#9B1C1C;' : ''">
          <div v-if="resultado.documento.revoked" style="height:6px; background:#9B1C1C; margin:-1px -1px 0;" />

          <div style="padding:24px;">

            <!-- Status -->
            <div style="display:flex; align-items:flex-start; gap:16px; padding-bottom:20px; border-bottom:2px solid #EFE0BA; margin-bottom:20px;">
              <div :style="resultado.documento.revoked ? 'background:#9B1C1C' : 'background:#008C4C'" style="width:48px; height:48px; display:flex; align-items:center; justify-content:center; font-size:24px; flex-shrink:0; animation:checkPop 0.4s ease 0.2s both; color:white;">
                {{ resultado.documento.revoked ? '✗' : '✓' }}
              </div>
              <div>
                <div :style="resultado.documento.revoked ? 'color:#9B1C1C' : 'color:#008C4C'" style="font-size:11px; font-weight:800; letter-spacing:0.1em; text-transform:uppercase; margin-bottom:4px;">
                  {{ resultado.documento.revoked ? 'Documento revogado' : 'Documento válido e autenticado' }}
                </div>
                <div style="font-size:22px; font-weight:900; text-transform:uppercase; letter-spacing:-0.5px; color:#1B231D;">{{ resultado.documento.doc_type }}</div>
                <div style="font-size:14px; color:#4F5E50; margin-top:4px;">{{ resultado.documento.cartorio_id }}</div>
              </div>
            </div>

            <!-- Campos limpos -->
            <div style="display:flex; flex-direction:column; gap:12px; margin-bottom:20px;">
              <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #EFE0BA; padding-bottom:12px;">
                <span style="font-size:12px; color:#4F5E50; font-weight:600;">Registrado em</span>
                <span style="font-size:14px; font-weight:700; color:#1B231D;">{{ formatarData(resultado.documento.registered_at) }}</span>
              </div>
              <div v-if="resultado.documento.viewkey_payload" style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #EFE0BA; padding-bottom:12px;">
                <span style="font-size:12px; color:#4F5E50; font-weight:600;">Privacidade do signatário</span>
                <span class="tag tag-green">ZCash ViewKey ativo</span>
              </div>
              <div v-if="resultado.documento.revoked" style="padding:12px; background:#FEF2F2; border:1.5px solid #9B1C1C;">
                <span style="font-size:13px; font-weight:700; color:#9B1C1C;">Motivo da revogação: {{ resultado.documento.revoke_reason || 'Não informado' }}</span>
              </div>
            </div>

          </div>

          <!-- Detalhes técnicos -->
          <div style="background:#EFE0BA; border-top:2px solid #D1C09F; padding:16px 24px;">
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
      carregando: false,
      erro: null as string | null,
      resultado: null as VerificarResult | null,
      detalhesAbertos: false,
    }
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
  },
})
</script>
