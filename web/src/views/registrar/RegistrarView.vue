<template>
  <div class="min-h-screen bg-surface-50 flex items-center justify-center p-6">
    <div class="w-full max-w-xl flex flex-col gap-6">

      <div>
        <h1 class="text-3xl font-bold text-surface-900">Registrar Documento</h1>
        <p class="text-surface-500 mt-1">Autenticação on-chain via Solana + ZK Proof</p>
      </div>

      <Card>
        <template #content>
          <div class="flex flex-col gap-4">

            <div class="flex flex-col gap-1">
              <label class="text-sm font-medium text-surface-700">Documento</label>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                class="border border-surface-200 rounded-lg p-2 text-sm text-surface-700"
                @change="onArquivoChange"
              />
              <span v-if="arquivo" class="text-xs text-surface-500">
                {{ arquivo.name }} ({{ (arquivo.size / 1024).toFixed(1) }} KB)
              </span>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div class="flex flex-col gap-1">
                <label class="text-sm font-medium text-surface-700">Tipo do Documento</label>
                <input
                  v-model="form.docType"
                  type="text"
                  placeholder="ex: escritura, contrato"
                  class="border border-surface-200 rounded-lg p-2 text-sm"
                  maxlength="32"
                />
              </div>
              <div class="flex flex-col gap-1">
                <label class="text-sm font-medium text-surface-700">Cartório ID</label>
                <input
                  v-model="form.cartorioId"
                  type="text"
                  placeholder="ex: CRIO-RJ-001"
                  class="border border-surface-200 rounded-lg p-2 text-sm"
                  maxlength="32"
                />
              </div>
            </div>

            <div class="border border-surface-100 rounded-lg p-3 flex flex-col gap-3 bg-surface-50">
              <p class="text-xs font-semibold text-surface-500 uppercase tracking-wide">ZK Proof — Chave Pública ECDSA</p>
              <div class="grid grid-cols-2 gap-3">
                <div class="flex flex-col gap-1">
                  <label class="text-xs text-surface-600">pubKeyX (hex)</label>
                  <input v-model="form.pubKeyX" type="text" placeholder="32 bytes hex" class="border border-surface-200 rounded p-2 text-xs font-mono" />
                </div>
                <div class="flex flex-col gap-1">
                  <label class="text-xs text-surface-600">pubKeyY (hex)</label>
                  <input v-model="form.pubKeyY" type="text" placeholder="32 bytes hex" class="border border-surface-200 rounded p-2 text-xs font-mono" />
                </div>
                <div class="flex flex-col gap-1">
                  <label class="text-xs text-surface-600">sigR (hex)</label>
                  <input v-model="form.sigR" type="text" placeholder="32 bytes hex" class="border border-surface-200 rounded p-2 text-xs font-mono" />
                </div>
                <div class="flex flex-col gap-1">
                  <label class="text-xs text-surface-600">sigS (hex)</label>
                  <input v-model="form.sigS" type="text" placeholder="32 bytes hex" class="border border-surface-200 rounded p-2 text-xs font-mono" />
                </div>
              </div>
              <Button
                label="Preencher com dados demo"
                icon="pi pi-bolt"
                size="small"
                severity="secondary"
                @click="preencherDemo"
              />
            </div>

          </div>
        </template>
      </Card>

      <Message v-if="erro" severity="error" :closable="false">{{ erro }}</Message>

      <Button
        label="Registrar Documento"
        icon="pi pi-shield"
        size="large"
        :disabled="!podeSalvar || carregando"
        :loading="carregando"
        @click="registrar"
      />

      <Card v-if="resultado" class="border-2 border-primary-200 bg-primary-50">
        <template #content>
          <div class="flex flex-col gap-3">
            <div class="flex items-center gap-2">
              <i class="pi pi-check-circle text-primary-600 text-xl" />
              <span class="font-semibold text-primary-700">Documento registrado com sucesso!</span>
            </div>
            <div class="flex flex-col gap-1 text-sm">
              <div class="flex gap-2">
                <span class="text-surface-500 w-36">Doc ID:</span>
                <span class="font-mono text-xs break-all">{{ resultado.docId }}</span>
              </div>
              <div class="flex gap-2">
                <span class="text-surface-500 w-36">Irys TX:</span>
                <span class="font-mono text-xs break-all">{{ resultado.irys_tx_id }}</span>
              </div>
              <div class="flex gap-2">
                <span class="text-surface-500 w-36">Hash SHA-256:</span>
                <span class="font-mono text-xs break-all">{{ resultado.doc_hash }}</span>
              </div>
              <div class="flex gap-2">
                <span class="text-surface-500 w-36">Commitment ZK:</span>
                <span class="font-mono text-xs break-all">{{ resultado.signer_commitment }}</span>
              </div>
            </div>
            <Button
              label="Copiar link de verificação"
              icon="pi pi-link"
              severity="secondary"
              size="small"
              @click="copiarLink"
            />
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
import { registrarDocumento } from './integrations'
import type { RegistrarPayload, RegistrarResult } from './types'

const DEMO_KEY = 'a' + '0'.repeat(63)

export default defineComponent({
  name: 'RegistrarView',
  components: { Card, Button, Message },

  data() {
    return {
      arquivo: null as File | null,
      form: {
        docType: '',
        cartorioId: '',
        pubKeyX: '',
        pubKeyY: '',
        sigR: '',
        sigS: '',
      } as RegistrarPayload,
      carregando: false,
      erro: null as string | null,
      resultado: null as RegistrarResult | null,
    }
  },

  computed: {
    podeSalvar(): boolean {
      return !!(
        this.arquivo &&
        this.form.docType &&
        this.form.cartorioId &&
        this.form.pubKeyX &&
        this.form.pubKeyY &&
        this.form.sigR &&
        this.form.sigS
      )
    },
  },

  methods: {
    onArquivoChange(e: Event) {
      const input = e.target as HTMLInputElement
      this.arquivo = input.files?.[0] ?? null
    },

    preencherDemo() {
      this.form.pubKeyX = DEMO_KEY
      this.form.pubKeyY = DEMO_KEY
      this.form.sigR = DEMO_KEY
      this.form.sigS = DEMO_KEY
      if (!this.form.docType) this.form.docType = 'escritura'
      if (!this.form.cartorioId) this.form.cartorioId = 'CRIO-RJ-001'
    },

    async registrar() {
      if (!this.arquivo) return
      this.carregando = true
      this.erro = null
      this.resultado = null

      try {
        this.resultado = await registrarDocumento(this.arquivo, this.form)
      } catch (e: unknown) {
        const err = e as { response?: { data?: { error?: string } }; message?: string }
        this.erro = err.response?.data?.error ?? err.message ?? 'Erro ao registrar documento.'
      } finally {
        this.carregando = false
      }
    },

    copiarLink() {
      if (this.resultado) {
        navigator.clipboard.writeText(this.resultado.verificarUrl)
      }
    },
  },
})
</script>
