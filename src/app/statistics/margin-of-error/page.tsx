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

function fmt(n: number, d = 4): string {
  if (!isFinite(n)) return "—";
  return parseFloat(n.toPrecision(d)).toString();
}

export default function MarginOfErrorPage() {
  const [v, setV] = useHashState({ n: "1000", conf: "0.95", p: "0.5", mode: "proportion", sd: "10" });

  const result = useMemo(() => {
    const n = parseFloat(v.n);
    const conf = parseFloat(v.conf);
    if (!isFinite(n) || n <= 0 || !isFinite(conf) || conf <= 0 || conf >= 1) return null;
    const z = normInvCDF((1 + conf) / 2);

    let se: number;
    if (v.mode === "proportion") {
      const p = parseFloat(v.p);
      if (!isFinite(p) || p < 0 || p > 1) return null;
      se = Math.sqrt(p * (1 - p) / n);
    } else {
      const sd = parseFloat(v.sd);
      if (!isFinite(sd) || sd <= 0) return null;
      se = sd / Math.sqrt(n);
    }
    const me = z * se;
    // Sample size needed for half this ME
    const nNeeded = Math.ceil((z * z * (v.mode === "proportion" ? parseFloat(v.p) * (1 - parseFloat(v.p)) : parseFloat(v.sd) ** 2)) / (me / 2) ** 2);

    return { me, se, z, nNeeded };
  }, [v]);

  const CONF_LEVELS = ["0.90", "0.95", "0.99"];

  return (
    <CalculatorShell title="Margin of Error Calculator" description="Calculate the margin of error for surveys and polls.">
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
              <label className="block text-xs text-muted mb-1">Proportion estimate (p)</label>
              <input type="number" value={v.p} onChange={e => setV({ p: e.target.value })} className={inp} min="0" max="1" step="0.01" />
            </div>
          ) : (
            <div>
              <label className="block text-xs text-muted mb-1">Std Dev (σ or s)</label>
              <input type="number" value={v.sd} onChange={e => setV({ sd: e.target.value })} className={inp} min="0.001" step="any" />
            </div>
          )}
        </div>

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
              <div className="text-xs text-muted mb-1">Margin of Error</div>
              <div className="font-mono font-bold text-3xl text-primary">± {fmt(result.me)}</div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {[
                { label: "z* (critical)", value: fmt(result.z) },
                { label: "Std Error", value: fmt(result.se) },
                { label: "n for ½ ME", value: result.nNeeded.toString() },
              ].map(r => (
                <div key={r.label} className="p-2 bg-card border border-card-border rounded text-center">
                  <div className="text-muted text-[10px]">{r.label}</div>
                  <div className="font-mono font-semibold">{r.value}</div>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted">
              Use p=0.5 (proportion) for worst-case ME. &quot;n for ½ ME&quot; is the sample size needed to halve the margin of error.
            </p>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
