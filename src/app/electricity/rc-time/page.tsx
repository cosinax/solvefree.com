"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";
export default function RcTimePage() {
  const [v, setV] = useHashState({ resistance: "10000", capacitance: "100" });
  const R = parseFloat(v.resistance);
  const C = parseFloat(v.capacitance) * 1e-6;
  const valid = R > 0 && C > 0;
  const tau = R * C;
  const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
  return (
    <CalculatorShell title="RC Time Constant" description="Calculate RC circuit time constant (τ = R × C).">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div><label className="block text-sm text-muted mb-1">Resistance (Ω)</label><input type="number" value={v.resistance} onChange={e=>setV({resistance:e.target.value})} className={ic}/></div>
          <div><label className="block text-sm text-muted mb-1">Capacitance (µF)</label><input type="number" value={v.capacitance} onChange={e=>setV({capacitance:e.target.value})} className={ic}/></div>
        </div>
        {valid && <div className="space-y-3">
          <div className="bg-primary-light rounded-xl p-4 text-center"><span className="block text-sm text-muted">Time Constant (τ)</span><span className="block font-mono font-bold text-3xl text-primary">{tau>=1?tau.toFixed(3)+" s":(tau*1000).toFixed(3)+" ms"}</span></div>
          <div className="space-y-1 text-xs font-mono">{[1,2,3,4,5].map(n=><div key={n} className="flex justify-between px-3 py-1 bg-background border border-card-border rounded"><span>{n}τ = {(tau*n>=1?(tau*n).toFixed(3)+" s":(tau*n*1000).toFixed(3)+" ms")}</span><span>{(100*(1-Math.exp(-n))).toFixed(1)}% charged</span></div>)}</div>
        </div>}
      </div>
    </CalculatorShell>
  );
}
