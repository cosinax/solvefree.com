"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";
export default function FuelCostPage() {
  const [v, setV] = useHashState({ distance: "300", mpg: "28", price: "3.50" });
  const d = parseFloat(v.distance), mpg = parseFloat(v.mpg), p = parseFloat(v.price);
  const valid = d>0 && mpg>0 && p>0;
  const gallons = d/mpg;
  const cost = gallons*p;
  const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
  return (
    <CalculatorShell title="Fuel Cost Calculator" description="Calculate fuel cost for a trip.">
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div><label className="block text-sm text-muted mb-1">Distance (mi)</label><input type="number" value={v.distance} onChange={e=>setV({distance:e.target.value})} className={ic}/></div>
          <div><label className="block text-sm text-muted mb-1">MPG</label><input type="number" value={v.mpg} onChange={e=>setV({mpg:e.target.value})} className={ic}/></div>
          <div><label className="block text-sm text-muted mb-1">$/gallon</label><input type="number" value={v.price} onChange={e=>setV({price:e.target.value})} step="0.01" className={ic}/></div>
        </div>
        {valid && <div className="grid grid-cols-2 gap-3">
          <div className="px-4 py-3 bg-primary-light rounded-lg text-center"><span className="block text-xs text-muted">Gallons Needed</span><span className="font-mono font-bold text-xl">{gallons.toFixed(1)}</span></div>
          <div className="px-4 py-3 bg-primary-light rounded-lg text-center"><span className="block text-xs text-muted">Trip Cost</span><span className="font-mono font-bold text-xl text-primary">${cost.toFixed(2)}</span></div>
        </div>}
      </div>
    </CalculatorShell>
  );
}
