import { Hono } from "hono";
import * as crypto from "crypto";
import { uploadDocument, irysGatewayUrl } from "../irys";
import {
  getProvider,
  loadKeypair,
  registerDocument,
  fetchDocument,
  revokeDocument,
} from "../anchor-client";
import { rateLimit } from "../middleware/rate-limit";
import { generateProof, verifyProof } from "../zk";
import { encryptForViewKey } from "../viewkey";
import { verifyTempoPayment, tempoExplorerUrl } from "../tempo";

const documents = new Hono();

const DEMO_MODE = process.env.DEMO_MODE === "true";

const demoStore = new Map<string, Record<string, unknown>>();

function getProviderFromEnv() {
  const keyVal = process.env.WALLET_KEY ?? process.env.WALLET_PATH ?? "";
  if (!keyVal) throw new Error("WALLET_KEY ou WALLET_PATH nao configurado");
  const keypair = loadKeypair(keyVal);
  return getProvider(keypair);
}

function fakeBase58(len: number): string {
  const alphabet = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  return Array.from({ length: len }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join("");
}

function hexToBytes(hex: string): Uint8Array {
  const clean = hex.startsWith("0x") ? hex.slice(2) : hex;
  return Uint8Array.from(Buffer.from(clean, "hex"));
}

documents.use("*", rateLimit(10, 60_000));

// GET /documents/payment-info
// Retorna o endereço e valor para pagar antes de registrar um documento
documents.get("/payment-info", (c) => {
  const cartorioWallet = process.env.CARTORIO_WALLET ?? null;
  const feeUsdc = parseFloat(process.env.TEMPO_FEE_USDC ?? "1.00");
  const network = process.env.TEMPO_NETWORK ?? "testnet";
  const chainId = network === "mainnet" ? 4217 : 42431;
  const usdcContract = process.env.TEMPO_USDC_CONTRACT ?? "0x20C000000000000000000000b9537d11c60E8b50";

  return c.json({
    cartorioWallet,
    feeUsdc,
    currency: "USDC",
    network,
    chainId,
    usdcContract,
    rpc: network === "mainnet" ? "https://rpc.tempo.xyz" : "https://rpc.moderato.tempo.xyz",
    explorer: network === "mainnet" ? "https://explore.tempo.xyz" : "https://explore.testnet.tempo.xyz",
    instructions: cartorioWallet
      ? `Envie ${feeUsdc} USDC para ${cartorioWallet} na chain Tempo (chainId ${chainId}) e inclua o txHash no campo tempoTxHash ao registrar.`
      : "Pagamento nao configurado neste ambiente (CARTORIO_WALLET nao definido).",
  });
});

// POST /documents
// Body (multipart): file, docType, cartorioId, [docIdSeed], [viewkeyPayload],
//                   [pubKeyX (hex 64)], [pubKeyY (hex 64)], [signature (hex 128)],
//                   [tempoTxHash] — hash da tx de pagamento USDC na chain Tempo
documents.post("/", async (c) => {
  try {
    const body = await c.req.parseBody();
    const file = body["file"];
    const docType = body["docType"] as string;
    const cartorioId = body["cartorioId"] as string;
    const docIdSeed = body["docIdSeed"] as string | undefined;
    let viewkeyPayload = body["viewkeyPayload"] as string | undefined;
    const pubKeyXHex = body["pubKeyX"] as string | undefined;
    const pubKeyYHex = body["pubKeyY"] as string | undefined;
    const sigHex = body["signature"] as string | undefined;
    const paymentAddress = body["paymentAddress"] as string | undefined;
    const signerData = body["signerData"] as string | undefined; // JSON com nome, CPF etc.
    const tempoTxHash = body["tempoTxHash"] as string | undefined;

    if (!file || typeof file === "string") return c.json({ error: "arquivo obrigatorio" }, 400);
    if (!docType || !cartorioId) return c.json({ error: "docType e cartorioId obrigatorios" }, 400);

    // Verificação de pagamento via Tempo (pay-per-use)
    // CARTORIO_WALLET = endereço que recebe os pagamentos USDC na chain Tempo
    // TEMPO_FEE_USDC = valor mínimo por documento (default: 1.00 USDC)
    const cartorioWallet = process.env.CARTORIO_WALLET;
    const feeUsdc = parseFloat(process.env.TEMPO_FEE_USDC ?? "1.00");
    const requirePayment = !DEMO_MODE && !!cartorioWallet;

    if (requirePayment) {
      if (!tempoTxHash) {
        return c.json({
          error: "pagamento obrigatorio: envie tempoTxHash com a tx USDC na chain Tempo",
          cartorioWallet,
          feeUsdc,
          tempoNetwork: process.env.TEMPO_NETWORK ?? "testnet",
        }, 402);
      }
      const payResult = await verifyTempoPayment(tempoTxHash, cartorioWallet, feeUsdc);
      if (!payResult.valid) {
        return c.json({
          error: `pagamento invalido: ${payResult.error}`,
          tempoTxHash,
          tempoExplorer: tempoExplorerUrl(tempoTxHash),
        }, 402);
      }
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const docHashHex = crypto.createHash("sha256").update(buffer).digest("hex");

    // Se paymentAddress + signerData fornecidos: cifra PII com ViewKey
    if (paymentAddress && signerData && !viewkeyPayload) {
      try {
        const parsed = JSON.parse(signerData);
        viewkeyPayload = await encryptForViewKey(parsed, paymentAddress);
      } catch {
        return c.json({ error: "signerData deve ser JSON valido" }, 400);
      }
    }

    // Tenta gerar ZK proof se os inputs de assinatura foram fornecidos
    let signerCommitment: string;
    let zkProof: string | null = null;
    let zkPublicInputs: string[] | null = null;

    const hasZkInputs = pubKeyXHex && pubKeyYHex && sigHex && !DEMO_MODE;
    if (hasZkInputs) {
      const pubKeyX = hexToBytes(pubKeyXHex!);
      const pubKeyY = hexToBytes(pubKeyYHex!);
      const signature = hexToBytes(sigHex!);
      const docHash = hexToBytes(docHashHex);

      const result = await generateProof({ pubKeyX, pubKeyY, signature, docHash });
      signerCommitment = result.commitment;
      zkProof = result.proof;
      zkPublicInputs = result.publicInputs;
    } else {
      // DEMO_MODE ou sem assinatura — commitment simulado
      signerCommitment = "0x" + crypto.createHash("sha256").update(docHashHex + (docType ?? "")).digest("hex");
    }

    if (DEMO_MODE) {
      const irystxId = fakeBase58(43);
      const solTx = fakeBase58(88);
      const docId = docIdSeed ?? irystxId;
      const registeredAt = Math.floor(Date.now() / 1000);

      const record = {
        doc_hash: docHashHex,
        irys_tx_id: irystxId,
        doc_type: docType,
        cartorio_id: cartorioId,
        authority: "DEMO_AUTHORITY",
        registered_at: registeredAt,
        revoked: false,
        revoke_reason: "",
        signer_commitment: signerCommitment,
        zk_proof: zkProof,
        zk_public_inputs: zkPublicInputs,
        viewkey_payload: viewkeyPayload ?? null,
        tempo_tx_hash: tempoTxHash ?? null,
        tempo_explorer_url: tempoTxHash ? tempoExplorerUrl(tempoTxHash) : null,
      };
      demoStore.set(docId, record);

      return c.json({
        docId,
        irys_tx_id: irystxId,
        doc_hash: docHashHex,
        signer_commitment: signerCommitment,
        zk_proof: zkProof,
        viewkey_payload: viewkeyPayload,
        registered_at: registeredAt,
        irys_url: irysGatewayUrl(irystxId),
        tx: solTx,
        tempo_tx_hash: tempoTxHash ?? null,
        tempo_explorer_url: tempoTxHash ? tempoExplorerUrl(tempoTxHash) : null,
      });
    }

    const walletKey = process.env.WALLET_KEY ?? process.env.WALLET_PATH ?? "";
    const { txId, docHash } = await uploadDocument(buffer, { docType, cartorioId, fileName: (file as File).name }, walletKey);

    const seed = docIdSeed ?? txId;
    const provider = getProviderFromEnv();
    const { tx, pda } = await registerDocument(
      { docIdSeed: seed, docHash, irystxId: txId, docType, cartorioId, viewkeyPayload },
      provider
    );

    const registeredAt = Math.floor(Date.now() / 1000);

    return c.json({
      docId: seed,
      irys_tx_id: txId,
      doc_hash: docHash.toString("hex"),
      signer_commitment: signerCommitment,
      zk_proof: zkProof,
      viewkey_payload: viewkeyPayload,
      registered_at: registeredAt,
      irys_url: irysGatewayUrl(txId),
      pda,
      tx,
      tempo_tx_hash: tempoTxHash ?? null,
      tempo_explorer_url: tempoTxHash ? tempoExplorerUrl(tempoTxHash) : null,
    });
  } catch (e: unknown) {
    return c.json({ error: (e as Error).message }, 500);
  }
});

// GET /documents/:id
documents.get("/:id", async (c) => {
  const id = c.req.param("id");

  if (DEMO_MODE && demoStore.has(id)) {
    return c.json(demoStore.get(id));
  }

  try {
    const provider = getProviderFromEnv();
    const record = await fetchDocument(id, provider);
    return c.json({
      ...record,
      irys_url: irysGatewayUrl(record.irystxId as string),
      doc_hash: Buffer.from(record.docHash as Uint8Array).toString("hex"),
    });
  } catch (e: unknown) {
    return c.json({ error: (e as Error).message }, 404);
  }
});

// POST /documents/:id/verify
// Body JSON: { docHash: string }
documents.post("/:id/verify", async (c) => {
  const id = c.req.param("id");

  if (DEMO_MODE && demoStore.has(id)) {
    const { docHash } = await c.req.json<{ docHash: string }>();
    const record = demoStore.get(id)!;
    const valid = record.doc_hash === docHash.toLowerCase();

    // Se tiver ZK proof armazenado, verifica também
    let zkValid: boolean | null = null;
    if (record.zk_proof && record.zk_public_inputs) {
      zkValid = await verifyProof(
        record.zk_proof as string,
        record.zk_public_inputs as string[]
      );
    }

    return c.json({
      valid,
      zkValid,
      onChainHash: record.doc_hash,
      provided: docHash.toLowerCase(),
      signerCommitment: record.signer_commitment,
    });
  }

  try {
    const { docHash } = await c.req.json<{ docHash: string }>();
    if (!docHash) return c.json({ error: "docHash obrigatorio" }, 400);

    const provider = getProviderFromEnv();
    const record = await fetchDocument(id, provider);

    if (record.revoked) {
      return c.json({ valid: false, reason: "revogado", revokeReason: record.revokeReason });
    }

    const onChainHash = Buffer.from(record.docHash as Uint8Array).toString("hex");
    const valid = onChainHash === docHash.toLowerCase();

    return c.json({ valid, onChainHash, provided: docHash.toLowerCase() });
  } catch (e: unknown) {
    return c.json({ error: (e as Error).message }, 404);
  }
});

// POST /documents/:id/zk/prove
// Gera prova ZK para um documento já registrado
// Body JSON: { pubKeyX: hex, pubKeyY: hex, signature: hex, docHash: hex }
documents.post("/:id/zk/prove", async (c) => {
  try {
    const { pubKeyX, pubKeyY, signature, docHash } = await c.req.json<{
      pubKeyX: string;
      pubKeyY: string;
      signature: string;
      docHash: string;
    }>();

    if (!pubKeyX || !pubKeyY || !signature || !docHash) {
      return c.json({ error: "pubKeyX, pubKeyY, signature e docHash sao obrigatorios" }, 400);
    }

    const result = await generateProof({
      pubKeyX: hexToBytes(pubKeyX),
      pubKeyY: hexToBytes(pubKeyY),
      signature: hexToBytes(signature),
      docHash: hexToBytes(docHash),
    });

    // Persiste a prova no registro do documento (DEMO_MODE)
    if (DEMO_MODE) {
      const record = demoStore.get(c.req.param("id"));
      if (record) {
        record.zk_proof = result.proof;
        record.zk_public_inputs = result.publicInputs;
        record.signer_commitment = result.commitment;
      }
    }

    return c.json({ proof: result.proof, commitment: result.commitment, publicInputs: result.publicInputs });
  } catch (e: unknown) {
    return c.json({ error: (e as Error).message }, 500);
  }
});

// POST /documents/:id/zk/verify
// Verifica prova ZK de um documento
// Body JSON: { proof: hex, publicInputs: string[] }
documents.post("/:id/zk/verify", async (c) => {
  try {
    const { proof, publicInputs } = await c.req.json<{
      proof: string;
      publicInputs: string[];
    }>();

    if (!proof || !publicInputs?.length) {
      return c.json({ error: "proof e publicInputs sao obrigatorios" }, 400);
    }

    const valid = await verifyProof(proof, publicInputs);
    return c.json({ valid });
  } catch (e: unknown) {
    return c.json({ error: (e as Error).message }, 500);
  }
});

// DELETE /documents/:id
documents.delete("/:id", async (c) => {
  try {
    const { reason } = await c.req.json<{ reason: string }>();
    if (!reason) return c.json({ error: "reason obrigatorio" }, 400);

    const provider = getProviderFromEnv();
    const tx = await revokeDocument(c.req.param("id"), reason, provider);
    return c.json({ tx, revoked: true });
  } catch (e: unknown) {
    return c.json({ error: (e as Error).message }, 500);
  }
});

export default documents;
