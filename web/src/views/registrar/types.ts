export interface RegistrarPayload {
  docType: string
  cartorioId: string
  pubKeyX: string
  pubKeyY: string
  sigR: string
  sigS: string
  viewkeyPayload?: string
  docIdSeed?: string
}

export interface RegistrarResult {
  docId: string
  irys_tx_id: string
  doc_hash: string
  signer_commitment: string
  viewkey_payload?: string
  registered_at: number
  verificarUrl: string
}
