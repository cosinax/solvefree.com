"use client";

import { useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";

function fmt(n: number): string {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function SavingsGoalPage() {
  const [goal, setGoal] = useState("10000");
  const [current, setCurrent] = useState("1000");
  const [months, setMonths] = useState("24");
  const [rate, setRate] = useState("4");

  const G = parseFloat(goal), C = parseFloat(current), m = parseInt(months), r = parseFloat(rate) / 100 / 12;
  const valid = G > C && C >= 0 && m > 0;

  // With interest: FV = C*(1+r)^m + PMT*((1+r)^m - 1)/r = G => PMT = (G - C*(1+r)^m) / (((1+r)^m - 1)/r)
  const compFactor = Math.pow(1 + r, m);
  const monthlyNeeded = r > 0
    ? (G - C * compFactor) / ((compFactor - 1) / r)
    : (G - C) / m;
  const totalSaved = monthlyNeeded * m + C;
  const interestEarned = G - totalSaved;

  const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

  return (
    <CalculatorShell title="Savings Goal Calculator" description="How much to save each month to reach your goal.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-muted mb-1">Savings Goal ($)</label>
            <input type="number" value={goal} onChange={(e) => setGoal(e.target.value)} className={ic} />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Current Savings ($)</label>
            <input type="number" value={current} onChange={(e) => setCurrent(e.target.value)} className={ic} />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Time Frame (months)</label>
            <input type="number" value={months} onChange={(e) => setMonths(e.target.value)} className={ic} />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Annual Interest (%)</label>
            <input type="number" value={rate} onChange={(e) => setRate(e.target.value)} step="0.1" className={ic} />
          </div>
        </div>
        {valid && monthlyNeeded > 0 && (
          <div className="space-y-3">
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="block text-sm text-muted">Save Per Month</span>
              <span className="block font-mono font-bold text-3xl text-primary">${fmt(monthlyNeeded)}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="px-4 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">Total You Save</span>
                <span className="font-mono font-semibold">${fmt(totalSaved)}</span>
              </div>
              <div className="px-4 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">Interest Earned</span>
                <span className="font-mono font-semibold">${fmt(interestEarned)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
