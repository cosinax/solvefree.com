"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";
export default function DbmWattsPage() {
  const [v, setV] = useHashState({ dbm: "30" });
  const dbm = parseFloat(v.dbm);
  const valid = !isNaN(dbm);
  const mw = valid ? Math.pow(10, dbm/10) : 0;
  const w = mw / 1000;
  const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
  return (
    <CalculatorShell title="dBm to Watts" description="Convert between dBm and watts/milliwatts.">
      <div className="space-y-4">
        <div><label className="block text-sm text-muted mb-1">dBm</label><input type="number" value={v.dbm} onChange={e=>setV({dbm:e.target.value})} className={ic}/></div>
        {valid && <div className="grid grid-cols-2 gap-3">
          <div className="px-4 py-3 bg-primary-light rounded-lg text-center"><span className="block text-xs text-muted">Milliwatts</span><span className="font-mono font-bold text-xl">{mw>=1?mw.toFixed(2):mw.toExponential(3)} mW</span></div>
          <div className="px-4 py-3 bg-primary-light rounded-lg text-center"><span className="block text-xs text-muted">Watts</span><span className="font-mono font-bold text-xl">{w>=0.001?w.toFixed(4):w.toExponential(3)} W</span></div>
        </div>}
        <div className="text-xs text-muted space-y-0.5">{[-30,-20,-10,0,10,20,30,40].map(d=><div key={d} className="flex justify-between px-3 py-0.5 font-mono"><span>{d} dBm</span><span>{Math.pow(10,d/10)>=1?Math.pow(10,d/10).toFixed(1)+" mW":Math.pow(10,d/10).toExponential(1)+" mW"}</span></div>)}</div>
      </div>
    </CalculatorShell>
  );
}
