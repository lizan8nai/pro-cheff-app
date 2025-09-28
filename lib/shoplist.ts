import type { Ingredient, MealItem } from "@/types";

export function aggregateIngredients(items: MealItem[] = []) {
  const map = new Map<string, string[]>();
  for (const m of items) {
    for (const ing of (m.ingredients ?? [])) {
      const key = ing.item.trim();
      if (!map.has(key)) map.set(key, []);
      if (ing.qty) map.get(key)!.push(ing.qty);
    }
  }
  // join quantities as human hint
  return Array.from(map.entries()).map(([item, qtys]) => ({
    item,
    qty: qtys.join(" + "),
  })) as Ingredient[];
}