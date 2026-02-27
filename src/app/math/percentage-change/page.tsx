"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

export default function PercentageChangePage() {
  const [v, setV] = useHashState({ orig: "100", newv: "125", pct: "25", base: "100" });

  const orig = parseFloat(v.orig);
  const newv = parseFloat(v.newv);
  const pct = parseFloat(v.pct);
  const base = parseFloat(v.base);

  const fwdValid = !isNaN(orig) && !isNaN(newv) && orig !== 0;
  const pctChange = fwdValid ? ((newv - orig) / Math.abs(orig)) * 100 : NaN;
  const absChange = fwdValid ? newv - orig : NaN;
  const ratio = fwdValid ? newv / orig : NaN;
  const pctDiff = fwdValid ? (Math.abs(newv - orig) / ((Math.abs(orig) + Math.abs(newv)) / 2)) * 100 : NaN;

  const revValid = !isNaN(pct) && !isNaN(base) && isFinite(pct);
  const revNew = revValid ? base * (1 + pct / 100) : NaN;

  function fmt(n: number, d = 6) { return parseFloat(n.toPrecision(d)).toString(); }
  function sign(n: number) { return n > 0 ? "+" : ""; }

  return (
    <CalculatorShell title="Percentage Change Calculator" description="Calculate percentage increase/decrease, absolute change, ratio, and reverse-calculate new values.">
      <div className="space-y-5">
        {/* Forward calculation */}
        <div>
          <h3 className="text-sm font-semibold mb-2">Percentage Change</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-muted mb-1">Original value</label>
              <input type="number" value={v.orig} onChange={e => setV({ orig: e.target.value })} className={ic} />
            </div>
            <div>
              <label className="block text-sm text-muted mb-1">New value</label>
              <input type="number" value={v.newv} onChange={e => setV({ newv: e.target.value })} className={ic} />
            </div>
          </div>

          {fwdValid && (
            <div className="mt-3 space-y-3">
              <div className="bg-primary-light rounded-xl p-4 text-center">
                <span className="text-xs text-muted block mb-1">
                  {pctChange >= 0 ? "Percentage Increase" : "Percentage Decrease"}
                </span>
                <span className={`block font-mono font-bold text-4xl ${pctChange >= 0 ? "text-primary" : "text-danger"}`}>
                  {sign(pctChange)}{fmt(pctChange)}%
                </span>
              </div>
              <div className="space-y-1 text-xs font-mono">
                <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded">
                  <span className="text-muted">Absolute change</span>
                  <span className="font-semibold">{sign(absChange)}{fmt(absChange)}</span>
                </div>
                <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded">
                  <span className="text-muted">Ratio (new/orig)</span>
                  <span className="font-semibold">{fmt(ratio)}</span>
                </div>
                <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded">
                  <span className="text-muted">Percentage difference (symmetric)</span>
                  <span className="font-semibold">{fmt(pctDiff)}%</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-card-border" />

        {/* Reverse calculation */}
        <div>
          <h3 className="text-sm font-semibold mb-2">Reverse: Find New Value</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-muted mb-1">Original value</label>
              <input type="number" value={v.base} onChange={e => setV({ base: e.target.value })} className={ic} />
            </div>
            <div>
              <label className="block text-sm text-muted mb-1">% change</label>
              <input type="number" value={v.pct} onChange={e => setV({ pct: e.target.value })} className={ic} />
            </div>
          </div>
          {revValid && (
            <div className="mt-3 bg-primary-light rounded-xl p-4 text-center">
              <span className="text-xs text-muted block mb-1">{fmt(base)} with {sign(pct)}{fmt(pct)}% change</span>
              <span className="block font-mono font-bold text-4xl text-primary">{fmt(revNew)}</span>
            </div>
          )}
        </div>
      </div>
    </CalculatorShell>
  );
}
