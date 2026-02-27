"use client";

import { useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";

export default function BacPage() {
  const [gender, setGender] = useState<"male" | "female">("male");
  const [weight, setWeight] = useState("170");
  const [drinks, setDrinks] = useState("3");
  const [hours, setHours] = useState("2");

  const w = parseFloat(weight), d = parseFloat(drinks), h = parseFloat(hours);
  const valid = w > 0 && d >= 0 && h >= 0;

  // Widmark formula: BAC = (drinks * 0.6 * 5.14) / (weight * r) - 0.015 * hours
  const r = gender === "male" ? 0.73 : 0.66;
  const bac = valid ? Math.max((d * 0.6 * 5.14) / (w * r) - 0.015 * h, 0) : 0;

  function getLevel(bac: number): { label: string; color: string } {
    if (bac === 0) return { label: "Sober", color: "text-success" };
    if (bac < 0.04) return { label: "Minimal impairment", color: "text-success" };
    if (bac < 0.08) return { label: "Some impairment", color: "text-accent" };
    if (bac < 0.15) return { label: "Legally impaired (above 0.08)", color: "text-danger" };
    if (bac < 0.30) return { label: "Severely impaired", color: "text-danger" };
    return { label: "Dangerously high — seek help", color: "text-danger" };
  }

  const level = getLevel(bac);
  const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

  return (
    <CalculatorShell title="Blood Alcohol Calculator" description="Estimate blood alcohol content (BAC). One 'standard drink' = 12oz beer, 5oz wine, or 1.5oz spirits.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => setGender("male")}
            className={`py-2 rounded-lg text-sm font-medium transition-colors ${gender === "male" ? "bg-primary text-white" : "bg-background border border-card-border"}`}>Male</button>
          <button onClick={() => setGender("female")}
            className={`py-2 rounded-lg text-sm font-medium transition-colors ${gender === "female" ? "bg-primary text-white" : "bg-background border border-card-border"}`}>Female</button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-sm text-muted mb-1">Weight (lbs)</label>
            <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} className={ic} />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Drinks</label>
            <input type="number" value={drinks} onChange={(e) => setDrinks(e.target.value)} min="0" step="0.5" className={ic} />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Hours</label>
            <input type="number" value={hours} onChange={(e) => setHours(e.target.value)} min="0" step="0.5" className={ic} />
          </div>
        </div>
        {valid && (
          <div className="bg-primary-light rounded-xl p-4 text-center space-y-1">
            <span className="block text-sm text-muted">Estimated BAC</span>
            <span className="block font-mono font-bold text-3xl">{bac.toFixed(3)}%</span>
            <span className={`block text-sm font-semibold ${level.color}`}>{level.label}</span>
          </div>
        )}
        <p className="text-xs text-muted text-center">⚠️ This is an estimate only. Never drink and drive. BAC varies by individual.</p>
      </div>
    </CalculatorShell>
  );
}
