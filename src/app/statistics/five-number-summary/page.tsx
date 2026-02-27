"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";
import { useMemo, useState } from "react";

const ta = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm resize-none";

function fmt(n: number, d = 4): string {
  if (!isFinite(n) || isNaN(n)) return "—";
  return parseFloat(n.toPrecision(d)).toString();
}

export default function FiveNumberSummaryPage() {
  const [v, setV] = useHashState({ data: "4,8,15,16,23,42" });
  const [showOutliers, setShowOutliers] = useState(false);

  const result = useMemo(() => {
    const nums = v.data
      .split(/[\s,;\n]+/)
      .map(s => parseFloat(s.trim()))
      .filter(n => isFinite(n));
    if (nums.length < 2) return null;

    const sorted = [...nums].sort((a, b) => a - b);
    const n = sorted.length;

    const median = (arr: number[]) => {
      const mid = Math.floor(arr.length / 2);
      return arr.length % 2 === 0 ? (arr[mid - 1] + arr[mid]) / 2 : arr[mid];
    };

    const min = sorted[0];
    const max = sorted[n - 1];
    const med = median(sorted);
    const lower = sorted.slice(0, Math.floor(n / 2));
    const upper = sorted.slice(Math.ceil(n / 2));
    const q1 = median(lower);
    const q3 = median(upper);
    const iqr = q3 - q1;
    const whiskerLo = q1 - 1.5 * iqr;
    const whiskerHi = q3 + 1.5 * iqr;
    const outliers = sorted.filter(x => x < whiskerLo || x > whiskerHi);

    const mean = nums.reduce((a, b) => a + b, 0) / n;
    const variance = nums.reduce((a, b) => a + (b - mean) ** 2, 0) / n;
    const sd = Math.sqrt(variance);
    const range = max - min;
    const midrange = (min + max) / 2;

    return { min, q1, med, q3, max, iqr, mean, sd, range, midrange, outliers, n, whiskerLo, whiskerHi };
  }, [v]);

  return (
    <CalculatorShell title="5-Number Summary Calculator" description="Min, Q1, median, Q3, max, IQR, and boxplot for any data set.">
      <div className="space-y-4">
        <div>
          <label className="block text-xs text-muted mb-1">Data values (comma, space, or newline separated)</label>
          <textarea value={v.data} onChange={e => setV({ data: e.target.value })} className={ta} rows={3} />
        </div>

        {result && (
          <div className="space-y-3">
            {/* Boxplot SVG */}
            <div className="p-3 bg-card border border-card-border rounded-lg">
              <div className="text-xs text-muted mb-2">Boxplot</div>
              {(() => {
                const W = 280, pad = 20;
                const range = result.max - result.min;
                const scale = range > 0 ? (W - 2 * pad) / range : 1;
                const x = (v: number) => pad + (v - result.min) * scale;
                const wLo = Math.max(result.min, result.whiskerLo);
                const wHi = Math.min(result.max, result.whiskerHi);
                return (
                  <svg viewBox={`0 0 ${W} 40`} className="w-full h-10">
                    {/* Whisker lines */}
                    <line x1={x(wLo)} y1="20" x2={x(result.q1)} y2="20" stroke="currentColor" strokeWidth="1.5" />
                    <line x1={x(result.q3)} y1="20" x2={x(wHi)} y2="20" stroke="currentColor" strokeWidth="1.5" />
                    {/* End caps */}
                    <line x1={x(wLo)} y1="14" x2={x(wLo)} y2="26" stroke="currentColor" strokeWidth="1.5" />
                    <line x1={x(wHi)} y1="14" x2={x(wHi)} y2="26" stroke="currentColor" strokeWidth="1.5" />
                    {/* IQR box */}
                    <rect x={x(result.q1)} y="12" width={(result.q3 - result.q1) * scale} height="16" fill="rgba(99,102,241,0.2)" stroke="rgb(99,102,241)" strokeWidth="1.5" />
                    {/* Median line */}
                    <line x1={x(result.med)} y1="12" x2={x(result.med)} y2="28" stroke="rgb(99,102,241)" strokeWidth="2" />
                    {/* Outliers */}
                    {result.outliers.map((o, i) => (
                      <circle key={i} cx={x(o)} cy="20" r="3" fill="rgb(239,68,68)" stroke="none" />
                    ))}
                    {/* Labels */}
                    <text x={x(result.min)} y="38" fontSize="8" textAnchor="middle" fill="currentColor" opacity="0.6">{fmt(result.min)}</text>
                    <text x={x(result.max)} y="38" fontSize="8" textAnchor="middle" fill="currentColor" opacity="0.6">{fmt(result.max)}</text>
                  </svg>
                );
              })()}
            </div>

            <div className="grid grid-cols-5 gap-2 text-xs text-center">
              {[
                { label: "Min", value: fmt(result.min) },
                { label: "Q1", value: fmt(result.q1) },
                { label: "Median", value: fmt(result.med) },
                { label: "Q3", value: fmt(result.q3) },
                { label: "Max", value: fmt(result.max) },
              ].map(r => (
                <div key={r.label} className="p-2 bg-primary-light border border-primary/20 rounded">
                  <div className="text-muted">{r.label}</div>
                  <div className="font-mono font-semibold text-primary">{r.value}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              {[
                { label: "IQR (Q3−Q1)", value: fmt(result.iqr) },
                { label: "Range", value: fmt(result.range) },
                { label: "Midrange", value: fmt(result.midrange) },
                { label: "Mean", value: fmt(result.mean) },
                { label: "Std Dev", value: fmt(result.sd) },
                { label: "Count (n)", value: result.n.toString() },
              ].map(r => (
                <div key={r.label} className="p-2 bg-card border border-card-border rounded text-center">
                  <div className="text-muted text-[10px]">{r.label}</div>
                  <div className="font-mono font-semibold">{r.value}</div>
                </div>
              ))}
            </div>

            {result.outliers.length > 0 && (
              <div className="p-2 bg-card border border-card-border rounded text-xs">
                <button
                  className="text-red-500 font-medium"
                  onClick={() => setShowOutliers(!showOutliers)}
                >
                  {result.outliers.length} outlier{result.outliers.length > 1 ? "s" : ""} detected (1.5×IQR rule) ▾
                </button>
                {showOutliers && (
                  <div className="mt-1 text-muted font-mono">{result.outliers.join(", ")}</div>
                )}
              </div>
            )}
          </div>
        )}

        {!result && v.data.trim() && (
          <p className="text-sm text-red-500">Enter at least 2 numeric values.</p>
        )}
      </div>
    </CalculatorShell>
  );
}
