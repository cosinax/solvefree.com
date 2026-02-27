"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
const sc = "w-full px-3 py-2 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm";

const TABLE_HL = [0, 1, 2, 3, 4, 5, 10];

export default function HalfLifePage() {
  const [v, setV] = useHashState({
    n0: "",
    halfLife: "",
    elapsed: "",
    unit: "years",
  });

  const N0 = parseFloat(v.n0);
  const hl = parseFloat(v.halfLife);
  const t = parseFloat(v.elapsed);

  let remaining: number | null = null;
  let fraction: number | null = null;
  let numHalfLives: number | null = null;
  let decayConstant: number | null = null;

  if (!isNaN(hl) && hl > 0) {
    decayConstant = Math.LN2 / hl;
  }

  if (!isNaN(N0) && !isNaN(hl) && hl > 0 && !isNaN(t) && t >= 0) {
    numHalfLives = t / hl;
    fraction = Math.pow(0.5, numHalfLives);
    remaining = N0 * fraction;
  }

  const fmt = (n: number) => {
    if (Math.abs(n) >= 1e6 || (Math.abs(n) < 0.0001 && n !== 0)) {
      return n.toExponential(4);
    }
    return parseFloat(n.toPrecision(5)).toString();
  };

  const tableData = !isNaN(hl) && hl > 0 && !isNaN(N0) && N0 > 0
    ? TABLE_HL.map(nhl => ({
        nhl,
        t: nhl * hl,
        fraction: Math.pow(0.5, nhl),
        remaining: N0 * Math.pow(0.5, nhl),
      }))
    : [];

  return (
    <CalculatorShell
      title="Half-Life Calculator"
      description="Calculate radioactive decay: N(t) = N₀ × (0.5)^(t/t½). Remaining quantity, decay constant, and decay table."
    >
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-muted mb-1">Initial quantity (N₀)</label>
            <input type="number" value={v.n0} onChange={e => setV({ n0: e.target.value })} placeholder="e.g. 1000" className={ic} />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Half-life (t½)</label>
            <input type="number" value={v.halfLife} onChange={e => setV({ halfLife: e.target.value })} placeholder="e.g. 5730" className={ic} />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Elapsed time</label>
            <input type="number" value={v.elapsed} onChange={e => setV({ elapsed: e.target.value })} placeholder="e.g. 11460" className={ic} />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Time unit</label>
            <select value={v.unit} onChange={e => setV({ unit: e.target.value })} className={sc}>
              <option>seconds</option>
              <option>minutes</option>
              <option>hours</option>
              <option>days</option>
              <option>years</option>
            </select>
          </div>
        </div>

        {remaining !== null && (
          <div className="space-y-3">
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="block text-xs text-muted mb-1">Remaining quantity</span>
              <span className="block font-mono font-bold text-4xl text-primary">{fmt(remaining)}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="px-4 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">Fraction remaining</span>
                <span className="font-mono font-bold text-xl">{(fraction! * 100).toPrecision(4)}%</span>
              </div>
              <div className="px-4 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">Half-lives elapsed</span>
                <span className="font-mono font-bold text-xl">{parseFloat(numHalfLives!.toPrecision(4))}</span>
              </div>
            </div>
            {decayConstant !== null && (
              <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
                <span className="text-muted">Decay constant λ = ln(2)/t½</span>
                <span>{decayConstant.toExponential(4)} /{v.unit}</span>
              </div>
            )}
            <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
              <span className="text-muted">Formula</span>
              <span>N(t) = N₀ × (0.5)^(t/t½)</span>
            </div>
          </div>
        )}

        {tableData.length > 0 && (
          <div className="border-t border-card-border pt-4">
            <h3 className="text-sm font-semibold mb-2">Decay table</h3>
            <div className="overflow-auto">
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr className="text-muted border-b border-card-border">
                    <th className="text-left py-1 px-2">Half-lives</th>
                    <th className="text-right py-1 px-2">Time ({v.unit})</th>
                    <th className="text-right py-1 px-2">Fraction</th>
                    <th className="text-right py-1 px-2">Remaining</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map(row => (
                    <tr key={row.nhl} className="border-b border-card-border last:border-0">
                      <td className="py-1 px-2">{row.nhl}</td>
                      <td className="text-right py-1 px-2">{fmt(row.t)}</td>
                      <td className="text-right py-1 px-2">{(row.fraction * 100).toPrecision(3)}%</td>
                      <td className="text-right py-1 px-2">{fmt(row.remaining)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
