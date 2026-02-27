"use client";

import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useState } from "react";

function fmt(n: number): string {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const COLORS = ["#2563eb", "#f59e0b", "#10b981"];

export default function MortgagePage() {
  const [v, setV] = useHashState({
    price: "300000",
    down: "60000",
    rate: "6.5",
    years: "30",
  });
  const [showAmort, setShowAmort] = useState(false);

  const P = parseFloat(v.price) - parseFloat(v.down || "0");
  const r = parseFloat(v.rate) / 100 / 12;
  const n = parseFloat(v.years) * 12;
  const valid = P > 0 && r > 0 && n > 0;

  const monthly = valid ? (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : 0;
  const totalPaid = monthly * n;
  const totalInterest = totalPaid - P;

  // Amortization + yearly data for chart
  const amortization: { month: number; payment: number; principal: number; interest: number; balance: number }[] = [];
  const yearlyData: { year: number; principal: number; interest: number; balance: number }[] = [];
  if (valid) {
    let bal = P;
    let yearPrinc = 0, yearInt = 0;
    for (let i = 1; i <= n; i++) {
      const intPmt = bal * r;
      const prinPmt = monthly - intPmt;
      bal -= prinPmt;
      yearPrinc += prinPmt;
      yearInt += intPmt;
      if (showAmort) {
        amortization.push({ month: i, payment: monthly, principal: prinPmt, interest: intPmt, balance: Math.max(bal, 0) });
      }
      if (i % 12 === 0) {
        yearlyData.push({ year: i / 12, principal: yearPrinc, interest: yearInt, balance: Math.max(bal, 0) });
        yearPrinc = 0;
        yearInt = 0;
      }
    }
  }

  const pieData = valid ? [
    { name: "Principal", value: P },
    { name: "Interest", value: totalInterest },
    { name: "Down Payment", value: parseFloat(v.down || "0") },
  ].filter(d => d.value > 0) : [];

  const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

  return (
    <CalculatorShell title="Mortgage Calculator" description="Calculate monthly payments, total interest, and view amortization schedule.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-muted mb-1">Home Price ($)</label>
            <input type="number" value={v.price} onChange={(e) => setV({ price: e.target.value })} className={ic} />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Down Payment ($)</label>
            <input type="number" value={v.down} onChange={(e) => setV({ down: e.target.value })} className={ic} />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Interest Rate (%)</label>
            <input type="number" value={v.rate} onChange={(e) => setV({ rate: e.target.value })} step="0.1" className={ic} />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Loan Term (years)</label>
            <input type="number" value={v.years} onChange={(e) => setV({ years: e.target.value })} className={ic} />
          </div>
        </div>

        {valid && (
          <div className="space-y-4">
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="block text-sm text-muted">Monthly Payment</span>
              <span className="block font-mono font-bold text-3xl text-primary">${fmt(monthly)}</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="px-3 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">Loan Amount</span>
                <span className="font-mono font-semibold">${fmt(P)}</span>
              </div>
              <div className="px-3 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">Total Interest</span>
                <span className="font-mono font-semibold">${fmt(totalInterest)}</span>
              </div>
              <div className="px-3 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">Total Paid</span>
                <span className="font-mono font-semibold">${fmt(totalPaid)}</span>
              </div>
            </div>

            {/* Pie Chart */}
            {pieData.length > 0 && (
              <div className="bg-background border border-card-border rounded-xl p-4">
                <h3 className="text-sm font-semibold text-muted mb-2 text-center">Cost Breakdown</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}>
                      {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(val) => `$${fmt(Number(val))}`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Yearly Bar Chart */}
            {yearlyData.length > 0 && yearlyData.length <= 40 && (
              <div className="bg-background border border-card-border rounded-xl p-4">
                <h3 className="text-sm font-semibold text-muted mb-2 text-center">Annual Principal vs Interest</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={yearlyData}>
                    <XAxis dataKey="year" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(val) => `$${fmt(Number(val))}`} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Bar dataKey="principal" fill="#2563eb" name="Principal" stackId="a" />
                    <Bar dataKey="interest" fill="#f59e0b" name="Interest" stackId="a" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            <button onClick={() => setShowAmort(!showAmort)}
              className="w-full text-sm text-primary font-medium py-2 hover:underline">
              {showAmort ? "Hide" : "Show"} Amortization Schedule
            </button>

            {showAmort && (
              <div className="max-h-80 overflow-y-auto rounded-lg border border-card-border">
                <table className="w-full text-xs font-mono">
                  <thead className="bg-card sticky top-0">
                    <tr>
                      <th className="px-2 py-2 text-left text-muted">#</th>
                      <th className="px-2 py-2 text-right text-muted">Payment</th>
                      <th className="px-2 py-2 text-right text-muted">Principal</th>
                      <th className="px-2 py-2 text-right text-muted">Interest</th>
                      <th className="px-2 py-2 text-right text-muted">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {amortization.map((row) => (
                      <tr key={row.month} className="border-t border-card-border">
                        <td className="px-2 py-1.5">{row.month}</td>
                        <td className="px-2 py-1.5 text-right">${fmt(row.payment)}</td>
                        <td className="px-2 py-1.5 text-right">${fmt(row.principal)}</td>
                        <td className="px-2 py-1.5 text-right">${fmt(row.interest)}</td>
                        <td className="px-2 py-1.5 text-right">${fmt(row.balance)}</td>
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
