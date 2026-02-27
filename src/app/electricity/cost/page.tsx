"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";
export default function ElectricityCostPage() {
  const [v, setV] = useHashState({ watts: "100", hours: "8", rate: "0.12" });
  const W = parseFloat(v.watts), H = parseFloat(v.hours), R = parseFloat(v.rate);
  const valid = W > 0 && H > 0 && R > 0;
  const kWh = W * H / 1000;
  const daily = kWh * R;
  const monthly = daily * 30;
  const yearly = daily * 365;
  const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
  return (
    <CalculatorShell title="Electricity Cost Calculator" description="Calculate electricity cost from watts, hours, and rate.">
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div><label className="block text-sm text-muted mb-1">Watts</label><input type="number" value={v.watts} onChange={e=>setV({watts:e.target.value})} className={ic}/></div>
          <div><label className="block text-sm text-muted mb-1">Hours/day</label><input type="number" value={v.hours} onChange={e=>setV({hours:e.target.value})} className={ic}/></div>
          <div><label className="block text-sm text-muted mb-1">$/kWh</label><input type="number" value={v.rate} onChange={e=>setV({rate:e.target.value})} step="0.01" className={ic}/></div>
        </div>
        {valid && <div className="grid grid-cols-2 gap-3">
          <div className="px-4 py-3 bg-primary-light rounded-lg text-center"><span className="block text-xs text-muted">kWh/day</span><span className="font-mono font-bold text-xl">{kWh.toFixed(2)}</span></div>
          <div className="px-4 py-3 bg-primary-light rounded-lg text-center"><span className="block text-xs text-muted">Daily Cost</span><span className="font-mono font-bold text-xl">${daily.toFixed(2)}</span></div>
          <div className="px-4 py-3 bg-primary-light rounded-lg text-center"><span className="block text-xs text-muted">Monthly Cost</span><span className="font-mono font-bold text-xl text-primary">${monthly.toFixed(2)}</span></div>
          <div className="px-4 py-3 bg-primary-light rounded-lg text-center"><span className="block text-xs text-muted">Yearly Cost</span><span className="font-mono font-bold text-xl">${yearly.toFixed(2)}</span></div>
        </div>}
      </div>
    </CalculatorShell>
  );
}
