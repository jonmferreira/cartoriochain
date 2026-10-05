<template>
  <div class="anim-slide-up" style="display:flex; flex-direction:column; gap:20px;">
    <div class="card" style="display:flex; flex-direction:column; gap:18px;">

      <div>
        <label class="label">Tipo do documento</label>
        <input
          v-model="store.docType"
          list="doc-types"
          class="inp"
          placeholder="Selecione ou digite o tipo..."
          maxlength="64"
          autocomplete="off"
        />
        <datalist id="doc-types">
          <option value="Escritura Pública de Compra e Venda"/>
          <option value="Contrato de Compromisso de Compra e Venda"/>
          <option value="Habite-se"/>
          <option value="Laudo de Avaliação de Imóvel"/>
          <option value="Memorial de Incorporação"/>
          <option value="Procuração"/>
          <option value="Contrato Social"/>
          <option value="Ata Notarial"/>
          <option value="Reconhecimento de Firma"/>
          <option value="Escritura MCMV"/>
        </datalist>
      </div>

      <!-- Privacidade — painel avançado (sem menção a ZCash para o usuário comum) -->
      <div class="vk-section">
        <button class="vk-toggle" @click="vkAberto = !vkAberto">
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="square" aria-hidden="true">
            <rect x="1.5" y="5.5" width="10" height="6"/>
            <path d="M4 5.5V3.5a2.5 2.5 0 0 1 5 0v2"/>
          </svg>
          <span>Privacidade avançada</span>
          <span style="margin-left:4px; color:#D1C09F;">{{ vkAberto ? '▲' : '▼' }}</span>
        </button>
        <p style="font-size:12px; color:#D1C09F; margin-top:6px; line-height:1.5;">
          Cifra os dados do signatário. Só você pode acessá-los com sua chave pessoal — LGPD nativa.
        </p>
        <div v-if="vkAberto" style="margin-top:12px; display:flex; align-items:center; gap:8px; padding:10px 14px; background:#2C3A2F; border:1.5px solid #4F5E50;">
          <svg width="14" height="14" viewBox="0 0 13 13" fill="none" stroke="#008C4C" stroke-width="1.8" stroke-linecap="square" aria-hidden="true">
            <rect x="1.5" y="5.5" width="10" height="6"/>
            <path d="M4 5.5V3.5a2.5 2.5 0 0 1 5 0v2"/>
          </svg>
          <span style="font-size:12px; font-weight:700; color:#008C4C; text-transform:uppercase; letter-spacing:0.06em;">Privacidade ativa</span>
        </div>
      </div>
    </div>

    <div style="display:flex; gap:12px; justify-content:space-between;">
      <button class="btn btn-secondary btn-sm" @click="store.etapa = 1">← Voltar</button>
      <button
        class="btn btn-primary"
        :disabled="!store.docType"
        @click="store.etapa = 3"
      >
        Avançar →
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRegistrarStore } from '../../../stores/registrar'

export default defineComponent({
  name: 'RegistrarStepInformacoes',
  setup() {
    return { store: useRegistrarStore(), vkAberto: ref(false) }
  },
})
</script>
