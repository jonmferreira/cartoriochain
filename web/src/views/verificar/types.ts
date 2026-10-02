export interface DocumentoRegistrado {
  doc_hash: string
  irys_tx_id: string
  doc_type: string
  cartorio_id: string
  authority: string
  registered_at: number
  revoked: boolean
  revoke_reason: string
  signer_commitment: string
}

export interface VerificarResult {
  valido: boolean
  documento: DocumentoRegistrado | null
  erro?: string
}
