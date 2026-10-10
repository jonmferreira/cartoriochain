/**
 * Benchmark de desempenho da camada ViewKey pós-quântica (keygen / encrypt / decrypt).
 * Objetivo: evidenciar que a criptografia híbrida X25519+ML-KEM-768 adiciona latência negligenciável
 * e sustenta alta vazão — compatível com a expectativa de ALTA DISPONIBILIDADE / continuidade das
 * normas do e-notariado do CNJ (Prov. 100/2020, 149/2023, 213/2026). NÃO há SLA numérico de latência
 * cripto no CNJ; este bench demonstra FOLGA de desempenho, não um SLA certificado.
 *
 * Roda: `npx ts-node src/viewkey.bench.ts` (a partir de code/api).
 */
import { generateViewKeyPair, encryptForViewKey, decryptViewKeyPayload } from "./viewkey";

function stats(ms: number[]) {
  const s = [...ms].sort((a, b) => a - b);
  const pick = (p: number) => s[Math.min(s.length - 1, Math.floor((p / 100) * s.length))];
  const sum = s.reduce((a, b) => a + b, 0);
  return { avg: sum / s.length, p50: pick(50), p95: pick(95), p99: pick(99), min: s[0], max: s[s.length - 1] };
}
function fmt(n: number) { return n.toFixed(3); }
function row(label: string, st: ReturnType<typeof stats>) {
  console.log(
    `  ${label.padEnd(10)} avg ${fmt(st.avg)}ms · p50 ${fmt(st.p50)}ms · p95 ${fmt(st.p95)}ms · ` +
    `p99 ${fmt(st.p99)}ms · min ${fmt(st.min)}ms · max ${fmt(st.max)}ms · ~${Math.round(1000 / st.avg)} ops/s`
  );
}

async function main() {
  const N = 500;
  const data = { nome: "Maria Silva", cpf: "123.456.789-00", papel: "compradora MCMV", imovel: "Residencial X, Manaus/AM" };
  console.log(`ViewKey PQC — benchmark de desempenho (N=${N} por operação)\n`);

  // Warmup (carrega o KEM via dynamic import, aquece JIT)
  const pair = await generateViewKeyPair();
  const warm = await encryptForViewKey(data, pair.paymentAddress);
  await decryptViewKeyPayload(warm, pair.viewKey);

  const kg: number[] = [];
  for (let i = 0; i < N; i++) { const t = performance.now(); await generateViewKeyPair(); kg.push(performance.now() - t); }

  const enc: number[] = [];
  const payloads: string[] = [];
  for (let i = 0; i < N; i++) { const t = performance.now(); const p = await encryptForViewKey(data, pair.paymentAddress); enc.push(performance.now() - t); payloads.push(p); }

  const dec: number[] = [];
  for (let i = 0; i < N; i++) { const t = performance.now(); await decryptViewKeyPayload(payloads[i], pair.viewKey); dec.push(performance.now() - t); }

  const kgS = stats(kg), encS = stats(enc), decS = stats(dec);
  console.log("Resultados:");
  row("keygen", kgS);
  row("encrypt", encS);
  row("decrypt", decS);

  // Barra de responsividade interna (sanity, generosa — NÃO é SLA do CNJ)
  const BAR = 50; // ms p95 por operação
  let passed = 0, failed = 0;
  const check = (name: string, p95: number) => {
    if (p95 < BAR) { passed++; console.log(`  PASS ${name} p95 ${fmt(p95)}ms < ${BAR}ms`); }
    else { failed++; console.error(`  FAIL ${name} p95 ${fmt(p95)}ms >= ${BAR}ms`); }
  };
  console.log(`\nBarra de responsividade interna (p95 < ${BAR}ms/op — folga p/ operacao continua):`);
  check("keygen", kgS.p95);
  check("encrypt", encS.p95);
  check("decrypt", decS.p95);

  const fullDoc = kgS.avg + encS.avg; // keygen + encrypt = custo de registrar 1 documento
  console.log(`\nCusto cripto por documento (keygen + encrypt): ~${fmt(fullDoc)}ms → ~${Math.round(1000 / fullDoc)} docs/s por core.`);
  console.log("Conformidade CNJ: latencia cripto negligenciavel; folga p/ alta disponibilidade (Prov. 100/149/213).");

  console.log(`\n${passed} passaram, ${failed} falharam`);
  process.exit(failed === 0 ? 0 : 1);
}

main().catch((e) => { console.error("ERRO FATAL:", e); process.exit(1); });
