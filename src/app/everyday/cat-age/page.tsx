"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";
export default function CatAgePage() {
  const [v, setV] = useHashState({ age: "5" });
  const age = parseFloat(v.age);
  let humanAge = 0;
  if (age > 0) { if (age <= 1) humanAge = 15; else if (age <= 2) humanAge = 24; else humanAge = 24 + (age - 2) * 4; }
  return (
    <CalculatorShell title="Cat Age Calculator" description="Convert cat years to human years.">
      <div className="space-y-4">
        <div><label className="block text-sm text-muted mb-1">Cat Age (years)</label>
          <input type="number" value={v.age} onChange={e=>setV({age:e.target.value})} step="0.5"
            className="w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"/></div>
        {age > 0 && <div className="bg-primary-light rounded-xl p-4 text-center">
          <span className="block text-4xl mb-2">🐱</span>
          <span className="block text-sm text-muted">In human years</span>
          <span className="block font-mono font-bold text-3xl text-primary">{Math.round(humanAge)} years</span>
        </div>}
      </div>
    </CalculatorShell>
  );
}
