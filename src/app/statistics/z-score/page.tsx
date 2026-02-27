"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";
import { useMemo } from "react";

const inp = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm";

function erf(x: number): number {
  const t = 1 / (1 + 0.3275911 * Math.abs(x));
  const poly = t * (0.254829592 + t * (-0.284496736 + t * (1.421413741 + t * (-1.453152027 + t * 1.061405429))));
  const r = 1 - poly * Math.exp(-x * x);
  return x >= 0 ? r : -r;
}
function normCDF(z: number) { return 0.5 * (1 + erf(z / Math.SQRT2)); }

function fmt(n: number, d = 5) {
  if (!isFinite(n)) return "—";
  return parseFloat(n.toPrecision(d)).toString();
}

export default function ZScorePage() {
  const [v, setV] = useHashState({ mode: "toZ", x: "72", mean: "65", sd: "10", z: "0.7" });

  const result = useMemo(() => {
    const mean = parseFloat(v.mean);
    const sd = parseFloat(v.sd);
    if (!isFinite(mean) || !isFinite(sd) || sd <= 0) return null;
    if (v.mode === "toZ") {
      const x = parseFloat(v.x);
      if (!isFinite(x)) return null;
      const z = (x - mean) / sd;
      const pLeft = normCDF(z);
      return { z, x, pLeft, pRight: 1 - pLeft, pBetween: 2 * normCDF(Math.abs(z)) - 1 };
    } else {
      const z = parseFloat(v.z);
      if (!isFinite(z)) return null;
      const x = mean + z * sd;
      const pLeft = normCDF(z);
      return { z, x, pLeft, pRight: 1 - pLeft, pBetween: 2 * normCDF(Math.abs(z)) - 1 };
    }
  }, [v]);

  return (
    <CalculatorShell title="Z-Score Calculator" description="Convert between raw scores and z-scores, and find probabilities.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-muted mb-1">Population Mean (μ)</label>
            <input type="number" value={v.mean} onChange={e => setV({ mean: e.target.value })} className={inp} step="any" />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Std Dev (σ)</label>
            <input type="number" value={v.sd} onChange={e => setV({ sd: e.target.value })} className={inp} min="0.001" step="any" />
          </div>
        </div>

        <div className="flex gap-2">
          {[{ k: "toZ", l: "X → z-score" }, { k: "toX", l: "z-score → X" }].map(m => (
            <button key={m.k} onClick={() => setV({ mode: m.k })}
              className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${v.mode === m.k ? "bg-primary text-white border-primary" : "bg-card border-card-border hover:bg-primary-light"}`}>
              {m.l}
            </button>
          ))}
        </div>

        {v.mode === "toZ" ? (
          <div>
            <label className="block text-xs text-muted mb-1">X (raw score)</label>
            <input type="number" value={v.x} onChange={e => setV({ x: e.target.value })} className={inp} step="any" />
          </div>
        ) : (
          <div>
            <label className="block text-xs text-muted mb-1">z-score</label>
            <input type="number" value={v.z} onChange={e => setV({ z: e.target.value })} className={inp} step="0.01" />
          </div>
        )}

        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-primary-light border border-primary/20 rounded-lg text-center">
                <div className="text-xs text-muted mb-1">z-score</div>
                <div className="font-mono font-bold text-3xl text-primary">{fmt(result.z)}</div>
              </div>
              <div className="p-4 bg-card border border-card-border rounded-lg text-center">
                <div className="text-xs text-muted mb-1">Raw score (X)</div>
                <div className="font-mono font-bold text-3xl">{fmt(result.x)}</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {[
                { label: "P(X ≤ x)", value: fmt(result.pLeft) },
                { label: "P(X > x)", value: fmt(result.pRight) },
                { label: "P within |z|", value: fmt(result.pBetween) },
                { label: "Left percentile", value: (result.pLeft * 100).toFixed(2) + "%" },
                { label: "Right %", value: (result.pRight * 100).toFixed(2) + "%" },
                { label: "Formula", value: `z = (x−μ)/σ` },
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
