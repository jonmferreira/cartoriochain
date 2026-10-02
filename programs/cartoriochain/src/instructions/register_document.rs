use anchor_lang::prelude::*;
use crate::state::DocumentRecord;
use crate::error::CartorioError;

#[derive(Accounts)]
#[instruction(doc_id: [u8; 32])]
pub struct RegisterDocument<'info> {
    #[account(
        init,
        payer = authority,
        space = DocumentRecord::SPACE,
        seeds = [b"document", doc_id.as_ref()],
        bump,
    )]
    pub document: Account<'info, DocumentRecord>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn register(
    ctx: Context<RegisterDocument>,
    doc_id: [u8; 32],
    doc_hash: [u8; 32],
    irys_tx_id: String,
    doc_type: String,
    cartorio_id: String,
) -> Result<()> {
    require!(!doc_type.is_empty() && doc_type.len() <= 32, CartorioError::InvalidDocType);
    require!(!cartorio_id.is_empty() && cartorio_id.len() <= 32, CartorioError::InvalidCartorioId);
    require!(irys_tx_id.len() <= 50, CartorioError::InvalidDocType);

    let doc = &mut ctx.accounts.document;
    doc.doc_hash = doc_hash;
    doc.irys_tx_id = irys_tx_id;
    doc.doc_type = doc_type;
    doc.cartorio_id = cartorio_id;
    doc.authority = ctx.accounts.authority.key();
    doc.registered_at = Clock::get()?.unix_timestamp;
    doc.revoked = false;
    doc.revoke_reason = String::new();
    doc.bump = ctx.bumps.document;

    emit!(DocumentRegistered {
        doc_id,
        doc_hash,
        authority: doc.authority,
        timestamp: doc.registered_at,
    });

    Ok(())
}

#[event]
pub struct DocumentRegistered {
    pub doc_id: [u8; 32],
    pub doc_hash: [u8; 32],
    pub authority: Pubkey,
    pub timestamp: i64,
}
