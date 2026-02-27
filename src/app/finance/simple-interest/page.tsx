"use client";

import { useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";

function fmt(n: number): string {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function SimpleInterestPage() {
  const [principal, setPrincipal] = useState("10000");
  const [rate, setRate] = useState("5");
  const [time, setTime] = useState("3");

  const P = parseFloat(principal), r = parseFloat(rate) / 100, t = parseFloat(time);
  const valid = P > 0 && r > 0 && t > 0;
  const interest = P * r * t;
  const total = P + interest;

  const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

  return (
    <CalculatorShell title="Simple Interest Calculator" description="Calculate simple interest: I = P × r × t">
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-muted mb-1">Principal ($)</label>
          <input type="number" value={principal} onChange={(e) => setPrincipal(e.target.value)} className={ic} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-muted mb-1">Annual Rate (%)</label>
            <input type="number" value={rate} onChange={(e) => setRate(e.target.value)} step="0.1" className={ic} />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Time (years)</label>
            <input type="number" value={time} onChange={(e) => setTime(e.target.value)} className={ic} />
          </div>
        </div>
        {valid && (
          <div className="grid grid-cols-2 gap-3">
            <div className="px-4 py-3 bg-primary-light rounded-lg text-center">
              <span className="block text-xs text-muted">Interest Earned</span>
              <span className="font-mono font-bold text-xl">${fmt(interest)}</span>
            </div>
            <div className="px-4 py-3 bg-primary-light rounded-lg text-center">
              <span className="block text-xs text-muted">Total Amount</span>
              <span className="font-mono font-bold text-xl">${fmt(total)}</span>
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
