"use client";

import { useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";

function fmt(n: number): string {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function InflationPage() {
  const [amount, setAmount] = useState("100");
  const [rate, setRate] = useState("3");
  const [years, setYears] = useState("10");

  const a = parseFloat(amount), r = parseFloat(rate) / 100, y = parseFloat(years);
  const valid = a > 0 && r > 0 && y > 0;
  const futureValue = a * Math.pow(1 + r, y);
  const purchasingPower = a / Math.pow(1 + r, y);
  const lostPower = a - purchasingPower;

  const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

  return (
    <CalculatorShell title="Inflation Calculator" description="See how inflation affects purchasing power over time.">
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-muted mb-1">Amount ($)</label>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className={ic} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-muted mb-1">Inflation Rate (%)</label>
            <input type="number" value={rate} onChange={(e) => setRate(e.target.value)} step="0.1" className={ic} />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Years</label>
            <input type="number" value={years} onChange={(e) => setYears(e.target.value)} className={ic} />
          </div>
        </div>
        {valid && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="px-4 py-4 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted mb-1">To buy the same things in {years} years</span>
                <span className="font-mono font-bold text-xl">${fmt(futureValue)}</span>
              </div>
              <div className="px-4 py-4 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted mb-1">${amount} today is worth in {years} years</span>
                <span className="font-mono font-bold text-xl">${fmt(purchasingPower)}</span>
              </div>
            </div>
            <div className="text-center text-sm text-muted">
              Purchasing power lost: <span className="font-mono font-semibold text-danger">${fmt(lostPower)}</span> ({((lostPower / a) * 100).toFixed(1)}%)
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
