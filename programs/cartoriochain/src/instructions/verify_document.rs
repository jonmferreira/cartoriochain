use anchor_lang::prelude::*;
use crate::state::DocumentRecord;
use crate::error::CartorioError;

#[derive(Accounts)]
#[instruction(doc_id: [u8; 32])]
pub struct VerifyDocument<'info> {
    #[account(
        seeds = [b"document", doc_id.as_ref()],
        bump = document.bump,
    )]
    pub document: Account<'info, DocumentRecord>,
}

pub fn verify(
    ctx: Context<VerifyDocument>,
    _doc_id: [u8; 32],
    doc_hash: [u8; 32],
) -> Result<bool> {
    let doc = &ctx.accounts.document;

    require!(!doc.revoked, CartorioError::AlreadyRevoked);
    require!(doc.doc_hash == doc_hash, CartorioError::HashMismatch);

    Ok(true)
}
