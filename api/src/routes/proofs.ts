import { Router, Request, Response } from "express";
import multer from "multer";
import * as crypto from "crypto";
import { generateProof, verifyProof, computeCommitment } from "../zk";

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 4096 } });

const HEX64 = /^[0-9a-fA-F]{64}$/;

function validarHex64(val: unknown): val is string {
  return typeof val === "string" && HEX64.test(val);
}

// POST /proofs/generate
// Body: multipart — file (doc), pubKeyX (hex), pubKeyY (hex), sigR (hex), sigS (hex)
router.post("/generate", upload.single("file"), async (req: Request, res: Response) => {
  try {
    const { pubKeyX, pubKeyY, sigR, sigS, docHashHex } = req.body;
    if (!req.file || !pubKeyX || !pubKeyY || !sigR || !sigS) {
      return res.status(400).json({ error: "file, pubKeyX, pubKeyY, sigR, sigS obrigatorios" });
    }
    if (![pubKeyX, pubKeyY, sigR, sigS].every(validarHex64)) {
      return res.status(400).json({ error: "pubKeyX, pubKeyY, sigR, sigS devem ser hex de 64 chars (32 bytes)" });
    }
    if (docHashHex && !validarHex64(docHashHex)) {
      return res.status(400).json({ error: "docHashHex deve ser hex de 64 chars" });
    }

    const docContent = req.file.buffer;
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

    res.json({
      proofFile: result.proof,
      publicInputs: JSON.parse(result.publicInputs || "{}"),
      commitment,
      docHashHex: docHash.toString("hex"),
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// POST /proofs/verify
// proofFile ignorado — sempre verifica o circuito interno (evita path traversal)
router.post("/verify", async (req: Request, res: Response) => {
  try {
    const valid = await verifyProof();
    res.json({ valid });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
