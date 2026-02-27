"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";
export default function TransformerPage() {
  const [v, setV] = useHashState({ vp: "120", vs: "", np: "100", ns: "" });
  const Vp = parseFloat(v.vp), Vs = parseFloat(v.vs), Np = parseFloat(v.np), Ns = parseFloat(v.ns);
  let ratio = 0, calcVs = Vs, calcNs = Ns;
  if (Vp > 0 && Np > 0 && Ns > 0) { ratio = Np / Ns; calcVs = Vp / ratio; }
  else if (Vp > 0 && Vs > 0) { ratio = Vp / Vs; if (Np > 0) calcNs = Np / ratio; }
  const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
  return (
    <CalculatorShell title="Transformer Calculator" description="Calculate transformer turns ratio and secondary voltage.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div><label className="block text-sm text-muted mb-1">Primary Voltage (V)</label><input type="number" value={v.vp} onChange={e=>setV({vp:e.target.value})} className={ic}/></div>
          <div><label className="block text-sm text-muted mb-1">Secondary Voltage (V)</label><input type="number" value={v.vs} onChange={e=>setV({vs:e.target.value})} placeholder="calculate" className={ic}/></div>
          <div><label className="block text-sm text-muted mb-1">Primary Turns</label><input type="number" value={v.np} onChange={e=>setV({np:e.target.value})} className={ic}/></div>
          <div><label className="block text-sm text-muted mb-1">Secondary Turns</label><input type="number" value={v.ns} onChange={e=>setV({ns:e.target.value})} placeholder="calculate" className={ic}/></div>
        </div>
        {ratio > 0 && <div className="grid grid-cols-3 gap-3">
          <div className="px-4 py-3 bg-primary-light rounded-lg text-center"><span className="block text-xs text-muted">Turns Ratio</span><span className="font-mono font-bold text-xl">{ratio.toFixed(2)}:1</span></div>
          <div className="px-4 py-3 bg-primary-light rounded-lg text-center"><span className="block text-xs text-muted">Vs</span><span className="font-mono font-bold text-xl text-primary">{calcVs.toFixed(2)} V</span></div>
          <div className="px-4 py-3 bg-primary-light rounded-lg text-center"><span className="block text-xs text-muted">Type</span><span className="font-mono font-bold text-xl">{ratio > 1 ? "Step-down" : ratio < 1 ? "Step-up" : "1:1"}</span></div>
        </div>}
      </div>
    </CalculatorShell>
  );
}
