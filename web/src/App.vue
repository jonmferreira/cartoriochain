<template>
  <div class="min-h-screen flex flex-col" style="background:var(--color-ink)">
    <nav class="app-nav">
      <router-link to="/" class="app-nav-logo">
        <span class="app-nav-brand">CartórioChain</span>
      </router-link>
      <div class="app-nav-links">
        <router-link
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="nav-link"
          :class="isActive(link.to) ? 'nav-link--active' : 'nav-link--idle'"
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
/* ── Nav ─────────────────────────────────────────── */
.app-nav {
  background: var(--color-ink-1);
  border-bottom: 1px solid var(--color-ink-3);
  padding: 0 24px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 50;
}
.app-nav-logo  { display: flex; align-items: center; gap: 10px; text-decoration: none; }
.app-nav-brand {
  font-family: var(--font-display);
  font-weight: 900;
  font-size: 16px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--color-text);
}
.app-nav-links { display: flex; gap: 4px; }
.nav-link {
  font-family: var(--font-display);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  text-decoration: none;
  padding: 8px 14px;
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  transition: background 0.2s cubic-bezier(0.32,0.72,0,1), color 0.2s cubic-bezier(0.32,0.72,0,1);
}
.nav-link--active { background: var(--color-yellow); color: var(--color-ink); }
.nav-link--idle   { color: var(--color-kraft); }

/* ── Page transitions ────────────────────────────── */
.page-enter-active, .page-leave-active {
  transition: opacity 0.15s cubic-bezier(0.32,0.72,0,1), transform 0.15s cubic-bezier(0.32,0.72,0,1);
}
.page-enter-from { opacity: 0; transform: translateY(14px); }
.page-leave-to  { opacity: 0; transform: translateY(-8px); }
</style>
