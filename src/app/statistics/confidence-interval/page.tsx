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

function normCDF(z: number): number { return 0.5 * (1 + erf(z / Math.SQRT2)); }

function normInvCDF(p: number): number {
  if (p <= 0) return -Infinity;
  if (p >= 1) return Infinity;
  const c = [-7.784894002430293e-3, -3.223964580411365e-1, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783];
  const d = [7.784695709041462e-3, 3.224671290700398e-1, 2.445134137142996, 3.754408661907416];
  const a = [-3.969683028665376e1, 2.209460984245205e2, -2.759285104469687e2, 1.383577518672690e2, -3.066479806614716e1, 2.506628277459239];
  const b = [-5.447609879822406e1, 1.615858368580409e2, -1.556989798598866e2, 6.680131188771972e1, -1.328068155288572e1];
  if (p < 0.02425) {
    const q = Math.sqrt(-2 * Math.log(p));
    return (((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5]) / ((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1);
  } else if (p <= 0.97575) {
    const q = p - 0.5, r = q * q;
    return (((((a[0]*r+a[1])*r+a[2])*r+a[3])*r+a[4])*r+a[5])*q / (((((b[0]*r+b[1])*r+b[2])*r+b[3])*r+b[4])*r+1);
  } else {
    const q = Math.sqrt(-2 * Math.log(1 - p));
    return -(((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5]) / ((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1);
  }
}

function fmt(n: number, d = 5) {
  if (!isFinite(n)) return "—";
  return parseFloat(n.toPrecision(d)).toString();
}

export default function ConfidenceIntervalPage() {
  const [v, setV] = useHashState({
    mode: "proportion",
    n: "1000",
    x: "450",
    mean: "52",
    sd: "8",
    conf: "0.95",
  });

  const result = useMemo(() => {
    const n = parseFloat(v.n);
    const conf = parseFloat(v.conf);
    if (!isFinite(n) || n < 1 || !isFinite(conf) || conf <= 0 || conf >= 1) return null;
    const z = normInvCDF((1 + conf) / 2);

    if (v.mode === "proportion") {
      const x = parseFloat(v.x);
      if (!isFinite(x) || x < 0 || x > n) return null;
      const p = x / n;
      const se = Math.sqrt(p * (1 - p) / n);
      const me = z * se;
      return { p, se, me, lo: p - me, hi: p + me, z, n, label: "Proportion" };
    } else {
      const mean = parseFloat(v.mean);
      const sd = parseFloat(v.sd);
      if (!isFinite(mean) || !isFinite(sd) || sd <= 0) return null;
      const se = sd / Math.sqrt(n);
      const me = z * se;
      return { p: mean, se, me, lo: mean - me, hi: mean + me, z, n, label: "Mean" };
    }
  }, [v]);

  const CONF_LEVELS = ["0.90", "0.95", "0.99"];

  return (
    <CalculatorShell
      title="Confidence Interval Calculator"
      description="Calculate confidence intervals for a proportion or mean."
    >
      <div className="space-y-4">
        <div className="flex gap-2">
          {[{ k: "proportion", l: "Proportion" }, { k: "mean", l: "Mean" }].map(m => (
            <button key={m.k} onClick={() => setV({ mode: m.k })}
              className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${v.mode === m.k ? "bg-primary text-white border-primary" : "bg-card border-card-border hover:bg-primary-light"}`}>
              {m.l}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-muted mb-1">Sample size (n)</label>
            <input type="number" value={v.n} onChange={e => setV({ n: e.target.value })} className={inp} min="1" step="1" />
          </div>
          {v.mode === "proportion" ? (
            <div>
              <label className="block text-xs text-muted mb-1">Successes (x)</label>
              <input type="number" value={v.x} onChange={e => setV({ x: e.target.value })} className={inp} min="0" step="1" />
            </div>
          ) : (
            <>
              <div>
                <label className="block text-xs text-muted mb-1">Sample mean (x̄)</label>
                <input type="number" value={v.mean} onChange={e => setV({ mean: e.target.value })} className={inp} step="any" />
              </div>
            </>
          )}
        </div>

        {v.mode === "mean" && (
          <div>
            <label className="block text-xs text-muted mb-1">Std Dev (σ or s)</label>
            <input type="number" value={v.sd} onChange={e => setV({ sd: e.target.value })} className={inp} min="0.001" step="any" />
          </div>
        )}

        <div>
          <label className="block text-xs text-muted mb-1">Confidence level</label>
          <div className="flex gap-2">
            {CONF_LEVELS.map(c => (
              <button key={c} onClick={() => setV({ conf: c })}
                className={`px-3 py-1.5 text-xs font-mono rounded-lg border transition-colors ${v.conf === c ? "bg-primary text-white border-primary" : "bg-card border-card-border hover:bg-primary-light"}`}>
                {(parseFloat(c) * 100).toFixed(0)}%
              </button>
            ))}
          </div>
        </div>

        {result && (
          <div className="space-y-3">
            <div className="p-4 bg-primary-light border border-primary/20 rounded-lg text-center">
              <div className="text-xs text-muted mb-1">{(parseFloat(v.conf) * 100).toFixed(0)}% Confidence Interval</div>
              <div className="font-mono font-bold text-2xl text-primary">
                ({fmt(result.lo, 4)}, {fmt(result.hi, 4)})
              </div>
            </div>
            {/* Visual bar */}
            <div className="px-4 py-3 bg-card border border-card-border rounded-lg">
              <div className="relative h-6 flex items-center">
                <div className="flex-1 h-1 bg-card-border rounded-full relative">
                  <div
                    className="absolute h-3 bg-primary/30 border border-primary rounded-full -top-1"
                    style={{ left: "15%", right: "15%" }}
                  />
                  <div className="absolute w-0.5 h-5 bg-primary -top-2" style={{ left: "50%" }} />
                </div>
              </div>
              <div className="flex justify-between text-xs font-mono text-muted mt-1">
                <span>{fmt(result.lo, 4)}</span>
                <span className="text-primary font-semibold">{fmt(result.p, 4)}</span>
                <span>{fmt(result.hi, 4)}</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {[
                { label: "Estimate (p̂ or x̄)", value: fmt(result.p, 4) },
                { label: "Std Error (SE)", value: fmt(result.se, 4) },
                { label: "Margin of Error", value: "± " + fmt(result.me, 4) },
                { label: "z* (critical)", value: fmt(result.z, 4) },
                { label: "Lower bound", value: fmt(result.lo, 4) },
                { label: "Upper bound", value: fmt(result.hi, 4) },
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
