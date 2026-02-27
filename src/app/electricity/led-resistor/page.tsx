"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";
export default function LedResistorPage() {
  const [v, setV] = useHashState({ supply: "5", forward: "2", current: "20" });
  const Vs = parseFloat(v.supply), Vf = parseFloat(v.forward), I = parseFloat(v.current) / 1000;
  const valid = Vs > Vf && I > 0;
  const R = valid ? (Vs - Vf) / I : 0;
  const P = valid ? (Vs - Vf) * I : 0;
  const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
  return (
    <CalculatorShell title="LED Resistor Calculator" description="Calculate the resistor needed for an LED circuit.">
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div><label className="block text-sm text-muted mb-1">Supply (V)</label><input type="number" value={v.supply} onChange={e => setV({ supply: e.target.value })} className={ic} /></div>
          <div><label className="block text-sm text-muted mb-1">LED Forward (V)</label><input type="number" value={v.forward} onChange={e => setV({ forward: e.target.value })} className={ic} /></div>
          <div><label className="block text-sm text-muted mb-1">Current (mA)</label><input type="number" value={v.current} onChange={e => setV({ current: e.target.value })} className={ic} /></div>
        </div>
        {valid && <div className="grid grid-cols-2 gap-3">
          <div className="px-4 py-3 bg-primary-light rounded-lg text-center"><span className="block text-xs text-muted">Resistor Needed</span><span className="font-mono font-bold text-2xl text-primary">{R.toFixed(0)} Ω</span></div>
          <div className="px-4 py-3 bg-primary-light rounded-lg text-center"><span className="block text-xs text-muted">Power Dissipated</span><span className="font-mono font-bold text-xl">{(P * 1000).toFixed(1)} mW</span></div>
        </div>}
        <p className="text-xs text-muted">R = (Vs - Vf) / I &nbsp; | &nbsp; Use next standard resistor value above.</p>
      </div>
    </CalculatorShell>
  );
}
