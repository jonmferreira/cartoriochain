<template>
  <div style="background:#1B231D; min-height:100vh; padding:40px 24px;">
    <div style="max-width:600px; margin:0 auto; display:flex; flex-direction:column; gap:28px;">

      <!-- Header -->
      <div class="anim-slide-up">
        <div style="font-size:11px; font-weight:800; letter-spacing:0.1em; text-transform:uppercase; color:#4F5E50; margin-bottom:8px;">
          Cartório Digital
        </div>
        <h1 style="font-family:var(--font-display); font-weight:900; font-size:32px; text-transform:uppercase; letter-spacing:-1px; color:#F7EACB; line-height:1;">
          Registrar documento
        </h1>
      </div>

      <RegistrarSteps class="anim-slide-up anim-delay-1" :etapa="store.etapa" :etapas="ETAPAS" />

      <!-- Banner demo MCMV -->
      <div v-if="store.modoDemo" class="anim-fade" style="background:#FFD23F; border:2px solid #1B231D; padding:12px 16px; display:flex; align-items:center; gap:10px;">
        <span style="font-size:16px;">🏠</span>
        <span style="font-size:13px; font-weight:700; color:#1B231D;">
          Demo MCMV — Escritura pré-preenchida. Clique em avançar para ver o fluxo completo.
        </span>
      </div>

      <RegistrarStepDocumento    v-if="store.etapa === 1" />
      <RegistrarStepInformacoes  v-if="store.etapa === 2" />
      <RegistrarStepPagamento    v-if="store.etapa === 3" />
      <RegistrarStepResultado    v-if="store.etapa === 4" />

    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { useRegistrarStore } from '../../stores/registrar'
import {
  RegistrarSteps,
  RegistrarStepDocumento,
  RegistrarStepInformacoes,
  RegistrarStepPagamento,
  RegistrarStepResultado,
} from './components'

const ETAPAS = ['Documento', 'Informações', 'Pagamento', 'Resultado']

export default defineComponent({
  name: 'RegistrarView',
  components: {
    RegistrarSteps,
    RegistrarStepDocumento,
    RegistrarStepInformacoes,
    RegistrarStepPagamento,
    RegistrarStepResultado,
  },
  setup() {
    const store = useRegistrarStore()
    const route = useRoute()

    // Pré-preenche dados do demo MCMV se ?demo=mcmv
    if (route.query.demo === 'mcmv') {
      store.preencherDemo()
    }

    // Limpa o store ao sair da página
    onBeforeUnmount(() => store.limpar())

    return { store, ETAPAS }
  },
})
</script>
