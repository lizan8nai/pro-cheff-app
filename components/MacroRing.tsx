"use client";
import { Pie, PieChart, Cell } from "recharts";

export default function MacroRing({ kcal }: { kcal: number }) {
  // Ring ficticio por ahora: 3 partes
  const data = [
    { name: "Proteínas", value: Math.max(1, Math.round(kcal * 0.25)) },
    { name: "Carbs", value: Math.max(1, Math.round(kcal * 0.45)) },
    { name: "Grasas", value: Math.max(1, Math.round(kcal * 0.30)) },
  ];
  const COLORS = ["#73bfff", "#3ea4ff", "#198aff"];
  return (
    <div className="glass rounded-full p-4">
      <PieChart width={200} height={200}>
        <Pie
          data={data}
          innerRadius={60}
          outerRadius={90}
          paddingAngle={2}
          dataKey="value"
          stroke="none"
        >
          {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
        </Pie>
      </PieChart>
    </div>
  );
}