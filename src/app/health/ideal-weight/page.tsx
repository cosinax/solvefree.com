"use client";

import { useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";

export default function IdealWeightPage() {
  const [gender, setGender] = useState<"male" | "female">("male");
  const [heightFt, setHeightFt] = useState("5");
  const [heightIn, setHeightIn] = useState("10");

  const totalIn = parseInt(heightFt) * 12 + (parseInt(heightIn) || 0);
  const valid = totalIn > 60;
  const over5ft = totalIn - 60;

  // Various formulas (in lbs)
  const formulas = valid ? [
    { name: "Devine", weight: gender === "male" ? 110 + 2.3 * over5ft : 100 + 2.3 * over5ft },
    { name: "Robinson", weight: gender === "male" ? 115.5 + 2.8 * over5ft : 108.5 + 2.4 * over5ft },
    { name: "Miller", weight: gender === "male" ? 124 + 2.3 * over5ft : 110 + 2.3 * over5ft },
    { name: "Hamwi", weight: gender === "male" ? 106 + 6 * over5ft : 100 + 5 * over5ft },
  ] : [];

  const avg = formulas.length > 0 ? formulas.reduce((s, f) => s + f.weight, 0) / formulas.length : 0;
  const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

  return (
    <CalculatorShell title="Ideal Weight Calculator" description="Calculate ideal body weight using multiple formulas.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => setGender("male")}
            className={`py-2 rounded-lg text-sm font-medium transition-colors ${gender === "male" ? "bg-primary text-white" : "bg-background border border-card-border"}`}>Male</button>
          <button onClick={() => setGender("female")}
            className={`py-2 rounded-lg text-sm font-medium transition-colors ${gender === "female" ? "bg-primary text-white" : "bg-background border border-card-border"}`}>Female</button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-muted mb-1">Feet</label>
            <input type="number" value={heightFt} onChange={(e) => setHeightFt(e.target.value)} className={ic} />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Inches</label>
            <input type="number" value={heightIn} onChange={(e) => setHeightIn(e.target.value)} className={ic} />
          </div>
        </div>
        {formulas.length > 0 && (
          <div className="space-y-3">
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="block text-sm text-muted">Average Ideal Weight</span>
              <span className="block font-mono font-bold text-3xl text-primary">{avg.toFixed(0)} lbs</span>
              <span className="block text-xs text-muted">({(avg * 0.453592).toFixed(1)} kg)</span>
            </div>
            <div className="space-y-2">
              {formulas.map((f) => (
                <div key={f.name} className="flex justify-between items-center px-4 py-2 bg-background border border-card-border rounded-lg">
                  <span className="text-sm text-muted">{f.name} Formula</span>
                  <span className="font-mono font-semibold">{f.weight.toFixed(0)} lbs</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
