"use client";

import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";
import { useMemo } from "react";

const inp =
  "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm";

function fmt(n: number, decimals = 2) {
  if (!isFinite(n)) return "—";
  return n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

function usd(n: number) {
  return "$" + fmt(n, 2);
}

export default function BusinessLoanPage() {
  const [v, setV] = useHashState({
    amount: "50000",
    rate: "7.5",
    years: "5",
    schedule: "false",
  });

  const result = useMemo(() => {
    const P = parseFloat(v.amount) || 0;
    const r = parseFloat(v.rate) / 100 / 12;
    const n = (parseFloat(v.years) || 0) * 12;
    if (P <= 0 || r <= 0 || n <= 0) return null;
    const monthly = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = monthly * n;
    const totalInterest = totalPayment - P;

    // Amortization schedule
    let balance = P;
    const schedule: { month: number; payment: number; principal: number; interest: number; balance: number }[] = [];
    for (let i = 1; i <= n; i++) {
      const interestPmt = balance * r;
      const principalPmt = monthly - interestPmt;
      balance = Math.max(0, balance - principalPmt);
      schedule.push({ month: i, payment: monthly, principal: principalPmt, interest: interestPmt, balance });
    }

    return { monthly, totalPayment, totalInterest, schedule };
  }, [v]);

  return (
    <CalculatorShell
      title="Business Loan Calculator"
      description="Calculate monthly payments, total interest, and amortization for business loans."
    >
      <div className="space-y-6">
        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-muted mb-1">Loan Amount ($)</label>
            <input type="number" value={v.amount} onChange={e => setV({ amount: e.target.value })} className={inp} min="0" />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Annual Interest Rate (%)</label>
            <input type="number" value={v.rate} onChange={e => setV({ rate: e.target.value })} className={inp} step="0.1" />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Loan Term (years)</label>
            <input type="number" value={v.years} onChange={e => setV({ years: e.target.value })} className={inp} min="1" max="30" step="1" />
          </div>
        </div>

        {/* Results */}
        {result ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { label: "Monthly Payment", value: usd(result.monthly), highlight: true },
                { label: "Total Interest", value: usd(result.totalInterest) },
                { label: "Total Cost", value: usd(result.totalPayment) },
              ].map(({ label, value, highlight }) => (
                <div key={label} className={`p-4 rounded-lg border ${highlight ? "bg-primary-light border-primary/20" : "bg-card border-card-border"}`}>
                  <div className="text-xs text-muted mb-1">{label}</div>
                  <div className="font-mono text-xl font-bold">{value}</div>
                </div>
              ))}
            </div>

            {/* Interest vs principal bar */}
            <div>
              <div className="flex justify-between text-xs text-muted mb-1">
                <span>Principal {fmt((parseFloat(v.amount) / result.totalPayment) * 100, 1)}%</span>
                <span>Interest {fmt((result.totalInterest / result.totalPayment) * 100, 1)}%</span>
              </div>
              <div className="h-3 bg-card-border rounded-full overflow-hidden flex">
                <div
                  className="h-full bg-primary rounded-l-full"
                  style={{ width: `${(parseFloat(v.amount) / result.totalPayment) * 100}%` }}
                />
                <div className="h-full bg-orange-400 flex-1 rounded-r-full" />
              </div>
            </div>

            {/* Amortization toggle */}
            <button
              onClick={() => setV({ schedule: v.schedule === "true" ? "false" : "true" })}
              className="text-sm text-primary hover:underline"
            >
              {v.schedule === "true" ? "Hide" : "Show"} amortization schedule
            </button>

            {v.schedule === "true" && (
              <div className="overflow-x-auto max-h-80 overflow-y-auto border border-card-border rounded-lg">
                <table className="w-full text-xs">
                  <thead className="sticky top-0 bg-card border-b border-card-border">
                    <tr className="text-left text-muted">
                      <th className="px-3 py-2 font-medium">Month</th>
                      <th className="px-3 py-2 font-medium">Payment</th>
                      <th className="px-3 py-2 font-medium">Principal</th>
                      <th className="px-3 py-2 font-medium">Interest</th>
                      <th className="px-3 py-2 font-medium">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.schedule.map(row => (
                      <tr key={row.month} className="border-b border-card-border/50 last:border-0">
                        <td className="px-3 py-1.5">{row.month}</td>
                        <td className="px-3 py-1.5 font-mono">{usd(row.payment)}</td>
                        <td className="px-3 py-1.5 font-mono text-primary">{usd(row.principal)}</td>
                        <td className="px-3 py-1.5 font-mono text-orange-500">{usd(row.interest)}</td>
                        <td className="px-3 py-1.5 font-mono">{usd(row.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        ) : (
          <div className="text-muted text-sm">Enter loan details above to see results.</div>
        )}
      </div>
    </CalculatorShell>
  );
}
