"use client";

import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const ic =
  "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

const usd = (n: number) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

const COMPARISON_TAX_RATE = 0.22; // 22% assumed tax rate for pre-tax equivalent

interface YearRow {
  age: number;
  balance: number;
  contributions: number;
}

export default function RothIRAPage() {
  const [v, setV] = useHashState({
    currentAge: "30",
    retireAge: "65",
    currentBalance: "5000",
    annualContribution: "6000",
    returnRate: "7",
  });

  const currentAge = parseInt(v.currentAge) || 0;
  const retireAge = parseInt(v.retireAge) || 65;
  const currentBalance = parseFloat(v.currentBalance) || 0;
  const annualContribution = parseFloat(v.annualContribution) || 0;
  const returnRate = parseFloat(v.returnRate) / 100;

  const yearsToRetire = retireAge - currentAge;
  const isAge50Plus = currentAge >= 50;
  const maxContribution = isAge50Plus ? 8000 : 7000;
  const cappedContribution = Math.min(annualContribution, maxContribution);

  const valid = yearsToRetire > 0 && returnRate > 0;

  const rows: YearRow[] = [];
  let balance = currentBalance;
  let cumulativeContribs = 0;

  if (valid) {
    for (let y = 0; y < yearsToRetire; y++) {
      balance = balance * (1 + returnRate) + cappedContribution;
      cumulativeContribs += cappedContribution;
      rows.push({
        age: currentAge + y + 1,
        balance,
        contributions: cumulativeContribs + currentBalance,
      });
    }
  }

  const finalBalance = valid && rows.length > 0 ? rows[rows.length - 1].balance : 0;
  const totalContributions = cappedContribution * yearsToRetire;
  const totalGrowth = finalBalance - totalContributions - currentBalance;

  // Pre-tax equivalent: what you'd need in a traditional IRA to have the same after-tax value
  const preTaxEquivalent = finalBalance / (1 - COMPARISON_TAX_RATE);

  // Chart: every year if ≤ 35 years, else every 5
  const chartStep = yearsToRetire > 35 ? 5 : 1;
  const chartData = rows
    .filter((r, i) => (i + 1) % chartStep === 0 || i === rows.length - 1)
    .map((r) => ({
      age: String(r.age),
      balance: Math.round(r.balance),
      contributions: Math.round(r.contributions),
    }));

  return (
    <CalculatorShell
      title="Roth IRA Calculator"
      description="Project your Roth IRA balance at retirement. Contributions are after-tax; withdrawals are tax-free."
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-muted mb-1">Current Age</label>
            <input
              type="number"
              value={v.currentAge}
              onChange={(e) => setV({ currentAge: e.target.value })}
              className={ic}
              min="18"
              max="80"
            />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">
              Retirement Age
            </label>
            <input
              type="number"
              value={v.retireAge}
              onChange={(e) => setV({ retireAge: e.target.value })}
              className={ic}
              min="40"
              max="80"
            />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">
              Current Roth IRA Balance ($)
            </label>
            <input
              type="number"
              value={v.currentBalance}
              onChange={(e) => setV({ currentBalance: e.target.value })}
              className={ic}
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">
              Annual Contribution ($)
            </label>
            <input
              type="number"
              value={v.annualContribution}
              onChange={(e) => setV({ annualContribution: e.target.value })}
              className={ic}
              min="0"
              max={maxContribution}
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm text-muted mb-1">
              Expected Annual Return (%)
            </label>
            <input
              type="number"
              value={v.returnRate}
              onChange={(e) => setV({ returnRate: e.target.value })}
              step="0.5"
              className={ic}
              min="0"
            />
          </div>
        </div>

        {annualContribution > maxContribution && (
          <div className="text-xs text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400 rounded-lg px-3 py-2">
            2024 Roth IRA contribution limit is {usd(maxContribution)}
            {isAge50Plus ? " (age 50+ catch-up)" : ""}. Calculation uses capped amount.
          </div>
        )}

        {valid && (
          <div className="space-y-4">
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="block text-sm text-muted">
                Tax-Free Balance at Retirement (Age {retireAge})
              </span>
              <span className="block font-mono font-bold text-3xl text-primary">
                {usd(finalBalance)}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="px-3 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">
                  Total Contributions
                </span>
                <span className="font-mono font-semibold text-sm">
                  {usd(totalContributions + currentBalance)}
                </span>
              </div>
              <div className="px-3 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">
                  Tax-Free Growth
                </span>
                <span className="font-mono font-semibold text-sm text-green-600">
                  {usd(Math.max(0, totalGrowth))}
                </span>
              </div>
              <div className="px-3 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">
                  Pre-Tax Equiv.
                </span>
                <span className="font-mono font-semibold text-sm">
                  {usd(preTaxEquivalent)}
                </span>
              </div>
            </div>

            {chartData.length > 0 && (
              <div className="bg-background border border-card-border rounded-xl p-4">
                <h3 className="text-sm font-semibold text-muted mb-2 text-center">
                  Balance Growth Over Time
                </h3>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={chartData}>
                    <XAxis
                      dataKey="age"
                      tick={{ fontSize: 10 }}
                      label={{ value: "Age", position: "insideBottomRight", offset: -5, fontSize: 10 }}
                    />
                    <YAxis
                      tick={{ fontSize: 10 }}
                      tickFormatter={(val) =>
                        `$${(val / 1000).toFixed(0)}k`
                      }
                    />
                    <Tooltip formatter={(val) => usd(Number(val))} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Line
                      type="monotone"
                      dataKey="balance"
                      stroke="#2563eb"
                      name="Balance"
                      dot={false}
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="contributions"
                      stroke="#10b981"
                      name="Contributions"
                      dot={false}
                      strokeWidth={2}
                      strokeDasharray="4 2"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            <p className="text-xs text-muted text-center">
              Pre-tax equivalent assumes {(COMPARISON_TAX_RATE * 100).toFixed(0)}% tax rate at withdrawal (for comparison only).
              Roth IRA qualified withdrawals are tax-free.
            </p>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
