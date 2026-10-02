use anchor_lang::prelude::*;

#[error_code]
pub enum CartorioError {
    #[msg("Hash do documento não confere com o registrado")]
    HashMismatch,
    #[msg("Documento já foi revogado")]
    AlreadyRevoked,
    #[msg("Apenas o signatário original pode revogar")]
    Unauthorized,
    #[msg("Motivo de revogação não pode ser vazio")]
    EmptyRevokeReason,
    #[msg("Tipo de documento inválido")]
    InvalidDocType,
    #[msg("ID do cartório inválido")]
    InvalidCartorioId,
}
