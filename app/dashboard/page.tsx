// app/dashboard/page.tsx
"use client";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [err, setErr] = useState<string>("");
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const user_id = localStorage.getItem("pc_user_id");
    if (!user_id) { setErr("No hay usuario"); return; }

    async function load() {
      try {
        const r = await fetch(`/api/profile?user_id=${encodeURIComponent(user_id)}`, { cache: "no-store" });
        const text = await r.text();
        let json: any = null;
        try {
          json = JSON.parse(text);
        } catch {
          setErr("Respuesta no válida del servidor");
          return;
        }
        if (!r.ok || json?.ok === false) {
          setErr(json?.error || `Error ${r.status}`);
          return;
        }
        setData(json); // json = { profile, prefs, equipment }
        setErr("");
      } catch (e: any) {
        setErr(e?.message || "Error cargando perfil");
      }
    }

    load();
  }, [refresh]);

  if (err) return (
    <Screen>
      <p className="text-red-300 text-sm">{err}</p>
      <div className="mt-3 flex gap-2">
        <button
          onClick={() => { setErr(""); setRefresh(v => v + 1); }}
          className="px-3 py-1 rounded-md bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30 hover:bg-emerald-500/20 transition"
        >
          Reintentar
        </button>
        <a
          href="/onboarding"
          className="px-3 py-1 rounded-md bg-zinc-100/10 text-zinc-100 ring-1 ring-white/10 hover:bg-zinc-100/20 transition"
        >
          Editar perfil
        </a>
      </div>
    </Screen>
  );

  if (!data) return <Screen><p>Cargando…</p></Screen>;

  const profile = data.profile || {};
  const prefs   = data.prefs   || {};
  const rawEq = data?.equipment;
  const eq: any[] = Array.isArray(rawEq)
    ? rawEq
    : rawEq
    ? [rawEq]
    : [];

  return (
    <Screen>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Hola {profile.first_name || "chef"} 👋</h1>
          <p className="text-sm text-zinc-400">¿Listo para cocinar?</p>
        </div>
        <a
          href="/onboarding"
          className="px-3 py-1 rounded-md bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30 hover:bg-emerald-500/20 transition"
        >
          Editar perfil
        </a>
      </div>

      <Card title="Tus preferencias">
        <Row label="Dieta"    value={prefs.diet_type} />
        <Row label="Calorías" value={prefs.calorie_target} />
        <Row label="Alergias" value={(prefs.allergies || []).join(", ")} />
        <Row label="No me gusta" value={(prefs.dislikes || []).join(", ")} />
      </Card>

      <Card title="Equipo">
        {Array.isArray(eq) && eq.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {eq.map((e: any, i: number) => {
              const label = typeof e === "string" ? e : (e?.item ?? e?.name ?? "");
              return (
                <span
                  key={i}
                  className="text-xs bg-[#181922] px-3 py-1 rounded-full border border-white/5"
                  title={label || (typeof e === "object" ? JSON.stringify(e) : String(e))}
                >
                  {label || (typeof e === "object" ? JSON.stringify(e) : String(e))}
                </span>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-zinc-400">Aún no cargaste equipo.</p>
        )}
      </Card>
    </Screen>
  );
}

function Screen({ children }: { children: React.ReactNode }) {
  return <div className="min-h-dvh bg-[#0B0B0F] text-[#EDEDF2] px-4 py-6 max-w-md mx-auto">{children}</div>;
}
function Card({ title, children }: any) {
  return (
    <div className="mt-4 rounded-2xl bg-[#121218] p-4 ring-1 ring-white/5">
      <h2 className="font-medium mb-2">{title}</h2>
      {children}
    </div>
  );
}
function Row({ label, value }: { label: string; value: any }) {
  const v = (value === undefined || value === null || value === "" ) ? "—" : value;
  return <div className="text-sm text-zinc-300"><b>{label}:</b> {v}</div>;
}