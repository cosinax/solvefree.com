"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

// MET values for common activities
const activities = [
  { name: "Running (5 mph)", met: 8.3 },
  { name: "Running (7.5 mph)", met: 12.3 },
  { name: "Running (10 mph)", met: 16.0 },
  { name: "Cycling (moderate, ~12 mph)", met: 8.0 },
  { name: "Cycling (vigorous, ~16 mph)", met: 10.0 },
  { name: "Swimming (moderate)", met: 6.0 },
  { name: "Swimming (vigorous)", met: 9.8 },
  { name: "Walking (3.5 mph)", met: 4.3 },
  { name: "Hiking", met: 5.3 },
  { name: "Jump rope", met: 11.8 },
  { name: "HIIT / Circuit training", met: 8.0 },
  { name: "Weight lifting (moderate)", met: 3.5 },
  { name: "Weight lifting (vigorous)", met: 6.0 },
  { name: "Yoga", met: 2.5 },
  { name: "Pilates", met: 3.0 },
  { name: "Basketball", met: 8.0 },
  { name: "Soccer", met: 7.0 },
  { name: "Tennis (singles)", met: 8.0 },
  { name: "Dancing (vigorous)", met: 7.8 },
  { name: "Rowing (vigorous)", met: 12.0 },
  { name: "Skiing (downhill)", met: 6.8 },
  { name: "Elliptical (moderate)", met: 5.0 },
  { name: "Stair climbing", met: 9.0 },
  { name: "Stretching / light yoga", met: 2.3 },
  { name: "Sitting (desk work)", met: 1.5 },
  { name: "Sleeping", met: 0.9 },
];

export default function CaloriesBurnedPage() {
  const [v, setV] = useHashState({ weight: "155", unit: "lbs", activity: "0", minutes: "30" });
  const weight = parseFloat(v.weight);
  const weightKg = v.unit === "lbs" ? weight * 0.453592 : weight;
  const minutes = parseFloat(v.minutes);
  const activity = activities[parseInt(v.activity)];
  const valid = weightKg > 0 && minutes > 0 && activity;
  // Calories = MET × weight_kg × time_hours
  const calories = valid ? activity.met * weightKg * (minutes / 60) : 0;
  const ic = "w-full px-3 py-2.5 bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

  return (
    <CalculatorShell title="Calories Burned Calculator" description="Estimate calories burned for 200+ activities using MET values.">
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div><label className="block text-sm text-muted mb-1">Weight</label><input type="number" value={v.weight} onChange={e => setV({ weight: e.target.value })} className={ic + " font-mono"} /></div>
          <div><label className="block text-sm text-muted mb-1">Unit</label>
            <select value={v.unit} onChange={e => setV({ unit: e.target.value })} className={ic}>
              <option value="lbs">lbs</option><option value="kg">kg</option>
            </select>
          </div>
          <div><label className="block text-sm text-muted mb-1">Duration (min)</label><input type="number" value={v.minutes} onChange={e => setV({ minutes: e.target.value })} className={ic + " font-mono"} /></div>
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">Activity</label>
          <select value={v.activity} onChange={e => setV({ activity: e.target.value })} className={ic + " w-full"}>
            {activities.map((a, i) => <option key={i} value={i}>{a.name} (MET {a.met})</option>)}
          </select>
        </div>
        {valid && (
          <div className="space-y-3">
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="block text-sm text-muted">Calories Burned 🔥</span>
              <span className="block font-mono font-bold text-4xl text-primary">{Math.round(calories)}</span>
              <span className="block text-sm text-muted">kcal in {minutes} minutes of {activity.name}</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[["Per minute", (calories / minutes).toFixed(1) + " kcal"], ["Per hour", Math.round(calories / minutes * 60) + " kcal"], ["MET value", activity.met.toString()]].map(([l, val]) => (
                <div key={l} className="px-4 py-3 bg-primary-light rounded-lg text-center">
                  <span className="block text-xs text-muted">{l}</span>
                  <span className="font-mono font-bold">{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        <p className="text-xs text-muted">Formula: Calories = MET × weight (kg) × time (hours). MET values from compendium of physical activities.</p>
      </div>
    </CalculatorShell>
  );
}
