<template>
  <div class="anim-slide-up reg-step-doc">
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
        <div v-if="!store.arquivo" class="reg-upload-idle">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke-width="2" stroke-linecap="square" aria-hidden="true" style="stroke:var(--color-text-label);">
            <path d="M18 6 L18 26"/>
            <path d="M9 15 L18 6 L27 15"/>
            <path d="M6 30 L30 30"/>
          </svg>
          <div class="reg-upload-title">Clique ou arraste o documento aqui</div>
          <div class="reg-upload-hint">PDF, DOC, DOCX, TXT</div>
        </div>
        <div v-else class="reg-upload-done">
          <span class="reg-upload-emoji">✓</span>
          <div class="reg-upload-name">{{ store.arquivo.name }}</div>
          <div class="reg-upload-size">{{ (store.arquivo.size / 1024).toFixed(1) }} KB — clique para trocar</div>
        </div>
      </div>
    </div>

    <button class="btn btn-primary reg-advance" :disabled="!store.arquivo" @click="store.etapa = 2">
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
