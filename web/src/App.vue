<template>
  <div class="min-h-screen flex flex-col" style="background:var(--color-ink)">
    <nav class="app-nav">
      <router-link to="/" class="app-nav-logo">
        <span class="app-nav-brand">CartórioChain</span>
      </router-link>
      <div class="app-nav-right">
        <div class="app-nav-links">
          <router-link
            v-for="link in links"
            :key="link.to"
            :to="link.to"
            class="nav-link"
            :class="isActive(link.to) ? 'nav-link--active' : 'nav-link--idle'"
          >{{ t(link.key) }}</router-link>
        </div>
        <div class="app-lang" role="group" :aria-label="t('lang.aria')">
          <button
            class="app-lang-btn"
            :class="{ 'app-lang-btn--active': locale === 'pt' }"
            @click="switchLang('pt')"
          >{{ t('lang.pt') }}</button>
          <button
            class="app-lang-btn"
            :class="{ 'app-lang-btn--active': locale === 'en' }"
            @click="switchLang('en')"
          >{{ t('lang.en') }}</button>
        </div>
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
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { setLocale } from './i18n'

export default defineComponent({
  name: 'App',
  setup() {
    const { t, locale } = useI18n()
    const route = useRoute()
    const links = [
      { to: '/',          key: 'nav.inicio'    },
      { to: '/servicos',  key: 'nav.servicos'  },
      { to: '/registrar', key: 'nav.registrar' },
      { to: '/verificar', key: 'nav.verificar' },
    ]
    const isActive = (to: string) =>
      to === '/' ? route.path === '/' : route.path.startsWith(to)
    const switchLang = (l: 'pt' | 'en') => setLocale(l)
    return { t, locale, links, isActive, switchLang }
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

/* ── Idioma (PT/EN) ──────────────────────────────── */
.app-nav-right { display: flex; align-items: center; gap: 12px; min-width: 0; }
.app-lang { display: flex; border: 1px solid var(--color-ink-3); flex-shrink: 0; }
.app-lang-btn {
  font-family: var(--font-display);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.06em;
  padding: 0 10px;
  min-height: 44px;
  cursor: pointer;
  background: transparent;
  color: var(--color-kraft);
  border: none;
  transition: background 0.2s cubic-bezier(0.32,0.72,0,1), color 0.2s cubic-bezier(0.32,0.72,0,1);
}
.app-lang-btn--active { background: var(--color-yellow); color: var(--color-ink); }
.app-lang-btn:focus-visible { outline: 2px solid var(--color-yellow); outline-offset: -2px; }

/* Mobile: compacta a nav e deixa os links rolarem dentro da barra
   (evita overflow horizontal da página inteira em telas pequenas). */
@media (max-width: 560px) {
  .app-nav { padding: 0 12px; }
  .app-nav-brand { font-size: 13px; }
  .app-nav-right { gap: 8px; }
  .app-nav-links {
    gap: 2px;
    min-width: 0;
    overflow-x: auto;
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
  }
  .app-nav-links::-webkit-scrollbar { display: none; }
  .nav-link { padding: 8px 10px; font-size: 10px; flex-shrink: 0; }
}

/* ── Page transitions ────────────────────────────── */
.page-enter-active, .page-leave-active {
  transition: opacity 0.15s cubic-bezier(0.32,0.72,0,1), transform 0.15s cubic-bezier(0.32,0.72,0,1);
}
.page-enter-from { opacity: 0; transform: translateY(14px); }
.page-leave-to  { opacity: 0; transform: translateY(-8px); }
</style>
