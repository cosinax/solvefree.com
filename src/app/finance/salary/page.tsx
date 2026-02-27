"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

function fmt(n: number): string {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const periods = [
  { label: "Hourly", value: "hourly" },
  { label: "Daily", value: "daily" },
  { label: "Weekly", value: "weekly" },
  { label: "Biweekly", value: "biweekly" },
  { label: "Monthly", value: "monthly" },
  { label: "Annually", value: "annually" },
];

// Assumptions: 8h/day, 5d/week, 52 weeks/year
const HOURS_PER_DAY = 8;
const DAYS_PER_WEEK = 5;
const WEEKS_PER_YEAR = 52;

function toAnnual(amount: number, period: string): number {
  switch (period) {
    case "hourly":   return amount * HOURS_PER_DAY * DAYS_PER_WEEK * WEEKS_PER_YEAR;
    case "daily":    return amount * DAYS_PER_WEEK * WEEKS_PER_YEAR;
    case "weekly":   return amount * WEEKS_PER_YEAR;
    case "biweekly": return amount * 26;
    case "monthly":  return amount * 12;
    case "annually": return amount;
    default:         return amount;
  }
}

export default function SalaryPage() {
  const [v, setV] = useHashState({ amount: "50000", period: "annually" });
  const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
  const sc = "w-full px-3 py-2.5 bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

  const amount = parseFloat(v.amount);
  const valid = !isNaN(amount) && amount >= 0;
  const annual = valid ? toAnnual(amount, v.period) : 0;

  const conversions = [
    { label: "Hourly",    value: annual / (WEEKS_PER_YEAR * DAYS_PER_WEEK * HOURS_PER_DAY) },
    { label: "Daily",     value: annual / (WEEKS_PER_YEAR * DAYS_PER_WEEK) },
    { label: "Weekly",    value: annual / WEEKS_PER_YEAR },
    { label: "Biweekly",  value: annual / 26 },
    { label: "Monthly",   value: annual / 12 },
    { label: "Annually",  value: annual },
  ];

  return (
    <CalculatorShell title="Salary Calculator" description="Convert between hourly, daily, weekly, biweekly, monthly, and annual pay.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-muted mb-1">Amount</label>
            <input type="number" value={v.amount} onChange={e => setV({ amount: e.target.value })} className={ic} min="0" />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Pay Period</label>
            <select value={v.period} onChange={e => setV({ period: e.target.value })} className={sc}>
              {periods.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>
          </div>
        </div>

        {valid && annual > 0 && (
          <div className="space-y-3">
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="block text-sm text-muted">Annual Salary</span>
              <span className="block font-mono font-bold text-4xl text-primary">${fmt(annual)}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {conversions.map(c => (
                <div key={c.label} className="flex justify-between px-3 py-2 bg-background border border-card-border rounded-lg text-sm font-mono">
                  <span className="text-muted">{c.label}</span>
                  <span className="font-semibold">${fmt(c.value)}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted">Assumes {HOURS_PER_DAY}h/day, {DAYS_PER_WEEK} days/week, {WEEKS_PER_YEAR} weeks/year.</p>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
