/**
 * Verifica se uma transação na chain Tempo transferiu USDC suficiente
 * para o endereço da cartório. EVM-compatible, usa JSON-RPC padrão.
 *
 * Fluxo pay-per-use:
 *   1. Cliente paga USDC na Tempo → obtém txHash
 *   2. Cliente envia txHash junto com o registro do documento
 *   3. Este módulo verifica: tx sucesso + destinatário correto + valor ≥ mínimo
 *   4. Se válido → prossegue com registro no Solana + ZK proof
 */

// Mainnet: https://rpc.tempo.xyz (Chain ID 4217)
// Testnet: https://rpc.moderato.tempo.xyz (Chain ID 42431)
const TEMPO_RPC =
  process.env.TEMPO_RPC ??
  (process.env.TEMPO_NETWORK === "mainnet"
    ? "https://rpc.tempo.xyz"
    : "https://rpc.moderato.tempo.xyz");

// USDC.e no Tempo mainnet — mesmo endereço no testnet
const USDC_CONTRACT = (
  process.env.TEMPO_USDC_CONTRACT ?? "0x20C000000000000000000000b9537d11c60E8b50"
).toLowerCase();

// ERC-20 Transfer(address indexed from, address indexed to, uint256 value)
const TRANSFER_TOPIC = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";

// Previne reuso do mesmo txHash para múltiplos documentos
const usedTxHashes = new Set<string>();

export interface TempoPaymentResult {
  valid: boolean;
  from?: string;
  to?: string;
  amountUsdc?: number;   // valor em USDC (ex: 1.5 = $1.50)
  error?: string;
}

async function rpcCall(method: string, params: unknown[]): Promise<unknown> {
  const resp = await fetch(TEMPO_RPC, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", method, params, id: 1 }),
  });
  const data = (await resp.json()) as {
    result?: unknown;
    error?: { message: string };
  };
  if (data.error) throw new Error(`Tempo RPC: ${data.error.message}`);
  return data.result;
}

function normalizeAddress(addr: string): string {
  return addr.toLowerCase().replace(/^0x/, "");
}

function padded32ToAddress(hex: string): string {
  // topic é padded a 32 bytes → extrair últimos 20 bytes (40 chars)
  return "0x" + hex.replace(/^0x/, "").slice(-40).toLowerCase();
}

export async function verifyTempoPayment(
  txHashRaw: string,
  recipientAddress: string,
  minAmountUsdc: number
): Promise<TempoPaymentResult> {
  const txHash = txHashRaw.toLowerCase().startsWith("0x")
    ? txHashRaw.toLowerCase()
    : "0x" + txHashRaw.toLowerCase();

  // Anti-replay: cada txHash só vale uma vez
  if (usedTxHashes.has(txHash)) {
    return { valid: false, error: "txHash ja utilizado em outro documento" };
  }

  let receipt: Record<string, unknown>;
  try {
    receipt = (await rpcCall("eth_getTransactionReceipt", [txHash])) as Record<
      string,
      unknown
    >;
  } catch (e) {
    return { valid: false, error: `Falha ao consultar Tempo RPC: ${(e as Error).message}` };
  }

  if (!receipt) {
    return { valid: false, error: "transacao nao encontrada na chain Tempo" };
  }

  // status "0x1" = sucesso
  if (receipt.status !== "0x1") {
    return { valid: false, error: "transacao Tempo com status de falha" };
  }

  // Procura nos logs um Transfer do USDC para o endereço da cartório
  const logs = (receipt.logs as Array<Record<string, unknown>>) ?? [];
  const recipientNorm = normalizeAddress(recipientAddress);

  for (const log of logs) {
    const logAddress = normalizeAddress(log.address as string);
    if (logAddress !== normalizeAddress(USDC_CONTRACT)) continue;

    const topics = log.topics as string[];
    if (!topics || topics.length < 3) continue;
    if (topics[0].toLowerCase() !== TRANSFER_TOPIC) continue;

    const toAddress = normalizeAddress(padded32ToAddress(topics[2]));
    if (toAddress !== recipientNorm) continue;

    // Valor: data field como uint256 big-endian hex
    const rawData = (log.data as string).replace(/^0x/, "");
    const value = BigInt("0x" + (rawData || "0"));

    // USDC tem 6 decimais
    const amountUsdc = Number(value) / 1_000_000;

    if (amountUsdc < minAmountUsdc) {
      return {
        valid: false,
        error: `valor insuficiente: ${amountUsdc.toFixed(2)} USDC (minimo: ${minAmountUsdc} USDC)`,
        from: padded32ToAddress(topics[1]),
        to: "0x" + toAddress,
        amountUsdc,
      };
    }

    // Tudo válido — marcar txHash como usado
    usedTxHashes.add(txHash);

    return {
      valid: true,
      from: padded32ToAddress(topics[1]),
      to: "0x" + toAddress,
      amountUsdc,
    };
  }

  return {
    valid: false,
    error: `nenhuma transferencia USDC encontrada para ${recipientAddress} nesta transacao`,
  };
}

export function tempoExplorerUrl(txHash: string): string {
  const base =
    process.env.TEMPO_NETWORK === "mainnet"
      ? "https://explore.tempo.xyz"
      : "https://explore.testnet.tempo.xyz";
  return `${base}/tx/${txHash}`;
}
