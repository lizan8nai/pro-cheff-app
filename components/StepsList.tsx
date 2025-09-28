export default function StepsList({ steps }:{ steps: string[] }) {
  return (
    <ol className="space-y-2 text-sm list-decimal list-inside">
      {steps?.map((s, i) => <li key={i}>{s}</li>)}
    </ol>
  );
}