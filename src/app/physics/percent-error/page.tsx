"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

export default function PercentErrorPage() {
  const [v, setV] = useHashState({
    experimental: "",
    theoretical: "",
    measurement1: "",
    measurement2: "",
  });

  const exp = parseFloat(v.experimental);
  const theo = parseFloat(v.theoretical);
  const m1 = parseFloat(v.measurement1);
  const m2 = parseFloat(v.measurement2);

  let pctError: number | null = null;
  let absError: number | null = null;
  let relError: number | null = null;

  if (!isNaN(exp) && !isNaN(theo) && theo !== 0) {
    absError = exp - theo;
    pctError = Math.abs(absError / theo) * 100;
    relError = absError / theo;
  }

  let pctDiff: number | null = null;
  let absDiff: number | null = null;
  if (!isNaN(m1) && !isNaN(m2)) {
    absDiff = Math.abs(m1 - m2);
    const avg = (Math.abs(m1) + Math.abs(m2)) / 2;
    if (avg !== 0) pctDiff = (absDiff / avg) * 100;
  }

  const fmt = (n: number, digits = 4) => parseFloat(n.toPrecision(digits)).toString();

  return (
    <CalculatorShell
      title="Percent Error Calculator"
      description="Calculate percent error, absolute error, and relative error. Also computes percent difference between two measurements."
    >
      <div className="space-y-6">
        {/* Percent Error */}
        <div className="border border-card-border rounded-xl p-4 space-y-3">
          <h3 className="text-sm font-semibold">Percent Error</h3>
          <p className="text-xs text-muted font-mono">% Error = |experimental − theoretical| / |theoretical| × 100%</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-muted mb-1">Experimental value</label>
              <input type="number" value={v.experimental} onChange={e => setV({ experimental: e.target.value })} placeholder="measured value" className={ic} />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1">Theoretical / accepted value</label>
              <input type="number" value={v.theoretical} onChange={e => setV({ theoretical: e.target.value })} placeholder="true value" className={ic} />
            </div>
          </div>

          {pctError !== null && (
            <div className="space-y-3">
              <div className="bg-primary-light rounded-xl p-4 text-center">
                <span className="block text-xs text-muted mb-1">Percent Error</span>
                <span className="block font-mono font-bold text-4xl text-primary">{fmt(pctError)}%</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
                  <span className="text-muted">Absolute error (exp − theo)</span>
                  <span>{fmt(absError!)}</span>
                </div>
                <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
                  <span className="text-muted">Relative error (absolute / theoretical)</span>
                  <span>{fmt(relError!, 5)}</span>
                </div>
                <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
                  <span className="text-muted">Direction</span>
                  <span>{absError! > 0 ? "Over-estimate (+)" : absError! < 0 ? "Under-estimate (−)" : "Exact"}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Percent Difference */}
        <div className="border border-card-border rounded-xl p-4 space-y-3">
          <h3 className="text-sm font-semibold">Percent Difference</h3>
          <p className="text-xs text-muted font-mono">% Diff = |A − B| / ((|A| + |B|)/2) × 100%</p>
          <p className="text-xs text-muted">Use this when neither value is the "true" value.</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-muted mb-1">Measurement A</label>
              <input type="number" value={v.measurement1} onChange={e => setV({ measurement1: e.target.value })} placeholder="value A" className={ic} />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1">Measurement B</label>
              <input type="number" value={v.measurement2} onChange={e => setV({ measurement2: e.target.value })} placeholder="value B" className={ic} />
            </div>
          </div>
          {pctDiff !== null && (
            <div className="space-y-3">
              <div className="bg-primary-light rounded-xl p-4 text-center">
                <span className="block text-xs text-muted mb-1">Percent Difference</span>
                <span className="block font-mono font-bold text-4xl text-primary">{fmt(pctDiff)}%</span>
              </div>
              <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
                <span className="text-muted">Absolute difference |A − B|</span>
                <span>{fmt(absDiff!)}</span>
              </div>
              <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
                <span className="text-muted">Average (A + B) / 2</span>
                <span>{fmt((m1 + m2) / 2)}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </CalculatorShell>
  );
}
