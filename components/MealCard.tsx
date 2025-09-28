import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import IngredientList from "./IngredientList";
import StepsList from "./StepsList";
import type { MealItem } from "@/types";

export default function MealCard({ meal }: { meal: MealItem }) {
  const utensils = meal.utensils?.length ? meal.utensils : [];
  return (
    <Card>
      <CardBody className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-xs text-muted uppercase tracking-wide">{meal.slot}</div>
            <h3 className="text-lg font-semibold">{meal.name}</h3>
          </div>
          <div className="text-right space-y-1">
            <Badge>{meal.kcal} kcal</Badge>
            {meal.time_min ? <div className="text-muted text-xs">{meal.time_min} min</div> : null}
          </div>
        </div>

        {utensils.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {utensils.map((u, i) => <Badge key={i}>{u}</Badge>)}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="text-sm font-medium mb-2">Ingredientes</div>
            <IngredientList items={meal.ingredients || []} />
          </div>
          <div>
            <div className="text-sm font-medium mb-2">Pasos</div>
            <StepsList steps={meal.steps || []} />
          </div>
        </div>
      </CardBody>
    </Card>
  );
}