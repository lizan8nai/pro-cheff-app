// app/onboarding/submit/route.ts
import { NextResponse } from "next/server";
import { proxyFetch } from "../../api/_lib/fetchProxy";

export const dynamic = "force-dynamic"; // siempre del lado servidor
// export const runtime = "nodejs"; // (o "edge" si querés, ambas funcionan)

export async function POST(req: Request) {
  const url = process.env.N8N_ONBOARDING_WEBHOOK!;
  if (!url) {
    return NextResponse.json({ ok: false, error: "Missing N8N_ONBOARDING_WEBHOOK" }, { status: 500 });
  }

  let payload: any = null;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const res = await proxyFetch(url, {
      method: "POST",
      body: payload,
      headers: { accept: "application/json" },
    });

    // Intentamos parsear JSON del webhook
    const text = await res.text();
    let data: any = null;
    try { data = JSON.parse(text); } catch { /* a veces n8n retorna texto */ }

    // Pasamos status tal cual, pero normalizamos estructura
    return NextResponse.json(data ?? { ok: res.ok }, { status: res.status });
  } catch (e: any) {
    const msg = e?.name === "AbortError" ? "Upstream timeout" : e?.message || "Upstream error";
    return NextResponse.json({ ok: false, error: msg }, { status: 502 });
  }
}