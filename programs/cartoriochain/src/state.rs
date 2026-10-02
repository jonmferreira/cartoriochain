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
    pub bump: u8,
}

impl DocumentRecord {
    // discriminator(8) + hash(32) + irys_tx_id(4+50) + doc_type(4+32)
    // + cartorio_id(4+32) + authority(32) + timestamp(8) + revoked(1)
    // + revoke_reason(4+128) + bump(1)
    pub const SPACE: usize = 8 + 32 + 54 + 36 + 36 + 32 + 8 + 1 + 132 + 1;
}
