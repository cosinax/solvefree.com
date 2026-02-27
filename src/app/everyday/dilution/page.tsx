"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";
export default function DilutionPage() {
  const [v, setV] = useHashState({ c1: "100", v1: "", c2: "10", v2: "500" });
  // C1*V1 = C2*V2
  const c1=parseFloat(v.c1), v1_=parseFloat(v.v1), c2=parseFloat(v.c2), v2_=parseFloat(v.v2);
  let result = "", label = "";
  if (c1>0 && c2>0 && v2_>0 && !v.v1) { const calcV1=(c2*v2_)/c1; result=calcV1.toFixed(2)+" mL"; label="Volume of concentrate (V1)"; }
  else if (c1>0 && v1_>0 && v2_>0 && !v.c2) { const calcC2=(c1*v1_)/v2_; result=calcC2.toFixed(2)+"%"; label="Final concentration (C2)"; }
  else if (c1>0 && v1_>0 && c2>0 && !v.v2) { const calcV2=(c1*v1_)/c2; result=calcV2.toFixed(2)+" mL"; label="Final volume (V2)"; }
  const ic="w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
  return (
    <CalculatorShell title="Dilution Calculator" description="C1×V1 = C2×V2 — Leave one field empty to solve for it.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div><label className="block text-sm text-muted mb-1">C1 (initial %)</label><input type="number" value={v.c1} onChange={e=>setV({c1:e.target.value})} className={ic}/></div>
          <div><label className="block text-sm text-muted mb-1">V1 (initial mL)</label><input type="number" value={v.v1} onChange={e=>setV({v1:e.target.value})} placeholder="solve" className={ic}/></div>
          <div><label className="block text-sm text-muted mb-1">C2 (final %)</label><input type="number" value={v.c2} onChange={e=>setV({c2:e.target.value})} className={ic}/></div>
          <div><label className="block text-sm text-muted mb-1">V2 (final mL)</label><input type="number" value={v.v2} onChange={e=>setV({v2:e.target.value})} className={ic}/></div>
        </div>
        {result && <div className="bg-primary-light rounded-xl p-4 text-center"><span className="block text-sm text-muted">{label}</span><span className="block font-mono font-bold text-2xl text-primary">{result}</span></div>}
      </div>
    </CalculatorShell>
  );
}
