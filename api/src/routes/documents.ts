import { Hono } from "hono";
import * as crypto from "crypto";
import { uploadDocument, irysGatewayUrl } from "../irys";
import {
  getProvider,
  loadKeypair,
  registerDocument,
  fetchDocument,
  revokeDocument,
  docIdFromString,
} from "../anchor-client";
import { rateLimit } from "../middleware/rate-limit";

const documents = new Hono();

function getProviderFromEnv() {
  const keypair = loadKeypair(process.env.WALLET_KEY ?? process.env.WALLET_PATH ?? "~/.config/solana/id.json");
  return getProvider(keypair);
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

    if (!file || typeof file === "string") return c.json({ error: "arquivo obrigatorio" }, 400);
    if (!docType || !cartorioId) return c.json({ error: "docType e cartorioId obrigatorios" }, 400);

    const buffer = Buffer.from(await file.arrayBuffer());
    const walletKey = process.env.WALLET_KEY ?? process.env.WALLET_PATH ?? "~/.config/solana/id.json";
    const { txId, docHash } = await uploadDocument(buffer, { docType, cartorioId, fileName: file.name }, walletKey);

    const seed = docIdSeed ?? txId;
    const provider = getProviderFromEnv();
    const { tx, pda } = await registerDocument({ docIdSeed: seed, docHash, irystxId: txId, docType, cartorioId }, provider);

    return c.json({ docIdSeed: seed, pda, irystxId: txId, irysUrl: irysGatewayUrl(txId), docHash: docHash.toString("hex"), tx });
  } catch (e: unknown) {
    return c.json({ error: (e as Error).message }, 500);
  }
});

// GET /documents/:id
documents.get("/:id", async (c) => {
  try {
    const provider = getProviderFromEnv();
    const record = await fetchDocument(c.req.param("id"), provider);
    return c.json({ ...record, irysUrl: irysGatewayUrl(record.irystxId as string), docHash: Buffer.from(record.docHash as Uint8Array).toString("hex") });
  } catch (e: unknown) {
    return c.json({ error: (e as Error).message }, 404);
  }
});

// POST /documents/:id/verify
documents.post("/:id/verify", async (c) => {
  try {
    const { docHash } = await c.req.json<{ docHash: string }>();
    if (!docHash) return c.json({ error: "docHash obrigatorio" }, 400);

    const provider = getProviderFromEnv();
    const record = await fetchDocument(c.req.param("id"), provider);

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
