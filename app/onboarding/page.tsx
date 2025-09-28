"use client";

import * as React from "react";

/**
 * Onboarding Page – Pro Chef
 * - Estilo "glass" + grid responsivo
 * - Validación simple de macros
 * - Barra sticky con CTA
 * - Envía a /api/onboarding (ajustá si tu endpoint es otro)
 */

type Gender = "masculino" | "femenino" | "otro";
type Activity = "sedentary" | "light" | "moderate" | "active" | "pro athlete";
type Goal = "cut" | "maintain" | "bulk";
type DietType =
  | "Libre"
  | "Vegetariano"
  | "Vegano"
  | "Mediterránea"
  | "Keto"
  | "Paleo";

export default function OnboardingPage() {
  // -------- form state --------
  const [firstName, setFirstName] = React.useState("Juan");
  const [lastName, setLastName] = React.useState("Pérez");
  const [birthdate, setBirthdate] = React.useState("");
  const [height, setHeight] = React.useState<number | "">("");
  const [weight, setWeight] = React.useState<number | "">("");

  const [gender, setGender] = React.useState<Gender>("masculino");
  const [activity, setActivity] = React.useState<Activity>("moderate");
  const [goal, setGoal] = React.useState<Goal>("cut");
  const [diet, setDiet] = React.useState<DietType>("Vegetariano");

  const [allergies, setAllergies] = React.useState("nueces, mariscos…");
  const [dislikes, setDislikes] = React.useState("aceitunas, cilantro…");

  const [kcal, setKcal] = React.useState<number | "">("");
  const [pPct, setPPct] = React.useState<number | "">("");
  const [cPct, setCPct] = React.useState<number | "">("");
  const [fPct, setFPct] = React.useState<number | "">("");

  const [equipment, setEquipment] = React.useState(
    "parrilla, sartén, horno…"
  );

  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [okMsg, setOkMsg] = React.useState<string | null>(null);

  // -------- helpers --------
  const macrosSum =
    (Number(pPct) || 0) + (Number(cPct) || 0) + (Number(fPct) || 0);

  const macrosWarn =
    (pPct !== "" || cPct !== "" || fPct !== "") && macrosSum !== 100;

  const disabled =
    !firstName ||
    !lastName ||
    !gender ||
    !activity ||
    !goal ||
    !diet ||
    !kcal ||
    !height ||
    !weight ||
    saving ||
    macrosWarn;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setOkMsg(null);

    if (macrosWarn) {
      setError("La suma de macros debe ser 100%.");
      return;
    }

    setSaving(true);

    try {
      // armamos payload simple compatible con tu backend
      const payload = {
        first_name: firstName,
        last_name: lastName,
        birthdate,
        height_cm: Number(height),
        weight_kg: Number(weight),
        gender,
        activity,
        goal,
        diet_type: diet,
        allergies: allergies
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        dislikes: dislikes
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        kcal: Number(kcal),
        macro_split: {
          protein_pct: Number(pPct || 0),
          carb_pct: Number(cPct || 0),
          fat_pct: Number(fPct || 0),
        },
        equipment: equipment
          .split(/\n|,/)
          .map((s) => s.trim())
          .filter(Boolean),
      };

      // 👉 Ajustá este endpoint si usás n8n o un proxy:
      //  - Si tu API es /api/onboarding (Next.js route), dejalo así.
      //  - Si usás un webhook (N8N_ONBOARDING_WEBHOOK), reemplazá la URL acá.
      const res = await fetch(process.env.NEXT_PUBLIC_ONBOARDING_WEBHOOK!, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
});

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Error guardando el perfil.");
      }

      setOkMsg("Perfil guardado con éxito ✅");
    } catch (err: any) {
      setError(err?.message || "Error desconocido");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 pb-36 pt-10">
      <h1 className="text-2xl font-semibold tracking-tight text-white/90">
        Crear perfil
      </h1>

      {/* card principal */}
      <form
        onSubmit={handleSubmit}
        className="glass mt-6 rounded-2xl border border-white/10 p-5 shadow-glass"
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* nombre */}
          <div>
            <label className="text-xs text-neutral-400">Nombre</label>
            <input
              className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="Juan"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          {/* apellido */}
          <div>
            <label className="text-xs text-neutral-400">Apellido</label>
            <input
              className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="Pérez"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          {/* fecha */}
          <div>
            <label className="text-xs text-neutral-400">
              Fecha de nacimiento
            </label>
            <input
              type="date"
              className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-brand-500"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
              placeholder="dd/mm/aaaa"
            />
          </div>

          {/* altura */}
          <div>
            <label className="text-xs text-neutral-400">Altura (cm)</label>
            <input
              inputMode="numeric"
              className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="178"
              value={height}
              onChange={(e) =>
                setHeight(e.target.value === "" ? "" : Number(e.target.value))
              }
            />
          </div>

          {/* peso */}
          <div>
            <label className="text-xs text-neutral-400">Peso (kg)</label>
            <input
              inputMode="numeric"
              className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="76"
              value={weight}
              onChange={(e) =>
                setWeight(e.target.value === "" ? "" : Number(e.target.value))
              }
            />
          </div>

          {/* género */}
          <div>
            <label className="text-xs text-neutral-400">Género</label>
            <select
              className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              value={gender}
              onChange={(e) => setGender(e.target.value as Gender)}
            >
              <option value="masculino">masculino</option>
              <option value="femenino">femenino</option>
              <option value="otro">otro</option>
            </select>
          </div>

          {/* actividad */}
          <div>
            <label className="text-xs text-neutral-400">Actividad</label>
            <select
              className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              value={activity}
              onChange={(e) => setActivity(e.target.value as Activity)}
            >
              <option value="sedentary">sedentary</option>
              <option value="light">light</option>
              <option value="moderate">moderate</option>
              <option value="active">active</option>
              <option value="pro athlete">pro athlete</option>
            </select>
          </div>

          {/* objetivo */}
          <div>
            <label className="text-xs text-neutral-400">Objetivo</label>
            <select
              className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              value={goal}
              onChange={(e) => setGoal(e.target.value as Goal)}
            >
              <option value="cut">cut</option>
              <option value="maintain">maintain</option>
              <option value="bulk">bulk</option>
            </select>
          </div>

          {/* dieta */}
          <div>
            <label className="text-xs text-neutral-400">Dieta</label>
            <select
              className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              value={diet}
              onChange={(e) => setDiet(e.target.value as DietType)}
            >
              {[
                "Libre",
                "Vegetariano",
                "Vegano",
                "Mediterránea",
                "Keto",
                "Paleo",
              ].map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* alergias */}
          <div className="md:col-span-1">
            <label className="text-xs text-neutral-400">
              Alergias (coma sep.)
            </label>
            <input
              className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="maní, mariscos…"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
            />
          </div>

          {/* disgustos */}
          <div className="md:col-span-1">
            <label className="text-xs text-neutral-400">
              Disgustos (coma sep.)
            </label>
            <input
              className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="aceitunas, cilantro…"
              value={dislikes}
              onChange={(e) => setDislikes(e.target.value)}
            />
          </div>

          {/* kcal + macros */}
          <div>
            <label className="text-xs text-neutral-400">kcal/día</label>
            <input
              inputMode="numeric"
              className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="3000"
              value={kcal}
              onChange={(e) =>
                setKcal(e.target.value === "" ? "" : Number(e.target.value))
              }
            />
          </div>

          <div>
            <label className="text-xs text-neutral-400">% proteína</label>
            <input
              inputMode="numeric"
              className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="30"
              value={pPct}
              onChange={(e) =>
                setPPct(e.target.value === "" ? "" : Number(e.target.value))
              }
            />
          </div>

          <div>
            <label className="text-xs text-neutral-400">% carb</label>
            <input
              inputMode="numeric"
              className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="40"
              value={cPct}
              onChange={(e) =>
                setCPct(e.target.value === "" ? "" : Number(e.target.value))
              }
            />
          </div>

          <div>
            <label className="text-xs text-neutral-400">% grasas</label>
            <input
              inputMode="numeric"
              className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="30"
              value={fPct}
              onChange={(e) =>
                setFPct(e.target.value === "" ? "" : Number(e.target.value))
              }
            />
          </div>

          {/* equipo */}
          <div className="md:col-span-2">
            <label className="text-xs text-neutral-400">
              Equipamiento (una por línea o coma)
            </label>
            <textarea
              rows={3}
              className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-brand-500"
              value={equipment}
              onChange={(e) => setEquipment(e.target.value)}
              placeholder={"parrilla\nsartén\nhorno…"}
            />
          </div>
        </div>

        {/* info / warnings */}
        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
          {macrosWarn ? (
            <span className="rounded-full bg-red-500/15 px-3 py-1 text-red-400 ring-1 ring-red-500/20">
              La suma de macros debe ser 100% (actual: {macrosSum}%)
            </span>
          ) : (
            <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-emerald-400 ring-1 ring-emerald-500/20">
              Macros correctos (total {macrosSum || 0}%)
            </span>
          )}

          <span className="text-neutral-400">
            Revisá tus datos y guardá tu perfil.
          </span>
        </div>
      </form>

      {/* barra sticky inferior */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-white/10 bg-black/60 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
          <div className="text-sm text-neutral-400">
            {error ? (
              <span className="text-red-400">{error}</span>
            ) : okMsg ? (
              <span className="text-emerald-400">{okMsg}</span>
            ) : (
              <span>Todo listo para guardar.</span>
            )}
          </div>

          <button
            type="submit"
            formAction={handleSubmit as unknown as string}
            onClick={(e) => {
              // prevenir submit doble en navegadores que no soportan formAction con handler
              e.preventDefault();
              handleSubmit(e as unknown as React.FormEvent);
            }}
            disabled={disabled}
            className="inline-flex items-center justify-center rounded-xl bg-brand-500 px-5 py-2 font-medium text-white transition-colors hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Guardando…" : "Guardar perfil"}
          </button>
        </div>
      </div>
    </div>
  );
}