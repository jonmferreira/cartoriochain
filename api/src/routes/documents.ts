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

const documents = new Hono();

const DEMO_MODE = process.env.DEMO_MODE === "true";

// In-memory store for demo documents
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

documents.use("*", rateLimit(10, 60_000));

// POST /documents
documents.post("/", async (c) => {
  try {
    const body = await c.req.parseBody();
    const file = body["file"];
    const docType = body["docType"] as string;
    const cartorioId = body["cartorioId"] as string;
    const docIdSeed = body["docIdSeed"] as string | undefined;
    const viewkeyPayload = body["viewkeyPayload"] as string | undefined;

    if (!file || typeof file === "string") return c.json({ error: "arquivo obrigatorio" }, 400);
    if (!docType || !cartorioId) return c.json({ error: "docType e cartorioId obrigatorios" }, 400);

    const buffer = Buffer.from(await file.arrayBuffer());
    const docHashHex = crypto.createHash("sha256").update(buffer).digest("hex");

    if (DEMO_MODE) {
      const irystxId = fakeBase58(43);
      const solTx = fakeBase58(88);
      const signerCommitment = "0x" + crypto.createHash("sha256").update(docHashHex + (docType ?? "")).digest("hex");
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
        viewkey_payload: viewkeyPayload ?? null,
      };
      demoStore.set(docId, record);

      return c.json({
        docId,
        irys_tx_id: irystxId,
        doc_hash: docHashHex,
        signer_commitment: signerCommitment,
        viewkey_payload: viewkeyPayload,
        registered_at: registeredAt,
        irys_url: irysGatewayUrl(irystxId),
        tx: solTx,
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

    const signerCommitment = "0x" + crypto.createHash("sha256").update(docHash.toString("hex")).digest("hex");
    const registeredAt = Math.floor(Date.now() / 1000);

    return c.json({
      docId: seed,
      irys_tx_id: txId,
      doc_hash: docHash.toString("hex"),
      signer_commitment: signerCommitment,
      viewkey_payload: viewkeyPayload,
      registered_at: registeredAt,
      irys_url: irysGatewayUrl(txId),
      pda,
      tx,
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
documents.post("/:id/verify", async (c) => {
  const id = c.req.param("id");

  if (DEMO_MODE && demoStore.has(id)) {
    const { docHash } = await c.req.json<{ docHash: string }>();
    const record = demoStore.get(id)!;
    const valid = record.doc_hash === docHash.toLowerCase();
    return c.json({ valid, onChainHash: record.doc_hash, provided: docHash.toLowerCase() });
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
