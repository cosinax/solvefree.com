"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

function fmt(n: number): string {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function CagrPage() {
  const [v, setV] = useHashState({
    mode: "calc",       // "calc" | "project"
    startValue: "10000",
    endValue: "20000",
    years: "5",
    cagr: "10",
  });
  const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
  const sc = "w-full px-3 py-2.5 bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

  const start  = parseFloat(v.startValue);
  const end    = parseFloat(v.endValue);
  const years  = parseFloat(v.years);
  const cagrIn = parseFloat(v.cagr);

  const isCalc    = v.mode === "calc";
  const validCalc = isCalc && start > 0 && end > 0 && years > 0;
  const validProj = !isCalc && start > 0 && years > 0 && cagrIn > 0;

  const cagr        = validCalc ? (Math.pow(end / start, 1 / years) - 1) * 100 : 0;
  const totalReturn = validCalc ? ((end - start) / start) * 100 : 0;
  const totalGain   = validCalc ? end - start : 0;

  const projectedEnd = validProj ? start * Math.pow(1 + cagrIn / 100, years) : 0;

  // Year-by-year table
  const table: { year: number; value: number; gain: number }[] = [];
  if (validCalc) {
    const rate = cagr / 100;
    for (let y = 1; y <= Math.min(Math.ceil(years), 20); y++) {
      const val = start * Math.pow(1 + rate, y);
      table.push({ year: y, value: val, gain: val - start });
    }
  } else if (validProj) {
    const rate = cagrIn / 100;
    for (let y = 1; y <= Math.min(Math.ceil(years), 20); y++) {
      const val = start * Math.pow(1 + rate, y);
      table.push({ year: y, value: val, gain: val - start });
    }
  }

  return (
    <CalculatorShell title="CAGR Calculator" description="Compound Annual Growth Rate — measure and project investment growth.">
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-muted mb-1">Mode</label>
          <select value={v.mode} onChange={e => setV({ mode: e.target.value })} className={sc}>
            <option value="calc">Calculate CAGR from start/end values</option>
            <option value="project">Project end value from CAGR</option>
          </select>
        </div>

        {isCalc ? (
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm text-muted mb-1">Start Value ($)</label>
              <input type="number" value={v.startValue} onChange={e => setV({ startValue: e.target.value })} className={ic} min="0" />
            </div>
            <div>
              <label className="block text-sm text-muted mb-1">End Value ($)</label>
              <input type="number" value={v.endValue} onChange={e => setV({ endValue: e.target.value })} className={ic} min="0" />
            </div>
            <div>
              <label className="block text-sm text-muted mb-1">Years</label>
              <input type="number" value={v.years} onChange={e => setV({ years: e.target.value })} className={ic} min="0" step="0.5" />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm text-muted mb-1">Start Value ($)</label>
              <input type="number" value={v.startValue} onChange={e => setV({ startValue: e.target.value })} className={ic} min="0" />
            </div>
            <div>
              <label className="block text-sm text-muted mb-1">CAGR (%)</label>
              <input type="number" value={v.cagr} onChange={e => setV({ cagr: e.target.value })} className={ic} step="0.1" />
            </div>
            <div>
              <label className="block text-sm text-muted mb-1">Years</label>
              <input type="number" value={v.years} onChange={e => setV({ years: e.target.value })} className={ic} min="0" step="0.5" />
            </div>
          </div>
        )}

        {(validCalc || validProj) && (
          <div className="space-y-3">
            {isCalc ? (
              <>
                <div className="bg-primary-light rounded-xl p-4 text-center">
                  <span className="block text-sm text-muted">CAGR</span>
                  <span className="block font-mono font-bold text-4xl text-primary">{cagr.toFixed(4)}%</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="px-3 py-3 bg-primary-light rounded-lg text-center">
                    <span className="block text-xs text-muted">Total Return</span>
                    <span className="font-mono font-semibold">{totalReturn.toFixed(2)}%</span>
                  </div>
                  <div className={`px-3 py-3 rounded-lg text-center ${totalGain >= 0 ? "bg-primary-light" : "bg-red-50 dark:bg-red-950"}`}>
                    <span className="block text-xs text-muted">Total Gain / Loss</span>
                    <span className={`font-mono font-semibold ${totalGain >= 0 ? "text-success" : "text-danger"}`}>{totalGain >= 0 ? "+" : ""}${fmt(totalGain)}</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-primary-light rounded-xl p-4 text-center">
                <span className="block text-sm text-muted">Projected End Value</span>
                <span className="block font-mono font-bold text-4xl text-primary">${fmt(projectedEnd)}</span>
                <span className="text-sm text-muted">+${fmt(projectedEnd - start)} ({((projectedEnd - start) / start * 100).toFixed(2)}% total)</span>
              </div>
            )}

            {table.length > 0 && (
              <div className="max-h-64 overflow-y-auto rounded-lg border border-card-border">
                <table className="w-full text-xs font-mono">
                  <thead className="bg-card sticky top-0">
                    <tr>
                      <th className="px-3 py-2 text-left text-muted">Year</th>
                      <th className="px-3 py-2 text-right text-muted">Value</th>
                      <th className="px-3 py-2 text-right text-muted">Gain</th>
                    </tr>
                  </thead>
                  <tbody>
                    {table.map(row => (
                      <tr key={row.year} className="border-t border-card-border">
                        <td className="px-3 py-1.5">{row.year}</td>
                        <td className="px-3 py-1.5 text-right">${fmt(row.value)}</td>
                        <td className={`px-3 py-1.5 text-right ${row.gain >= 0 ? "text-success" : "text-danger"}`}>
                          {row.gain >= 0 ? "+" : ""}${fmt(row.gain)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        <p className="text-xs text-muted">CAGR = (End/Start)^(1/Years) − 1. Shows up to 20 years.</p>
      </div>
    </CalculatorShell>
  );
}
