"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";
export default function MpgPage() {
  const [v, setV] = useHashState({ miles: "300", gallons: "10" });
  const m=parseFloat(v.miles), g=parseFloat(v.gallons);
  const valid=m>0&&g>0;
  const mpg=m/g;
  const kpl=mpg*0.425144;
  const l100km=g>0?100/(m*1.60934/g/3.78541):0;
  const ic="w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
  return (
    <CalculatorShell title="MPG Calculator" description="Calculate miles per gallon from distance and fuel.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div><label className="block text-sm text-muted mb-1">Miles Driven</label><input type="number" value={v.miles} onChange={e=>setV({miles:e.target.value})} className={ic}/></div>
          <div><label className="block text-sm text-muted mb-1">Gallons Used</label><input type="number" value={v.gallons} onChange={e=>setV({gallons:e.target.value})} className={ic}/></div>
        </div>
        {valid && <div className="grid grid-cols-3 gap-3">
          <div className="px-4 py-3 bg-primary-light rounded-lg text-center"><span className="block text-xs text-muted">MPG</span><span className="font-mono font-bold text-2xl text-primary">{mpg.toFixed(1)}</span></div>
          <div className="px-4 py-3 bg-primary-light rounded-lg text-center"><span className="block text-xs text-muted">km/L</span><span className="font-mono font-bold text-xl">{kpl.toFixed(1)}</span></div>
          <div className="px-4 py-3 bg-primary-light rounded-lg text-center"><span className="block text-xs text-muted">L/100km</span><span className="font-mono font-bold text-xl">{l100km.toFixed(1)}</span></div>
        </div>}
      </div>
    </CalculatorShell>
  );
}
