<template>
  <div>
    <!-- Loading -->
    <div v-if="store.carregando" class="anim-fade card" style="display:flex; flex-direction:column; gap:20px;">
      <div class="eyebrow" style="letter-spacing:0.06em;">Autenticando...</div>
      <div class="progress-track">
        <div class="progress-fill" :style="`width:${progressoPct}%;`" />
      </div>
      <div style="display:flex; flex-direction:column; gap:0;">
        <div
          v-for="(step, i) in steps"
          :key="i"
          class="loading-step"
          :class="{ active: store.loadingEtapa === i, done: store.loadingEtapa > i }"
        >
          <div class="loading-dot" />
          <span class="body-sm" style="color:var(--color-text);">{{ step }}</span>
        </div>
      </div>
    </div>

    <!-- Erro -->
    <div v-if="store.erro && !store.carregando" class="anim-fade msg-error">
      <span>⚠</span>
      <span>{{ store.erro }}</span>
    </div>

    <!-- Certificado -->
    <div v-if="store.resultado && !store.carregando" class="certificate">
      <div style="padding:24px 24px 0;">

        <div style="display:flex; align-items:flex-start; gap:16px; padding-bottom:20px; border-bottom:2px solid var(--color-ink-3);">
          <div class="certificate-check">
            <span style="color:white; font-size:24px;">✓</span>
          </div>
          <div>
            <div class="eyebrow" style="color:var(--color-emerald); margin-bottom:4px;">Documento autenticado</div>
            <div style="font-size:20px; font-weight:900; text-transform:uppercase; letter-spacing:-0.5px; color:var(--color-text);">
              {{ store.docType }}
            </div>
            <div class="body-sm" style="margin-top:4px;">CartórioChain</div>
          </div>
        </div>

        <div style="padding:16px 0; display:flex; flex-direction:column; gap:10px;">
          <div class="data-row">
            <span class="data-row-label">Registrado em</span>
            <span class="data-row-value">{{ formatarData(store.resultado.registered_at) }}</span>
          </div>
          <div class="data-row">
            <span class="data-row-label">Pagamento</span>
            <span class="tag tag-green">PIX confirmado ✓</span>
          </div>
          <div v-if="store.resultado.viewkey_payload" class="data-row">
            <span class="data-row-label">Privacidade</span>
            <span class="tag tag-green">Dados protegidos ✓</span>
          </div>
        </div>

        <div style="padding:16px 0 0; border-top:2px solid var(--color-ink-3); display:flex; gap:10px; flex-wrap:wrap;">
          <button class="btn btn-primary btn-sm" @click="copiarLink">↗ Copiar link de verificação</button>
          <button class="btn btn-secondary btn-sm" @click="verificarAgora">◎ Verificar agora</button>
        </div>
      </div>

      <!-- Detalhes técnicos -->
      <div style="border-top:2px solid var(--color-ink-3); padding:16px 24px;">
        <button class="tech-toggle" @click="detalhesAbertos = !detalhesAbertos">
          <span>{{ detalhesAbertos ? '▲' : '▼' }}</span>
          Detalhes técnicos
        </button>
        <div v-if="detalhesAbertos" class="tech-grid">
          <div class="tech-row"><span class="tech-label">Doc ID</span><span class="tech-val">{{ store.resultado.docId }}</span></div>
          <div class="tech-row"><span class="tech-label">Hash SHA-256</span><span class="tech-val">{{ store.resultado.doc_hash }}</span></div>
          <div class="tech-row"><span class="tech-label">Irys TX</span><span class="tech-val">{{ store.resultado.irys_tx_id }}</span></div>
          <div class="tech-row"><span class="tech-label">ZK Commitment</span><span class="tech-val">{{ store.resultado.signer_commitment }}</span></div>
          <div v-if="store.resultado.tempo_tx_hash" class="tech-row"><span class="tech-label">Tempo TX</span><span class="tech-val">{{ store.resultado.tempo_tx_hash }}</span></div>
          <div v-if="store.resultado.pda" class="tech-row"><span class="tech-label">Solana PDA</span><span class="tech-val">{{ store.resultado.pda }}</span></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useRegistrarStore } from '../../../stores/registrar'
import { LOADING_STEPS } from '../../../stores/registrar'

export default defineComponent({
  name: 'RegistrarStepResultado',
  setup() {
    const store = useRegistrarStore()
    const router = useRouter()
    const detalhesAbertos = ref(false)

    const progressoPct = computed(() =>
      Math.round(((store.loadingEtapa + 0.5) / LOADING_STEPS.length) * 100)
    )

    function formatarData(ts: number) {
      return new Date(ts * 1000).toLocaleString('pt-BR', { dateStyle: 'long', timeStyle: 'short' })
    }

    function copiarLink() {
      if (store.resultado) navigator.clipboard.writeText(store.resultado.verificarUrl)
    }

    function verificarAgora() {
      if (store.resultado) router.push(`/verificar/${store.resultado.docId}`)
    }

    return { store, steps: LOADING_STEPS, progressoPct, detalhesAbertos, formatarData, copiarLink, verificarAgora }
  },
})
</script>
