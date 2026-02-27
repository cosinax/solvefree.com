"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

// Approximation of the normal CDF using Abramowitz & Stegun
function normalCDF(z: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989422820 * Math.exp(-0.5 * z * z);
  const poly = t * (0.3193815 + t * (-0.3565638 + t * (1.7814779 + t * (-1.8212560 + t * 1.3302744))));
  const p = 1 - d * poly;
  return z >= 0 ? p : 1 - p;
}

function normalInverse(p: number): number {
  // Rational approximation (Beasley–Springer–Moro)
  const a = [0, -3.969683028665376e+01, 2.209460984245205e+02, -2.759285104469687e+02, 1.383577518672690e+02, -3.066479806614716e+01, 2.506628277459239e+00];
  const b = [0, -5.447609879822406e+01, 1.615858368580409e+02, -1.556989798598866e+02, 6.680131188771972e+01, -1.328068155288572e+01];
  const c = [0, -7.784894002430293e-03, -3.223964580411365e-01, -2.400758277161838e+00, -2.549732539343734e+00, 4.374664141464968e+00, 2.938163982698783e+00];
  const d = [0, 7.784695709041462e-03, 3.224671290700398e-01, 2.445134137142996e+00, 3.754408661907416e+00];
  const pLow = 0.02425, pHigh = 1 - pLow;
  let q, r;
  if (p < pLow) {
    q = Math.sqrt(-2 * Math.log(p));
    return (((((c[1]*q+c[2])*q+c[3])*q+c[4])*q+c[5])*q+c[6]) / ((((d[1]*q+d[2])*q+d[3])*q+d[4])*q+1);
  } else if (p <= pHigh) {
    q = p - 0.5; r = q*q;
    return (((((a[1]*r+a[2])*r+a[3])*r+a[4])*r+a[5])*r+a[6])*q / (((((b[1]*r+b[2])*r+b[3])*r+b[4])*r+b[5])*r+1);
  } else {
    q = Math.sqrt(-2*Math.log(1-p));
    return -(((((c[1]*q+c[2])*q+c[3])*q+c[4])*q+c[5])*q+c[6]) / ((((d[1]*q+d[2])*q+d[3])*q+d[4])*q+1);
  }
}

const Z_TABLE = [
  { z: -3.0, pct: "0.13" }, { z: -2.5, pct: "0.62" }, { z: -2.0, pct: "2.28" },
  { z: -1.645, pct: "5.00" }, { z: -1.5, pct: "6.68" }, { z: -1.0, pct: "15.87" },
  { z: -0.5, pct: "30.85" }, { z: 0, pct: "50.00" }, { z: 0.5, pct: "69.15" },
  { z: 1.0, pct: "84.13" }, { z: 1.5, pct: "93.32" }, { z: 1.645, pct: "95.00" },
  { z: 2.0, pct: "97.72" }, { z: 2.5, pct: "99.38" }, { z: 3.0, pct: "99.87" },
];

function interpretZ(z: number): string {
  const abs = Math.abs(z);
  if (abs < 1) return "Within 1 standard deviation — very common result";
  if (abs < 1.645) return "Between 1–1.645 SD — fairly typical";
  if (abs < 2) return "Between 1.645–2 SD — somewhat unusual (outside 90% CI)";
  if (abs < 2.576) return "Between 2–2.576 SD — unusual (outside 95% CI, p < 0.05)";
  if (abs < 3) return "Between 2.576–3 SD — very unusual (outside 99% CI, p < 0.01)";
  return "Beyond 3 SD — extremely rare (less than 0.3% of data)";
}

