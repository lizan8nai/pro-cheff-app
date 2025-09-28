"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { pushToast } from "@/components/Toaster";

export default function RegenerateButton({
  children = "🔁 Regenerar plan",
  onDone,
}: { children?: React.ReactNode; onDone?: () => void }) {
  const [loading, setLoading] = useState(false);
  const url = process.env.NEXT_PUBLIC_WEBHOOK_REGENERATE_URL!;

  async function handle() {
    try {
      setLoading(true);
      const r = await fetch(url, { method: "POST" }); // tu webhook n8n
      if (!r.ok) throw new Error("Webhook error");
      pushToast("Estamos generando tu nuevo plan...");
      onDone?.();
    } catch {
      pushToast("No pudimos regenerar el plan 😔");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button onClick={handle} disabled={loading}>
      {loading ? "Generando..." : children}
    </Button>
  );
}