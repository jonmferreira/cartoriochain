<template>
  <div class="min-h-screen bg-surface-50 flex items-center justify-center p-6">
    <div class="w-full max-w-xl flex flex-col gap-6">

      <div>
        <h1 class="text-3xl font-bold text-surface-900">Registrar Documento</h1>
        <p class="text-surface-500 mt-1">Autenticação on-chain via Solana + ZK Proof</p>
      </div>

      <div v-if="modoDemo" class="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
        <i class="pi pi-home text-amber-600" />
        <span class="text-sm text-amber-700 font-medium">Demo MCMV — Escritura pré-preenchida. Clique em Registrar para ver o fluxo completo.</span>
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

            <div class="border border-violet-100 rounded-lg p-3 flex flex-col gap-2 bg-violet-50">
              <div class="flex items-center gap-2">
                <i class="pi pi-lock text-violet-600" />
                <p class="text-xs font-semibold text-violet-700 uppercase tracking-wide">ZCash ViewKey — Dados do Signatário</p>
              </div>
              <p class="text-xs text-violet-600">Payload cifrado com ZCash ViewKey. Apenas o titular da ViewKey pode descriptografar. Garante privacidade LGPD on-chain.</p>
              <textarea
                v-model="form.viewkeyPayload"
                rows="3"
                placeholder='{"v":"zcash-vk-v1","payload":"...","hint":"zxviews1..."}'
                class="border border-violet-200 rounded p-2 text-xs font-mono resize-none bg-white"
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

      <Card v-if="resultado" class="border-2 border-green-200 bg-green-50">
        <template #content>
          <div class="flex flex-col gap-4">

            <div class="flex items-center gap-3">
              <i class="pi pi-check-circle text-green-600 text-3xl" />
              <div>
                <p class="font-bold text-green-800 text-lg">Documento autenticado!</p>
                <p class="text-sm text-green-700">Registrado permanentemente na blockchain.</p>
              </div>
            </div>

            <div class="flex flex-col gap-2 text-sm border-t border-green-200 pt-3">
              <div class="flex gap-2">
                <span class="text-surface-500 w-28 shrink-0">Tipo:</span>
                <span class="font-medium">{{ form.docType }}</span>
              </div>
              <div class="flex gap-2">
                <span class="text-surface-500 w-28 shrink-0">Cartório:</span>
                <span class="font-medium">{{ form.cartorioId }}</span>
              </div>
            </div>

            <Button
              label="Copiar link de verificação"
              icon="pi pi-link"
              severity="success"
              size="small"
              @click="copiarLink"
            />

            <div class="border-t border-green-200 pt-2">
              <button
                class="text-xs text-surface-400 hover:text-surface-600 flex items-center gap-1"
                @click="detalhesAbertos = !detalhesAbertos"
              >
                <i :class="detalhesAbertos ? 'pi pi-chevron-up' : 'pi pi-chevron-down'" />
                Detalhes técnicos
              </button>
              <div v-if="detalhesAbertos" class="mt-2 flex flex-col gap-1 text-xs font-mono">
                <div class="flex gap-2"><span class="text-surface-400 w-32 shrink-0">Doc ID:</span><span class="break-all">{{ resultado.docId }}</span></div>
                <div class="flex gap-2"><span class="text-surface-400 w-32 shrink-0">Hash SHA-256:</span><span class="break-all">{{ resultado.doc_hash }}</span></div>
                <div class="flex gap-2"><span class="text-surface-400 w-32 shrink-0">Irys TX:</span><span class="break-all">{{ resultado.irys_tx_id }}</span></div>
                <div v-if="resultado.viewkey_payload" class="flex gap-2 mt-1 p-2 rounded bg-violet-50 border border-violet-100">
                  <i class="pi pi-lock text-violet-500 mt-0.5 shrink-0" />
                  <div class="flex flex-col gap-0.5">
                    <span class="font-semibold text-violet-700 not-font-mono text-xs">ZCash ViewKey payload</span>
                    <span class="break-all text-violet-900">{{ resultado.viewkey_payload }}</span>
                  </div>
                </div>
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
import { registrarDocumento } from './integrations'
import type { RegistrarPayload, RegistrarResult } from './types'

const DEMO_KEY = 'a' + '0'.repeat(63)
const DEMO_VIEWKEY_PAYLOAD = JSON.stringify({
  v: 'zcash-vk-v1',
  payload: '4a5f3c2b1a9e8d7c6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3',
  hint: 'zxviews1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq',
})

const DEMO_MCMV = {
  docType: 'escritura-mcmv',
  cartorioId: 'CRIO-RJ-001',
  pubKeyX: DEMO_KEY,
  pubKeyY: DEMO_KEY,
  sigR: DEMO_KEY,
  sigS: DEMO_KEY,
  viewkeyPayload: DEMO_VIEWKEY_PAYLOAD,
}

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
        viewkeyPayload: '',
      } as RegistrarPayload,
      modoDemo: false,
      carregando: false,
      erro: null as string | null,
      resultado: null as RegistrarResult | null,
      detalhesAbertos: false,
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

  created() {
    if (this.$route.query.demo === 'mcmv') {
      Object.assign(this.form, DEMO_MCMV)
      this.modoDemo = true
      this.arquivo = new File(['Contrato MCMV - Demo CartórioChain'], 'escritura-mcmv-demo.txt', { type: 'text/plain' })
    }
  },

  methods: {
    onArquivoChange(e: Event) {
      const input = e.target as HTMLInputElement
      this.arquivo = input.files?.[0] ?? null
    },

    preencherDemo() {
      Object.assign(this.form, DEMO_MCMV)
      if (!this.arquivo) {
        this.arquivo = new File(['Contrato MCMV - Demo CartórioChain'], 'escritura-mcmv-demo.txt', { type: 'text/plain' })
      }
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
