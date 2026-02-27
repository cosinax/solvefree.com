"use client";

import { useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const ic =
  "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
const sc =
  "w-full px-3 py-2 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm";

const usd = (n: number) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });

const COMPOUNDING_OPTIONS: { label: string; n: number }[] = [
  { label: "Daily (365)", n: 365 },
  { label: "Monthly (12)", n: 12 },
  { label: "Quarterly (4)", n: 4 },
  { label: "Annually (1)", n: 1 },
];

interface MonthRow {
  month: number;
  balance: number;
  interest: number;
}

interface ChartRow {
  label: string;
  principal: number;
  interest: number;
}

export default function CDCalculatorPage() {
  const [v, setV] = useHashState({
    principal: "10000",
    apy: "5",
    term: "12",
    compounding: "12",
  });
  const [showTable, setShowTable] = useState(false);

  const P = parseFloat(v.principal) || 0;
  const apy = parseFloat(v.apy) || 0;
  const termMonths = Math.min(parseInt(v.term) || 0, 360);
  const n = parseInt(v.compounding) || 12;

  const valid = P > 0 && apy > 0 && termMonths > 0;

  const r = apy / 100;
  const t = termMonths / 12;

  const finalBalance = valid ? P * Math.pow(1 + r / n, n * t) : 0;
  const totalInterest = finalBalance - P;

  // Effective APY: (1 + r/n)^n - 1
  const effectiveAPY = valid ? (Math.pow(1 + r / n, n) - 1) * 100 : 0;

  // Month-by-month table (cap at 60 months for display)
  const months: MonthRow[] = [];
  if (valid) {
    for (let m = 1; m <= termMonths; m++) {
      const tM = m / 12;
      const bal = P * Math.pow(1 + r / n, n * tM);
      months.push({ month: m, balance: bal, interest: bal - P });
    }
  }

  // Chart data: show every month if ≤60, else every quarter
  const chartData: ChartRow[] = [];
  if (valid) {
    const step = termMonths <= 60 ? 1 : Math.ceil(termMonths / 60);
    for (let m = step; m <= termMonths; m += step) {
      const tM = m / 12;
      const bal = P * Math.pow(1 + r / n, n * tM);
      chartData.push({
        label: `Mo ${m}`,
        principal: P,
        interest: parseFloat((bal - P).toFixed(2)),
      });
    }
  }

  return (
    <CalculatorShell
      title="CD Calculator"
      description="Calculate earnings on a Certificate of Deposit with compound interest."
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-muted mb-1">
              Initial Deposit ($)
            </label>
            <input
              type="number"
              value={v.principal}
              onChange={(e) => setV({ principal: e.target.value })}
              className={ic}
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">APY (%)</label>
            <input
              type="number"
              value={v.apy}
              onChange={(e) => setV({ apy: e.target.value })}
              step="0.01"
              className={ic}
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">
              Term (months)
            </label>
            <input
              type="number"
              value={v.term}
              onChange={(e) => setV({ term: e.target.value })}
              className={ic}
              min="1"
              max="360"
            />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Compounding</label>
            <select
              value={v.compounding}
              onChange={(e) => setV({ compounding: e.target.value })}
              className={sc}
            >
              {COMPOUNDING_OPTIONS.map((opt) => (
                <option key={opt.n} value={String(opt.n)}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {valid && (
          <div className="space-y-4">
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="block text-sm text-muted">Final Balance</span>
              <span className="block font-mono font-bold text-3xl text-primary">
                {usd(finalBalance)}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="px-3 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">
                  Interest Earned
                </span>
                <span className="font-mono font-semibold">
                  {usd(totalInterest)}
                </span>
              </div>
              <div className="px-3 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">
                  Effective APY
                </span>
                <span className="font-mono font-semibold">
                  {effectiveAPY.toFixed(3)}%
                </span>
              </div>
              <div className="px-3 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">Return</span>
                <span className="font-mono font-semibold">
                  {((totalInterest / P) * 100).toFixed(2)}%
                </span>
              </div>
            </div>

            {chartData.length > 0 && (
              <div className="bg-background border border-card-border rounded-xl p-4">
                <h3 className="text-sm font-semibold text-muted mb-2 text-center">
                  Balance Over Time
                </h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={chartData}>
                    <XAxis dataKey="label" tick={{ fontSize: 9 }} />
                    <YAxis
                      tick={{ fontSize: 10 }}
                      tickFormatter={(v) =>
                        `$${(v / 1000).toFixed(0)}k`
                      }
                    />
                    <Tooltip
                      formatter={(val) => usd(Number(val))}
                    />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Bar
                      dataKey="principal"
                      fill="#2563eb"
                      name="Principal"
                      stackId="a"
                    />
                    <Bar
                      dataKey="interest"
                      fill="#10b981"
                      name="Interest"
                      stackId="a"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            <button
              onClick={() => setShowTable(!showTable)}
              className="w-full text-sm text-primary font-medium py-2 hover:underline"
            >
              {showTable ? "Hide" : "Show"} Month-by-Month Table
            </button>

            {showTable && (
              <div className="max-h-80 overflow-y-auto rounded-lg border border-card-border">
                <table className="w-full text-xs font-mono">
                  <thead className="bg-card sticky top-0">
                    <tr>
                      <th className="px-2 py-2 text-left text-muted">Month</th>
                      <th className="px-2 py-2 text-right text-muted">
                        Balance
                      </th>
                      <th className="px-2 py-2 text-right text-muted">
                        Interest Earned
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {months.map((row) => (
                      <tr
                        key={row.month}
                        className="border-t border-card-border"
                      >
                        <td className="px-2 py-1.5">{row.month}</td>
                        <td className="px-2 py-1.5 text-right">
                          {usd(row.balance)}
                        </td>
                        <td className="px-2 py-1.5 text-right">
                          {usd(row.interest)}
                        </td>
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
