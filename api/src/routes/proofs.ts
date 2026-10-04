import { Hono } from "hono";
import * as crypto from "crypto";
import { generateProof, verifyProof } from "../zk";
import { rateLimit } from "../middleware/rate-limit";

const proofs = new Hono();

const HEX64 = /^[0-9a-fA-F]{64}$/;
const HEX128 = /^[0-9a-fA-F]{128}$/;

function validHex(val: unknown, len: number): val is string {
  return typeof val === "string" && val.length === len && /^[0-9a-fA-F]+$/.test(val);
}

proofs.use("*", rateLimit(10, 60_000));

// POST /proofs/generate
// Body (multipart or JSON): pubKeyX (hex64), pubKeyY (hex64), signature (hex128), docHash (hex64)
proofs.post("/generate", async (c) => {
  try {
    const body = await c.req.parseBody();
    const { pubKeyX, pubKeyY, signature, docHash } = body as Record<string, string>;

    if (!pubKeyX || !pubKeyY || !signature || !docHash) {
      return c.json({ error: "pubKeyX, pubKeyY, signature e docHash sao obrigatorios" }, 400);
    }
    if (!validHex(pubKeyX, 64) || !validHex(pubKeyY, 64)) {
      return c.json({ error: "pubKeyX e pubKeyY devem ser hex de 64 chars (32 bytes)" }, 400);
    }
    if (!validHex(signature, 128)) {
      return c.json({ error: "signature deve ser hex de 128 chars (64 bytes: r||s)" }, 400);
    }
    if (!validHex(docHash, 64)) {
      return c.json({ error: "docHash deve ser hex de 64 chars (32 bytes SHA-256)" }, 400);
    }

    const result = await generateProof({
      pubKeyX: Uint8Array.from(Buffer.from(pubKeyX, "hex")),
      pubKeyY: Uint8Array.from(Buffer.from(pubKeyY, "hex")),
      signature: Uint8Array.from(Buffer.from(signature, "hex")),
      docHash: Uint8Array.from(Buffer.from(docHash, "hex")),
    });

    return c.json({
      proof: result.proof,
      commitment: result.commitment,
      publicInputs: result.publicInputs,
      docHash,
    });
  } catch (e: unknown) {
    return c.json({ error: (e as Error).message }, 500);
  }
});

// POST /proofs/verify
// Body JSON: { proof: hex, publicInputs: string[] }
proofs.post("/verify", async (c) => {
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

export default proofs;
