<template>
  <div class="min-h-screen bg-surface-50 flex items-center justify-center p-6">
    <div class="w-full max-w-xl flex flex-col gap-6">

      <div>
        <h1 class="text-3xl font-bold text-surface-900">Verificar Documento</h1>
        <p class="text-surface-500 mt-1">Consulta pública — sem carteira necessária</p>
      </div>

      <Card>
        <template #content>
          <div class="flex flex-col gap-4">

            <div class="flex flex-col gap-1">
              <label class="text-sm font-medium text-surface-700">Document ID</label>
              <input
                v-model="docId"
                type="text"
                placeholder="Hash hex de 64 chars"
                class="border border-surface-200 rounded-lg p-2 text-sm font-mono"
              />
            </div>

            <div class="flex flex-col gap-1">
              <label class="text-sm font-medium text-surface-700">Hash do arquivo <span class="text-surface-400">(opcional — para re-verificar)</span></label>
              <input
                v-model="docHashHex"
                type="text"
                placeholder="SHA-256 hex do arquivo original"
                class="border border-surface-200 rounded-lg p-2 text-sm font-mono"
              />
            </div>

          </div>
        </template>
      </Card>

      <Message v-if="erro" severity="error" :closable="false">{{ erro }}</Message>

      <Button
        label="Verificar"
        icon="pi pi-search"
        size="large"
        :disabled="!docId.trim() || carregando"
        :loading="carregando"
        @click="verificar"
      />

      <Card v-if="resultado">
        <template #content>
          <div class="flex flex-col gap-4">

            <div class="flex items-center gap-3">
              <i
                :class="resultado.valido && !resultado.documento?.revoked
                  ? 'pi pi-check-circle text-green-500'
                  : 'pi pi-times-circle text-red-500'"
                class="text-2xl"
              />
              <div>
                <p class="font-semibold text-surface-900">
                  {{ statusLabel }}
                </p>
                <p v-if="resultado.documento?.revoked" class="text-sm text-red-600">
                  Motivo: {{ resultado.documento.revoke_reason || 'Não informado' }}
                </p>
              </div>
            </div>

            <div v-if="resultado.documento" class="flex flex-col gap-2 text-sm border-t border-surface-100 pt-3">
              <div class="flex gap-2">
                <span class="text-surface-500 w-36 shrink-0">Tipo:</span>
                <span>{{ resultado.documento.doc_type }}</span>
              </div>
              <div class="flex gap-2">
                <span class="text-surface-500 w-36 shrink-0">Cartório:</span>
                <span>{{ resultado.documento.cartorio_id }}</span>
              </div>
              <div class="flex gap-2">
                <span class="text-surface-500 w-36 shrink-0">Registrado em:</span>
                <span>{{ formatarData(resultado.documento.registered_at) }}</span>
              </div>
              <div class="flex gap-2">
                <span class="text-surface-500 w-36 shrink-0">Autoridade:</span>
                <span class="font-mono text-xs break-all">{{ resultado.documento.authority }}</span>
              </div>
              <div class="flex gap-2">
                <span class="text-surface-500 w-36 shrink-0">Hash SHA-256:</span>
                <span class="font-mono text-xs break-all">{{ resultado.documento.doc_hash }}</span>
              </div>
              <div class="flex gap-2">
                <span class="text-surface-500 w-36 shrink-0">Irys TX:</span>
                <span class="font-mono text-xs break-all">{{ resultado.documento.irys_tx_id }}</span>
              </div>
              <div class="flex gap-2">
                <span class="text-surface-500 w-36 shrink-0">Commitment ZK:</span>
                <span class="font-mono text-xs break-all">{{ resultado.documento.signer_commitment }}</span>
              </div>
            </div>

          </div>
        </template>
      </Card>

    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Message from 'primevue/message'
import { verificarDocumento } from './integrations'
import type { VerificarResult } from './types'

export default defineComponent({
  name: 'VerificarView',
  components: { Card, Button, Message },

  data() {
    return {
      docId: (this.$route.params.docId as string) ?? '',
      docHashHex: '',
      carregando: false,
      erro: null as string | null,
      resultado: null as VerificarResult | null,
    }
  },

  computed: {
    statusLabel(): string {
      if (!this.resultado) return ''
      if (this.resultado.erro) return this.resultado.erro
      if (!this.resultado.documento) return 'Documento não encontrado.'
      if (this.resultado.documento.revoked) return 'Documento revogado.'
      return 'Documento válido e autenticado on-chain.'
    },
  },

  async created() {
    if (this.docId) await this.verificar()
  },

  methods: {
    async verificar() {
      const id = this.docId.trim()
      if (!id) return
      this.carregando = true
      this.erro = null
      this.resultado = null

      try {
        this.resultado = await verificarDocumento(id, this.docHashHex.trim() || undefined)
      } catch (e: unknown) {
        const err = e as { message?: string }
        this.erro = err.message ?? 'Erro ao verificar documento.'
      } finally {
        this.carregando = false
      }
    },

    formatarData(timestamp: number): string {
      return new Date(timestamp * 1000).toLocaleString('pt-BR')
    },
  },
})
</script>
