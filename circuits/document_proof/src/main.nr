use std::hash::pedersen_hash;
use std::ecdsa_secp256k1::verify_signature;

// Prova que:
// 1. O signatário possui a chave privada que gerou a assinatura sobre doc_hash
// 2. Retorna o commitment (Pedersen hash da chave pública) como output público
//
// Inputs públicos (verificáveis on-chain):
//   doc_hash — SHA-256 do documento registrado na Solana
//
// Inputs privados (nunca revelados):
//   pub_key_x, pub_key_y — coordenadas secp256k1 do signatário
//   signature            — assinatura ECDSA (64 bytes: r || s)
//
// Output público:
//   commitment — Pedersen hash da chave pública (substitui PII on-chain)

fn main(
    // privados
    pub_key_x: [u8; 32],
    pub_key_y: [u8; 32],
    signature: [u8; 64],

    // público
    doc_hash: pub [u8; 32],
) -> pub Field {
    // 1. Assinatura ECDSA válida para este hash e esta chave pública
    let valid_sig = verify_signature(pub_key_x, pub_key_y, signature, doc_hash);
    assert(valid_sig, "assinatura invalida para este documento");

    // 2. Deriva o commitment da chave pública — armazenado on-chain sem revelar a chave
    let key_fields: [Field; 2] = [
        bytes_to_field(pub_key_x),
        bytes_to_field(pub_key_y),
    ];
    pedersen_hash(key_fields)
}

fn bytes_to_field(bytes: [u8; 32]) -> Field {
    let mut result: Field = 0;
    for i in 0..32 {
        result = result * 256 + bytes[i] as Field;
    }
    result
}
