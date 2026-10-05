<template>
  <div class="min-h-screen flex flex-col" style="background:var(--color-ink)">
    <nav style="background:var(--color-ink); padding: 0 24px; height:52px; display:flex; align-items:center; justify-content:space-between; position:sticky; top:0; z-index:50;">
      <router-link to="/" style="display:flex; align-items:center; gap:10px; text-decoration:none;">
        <span style="font-family:var(--font-display); font-weight:900; font-size:16px; letter-spacing:0.04em; text-transform:uppercase; color:var(--color-text);">CartórioChain</span>
        <span class="tag tag-yellow" style="font-size:9px; padding:2px 7px;">Autenticidade Digital</span>
      </router-link>
      <div style="display:flex; gap:4px;">
        <router-link
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          style="font-family:var(--font-display); font-size:11px; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; text-decoration:none; padding:8px 14px; min-height:44px; display:inline-flex; align-items:center; cursor:pointer; transition:background 0.2s cubic-bezier(0.32,0.72,0,1), color 0.2s cubic-bezier(0.32,0.72,0,1);"
          :style="isActive(link.to)
            ? 'background:var(--color-yellow); color:var(--color-ink);'
            : 'color:var(--color-kraft);'"
        >{{ link.label }}</router-link>
      </div>
    </nav>
    <main class="flex-1">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'App',
  data() {
    return {
      links: [
        { to: '/',          label: 'Início'    },
        { to: '/servicos',  label: 'Serviços'  },
        { to: '/registrar', label: 'Registrar' },
        { to: '/verificar', label: 'Verificar' },
      ],
    }
  },
  methods: {
    isActive(to: string) {
      if (to === '/') return this.$route.path === '/'
      return this.$route.path.startsWith(to)
    },
  },
})
</script>

<style>
.page-enter-active, .page-leave-active {
  transition: opacity 0.28s cubic-bezier(0.32,0.72,0,1), transform 0.28s cubic-bezier(0.32,0.72,0,1);
}
.page-enter-from { opacity: 0; transform: translateY(14px); }
.page-leave-to  { opacity: 0; transform: translateY(-8px); }
</style>
