/**
 * Teste end-to-end do fluxo ZK: geração e verificação de prova secp256k1 + Noir
 *
 * Execução: node test-zk.mjs
 * Requer servidor rodando em http://localhost:3001 com DEMO_MODE=false (ou qualquer modo,
 * pois /proofs/generate e /proofs/verify não são afetados por DEMO_MODE).
 *
 * Fix crítico: @noble/secp256k1 v3 aplica SHA-256 interno por padrão (prehash: true).
 * O circuito Noir passa doc_hash diretamente para verify_signature sem hash adicional.
 * Portanto sign/verify devem usar { prehash: false } — sign o hash já computado.
 */

import * as secp from "@noble/secp256k1";
import { sha256 } from "@noble/hashes/sha2.js";
import { hmac } from "@noble/hashes/hmac.js";

const API = "http://localhost:3001";

// Configura HMAC-SHA256 síncrono (necessário para secp.sign() síncrono via RFC6979)
secp.hashes.sha256 = sha256;
secp.hashes.hmacSha256 = (key, msg) => hmac(sha256, key, msg);

function hex(bytes) {
  return Buffer.from(bytes).toString("hex");
}

async function main() {
  console.log("=== CartórioChain — ZK Proof Test ===\n");

  // 1. Gerar chave privada e pública secp256k1
  const privKey = secp.utils.randomSecretKey();
  const pubKeyUncompressed = secp.getPublicKey(privKey, false); // 65 bytes: 04 || X(32) || Y(32)

  // Extrair X e Y: byte 0 = 0x04 (uncompressed marker), X = bytes 1-32, Y = bytes 33-64
  const pubKeyX = pubKeyUncompressed.slice(1, 33);  // 32 bytes
  const pubKeyY = pubKeyUncompressed.slice(33, 65); // 32 bytes

  console.log("privKey:   ", hex(privKey));
  console.log("pubKeyX:   ", hex(pubKeyX));
  console.log("pubKeyY:   ", hex(pubKeyY));

  // 2. SHA-256 do documento
  const docContent = new TextEncoder().encode("Contrato habitacional — Minha Casa Minha Vida 2026");
  const docHash = sha256(docContent); // Uint8Array(32)
  console.log("\ndocHash:   ", hex(docHash));

  // 3. Assinar o hash diretamente SEM prehash adicional
  //    CRÍTICO: prehash: false — o circuito Noir usa o hash como-está
  const sig = secp.sign(docHash, privKey, { prehash: false }); // Uint8Array(64) = r||s compact
  console.log("signature: ", hex(sig), `(${sig.length} bytes)`);

  // 4. Verificação local para confirmar que a assinatura é válida antes de enviar ao circuito
  const localOk = secp.verify(sig, docHash, pubKeyUncompressed, { prehash: false });
  console.log("\nVerificação local (secp.verify):", localOk ? "✓ OK" : "✗ FALHOU");
  if (!localOk) {
    console.error("ERRO: assinatura inválida localmente — abortando.");
    process.exit(1);
  }

  // 5. Chamada à API: POST /proofs/generate
  console.log("\n--- POST /proofs/generate ---");
  const form = new FormData();
  form.append("pubKeyX", hex(pubKeyX));
  form.append("pubKeyY", hex(pubKeyY));
  form.append("signature", hex(sig));
  form.append("docHash", hex(docHash));

  console.log("Aguardando prova ZK (pode demorar 30-120s)...");
  const t0 = Date.now();
  const genResp = await fetch(`${API}/proofs/generate`, { method: "POST", body: form });
  const genData = await genResp.json();
  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);

  if (!genResp.ok || genData.error) {
    console.error(`✗ Erro ao gerar prova (${elapsed}s):`, genData.error ?? genData);
    process.exit(1);
  }

  console.log(`✓ Prova gerada em ${elapsed}s`);
  console.log("  commitment:       ", genData.commitment);
  console.log("  proof (primeiros 64 chars): ", genData.proof?.slice(0, 64) + "...");
  console.log("  publicInputs count:", genData.publicInputs?.length);

  // 6. Chamada à API: POST /proofs/verify
  console.log("\n--- POST /proofs/verify ---");
  const verifyResp = await fetch(`${API}/proofs/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ proof: genData.proof, publicInputs: genData.publicInputs }),
  });
  const verifyData = await verifyResp.json();

  if (!verifyResp.ok || verifyData.error) {
    console.error("✗ Erro ao verificar prova:", verifyData.error ?? verifyData);
    process.exit(1);
  }

  console.log("✓ Verificação ZK:", verifyData.valid ? "VÁLIDA" : "INVÁLIDA");

  if (verifyData.valid) {
    console.log("\n=== SUCESSO: Fluxo ZK completo ===");
    console.log("O circuito Noir comprova que o signatário conhece a chave privada");
    console.log("que gerou a assinatura sobre o hash do documento, sem revelar a chave.");
  } else {
    console.error("\n=== FALHOU: Prova gerada mas verificação retornou false ===");
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Erro não tratado:", err);
  process.exit(1);
});
