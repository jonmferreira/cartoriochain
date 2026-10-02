use anchor_lang::prelude::*;
use crate::state::DocumentRecord;
use crate::error::CartorioError;

#[derive(Accounts)]
#[instruction(doc_id: [u8; 32])]
pub struct RevokeDocument<'info> {
    #[account(
        mut,
        seeds = [b"document", doc_id.as_ref()],
        bump = document.bump,
        has_one = authority @ CartorioError::Unauthorized,
    )]
    pub document: Account<'info, DocumentRecord>,
    pub authority: Signer<'info>,
}

pub fn revoke(
    ctx: Context<RevokeDocument>,
    _doc_id: [u8; 32],
    reason: String,
) -> Result<()> {
    require!(!reason.is_empty(), CartorioError::EmptyRevokeReason);

    let doc = &mut ctx.accounts.document;
    require!(!doc.revoked, CartorioError::AlreadyRevoked);

    doc.revoked = true;
    doc.revoke_reason = reason;

    emit!(DocumentRevoked {
        authority: doc.authority,
        timestamp: Clock::get()?.unix_timestamp,
    });

    Ok(())
}

#[event]
pub struct DocumentRevoked {
    pub authority: Pubkey,
    pub timestamp: i64,
}
