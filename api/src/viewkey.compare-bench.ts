/**
 * Benchmark COMPARATIVO: criptografia clássica (X25519-só, esquema antigo) vs híbrida pós-quântica
 * (X25519 + ML-KEM-768, atual). Emite JSON com latências, vazão e tamanhos para o script de plot
 * (estilo TCC/matplotlib). Roda: `npx ts-node src/viewkey.compare-bench.ts`.
 *
 * O caminho "clássico" reconstrói o esquema ECIES X25519 que o projeto usava antes do PQC — serve só
 * de baseline de comparação (medição real, não estimativa).
 */
import * as crypto from "crypto";
import * as os from "os";
import * as fs from "fs";
import * as path from "path";
import { generateViewKeyPair, encryptForViewKey, decryptViewKeyPayload } from "./viewkey";

// ── baseline clássico (X25519 ECIES + AES-256-GCM) ──
const SPKI = Buffer.from("302a300506032b656e032100", "hex");
const PKCS8 = Buffer.from("302e020100300506032b656e04220420", "hex");
function classicalKeygen() {
  const { privateKey, publicKey } = crypto.generateKeyPairSync("x25519", {
    privateKeyEncoding: { type: "pkcs8", format: "der" },
    publicKeyEncoding: { type: "spki", format: "der" },
  });
  return { priv: Buffer.from(privateKey).slice(-32), pub: Buffer.from(publicKey).slice(-32) };
}
function classicalEncrypt(data: object, recipientPub: Buffer) {
  const eph = crypto.generateKeyPairSync("x25519", {
    privateKeyEncoding: { type: "pkcs8", format: "der" },
    publicKeyEncoding: { type: "spki", format: "der" },
  });
  const ephPub = Buffer.from(eph.publicKey).slice(-32);
  const ephPriv = crypto.createPrivateKey({ key: Buffer.concat([PKCS8, Buffer.from(eph.privateKey).slice(-32)]), format: "der", type: "pkcs8" });
  const recip = crypto.createPublicKey({ key: Buffer.concat([SPKI, recipientPub]), format: "der", type: "spki" });
  const ss = crypto.diffieHellman({ privateKey: ephPriv, publicKey: recip });
  const encKey = crypto.hkdfSync("sha256", ss, ephPub, "classical", 32);
  const nonce = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", Buffer.from(encKey), nonce);
  const ct = Buffer.concat([cipher.update(Buffer.from(JSON.stringify(data))), cipher.final()]);
  const tag = cipher.getAuthTag();
  return { ephPub, nonce, tag, ct };
}
function classicalDecrypt(enc: ReturnType<typeof classicalEncrypt>, priv: Buffer) {
  const privKey = crypto.createPrivateKey({ key: Buffer.concat([PKCS8, priv]), format: "der", type: "pkcs8" });
  const ephKey = crypto.createPublicKey({ key: Buffer.concat([SPKI, enc.ephPub]), format: "der", type: "spki" });
  const ss = crypto.diffieHellman({ privateKey: privKey, publicKey: ephKey });
  const encKey = crypto.hkdfSync("sha256", ss, enc.ephPub, "classical", 32);
  const d = crypto.createDecipheriv("aes-256-gcm", Buffer.from(encKey), enc.nonce);
  d.setAuthTag(enc.tag);
  return Buffer.concat([d.update(enc.ct), d.final()]);
}

function stats(ms: number[]) {
  const s = [...ms].sort((a, b) => a - b);
  const pick = (p: number) => s[Math.min(s.length - 1, Math.floor((p / 100) * s.length))];
  const avg = s.reduce((a, b) => a + b, 0) / s.length;
  return { avg, p50: pick(50), p95: pick(95), p99: pick(99), tps: 1000 / avg };
}

async function main() {
  const N = 500;
  const data = { nome: "Maria Silva", cpf: "123.456.789-00", papel: "compradora MCMV", imovel: "Residencial X, Manaus/AM" };

  // ── Clássico ──
  const cKg: number[] = [], cEnc: number[] = [], cDec: number[] = [];
  let cPub = 0, cPayload = 0;
  { const kp = classicalKeygen(); const e = classicalEncrypt(data, kp.pub); classicalDecrypt(e, kp.priv); } // warmup
  for (let i = 0; i < N; i++) { const t = performance.now(); classicalKeygen(); cKg.push(performance.now() - t); }
  const ckp = classicalKeygen(); cPub = ckp.pub.length;
  const cEncs: ReturnType<typeof classicalEncrypt>[] = [];
  for (let i = 0; i < N; i++) { const t = performance.now(); cEncs.push(classicalEncrypt(data, ckp.pub)); cEnc.push(performance.now() - t); }
  for (let i = 0; i < N; i++) { const t = performance.now(); classicalDecrypt(cEncs[i], ckp.priv); cDec.push(performance.now() - t); }
  { const e = cEncs[0]; cPayload = e.ephPub.length + e.nonce.length + e.tag.length + e.ct.length; }

  // ── Híbrido PQC ──
  const hKg: number[] = [], hEnc: number[] = [], hDec: number[] = [];
  let hPub = 0, hPayload = 0;
  { const p = await generateViewKeyPair(); const e = await encryptForViewKey(data, p.paymentAddress); await decryptViewKeyPayload(e, p.viewKey); } // warmup
  for (let i = 0; i < N; i++) { const t = performance.now(); await generateViewKeyPair(); hKg.push(performance.now() - t); }
  const hp = await generateViewKeyPair(); hPub = Buffer.from(hp.paymentAddress, "hex").length;
  const hPayloads: string[] = [];
  for (let i = 0; i < N; i++) { const t = performance.now(); const pl = await encryptForViewKey(data, hp.paymentAddress); hEnc.push(performance.now() - t); hPayloads.push(pl); }
  for (let i = 0; i < N; i++) { const t = performance.now(); await decryptViewKeyPayload(hPayloads[i], hp.viewKey); hDec.push(performance.now() - t); }
  { const pj = JSON.parse(hPayloads[0]); hPayload = Buffer.from(pj.kemCt, "hex").length + Buffer.from(pj.nonce, "hex").length + Buffer.from(pj.authTag, "hex").length + Buffer.from(pj.ciphertext, "base64").length; }

  const out = {
    generatedAt: new Date().toISOString(),
    n: N,
    env: { node: process.version, cpu: os.cpus()[0]?.model?.trim(), cores: os.cpus().length, os: `${os.type()} ${os.release()}` },
    cnj: { latMs: 500, tps: 50, success: 99, fonte: "CNJ Provimento 213/2026 (limiares derivados no TCC)" },
    classical: { label: "Clássico (X25519)", keygen: stats(cKg), encrypt: stats(cEnc), decrypt: stats(cDec), pubBytes: cPub, payloadBytes: cPayload },
    hybrid: { label: "Híbrido PQC (X25519+ML-KEM-768)", keygen: stats(hKg), encrypt: stats(hEnc), decrypt: stats(hDec), pubBytes: hPub, payloadBytes: hPayload },
  };

  const outPath = path.join(__dirname, "..", "..", "docs", "benchmark-data.json");
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2), "utf-8");
  console.log("Dados salvos em", outPath);
  console.log(`clássico encrypt avg ${out.classical.encrypt.avg.toFixed(3)}ms · híbrido encrypt avg ${out.hybrid.encrypt.avg.toFixed(3)}ms`);
  console.log(`pub clássico ${cPub}B · pub híbrido ${hPub}B`);
}

main().catch((e) => { console.error("ERRO FATAL:", e); process.exit(1); });
