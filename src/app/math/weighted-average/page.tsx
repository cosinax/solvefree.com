"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

export default function WeightedAveragePage() {
  const [v, setV] = useHashState({
    values: "90,85,78,92",
    weights: "0.3,0.3,0.2,0.2",
  });

  const rawValues = v.values.split(",").map(s => s.trim());
  const rawWeights = v.weights.split(",").map(s => s.trim());
  const count = Math.max(rawValues.length, rawWeights.length);

  const pairs: Array<{ val: number; wt: number; vValid: boolean; wValid: boolean }> = [];
  for (let i = 0; i < count; i++) {
    const val = parseFloat(rawValues[i] ?? "");
    const wt = parseFloat(rawWeights[i] ?? "");
    pairs.push({ val, wt, vValid: !isNaN(val), wValid: !isNaN(wt) && wt >= 0 });
  }

  const validPairs = pairs.filter(p => p.vValid && p.wValid);
  const sumWeights = validPairs.reduce((s, p) => s + p.wt, 0);
  const weightedSum = validPairs.reduce((s, p) => s + p.val * p.wt, 0);
  const weightedAvg = sumWeights > 0 ? weightedSum / sumWeights : NaN;

  function updateValue(i: number, val: string) {
    const arr = v.values.split(",");
    arr[i] = val;
    setV({ values: arr.join(",") });
  }
  function updateWeight(i: number, val: string) {
    const arr = v.weights.split(",");
    arr[i] = val;
    setV({ weights: arr.join(",") });
  }
  function addRow() {
    setV({ values: v.values + ",", weights: v.weights + "," });
  }
  function removeRow(i: number) {
    const va = v.values.split(","); va.splice(i, 1);
    const wa = v.weights.split(","); wa.splice(i, 1);
    setV({ values: va.join(","), weights: wa.join(",") });
  }

  function fmt(n: number) { return parseFloat(n.toPrecision(8)).toString(); }

  return (
    <CalculatorShell title="Weighted Average Calculator" description="Calculate the weighted mean of a set of values. Each value has its own weight.">
      <div className="space-y-4">
        <div>
          <div className="grid grid-cols-[1fr_1fr_auto] gap-2 text-xs font-medium text-muted mb-1">
            <span>Value</span><span>Weight</span><span></span>
          </div>
          <div className="space-y-1">
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center">
                <input
                  type="number"
                  value={rawValues[i] ?? ""}
                  onChange={e => updateValue(i, e.target.value)}
                  className={ic}
                  placeholder="Value"
                />
                <input
                  type="number"
                  value={rawWeights[i] ?? ""}
                  onChange={e => updateWeight(i, e.target.value)}
                  className={ic}
                  placeholder="Weight"
                  min="0"
                />
                <button
                  onClick={() => removeRow(i)}
                  className="text-danger text-lg leading-none px-1 hover:opacity-70"
                  aria-label="Remove row"
                >×</button>
              </div>
            ))}
          </div>
          <button
            onClick={addRow}
            className="mt-2 text-xs px-3 py-1.5 rounded-lg border border-card-border hover:bg-primary-light transition-colors"
          >+ Add row</button>
        </div>

        {!isNaN(weightedAvg) && validPairs.length > 0 && (
          <div className="space-y-3">
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="text-xs text-muted block mb-1">Weighted Average</span>
              <span className="block font-mono font-bold text-4xl text-primary">{fmt(weightedAvg)}</span>
            </div>

            <div className="space-y-1 text-xs font-mono">
              <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded">
                <span className="text-muted">Sum of weights</span>
                <span className="font-semibold">{fmt(sumWeights)}</span>
              </div>
              <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded">
                <span className="text-muted">Number of items</span>
                <span className="font-semibold">{validPairs.length}</span>
              </div>
            </div>

            <div>
              <p className="text-xs text-muted mb-1">Each item&apos;s contribution:</p>
              <div className="space-y-1 text-xs font-mono">
                {validPairs.map((p, i) => {
                  const contrib = sumWeights > 0 ? (p.wt / sumWeights) * 100 : 0;
                  return (
                    <div key={i} className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded">
                      <span className="text-muted">Item {i + 1} (v={fmt(p.val)}, w={fmt(p.wt)})</span>
                      <span className="font-semibold">{contrib.toFixed(1)}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
