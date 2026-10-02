import type { Context, Next } from "hono";

const store = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(max: number, windowMs: number) {
  return async (c: Context, next: Next) => {
    const ip = c.req.header("x-forwarded-for") ?? c.req.header("x-real-ip") ?? "unknown";
    const now = Date.now();
    const entry = store.get(ip);

    if (!entry || now > entry.resetAt) {
      store.set(ip, { count: 1, resetAt: now + windowMs });
    } else if (entry.count >= max) {
      return c.json({ error: "Muitas requisicoes. Tente novamente em 1 minuto." }, 429);
    } else {
      entry.count++;
    }

    await next();
  };
}
