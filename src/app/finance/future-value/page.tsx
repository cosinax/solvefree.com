"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

function fmt(n: number): string {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const compoundOptions = [
  { label: "Annually",     value: "1" },
  { label: "Semi-annually", value: "2" },
  { label: "Quarterly",    value: "4" },
  { label: "Monthly",      value: "12" },
  { label: "Daily",        value: "365" },
];

export default function FutureValuePage() {
  const [v, setV] = useHashState({
    pv: "10000",
    rate: "7",
    years: "10",
    n: "12",
    contribution: "0",
    when: "end",
  });
  const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
  const sc = "w-full px-3 py-2.5 bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

  const PV    = parseFloat(v.pv);
  const rate  = parseFloat(v.rate) / 100;
  const years = parseFloat(v.years);
  const n     = parseInt(v.n);
  const pmt   = parseFloat(v.contribution) || 0;
  const valid = PV >= 0 && rate >= 0 && years > 0 && n > 0;

  // FV of lump sum
  const fvLump = valid ? PV * Math.pow(1 + rate / n, n * years) : 0;

  // FV of annuity (contributions)
  const periodsTotal = Math.round(n * years);
  const rPerPeriod   = rate / n;
  let fvPmt = 0;
  if (valid && pmt !== 0 && rPerPeriod > 0) {
    if (v.when === "end") {
      fvPmt = pmt * ((Math.pow(1 + rPerPeriod, periodsTotal) - 1) / rPerPeriod);
    } else {
      fvPmt = pmt * ((Math.pow(1 + rPerPeriod, periodsTotal) - 1) / rPerPeriod) * (1 + rPerPeriod);
    }
  } else if (valid && pmt !== 0 && rPerPeriod === 0) {
    fvPmt = pmt * periodsTotal;
  }

  const fv              = fvLump + fvPmt;
  const totalContribs   = PV + pmt * periodsTotal;
  const totalInterest   = fv - totalContribs;

  // Growth table (year by year)
  const table: { year: number; balance: number; contributions: number; interest: number }[] = [];
  if (valid) {
    for (let y = 1; y <= Math.min(years, 50); y++) {
      const periods = Math.round(n * y);
      const bal_lump = PV * Math.pow(1 + rate / n, periods);
      let bal_pmt = 0;
      if (pmt !== 0 && rPerPeriod > 0) {
        if (v.when === "end") {
          bal_pmt = pmt * ((Math.pow(1 + rPerPeriod, periods) - 1) / rPerPeriod);
        } else {
          bal_pmt = pmt * ((Math.pow(1 + rPerPeriod, periods) - 1) / rPerPeriod) * (1 + rPerPeriod);
        }
      } else if (pmt !== 0) {
        bal_pmt = pmt * periods;
      }
      const bal  = bal_lump + bal_pmt;
      const contrib = PV + pmt * periods;
      table.push({ year: y, balance: bal, contributions: contrib, interest: bal - contrib });
    }
  }

  return (
    <CalculatorShell title="Future Value Calculator" description="Calculate how much a lump sum or regular contributions will be worth in the future.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-muted mb-1">Present Value ($)</label>
            <input type="number" value={v.pv} onChange={e => setV({ pv: e.target.value })} className={ic} min="0" />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Annual Interest Rate (%)</label>
            <input type="number" value={v.rate} onChange={e => setV({ rate: e.target.value })} className={ic} step="0.1" />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Years</label>
            <input type="number" value={v.years} onChange={e => setV({ years: e.target.value })} className={ic} min="1" />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Compound Frequency</label>
            <select value={v.n} onChange={e => setV({ n: e.target.value })} className={sc}>
              {compoundOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Regular Contribution ($)</label>
            <input type="number" value={v.contribution} onChange={e => setV({ contribution: e.target.value })} className={ic} />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Contribution Timing</label>
            <select value={v.when} onChange={e => setV({ when: e.target.value })} className={sc}>
              <option value="end">End of period</option>
              <option value="start">Start of period</option>
            </select>
          </div>
        </div>

        {valid && (
          <div className="space-y-3">
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="block text-sm text-muted">Future Value</span>
              <span className="block font-mono font-bold text-4xl text-primary">${fmt(fv)}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="px-3 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">Total Contributions</span>
                <span className="font-mono font-semibold">${fmt(totalContribs)}</span>
              </div>
              <div className="px-3 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">Total Interest</span>
                <span className="font-mono font-semibold text-success">${fmt(totalInterest)}</span>
              </div>
              <div className="px-3 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">Return</span>
                <span className="font-mono font-semibold">{totalContribs > 0 ? ((totalInterest / totalContribs) * 100).toFixed(1) : 0}%</span>
              </div>
            </div>

            {table.length > 0 && (
              <div className="max-h-56 overflow-y-auto rounded-lg border border-card-border">
                <table className="w-full text-xs font-mono">
                  <thead className="bg-card sticky top-0">
                    <tr>
                      <th className="px-3 py-2 text-left text-muted">Year</th>
                      <th className="px-3 py-2 text-right text-muted">Contributions</th>
                      <th className="px-3 py-2 text-right text-muted">Interest</th>
                      <th className="px-3 py-2 text-right text-muted">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {table.map(row => (
                      <tr key={row.year} className="border-t border-card-border">
                        <td className="px-3 py-1.5">{row.year}</td>
                        <td className="px-3 py-1.5 text-right">${fmt(row.contributions)}</td>
                        <td className="px-3 py-1.5 text-right text-success">+${fmt(row.interest)}</td>
                        <td className="px-3 py-1.5 text-right font-semibold">${fmt(row.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        <p className="text-xs text-muted">FV = PV × (1 + r/n)^(n×t) + PMT × ((1+r/n)^(n×t) - 1) / (r/n)</p>
      </div>
    </CalculatorShell>
  );
}
