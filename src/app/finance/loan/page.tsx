"use client";

import { useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";

function fmt(n: number): string {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function LoanPage() {
  const [amount, setAmount] = useState("25000");
  const [rate, setRate] = useState("7");
  const [years, setYears] = useState("5");

  const P = parseFloat(amount), r = parseFloat(rate) / 100 / 12, n = parseFloat(years) * 12;
  const valid = P > 0 && r > 0 && n > 0;
  const monthly = valid ? (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : 0;
  const totalPaid = monthly * n;
  const totalInterest = totalPaid - P;

  const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

  return (
    <CalculatorShell title="Loan Calculator" description="Calculate loan payments and total cost of borrowing.">
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-muted mb-1">Loan Amount ($)</label>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className={ic} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-muted mb-1">Interest Rate (%)</label>
            <input type="number" value={rate} onChange={(e) => setRate(e.target.value)} step="0.1" className={ic} />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Loan Term (years)</label>
            <input type="number" value={years} onChange={(e) => setYears(e.target.value)} className={ic} />
          </div>
        </div>
        {valid && (
          <div className="space-y-3">
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="block text-sm text-muted">Monthly Payment</span>
              <span className="block font-mono font-bold text-3xl text-primary">${fmt(monthly)}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="px-4 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">Total Interest</span>
                <span className="font-mono font-semibold">${fmt(totalInterest)}</span>
              </div>
              <div className="px-4 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">Total Paid</span>
                <span className="font-mono font-semibold">${fmt(totalPaid)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
