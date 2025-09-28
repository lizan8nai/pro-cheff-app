import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validación mínima del body
    if (!body.user_id || !body.prefs) {
      return NextResponse.json(
        { ok: false, status: 400, data: { error: "Faltan campos requeridos: user_id o prefs" } },
        { status: 400 },
      );
    }

    const webhook = process.env.N8N_ONBOARDING_WEBHOOK;
    if (!webhook) {
      return NextResponse.json(
        { ok: false, status: 500, data: { error: "Webhook no configurado" } },
        { status: 500 },
      );
    }

    const r = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const text = await r.text();
    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    return NextResponse.json({ ok: r.ok, status: r.status, data }, { status: r.ok ? 200 : 502 });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, status: 500, data: { error: err?.message ?? "Error inesperado" } },
      { status: 500 },
    );
  }
}