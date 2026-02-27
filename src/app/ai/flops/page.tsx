"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";
export default function FlopsPage() {
  const [v, setV] = useHashState({ params: "7", seqLen: "2048", batchSize: "1" });
  const P = parseFloat(v.params) * 1e9, S = parseInt(v.seqLen), B = parseInt(v.batchSize);
  const valid = P > 0 && S > 0 && B > 0;
  const forwardFlops = 2 * P * S * B;
  const backwardFlops = forwardFlops * 2;
  const totalFlops = forwardFlops + backwardFlops;
  const fmt = (n: number) => n >= 1e18 ? (n/1e18).toFixed(2)+" EFLOPS" : n >= 1e15 ? (n/1e15).toFixed(2)+" PFLOPS" : n >= 1e12 ? (n/1e12).toFixed(2)+" TFLOPS" : (n/1e9).toFixed(2)+" GFLOPS";
  const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
  return (
    <CalculatorShell title="FLOPS Calculator" description="Estimate compute (FLOPS) for a forward + backward pass.">
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div><label className="block text-sm text-muted mb-1">Params (B)</label><input type="number" value={v.params} onChange={e=>setV({params:e.target.value})} step="0.1" className={ic}/></div>
          <div><label className="block text-sm text-muted mb-1">Seq Length</label><input type="number" value={v.seqLen} onChange={e=>setV({seqLen:e.target.value})} className={ic}/></div>
          <div><label className="block text-sm text-muted mb-1">Batch Size</label><input type="number" value={v.batchSize} onChange={e=>setV({batchSize:e.target.value})} className={ic}/></div>
        </div>
        {valid && <div className="grid grid-cols-2 gap-3">
          <div className="px-4 py-3 bg-primary-light rounded-lg text-center"><span className="block text-xs text-muted">Forward Pass</span><span className="font-mono font-bold text-lg">{fmt(forwardFlops)}</span></div>
          <div className="px-4 py-3 bg-primary-light rounded-lg text-center"><span className="block text-xs text-muted">Backward Pass</span><span className="font-mono font-bold text-lg">{fmt(backwardFlops)}</span></div>
          <div className="px-4 py-3 bg-primary-light rounded-lg text-center col-span-2"><span className="block text-xs text-muted">Total (Fwd+Bwd)</span><span className="font-mono font-bold text-xl text-primary">{fmt(totalFlops)}</span></div>
        </div>}
        <p className="text-xs text-muted">Approximation: Forward ≈ 2×P×S×B, Backward ≈ 2× Forward</p>
      </div>
    </CalculatorShell>
  );
}
