"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";
export default function PerplexityPage() {
  const [v, setV] = useHashState({ loss: "3.5" });
  const loss = parseFloat(v.loss);
  const valid = loss > 0;
  const perplexity = Math.exp(loss);
  const bpc = loss / Math.log(2);
  const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
  return (
    <CalculatorShell title="Perplexity Calculator" description="Calculate perplexity from cross-entropy loss. PPL = e^loss">
      <div className="space-y-4">
        <div><label className="block text-sm text-muted mb-1">Cross-Entropy Loss</label><input type="number" value={v.loss} onChange={e=>setV({loss:e.target.value})} step="0.1" className={ic}/></div>
        {valid && <div className="grid grid-cols-2 gap-3">
          <div className="px-4 py-3 bg-primary-light rounded-lg text-center"><span className="block text-xs text-muted">Perplexity</span><span className="font-mono font-bold text-2xl text-primary">{perplexity.toFixed(2)}</span></div>
          <div className="px-4 py-3 bg-primary-light rounded-lg text-center"><span className="block text-xs text-muted">Bits per Character</span><span className="font-mono font-bold text-xl">{bpc.toFixed(3)}</span></div>
        </div>}
        <div className="text-xs text-muted space-y-0.5">{[1,2,3,4,5,6].map(l=><div key={l} className="flex justify-between px-3 py-0.5 font-mono"><span>Loss {l}.0</span><span>PPL {Math.exp(l).toFixed(1)}</span></div>)}</div>
      </div>
    </CalculatorShell>
  );
}
