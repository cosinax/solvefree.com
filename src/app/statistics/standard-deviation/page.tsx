"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";
import { useMemo } from "react";

const ta = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm resize-none";

function fmt(n: number, d = 5): string {
  if (!isFinite(n) || isNaN(n)) return "—";
  return parseFloat(n.toPrecision(d)).toString();
}

export default function StandardDeviationPage() {
  const [v, setV] = useHashState({ data: "2,4,4,4,5,5,7,9" });

  const result = useMemo(() => {
    const nums = v.data
      .split(/[\s,;\n]+/)
      .map(s => parseFloat(s.trim()))
      .filter(n => isFinite(n));
    if (nums.length < 2) return null;
    const n = nums.length;
    const sum = nums.reduce((a, b) => a + b, 0);
    const mean = sum / n;
    const sumSqDiff = nums.reduce((a, b) => a + (b - mean) ** 2, 0);
    const varPop = sumSqDiff / n;
    const varSample = sumSqDiff / (n - 1);
    const sdPop = Math.sqrt(varPop);
    const sdSample = Math.sqrt(varSample);
    const sorted = [...nums].sort((a, b) => a - b);
    const min = sorted[0];
    const max = sorted[n - 1];
    const range = max - min;
    const se = sdSample / Math.sqrt(n);
    return { n, sum, mean, varPop, varSample, sdPop, sdSample, min, max, range, se, nums };
  }, [v]);

  return (
    <CalculatorShell title="Standard Deviation Calculator" description="Compute mean, variance, standard deviation (sample and population), and standard error.">
      <div className="space-y-4">
        <div>
          <label className="block text-xs text-muted mb-1">Data values (comma, space, or newline separated)</label>
          <textarea value={v.data} onChange={e => setV({ data: e.target.value })} className={ta} rows={3} />
        </div>

        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-primary-light border border-primary/20 rounded-lg text-center">
                <div className="text-xs text-muted mb-1">Population Std Dev (σ)</div>
                <div className="font-mono font-bold text-3xl text-primary">{fmt(result.sdPop)}</div>
              </div>
              <div className="p-4 bg-card border border-card-border rounded-lg text-center">
                <div className="text-xs text-muted mb-1">Sample Std Dev (s)</div>
                <div className="font-mono font-bold text-3xl">{fmt(result.sdSample)}</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              {[
                { label: "Count (n)", value: result.n.toString() },
                { label: "Sum", value: fmt(result.sum) },
                { label: "Mean (x̄)", value: fmt(result.mean) },
                { label: "Pop. Variance (σ²)", value: fmt(result.varPop) },
                { label: "Sample Variance (s²)", value: fmt(result.varSample) },
                { label: "Standard Error", value: fmt(result.se) },
                { label: "Min", value: fmt(result.min) },
                { label: "Max", value: fmt(result.max) },
                { label: "Range", value: fmt(result.range) },
              ].map(r => (
                <div key={r.label} className="p-2 bg-card border border-card-border rounded text-center">
                  <div className="text-muted text-[10px]">{r.label}</div>
                  <div className="font-mono font-semibold">{r.value}</div>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted">Use σ for entire population; s for a sample (divides by n−1). Standard error = s/√n.</p>
          </div>
        )}
        {!result && v.data.trim() && <p className="text-sm text-red-500">Enter at least 2 numeric values.</p>}
      </div>
    </CalculatorShell>
  );
}
