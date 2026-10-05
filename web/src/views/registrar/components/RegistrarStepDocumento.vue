<template>
  <div class="anim-slide-up" style="display:flex; flex-direction:column; gap:20px;">
    <div class="card">
      <label class="label">Documento</label>
      <div
        class="upload-area"
        :class="{ 'has-file': !!store.arquivo }"
        @click="($refs.fileInput as HTMLInputElement).click()"
        @dragover.prevent
        @drop.prevent="onDrop"
      >
        <input ref="fileInput" type="file" accept=".pdf,.doc,.docx,.txt" @change="onArquivoChange" />
        <div v-if="!store.arquivo" style="display:flex; flex-direction:column; align-items:center; gap:10px;">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="#4F5E50" stroke-width="2" stroke-linecap="square" aria-hidden="true">
            <path d="M18 6 L18 26"/>
            <path d="M9 15 L18 6 L27 15"/>
            <path d="M6 30 L30 30"/>
          </svg>
          <div style="font-size:13px; font-weight:700; color:#F7EACB;">Clique ou arraste o documento aqui</div>
          <div style="font-size:11px; color:#4F5E50;">PDF, DOC, DOCX, TXT</div>
        </div>
        <div v-else style="display:flex; flex-direction:column; align-items:center; gap:8px;">
          <span style="font-size:32px;">✓</span>
          <div style="font-size:13px; font-weight:800; color:#008C4C;">{{ store.arquivo.name }}</div>
          <div style="font-size:11px; color:#4F5E50;">{{ (store.arquivo.size / 1024).toFixed(1) }} KB — clique para trocar</div>
        </div>
      </div>
    </div>

    <button class="btn btn-primary" style="align-self:flex-end;" :disabled="!store.arquivo" @click="store.etapa = 2">
      Avançar →
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRegistrarStore } from '../../../stores/registrar'

export default defineComponent({
  name: 'RegistrarStepDocumento',
  setup() {
    return { store: useRegistrarStore() }
  },
  methods: {
    onArquivoChange(e: Event) {
      const file = (e.target as HTMLInputElement).files?.[0] ?? null
      if (file) this.store.arquivo = file
    },
    onDrop(e: DragEvent) {
      const file = e.dataTransfer?.files?.[0] ?? null
      if (file) this.store.arquivo = file
    },
  },
})
</script>