export default function ZScorePage() {
  const [v, setV] = useHashState({ mode: "forward", value: "75", mean: "70", sd: "5", zscore: "1.5" });

  const value = parseFloat(v.value);
  const mean = parseFloat(v.mean);
  const sd = parseFloat(v.sd);
  const zInput = parseFloat(v.zscore);

  const forwardValid = !isNaN(value) && !isNaN(mean) && !isNaN(sd) && sd > 0;
  const reverseValid = !isNaN(zInput) && !isNaN(mean) && !isNaN(sd) && sd > 0;

  const z = forwardValid ? (value - mean) / sd : null;
  const percentile = z !== null ? normalCDF(z) * 100 : null;
  const reverseValue = reverseValid ? zInput * sd + mean : null;
  const reversePercentile = reverseValid ? normalCDF(zInput) * 100 : null;

  return (
    <CalculatorShell title="Z-Score Calculator" description="Calculate z-scores and percentiles from a normal distribution, or find a value from a z-score.">
      <div className="space-y-4">
        <div className="flex gap-2">
          <button onClick={() => setV({ mode: "forward" })} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${v.mode === "forward" ? "bg-primary text-white" : "bg-background border border-card-border text-muted"}`}>Value → Z-Score</button>
          <button onClick={() => setV({ mode: "reverse" })} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${v.mode === "reverse" ? "bg-primary text-white" : "bg-background border border-card-border text-muted"}`}>Z-Score → Value</button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-muted mb-1">Mean (μ)</label>
            <input type="number" value={v.mean} onChange={e => setV({ mean: e.target.value })} className={ic} />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Std Dev (σ)</label>
            <input type="number" value={v.sd} onChange={e => setV({ sd: e.target.value })} className={ic} />
          </div>
        </div>

        {v.mode === "forward" && (
          <>
            <div>
              <label className="block text-sm text-muted mb-1">Value (x)</label>
              <input type="number" value={v.value} onChange={e => setV({ value: e.target.value })} className={ic} />
            </div>
            {forwardValid && z !== null && percentile !== null && (
              <div className="space-y-3">
                <div className="bg-primary-light rounded-xl p-4 text-center">
                  <span className="block text-xs text-muted mb-1">Z-Score</span>
                  <span className="block font-mono font-bold text-4xl text-primary">{z.toFixed(4)}</span>
                </div>
                <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
                  <span className="text-muted">Percentile</span>
                  <span>{percentile.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
                  <span className="text-muted">Formula</span>
                  <span>({value} − {mean}) / {sd} = {z.toFixed(4)}</span>
                </div>
                <p className="text-xs text-muted px-1">{interpretZ(z)}</p>
              </div>
            )}
          </>
        )}

        {v.mode === "reverse" && (
          <>
            <div>
              <label className="block text-sm text-muted mb-1">Z-Score</label>
              <input type="number" value={v.zscore} onChange={e => setV({ zscore: e.target.value })} step="0.01" className={ic} />
            </div>
            {reverseValid && reverseValue !== null && reversePercentile !== null && (
              <div className="space-y-3">
                <div className="bg-primary-light rounded-xl p-4 text-center">
                  <span className="block text-xs text-muted mb-1">Value (x)</span>
                  <span className="block font-mono font-bold text-4xl text-primary">{reverseValue.toFixed(4)}</span>
                </div>
                <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
                  <span className="text-muted">Percentile</span>
                  <span>{reversePercentile.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
                  <span className="text-muted">Formula</span>
                  <span>x = {mean} + {zInput} × {sd} = {reverseValue.toFixed(4)}</span>
                </div>
                <p className="text-xs text-muted px-1">{interpretZ(zInput)}</p>
              </div>
            )}
          </>
        )}

        <div>
          <p className="text-xs text-muted font-semibold mb-2">Z-Score Reference Table</p>
          <div className="space-y-1">
            {Z_TABLE.map(row => (
              <div key={row.z} className="flex justify-between px-3 py-1 bg-background border border-card-border rounded text-xs font-mono">
                <span className="text-muted">z = {row.z > 0 ? "+" : ""}{row.z}</span>
                <span>{row.pct}th percentile</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CalculatorShell>
  );
}
