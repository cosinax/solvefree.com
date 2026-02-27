"use client";

import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

function fmt(n: number): string {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const compoundOptions = [
  { label: "Annually", value: "1" },
  { label: "Semi-annually", value: "2" },
  { label: "Quarterly", value: "4" },
  { label: "Monthly", value: "12" },
  { label: "Daily", value: "365" },
];

export default function CompoundInterestPage() {
  const [v, setV] = useHashState({
    principal: "10000",
    rate: "7",
    years: "10",
    compound: "12",
    contribution: "200",
  });

  const P = parseFloat(v.principal), r = parseFloat(v.rate) / 100, t = parseFloat(v.years), n = parseInt(v.compound), c = parseFloat(v.contribution) || 0;
  const valid = P >= 0 && r > 0 && t > 0;

  // Year-by-year breakdown
  const breakdown: { year: number; balance: number; contributed: number }[] = [];
  if (valid) {
    let bal = P;
    // Equivalent monthly rate derived from the selected compounding frequency
    const monthlyRate = Math.pow(1 + r / n, n / 12) - 1;
    for (let y = 1; y <= t; y++) {
      for (let m = 0; m < 12; m++) {
        bal = bal * (1 + monthlyRate) + c;
      }
      breakdown.push({ year: y, balance: Math.round(bal), contributed: Math.round(P + c * 12 * y) });
    }
  }

  const final_ = breakdown.length > 0 ? breakdown[breakdown.length - 1] : null;
  const totalContributed = final_ ? final_.contributed : 0;
  const total = final_ ? final_.balance : 0;
  const totalInterest = total - totalContributed;

  const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

  return (
    <CalculatorShell title="Compound Interest Calculator" description="See how your money grows with compound interest and regular contributions.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-muted mb-1">Initial Investment ($)</label>
            <input type="number" value={v.principal} onChange={(e) => setV({ principal: e.target.value })} className={ic} />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Monthly Contribution ($)</label>
            <input type="number" value={v.contribution} onChange={(e) => setV({ contribution: e.target.value })} className={ic} />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Annual Rate (%)</label>
            <input type="number" value={v.rate} onChange={(e) => setV({ rate: e.target.value })} step="0.1" className={ic} />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Years</label>
            <input type="number" value={v.years} onChange={(e) => setV({ years: e.target.value })} className={ic} />
          </div>
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">Compound Frequency</label>
          <select value={v.compound} onChange={(e) => setV({ compound: e.target.value })}
            className="w-full px-3 py-2.5 bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
            {compoundOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        {valid && final_ && (
          <div className="space-y-4">
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="block text-sm text-muted">Final Balance</span>
              <span className="block font-mono font-bold text-3xl text-primary">${fmt(total)}</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="px-3 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">Total Contributed</span>
                <span className="font-mono font-semibold">${fmt(totalContributed)}</span>
              </div>
              <div className="px-3 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">Interest Earned</span>
                <span className="font-mono font-semibold">${fmt(totalInterest)}</span>
              </div>
              <div className="px-3 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">Return</span>
                <span className="font-mono font-semibold">{totalContributed > 0 ? ((totalInterest / totalContributed) * 100).toFixed(1) : 0}%</span>
              </div>
            </div>

            {/* Growth Chart */}
            {breakdown.length > 1 && (
              <div className="bg-background border border-card-border rounded-xl p-4">
                <h3 className="text-sm font-semibold text-muted mb-2 text-center">Growth Over Time</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={breakdown}>
                    <XAxis dataKey="year" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(val) => `$${fmt(Number(val))}`} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Area type="monotone" dataKey="balance" name="Balance" stroke="#2563eb" fill="#dbeafe" />
                    <Area type="monotone" dataKey="contributed" name="Contributed" stroke="#10b981" fill="#d1fae5" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            {breakdown.length > 0 && (
              <div className="max-h-48 overflow-y-auto rounded-lg border border-card-border">
                <table className="w-full text-xs font-mono">
                  <thead className="bg-card sticky top-0">
                    <tr>
                      <th className="px-3 py-2 text-left text-muted">Year</th>
                      <th className="px-3 py-2 text-right text-muted">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {breakdown.map((row) => (
                      <tr key={row.year} className="border-t border-card-border">
                        <td className="px-3 py-1.5">{row.year}</td>
                        <td className="px-3 py-1.5 text-right">${fmt(row.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
