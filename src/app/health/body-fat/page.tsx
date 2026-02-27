"use client";

import { useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";

export default function BodyFatPage() {
  const [gender, setGender] = useState<"male" | "female">("male");
  const [waist, setWaist] = useState("");
  const [neck, setNeck] = useState("");
  const [height, setHeight] = useState("");
  const [hip, setHip] = useState("");

  const w = parseFloat(waist), n = parseFloat(neck), h = parseFloat(height), hp = parseFloat(hip);
  let bf: number | null = null;

  // US Navy method (inches)
  if (gender === "male" && w > 0 && n > 0 && h > 0 && w > n) {
    bf = 86.010 * Math.log10(w - n) - 70.041 * Math.log10(h) + 36.76;
  } else if (gender === "female" && w > 0 && n > 0 && h > 0 && hp > 0) {
    bf = 163.205 * Math.log10(w + hp - n) - 97.684 * Math.log10(h) - 78.387;
  }

  const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

  function getCategory(bf: number, g: string): string {
    if (g === "male") {
      if (bf < 6) return "Essential fat";
      if (bf < 14) return "Athletic";
      if (bf < 18) return "Fit";
      if (bf < 25) return "Average";
      return "Above average";
    }
    if (bf < 14) return "Essential fat";
    if (bf < 21) return "Athletic";
    if (bf < 25) return "Fit";
    if (bf < 32) return "Average";
    return "Above average";
  }

  return (
    <CalculatorShell title="Body Fat Calculator" description="Estimate body fat percentage using the US Navy method. Measurements in inches.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => setGender("male")}
            className={`py-2 rounded-lg text-sm font-medium transition-colors ${gender === "male" ? "bg-primary text-white" : "bg-background border border-card-border"}`}>Male</button>
          <button onClick={() => setGender("female")}
            className={`py-2 rounded-lg text-sm font-medium transition-colors ${gender === "female" ? "bg-primary text-white" : "bg-background border border-card-border"}`}>Female</button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-muted mb-1">Waist (in)</label>
            <input type="number" value={waist} onChange={(e) => setWaist(e.target.value)} placeholder="e.g. 34" className={ic} />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Neck (in)</label>
            <input type="number" value={neck} onChange={(e) => setNeck(e.target.value)} placeholder="e.g. 15" className={ic} />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Height (in)</label>
            <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="e.g. 70" className={ic} />
          </div>
          {gender === "female" && (
            <div>
              <label className="block text-sm text-muted mb-1">Hip (in)</label>
              <input type="number" value={hip} onChange={(e) => setHip(e.target.value)} placeholder="e.g. 38" className={ic} />
            </div>
          )}
        </div>
        {bf !== null && bf > 0 && bf < 60 && (
          <div className="bg-primary-light rounded-xl p-4 text-center space-y-1">
            <span className="block text-sm text-muted">Estimated Body Fat</span>
            <span className="block font-mono font-bold text-3xl">{bf.toFixed(1)}%</span>
            <span className="block text-sm text-muted">{getCategory(bf, gender)}</span>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
