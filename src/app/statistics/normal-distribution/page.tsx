"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";
import { useMemo } from "react";

const inp = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm";

function fmt(n: number, d = 6) {
  if (!isFinite(n)) return "—";
  const abs = Math.abs(n);
  if (abs < 0.0001 && abs > 0) return n.toExponential(4);
  return parseFloat(n.toPrecision(d)).toString();
}

// Approximation of erf using Horner's method
function erf(x: number): number {
  const t = 1 / (1 + 0.3275911 * Math.abs(x));
  const poly = t * (0.254829592 + t * (-0.284496736 + t * (1.421413741 + t * (-1.453152027 + t * 1.061405429))));
  const result = 1 - poly * Math.exp(-x * x);
  return x >= 0 ? result : -result;
}

// Standard normal PDF
function normPDF(z: number): number {
  return Math.exp(-0.5 * z * z) / Math.sqrt(2 * Math.PI);
}

// Standard normal CDF using erf approximation
function normCDF(z: number): number {
  return 0.5 * (1 + erf(z / Math.SQRT2));
}

// Inverse normal CDF (Beasley-Springer-Moro algorithm approximation)
function normInvCDF(p: number): number {
  if (p <= 0) return -Infinity;
  if (p >= 1) return Infinity;
  if (p === 0.5) return 0;
  const a = [-3.969683028665376e1, 2.209460984245205e2, -2.759285104469687e2, 1.383577518672690e2, -3.066479806614716e1, 2.506628277459239];
  const b = [-5.447609879822406e1, 1.615858368580409e2, -1.556989798598866e2, 6.680131188771972e1, -1.328068155288572e1];
  const c = [-7.784894002430293e-3, -3.223964580411365e-1, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783];
  const d = [7.784695709041462e-3, 3.224671290700398e-1, 2.445134137142996, 3.754408661907416];
  const plow = 0.02425;
  const phigh = 1 - plow;
  let q: number;
  if (p < plow) {
    q = Math.sqrt(-2 * Math.log(p));
    return (((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5]) / ((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1);
  } else if (p <= phigh) {
    q = p - 0.5;
    const r = q * q;
    return (((((a[0]*r+a[1])*r+a[2])*r+a[3])*r+a[4])*r+a[5])*q / (((((b[0]*r+b[1])*r+b[2])*r+b[3])*r+b[4])*r+1);
  } else {
    q = Math.sqrt(-2 * Math.log(1 - p));
    return -(((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5]) / ((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1);
  }
}

export default function NormalDistributionPage() {
  const [v, setV] = useHashState({ mode: "cdf", z: "1.96", mean: "0", sd: "1", x: "1.96", prob: "0.975" });

  const result = useMemo(() => {
    const mean = parseFloat(v.mean);
    const sd = parseFloat(v.sd);
    if (!isFinite(mean) || !isFinite(sd) || sd <= 0) return null;

    if (v.mode === "cdf") {
      const x = parseFloat(v.x);
      if (!isFinite(x)) return null;
      const z = (x - mean) / sd;
      const cdf = normCDF(z);
      const pdf = normPDF(z) / sd;
      return { type: "cdf" as const, z, cdf, pLeft: cdf, pRight: 1 - cdf, pTwoTail: 2 * Math.min(cdf, 1 - cdf), pdf };
    } else {
      const p = parseFloat(v.prob);
      if (!isFinite(p) || p <= 0 || p >= 1) return null;
      const z = normInvCDF(p);
      const x = mean + z * sd;
      const pdf = normPDF(z) / sd;
      return { type: "inv" as const, z, x, p, pdf };
    }
  }, [v]);

  // Draw bell curve. normPDF(0) ≈ 0.3989, scale=200 → peak at py=90-0.3989*200≈10 (10px from top)
  const bellPoints = useMemo(() => {
    const pts: string[] = [];
    for (let i = 0; i <= 100; i++) {
      const z = -4 + i * 0.08;
      const y = normPDF(z);
      const px = (i / 100) * 280 + 10;
      const py = 90 - y * 200;
      pts.push(`${px},${py}`);
    }
    return pts.join(" ");
  }, []);

  const shadedZ = result && "z" in result ? result.z : null;
  const shadedX = result && "x" in result ? result.x : null;
  const displayZ = shadedZ ?? (shadedX ? (shadedX - parseFloat(v.mean)) / parseFloat(v.sd) : null);

  const shadePct = displayZ != null ? Math.max(0, Math.min(100, ((displayZ + 4) / 8) * 100)) : null;

  return (
    <CalculatorShell
      title="Normal Distribution Calculator"
      description="Calculate probabilities and quantiles for any normal distribution."
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-muted mb-1">Mean (μ)</label>
            <input type="number" value={v.mean} onChange={e => setV({ mean: e.target.value })} className={inp} step="any" />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Std Dev (σ)</label>
            <input type="number" value={v.sd} onChange={e => setV({ sd: e.target.value })} className={inp} min="0.001" step="any" />
          </div>
        </div>

        <div>
          <label className="block text-xs text-muted mb-1">Mode</label>
          <div className="flex gap-2">
            {[{ key: "cdf", label: "X → Probability" }, { key: "inv", label: "Probability → X" }].map(m => (
              <button
                key={m.key}
                onClick={() => setV({ mode: m.key })}
                className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${v.mode === m.key ? "bg-primary text-white border-primary" : "bg-card border-card-border hover:bg-primary-light"}`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {v.mode === "cdf" ? (
          <div>
            <label className="block text-xs text-muted mb-1">X value</label>
            <input type="number" value={v.x} onChange={e => setV({ x: e.target.value })} className={inp} step="any" />
          </div>
        ) : (
          <div>
            <label className="block text-xs text-muted mb-1">Probability (0 to 1)</label>
            <input type="number" value={v.prob} onChange={e => setV({ prob: e.target.value })} className={inp} step="0.001" min="0.001" max="0.999" />
          </div>
        )}

        {result && (
          <div className="space-y-3">
            {/* Bell curve SVG */}
            <div className="bg-card border border-card-border rounded-lg p-3 overflow-hidden">
              <svg viewBox="0 0 300 100" className="w-full h-24">
                {/* Fill left of z */}
                {shadePct != null && (
                  <clipPath id="shadeClip">
                    <rect x="0" y="0" width={`${shadePct * 2.8 + 10}`} height="100" />
                  </clipPath>
                )}
                <polyline points={bellPoints} fill="none" stroke="var(--color-card-border)" strokeWidth="1.5" />
                {shadePct != null && (
                  <polyline points={bellPoints} fill="rgba(99,102,241,0.25)" stroke="none" clipPath="url(#shadeClip)" />
                )}
                {shadePct != null && (
                  <line x1={`${shadePct * 2.8 + 10}`} y1="0" x2={`${shadePct * 2.8 + 10}`} y2="100" stroke="rgb(99,102,241)" strokeWidth="1.5" strokeDasharray="4,2" />
                )}
              </svg>
            </div>

            {v.mode === "cdf" && result.type === "cdf" && (
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { label: "z-score", value: fmt(result.z) },
                  { label: "PDF f(x)", value: fmt(result.pdf, 5) },
                  { label: "P(X ≤ x)", value: fmt(result.pLeft, 6) },
                  { label: "P(X > x)", value: fmt(result.pRight, 6) },
                  { label: "P(two-tail)", value: fmt(result.pTwoTail, 6) },
                  { label: "Left %", value: (result.pLeft * 100).toFixed(3) + "%" },
                ].map(r => (
                  <div key={r.label} className="p-2 bg-card border border-card-border rounded text-center">
                    <div className="text-muted">{r.label}</div>
                    <div className="font-mono font-semibold text-primary">{r.value}</div>
                  </div>
                ))}
              </div>
            )}

            {v.mode === "inv" && result.type === "inv" && (
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { label: "X value", value: fmt(result.x) },
                  { label: "z-score", value: fmt(result.z) },
                  { label: "P(X ≤ x)", value: fmt(result.p, 6) },
                  { label: "PDF f(x)", value: fmt(result.pdf, 5) },
                ].map(r => (
                  <div key={r.label} className="p-2 bg-card border border-card-border rounded text-center">
                    <div className="text-muted">{r.label}</div>
                    <div className="font-mono font-semibold text-primary">{r.value}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
