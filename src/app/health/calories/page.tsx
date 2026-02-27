"use client";

import { useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";

const activityLevels = [
  { label: "Sedentary", factor: 1.2 },
  { label: "Lightly active", factor: 1.375 },
  { label: "Moderately active", factor: 1.55 },
  { label: "Very active", factor: 1.725 },
  { label: "Extra active", factor: 1.9 },
];

export default function CaloriesPage() {
  const [gender, setGender] = useState<"male" | "female">("male");
  const [age, setAge] = useState("30");
  const [weight, setWeight] = useState("170");
  const [height, setHeight] = useState("70");
  const [activity, setActivity] = useState(1.55);

  const weightKg = parseFloat(weight) * 0.453592;
  const heightCm = parseFloat(height) * 2.54;
  const a = parseInt(age);
  const valid = weightKg > 0 && heightCm > 0 && a > 0;

  const bmr = gender === "male"
    ? 10 * weightKg + 6.25 * heightCm - 5 * a + 5
    : 10 * weightKg + 6.25 * heightCm - 5 * a - 161;
  const tdee = bmr * activity;

  const goals = [
    { label: "Lose 2 lbs/week", cal: tdee - 1000 },
    { label: "Lose 1 lb/week", cal: tdee - 500 },
    { label: "Lose 0.5 lb/week", cal: tdee - 250 },
    { label: "Maintain weight", cal: tdee },
    { label: "Gain 0.5 lb/week", cal: tdee + 250 },
    { label: "Gain 1 lb/week", cal: tdee + 500 },
  ];

  const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

  return (
    <CalculatorShell title="Calorie Calculator" description="Daily calorie needs for weight loss, maintenance, or gain.">
      <div className="space-y-4">
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
            <label className="block text-sm text-muted mb-1">Weight (lbs)</label>
            <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} className={ic} />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Height (in)</label>
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
          <div className="space-y-2">
            {goals.map((g) => (
              <div key={g.label} className={`flex items-center justify-between px-4 py-3 rounded-lg ${g.label === "Maintain weight" ? "bg-primary-light font-bold" : "bg-background border border-card-border"}`}>
                <span className="text-sm">{g.label}</span>
                <span className="font-mono font-semibold">{Math.max(Math.round(g.cal), 1200)} cal/day</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
