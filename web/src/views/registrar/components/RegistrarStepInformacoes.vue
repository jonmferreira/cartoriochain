<template>
  <div class="anim-slide-up reg-step-doc">
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
          <option value="Prova de Anterioridade — Ideia"/>
          <option value="Prova de Anterioridade — Obra"/>
          <option value="Prova de Anterioridade — Software"/>
          <option value="Prova de Anterioridade — Invenção"/>
        </datalist>
      </div>

      <!-- Guide block: Propriedade Intelectual -->
      <div v-if="isPI" class="reg-pi-guide">
        <div class="reg-pi-guide-head">
          <span class="reg-pi-guide-icon">◈</span>
          <span class="reg-pi-guide-title">Prova de Anterioridade Criptográfica</span>
        </div>
        <p class="reg-pi-guide-body">
          CartórioChain registra um timestamp imutável da sua ideia on-chain por R$5.
          Quando você chegar no INPI, ninguém vai poder contestar que a ideia não era sua.
        </p>
        <div class="reg-pi-steps">
          <div class="reg-pi-step-head">
            <span>Serviço INPI</span>
            <span>Custo</span>
            <span>Prazo</span>
          </div>
          <div class="reg-pi-step">
            <span class="reg-pi-step-tipo">Software (e-Software)</span>
            <span class="reg-pi-step-custo">R$160</span>
            <span class="reg-pi-step-prazo">Menos de 7 dias</span>
          </div>
          <div class="reg-pi-step">
            <span class="reg-pi-step-tipo">Marca (por classe)</span>
            <span class="reg-pi-step-custo">R$440–1.720</span>
            <span class="reg-pi-step-prazo">18–36 meses</span>
          </div>
          <div class="reg-pi-step">
            <span class="reg-pi-step-tipo">Patente de Invenção</span>
            <span class="reg-pi-step-custo">R$500–2.400</span>
            <span class="reg-pi-step-prazo">7–10 anos</span>
          </div>
        </div>
        <div class="reg-pi-guide-foot">
          Registre aqui primeiro. Leve a prova ao INPI com o timestamp já garantido em blockchain.
        </div>
      </div>

      <!-- Privacidade — painel avançado (sem menção a ZCash para o usuário comum) -->
      <div class="vk-section">
        <button class="vk-toggle" @click="vkAberto = !vkAberto">
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="square" aria-hidden="true">
            <rect x="1.5" y="5.5" width="10" height="6"/>
            <path d="M4 5.5V3.5a2.5 2.5 0 0 1 5 0v2"/>
          </svg>
          <span>Privacidade avançada</span>
          <span style="margin-left:4px; color:var(--color-kraft);">{{ vkAberto ? '▲' : '▼' }}</span>
        </button>
        <p style="font-size:12px; color:var(--color-kraft); margin-top:6px; line-height:1.5;">
          Cifra os dados do signatário. Só você pode acessá-los com sua chave pessoal — LGPD nativa.
        </p>
        <div v-if="vkAberto" style="margin-top:12px; display:flex; align-items:center; gap:8px; padding:10px 14px; background:var(--color-ink-2); border:1.5px solid var(--color-ink-4);">
          <svg width="14" height="14" viewBox="0 0 13 13" fill="none" stroke-width="1.8" stroke-linecap="square" aria-hidden="true" style="stroke:var(--color-emerald);">
            <rect x="1.5" y="5.5" width="10" height="6"/>
            <path d="M4 5.5V3.5a2.5 2.5 0 0 1 5 0v2"/>
          </svg>
          <span style="font-size:12px; font-weight:700; color:var(--color-emerald); text-transform:uppercase; letter-spacing:0.06em;">Privacidade ativa</span>
        </div>
      </div>
    </div>

    <div class="reg-pag-actions">
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
import { defineComponent, ref, computed } from 'vue'
import { useRegistrarStore } from '../../../stores/registrar'

export default defineComponent({
  name: 'RegistrarStepInformacoes',
  setup() {
    const store = useRegistrarStore()
    const vkAberto = ref(false)
    const isPI = computed(() => store.docType.startsWith('Prova de Anterioridade'))
    return { store, vkAberto, isPI }
  },
})
</script>
