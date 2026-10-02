<template>
  <div class="min-h-screen flex flex-col">
    <nav class="bg-white border-b border-surface-200 px-6 py-3 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <i class="pi pi-shield text-primary-600 text-xl" />
        <span class="font-bold text-surface-900 text-lg">CartórioChain</span>
        <span class="text-xs text-surface-400 ml-1">Solana · ZK · Irys</span>
      </div>
      <div class="flex gap-1">
        <router-link
          to="/"
          class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          :class="$route.name === 'home'
            ? 'bg-primary-50 text-primary-700'
            : 'text-surface-600 hover:bg-surface-50'"
        >
          <i class="pi pi-home mr-1" />Início
        </router-link>
        <router-link
          to="/registrar"
          class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          :class="$route.name === 'registrar'
            ? 'bg-primary-50 text-primary-700'
            : 'text-surface-600 hover:bg-surface-50'"
        >
          <i class="pi pi-plus-circle mr-1" />Registrar
        </router-link>
        <router-link
          to="/verificar"
          class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          :class="$route.name === 'verificar' || $route.name === 'verificar-doc'
            ? 'bg-primary-50 text-primary-700'
            : 'text-surface-600 hover:bg-surface-50'"
        >
          <i class="pi pi-search mr-1" />Verificar
        </router-link>
      </div>
    </nav>
    <main class="flex-1">
      <router-view />
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'App',
})
</script>
