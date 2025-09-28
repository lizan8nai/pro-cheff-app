import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const user_id = req.nextUrl.searchParams.get("user_id");
    if (!user_id) {
      return NextResponse.json({ ok: false, error: "missing user_id" }, { status: 400 });
    }

    const urlString = process.env.N8N_GET_PROFILE_WEBHOOK;
    if (!urlString) {
      return NextResponse.json({ ok: false, error: "N8N_GET_PROFILE_WEBHOOK not set" }, { status: 500 });
    }

    const url = new URL(urlString);
    url.searchParams.append("user_id", user_id);

    const response = await fetch(url.toString());
    const text = await response.text();

    let jsonData;
    try {
      jsonData = JSON.parse(text);
    } catch {
      jsonData = null;
    }

    if (!jsonData) {
      return NextResponse.json({ ok: false, error: "Invalid JSON response from webhook" }, { status: 502 });
    }

    const { profile = null, prefs = null, equipment = null } = jsonData;

    return NextResponse.json({ ok: true, profile, prefs, equipment }, { status: response.status });
  } catch (error) {
    return NextResponse.json({ ok: false, error: (error as Error).message || "Unexpected error" }, { status: 500 });
  }
}