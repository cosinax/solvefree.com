"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

export default function SquareRootPage() {
  const [v, setV] = useHashState({ n: "144", nth: "2" });

  const num = parseFloat(v.n);
  const nth = parseFloat(v.nth);
  const valid = !isNaN(num) && !isNaN(nth) && nth >= 1 && nth <= 100;
  const negativeEven = num < 0 && nth % 2 === 0;

  const result = valid && !negativeEven ? Math.pow(Math.abs(num), 1 / nth) * (num < 0 ? -1 : 1) : NaN;
  const verification = !isNaN(result) ? Math.pow(result, nth) : NaN;

  const extras = valid && !isNaN(num) && num >= 0
    ? [
        { label: "Square (√)", n: 2, val: Math.sqrt(num) },
        { label: "Cube (∛)", n: 3, val: Math.cbrt(num) },
        { label: "4th Root (∜)", n: 4, val: Math.pow(num, 0.25) },
      ]
    : [];

  return (
    <CalculatorShell title="Square Root Calculator" description="Calculate the nth root of any number, plus square, cube, and 4th roots.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-muted mb-1">Number</label>
            <input type="number" value={v.n} onChange={e => setV({ n: e.target.value })} className={ic} />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Nth Root</label>
            <input type="number" value={v.nth} onChange={e => setV({ nth: e.target.value })} min="1" step="1" className={ic} />
          </div>
        </div>

        {valid && negativeEven && (
          <div className="text-center text-sm text-danger font-medium">Even root of a negative number is not real.</div>
        )}

        {valid && !negativeEven && !isNaN(result) && (
          <div className="space-y-3">
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="text-xs text-muted block mb-1">{nth === 2 ? "√" : nth === 3 ? "∛" : `${nth}th root`} of {v.n}</span>
              <span className="block font-mono font-bold text-4xl text-primary">{result.toPrecision(10).replace(/\.?0+$/, "")}</span>
              <span className="text-xs text-muted mt-1 block">Verification: {result.toPrecision(6)}^{nth} = {verification.toPrecision(6)}</span>
            </div>

            {extras.length > 0 && (
              <div>
                <p className="text-xs text-muted mb-1">Common roots of {v.n}:</p>
                <div className="space-y-1 text-xs font-mono">
                  {extras.map(({ label, val }) => (
                    <div key={label} className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded">
                      <span className="text-muted">{label}</span>
                      <span className="font-semibold">{val.toPrecision(10).replace(/\.?0+$/, "")}</span>
                    </div>
                  ))}
                  <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded">
                    <span className="text-muted">Square (n²)</span>
                    <span className="font-semibold">{(num * num).toPrecision(10).replace(/\.?0+$/, "")}</span>
                  </div>
                  <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded">
                    <span className="text-muted">Cube (n³)</span>
                    <span className="font-semibold">{(num * num * num).toPrecision(10).replace(/\.?0+$/, "")}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
