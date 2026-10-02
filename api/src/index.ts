import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import documentsRouter from "./routes/documents";
import proofsRouter from "./routes/proofs";

const app = express();
const PORT = process.env.PORT ?? 3001;

const ALLOWED_ORIGINS = (process.env.CORS_ORIGINS ?? "http://localhost:5176,http://localhost:3000")
  .split(",")
  .map((o) => o.trim());

app.use(helmet());
app.use(cors({ origin: ALLOWED_ORIGINS }));
app.use(express.json({ limit: "1mb" }));

const writeLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { error: "Muitas requisicoes. Tente novamente em 1 minuto." },
});

const readLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
});

app.get("/health", readLimiter, (_req, res) => res.json({ ok: true, network: process.env.SOLANA_NETWORK ?? "devnet" }));
app.use("/documents", writeLimiter, documentsRouter);
app.use("/proofs", writeLimiter, proofsRouter);

app.listen(PORT, () => console.log(`CartorioChain API :${PORT}`));
