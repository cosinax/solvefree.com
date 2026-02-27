"use client";

import { useHashState } from "@/hooks/useHashState";
import { CalculatorShell } from "@/components/CalculatorShell";

const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

const CALS_PER_LB = 3500;

function addWeeks(date: Date, weeks: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + Math.round(weeks * 7));
  return d;
}

function fmtDate(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function WeightLossPage() {
  const [v, setV] = useHashState({
    unit: "imperial",
    currentWeight: "",
    goalWeight: "",
    tdee: "",
    deficit: "1",
  });

  const deficitLbs = parseFloat(v.deficit);
  const cur = parseFloat(v.currentWeight);
  const goal = parseFloat(v.goalWeight);
  const tdee = parseFloat(v.tdee);

  const lbsToLose = cur > 0 && goal > 0 && goal < cur ? cur - goal : null;
  const lbsToGain = cur > 0 && goal > 0 && goal > cur ? goal - cur : null;
  const losing = lbsToLose !== null;
  const lbsDelta = lbsToLose ?? lbsToGain;

  const deficitPerDay = deficitLbs * CALS_PER_LB / 7;
  const weeksToGoal = lbsDelta ? lbsDelta / deficitLbs : null;
  const targetDate = weeksToGoal ? addWeeks(new Date(), weeksToGoal) : null;

  const calTarget = tdee > 0 ? tdee - (losing ? deficitPerDay : -deficitPerDay) : null;

  const deficitOptions = [
    { val: "0.5", label: "0.5 lb/wk", desc: "Slow & sustainable" },
    { val: "1", label: "1 lb/wk", desc: "Standard" },
    { val: "1.5", label: "1.5 lb/wk", desc: "Moderate" },
    { val: "2", label: "2 lb/wk", desc: "Aggressive" },
  ];

  const row = (label: string, value: string) => (
    <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
      <span className="text-muted">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );

  return (
    <CalculatorShell title="Weight Loss Calculator" description="How long will it take to reach your goal weight?">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => setV({ unit: "imperial" })} className={`py-2 rounded-lg text-sm font-medium transition-colors ${v.unit === "imperial" ? "bg-primary text-white" : "bg-background border border-card-border"}`}>Imperial (lbs)</button>
          <button onClick={() => setV({ unit: "metric" })} className={`py-2 rounded-lg text-sm font-medium transition-colors ${v.unit === "metric" ? "bg-primary text-white" : "bg-background border border-card-border"}`}>Metric (kg)</button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-muted mb-1">Current weight ({v.unit === "imperial" ? "lbs" : "kg"})</label>
            <input type="number" value={v.currentWeight} onChange={(e) => setV({ currentWeight: e.target.value })} placeholder={v.unit === "imperial" ? "e.g. 200" : "e.g. 90"} className={ic} />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Goal weight ({v.unit === "imperial" ? "lbs" : "kg"})</label>
            <input type="number" value={v.goalWeight} onChange={(e) => setV({ goalWeight: e.target.value })} placeholder={v.unit === "imperial" ? "e.g. 170" : "e.g. 77"} className={ic} />
          </div>
        </div>

        <div>
          <label className="block text-sm text-muted mb-1">
            {losing !== false ? "Weekly loss" : "Weekly gain"} rate
          </label>
          <div className="grid grid-cols-4 gap-2">
            {deficitOptions.map((d) => (
              <button key={d.val} onClick={() => setV({ deficit: d.val })}
                className={`py-2 rounded-lg text-center transition-colors ${v.deficit === d.val ? "bg-primary text-white" : "bg-background border border-card-border"}`}>
                <span className="block text-xs font-semibold">{d.label}</span>
                <span className="block text-xs text-muted leading-tight">{d.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm text-muted mb-1">Your TDEE (calories/day) <span className="text-xs">(optional — for calorie target)</span></label>
          <input type="number" value={v.tdee} onChange={(e) => setV({ tdee: e.target.value })} placeholder="e.g. 2200" className={ic} />
        </div>

        {lbsDelta && weeksToGoal && (
          <div className="space-y-3">
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="block text-sm text-muted mb-1">Estimated time to goal</span>
              <span className="block font-mono font-bold text-4xl text-primary">
                {weeksToGoal >= 52
                  ? `${(weeksToGoal / 52).toFixed(1)} years`
                  : `${Math.round(weeksToGoal)} weeks`}
              </span>
              {targetDate && <span className="block text-sm text-muted mt-1">Target date: {fmtDate(targetDate)}</span>}
            </div>

            <div className="space-y-1.5">
              {row(`${losing ? "Weight to lose" : "Weight to gain"}`, `${lbsDelta.toFixed(1)} ${v.unit === "imperial" ? "lbs" : "kg"}`)}
              {row("Rate", `${deficitLbs} ${v.unit === "imperial" ? "lbs" : "kg"}/week`)}
              {row("Daily calorie deficit needed", `${Math.round(deficitPerDay)} cal/day`)}
              {calTarget && row("Daily calorie target", `${Math.round(calTarget)} cal/day`)}
            </div>

            {tdee > 0 && (
              <>
                <p className="text-xs text-muted font-semibold uppercase tracking-wide">Calorie targets by rate</p>
                <div className="space-y-1.5">
                  {deficitOptions.map((d) => {
                    const dailyDef = parseFloat(d.val) * CALS_PER_LB / 7;
                    const cal = Math.round(tdee - (losing ? dailyDef : -dailyDef));
                    const wks = lbsDelta / parseFloat(d.val);
                    return row(`${d.label} — ${Math.round(wks)} weeks`, `${cal} cal/day`);
                  })}
                </div>
              </>
            )}

            <div className="text-xs text-muted space-y-1">
              <p className="font-semibold">Reference</p>
              <p>1 lb of fat ≈ 3,500 calories. A 500 cal/day deficit = ~1 lb/week loss. Do not go below 1,200 cal/day (women) or 1,500 cal/day (men) without medical supervision.</p>
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
