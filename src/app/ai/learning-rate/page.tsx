"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";
export default function LearningRatePage() {
  const [v, setV] = useHashState({ params: "7", batchSize: "32" });
  const P = parseFloat(v.params), B = parseInt(v.batchSize);
  const valid = P > 0 && B > 0;
  // Common heuristics
  const baselineLR = 3e-4;
  const scaledByParams = baselineLR * Math.sqrt(0.125 / P);
  const scaledByBatch = baselineLR * Math.sqrt(B / 32);
  const combined = baselineLR * Math.sqrt(0.125 / P) * Math.sqrt(B / 32);
  const fmt = (n: number) => n >= 0.001 ? n.toFixed(4) : n.toExponential(2);
  const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
  return (
    <CalculatorShell title="Learning Rate Finder" description="Suggested learning rates based on model size and batch size.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div><label className="block text-sm text-muted mb-1">Parameters (B)</label><input type="number" value={v.params} onChange={e=>setV({params:e.target.value})} step="0.1" className={ic}/></div>
          <div><label className="block text-sm text-muted mb-1">Batch Size</label><input type="number" value={v.batchSize} onChange={e=>setV({batchSize:e.target.value})} className={ic}/></div>
        </div>
        {valid && <div className="space-y-2">
          {[{l:"Baseline (3e-4)",v:baselineLR},{l:"Scaled by model size",v:scaledByParams},{l:"Scaled by batch size",v:scaledByBatch},{l:"Combined scaling",v:combined}].map(r=>
            <div key={r.l} className="flex justify-between items-center px-4 py-3 bg-primary-light rounded-lg">
              <span className="text-sm text-muted">{r.l}</span>
              <span className="font-mono font-bold">{fmt(r.v)}</span>
            </div>
          )}
          <div className="px-4 py-3 bg-primary-light rounded-lg">
            <span className="block text-xs text-muted mb-1">Suggested range to search</span>
            <span className="font-mono font-bold text-primary">{fmt(combined/3)} → {fmt(combined*3)}</span>
          </div>
        </div>}
        <p className="text-xs text-muted">Rules of thumb: Smaller models → higher LR. Larger batches → higher LR. Always validate with warmup + cosine decay.</p>
      </div>
    </CalculatorShell>
  );
}
