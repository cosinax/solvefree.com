"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";
import { useMemo } from "react";

const inp = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm";

// GRE percentiles from ETS data (approximate, 2024)
const verbalPercentiles: Record<number, number> = {
  130: 1, 131: 1, 132: 2, 133: 3, 134: 4, 135: 5, 136: 7, 137: 8, 138: 10,
  139: 12, 140: 14, 141: 16, 142: 18, 143: 21, 144: 23, 145: 26, 146: 29,
  147: 32, 148: 35, 149: 38, 150: 42, 151: 45, 152: 49, 153: 53, 154: 57,
  155: 61, 156: 65, 157: 69, 158: 73, 159: 77, 160: 80, 161: 83, 162: 86,
  163: 88, 164: 91, 165: 93, 166: 95, 167: 96, 168: 97, 169: 99, 170: 99,
};

const quantPercentiles: Record<number, number> = {
  130: 1, 131: 1, 132: 1, 133: 1, 134: 2, 135: 3, 136: 3, 137: 4, 138: 5,
  139: 6, 140: 8, 141: 9, 142: 11, 143: 13, 144: 16, 145: 19, 146: 22,
  147: 25, 148: 29, 149: 33, 150: 38, 151: 42, 152: 47, 153: 52, 154: 57,
  155: 63, 156: 67, 157: 72, 158: 77, 159: 81, 160: 85, 161: 88, 162: 91,
  163: 93, 164: 95, 165: 96, 166: 97, 167: 98, 168: 98, 169: 99, 170: 96,
};

function lookupPct(table: Record<number, number>, score: number): number {
  return table[Math.round(score)] ?? 0;
}

export default function GREScorePage() {
  const [v, setV] = useHashState({ verbal: "155", quant: "158", writing: "4.0" });

  const verbal = parseInt(v.verbal) || 0;
  const quant = parseInt(v.quant) || 0;
  const writing = parseFloat(v.writing) || 0;

  const result = useMemo(() => {
    if (verbal < 130 || verbal > 170 || quant < 130 || quant > 170) return null;
    const vPct = lookupPct(verbalPercentiles, verbal);
    const qPct = lookupPct(quantPercentiles, quant);
    const total = verbal + quant;
    const totalPct = Math.round((vPct + qPct) / 2);
    return { vPct, qPct, total, totalPct };
  }, [verbal, quant]);

  function pctLabel(p: number) {
    if (p >= 90) return "Excellent";
    if (p >= 75) return "Strong";
    if (p >= 50) return "Average";
    if (p >= 25) return "Below Average";
    return "Low";
  }

  return (
    <CalculatorShell title="GRE Score Calculator" description="Estimate your GRE percentile rankings based on Verbal, Quantitative, and Analytical Writing scores.">
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-muted mb-1">Verbal Reasoning (130–170)</label>
            <input type="number" value={v.verbal} onChange={e => setV({ verbal: e.target.value })} className={inp} min="130" max="170" step="1" />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Quantitative Reasoning (130–170)</label>
            <input type="number" value={v.quant} onChange={e => setV({ quant: e.target.value })} className={inp} min="130" max="170" step="1" />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Analytical Writing (0–6)</label>
            <input type="number" value={v.writing} onChange={e => setV({ writing: e.target.value })} className={inp} min="0" max="6" step="0.5" />
          </div>
        </div>

        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-card border border-card-border rounded-lg text-center">
                <div className="text-xs text-muted mb-1">Verbal Score</div>
                <div className="font-mono font-bold text-2xl">{verbal}</div>
                <div className="text-xs text-muted mt-1">{result.vPct}th percentile</div>
              </div>
              <div className="p-3 bg-primary-light border border-primary/20 rounded-lg text-center">
                <div className="text-xs text-muted mb-1">Total Score</div>
                <div className="font-mono font-bold text-2xl text-primary">{result.total}</div>
                <div className="text-xs text-muted mt-1">≈{result.totalPct}th percentile</div>
              </div>
              <div className="p-3 bg-card border border-card-border rounded-lg text-center">
                <div className="text-xs text-muted mb-1">Quant Score</div>
                <div className="font-mono font-bold text-2xl">{quant}</div>
                <div className="text-xs text-muted mt-1">{result.qPct}th percentile</div>
              </div>
            </div>

            {[
              { label: "Verbal Reasoning", score: verbal, pct: result.vPct },
              { label: "Quantitative Reasoning", score: quant, pct: result.qPct },
              { label: "Analytical Writing", score: writing, pct: null },
            ].map(row => (
              <div key={row.label} className="px-3 py-2.5 bg-background border border-card-border rounded-lg flex items-center justify-between">
                <span className="text-sm">{row.label}</span>
                <div className="text-right">
                  <span className="font-mono font-bold">{row.score}</span>
                  {row.pct !== null && (
                    <span className="text-xs text-muted ml-2">({row.pct}th pct — {pctLabel(row.pct)})</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="text-xs text-muted">
          Percentiles are approximate based on ETS published data. Verbal and Quantitative each range from 130–170 in 1-point increments. Writing ranges from 0–6 in 0.5-point increments.
        </p>
      </div>
    </CalculatorShell>
  );
}
