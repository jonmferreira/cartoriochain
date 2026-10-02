// CartorioChain API — v0.4
// Backend: Anchor SDK + Irys + ZK proof generation
import express from "express";

const app = express();
app.use(express.json());

// POST /documents         — upload doc + register on-chain
// GET  /documents/:id     — fetch DocumentRecord from chain
// POST /documents/:id/verify — verify hash
// DELETE /documents/:id   — revoke (auth required)

app.get("/health", (_req, res) => res.json({ ok: true }));

app.listen(3001, () => console.log("CartorioChain API :3001"));
