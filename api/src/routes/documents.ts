import { Router, Request, Response } from "express";
import multer from "multer";
import * as crypto from "crypto";
import { uploadDocument, irysGatewayUrl } from "../irys";
import {
  getProvider,
  loadKeypair,
  registerDocument,
  fetchDocument,
  revokeDocument,
  docIdFromString,
  docIdPDA,
} from "../anchor-client";
import { PublicKey } from "@solana/web3.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

function getProviderFromEnv() {
  const keypair = loadKeypair(process.env.WALLET_KEY ?? process.env.WALLET_PATH ?? "~/.config/solana/id.json");
  return getProvider(keypair);
}

// POST /documents
// Body: multipart — file, docType, cartorioId, docIdSeed (opcional)
router.post("/", upload.single("file"), async (req: Request, res: Response) => {
  try {
    const { docType, cartorioId, docIdSeed } = req.body;
    if (!req.file) return res.status(400).json({ error: "arquivo obrigatorio" });
    if (!docType || !cartorioId) return res.status(400).json({ error: "docType e cartorioId obrigatorios" });

    const walletKey = process.env.WALLET_KEY ?? process.env.WALLET_PATH ?? "~/.config/solana/id.json";
    const { txId, docHash } = await uploadDocument(req.file.buffer, { docType, cartorioId, fileName: req.file.originalname }, walletKey);

    const seed = docIdSeed ?? txId;
    const provider = getProviderFromEnv();
    const { tx, pda } = await registerDocument({ docIdSeed: seed, docHash, irystxId: txId, docType, cartorioId }, provider);

    res.json({
      docIdSeed: seed,
      pda,
      irystxId: txId,
      irysUrl: irysGatewayUrl(txId),
      docHash: docHash.toString("hex"),
      tx,
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// GET /documents/:id
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const provider = getProviderFromEnv();
    const record = await fetchDocument(req.params.id, provider);
    res.json({
      ...record,
      irysUrl: irysGatewayUrl(record.irystxId),
      docHash: Buffer.from(record.docHash).toString("hex"),
    });
  } catch (e: any) {
    res.status(404).json({ error: e.message });
  }
});

// POST /documents/:id/verify
// Body: { docHash: string (hex) }
router.post("/:id/verify", async (req: Request, res: Response) => {
  try {
    const { docHash } = req.body;
    if (!docHash) return res.status(400).json({ error: "docHash obrigatorio" });

    const provider = getProviderFromEnv();
    const record = await fetchDocument(req.params.id, provider);

    if (record.revoked) {
      return res.json({ valid: false, reason: "revogado", revokeReason: record.revokeReason });
    }

    const onChainHash = Buffer.from(record.docHash).toString("hex");
    const valid = onChainHash === docHash.toLowerCase();
    res.json({ valid, onChainHash, provided: docHash.toLowerCase() });
  } catch (e: any) {
    res.status(404).json({ error: e.message });
  }
});

// DELETE /documents/:id
// Body: { reason: string }
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { reason } = req.body;
    if (!reason) return res.status(400).json({ error: "reason obrigatorio" });

    const provider = getProviderFromEnv();
    const tx = await revokeDocument(req.params.id, reason, provider);
    res.json({ tx, revoked: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
