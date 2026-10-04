/**
 * ViewKey encryption — protege PII do signatário on-chain (LGPD)
 *
 * Semântica inspirada no ZCash ViewKey:
 *   - viewKey (privateKey X25519) = chave de visualização — holder guarda offline
 *   - paymentAddress (publicKey X25519) = endereço público do signatário
 *   - viewkeyPayload (on-chain) = PII cifrado — ninguém lê sem o viewKey
 *
 * Fluxo:
 *   1. Signatário gera keypair → guarda viewKey offline
 *   2. PII cifrado com paymentAddress → armazenado on-chain como viewkeyPayload
 *   3. Só quem tem o viewKey consegue decifrar
 */

import * as crypto from "crypto";

export interface ViewKeyPair {
  viewKey: string;       // hex 32 bytes — GUARDAR OFFLINE
  paymentAddress: string; // hex 32 bytes — pode ser público
}

export interface EncryptedPayload {
  ciphertext: string; // base64
  ephemeralPub: string; // hex 32 bytes
  nonce: string;      // hex 12 bytes
  authTag: string;    // hex 16 bytes
}

/**
 * Gera um par viewKey / paymentAddress para um novo signatário.
 */
export function generateViewKeyPair(): ViewKeyPair {
  const { privateKey, publicKey } = crypto.generateKeyPairSync("x25519", {
    privateKeyEncoding: { type: "pkcs8", format: "der" },
    publicKeyEncoding: { type: "spki", format: "der" },
  });

  // X25519 raw key = últimos 32 bytes do DER
  const viewKey = Buffer.from(privateKey).slice(-32).toString("hex");
  const paymentAddress = Buffer.from(publicKey).slice(-32).toString("hex");

  return { viewKey, paymentAddress };
}

/**
 * Cifra os dados do signatário com o paymentAddress (chave pública).
 * Retorna payload pronto para armazenar on-chain.
 */
export function encryptForViewKey(
  plaintext: Record<string, unknown>,
  paymentAddressHex: string
): string {
  const recipientPub = Buffer.from(paymentAddressHex, "hex");

  // Keypair efêmero para ECDH
  const ephemeral = crypto.generateKeyPairSync("x25519", {
    privateKeyEncoding: { type: "pkcs8", format: "der" },
    publicKeyEncoding: { type: "spki", format: "der" },
  });

  const ephemeralPub = Buffer.from(ephemeral.publicKey).slice(-32);
  const ephemeralPrivRaw = Buffer.from(ephemeral.privateKey).slice(-32);

  // Reconstruir chave privada efêmera como KeyObject X25519
  const ephPrivKey = crypto.createPrivateKey({
    key: buildX25519Pkcs8(ephemeralPrivRaw),
    format: "der",
    type: "pkcs8",
  });

  // Reconstruir chave pública do destinatário como KeyObject X25519
  const recipPubKey = crypto.createPublicKey({
    key: buildX25519Spki(recipientPub),
    format: "der",
    type: "spki",
  });

  const sharedSecret = crypto.diffieHellman({
    privateKey: ephPrivKey,
    publicKey: recipPubKey,
  });

  // Deriva chave simétrica com HKDF
  const encKey = crypto.hkdfSync("sha256", sharedSecret, ephemeralPub, "CartorioChain ViewKey v1", 32);

  // Cifra com AES-256-GCM
  const nonce = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", Buffer.from(encKey), nonce);
  const data = Buffer.from(JSON.stringify(plaintext), "utf-8");
  const ciphertext = Buffer.concat([cipher.update(data), cipher.final()]);
  const authTag = cipher.getAuthTag();

  const payload: EncryptedPayload = {
    ciphertext: ciphertext.toString("base64"),
    ephemeralPub: ephemeralPub.toString("hex"),
    nonce: nonce.toString("hex"),
    authTag: authTag.toString("hex"),
  };

  return JSON.stringify(payload);
}

/**
 * Decifra o viewkeyPayload com o viewKey (chave privada).
 * Só funciona se o viewKey corresponder ao paymentAddress usado na cifragem.
 */
export function decryptViewKeyPayload(
  payloadJson: string,
  viewKeyHex: string
): Record<string, unknown> {
  const payload: EncryptedPayload = JSON.parse(payloadJson);

  const viewKeyRaw = Buffer.from(viewKeyHex, "hex");
  const ephemeralPub = Buffer.from(payload.ephemeralPub, "hex");

  const privKey = crypto.createPrivateKey({
    key: buildX25519Pkcs8(viewKeyRaw),
    format: "der",
    type: "pkcs8",
  });
  const ephPubKey = crypto.createPublicKey({
    key: buildX25519Spki(ephemeralPub),
    format: "der",
    type: "spki",
  });

  const sharedSecret = crypto.diffieHellman({
    privateKey: privKey,
    publicKey: ephPubKey,
  });

  const encKey = crypto.hkdfSync("sha256", sharedSecret, ephemeralPub, "CartorioChain ViewKey v1", 32);

  const nonce = Buffer.from(payload.nonce, "hex");
  const authTag = Buffer.from(payload.authTag, "hex");
  const ciphertext = Buffer.from(payload.ciphertext, "base64");

  const decipher = crypto.createDecipheriv("aes-256-gcm", Buffer.from(encKey), nonce);
  decipher.setAuthTag(authTag);
  const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]);

  return JSON.parse(plaintext.toString("utf-8"));
}

// ──────────────────────────────────────────────────────────────
// Helpers para construir DER mínimo com chave raw X25519 (RFC 8410)
// ──────────────────────────────────────────────────────────────

// SPKI para X25519: OID 1.3.101.110 + chave pública raw
const X25519_SPKI_PREFIX = Buffer.from(
  "302a300506032b656e032100",
  "hex"
);

// PKCS8 para X25519: version 0 + AlgorithmIdentifier + chave privada raw
const X25519_PKCS8_PREFIX = Buffer.from(
  "302e020100300506032b656e04220420",
  "hex"
);

function buildX25519Spki(rawPub: Buffer): Buffer {
  return Buffer.concat([X25519_SPKI_PREFIX, rawPub]);
}

function buildX25519Pkcs8(rawPriv: Buffer): Buffer {
  return Buffer.concat([X25519_PKCS8_PREFIX, rawPriv]);
}
