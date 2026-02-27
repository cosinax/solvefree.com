"use client";

import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

function fmt(n: number): string {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function InvestmentSimulatorPage() {
  const [v, setV] = useHashState({
    initial: "10000",
    monthly: "500",
    return: "8",
    years: "20",
    inflation: "3",
  });

  const P = parseFloat(v.initial), c = parseFloat(v.monthly), r = parseFloat(v.return) / 100, t = parseFloat(v.years), inf = parseFloat(v.inflation) / 100;
  const valid = P >= 0 && r > 0 && t > 0;
  const monthlyRate = r / 12;

  const yearData: { year: number; nominal: number; real: number; contributed: number }[] = [];
  if (valid) {
    let bal = P;
    for (let y = 1; y <= t; y++) {
      for (let m = 0; m < 12; m++) {
        bal = bal * (1 + monthlyRate) + c;
      }
      const contributed = P + c * 12 * y;
      const realValue = bal / Math.pow(1 + inf, y);
      yearData.push({ year: y, nominal: Math.round(bal), real: Math.round(realValue), contributed: Math.round(contributed) });
    }
  }

  const final_ = yearData.length > 0 ? yearData[yearData.length - 1] : null;
  const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

  return (
    <CalculatorShell title="Investment Simulator" description="Model portfolio growth with regular contributions, returns, and inflation adjustment.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-muted mb-1">Initial Investment ($)</label>
            <input type="number" value={v.initial} onChange={(e) => setV({ initial: e.target.value })} className={ic} />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Monthly Contribution ($)</label>
            <input type="number" value={v.monthly} onChange={(e) => setV({ monthly: e.target.value })} className={ic} />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Annual Return (%)</label>
            <input type="number" value={v.return} onChange={(e) => setV({ return: e.target.value })} step="0.1" className={ic} />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Years</label>
            <input type="number" value={v.years} onChange={(e) => setV({ years: e.target.value })} className={ic} />
          </div>
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">Inflation Rate (%)</label>
          <input type="number" value={v.inflation} onChange={(e) => setV({ inflation: e.target.value })} step="0.1" className={ic} />
        </div>

        {final_ && (
          <div className="space-y-4">
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="block text-sm text-muted">Nominal Value</span>
              <span className="block font-mono font-bold text-3xl text-primary">${fmt(final_.nominal)}</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="px-3 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">Real Value</span>
                <span className="font-mono font-semibold text-sm">${fmt(final_.real)}</span>
              </div>
              <div className="px-3 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">Contributed</span>
                <span className="font-mono font-semibold text-sm">${fmt(final_.contributed)}</span>
              </div>
              <div className="px-3 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">Growth</span>
                <span className="font-mono font-semibold text-sm">${fmt(final_.nominal - final_.contributed)}</span>
              </div>
            </div>

            {/* Growth Chart */}
            {yearData.length > 1 && (
              <div className="bg-background border border-card-border rounded-xl p-4">
                <h3 className="text-sm font-semibold text-muted mb-2 text-center">Portfolio Growth</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={yearData}>
                    <XAxis dataKey="year" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(val) => `$${fmt(Number(val))}`} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Area type="monotone" dataKey="nominal" name="Nominal" stroke="#2563eb" fill="#dbeafe" />
                    <Area type="monotone" dataKey="real" name="Real (inflation-adj)" stroke="#f59e0b" fill="#fef3c7" />
                    <Area type="monotone" dataKey="contributed" name="Contributed" stroke="#10b981" fill="#d1fae5" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            <div className="max-h-60 overflow-y-auto rounded-lg border border-card-border">
              <table className="w-full text-xs font-mono">
                <thead className="bg-card sticky top-0">
                  <tr>
                    <th className="px-3 py-2 text-left text-muted">Year</th>
                    <th className="px-3 py-2 text-right text-muted">Contributed</th>
                    <th className="px-3 py-2 text-right text-muted">Nominal</th>
                    <th className="px-3 py-2 text-right text-muted">Real</th>
                  </tr>
                </thead>
                <tbody>
                  {yearData.map((row) => (
                    <tr key={row.year} className="border-t border-card-border">
                      <td className="px-3 py-1.5">{row.year}</td>
                      <td className="px-3 py-1.5 text-right">${fmt(row.contributed)}</td>
                      <td className="px-3 py-1.5 text-right">${fmt(row.nominal)}</td>
                      <td className="px-3 py-1.5 text-right">${fmt(row.real)}</td>
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
