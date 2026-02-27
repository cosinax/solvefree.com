"use client";

import { useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";

function fmt(n: number): string {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function DebtPayoffPage() {
  const [balance, setBalance] = useState("15000");
  const [rate, setRate] = useState("18");
  const [payment, setPayment] = useState("500");

  const B = parseFloat(balance), r = parseFloat(rate) / 100 / 12, pmt = parseFloat(payment);
  const valid = B > 0 && r > 0 && pmt > B * r;

  let months = 0, totalPaid = 0, bal = B;
  if (valid) {
    while (bal > 0 && months < 600) {
      const interest = bal * r;
      const princ = Math.min(pmt - interest, bal);
      bal -= princ;
      totalPaid += pmt;
      months++;
      if (bal <= 0.01) break;
    }
  }
  const totalInterest = totalPaid - B;
  const years = Math.floor(months / 12);
  const remMonths = months % 12;

  const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

  return (
    <CalculatorShell title="Debt Payoff Calculator" description="Plan your debt repayment and see how fast you can be debt-free.">
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-muted mb-1">Current Balance ($)</label>
          <input type="number" value={balance} onChange={(e) => setBalance(e.target.value)} className={ic} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-muted mb-1">Interest Rate (%)</label>
            <input type="number" value={rate} onChange={(e) => setRate(e.target.value)} step="0.1" className={ic} />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Monthly Payment ($)</label>
            <input type="number" value={payment} onChange={(e) => setPayment(e.target.value)} className={ic} />
          </div>
        </div>
        {valid && months < 600 ? (
          <div className="space-y-3">
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="block text-sm text-muted">Debt Free In</span>
              <span className="block font-mono font-bold text-3xl text-primary">
                {years > 0 ? `${years}y ` : ""}{remMonths}m
              </span>
              <span className="block text-xs text-muted">({months} months)</span>
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
        ) : B > 0 && pmt > 0 && pmt <= B * r ? (
          <div className="text-center text-danger text-sm font-medium p-4">
            Payment is too low to cover interest. Minimum payment: ${fmt(B * r + 1)}
          </div>
        ) : null}
      </div>
    </CalculatorShell>
  );
}
