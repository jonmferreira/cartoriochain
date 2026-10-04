<template>
  <div style="display:flex; align-items:center;">
    <template v-for="(s, i) in etapas" :key="i">
      <div style="display:flex; align-items:center; gap:8px;">
        <div class="step-num" :class="{ active: etapa === i+1, done: etapa > i+1 }">
          <span v-if="etapa > i+1">✓</span>
          <span v-else>{{ i+1 }}</span>
        </div>
        <span class="step-label" :class="{ active: etapa === i+1 }">{{ s }}</span>
      </div>
      <div v-if="i < etapas.length - 1" class="step-connector" />
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'RegistrarSteps',
  props: {
    etapa: { type: Number, required: true },
    etapas: { type: Array as () => string[], required: true },
  },
})
</script>
