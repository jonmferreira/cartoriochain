import express from "express";
import cors from "cors";
import documentsRouter from "./routes/documents";

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true, network: process.env.SOLANA_NETWORK ?? "devnet" }));
app.use("/documents", documentsRouter);

app.listen(PORT, () => console.log(`CartorioChain API :${PORT}`));
