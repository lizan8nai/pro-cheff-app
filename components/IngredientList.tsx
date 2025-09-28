import type { Ingredient } from "@/types";

export default function IngredientList({ items }:{ items: Ingredient[] }) {
  return (
    <ul className="space-y-1 text-sm">
      {items?.map((ing, i) => (
        <li key={i} className="flex gap-2">
          <span className="text-muted w-28 shrink-0">{ing.qty}</span>
          <span>{ing.item}</span>
        </li>
      ))}
    </ul>
  );
}