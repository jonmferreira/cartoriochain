<template>
  <div class="min-h-screen bg-surface-50">

    <!-- Hero -->
    <section class="bg-white border-b border-surface-100 px-6 py-16 text-center">
      <div class="max-w-2xl mx-auto flex flex-col items-center gap-6">
        <div class="flex items-center gap-2 bg-primary-50 border border-primary-100 rounded-full px-4 py-1.5">
          <i class="pi pi-shield text-primary-600 text-sm" />
          <span class="text-xs font-semibold text-primary-700">Solana · ZK Proof · ZCash ViewKey · Irys</span>
        </div>

        <h1 class="text-5xl font-bold text-surface-900 leading-tight">
          Cartório digital<br />
          <span class="text-primary-600">descentralizado</span>
        </h1>

        <p class="text-lg text-surface-500 max-w-lg">
          Registre e verifique documentos com prova criptográfica de autenticidade.
          Dados do signatário protegidos por ZCash ViewKey — LGPD nativa.
        </p>

        <div class="flex gap-3 flex-wrap justify-center">
          <Button
            label="Registrar documento"
            icon="pi pi-plus-circle"
            size="large"
            @click="$router.push('/registrar')"
          />
          <Button
            label="Verificar autenticidade"
            icon="pi pi-search"
            size="large"
            severity="secondary"
            @click="$router.push('/verificar')"
          />
        </div>
      </div>
    </section>

    <!-- Problema -->
    <section class="px-6 py-12">
      <div class="max-w-3xl mx-auto">
        <div class="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex gap-4">
          <i class="pi pi-exclamation-triangle text-amber-500 text-2xl mt-1 shrink-0" />
          <div>
            <p class="font-semibold text-amber-800 text-lg">O problema no Brasil</p>
            <p class="text-amber-700 mt-1">
              Programas habitacionais como o <strong>Minha Casa Minha Vida</strong> movimentam
              bilhões em contratos de financiamento. Documentos são falsificados, se perdem
              ou ficam inacessíveis. Cartórios tradicionais são lentos, caros e centralizados.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Recursos -->
    <section class="px-6 pb-12">
      <div class="max-w-3xl mx-auto flex flex-col gap-6">
        <h2 class="text-2xl font-bold text-surface-900 text-center">Como funciona</h2>
        <div class="grid grid-cols-1 gap-4">
          <Card v-for="recurso in recursos" :key="recurso.titulo">
            <template #content>
              <div class="flex items-start gap-4">
                <div class="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                  <i :class="recurso.icone" class="text-primary-600" />
                </div>
                <div>
                  <p class="font-semibold text-surface-900">{{ recurso.titulo }}</p>
                  <p class="text-surface-500 text-sm mt-0.5">{{ recurso.descricao }}</p>
                </div>
              </div>
            </template>
          </Card>
        </div>
      </div>
    </section>

    <!-- Casos de uso -->
    <section class="bg-white border-t border-surface-100 px-6 py-12">
      <div class="max-w-3xl mx-auto flex flex-col gap-6">
        <h2 class="text-2xl font-bold text-surface-900 text-center">Para quem é</h2>
        <div class="grid grid-cols-2 gap-4">
          <div
            v-for="caso in casos"
            :key="caso.label"
            class="border border-surface-200 rounded-xl p-4 flex flex-col gap-2 bg-surface-50"
          >
            <div class="flex items-center gap-2">
              <i :class="caso.icone" class="text-primary-600" />
              <span class="font-semibold text-surface-800 text-sm">{{ caso.label }}</span>
            </div>
            <p class="text-surface-500 text-sm">{{ caso.descricao }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA final -->
    <section class="px-6 py-12 text-center">
      <div class="max-w-lg mx-auto flex flex-col items-center gap-4">
        <p class="text-surface-500 text-sm">Experimente o demo — sem carteira, sem conta</p>
        <Button
          label="Ver demo: registrar escritura MCMV"
          icon="pi pi-play"
          size="large"
          @click="abrirDemoMCMV"
        />
      </div>
    </section>

  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Card from 'primevue/card'
import Button from 'primevue/button'
import { getRecursos, getCasosUso } from './integrations'
import type { RecursoItem, CasoUso } from './types'

export default defineComponent({
  name: 'HomeView',
  components: { Card, Button },

  data() {
    return {
      recursos: [] as RecursoItem[],
      casos: [] as CasoUso[],
    }
  },

  created() {
    this.recursos = getRecursos()
    this.casos = getCasosUso()
  },

  methods: {
    abrirDemoMCMV() {
      this.$router.push({
        path: '/registrar',
        query: { demo: 'mcmv' },
      })
    },
  },
})
</script>
