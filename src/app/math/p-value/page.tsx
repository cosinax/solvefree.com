"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
const sel = "w-full px-3 py-2.5 bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

// Normal CDF approximation (Abramowitz & Stegun)
function normalCDF(z: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989422820 * Math.exp(-0.5 * z * z);
  const poly = t * (0.3193815 + t * (-0.3565638 + t * (1.7814779 + t * (-1.8212560 + t * 1.3302744))));
  const p = 1 - d * poly;
  return z >= 0 ? p : 1 - p;
}

// t-distribution CDF approximation (using regularized incomplete beta function via numerical method)
function tCDF(t: number, df: number): number {
  // Use large-df approximation: t → z when df > 30
  if (df >= 120) return normalCDF(t);
  // Beta CDF via continued fraction (Abramowitz & Stegun 26.5.8)
  const x = df / (df + t * t);
  function betaInc(a: number, b: number, x: number): number {
    if (x === 0) return 0;
    if (x === 1) return 1;
    const lbeta = lgamma(a) + lgamma(b) - lgamma(a + b);
    const front = Math.exp(Math.log(x) * a + Math.log(1 - x) * b - lbeta) / a;
    // Continued fraction
    let cf = 0;
    for (let m = 30; m >= 0; m--) {
      const d1 = -(a + m) * (a + b + m) * x / ((a + 2*m) * (a + 2*m + 1));
      const d2 = m * (b - m) * x / ((a + 2*m - 1) * (a + 2*m));
      cf = d1 / (1 + d2 / (1 + cf));
    }
    return front * (1 + cf);
  }
  function lgamma(z: number): number {
    const c = [76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5];
    let x = z, y = x, tmp = x + 5.5;
    tmp -= (x + 0.5) * Math.log(tmp);
    let ser = 1.000000000190015;
    for (let j = 0; j < 6; j++) { y++; ser += c[j] / y; }
    return -tmp + Math.log(2.5066282746310005 * ser / x);
  }
  const p = betaInc(df / 2, 0.5, x);
  return t > 0 ? 1 - p / 2 : p / 2;
}

// Chi-square CDF approximation (Wilson-Hilferty)
function chiSquareCDF(chi2: number, df: number): number {
  if (chi2 <= 0) return 0;
  const z = Math.pow(chi2 / df, 1/3) - (1 - 2 / (9 * df));
  const sigma = Math.sqrt(2 / (9 * df));
  return normalCDF(z / sigma);
}

function getPValue(testType: string, stat: number, tail: string, df: number): number {
  if (testType === "z") {
    const p1 = normalCDF(Math.abs(stat));
    if (tail === "right") return 1 - normalCDF(stat);
    if (tail === "left") return normalCDF(stat);
    return 2 * (1 - p1);
  }
  if (testType === "t") {
    if (tail === "right") return 1 - tCDF(stat, df);
    if (tail === "left") return tCDF(stat, df);
    return 2 * Math.min(tCDF(stat, df), 1 - tCDF(stat, df));
  }
  if (testType === "chi2") {
    return 1 - chiSquareCDF(stat, df);
  }
  return NaN;
}

function interpretP(p: number): string {
  if (p < 0.001) return "p < 0.001 — Extremely strong evidence against H₀";
  if (p < 0.01) return "p < 0.01 — Statistically significant at α = 0.01";
  if (p < 0.05) return "p < 0.05 — Statistically significant at α = 0.05";
  if (p < 0.1) return "p < 0.10 — Marginally significant; not significant at α = 0.05";
  return "p ≥ 0.10 — Not statistically significant; fail to reject H₀";
}

export default function PValuePage() {
  const [v, setV] = useHashState({ type: "z", stat: "2.05", tail: "two", df: "10" });

  const stat = parseFloat(v.stat);
  const df = parseInt(v.df);
  const valid = !isNaN(stat) && (v.type !== "t" || (v.type === "t" && df > 0)) && (v.type !== "chi2" || (v.type === "chi2" && df > 0 && stat >= 0));

  const pValue = valid ? getPValue(v.type, stat, v.tail, df) : null;
  const sig05 = pValue !== null ? pValue < 0.05 : null;
  const sig01 = pValue !== null ? pValue < 0.01 : null;

  return (
    <CalculatorShell title="P-Value Calculator" description="Calculate p-values for z-tests, t-tests, and chi-square tests. Supports left, right, and two-tailed tests.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-muted mb-1">Test Type</label>
            <select value={v.type} onChange={e => setV({ type: e.target.value })} className={sel}>
              <option value="z">Z-test (z-statistic)</option>
              <option value="t">T-test (t-statistic)</option>
              <option value="chi2">Chi-square (χ²)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Test Statistic</label>
            <input type="number" value={v.stat} onChange={e => setV({ stat: e.target.value })} step="0.01" className={ic} />
          </div>
        </div>

        {v.type !== "chi2" && (
          <div>
            <label className="block text-sm text-muted mb-1">Tail</label>
            <select value={v.tail} onChange={e => setV({ tail: e.target.value })} className={sel}>
              <option value="two">Two-tailed</option>
              <option value="right">Right-tailed (upper)</option>
              <option value="left">Left-tailed (lower)</option>
            </select>
          </div>
        )}

        {(v.type === "t" || v.type === "chi2") && (
          <div>
            <label className="block text-sm text-muted mb-1">Degrees of Freedom (df)</label>
            <input type="number" value={v.df} onChange={e => setV({ df: e.target.value })} min="1" className={ic} />
          </div>
        )}

        {valid && pValue !== null && (
          <div className="space-y-3">
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="block text-xs text-muted mb-1">P-Value</span>
              <span className="block font-mono font-bold text-4xl text-primary">
                {pValue < 0.0001 ? pValue.toExponential(3) : pValue.toFixed(4)}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className={`flex flex-col items-center px-3 py-2.5 rounded text-xs font-mono text-center border ${sig05 ? "border-green-500 bg-green-50 dark:bg-green-900/20" : "border-red-400 bg-red-50 dark:bg-red-900/20"}`}>
                <span className="text-muted mb-1">α = 0.05</span>
                <span className="font-bold">{sig05 ? "Significant" : "Not significant"}</span>
              </div>
              <div className={`flex flex-col items-center px-3 py-2.5 rounded text-xs font-mono text-center border ${sig01 ? "border-green-500 bg-green-50 dark:bg-green-900/20" : "border-red-400 bg-red-50 dark:bg-red-900/20"}`}>
                <span className="text-muted mb-1">α = 0.01</span>
                <span className="font-bold">{sig01 ? "Significant" : "Not significant"}</span>
              </div>
            </div>
            <p className="text-xs text-muted px-1">{interpretP(pValue)}</p>
          </div>
        )}

        <div className="space-y-1">
          <p className="text-xs text-muted font-semibold">Common Critical Values</p>
          <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono"><span className="text-muted">Z (α=0.05, two-tail)</span><span>±1.96</span></div>
          <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono"><span className="text-muted">Z (α=0.01, two-tail)</span><span>±2.576</span></div>
          <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono"><span className="text-muted">Z (α=0.05, one-tail)</span><span>1.645</span></div>
          <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono"><span className="text-muted">Chi-square (df=1, α=0.05)</span><span>3.841</span></div>
        </div>
      </div>
    </CalculatorShell>
  );
}
