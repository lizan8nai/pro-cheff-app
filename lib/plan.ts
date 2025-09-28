import { HEADERS, SB_URL } from "./supabase";
import type { Plan, MealItem } from "@/types";

const slotOrder = { breakfast: 0, lunch: 1, dinner: 2, snack: 3 } as const;

export async function fetchPlanByUserAndDate(userId: string, dateISO: string) {
  const url = `${SB_URL}/rest/v1/meal_plans?user_id=eq.${userId}&plan_date=eq.${dateISO}&select=*,meal_plan_items(*)`;
  const res = await fetch(url, { headers: HEADERS, cache: "no-store" });
  const arr: Plan[] = await res.json();
  const plan = arr[0];
  if (!plan) return null;

  plan.meal_plan_items?.sort(
    (a: MealItem, b: MealItem) => (slotOrder[a.slot] ?? 9) - (slotOrder[b.slot] ?? 9)
  );
  return plan;
}

export function kcalTotalFromItems(items: MealItem[] = []) {
  return items.reduce((acc, m) => acc + (m.kcal ?? 0), 0);
}