<template>
  <div class="anim-slide-up reg-step-pag">

    <div class="card reg-pix-card">

      <!-- Cabeçalho verde com valor + QR -->
      <div class="reg-pix-header">
        <div class="reg-pix-header-info">
          <div class="reg-pix-eyebrow">Taxa de autenticação</div>
          <div class="reg-pix-amount">R$&nbsp;5,00</div>
          <div class="reg-pix-subtitle">{{ store.docType }} — CartórioChain</div>
        </div>

        <!-- QR code mock -->
        <div class="reg-pix-qr">
          <svg width="88" height="88" viewBox="0 0 100 100" fill="none">
            <rect x="5"  y="5"  width="30" height="30" fill="none" stroke="var(--color-ink)" stroke-width="4"/>
            <rect x="12" y="12" width="16" height="16" fill="var(--color-ink)"/>
            <rect x="65" y="5"  width="30" height="30" fill="none" stroke="var(--color-ink)" stroke-width="4"/>
            <rect x="72" y="12" width="16" height="16" fill="var(--color-ink)"/>
            <rect x="5"  y="65" width="30" height="30" fill="none" stroke="var(--color-ink)" stroke-width="4"/>
            <rect x="12" y="72" width="16" height="16" fill="var(--color-ink)"/>
            <rect x="44" y="5"  width="6" height="6" fill="var(--color-ink)"/>
            <rect x="52" y="5"  width="6" height="6" fill="var(--color-ink)"/>
            <rect x="44" y="13" width="6" height="6" fill="var(--color-ink)"/>
            <rect x="52" y="21" width="6" height="6" fill="var(--color-ink)"/>
            <rect x="44" y="29" width="6" height="6" fill="var(--color-ink)"/>
            <rect x="44" y="44" width="6" height="6" fill="var(--color-ink)"/>
            <rect x="52" y="44" width="6" height="6" fill="var(--color-ink)"/>
            <rect x="60" y="44" width="6" height="6" fill="var(--color-ink)"/>
            <rect x="44" y="52" width="6" height="6" fill="var(--color-ink)"/>
            <rect x="60" y="60" width="6" height="6" fill="var(--color-ink)"/>
            <rect x="68" y="52" width="6" height="6" fill="var(--color-ink)"/>
            <rect x="76" y="44" width="6" height="6" fill="var(--color-ink)"/>
            <rect x="84" y="52" width="6" height="6" fill="var(--color-ink)"/>
            <rect x="44" y="68" width="6" height="6" fill="var(--color-ink)"/>
            <rect x="52" y="76" width="6" height="6" fill="var(--color-ink)"/>
            <rect x="60" y="68" width="6" height="6" fill="var(--color-ink)"/>
            <rect x="68" y="76" width="6" height="6" fill="var(--color-ink)"/>
            <rect x="76" y="68" width="6" height="6" fill="var(--color-ink)"/>
            <rect x="84" y="76" width="6" height="6" fill="var(--color-ink)"/>
            <rect x="84" y="84" width="6" height="6" fill="var(--color-ink)"/>
          </svg>
          <div class="reg-pix-qr-label">PIX</div>
        </div>
      </div>

      <!-- Chave PIX -->
      <div class="reg-pix-body">
        <div style="display:flex; flex-direction:column; gap:6px;">
          <div class="eyebrow">Chave PIX</div>
          <div class="reg-pix-key-row">
            <span class="reg-pix-key-val">{{ pixKey }}</span>
            <button class="btn btn-secondary btn-sm" style="flex-shrink:0;" @click="copiarChave">
              {{ copiado ? '✓ Copiado' : 'Copiar' }}
            </button>
          </div>
        </div>

        <div class="reg-pix-hint">
          Escaneie o QR code ou copie a chave PIX.<br>
          O registro é confirmado automaticamente após o pagamento.
        </div>
      </div>
    </div>

    <!-- Confirmando... -->
    <div v-if="confirmando" class="anim-fade reg-confirming">
      <div class="spinner" />
      <span class="reg-confirming-txt">Confirmando pagamento...</span>
    </div>

    <div v-if="!confirmando" class="reg-pag-actions">
      <button class="btn btn-secondary btn-sm" @click="store.etapa = 2">← Voltar</button>
      <button class="btn btn-primary" @click="confirmar">
        ✓ Já paguei — Continuar
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { useRegistrarStore } from '../../../stores/registrar'

export default defineComponent({
  name: 'RegistrarStepPagamento',
  setup() {
    const store = useRegistrarStore()
    const copiado = ref(false)
    const confirmando = ref(false)

    const pixKey = computed(() => {
      const seed = store.docIdSeed || store.docType || 'doc'
      let h = 0
      for (let i = 0; i < seed.length; i++) h = ((h << 5) - h) + seed.charCodeAt(i)
      const id = Math.abs(h).toString(36).slice(0, 6).padEnd(6, '0')
      return `pix+${id}@cartoriochain.com.br`
    })

    async function copiarChave() {
      await navigator.clipboard.writeText(pixKey.value)
      copiado.value = true
      setTimeout(() => { copiado.value = false }, 2000)
    }

    async function confirmar() {
      confirmando.value = true
      await new Promise(r => setTimeout(r, 1500))
      confirmando.value = false
      store.registrar()
    }

    return { store, copiado, confirmando, pixKey, copiarChave, confirmar }
  },
})
</script>
