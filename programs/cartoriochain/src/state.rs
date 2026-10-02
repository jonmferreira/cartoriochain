use anchor_lang::prelude::*;

#[account]
pub struct DocumentRecord {
    pub doc_hash: [u8; 32],
    pub irys_tx_id: String,
    pub doc_type: String,
    pub cartorio_id: String,
    pub authority: Pubkey,
    pub registered_at: i64,
    pub revoked: bool,
    pub revoke_reason: String,
    /// Dados do signatário cifrados com ZCash ViewKey (LGPD)
    pub viewkey_payload: String,
    /// Pedersen commitment do pubkey — anchor point do ZK proof
    pub signer_commitment: String,
    pub bump: u8,
}

const F_DISCRIMINATOR:     usize = 8;
const F_DOC_HASH:          usize = 32;
const F_IRYS_TX_ID:        usize = 54;  // 4 + 50
const F_DOC_TYPE:          usize = 36;  // 4 + 32
const F_CARTORIO_ID:       usize = 36;  // 4 + 32
const F_AUTHORITY:         usize = 32;
const F_REGISTERED_AT:     usize = 8;
const F_REVOKED:           usize = 1;
const F_REVOKE_REASON:     usize = 132; // 4 + 128
const F_VIEWKEY_PAYLOAD:   usize = 260; // 4 + 256
const F_SIGNER_COMMITMENT: usize = 68;  // 4 + 64
const F_BUMP:              usize = 1;

impl DocumentRecord {
    pub const SPACE: usize = F_DISCRIMINATOR + F_DOC_HASH + F_IRYS_TX_ID
        + F_DOC_TYPE + F_CARTORIO_ID + F_AUTHORITY + F_REGISTERED_AT
        + F_REVOKED + F_REVOKE_REASON + F_VIEWKEY_PAYLOAD
        + F_SIGNER_COMMITMENT + F_BUMP;
}
