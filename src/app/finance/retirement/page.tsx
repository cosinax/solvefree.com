"use client";

import { useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";

function fmt(n: number): string {
  return n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

export default function RetirementPage() {
  const [age, setAge] = useState("30");
  const [retireAge, setRetireAge] = useState("65");
  const [saved, setSaved] = useState("50000");
  const [monthly, setMonthly] = useState("1000");
  const [returnRate, setReturnRate] = useState("7");
  const [withdrawRate, setWithdrawRate] = useState("4");

  const yearsToRetire = parseInt(retireAge) - parseInt(age);
  const r = parseFloat(returnRate) / 100 / 12;
  const S = parseFloat(saved), c = parseFloat(monthly);
  const valid = yearsToRetire > 0 && S >= 0 && r > 0;

  let balance = S;
  if (valid) {
    for (let i = 0; i < yearsToRetire * 12; i++) {
      balance = balance * (1 + r) + c;
    }
  }

  const annualWithdrawal = balance * (parseFloat(withdrawRate) / 100);
  const monthlyIncome = annualWithdrawal / 12;
  const totalContributed = S + c * 12 * yearsToRetire;

  const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

  return (
    <CalculatorShell title="Retirement Calculator" description="Estimate your retirement savings and monthly income.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-muted mb-1">Current Age</label>
            <input type="number" value={age} onChange={(e) => setAge(e.target.value)} className={ic} />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Retirement Age</label>
            <input type="number" value={retireAge} onChange={(e) => setRetireAge(e.target.value)} className={ic} />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Current Savings ($)</label>
            <input type="number" value={saved} onChange={(e) => setSaved(e.target.value)} className={ic} />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Monthly Contribution ($)</label>
            <input type="number" value={monthly} onChange={(e) => setMonthly(e.target.value)} className={ic} />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Annual Return (%)</label>
            <input type="number" value={returnRate} onChange={(e) => setReturnRate(e.target.value)} step="0.1" className={ic} />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Withdrawal Rate (%)</label>
            <input type="number" value={withdrawRate} onChange={(e) => setWithdrawRate(e.target.value)} step="0.5" className={ic} />
          </div>
        </div>
        {valid && (
          <div className="space-y-3">
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="block text-sm text-muted">Retirement Savings</span>
              <span className="block font-mono font-bold text-3xl text-primary">${fmt(balance)}</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="px-3 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">Monthly Income</span>
                <span className="font-mono font-semibold">${fmt(monthlyIncome)}</span>
              </div>
              <div className="px-3 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">Contributed</span>
                <span className="font-mono font-semibold">${fmt(totalContributed)}</span>
              </div>
              <div className="px-3 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">Years</span>
                <span className="font-mono font-semibold">{yearsToRetire}</span>
              </div>
            </div>
            <p className="text-xs text-muted text-center">Based on {withdrawRate}% safe withdrawal rate</p>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
