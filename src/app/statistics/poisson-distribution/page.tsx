"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";
import { useMemo } from "react";

const inp = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm";

function poissonPMF(lambda: number, k: number): number {
  if (lambda <= 0 || k < 0 || !Number.isInteger(k)) return NaN;
  // log(e^-λ * λ^k / k!) = -λ + k*ln(λ) - ln(k!)
  let logFact = 0;
  for (let i = 2; i <= k; i++) logFact += Math.log(i);
  return Math.exp(-lambda + k * Math.log(lambda) - logFact);
}

function fmt(n: number, d = 5): string {
  if (!isFinite(n) || isNaN(n)) return "—";
  if (n < 0.0001 && n > 0) return n.toExponential(4);
  return parseFloat(n.toPrecision(d)).toString();
}

export default function PoissonDistributionPage() {
  const [v, setV] = useHashState({ lambda: "4", k: "3" });

  const result = useMemo(() => {
    const lambda = parseFloat(v.lambda);
    const k = parseInt(v.k);
    if (!isFinite(lambda) || lambda <= 0 || !Number.isInteger(k) || k < 0) return null;
    const exactP = poissonPMF(lambda, k);
    let cdf = 0;
    for (let j = 0; j <= k; j++) cdf += poissonPMF(lambda, j);
    const rightP = 1 - cdf + exactP;

    // Bars for distribution chart (show 0 to mean+4sd or 25, whichever less)
    const maxK = Math.min(Math.max(k + 5, Math.ceil(lambda + 4 * Math.sqrt(lambda))), 30);
    const bars: { j: number; p: number }[] = [];
    for (let j = 0; j <= maxK; j++) bars.push({ j, p: poissonPMF(lambda, j) });

    return { exactP, cdf, rightP, mean: lambda, variance: lambda, sd: Math.sqrt(lambda), bars };
  }, [v]);

  const maxBarP = result ? Math.max(...result.bars.map(b => b.p)) : 1;

  return (
    <CalculatorShell title="Poisson Distribution Calculator" description="Probability of k events occurring when the average rate is λ.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-muted mb-1">Average rate (λ)</label>
            <input type="number" value={v.lambda} onChange={e => setV({ lambda: e.target.value })} className={inp} min="0.001" step="0.1" />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Events (k)</label>
            <input type="number" value={v.k} onChange={e => setV({ k: e.target.value })} className={inp} min="0" step="1" />
          </div>
        </div>

        {result && (
          <div className="space-y-3">
            <div className="p-3 bg-card border border-card-border rounded-lg">
              <div className="text-xs text-muted mb-2">Poisson(λ={v.lambda}) distribution</div>
              <div className="flex items-end gap-px h-16">
                {result.bars.map(b => (
                  <div key={b.j} className="flex-1 flex items-end h-full">
                    <div
                      className={`w-full rounded-sm ${b.j === parseInt(v.k) ? "bg-primary" : "bg-primary/30"}`}
                      style={{ height: `${(b.p / maxBarP) * 100}%` }}
                    />
                  </div>
                ))}
              </div>
              <div className="text-center text-[10px] text-muted mt-1">k = 0 … {result.bars[result.bars.length - 1].j}</div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-primary-light border border-primary/20 rounded-lg text-center">
                <div className="text-xs text-muted mb-1">P(X = {v.k})</div>
                <div className="font-mono font-bold text-2xl text-primary">{fmt(result.exactP)}</div>
              </div>
              <div className="p-4 bg-card border border-card-border rounded-lg text-center">
                <div className="text-xs text-muted mb-1">P(X ≤ {v.k})</div>
                <div className="font-mono font-bold text-2xl">{fmt(result.cdf)}</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {[
                { label: "P(X ≥ k)", value: fmt(result.rightP) },
                { label: "Mean (λ)", value: fmt(result.mean) },
                { label: "Std Dev (√λ)", value: fmt(result.sd) },
              ].map(r => (
                <div key={r.label} className="p-2 bg-card border border-card-border rounded text-center">
                  <div className="text-muted text-[10px]">{r.label}</div>
                  <div className="font-mono font-semibold">{r.value}</div>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted">λ is the average number of events in the interval (e.g. customers/hour, calls/day).</p>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
