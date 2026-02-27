"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

function fmt4(n: number): string {
  return n.toLocaleString("en-US", { minimumFractionDigits: 4, maximumFractionDigits: 4 });
}
function fmt2(n: number): string {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const freqOptions = [
  { label: "Daily (365)",      value: "365" },
  { label: "Monthly (12)",     value: "12" },
  { label: "Quarterly (4)",    value: "4" },
  { label: "Semi-annually (2)", value: "2" },
  { label: "Annually (1)",     value: "1" },
];

function aprToApy(apr: number, n: number): number {
  return (Math.pow(1 + apr / n, n) - 1) * 100;
}
function apyToApr(apy: number, n: number): number {
  return n * (Math.pow(1 + apy / 100, 1 / n) - 1) * 100;
}

const refRates = [0.5, 1, 2, 3, 4, 5, 6, 7, 8, 10];

export default function ApyPage() {
  const [v, setV] = useHashState({ apr: "5", n: "12" });
  const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
  const sc = "w-full px-3 py-2.5 bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

  const apr  = parseFloat(v.apr);
  const n    = parseInt(v.n);
  const valid = !isNaN(apr) && apr > 0 && n > 0;

  const apy            = valid ? aprToApy(apr / 100, n) : 0;
  const effectiveDaily = valid ? aprToApy(apr / 100, 365) : 0;
  const aprFromApy     = valid ? apyToApr(apy, n) : 0;

  return (
    <CalculatorShell title="APY Calculator" description="Convert between APR and APY and see the effect of compounding frequency.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-muted mb-1">Nominal Rate / APR (%)</label>
            <input type="number" value={v.apr} onChange={e => setV({ apr: e.target.value })} className={ic} step="0.01" min="0" />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Compounding Frequency</label>
            <select value={v.n} onChange={e => setV({ n: e.target.value })} className={sc}>
              {freqOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>

        {valid && (
          <div className="space-y-3">
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="block text-sm text-muted">APY (Annual Percentage Yield)</span>
              <span className="block font-mono font-bold text-4xl text-primary">{fmt4(apy)}%</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "APR (input)",         value: `${fmt2(apr)}%` },
                { label: "APY",                  value: `${fmt4(apy)}%` },
                { label: "Effective Daily Rate", value: `${(effectiveDaily / 365).toFixed(6)}%` },
                { label: "APY → APR (reverse)", value: `${fmt4(aprFromApy)}%` },
              ].map(r => (
                <div key={r.label} className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
                  <span className="text-muted">{r.label}</span>
                  <span className="font-semibold">{r.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <p className="text-sm font-semibold text-muted mb-2">APY at Common APR Rates</p>
          <div className="rounded-lg border border-card-border overflow-hidden">
            <table className="w-full text-xs font-mono">
              <thead className="bg-card">
                <tr>
                  <th className="px-2 py-2 text-left text-muted">APR</th>
                  <th className="px-2 py-2 text-right text-muted">Daily</th>
                  <th className="px-2 py-2 text-right text-muted">Monthly</th>
                  <th className="px-2 py-2 text-right text-muted">Quarterly</th>
                  <th className="px-2 py-2 text-right text-muted">Annually</th>
                </tr>
              </thead>
              <tbody>
                {refRates.map(r => (
                  <tr key={r} className="border-t border-card-border">
                    <td className="px-2 py-1.5">{r}%</td>
                    <td className="px-2 py-1.5 text-right">{aprToApy(r / 100, 365).toFixed(4)}%</td>
                    <td className="px-2 py-1.5 text-right">{aprToApy(r / 100, 12).toFixed(4)}%</td>
                    <td className="px-2 py-1.5 text-right">{aprToApy(r / 100, 4).toFixed(4)}%</td>
                    <td className="px-2 py-1.5 text-right">{aprToApy(r / 100, 1).toFixed(4)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted mt-1">APY = (1 + APR/n)^n − 1</p>
        </div>
      </div>
    </CalculatorShell>
  );
}
