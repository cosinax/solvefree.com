"use client";

import { useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";

const presets = [
  { name: "Balanced", protein: 30, carbs: 40, fat: 30 },
  { name: "Low Carb", protein: 40, carbs: 20, fat: 40 },
  { name: "High Protein", protein: 40, carbs: 35, fat: 25 },
  { name: "Keto", protein: 25, carbs: 5, fat: 70 },
];

export default function MacrosPage() {
  const [calories, setCalories] = useState("2000");
  const [protein, setProtein] = useState("30");
  const [carbs, setCarbs] = useState("40");
  const [fat, setFat] = useState("30");

  const cal = parseFloat(calories);
  const p = parseFloat(protein), c = parseFloat(carbs), f = parseFloat(fat);
  const valid = cal > 0 && p + c + f === 100;

  const proteinG = (cal * p / 100) / 4;
  const carbsG = (cal * c / 100) / 4;
  const fatG = (cal * f / 100) / 9;

  const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

  return (
    <CalculatorShell title="Macro Calculator" description="Calculate daily protein, carb, and fat targets in grams.">
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-muted mb-1">Daily Calories</label>
          <input type="number" value={calories} onChange={(e) => setCalories(e.target.value)} className={ic} />
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">Presets</label>
          <div className="grid grid-cols-4 gap-2">
            {presets.map((pr) => (
              <button key={pr.name} onClick={() => { setProtein(pr.protein.toString()); setCarbs(pr.carbs.toString()); setFat(pr.fat.toString()); }}
                className="px-2 py-2 rounded-lg text-xs font-medium bg-background border border-card-border hover:bg-primary-light transition-colors">
                {pr.name}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-sm text-muted mb-1">Protein %</label>
            <input type="number" value={protein} onChange={(e) => setProtein(e.target.value)} className={ic} />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Carbs %</label>
            <input type="number" value={carbs} onChange={(e) => setCarbs(e.target.value)} className={ic} />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Fat %</label>
            <input type="number" value={fat} onChange={(e) => setFat(e.target.value)} className={ic} />
          </div>
        </div>
        {p + c + f !== 100 && <p className="text-xs text-danger">Percentages must add up to 100% (currently {p + c + f}%)</p>}
        {valid && (
          <div className="grid grid-cols-3 gap-3">
            <div className="px-4 py-4 bg-primary-light rounded-lg text-center">
              <span className="block text-xs text-muted">🥩 Protein</span>
              <span className="block font-mono font-bold text-xl">{Math.round(proteinG)}g</span>
              <span className="text-xs text-muted">{Math.round(cal * p / 100)} cal</span>
            </div>
            <div className="px-4 py-4 bg-primary-light rounded-lg text-center">
              <span className="block text-xs text-muted">🍚 Carbs</span>
              <span className="block font-mono font-bold text-xl">{Math.round(carbsG)}g</span>
              <span className="text-xs text-muted">{Math.round(cal * c / 100)} cal</span>
            </div>
            <div className="px-4 py-4 bg-primary-light rounded-lg text-center">
              <span className="block text-xs text-muted">🥑 Fat</span>
              <span className="block font-mono font-bold text-xl">{Math.round(fatG)}g</span>
              <span className="text-xs text-muted">{Math.round(cal * f / 100)} cal</span>
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
