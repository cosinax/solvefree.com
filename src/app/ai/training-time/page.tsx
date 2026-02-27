"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";
export default function TrainingTimePage() {
  const [v, setV] = useHashState({ tokens: "1000", params: "7", gpuTflops: "312", numGpus: "1", utilization: "40" });
  const T = parseFloat(v.tokens)*1e9, P = parseFloat(v.params)*1e9, G = parseFloat(v.gpuTflops)*1e12, N = parseInt(v.numGpus), U = parseFloat(v.utilization)/100;
  const valid = T>0&&P>0&&G>0&&N>0&&U>0;
  const totalFlops = 6*P*T; // 6 flops per param per token (fwd+bwd+optimizer)
  const effectiveFlops = G*N*U;
  const seconds = totalFlops/effectiveFlops;
  const hours = seconds/3600;
  const days = hours/24;
  const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
  return (
    <CalculatorShell title="Training Time Estimator" description="Estimate training time from dataset size, model size, and hardware.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div><label className="block text-sm text-muted mb-1">Tokens (B)</label><input type="number" value={v.tokens} onChange={e=>setV({tokens:e.target.value})} className={ic}/></div>
          <div><label className="block text-sm text-muted mb-1">Params (B)</label><input type="number" value={v.params} onChange={e=>setV({params:e.target.value})} step="0.1" className={ic}/></div>
          <div><label className="block text-sm text-muted mb-1">GPU TFLOPS</label><input type="number" value={v.gpuTflops} onChange={e=>setV({gpuTflops:e.target.value})} className={ic}/></div>
          <div><label className="block text-sm text-muted mb-1"># GPUs</label><input type="number" value={v.numGpus} onChange={e=>setV({numGpus:e.target.value})} className={ic}/></div>
        </div>
        <div><label className="block text-sm text-muted mb-1">GPU Utilization (%)</label><input type="number" value={v.utilization} onChange={e=>setV({utilization:e.target.value})} className={ic}/></div>
        {valid && <div className="bg-primary-light rounded-xl p-4 text-center">
          <span className="block text-sm text-muted">Estimated Training Time</span>
          <span className="block font-mono font-bold text-3xl text-primary">{days>=1?days.toFixed(1)+" days":hours.toFixed(1)+" hours"}</span>
          <span className="block text-xs text-muted">{hours.toFixed(0)} hours · {(seconds/3600/24).toFixed(1)} days · {(days/7).toFixed(1)} weeks</span>
        </div>}
        <p className="text-xs text-muted">Uses ~6 FLOPS per parameter per token (forward + backward + optimizer).</p>
      </div>
    </CalculatorShell>
  );
}
