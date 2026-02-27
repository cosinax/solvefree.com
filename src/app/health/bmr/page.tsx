"use client";

import { useHashState } from "@/hooks/useHashState";
import { CalculatorShell } from "@/components/CalculatorShell";

const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

export default function BmrPage() {
  const [v, setV] = useHashState({
    unit: "imperial",
    sex: "male",
    age: "",
    weightLbs: "",
    weightKg: "",
    heightFt: "",
    heightIn: "",
    heightCm: "",
    bodyFat: "",
  });

  const age = parseFloat(v.age);
  let weightKg = v.unit === "metric" ? parseFloat(v.weightKg) : parseFloat(v.weightLbs) * 0.453592;
  let heightCm = v.unit === "metric" ? parseFloat(v.heightCm) : (parseFloat(v.heightFt) * 12 + (parseFloat(v.heightIn) || 0)) * 2.54;

  const valid = weightKg > 0 && heightCm > 0 && age > 0;

  // Mifflin-St Jeor
  const mifflin = valid
    ? v.sex === "male"
      ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
      : 10 * weightKg + 6.25 * heightCm - 5 * age - 161
    : null;

  // Harris-Benedict (revised)
  const harrisBenedict = valid
    ? v.sex === "male"
      ? 13.397 * weightKg + 4.799 * heightCm - 5.677 * age + 88.362
      : 9.247 * weightKg + 3.098 * heightCm - 4.330 * age + 447.593
    : null;

  // Katch-McArdle — requires lean body mass
  const bf = parseFloat(v.bodyFat);
  const lbm = bf > 0 && bf < 100 && valid ? weightKg * (1 - bf / 100) : null;
  const katchMcArdle = lbm ? 370 + 21.6 * lbm : null;

  const row = (label: string, value: number | null, primary = false) => (
    <div className={`flex justify-between px-3 py-1.5 ${primary ? "bg-primary-light" : "bg-background"} border border-card-border rounded text-xs font-mono`}>
      <span className="text-muted">{label}</span>
      <span className="font-semibold">{value ? `${Math.round(value)} cal/day` : "—"}</span>
    </div>
  );

  return (
    <CalculatorShell title="BMR Calculator" description="Basal Metabolic Rate — calories your body burns at complete rest.">
      <div className="space-y-4">
        {/* Unit toggle */}
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => setV({ unit: "imperial" })} className={`py-2 rounded-lg text-sm font-medium transition-colors ${v.unit === "imperial" ? "bg-primary text-white" : "bg-background border border-card-border"}`}>Imperial (lb, ft)</button>
          <button onClick={() => setV({ unit: "metric" })} className={`py-2 rounded-lg text-sm font-medium transition-colors ${v.unit === "metric" ? "bg-primary text-white" : "bg-background border border-card-border"}`}>Metric (kg, cm)</button>
        </div>

        {/* Sex toggle */}
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => setV({ sex: "male" })} className={`py-2 rounded-lg text-sm font-medium transition-colors ${v.sex === "male" ? "bg-primary text-white" : "bg-background border border-card-border"}`}>Male</button>
          <button onClick={() => setV({ sex: "female" })} className={`py-2 rounded-lg text-sm font-medium transition-colors ${v.sex === "female" ? "bg-primary text-white" : "bg-background border border-card-border"}`}>Female</button>
        </div>

        <div>
          <label className="block text-sm text-muted mb-1">Age (years)</label>
          <input type="number" value={v.age} onChange={(e) => setV({ age: e.target.value })} placeholder="e.g. 30" className={ic} />
        </div>

        {v.unit === "imperial" ? (
          <>
            <div>
              <label className="block text-sm text-muted mb-1">Weight (lbs)</label>
              <input type="number" value={v.weightLbs} onChange={(e) => setV({ weightLbs: e.target.value })} placeholder="e.g. 160" className={ic} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-muted mb-1">Height — Feet</label>
                <input type="number" value={v.heightFt} onChange={(e) => setV({ heightFt: e.target.value })} placeholder="5" className={ic} />
              </div>
              <div>
                <label className="block text-sm text-muted mb-1">Inches</label>
                <input type="number" value={v.heightIn} onChange={(e) => setV({ heightIn: e.target.value })} placeholder="8" className={ic} />
              </div>
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block text-sm text-muted mb-1">Weight (kg)</label>
              <input type="number" value={v.weightKg} onChange={(e) => setV({ weightKg: e.target.value })} placeholder="e.g. 72" className={ic} />
            </div>
            <div>
              <label className="block text-sm text-muted mb-1">Height (cm)</label>
              <input type="number" value={v.heightCm} onChange={(e) => setV({ heightCm: e.target.value })} placeholder="e.g. 175" className={ic} />
            </div>
          </>
        )}

        <div>
          <label className="block text-sm text-muted mb-1">Body Fat % <span className="text-xs">(optional — for Katch-McArdle)</span></label>
          <input type="number" value={v.bodyFat} onChange={(e) => setV({ bodyFat: e.target.value })} placeholder="e.g. 20" className={ic} />
        </div>

        {mifflin && (
          <div className="space-y-3">
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="block text-sm text-muted mb-1">BMR (Mifflin-St Jeor)</span>
              <span className="block font-mono font-bold text-4xl text-primary">{Math.round(mifflin)}</span>
              <span className="block text-sm text-muted mt-1">calories/day at rest</span>
            </div>

            <p className="text-xs text-muted font-semibold uppercase tracking-wide">All formulas comparison</p>
            <div className="space-y-1.5">
              {row("Mifflin-St Jeor (most accurate)", mifflin, true)}
              {row("Harris-Benedict (revised)", harrisBenedict)}
              {row("Katch-McArdle (needs body fat %)", katchMcArdle)}
            </div>

            <div className="text-xs text-muted space-y-1 pt-1">
              <p className="font-semibold">What is BMR?</p>
              <p>Your Basal Metabolic Rate is the number of calories your body needs to maintain basic physiological functions (breathing, circulation, cell production) while completely at rest. It accounts for 60–75% of total daily calorie burn.</p>
              <p>To find your total daily needs, multiply BMR by your activity factor (see TDEE calculator).</p>
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
