import { Hono } from "hono";
import * as crypto from "crypto";
import { generateProof, verifyProof, computeCommitment } from "../zk";
import { rateLimit } from "../middleware/rate-limit";

const proofs = new Hono();

const HEX64 = /^[0-9a-fA-F]{64}$/;
function validarHex64(val: unknown): val is string {
  return typeof val === "string" && HEX64.test(val);
}

proofs.use("*", rateLimit(10, 60_000));

// POST /proofs/generate
proofs.post("/generate", async (c) => {
  try {
    const body = await c.req.parseBody();
    const file = body["file"];
    const { pubKeyX, pubKeyY, sigR, sigS, docHashHex } = body as Record<string, string>;

    if (!file || typeof file === "string" || !pubKeyX || !pubKeyY || !sigR || !sigS) {
      return c.json({ error: "file, pubKeyX, pubKeyY, sigR, sigS obrigatorios" }, 400);
    }
    if (![pubKeyX, pubKeyY, sigR, sigS].every(validarHex64)) {
      return c.json({ error: "pubKeyX, pubKeyY, sigR, sigS devem ser hex de 64 chars (32 bytes)" }, 400);
    }
    if (docHashHex && !validarHex64(docHashHex)) {
      return c.json({ error: "docHashHex deve ser hex de 64 chars" }, 400);
    }
    if (file.size > 4096) {
      return c.json({ error: "arquivo muito grande (max 4KB)" }, 400);
    }

    const docContent = Buffer.from(await file.arrayBuffer());
    const docHash = docHashHex
      ? Buffer.from(docHashHex, "hex")
      : crypto.createHash("sha256").update(docContent).digest();

    const pkX = Buffer.from(pubKeyX, "hex");
    const pkY = Buffer.from(pubKeyY, "hex");
    const commitment = computeCommitment(pkX, pkY);

    const result = await generateProof({
      docContent,
      pubKeyX: pkX,
      pubKeyY: pkY,
      signatureR: Buffer.from(sigR, "hex"),
      signatureS: Buffer.from(sigS, "hex"),
      docHash,
      commitment,
    });

    return c.json({
      proofFile: result.proof,
      publicInputs: JSON.parse(result.publicInputs || "{}"),
      commitment,
      docHashHex: docHash.toString("hex"),
    });
  } catch (e: unknown) {
    return c.json({ error: (e as Error).message }, 500);
  }
});

// POST /proofs/verify
proofs.post("/verify", async (c) => {
  try {
    const valid = await verifyProof();
    return c.json({ valid });
  } catch (e: unknown) {
    return c.json({ error: (e as Error).message }, 500);
  }
});

export default proofs;
