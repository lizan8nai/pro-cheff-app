import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import MacroRing from "./MacroRing";

export default function PlanHeader({
  date, totalKcal, onRegenerate,
}: { date: string; totalKcal: number; onRegenerate: () => void }) {
  const d = new Date(date);
  const nice = d.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" });
  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-tr from-brand-500/10 to-transparent" />
      <CardBody className="grid gap-6 sm:grid-cols-2 items-center">
        <div>
          <div className="text-muted text-sm mb-1">Plan para</div>
          <h1 className="text-3xl font-semibold capitalize">{nice}</h1>
          <div className="mt-3 flex items-center gap-2">
            <Badge>{totalKcal} kcal</Badge>
            <Badge>Personalizado</Badge>
          </div>
          <div className="mt-5">
            <Button onClick={onRegenerate}>🔁 Regenerar plan</Button>
          </div>
        </div>
        <div className="justify-self-end">
          <MacroRing kcal={totalKcal || 0} />
        </div>
      </CardBody>
    </Card>
  );
}