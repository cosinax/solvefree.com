"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";
export default function BatchSizePage() {
  const [v, setV] = useHashState({ gpuMemory: "24", modelMemory: "14", seqLen: "2048", precision: "2" });
  const gpu = parseFloat(v.gpuMemory), model = parseFloat(v.modelMemory), seq = parseInt(v.seqLen), prec = parseInt(v.precision);
  const valid = gpu > model && model > 0 && seq > 0;
  const available = (gpu - model) * 1024; // MB available for activations
  const activationPerSample = seq * 12 * prec / 1024; // rough MB per sample (hidden_dim * layers approx)
  const maxBatch = Math.floor(available / Math.max(activationPerSample, 1));
  const recommended = Math.max(1, Math.pow(2, Math.floor(Math.log2(maxBatch))));
  const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
  return (
    <CalculatorShell title="Batch Size Calculator" description="Estimate optimal batch size based on GPU memory and model size.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div><label className="block text-sm text-muted mb-1">GPU Memory (GB)</label><input type="number" value={v.gpuMemory} onChange={e=>setV({gpuMemory:e.target.value})} className={ic}/></div>
          <div><label className="block text-sm text-muted mb-1">Model Memory (GB)</label><input type="number" value={v.modelMemory} onChange={e=>setV({modelMemory:e.target.value})} className={ic}/></div>
          <div><label className="block text-sm text-muted mb-1">Sequence Length</label><input type="number" value={v.seqLen} onChange={e=>setV({seqLen:e.target.value})} className={ic}/></div>
          <div><label className="block text-sm text-muted mb-1">Bytes/Param</label>
            <div className="grid grid-cols-3 gap-1">{[{l:"FP16",v:"2"},{l:"FP32",v:"4"},{l:"INT8",v:"1"}].map(p=>
              <button key={p.v} onClick={()=>setV({precision:p.v})} className={`py-1.5 rounded text-xs font-medium ${v.precision===p.v?"bg-primary text-white":"bg-background border border-card-border"}`}>{p.l}</button>
            )}</div></div>
        </div>
        {valid && <div className="grid grid-cols-2 gap-3">
          <div className="px-4 py-3 bg-primary-light rounded-lg text-center"><span className="block text-xs text-muted">Available Memory</span><span className="font-mono font-bold text-xl">{(gpu-model).toFixed(1)} GB</span></div>
          <div className="px-4 py-3 bg-primary-light rounded-lg text-center"><span className="block text-xs text-muted">Recommended Batch</span><span className="font-mono font-bold text-xl text-primary">{recommended}</span></div>
          <div className="px-4 py-3 bg-primary-light rounded-lg text-center col-span-2"><span className="block text-xs text-muted">Max Theoretical Batch</span><span className="font-mono font-bold text-xl">{maxBatch}</span></div>
        </div>}
        <p className="text-xs text-muted">Power-of-2 batch sizes are generally more efficient. Use gradient accumulation for larger effective batches.</p>
      </div>
    </CalculatorShell>
  );
}
