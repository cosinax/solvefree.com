"use client";

import { useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";

export default function WaterIntakePage() {
  const [weight, setWeight] = useState("170");
  const [activity, setActivity] = useState("moderate");
  const [climate, setClimate] = useState("temperate");

  const w = parseFloat(weight);
  const valid = w > 0;
  let baseOz = w * 0.5; // half body weight in oz
  if (activity === "light") baseOz *= 1.0;
  else if (activity === "moderate") baseOz *= 1.15;
  else if (activity === "intense") baseOz *= 1.35;
  if (climate === "hot") baseOz *= 1.15;
  else if (climate === "cold") baseOz *= 0.95;

  const liters = baseOz * 0.0295735;
  const cups = baseOz / 8;

  const ic = "w-full px-3 py-2.5 bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

  return (
    <CalculatorShell title="Water Intake Calculator" description="How much water you should drink daily based on weight and activity.">
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-muted mb-1">Weight (lbs)</label>
          <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)}
            className="w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">Activity Level</label>
          <select value={activity} onChange={(e) => setActivity(e.target.value)} className={ic}>
            <option value="light">Light (little exercise)</option>
            <option value="moderate">Moderate (3-5 days/week)</option>
            <option value="intense">Intense (daily hard exercise)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">Climate</label>
          <select value={climate} onChange={(e) => setClimate(e.target.value)} className={ic}>
            <option value="cold">Cold</option>
            <option value="temperate">Temperate</option>
            <option value="hot">Hot / Humid</option>
          </select>
        </div>
        {valid && (
          <div className="bg-primary-light rounded-xl p-4 text-center space-y-2">
            <span className="block text-sm text-muted">Recommended Daily Intake</span>
            <span className="block font-mono font-bold text-3xl text-primary">{Math.round(baseOz)} oz</span>
            <div className="flex justify-center gap-6 text-sm text-muted">
              <span>≈ {liters.toFixed(1)} liters</span>
              <span>≈ {cups.toFixed(1)} cups</span>
            </div>
            <div className="flex justify-center gap-1 text-2xl">
              {Array.from({ length: Math.min(Math.round(cups), 16) }).map((_, i) => (
                <span key={i}>💧</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
