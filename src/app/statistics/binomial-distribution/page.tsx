"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";
import { useMemo } from "react";

const inp = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm";

function combination(n: number, k: number): number {
  if (k > n || k < 0) return 0;
  if (k === 0 || k === n) return 1;
  let result = 1;
  for (let i = 0; i < k; i++) result = result * (n - i) / (i + 1);
  return result;
}

function fmt(n: number, d = 5): string {
  if (!isFinite(n) || isNaN(n)) return "—";
  if (n < 0.0001 && n > 0) return n.toExponential(4);
  return parseFloat(n.toPrecision(d)).toString();
}

export default function BinomialDistributionPage() {
  const [v, setV] = useHashState({ n: "20", p: "0.3", k: "6" });

  const result = useMemo(() => {
    const n = parseInt(v.n);
    const p = parseFloat(v.p);
    const k = parseInt(v.k);
    if (!Number.isInteger(n) || !Number.isInteger(k) || !isFinite(p)) return null;
    if (n < 0 || k < 0 || k > n || p < 0 || p > 1) return null;
    const q = 1 - p;

    const pmf = (j: number) => combination(n, j) * Math.pow(p, j) * Math.pow(q, n - j);

    const exactP = pmf(k);
    let cdf = 0;
    for (let j = 0; j <= k; j++) cdf += pmf(j);
    const rightP = 1 - cdf + exactP;
    const mean = n * p;
    const variance = n * p * q;
    const sd = Math.sqrt(variance);

    // Build distribution for bar chart (show up to 25 bars)
    const bars: { j: number; p: number }[] = [];
    const maxBars = Math.min(n + 1, 25);
    for (let j = 0; j < maxBars; j++) bars.push({ j, p: pmf(j) });

    return { exactP, cdf, rightP, mean, variance, sd, bars };
  }, [v]);

  const maxBarP = result ? Math.max(...result.bars.map(b => b.p)) : 1;

  return (
    <CalculatorShell title="Binomial Distribution Calculator" description="Calculate probabilities for the binomial distribution B(n, p).">
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs text-muted mb-1">Trials (n)</label>
            <input type="number" value={v.n} onChange={e => setV({ n: e.target.value })} className={inp} min="1" max="200" step="1" />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Probability (p)</label>
            <input type="number" value={v.p} onChange={e => setV({ p: e.target.value })} className={inp} min="0" max="1" step="0.01" />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Successes (k)</label>
            <input type="number" value={v.k} onChange={e => setV({ k: e.target.value })} className={inp} min="0" step="1" />
          </div>
        </div>

        {result && (
          <div className="space-y-3">
            {/* Bar chart */}
            <div className="p-3 bg-card border border-card-border rounded-lg">
              <div className="text-xs text-muted mb-2">Distribution B({v.n}, {v.p})</div>
              <div className="flex items-end gap-px h-16">
                {result.bars.map(b => (
                  <div key={b.j} className="flex-1 flex flex-col items-center justify-end h-full">
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
                { label: "Mean (np)", value: fmt(result.mean) },
                { label: "Variance (npq)", value: fmt(result.variance) },
                { label: "Std Dev", value: fmt(result.sd) },
              ].map(r => (
                <div key={r.label} className="p-2 bg-card border border-card-border rounded text-center">
                  <div className="text-muted text-[10px]">{r.label}</div>
                  <div className="font-mono font-semibold">{r.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
