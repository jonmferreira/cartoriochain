use anchor_lang::prelude::*;

pub mod error;
pub mod instructions;
pub mod state;

use instructions::*;

declare_id!("BZnhVb4mdVbGRKbspvYq9mos2P4sY4iej87BEtBs2VPW");

#[program]
pub mod cartoriochain {
    use super::*;

    /// Registra um documento no ledger Solana com hash SHA-256 e referência Irys.
    /// viewkey_payload: dados do signatário cifrados com ZCash ViewKey (LGPD)
    /// signer_commitment: Pedersen commitment do pubkey — anchor point do ZK proof
    /// PDA: seeds = ["document", doc_id]
    pub fn register_document(
        ctx: Context<RegisterDocument>,
        doc_id: [u8; 32],
        doc_hash: [u8; 32],
        irys_tx_id: String,
        doc_type: String,
        cartorio_id: String,
        viewkey_payload: String,
        signer_commitment: String,
    ) -> Result<()> {
        register_document::register(ctx, doc_id, doc_hash, irys_tx_id, doc_type, cartorio_id, viewkey_payload, signer_commitment)
    }

    /// Verifica se o hash informado corresponde ao registrado. Falha se revogado.
    pub fn verify_document(
        ctx: Context<VerifyDocument>,
        doc_id: [u8; 32],
        doc_hash: [u8; 32],
    ) -> Result<bool> {
        verify_document::verify(ctx, doc_id, doc_hash)
    }

    /// Revoga um documento. Apenas o signatário original pode revogar.
    /// O registro permanece no ledger (imutabilidade preservada).
    pub fn revoke_document(
        ctx: Context<RevokeDocument>,
        doc_id: [u8; 32],
        reason: String,
    ) -> Result<()> {
        revoke_document::revoke(ctx, doc_id, reason)
    }
}
