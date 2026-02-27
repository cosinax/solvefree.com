"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";
import { useMemo } from "react";

const inp = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm";

// Approximate SAT percentile data (2023 College Board)
function satPercentile(total: number): number {
  if (total >= 1550) return 99;
  if (total >= 1500) return 98;
  if (total >= 1450) return 96;
  if (total >= 1400) return 94;
  if (total >= 1350) return 91;
  if (total >= 1300) return 87;
  if (total >= 1250) return 82;
  if (total >= 1200) return 74;
  if (total >= 1150) return 65;
  if (total >= 1100) return 55;
  if (total >= 1050) return 44;
  if (total >= 1000) return 34;
  if (total >= 950) return 24;
  if (total >= 900) return 16;
  if (total >= 850) return 10;
  if (total >= 800) return 6;
  if (total >= 750) return 3;
  return 1;
}

export default function SATScorePage() {
  const [v, setV] = useHashState({ ebrw: "600", math: "580" });

  const ebrw = Math.round(parseInt(v.ebrw) / 10) * 10 || 0;
  const math = Math.round(parseInt(v.math) / 10) * 10 || 0;
  const valid = ebrw >= 200 && ebrw <= 800 && math >= 200 && math <= 800;

  const result = useMemo(() => {
    if (!valid) return null;
    const total = ebrw + math;
    const pct = satPercentile(total);
    return { total, pct };
  }, [ebrw, math, valid]);

  function scoreLabel(pct: number) {
    if (pct >= 95) return "Exceptional";
    if (pct >= 85) return "High";
    if (pct >= 60) return "Above Average";
    if (pct >= 40) return "Average";
    if (pct >= 20) return "Below Average";
    return "Low";
  }

  return (
    <CalculatorShell title="SAT Score Calculator" description="Calculate your total SAT score and percentile ranking from section scores.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-muted mb-1">Evidence-Based Reading & Writing (200–800)</label>
            <input type="number" value={v.ebrw} onChange={e => setV({ ebrw: e.target.value })} className={inp} min="200" max="800" step="10" />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Math (200–800)</label>
            <input type="number" value={v.math} onChange={e => setV({ math: e.target.value })} className={inp} min="200" max="800" step="10" />
          </div>
        </div>

        {valid && result && (
          <div className="space-y-3">
            <div className="p-4 bg-primary-light border border-primary/20 rounded-lg text-center">
              <div className="text-xs text-muted mb-1">Total SAT Score</div>
              <div className="font-mono font-bold text-4xl text-primary">{result.total}</div>
              <div className="text-sm text-muted mt-1">{result.pct}th percentile — {scoreLabel(result.pct)}</div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-card border border-card-border rounded-lg text-center">
                <div className="text-xs text-muted mb-1">EBRW</div>
                <div className="font-mono font-bold text-2xl">{ebrw}</div>
                <div className="text-xs text-muted mt-1">out of 800</div>
              </div>
              <div className="p-3 bg-card border border-card-border rounded-lg text-center">
                <div className="text-xs text-muted mb-1">Math</div>
                <div className="font-mono font-bold text-2xl">{math}</div>
                <div className="text-xs text-muted mt-1">out of 800</div>
              </div>
            </div>

            <div className="p-3 bg-card border border-card-border rounded-lg text-xs space-y-1 text-muted">
              <p><strong>Score range:</strong> 400–1600</p>
              <p><strong>National average:</strong> ~1050</p>
              <p><strong>Common benchmarks:</strong> Ivy League ≥1500, Top-50 schools ≥1300, State universities ≥1000</p>
            </div>
          </div>
        )}

        <p className="text-xs text-muted">Percentiles are approximate based on College Board national data. Scores are rounded to the nearest 10.</p>
      </div>
    </CalculatorShell>
  );
}
