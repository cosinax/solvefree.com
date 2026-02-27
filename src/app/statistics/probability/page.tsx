"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";
import { useMemo } from "react";

const inp = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm";

function fmt(n: number, d = 5): string {
  if (!isFinite(n) || isNaN(n)) return "—";
  if (n < 0.0001 && n > 0) return n.toExponential(4);
  return parseFloat(n.toPrecision(d)).toString();
}

export default function ProbabilityPage() {
  const [v, setV] = useHashState({
    mode: "basic",
    pA: "0.4",
    pB: "0.3",
    pAandB: "0.1",
    outcomes: "6",
    favorable: "2",
  });

  const result = useMemo(() => {
    if (v.mode === "basic") {
      const outcomes = parseInt(v.outcomes);
      const favorable = parseInt(v.favorable);
      if (!Number.isInteger(outcomes) || !Number.isInteger(favorable) || outcomes <= 0 || favorable < 0 || favorable > outcomes) return null;
      const p = favorable / outcomes;
      return {
        type: "basic" as const,
        p,
        complement: 1 - p,
        odds_for: `${favorable}:${outcomes - favorable}`,
        odds_against: `${outcomes - favorable}:${favorable}`,
        pct: (p * 100).toFixed(2) + "%",
      };
    } else {
      const pA = parseFloat(v.pA);
      const pB = parseFloat(v.pB);
      const pAandB = parseFloat(v.pAandB);
      if ([pA, pB, pAandB].some(x => !isFinite(x) || x < 0 || x > 1)) return null;
      if (pAandB > pA || pAandB > pB) return null;
      const pAorB = pA + pB - pAandB;
      const pAgivenB = pB > 0 ? pAandB / pB : NaN;
      const pBgivenA = pA > 0 ? pAandB / pA : NaN;
      const pAnotB = pA - pAandB;
      const pBnotA = pB - pAandB;
      return { type: "combined" as const, pA, pB, pAandB, pAorB, pAgivenB, pBgivenA, pAnotB, pBnotA };
    }
  }, [v]);

  return (
    <CalculatorShell title="Probability Calculator" description="Calculate event probability, combined probabilities (AND/OR), and conditional probability.">
      <div className="space-y-4">
        <div className="flex gap-2">
          {[{ k: "basic", l: "Single Event" }, { k: "combined", l: "A and B" }].map(m => (
            <button key={m.k} onClick={() => setV({ mode: m.k })}
              className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${v.mode === m.k ? "bg-primary text-white border-primary" : "bg-card border-card-border hover:bg-primary-light"}`}>
              {m.l}
            </button>
          ))}
        </div>

        {v.mode === "basic" && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-muted mb-1">Total outcomes</label>
              <input type="number" value={v.outcomes} onChange={e => setV({ outcomes: e.target.value })} className={inp} min="1" step="1" />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1">Favorable outcomes</label>
              <input type="number" value={v.favorable} onChange={e => setV({ favorable: e.target.value })} className={inp} min="0" step="1" />
            </div>
          </div>
        )}

        {v.mode === "combined" && (
          <div className="space-y-3">
            <p className="text-xs text-muted">Enter probabilities between 0 and 1. P(A∩B) must be ≤ min(P(A), P(B)).</p>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-muted mb-1">P(A)</label>
                <input type="number" value={v.pA} onChange={e => setV({ pA: e.target.value })} className={inp} min="0" max="1" step="0.01" />
              </div>
              <div>
                <label className="block text-xs text-muted mb-1">P(B)</label>
                <input type="number" value={v.pB} onChange={e => setV({ pB: e.target.value })} className={inp} min="0" max="1" step="0.01" />
              </div>
              <div>
                <label className="block text-xs text-muted mb-1">P(A∩B)</label>
                <input type="number" value={v.pAandB} onChange={e => setV({ pAandB: e.target.value })} className={inp} min="0" max="1" step="0.01" />
              </div>
            </div>
          </div>
        )}

        {result && v.mode === "basic" && result.type === "basic" && (
          <div className="space-y-3">
            <div className="p-4 bg-primary-light border border-primary/20 rounded-lg text-center">
              <div className="text-xs text-muted mb-1">Probability</div>
              <div className="font-mono font-bold text-3xl text-primary">{fmt(result.p)} ({result.pct})</div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { label: "Complement P(Aᶜ)", value: fmt(result.complement) },
                { label: "Odds for", value: result.odds_for },
                { label: "Odds against", value: result.odds_against },
              ].map(r => (
                <div key={r.label} className="p-2 bg-card border border-card-border rounded text-center">
                  <div className="text-muted">{r.label}</div>
                  <div className="font-mono font-semibold">{r.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {result && v.mode === "combined" && result.type === "combined" && (
          <div className="grid grid-cols-2 gap-2 text-xs">
            {[
              { label: "P(A∪B) — A or B", value: fmt(result.pAorB) },
              { label: "P(A∩B) — A and B", value: fmt(result.pAandB) },
              { label: "P(A|B) — A given B", value: fmt(result.pAgivenB) },
              { label: "P(B|A) — B given A", value: fmt(result.pBgivenA) },
              { label: "P(A only)", value: fmt(result.pAnotB) },
              { label: "P(B only)", value: fmt(result.pBnotA) },
            ].map(r => (
              <div key={r.label} className="p-2 bg-card border border-card-border rounded text-center">
                <div className="text-muted">{r.label}</div>
                <div className="font-mono font-semibold text-primary">{r.value}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
