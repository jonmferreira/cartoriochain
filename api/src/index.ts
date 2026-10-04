import { Hono } from "hono";
import { cors } from "hono/cors";
import { secureHeaders } from "hono/secure-headers";
import { serve } from "@hono/node-server";
import documentsRouter from "./routes/documents";
import proofsRouter from "./routes/proofs";
import viewkeyRouter from "./routes/viewkey";

const app = new Hono();
const PORT = Number(process.env.PORT ?? 3001);

const CORS_ENV = process.env.CORS_ORIGINS ?? "http://localhost:5176,http://localhost:3000";
const ALLOWED_ORIGINS = CORS_ENV === "*" ? "*" : CORS_ENV.split(",").map((o) => o.trim());

app.use("*", secureHeaders());
app.use("*", cors({ origin: ALLOWED_ORIGINS }));

app.get("/health", (c) => c.json({ ok: true, network: process.env.SOLANA_NETWORK ?? "devnet" }));
app.route("/documents", documentsRouter);
app.route("/proofs", proofsRouter);
app.route("/viewkey", viewkeyRouter);

serve({ fetch: app.fetch, port: PORT }, () =>
  console.log(`CartorioChain API :${PORT}`)
);
