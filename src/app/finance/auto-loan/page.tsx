"use client";

import { useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";

function fmt(n: number): string {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function AutoLoanPage() {
  const [price, setPrice] = useState("35000");
  const [down, setDown] = useState("5000");
  const [tradeIn, setTradeIn] = useState("0");
  const [rate, setRate] = useState("5.9");
  const [months, setMonths] = useState("60");

  const P = parseFloat(price) - parseFloat(down || "0") - parseFloat(tradeIn || "0");
  const r = parseFloat(rate) / 100 / 12;
  const n = parseInt(months);
  const valid = P > 0 && r > 0 && n > 0;
  const monthly = valid ? (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : 0;
  const totalPaid = monthly * n;
  const totalInterest = totalPaid - P;

  const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

  return (
    <CalculatorShell title="Auto Loan Calculator" description="Calculate monthly car payments with down payment and trade-in value.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-muted mb-1">Vehicle Price ($)</label>
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className={ic} />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Down Payment ($)</label>
            <input type="number" value={down} onChange={(e) => setDown(e.target.value)} className={ic} />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Trade-in Value ($)</label>
            <input type="number" value={tradeIn} onChange={(e) => setTradeIn(e.target.value)} className={ic} />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Interest Rate (%)</label>
            <input type="number" value={rate} onChange={(e) => setRate(e.target.value)} step="0.1" className={ic} />
          </div>
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">Loan Term (months)</label>
          <div className="grid grid-cols-4 gap-2">
            {[24, 36, 48, 60, 72, 84].map((m) => (
              <button key={m} onClick={() => setMonths(m.toString())}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${parseInt(months) === m ? "bg-primary text-white" : "bg-background border border-card-border hover:bg-primary-light"}`}>
                {m} mo
              </button>
            ))}
          </div>
        </div>
        {valid && (
          <div className="space-y-3">
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="block text-sm text-muted">Monthly Payment</span>
              <span className="block font-mono font-bold text-3xl text-primary">${fmt(monthly)}</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="px-3 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">Loan Amount</span>
                <span className="font-mono font-semibold text-sm">${fmt(P)}</span>
              </div>
              <div className="px-3 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">Total Interest</span>
                <span className="font-mono font-semibold text-sm">${fmt(totalInterest)}</span>
              </div>
              <div className="px-3 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">Total Cost</span>
                <span className="font-mono font-semibold text-sm">${fmt(totalPaid)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
