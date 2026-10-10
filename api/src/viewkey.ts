/**
 * ViewKey encryption — protege PII do signatário (LGPD)
 *
 * Semântica inspirada no ZCash ViewKey, agora com proteção PÓS-QUÂNTICA:
 *   - viewKey (secretKey do KEM híbrido) = chave de visualização — holder guarda offline
 *   - paymentAddress (publicKey do KEM híbrido) = endereço público do signatário
 *   - viewkeyPayload = PII cifrado — ninguém lê sem o viewKey
 *
 * Criptografia: KEM HÍBRIDO X25519 + ML-KEM-768 (preset `ml_kem768_x25519` do
 * @noble/post-quantum — construção X-Wing, draft-connolly-cfrg-xwing-kem) para encapsular a chave,
 * + AES-256-GCM para cifrar os dados. "Harvest now, decrypt later" resolvido: mesmo que o X25519
 * clássico caia para um computador quântico (Shor), o ML-KEM-768 (FIPS 203) segura o segredo — e
 * vice-versa. Só quebra se AMBOS caírem.
 *
 * Nota de módulo: @noble/post-quantum é ESM puro e a API compila CommonJS, então o KEM é carregado
 * via dynamic import (encapsulado p/ não ser rebaixado a require pelo TS). As funções são async.
 */

import * as crypto from "crypto";

export interface ViewKeyPair {
  viewKey: string;        // hex (secretKey do KEM híbrido) — GUARDAR OFFLINE
  paymentAddress: string; // hex (publicKey do KEM híbrido) — pode ser público
}

export interface EncryptedPayload {
  v: string;          // versão do esquema
  kemCt: string;      // hex — ciphertext do KEM (encapsulamento híbrido)
  nonce: string;      // hex 12 bytes
  authTag: string;    // hex 16 bytes
  ciphertext: string; // base64 (AES-256-GCM)
}

const SCHEME_VERSION = "vk-pqc-v2";
const HKDF_INFO = "CartorioChain ViewKey PQC v2";

// @noble/post-quantum é ESM; carregamos via import() nativo sem o TS rebaixar para require().
const _dynImport: (p: string) => Promise<any> = new Function("p", "return import(p)") as any;
let _kemPromise: Promise<any> | null = null;

/** KEM híbrido X25519 + ML-KEM-768 (X-Wing), carregado uma vez. */
async function getKem(): Promise<any> {
  if (!_kemPromise) {
    _kemPromise = _dynImport("@noble/post-quantum/hybrid.js").then(
      (m: any) => m.ml_kem768_x25519
    );
  }
  return _kemPromise;
}

/** Deriva a chave AES-256 a partir do shared secret do KEM (HKDF-SHA256, domain-separated). */
function deriveAesKey(sharedSecret: Uint8Array): Buffer {
  const dk = crypto.hkdfSync("sha256", Buffer.from(sharedSecret), Buffer.alloc(0), HKDF_INFO, 32);
  return Buffer.from(dk);
}

/**
 * Gera um par viewKey / paymentAddress (KEM híbrido) para um novo signatário.
 */
export async function generateViewKeyPair(): Promise<ViewKeyPair> {
  const kem = await getKem();
  const { secretKey, publicKey } = kem.keygen();
  return {
    viewKey: Buffer.from(secretKey).toString("hex"),
    paymentAddress: Buffer.from(publicKey).toString("hex"),
  };
}

/**
 * Cifra os dados do signatário com o paymentAddress (chave pública híbrida).
 * Retorna payload JSON pronto para armazenar.
 */
export async function encryptForViewKey(
  plaintext: Record<string, unknown>,
  paymentAddressHex: string
): Promise<string> {
  const kem = await getKem();
  const encapsKey = Uint8Array.from(Buffer.from(paymentAddressHex, "hex"));

  // Encapsulamento híbrido: devolve ciphertext + shared secret (32 bytes)
  const { cipherText, sharedSecret } = kem.encapsulate(encapsKey);
  const encKey = deriveAesKey(sharedSecret);

  const nonce = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", encKey, nonce);
  const data = Buffer.from(JSON.stringify(plaintext), "utf-8");
  const ciphertext = Buffer.concat([cipher.update(data), cipher.final()]);
  const authTag = cipher.getAuthTag();

  const payload: EncryptedPayload = {
    v: SCHEME_VERSION,
    kemCt: Buffer.from(cipherText).toString("hex"),
    nonce: nonce.toString("hex"),
    authTag: authTag.toString("hex"),
    ciphertext: ciphertext.toString("base64"),
  };

  return JSON.stringify(payload);
}

/**
 * Decifra o viewkeyPayload com o viewKey (secretKey híbrida).
 * Só funciona se o viewKey corresponder ao paymentAddress usado na cifragem.
 */
export async function decryptViewKeyPayload(
  payloadJson: string,
  viewKeyHex: string
): Promise<Record<string, unknown>> {
  const kem = await getKem();
  const payload: EncryptedPayload = JSON.parse(payloadJson);

  const secretKey = Uint8Array.from(Buffer.from(viewKeyHex, "hex"));
  const kemCt = Uint8Array.from(Buffer.from(payload.kemCt, "hex"));

  // Decapsulamento híbrido → mesmo shared secret
  const sharedSecret = kem.decapsulate(kemCt, secretKey);
  const encKey = deriveAesKey(sharedSecret);

  const nonce = Buffer.from(payload.nonce, "hex");
  const authTag = Buffer.from(payload.authTag, "hex");
  const ciphertext = Buffer.from(payload.ciphertext, "base64");

  const decipher = crypto.createDecipheriv("aes-256-gcm", encKey, nonce);
  decipher.setAuthTag(authTag);
  const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]);

  return JSON.parse(plaintext.toString("utf-8"));
}
