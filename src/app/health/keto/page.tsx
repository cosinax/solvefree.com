"use client";

import { useHashState } from "@/hooks/useHashState";
import { CalculatorShell } from "@/components/CalculatorShell";

const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

const activityLevels = [
  { label: "Sedentary (little or no exercise)", factor: 1.2 },
  { label: "Lightly active (1–3 days/week)", factor: 1.375 },
  { label: "Moderately active (3–5 days/week)", factor: 1.55 },
  { label: "Very active (6–7 days/week)", factor: 1.725 },
  { label: "Extra active (very hard exercise)", factor: 1.9 },
];

const ketoFoods = [
  "Beef, pork, chicken, fish, eggs",
  "Cheese, butter, heavy cream",
  "Avocado, olive oil, coconut oil",
  "Leafy greens (spinach, kale, lettuce)",
  "Broccoli, cauliflower, zucchini",
  "Nuts & seeds (macadamia, almonds, walnuts)",
  "Berries (small amounts — blueberries, strawberries)",
];

export default function KetoPage() {
  const [v, setV] = useHashState({
    unit: "imperial",
    sex: "male",
    age: "",
    weightLbs: "", weightKg: "",
    heightFt: "", heightIn: "", heightCm: "",
    activity: "1.55",
    goal: "lose",
    bodyFat: "",
  });

  const age = parseFloat(v.age);
  let weightKg = v.unit === "metric" ? parseFloat(v.weightKg) : parseFloat(v.weightLbs) * 0.453592;
  let heightCm = v.unit === "metric" ? parseFloat(v.heightCm) : (parseFloat(v.heightFt) * 12 + (parseFloat(v.heightIn) || 0)) * 2.54;
  const activity = parseFloat(v.activity);

  const valid = weightKg > 0 && heightCm > 0 && age > 0;

  // Mifflin-St Jeor BMR
  const bmr = valid
    ? v.sex === "male"
      ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
      : 10 * weightKg + 6.25 * heightCm - 5 * age - 161
    : null;

  const tdee = bmr ? bmr * activity : null;

  let calories: number | null = null;
  if (tdee) {
    if (v.goal === "lose") calories = tdee - 500;
    else if (v.goal === "gain") calories = tdee + 300;
    else calories = tdee;
    calories = Math.max(calories, 1200);
  }

  // Keto macros: 70% fat, 25% protein, 5% carbs
  const fatCal = calories ? calories * 0.70 : null;
  const proteinCal = calories ? calories * 0.25 : null;
  const carbCal = calories ? calories * 0.05 : null;

  const fatG = fatCal ? fatCal / 9 : null;
  const proteinG = proteinCal ? proteinCal / 4 : null;
  const carbG = carbCal ? carbCal / 4 : null;

  const row = (label: string, value: string) => (
    <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
      <span className="text-muted">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );

  return (
    <CalculatorShell title="Keto Calculator" description="Calculate your ketogenic diet calorie and macro targets.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => setV({ unit: "imperial" })} className={`py-2 rounded-lg text-sm font-medium transition-colors ${v.unit === "imperial" ? "bg-primary text-white" : "bg-background border border-card-border"}`}>Imperial (lb, ft)</button>
          <button onClick={() => setV({ unit: "metric" })} className={`py-2 rounded-lg text-sm font-medium transition-colors ${v.unit === "metric" ? "bg-primary text-white" : "bg-background border border-card-border"}`}>Metric (kg, cm)</button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => setV({ sex: "male" })} className={`py-2 rounded-lg text-sm font-medium transition-colors ${v.sex === "male" ? "bg-primary text-white" : "bg-background border border-card-border"}`}>Male</button>
          <button onClick={() => setV({ sex: "female" })} className={`py-2 rounded-lg text-sm font-medium transition-colors ${v.sex === "female" ? "bg-primary text-white" : "bg-background border border-card-border"}`}>Female</button>
        </div>

        <div>
          <label className="block text-sm text-muted mb-1">Age</label>
          <input type="number" value={v.age} onChange={(e) => setV({ age: e.target.value })} placeholder="e.g. 35" className={ic} />
        </div>

        {v.unit === "imperial" ? (
          <>
            <div>
              <label className="block text-sm text-muted mb-1">Weight (lbs)</label>
              <input type="number" value={v.weightLbs} onChange={(e) => setV({ weightLbs: e.target.value })} placeholder="e.g. 200" className={ic} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-muted mb-1">Height — Feet</label>
                <input type="number" value={v.heightFt} onChange={(e) => setV({ heightFt: e.target.value })} placeholder="5" className={ic} />
              </div>
              <div>
                <label className="block text-sm text-muted mb-1">Inches</label>
                <input type="number" value={v.heightIn} onChange={(e) => setV({ heightIn: e.target.value })} placeholder="9" className={ic} />
              </div>
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block text-sm text-muted mb-1">Weight (kg)</label>
              <input type="number" value={v.weightKg} onChange={(e) => setV({ weightKg: e.target.value })} placeholder="e.g. 90" className={ic} />
            </div>
            <div>
              <label className="block text-sm text-muted mb-1">Height (cm)</label>
              <input type="number" value={v.heightCm} onChange={(e) => setV({ heightCm: e.target.value })} placeholder="e.g. 175" className={ic} />
            </div>
          </>
        )}

        <div>
          <label className="block text-sm text-muted mb-1">Activity Level</label>
          <select value={v.activity} onChange={(e) => setV({ activity: e.target.value })}
            className={ic + " text-sm"}>
            {activityLevels.map((a) => <option key={a.factor} value={a.factor}>{a.label}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm text-muted mb-1">Goal</label>
          <div className="grid grid-cols-3 gap-2">
            {[{ id: "lose", label: "Lose Weight" }, { id: "maintain", label: "Maintain" }, { id: "gain", label: "Gain Muscle" }].map((g) => (
              <button key={g.id} onClick={() => setV({ goal: g.id })}
                className={`py-2 rounded-lg text-sm font-medium transition-colors ${v.goal === g.id ? "bg-primary text-white" : "bg-background border border-card-border"}`}>
                {g.label}
              </button>
            ))}
          </div>
        </div>

        {calories && fatG && proteinG && carbG && (
          <div className="space-y-3">
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="block text-sm text-muted mb-1">Daily Calories</span>
              <span className="block font-mono font-bold text-4xl text-primary">{Math.round(calories)}</span>
              <span className="block text-xs text-muted mt-1">TDEE: {Math.round(tdee!)} cal/day</span>
            </div>

            <p className="text-xs text-muted font-semibold uppercase tracking-wide">Keto macros (70/25/5)</p>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-primary-light rounded-lg p-3 text-center">
                <span className="block text-xs text-muted">Fat</span>
                <span className="block font-mono font-bold text-xl text-primary">{Math.round(fatG)}g</span>
                <span className="block text-xs text-muted">70%</span>
              </div>
              <div className="bg-primary-light rounded-lg p-3 text-center">
                <span className="block text-xs text-muted">Protein</span>
                <span className="block font-mono font-bold text-xl text-primary">{Math.round(proteinG)}g</span>
                <span className="block text-xs text-muted">25%</span>
              </div>
              <div className="bg-primary-light rounded-lg p-3 text-center">
                <span className="block text-xs text-muted">Carbs</span>
                <span className="block font-mono font-bold text-xl text-primary">{Math.round(carbG)}g</span>
                <span className="block text-xs text-muted">5% (max 50g)</span>
              </div>
            </div>

            <div className="space-y-1.5">
              {row("Fat calories", `${Math.round(fatG * 9)} kcal`)}
              {row("Protein calories", `${Math.round(proteinG * 4)} kcal`)}
              {row("Net carb limit", `${Math.round(carbG)}g (${Math.round(carbG * 4)} kcal)`)}
            </div>

            <p className="text-xs text-muted font-semibold uppercase tracking-wide">Keto-friendly foods</p>
            <div className="space-y-1">
              {ketoFoods.map((food) => (
                <div key={food} className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
                  <span>{food}</span>
                </div>
              ))}
            </div>

            <p className="text-xs text-muted">
              Standard keto targets 20–50g net carbs/day to maintain ketosis. Consult a healthcare provider before starting any restrictive diet.
            </p>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
