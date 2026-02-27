"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";
export default function CommutePage() {
  const [v, setV] = useHashState({ distance: "25", mpg: "28", gasPrice: "3.50", tolls: "0", parking: "0", days: "22" });
  const d=parseFloat(v.distance)*2, mpg=parseFloat(v.mpg), gas=parseFloat(v.gasPrice), tolls=parseFloat(v.tolls), parking=parseFloat(v.parking), days=parseInt(v.days);
  const valid=d>0&&mpg>0&&gas>0&&days>0;
  const dailyGas=(d/mpg)*gas;
  const dailyTotal=dailyGas+tolls+parking;
  const monthly=dailyTotal*days;
  const yearly=monthly*12;
  const ic="w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
  return (
    <CalculatorShell title="Commute Cost Calculator" description="Calculate your daily, monthly, and yearly commute costs.">
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div><label className="block text-sm text-muted mb-1">One-way (mi)</label><input type="number" value={v.distance} onChange={e=>setV({distance:e.target.value})} className={ic}/></div>
          <div><label className="block text-sm text-muted mb-1">MPG</label><input type="number" value={v.mpg} onChange={e=>setV({mpg:e.target.value})} className={ic}/></div>
          <div><label className="block text-sm text-muted mb-1">$/gallon</label><input type="number" value={v.gasPrice} onChange={e=>setV({gasPrice:e.target.value})} step="0.01" className={ic}/></div>
          <div><label className="block text-sm text-muted mb-1">Tolls/day ($)</label><input type="number" value={v.tolls} onChange={e=>setV({tolls:e.target.value})} className={ic}/></div>
          <div><label className="block text-sm text-muted mb-1">Parking/day ($)</label><input type="number" value={v.parking} onChange={e=>setV({parking:e.target.value})} className={ic}/></div>
          <div><label className="block text-sm text-muted mb-1">Work days/mo</label><input type="number" value={v.days} onChange={e=>setV({days:e.target.value})} className={ic}/></div>
        </div>
        {valid && <div className="grid grid-cols-3 gap-3">
          <div className="px-4 py-3 bg-primary-light rounded-lg text-center"><span className="block text-xs text-muted">Daily</span><span className="font-mono font-bold text-xl">${dailyTotal.toFixed(2)}</span></div>
          <div className="px-4 py-3 bg-primary-light rounded-lg text-center"><span className="block text-xs text-muted">Monthly</span><span className="font-mono font-bold text-xl text-primary">${monthly.toFixed(0)}</span></div>
          <div className="px-4 py-3 bg-primary-light rounded-lg text-center"><span className="block text-xs text-muted">Yearly</span><span className="font-mono font-bold text-xl">${yearly.toFixed(0)}</span></div>
        </div>}
      </div>
    </CalculatorShell>
  );
}
