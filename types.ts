export type Ingredient = { qty: string; item: string };
export type MealItem = {
  id?: string;
  plan_id: string;
  slot: "breakfast" | "lunch" | "dinner" | "snack";
  name: string;
  kcal: number;
  ingredients: Ingredient[];
  steps: string[];
  time_min?: number;
  utensils?: string[];
};

export type Plan = {
  id: string;
  user_id: string;
  plan_date: string;
  total_kcal: number | null;
  plan: any; // jsonb
  notes: string[] | null;
  meal_plan_items?: MealItem[];
};