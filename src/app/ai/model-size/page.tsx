"use client";

import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

export default function ModelSizePage() {
  const [v, setV] = useHashState({ params: "7", precision: "16" });
  const p = parseFloat(v.params) * 1e9;
  const bits = parseInt(v.precision);
  const gb = (p * (bits / 8)) / 1e9;
  const overhead = gb * 1.2;
  const trainingMem = gb * 6;
  const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
  return (
    <CalculatorShell title="Model Size Calculator" description="Estimate GPU memory needed for AI model parameters.">
      <div className="space-y-4">
        <div><label className="block text-sm text-muted mb-1">Parameters (billions)</label>
          <input type="number" value={v.params} onChange={(e) => setV({ params: e.target.value })} step="0.1" className={ic} /></div>
        <div><label className="block text-sm text-muted mb-1">Precision</label>
          <div className="grid grid-cols-4 gap-2">
            {[4, 8, 16, 32].map((b) => (
              <button key={b} onClick={() => setV({ precision: b.toString() })}
                className={`py-2 rounded-lg text-sm font-medium transition-colors ${parseInt(v.precision) === b ? "bg-primary text-white" : "bg-background border border-card-border"}`}>{b}-bit</button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="px-4 py-3 bg-primary-light rounded-lg text-center"><span className="block text-xs text-muted">Inference Memory</span><span className="font-mono font-bold text-xl">{gb.toFixed(1)} GB</span></div>
          <div className="px-4 py-3 bg-primary-light rounded-lg text-center"><span className="block text-xs text-muted">With Overhead</span><span className="font-mono font-bold text-xl text-primary">{overhead.toFixed(1)} GB</span></div>
          <div className="px-4 py-3 bg-primary-light rounded-lg text-center col-span-2"><span className="block text-xs text-muted">~Training Memory (AdamW)</span><span className="font-mono font-bold text-xl">{trainingMem.toFixed(1)} GB</span></div>
        </div>
        <p className="text-xs text-muted">Training typically needs ~6x inference memory for optimizer states, gradients, and activations.</p>
      </div>
    </CalculatorShell>
  );
}
