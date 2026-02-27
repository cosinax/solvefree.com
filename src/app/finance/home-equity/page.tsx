"use client";

import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
const usd = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });

interface YearPoint {
  year: number;
  homeValue: number;
  loanBalance: number;
  equity: number;
}

function buildEquitySchedule(
  purchasePrice: number,
  loanAmount: number,
  annualRate: number,
  termYears: number,
  appreciationRate: number,
  maxYears: number
): YearPoint[] {
  const r = annualRate / 100 / 12;
  const n = termYears * 12;
  const monthly =
    r > 0 && n > 0
      ? (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
      : loanAmount / n;

  const points: YearPoint[] = [];

  for (let yr = 0; yr <= Math.min(maxYears, termYears); yr++) {
    const homeValue = purchasePrice * Math.pow(1 + appreciationRate / 100, yr);

    // Remaining balance after yr * 12 payments
    let bal = loanAmount;
    for (let m = 0; m < yr * 12 && bal > 0.005; m++) {
      const intCharge = bal * r;
      const princ = monthly - intCharge;
      bal = Math.max(bal - princ, 0);
    }
    const equity = homeValue - bal;
    points.push({ year: yr, homeValue, loanBalance: bal, equity });
  }

  return points;
}

export default function HomeEquityPage() {
  const [v, setV] = useHashState({
    purchasePrice: "400000",
    downPayment: "80000",
    mortgageRate: "6.5",
    loanTerm: "30",
    yearsOwned: "5",
    appreciationRate: "3",
  });

  const purchasePrice = parseFloat(v.purchasePrice) || 0;
  const downPayment = parseFloat(v.downPayment) || 0;
  const mortgageRate = parseFloat(v.mortgageRate) || 0;
  const loanTerm = parseInt(v.loanTerm) || 30;
  const yearsOwned = parseInt(v.yearsOwned) || 0;
  const appreciationRate = parseFloat(v.appreciationRate) || 3;

  const loanAmount = Math.max(purchasePrice - downPayment, 0);
  const valid = purchasePrice > 0 && loanAmount > 0;

  const schedule = valid ? buildEquitySchedule(purchasePrice, loanAmount, mortgageRate, loanTerm, appreciationRate, loanTerm) : [];

  const currentPoint = schedule[Math.min(yearsOwned, schedule.length - 1)] ?? null;
  const currentHomeValue = currentPoint?.homeValue ?? 0;
  const remainingBalance = currentPoint?.loanBalance ?? 0;
  const equity = currentPoint?.equity ?? 0;
  const equityPct = currentHomeValue > 0 ? (equity / currentHomeValue) * 100 : 0;
  const ltv = currentHomeValue > 0 ? (remainingBalance / currentHomeValue) * 100 : 0;

  const chartData = schedule.map((p) => ({
    year: p.year,
    Equity: Math.round(p.equity),
    "Loan Balance": Math.round(p.loanBalance),
  }));

  return (
    <CalculatorShell
      title="Home Equity Calculator"
      description="See how your home equity grows over time through loan paydown and appreciation."
    >
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-muted mb-1">Purchase Price ($)</label>
            <input type="number" value={v.purchasePrice} onChange={(e) => setV({ purchasePrice: e.target.value })} className={ic} min="0" />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Down Payment ($)</label>
            <input type="number" value={v.downPayment} onChange={(e) => setV({ downPayment: e.target.value })} className={ic} min="0" />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Mortgage Rate (%)</label>
            <input type="number" value={v.mortgageRate} onChange={(e) => setV({ mortgageRate: e.target.value })} className={ic} step="0.01" />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Loan Term (years)</label>
            <input type="number" value={v.loanTerm} onChange={(e) => setV({ loanTerm: e.target.value })} className={ic} min="1" />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Appreciation Rate (%/yr)</label>
            <input type="number" value={v.appreciationRate} onChange={(e) => setV({ appreciationRate: e.target.value })} className={ic} step="0.1" />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Years Owned: {v.yearsOwned}</label>
            <input
              type="range"
              min="0"
              max={loanTerm}
              value={v.yearsOwned}
              onChange={(e) => setV({ yearsOwned: e.target.value })}
              className="w-full accent-primary"
            />
          </div>
        </div>

        {valid && currentPoint && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-primary-light rounded-lg p-3 text-center">
                <span className="block text-xs text-muted">Current Home Value</span>
                <span className="font-mono font-semibold">{usd(currentHomeValue)}</span>
              </div>
              <div className="bg-primary-light rounded-lg p-3 text-center">
                <span className="block text-xs text-muted">Remaining Balance</span>
                <span className="font-mono font-semibold">{usd(remainingBalance)}</span>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                <span className="block text-xs text-muted">Your Equity</span>
                <span className="font-mono font-bold text-green-700">{usd(equity)}</span>
              </div>
              <div className="bg-primary-light rounded-lg p-3 text-center">
                <span className="block text-xs text-muted">Equity %</span>
                <span className="font-mono font-semibold">{equityPct.toFixed(1)}%</span>
              </div>
            </div>

            <div className="bg-primary-light rounded-lg px-4 py-3 flex justify-between items-center text-sm">
              <span className="text-muted">Loan-to-Value (LTV)</span>
              <span className={`font-mono font-semibold ${ltv > 80 ? "text-red-600" : ltv > 60 ? "text-yellow-600" : "text-green-700"}`}>
                {ltv.toFixed(1)}%
              </span>
            </div>

            {/* Area Chart */}
            {chartData.length > 1 && (
              <div className="bg-background border border-card-border rounded-xl p-4">
                <h3 className="text-sm font-semibold text-muted mb-3 text-center">Equity vs Loan Balance Over Time</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={chartData}>
                    <XAxis dataKey="year" tick={{ fontSize: 10 }} label={{ value: "Year", position: "insideBottom", offset: -2, fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} tickFormatter={(val: number) => `$${(val / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(val) => val != null ? usd(Number(val)) : ""} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Area type="monotone" dataKey="Equity" stackId="1" stroke="#10b981" fill="#d1fae5" name="Equity" />
                    <Area type="monotone" dataKey="Loan Balance" stackId="1" stroke="#2563eb" fill="#dbeafe" name="Loan Balance" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
