"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";
export default function DogAgePage() {
  const [v, setV] = useHashState({ age: "5", size: "medium" });
  const age = parseFloat(v.age);
  // More accurate formula based on size
  let humanAge = 0;
  if (age > 0) {
    const first2 = v.size === "small" ? 12.5 : v.size === "large" ? 10.5 : 11.5;
    if (age <= 2) humanAge = age * first2;
    else {
      const yearly = v.size === "small" ? 4 : v.size === "large" ? 7 : 5;
      humanAge = first2 * 2 + (age - 2) * yearly;
    }
  }
  const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
  return (
    <CalculatorShell title="Dog Age Calculator" description="Convert dog years to human years based on size.">
      <div className="space-y-4">
        <div><label className="block text-sm text-muted mb-1">Dog Age (years)</label><input type="number" value={v.age} onChange={e=>setV({age:e.target.value})} step="0.5" className={ic}/></div>
        <div><label className="block text-sm text-muted mb-1">Dog Size</label>
          <div className="grid grid-cols-3 gap-2">{(["small","medium","large"] as const).map(s=>
            <button key={s} onClick={()=>setV({size:s})} className={`py-2 rounded-lg text-sm font-medium capitalize ${v.size===s?"bg-primary text-white":"bg-background border border-card-border"}`}>{s}</button>
          )}</div>
        </div>
        {age > 0 && <div className="bg-primary-light rounded-xl p-4 text-center">
          <span className="block text-4xl mb-2">🐕</span>
          <span className="block text-sm text-muted">In human years</span>
          <span className="block font-mono font-bold text-3xl text-primary">{Math.round(humanAge)} years</span>
        </div>}
      </div>
    </CalculatorShell>
  );
}
