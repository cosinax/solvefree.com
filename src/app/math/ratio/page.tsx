"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a)); b = Math.abs(Math.round(b));
  while (b) { [a, b] = [b, a % b]; }
  return a;
}

export default function RatioPage() {
  const [v, setV] = useHashState({ a: "3", b: "4", total: "100" });

  const a = parseFloat(v.a);
  const b = parseFloat(v.b);
  const total = parseFloat(v.total);
  const valid = !isNaN(a) && !isNaN(b) && a > 0 && b > 0;

  const g = valid ? gcd(a, b) : 1;
  const sa = valid ? a / g : 0;
  const sb = valid ? b / g : 0;
  const sum = valid ? a + b : 0;
  const pctA = valid ? (a / sum) * 100 : 0;
  const pctB = valid ? (b / sum) * 100 : 0;
  const decimal = valid ? a / b : 0;

  const scaleValid = valid && !isNaN(total) && total > 0;
  const scaledA = scaleValid ? (a / sum) * total : 0;
  const scaledB = scaleValid ? (b / sum) * total : 0;

  const multiples = [2, 3, 5, 10];

  function fmt(x: number) {
    return parseFloat(x.toPrecision(8)).toString();
  }

  return (
    <CalculatorShell title="Ratio Calculator" description="Simplify ratios, find percentages, scale to a new total, and see equivalent ratios.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-muted mb-1">A</label>
            <input type="number" value={v.a} onChange={e => setV({ a: e.target.value })} className={ic} min="0" />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">B</label>
            <input type="number" value={v.b} onChange={e => setV({ b: e.target.value })} className={ic} min="0" />
          </div>
        </div>

        {valid && (
          <div className="space-y-3">
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="text-xs text-muted block mb-1">Simplified Ratio</span>
              <span className="block font-mono font-bold text-4xl text-primary">{fmt(sa)} : {fmt(sb)}</span>
              <span className="text-xs text-muted block mt-1">Decimal: {fmt(decimal)}</span>
            </div>

            <div className="space-y-1 text-xs font-mono">
              <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded">
                <span className="text-muted">A as % of total</span>
                <span className="font-semibold">{pctA.toFixed(4)}%</span>
              </div>
              <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded">
                <span className="text-muted">B as % of total</span>
                <span className="font-semibold">{pctB.toFixed(4)}%</span>
              </div>
            </div>

            <div>
              <label className="block text-sm text-muted mb-1">Scale to total</label>
              <input type="number" value={v.total} onChange={e => setV({ total: e.target.value })} className={ic} min="0" />
              {scaleValid && (
                <div className="mt-2 space-y-1 text-xs font-mono">
                  <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded">
                    <span className="text-muted">A portion of {fmt(total)}</span>
                    <span className="font-semibold">{fmt(scaledA)}</span>
                  </div>
                  <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded">
                    <span className="text-muted">B portion of {fmt(total)}</span>
                    <span className="font-semibold">{fmt(scaledB)}</span>
                  </div>
                </div>
              )}
            </div>

            <div>
              <p className="text-xs text-muted mb-1">Equivalent ratios:</p>
              <div className="space-y-1 text-xs font-mono">
                {multiples.map(m => (
                  <div key={m} className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded">
                    <span className="text-muted">× {m}</span>
                    <span className="font-semibold">{fmt(sa * m)} : {fmt(sb * m)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
