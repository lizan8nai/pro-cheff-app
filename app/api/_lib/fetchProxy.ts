// app/api/_lib/fetchProxy.ts
export type ProxyInit = Omit<RequestInit, "body"> & { body?: any };

const TIMEOUT_MS = Number(process.env.API_FETCH_TIMEOUT_MS ?? 15000);
const RETRIES = Number(process.env.API_RETRY_ATTEMPTS ?? 0);

export async function proxyFetch(url: string, init: ProxyInit = {}) {
  const ctrl = new AbortController();
  const to = setTimeout(() => ctrl.abort(), TIMEOUT_MS);

  const headers = new Headers(init.headers);
  // Pasamos JSON correctamente si body es objeto
  let body: BodyInit | undefined = init.body as any;
  if (body && typeof body === "object" && !(body instanceof FormData)) {
    headers.set("content-type", "application/json");
    body = JSON.stringify(body);
  }

  const attempt = async () => {
    const res = await fetch(url, {
      ...init,
      headers,
      body,
      signal: ctrl.signal,
      cache: "no-store",
      // Si preferís edge runtime más adelante, esto igual funciona
    });

    // n8n a veces devuelve 429 (rate-limit ngrok); acá podés customizar
    if (res.status === 429) throw new Error("rate_limited");
    return res;
  };

  try {
    let lastErr: any = null;
    for (let i = 0; i <= RETRIES; i++) {
      try {
        return await attempt();
      } catch (e: any) {
        lastErr = e;
        if (i === RETRIES) throw e;
        await new Promise(r => setTimeout(r, 500));
      }
    }
    throw lastErr;
  } finally {
    clearTimeout(to);
  }
}