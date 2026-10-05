<template>
  <div class="anim-slide-up" style="display:flex; flex-direction:column; gap:20px;">

    <div class="card" style="display:flex; flex-direction:column; gap:0; overflow:hidden;">

      <!-- Cabeçalho verde com valor + QR -->
      <div style="background:#008C4C; padding:20px 24px; display:flex; align-items:center; justify-content:space-between; gap:20px;">
        <div style="flex:1;">
          <div style="font-size:11px; font-weight:800; letter-spacing:0.1em; text-transform:uppercase; color:#A8D5B5; margin-bottom:6px;">
            Taxa de autenticação
          </div>
          <div style="font-size:40px; font-weight:900; color:white; font-family:var(--font-display); letter-spacing:-1px;">
            R$&nbsp;5,00
          </div>
          <div style="font-size:13px; color:#A8D5B5; margin-top:4px;">
            {{ store.docType }} — CartórioChain
          </div>
        </div>

        <!-- QR code mock -->
        <div style="width:120px; height:120px; background:#FFD23F; padding:8px; flex-shrink:0; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4px;">
          <svg width="88" height="88" viewBox="0 0 100 100" fill="none">
            <rect x="5"  y="5"  width="30" height="30" fill="none" stroke="#1B231D" stroke-width="4"/>
            <rect x="12" y="12" width="16" height="16" fill="#1B231D"/>
            <rect x="65" y="5"  width="30" height="30" fill="none" stroke="#1B231D" stroke-width="4"/>
            <rect x="72" y="12" width="16" height="16" fill="#1B231D"/>
            <rect x="5"  y="65" width="30" height="30" fill="none" stroke="#1B231D" stroke-width="4"/>
            <rect x="12" y="72" width="16" height="16" fill="#1B231D"/>
            <rect x="44" y="5"  width="6" height="6" fill="#1B231D"/>
            <rect x="52" y="5"  width="6" height="6" fill="#1B231D"/>
            <rect x="44" y="13" width="6" height="6" fill="#1B231D"/>
            <rect x="52" y="21" width="6" height="6" fill="#1B231D"/>
            <rect x="44" y="29" width="6" height="6" fill="#1B231D"/>
            <rect x="44" y="44" width="6" height="6" fill="#1B231D"/>
            <rect x="52" y="44" width="6" height="6" fill="#1B231D"/>
            <rect x="60" y="44" width="6" height="6" fill="#1B231D"/>
            <rect x="44" y="52" width="6" height="6" fill="#1B231D"/>
            <rect x="60" y="60" width="6" height="6" fill="#1B231D"/>
            <rect x="68" y="52" width="6" height="6" fill="#1B231D"/>
            <rect x="76" y="44" width="6" height="6" fill="#1B231D"/>
            <rect x="84" y="52" width="6" height="6" fill="#1B231D"/>
            <rect x="44" y="68" width="6" height="6" fill="#1B231D"/>
            <rect x="52" y="76" width="6" height="6" fill="#1B231D"/>
            <rect x="60" y="68" width="6" height="6" fill="#1B231D"/>
            <rect x="68" y="76" width="6" height="6" fill="#1B231D"/>
            <rect x="76" y="68" width="6" height="6" fill="#1B231D"/>
            <rect x="84" y="76" width="6" height="6" fill="#1B231D"/>
            <rect x="84" y="84" width="6" height="6" fill="#1B231D"/>
          </svg>
          <div style="font-size:8px; font-weight:800; color:#1B231D; letter-spacing:0.08em;">PIX</div>
        </div>
      </div>

      <!-- Chave PIX -->
      <div style="padding:24px; display:flex; flex-direction:column; gap:20px;">

        <!-- Chave PIX -->
        <div style="width:100%; display:flex; flex-direction:column; gap:6px;">
          <div style="font-size:11px; font-weight:800; letter-spacing:0.08em; text-transform:uppercase; color:#4F5E50;">
            Chave PIX
          </div>
          <div style="display:flex; align-items:center; gap:8px; background:#EFE0BA; border:2px solid #D1C09F; padding:12px 14px;">
            <span style="flex:1; font-size:14px; font-weight:700; color:#1B231D; font-family:monospace; word-break:break-all;">
              {{ pixKey }}
            </span>
            <button class="btn btn-secondary btn-sm" style="flex-shrink:0;" @click="copiarChave">
              {{ copiado ? '✓ Copiado' : 'Copiar' }}
            </button>
          </div>
        </div>

        <div style="font-size:12px; color:#4F5E50; text-align:center; line-height:1.6;">
          Escaneie o QR code ou copie a chave PIX.<br>
          O registro é confirmado automaticamente após o pagamento.
        </div>

      </div>
    </div>

    <!-- Confirmando... -->
    <div v-if="confirmando" class="anim-fade" style="display:flex; align-items:center; gap:12px; padding:14px 18px; background:#EFE0BA; border:2px solid #D1C09F;">
      <div class="spinner" />
      <span style="font-size:13px; font-weight:700; color:#1B231D;">Confirmando pagamento...</span>
    </div>

    <div v-if="!confirmando" style="display:flex; gap:12px; justify-content:space-between;">
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

    // Chave PIX única por documento — rastreável via docIdSeed
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
