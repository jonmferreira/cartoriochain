/**
 * Prova e2e da integração Tempo — verifica uma transação USDC real na testnet
 * Moderato usando a MESMA lógica do backend (api/src/tempo.ts), sem dependências.
 *
 * Fluxo da prova (honesto para a trilha Tempo):
 *   1. Você faz 1 transferência de USDC na testnet Moderato (via MetaMask/wallet)
 *      para o endereço da cartório. Anota o txHash.
 *   2. Roda este script com o txHash → ele consulta a RPC do Tempo e confirma
 *      que o backend valida a transação (destinatário + valor + status).
 *
 * Uso:
 *   node test-tempo-e2e.mjs <txHash> <recipientAddress> [minUsdc=1.00]
 *
 * Env (opcional):
 *   TEMPO_RPC            (default testnet: https://rpc.moderato.tempo.xyz)
 *   TEMPO_USDC_CONTRACT  (default 0x20C000000000000000000000b9537d11c60E8b50)
 *
 * Como obter USDC de testnet / fazer a tx:
 *   - Adicionar rede Tempo Moderato na wallet (chainId 42431, RPC acima)
 *   - Conseguir USDC de testnet (faucet Tempo) e enviar p/ o CARTORIO_WALLET
 *   - Pegar o txHash no explorer: https://explore.testnet.tempo.xyz
 */

const TEMPO_RPC = process.env.TEMPO_RPC ?? "https://rpc.moderato.tempo.xyz";
const USDC_CONTRACT = (
  process.env.TEMPO_USDC_CONTRACT ?? "0x20C000000000000000000000b9537d11c60E8b50"
).toLowerCase();
const TRANSFER_TOPIC =
  "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";

async function rpcCall(method, params) {
  const resp = await fetch(TEMPO_RPC, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", method, params, id: 1 }),
  });
  const data = await resp.json();
  if (data.error) throw new Error(`Tempo RPC: ${data.error.message}`);
  return data.result;
}

const norm = (a) => a.toLowerCase().replace(/^0x/, "");
const padded32ToAddress = (hex) =>
  "0x" + hex.replace(/^0x/, "").slice(-40).toLowerCase();

async function verify(txHashRaw, recipient, minUsdc) {
  const txHash = txHashRaw.toLowerCase().startsWith("0x")
    ? txHashRaw.toLowerCase()
    : "0x" + txHashRaw.toLowerCase();

  console.log(`\nRPC:        ${TEMPO_RPC}`);
  console.log(`USDC:       ${USDC_CONTRACT}`);
  console.log(`txHash:     ${txHash}`);
  console.log(`recipient:  ${recipient}`);
  console.log(`min USDC:   ${minUsdc}\n`);

  const receipt = await rpcCall("eth_getTransactionReceipt", [txHash]);
  if (!receipt) return fail("transação não encontrada na chain Tempo");
  if (receipt.status !== "0x1") return fail("transação com status de falha");

  const recipientNorm = norm(recipient);
  const logs = receipt.logs ?? [];

  for (const log of logs) {
    if (norm(log.address) !== norm(USDC_CONTRACT)) continue;
    const topics = log.topics ?? [];
    if (topics.length < 3) continue;
    if (topics[0].toLowerCase() !== TRANSFER_TOPIC) continue;

    const to = norm(padded32ToAddress(topics[2]));
    if (to !== recipientNorm) continue;

    const value = BigInt("0x" + (log.data.replace(/^0x/, "") || "0"));
    const amountUsdc = Number(value) / 1_000_000;
    const from = padded32ToAddress(topics[1]);

    if (amountUsdc < minUsdc)
      return fail(
        `valor insuficiente: ${amountUsdc.toFixed(2)} USDC (mín ${minUsdc})`,
        { from, to: "0x" + to, amountUsdc }
      );

    console.log("✅ VÁLIDO — backend aceitaria este pagamento");
    console.log(`   from:   ${from}`);
    console.log(`   to:     0x${to}`);
    console.log(`   amount: ${amountUsdc} USDC`);
    console.log(`   explorer: https://explore.testnet.tempo.xyz/tx/${txHash}\n`);
    return true;
  }
  return fail(`nenhuma transferência USDC encontrada para ${recipient}`);
}

function fail(msg, extra) {
  console.log(`❌ INVÁLIDO — ${msg}`);
  if (extra) console.log("  ", extra);
  console.log();
  return false;
}

const [txHash, recipient, minArg] = process.argv.slice(2);
if (!txHash || !recipient) {
  console.log(
    "uso: node test-tempo-e2e.mjs <txHash> <recipientAddress> [minUsdc=1.00]"
  );
  process.exit(1);
}
verify(txHash, recipient, parseFloat(minArg ?? "1.00")).then((ok) =>
  process.exit(ok ? 0 : 1)
);
