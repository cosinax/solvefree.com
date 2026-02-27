"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

function fmt(n: number): string {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const HOURS_PER_YEAR = 2080; // 52 weeks * 40 hours
const WEEKS_PER_YEAR = 52;

export default function PayRaisePage() {
  const [v, setV] = useHashState({
    currentSalary: "60000",
    raiseType: "percent",
    raiseAmount: "5",
  });
  const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
  const sc = "w-full px-3 py-2.5 bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

  const current = parseFloat(v.currentSalary);
  const raiseAmt = parseFloat(v.raiseAmount);
  const valid = !isNaN(current) && current > 0 && !isNaN(raiseAmt) && raiseAmt >= 0;

  let newSalary = 0;
  let raiseDollars = 0;
  let raisePercent = 0;
  if (valid) {
    if (v.raiseType === "percent") {
      raiseDollars = current * (raiseAmt / 100);
      raisePercent = raiseAmt;
      newSalary = current + raiseDollars;
    } else {
      raiseDollars = raiseAmt;
      raisePercent = (raiseAmt / current) * 100;
      newSalary = current + raiseDollars;
    }
  }

  const monthlyDiff  = raiseDollars / 12;
  const weeklyDiff   = raiseDollars / WEEKS_PER_YEAR;
  const hourlyDiff   = raiseDollars / HOURS_PER_YEAR;

  return (
    <CalculatorShell title="Pay Raise Calculator" description="Calculate your new salary after a raise and see the difference across pay periods.">
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-muted mb-1">Current Annual Salary ($)</label>
          <input type="number" value={v.currentSalary} onChange={e => setV({ currentSalary: e.target.value })} className={ic} min="0" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-muted mb-1">Raise Type</label>
            <select value={v.raiseType} onChange={e => setV({ raiseType: e.target.value })} className={sc}>
              <option value="percent">Percentage (%)</option>
              <option value="dollar">Fixed Amount ($)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Raise {v.raiseType === "percent" ? "(%)" : "($)"}</label>
            <input type="number" value={v.raiseAmount} onChange={e => setV({ raiseAmount: e.target.value })} className={ic} min="0" step={v.raiseType === "percent" ? "0.1" : "100"} />
          </div>
        </div>

        {valid && (
          <div className="space-y-3">
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="block text-sm text-muted">New Annual Salary</span>
              <span className="block font-mono font-bold text-4xl text-primary">${fmt(newSalary)}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="px-3 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">Raise Amount</span>
                <span className="font-mono font-semibold text-success">+${fmt(raiseDollars)}</span>
              </div>
              <div className="px-3 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">Raise Percentage</span>
                <span className="font-mono font-semibold text-success">+{raisePercent.toFixed(2)}%</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-muted">Pay Difference by Period</p>
              {[
                { label: "Monthly", diff: monthlyDiff, old: current / 12, new_: newSalary / 12 },
                { label: "Weekly",  diff: weeklyDiff,  old: current / WEEKS_PER_YEAR, new_: newSalary / WEEKS_PER_YEAR },
                { label: "Hourly",  diff: hourlyDiff,  old: current / HOURS_PER_YEAR, new_: newSalary / HOURS_PER_YEAR },
              ].map(row => (
                <div key={row.label} className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
                  <span className="text-muted">{row.label}</span>
                  <span>${fmt(row.old)}</span>
                  <span className="text-success">→ ${fmt(row.new_)}</span>
                  <span className="text-success">+${fmt(row.diff)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
