"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";
export default function BatteryLifePage() {
  const [v, setV] = useHashState({ capacity: "3000", load: "150" });
  const cap = parseFloat(v.capacity), load = parseFloat(v.load);
  const valid = cap > 0 && load > 0;
  const hours = cap / load;
  const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
  return (
    <CalculatorShell title="Battery Life Calculator" description="Estimate battery runtime from capacity (mAh) and load (mA).">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div><label className="block text-sm text-muted mb-1">Battery Capacity (mAh)</label><input type="number" value={v.capacity} onChange={e=>setV({capacity:e.target.value})} className={ic}/></div>
          <div><label className="block text-sm text-muted mb-1">Load Current (mA)</label><input type="number" value={v.load} onChange={e=>setV({load:e.target.value})} className={ic}/></div>
        </div>
        {valid && <div className="bg-primary-light rounded-xl p-4 text-center">
          <span className="block text-sm text-muted">Estimated Battery Life</span>
          <span className="block font-mono font-bold text-3xl text-primary">{hours.toFixed(1)} hours</span>
          <span className="block text-xs text-muted">{(hours*60).toFixed(0)} minutes · {(hours/24).toFixed(1)} days</span>
        </div>}
        <p className="text-xs text-muted">Actual battery life varies. This is a theoretical maximum assuming constant load and 100% efficiency.</p>
      </div>
    </CalculatorShell>
  );
}
