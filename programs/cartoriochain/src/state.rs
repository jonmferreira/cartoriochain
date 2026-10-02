use anchor_lang::prelude::*;

#[account]
pub struct DocumentRecord {
    /// SHA-256 do documento original (32 bytes)
    pub doc_hash: [u8; 32],
    /// Transaction ID no Irys/Arweave (armazenamento permanente)
    pub irys_tx_id: String,
    /// Tipo: "Escritura", "Laudo", "Contrato", "ReconhecimentoFirma"
    pub doc_type: String,
    /// Identificador do cartório emissor
    pub cartorio_id: String,
    /// Chave pública do signatário (authority que registrou)
    pub authority: Pubkey,
    /// Unix timestamp do registro
    pub registered_at: i64,
    pub revoked: bool,
    pub revoke_reason: String,
    /// ZCash ViewKey encoding: protege dados do signatário (CPF, nome) on-chain
    /// Apenas quem tem a ViewKey consegue descriptografar — LGPD compliance
    pub viewkey_payload: String,
    /// Pedersen commitment do pubkey do signatário (ZK proof anchor point)
    pub signer_commitment: String,
    pub bump: u8,
}

impl DocumentRecord {
    pub const SPACE: usize = 668;
}
