<template>
  <div class="page" style="padding:40px 24px;">
    <div class="wrap-sm" style="display:flex; flex-direction:column; gap:28px;">

      <!-- Header -->
      <div class="anim-slide-up">
        <div class="eyebrow" style="margin-bottom:8px;">Cartório Digital</div>
        <h1 class="page-title">Registrar documento</h1>
      </div>

      <RegistrarSteps class="anim-slide-up anim-delay-1" :etapa="store.etapa" :etapas="ETAPAS" />

      <!-- Banner demo MCMV -->
      <div v-if="store.modoDemo" class="anim-fade" style="background:var(--color-yellow); border:2px solid var(--color-ink); padding:12px 16px; display:flex; align-items:center; gap:10px;">
        <span style="font-size:16px;">🏠</span>
        <span style="font-size:13px; font-weight:700; color:var(--color-ink);">
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

    if (route.query.demo === 'mcmv') {
      store.preencherDemo()
    }

    onBeforeUnmount(() => store.limpar())

    return { store, ETAPAS }
  },
})
</script>
