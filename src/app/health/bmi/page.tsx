"use client";

import { useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";

function getBmiCategory(bmi: number): { label: string; color: string } {
  if (bmi < 18.5) return { label: "Underweight", color: "text-blue-500" };
  if (bmi < 25) return { label: "Normal weight", color: "text-success" };
  if (bmi < 30) return { label: "Overweight", color: "text-accent" };
  return { label: "Obese", color: "text-danger" };
}

function BmiScale({ bmi }: { bmi: number }) {
  // Scale: 10 to 45
  const MIN = 10, MAX = 45;
  const clamp = Math.min(Math.max(bmi, MIN), MAX);
  const pct = ((clamp - MIN) / (MAX - MIN)) * 100;

  const segments = [
    { label: "Underweight", end: 18.5, color: "#3b82f6" },
    { label: "Normal", end: 25, color: "#22c55e" },
    { label: "Overweight", end: 30, color: "#f59e0b" },
    { label: "Obese", end: MAX, color: "#ef4444" },
  ];

  return (
    <div className="space-y-1">
      <div className="relative h-5 rounded-full overflow-hidden flex">
        {segments.map((seg, i) => {
          const start = i === 0 ? MIN : segments[i - 1].end;
          const width = ((seg.end - start) / (MAX - MIN)) * 100;
          return (
            <div key={seg.label} style={{ width: `${width}%`, backgroundColor: seg.color }} className="h-full" />
          );
        })}
        {/* Marker */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-md"
          style={{ left: `${pct}%`, transform: "translateX(-50%)" }}
        />
      </div>
      <div className="relative h-4">
        <div className="absolute text-xs font-mono font-bold text-foreground" style={{ left: `${pct}%`, transform: "translateX(-50%)" }}>
          {bmi.toFixed(1)}
        </div>
      </div>
      <div className="flex text-[10px] text-muted justify-between px-0.5">
        <span>10</span><span>18.5</span><span>25</span><span>30</span><span>45</span>
      </div>
    </div>
  );
}

export default function BmiPage() {
  const [unit, setUnit] = useState<"imperial" | "metric">("imperial");
  const [weight, setWeight] = useState("");
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [heightCm, setHeightCm] = useState("");

  let bmi: number | null = null;
  if (unit === "imperial" && weight && heightFt) {
    const totalInches = parseInt(heightFt) * 12 + (parseInt(heightIn) || 0);
    if (totalInches > 0) bmi = (parseFloat(weight) / (totalInches * totalInches)) * 703;
  } else if (unit === "metric" && weight && heightCm) {
    const m = parseFloat(heightCm) / 100;
    if (m > 0) bmi = parseFloat(weight) / (m * m);
  }

  const category = bmi ? getBmiCategory(bmi) : null;
  const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

  return (
    <CalculatorShell title="BMI Calculator" description="Calculate your Body Mass Index.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => setUnit("imperial")}
            className={`py-2 rounded-lg text-sm font-medium transition-colors ${unit === "imperial" ? "bg-primary text-white" : "bg-background border border-card-border"}`}>
            Imperial (lb, ft)
          </button>
          <button onClick={() => setUnit("metric")}
            className={`py-2 rounded-lg text-sm font-medium transition-colors ${unit === "metric" ? "bg-primary text-white" : "bg-background border border-card-border"}`}>
            Metric (kg, cm)
          </button>
        </div>

        <div>
          <label className="block text-sm text-muted mb-1">Weight ({unit === "imperial" ? "lbs" : "kg"})</label>
          <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder={unit === "imperial" ? "e.g. 170" : "e.g. 77"} className={ic} />
        </div>

        {unit === "imperial" ? (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-muted mb-1">Feet</label>
              <input type="number" value={heightFt} onChange={(e) => setHeightFt(e.target.value)} placeholder="5" className={ic} />
            </div>
            <div>
              <label className="block text-sm text-muted mb-1">Inches</label>
              <input type="number" value={heightIn} onChange={(e) => setHeightIn(e.target.value)} placeholder="10" className={ic} />
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-sm text-muted mb-1">Height (cm)</label>
            <input type="number" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} placeholder="e.g. 178" className={ic} />
          </div>
        )}

        {bmi && category && (
          <div className="bg-primary-light rounded-xl p-4 text-center space-y-3">
            <span className="block text-sm text-muted">Your BMI</span>
            <span className="block font-mono font-bold text-3xl">{bmi.toFixed(1)}</span>
            <span className={`block text-sm font-semibold ${category.color}`}>{category.label}</span>
            <BmiScale bmi={bmi} />
          </div>
        )}

        <div className="text-xs text-muted space-y-1">
          <p className="font-semibold">BMI Categories:</p>
          <p>Underweight: &lt; 18.5 · Normal: 18.5–24.9 · Overweight: 25–29.9 · Obese: 30+</p>
        </div>
      </div>
    </CalculatorShell>
  );
}
