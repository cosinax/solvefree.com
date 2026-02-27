"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";
export default function PowerPage() {
  const [v, setV] = useHashState({ watts: "", volts: "", amps: "" });
  const W = parseFloat(v.watts), V = parseFloat(v.volts), A = parseFloat(v.amps);
  const filled = [!isNaN(W), !isNaN(V), !isNaN(A)].filter(Boolean).length;
  let cW = W, cV = V, cA = A;
  if (filled >= 2) {
    if (isNaN(W)) cW = cV * cA;
    if (isNaN(V)) cV = cW / cA;
    if (isNaN(A)) cA = cW / cV;
  }
  const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
  return (
    <CalculatorShell title="Power Calculator" description="Calculate watts, volts, and amps. Enter any 2 to find the third.">
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div><label className="block text-sm text-muted mb-1">Watts (W)</label><input type="number" value={v.watts} onChange={e => setV({ watts: e.target.value })} className={ic} /></div>
          <div><label className="block text-sm text-muted mb-1">Volts (V)</label><input type="number" value={v.volts} onChange={e => setV({ volts: e.target.value })} className={ic} /></div>
          <div><label className="block text-sm text-muted mb-1">Amps (A)</label><input type="number" value={v.amps} onChange={e => setV({ amps: e.target.value })} className={ic} /></div>
        </div>
        {filled >= 2 && <div className="grid grid-cols-3 gap-3">
          <div className="px-4 py-3 bg-primary-light rounded-lg text-center"><span className="block text-xs text-muted">Power</span><span className="font-mono font-bold text-lg">{cW.toFixed(2)} W</span></div>
          <div className="px-4 py-3 bg-primary-light rounded-lg text-center"><span className="block text-xs text-muted">Voltage</span><span className="font-mono font-bold text-lg">{cV.toFixed(2)} V</span></div>
          <div className="px-4 py-3 bg-primary-light rounded-lg text-center"><span className="block text-xs text-muted">Current</span><span className="font-mono font-bold text-lg">{cA.toFixed(2)} A</span></div>
        </div>}
      </div>
    </CalculatorShell>
  );
}
