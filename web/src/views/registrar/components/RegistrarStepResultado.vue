<template>
  <div>
    <!-- Loading -->
    <div v-if="store.carregando" class="anim-fade card" style="display:flex; flex-direction:column; gap:20px;">
      <div style="font-size:13px; font-weight:800; text-transform:uppercase; letter-spacing:0.06em; color:#1B231D;">
        Autenticando...
      </div>
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
          <span style="font-size:13px; font-weight:600; color:#1B231D;">{{ step }}</span>
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

        <div style="display:flex; align-items:flex-start; gap:16px; padding-bottom:20px; border-bottom:2px solid #1B231D;">
          <div class="certificate-check">
            <span style="color:white; font-size:24px;">✓</span>
          </div>
          <div>
            <div style="font-size:11px; font-weight:800; letter-spacing:0.1em; text-transform:uppercase; color:#008C4C; margin-bottom:4px;">
              Documento autenticado
            </div>
            <div style="font-size:20px; font-weight:900; text-transform:uppercase; letter-spacing:-0.5px; color:#1B231D;">
              {{ store.docType }}
            </div>
            <div style="font-size:13px; color:#4F5E50; margin-top:4px;">CartórioChain</div>
          </div>
        </div>

        <div style="padding:16px 0; display:flex; flex-direction:column; gap:10px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span style="font-size:12px; color:#4F5E50; font-weight:600;">Registrado em</span>
            <span style="font-size:13px; font-weight:700; color:#1B231D;">{{ formatarData(store.resultado.registered_at) }}</span>
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span style="font-size:12px; color:#4F5E50; font-weight:600;">Pagamento</span>
            <span class="tag tag-green">PIX confirmado ✓</span>
          </div>
          <div v-if="store.resultado.viewkey_payload" style="display:flex; justify-content:space-between; align-items:center;">
            <span style="font-size:12px; color:#4F5E50; font-weight:600;">Privacidade</span>
            <span class="tag tag-green">Dados protegidos ✓</span>
          </div>
        </div>

        <div style="padding:16px 0 0; border-top:2px solid #EFE0BA; display:flex; gap:10px; flex-wrap:wrap;">
          <button class="btn btn-primary btn-sm" @click="copiarLink">↗ Copiar link de verificação</button>
          <button class="btn btn-secondary btn-sm" @click="verificarAgora">◎ Verificar agora</button>
        </div>
      </div>

      <!-- Detalhes técnicos (colapsável) -->
      <div style="background:#EFE0BA; border-top:2px solid #D1C09F; padding:16px 24px;">
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
