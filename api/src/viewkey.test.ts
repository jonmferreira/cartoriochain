/**
 * Teste do ViewKey híbrido pós-quântico (X25519 + ML-KEM-768).
 * Roda standalone: `npx ts-node src/viewkey.test.ts` (a partir de code/api).
 * Sem framework — asserts simples + exit code. "Testar de verdade" (lição do inspirado-em).
 */
import { generateViewKeyPair, encryptForViewKey, decryptViewKeyPayload } from "./viewkey";

let passed = 0;
let failed = 0;
function ok(cond: boolean, name: string, extra = "") {
  if (cond) { passed++; console.log(`  PASS ${name} ${extra}`); }
  else { failed++; console.error(`  FAIL ${name} ${extra}`); }
}

async function main() {
  console.log("ViewKey PQC (X25519 + ML-KEM-768) — testes\n");

  const pair = await generateViewKeyPair();
  const pubBytes = pair.paymentAddress.length / 2;
  const secBytes = pair.viewKey.length / 2;

  // 1. Tamanho das chaves prova que ML-KEM-768 está presente (X25519 puro seria 32 bytes)
  ok(pubBytes > 1000, "paymentAddress é chave híbrida (ML-KEM-768 + X25519)", `(${pubBytes} bytes)`);
  ok(secBytes === 32, "viewKey é o seed X-Wing de 32 bytes (spec draft-connolly-cfrg-xwing-kem)", `(${secBytes} bytes)`);

  const data = { nome: "Maria Silva", cpf: "123.456.789-00", papel: "compradora MCMV" };

  // 2. Round-trip: cifra → decifra = mesmo dado
  const payloadStr = await encryptForViewKey(data, pair.paymentAddress);
  const payload = JSON.parse(payloadStr);
  ok(payload.v === "vk-pqc-v2", "payload versionado vk-pqc-v2");
  const kemCtBytes = payload.kemCt.length / 2;
  ok(kemCtBytes > 1000, "kemCt é ciphertext híbrido (ML-KEM-768)", `(${kemCtBytes} bytes)`);
  const back = await decryptViewKeyPayload(payloadStr, pair.viewKey);
  ok(JSON.stringify(back) === JSON.stringify(data), "round-trip decifra o dado original");

  // 3. Chave errada falha (outro keypair não decifra)
  const other = await generateViewKeyPair();
  let wrongKeyThrew = false;
  try { await decryptViewKeyPayload(payloadStr, other.viewKey); }
  catch { wrongKeyThrew = true; }
  ok(wrongKeyThrew, "viewKey errado NÃO decifra (authTag falha)");

  // 4. Tamper no ciphertext falha (AEAD integridade)
  const tampered = { ...payload };
  const ctBuf = Buffer.from(payload.ciphertext, "base64");
  ctBuf[0] ^= 0xff;
  tampered.ciphertext = ctBuf.toString("base64");
  let tamperThrew = false;
  try { await decryptViewKeyPayload(JSON.stringify(tampered), pair.viewKey); }
  catch { tamperThrew = true; }
  ok(tamperThrew, "ciphertext adulterado NÃO decifra (GCM authTag)");

  // 5. Tamper no kemCt falha (encapsulamento inválido → shared secret diferente)
  const tampered2 = { ...payload };
  const kemBuf = Buffer.from(payload.kemCt, "hex");
  kemBuf[0] ^= 0xff;
  tampered2.kemCt = kemBuf.toString("hex");
  let kemTamperThrew = false;
  try { await decryptViewKeyPayload(JSON.stringify(tampered2), pair.viewKey); }
  catch { kemTamperThrew = true; }
  ok(kemTamperThrew, "kemCt adulterado NÃO decifra");

  console.log(`\n${passed} passaram, ${failed} falharam`);
  process.exit(failed === 0 ? 0 : 1);
}

main().catch((e) => { console.error("ERRO FATAL:", e); process.exit(1); });
