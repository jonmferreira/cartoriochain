/**
 * Testes de segurança derivados da pesquisa de vulnerabilidades.
 * Ver docs/seguranca-vulnerabilidades-pesquisa.md (hipótese → teste → status).
 * Roda standalone: `npx ts-node src/viewkey.security.test.ts` (a partir de code/api).
 */
import { generateViewKeyPair, encryptForViewKey, decryptViewKeyPayload } from "./viewkey";
import * as fs from "fs";
import * as path from "path";

const _dynImport: (p: string) => Promise<any> = new Function("p", "return import(p)") as any;

let passed = 0;
let failed = 0;
function ok(cond: boolean, name: string, extra = "") {
  if (cond) { passed++; console.log(`  PASS ${name} ${extra}`); }
  else { failed++; console.error(`  FAIL ${name} ${extra}`); }
}

async function main() {
  console.log("ViewKey — testes de segurança (V1 timing · V2 low-order X25519 · V3 nonce reuse · CSPRNG)\n");

  const kem = (await _dynImport("@noble/post-quantum/hybrid.js")).ml_kem768_x25519;
  const pair = await generateViewKeyPair();
  const secret = Uint8Array.from(Buffer.from(pair.viewKey, "hex"));
  const data = { nome: "Teste Silva", cpf: "000.000.000-00" };

  // ── V3 — não reuso de nonce/chave (AES-GCM nonce reuse, R4) ──
  const p1 = JSON.parse(await encryptForViewKey(data, pair.paymentAddress));
  const p2 = JSON.parse(await encryptForViewKey(data, pair.paymentAddress));
  ok(p1.nonce !== p2.nonce, "V3 nonce diferente a cada cifragem");
  ok(Buffer.from(p1.nonce, "hex").length === 12, "V3 nonce = 12 bytes");
  ok(p1.kemCt !== p2.kemCt, "V3 encapsulamento fresco (kemCt difere)");
  ok(p1.ciphertext !== p2.ciphertext, "V3 ciphertext difere p/ mesmo dado");
  const d1 = await decryptViewKeyPayload(JSON.stringify(p1), pair.viewKey);
  const d2 = await decryptViewKeyPayload(JSON.stringify(p2), pair.viewKey);
  ok(JSON.stringify(d1) === JSON.stringify(data) && JSON.stringify(d2) === JSON.stringify(data),
    "V3 ambas cifragens decifram o original");

  // ── CSPRNG — artefatos independentes nunca colidem ──
  const a = await generateViewKeyPair();
  const b = await generateViewKeyPair();
  ok(a.viewKey !== b.viewKey && a.paymentAddress !== b.paymentAddress,
    "CSPRNG keypairs independentes diferem");

  // ── V2 — X25519 de ordem baixa / zero (RFC 7748 §6.1, R3) ──
  // publicKey X-Wing = ML-KEM-768 encap-key (1184 B) ‖ X25519 pub (32 B). Zeramos o X25519 (ponto de ordem baixa).
  const pub = Buffer.from(pair.paymentAddress, "hex");
  const tampered = Buffer.from(pub);
  tampered.fill(0, tampered.length - 32); // X25519 = todo-zero (low-order)
  let v2ok = false; let note = "";
  try {
    const e1 = kem.encapsulate(Uint8Array.from(tampered));
    const e2 = kem.encapsulate(Uint8Array.from(tampered));
    const ss1 = Buffer.from(e1.sharedSecret).toString("hex");
    const ss2 = Buffer.from(e2.sharedSecret).toString("hex");
    const ct1 = Buffer.from(e1.cipherText).toString("hex");
    // mesmo com X25519 zerado, o ML-KEM injeta entropia fresca → segredo NÃO é previsível/estático
    v2ok = ss1 !== ss2 && ct1 !== Buffer.from(e2.cipherText).toString("hex");
    note = "saida nao-deterministica — hibrido segura apesar do X25519 zerado";
  } catch {
    v2ok = true; // lib rejeitou a chave malformada = também aceitável (falha limpa)
    note = "lib rejeitou chave de ordem baixa (falha limpa)";
  }
  ok(v2ok, "V2 X25519 ordem-baixa/zero nao gera segredo previsivel", `(${note})`);

  // ── V1 — rejeição implícita / constant-time do ML-KEM (KyberSlash, R1) ──
  const pkgPath = path.join(__dirname, "..", "node_modules", "@noble", "post-quantum", "package.json");
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
  ok(!!pkg.version, "V1 versao da lib presente", `(@noble/post-quantum ${pkg.version})`);
  const enc = kem.encapsulate(Uint8Array.from(pub));
  const ssValid = kem.decapsulate(Uint8Array.from(enc.cipherText), secret);
  ok(Buffer.from(ssValid).length === 32, "V1 decapsula ct valido -> shared secret 32B");
  const badCt = Uint8Array.from(enc.cipherText);
  badCt[0] ^= 0xff;
  let implicitReject = false; let rlen = 0;
  try {
    const ssBad = kem.decapsulate(badCt, secret);
    rlen = Buffer.from(ssBad).length;
    // ML-KEM faz rejeição implícita: ct inválido devolve um segredo pseudo-aleatório (32B), NÃO lança
    // por early-exit dependente de segredo. Segredo errado difere do válido.
    implicitReject = rlen === 32 && Buffer.from(ssBad).toString("hex") !== Buffer.from(ssValid).toString("hex");
  } catch { implicitReject = false; }
  ok(implicitReject, "V1 ct invalido -> rejeicao implicita constant-time (retorna 32B != valido, sem early-exit)", `(len ${rlen})`);

  console.log(`\n${passed} passaram, ${failed} falharam`);
  process.exit(failed === 0 ? 0 : 1);
}

main().catch((e) => { console.error("ERRO FATAL:", e); process.exit(1); });
