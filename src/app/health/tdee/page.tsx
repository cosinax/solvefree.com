"use client";

import { useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";

const activityLevels = [
  { label: "Sedentary (little or no exercise)", factor: 1.2 },
  { label: "Lightly active (1-3 days/week)", factor: 1.375 },
  { label: "Moderately active (3-5 days/week)", factor: 1.55 },
  { label: "Very active (6-7 days/week)", factor: 1.725 },
  { label: "Extra active (very hard exercise)", factor: 1.9 },
];

export default function TdeePage() {
  const [gender, setGender] = useState<"male" | "female">("male");
  const [age, setAge] = useState("30");
  const [weight, setWeight] = useState("170");
  const [height, setHeight] = useState("70");
  const [activity, setActivity] = useState(1.55);
  const [unit, setUnit] = useState<"imperial" | "metric">("imperial");

  let weightKg = parseFloat(weight);
  let heightCm = parseFloat(height);
  if (unit === "imperial") {
    weightKg = weightKg * 0.453592;
    heightCm = heightCm * 2.54;
  }

  const a = parseInt(age);
  const valid = weightKg > 0 && heightCm > 0 && a > 0;

  // Mifflin-St Jeor
  const bmr = gender === "male"
    ? 10 * weightKg + 6.25 * heightCm - 5 * a + 5
    : 10 * weightKg + 6.25 * heightCm - 5 * a - 161;
  const tdee = bmr * activity;

  const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

  return (
    <CalculatorShell title="TDEE Calculator" description="Total Daily Energy Expenditure using the Mifflin-St Jeor equation.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => setUnit("imperial")}
            className={`py-2 rounded-lg text-sm font-medium transition-colors ${unit === "imperial" ? "bg-primary text-white" : "bg-background border border-card-border"}`}>Imperial</button>
          <button onClick={() => setUnit("metric")}
            className={`py-2 rounded-lg text-sm font-medium transition-colors ${unit === "metric" ? "bg-primary text-white" : "bg-background border border-card-border"}`}>Metric</button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => setGender("male")}
            className={`py-2 rounded-lg text-sm font-medium transition-colors ${gender === "male" ? "bg-primary text-white" : "bg-background border border-card-border"}`}>Male</button>
          <button onClick={() => setGender("female")}
            className={`py-2 rounded-lg text-sm font-medium transition-colors ${gender === "female" ? "bg-primary text-white" : "bg-background border border-card-border"}`}>Female</button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-sm text-muted mb-1">Age</label>
            <input type="number" value={age} onChange={(e) => setAge(e.target.value)} className={ic} />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Weight ({unit === "imperial" ? "lbs" : "kg"})</label>
            <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} className={ic} />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Height ({unit === "imperial" ? "in" : "cm"})</label>
            <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} className={ic} />
          </div>
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">Activity Level</label>
          <select value={activity} onChange={(e) => setActivity(Number(e.target.value))}
            className="w-full px-3 py-2.5 bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm">
            {activityLevels.map((l) => <option key={l.factor} value={l.factor}>{l.label}</option>)}
          </select>
        </div>
        {valid && (
          <div className="space-y-3">
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="block text-sm text-muted">TDEE (Total Daily Energy Expenditure)</span>
              <span className="block font-mono font-bold text-3xl text-primary">{Math.round(tdee)} cal/day</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="px-4 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">BMR (Basal Metabolic Rate)</span>
                <span className="font-mono font-semibold">{Math.round(bmr)} cal/day</span>
              </div>
              <div className="px-4 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">Activity Multiplier</span>
                <span className="font-mono font-semibold">×{activity}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
