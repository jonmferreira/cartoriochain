<template>
  <div class="page reg-root">
    <div class="wrap-sm reg-stack">

      <!-- Header -->
      <div class="anim-slide-up">
        <div class="eyebrow" style="margin-bottom:8px;">Cartório Digital</div>
        <h1 class="page-title">Registrar documento</h1>
      </div>

      <RegistrarSteps class="anim-slide-up anim-delay-1" :etapa="store.etapa" :etapas="ETAPAS" />

      <!-- Banner demo MCMV -->
      <div v-if="store.modoDemo" class="anim-fade reg-demo-banner">
        <span style="font-size:16px;">🏠</span>
        <span class="reg-demo-text">
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

<style src="./registrar.css"></style>
