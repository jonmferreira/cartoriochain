import { Hono } from "hono";
import { generateViewKeyPair, encryptForViewKey, decryptViewKeyPayload } from "../viewkey";
import { rateLimit } from "../middleware/rate-limit";

const viewkey = new Hono();

viewkey.use("*", rateLimit(10, 60_000));

// GET /viewkey/generate
// Gera um novo par viewKey / paymentAddress para um signatário
viewkey.get("/generate", (c) => {
  const pair = generateViewKeyPair();
  return c.json({
    viewKey: pair.viewKey,
    paymentAddress: pair.paymentAddress,
    aviso: "Guarde o viewKey em local seguro. Ele e a unica forma de acessar seus dados protegidos.",
  });
});

// POST /viewkey/encrypt
// Cifra dados do signatário com o paymentAddress
// Body JSON: { paymentAddress: hex, data: object }
viewkey.post("/encrypt", async (c) => {
  try {
    const { paymentAddress, data } = await c.req.json<{
      paymentAddress: string;
      data: Record<string, unknown>;
    }>();

    if (!paymentAddress || !data) {
      return c.json({ error: "paymentAddress e data sao obrigatorios" }, 400);
    }
    if (paymentAddress.length !== 64 || !/^[0-9a-fA-F]+$/.test(paymentAddress)) {
      return c.json({ error: "paymentAddress deve ser hex de 64 chars (32 bytes)" }, 400);
    }

    const payload = encryptForViewKey(data, paymentAddress);
    return c.json({ viewkeyPayload: payload });
  } catch (e: unknown) {
    return c.json({ error: (e as Error).message }, 500);
  }
});

// POST /viewkey/decrypt
// Decifra um viewkeyPayload com o viewKey do signatário
// Body JSON: { viewKey: hex, viewkeyPayload: string }
viewkey.post("/decrypt", async (c) => {
  try {
    const { viewKey, viewkeyPayload } = await c.req.json<{
      viewKey: string;
      viewkeyPayload: string;
    }>();

    if (!viewKey || !viewkeyPayload) {
      return c.json({ error: "viewKey e viewkeyPayload sao obrigatorios" }, 400);
    }
    if (viewKey.length !== 64 || !/^[0-9a-fA-F]+$/.test(viewKey)) {
      return c.json({ error: "viewKey deve ser hex de 64 chars (32 bytes)" }, 400);
    }

    const data = decryptViewKeyPayload(viewkeyPayload, viewKey);
    return c.json({ data });
  } catch (e: unknown) {
    // Falha na decifragem = chave errada
    return c.json({ error: "viewKey invalido ou payload corrompido" }, 403);
  }
});

export default viewkey;
