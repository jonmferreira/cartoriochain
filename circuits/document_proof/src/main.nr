use std::hash::sha256;
use std::hash::pedersen_hash;
use std::ecdsa_secp256k1::verify_signature;

// Prova que:
// 1. O signatário conhece o conteúdo do documento (doc_content -> doc_hash)
// 2. O signatário possui a chave privada que gerou a assinatura (sem revelar a chave)
//
// Inputs públicos (verificáveis por qualquer um on-chain):
//   doc_hash   — SHA-256 do documento, registrado na Solana
//   commitment — Pedersen do pubkey do signatário (substitui dados PII on-chain)
//
// Inputs privados (nunca revelados):
//   doc_content — conteúdo bruto do documento (máx 4KB = 4096 bytes)
//   pub_key_x, pub_key_y — coordenadas da chave pública secp256k1 do signatário
//   signature_r, signature_s — assinatura ECDSA sobre doc_hash

fn main(
    // privados
    doc_content: [u8; 4096],
    pub_key_x: [u8; 32],
    pub_key_y: [u8; 32],
    signature_r: [u8; 32],
    signature_s: [u8; 32],

    // públicos
    doc_hash: pub [u8; 32],
    commitment: pub Field,
) {
    // 1. Conteúdo bate com hash registrado on-chain
    let computed_hash = sha256(doc_content);
    assert(computed_hash == doc_hash, "hash do documento nao confere");

    // 2. Assinatura ECDSA valida para este hash e chave publica
    let valid_sig = verify_signature(pub_key_x, pub_key_y, signature_r, signature_s, doc_hash);
    assert(valid_sig, "assinatura invalida para este documento");

    // 3. Commitment do signatário bate (substitui CPF/dados PII on-chain)
    let key_fields: [Field; 2] = [
        crate::utils::bytes_to_field(pub_key_x),
        crate::utils::bytes_to_field(pub_key_y),
    ];
    let computed_commitment = pedersen_hash(key_fields);
    assert(computed_commitment == commitment, "commitment do signatario nao confere");
}

mod utils {
    pub fn bytes_to_field(bytes: [u8; 32]) -> Field {
        let mut result: Field = 0;
        for i in 0..32 {
            result = result * 256 + bytes[i] as Field;
        }
        result
    }
}
