"use client";

import { useHashState } from "@/hooks/useHashState";
import { CalculatorShell } from "@/components/CalculatorShell";

const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

export default function LeanBodyMassPage() {
  const [v, setV] = useHashState({
    unit: "imperial",
    sex: "male",
    weightLbs: "",
    weightKg: "",
    heightFt: "",
    heightIn: "",
    heightCm: "",
    bodyFat: "",
  });

  let weightKg = v.unit === "metric" ? parseFloat(v.weightKg) : parseFloat(v.weightLbs) * 0.453592;
  let heightCm = v.unit === "metric" ? parseFloat(v.heightCm) : (parseFloat(v.heightFt) * 12 + (parseFloat(v.heightIn) || 0)) * 2.54;

  const valid = weightKg > 0 && heightCm > 0;
  const heightM = heightCm / 100;

  // Boer formula
  let boer: number | null = null;
  if (valid) {
    boer = v.sex === "male"
      ? 0.407 * weightKg + 0.267 * heightCm - 19.2
      : 0.252 * weightKg + 0.473 * heightCm - 48.3;
  }

  // James formula
  let james: number | null = null;
  if (valid) {
    james = v.sex === "male"
      ? 1.1 * weightKg - 128 * (weightKg / heightCm) ** 2
      : 1.07 * weightKg - 148 * (weightKg / heightCm) ** 2;
  }

  // Hume formula
  let hume: number | null = null;
  if (valid) {
    hume = v.sex === "male"
      ? 0.3281 * weightKg + 0.3393 * heightCm - 29.5336
      : 0.29569 * weightKg + 0.41813 * heightCm - 43.2933;
  }

  // Average LBM
  const values = [boer, james, hume].filter((x): x is number => x !== null);
  const avgLbm = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : null;

  // Fat mass
  const bf = parseFloat(v.bodyFat);
  const fatMass = bf > 0 && bf < 100 && valid ? weightKg * (bf / 100) : null;
  const lbmFromBf = fatMass !== null ? weightKg - fatMass : null;

  // Skeletal muscle mass (approx 50–60% of LBM)
  const smm = avgLbm ? avgLbm * 0.55 : null;

  // FFMI = LBM / height_m^2
  const ffmi = avgLbm && heightM > 0 ? avgLbm / (heightM * heightM) : null;

  function fmt(kg: number | null, lbs = false): string {
    if (kg === null) return "—";
    if (v.unit === "imperial" || lbs) return `${(kg * 2.20462).toFixed(1)} lbs (${kg.toFixed(1)} kg)`;
    return `${kg.toFixed(1)} kg (${(kg * 2.20462).toFixed(1)} lbs)`;
  }

  const row = (label: string, value: string) => (
    <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
      <span className="text-muted">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );

  return (
    <CalculatorShell title="Lean Body Mass Calculator" description="Calculate lean body mass (LBM) using Boer, James, and Hume formulas.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => setV({ unit: "imperial" })} className={`py-2 rounded-lg text-sm font-medium transition-colors ${v.unit === "imperial" ? "bg-primary text-white" : "bg-background border border-card-border"}`}>Imperial (lb, ft)</button>
          <button onClick={() => setV({ unit: "metric" })} className={`py-2 rounded-lg text-sm font-medium transition-colors ${v.unit === "metric" ? "bg-primary text-white" : "bg-background border border-card-border"}`}>Metric (kg, cm)</button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => setV({ sex: "male" })} className={`py-2 rounded-lg text-sm font-medium transition-colors ${v.sex === "male" ? "bg-primary text-white" : "bg-background border border-card-border"}`}>Male</button>
          <button onClick={() => setV({ sex: "female" })} className={`py-2 rounded-lg text-sm font-medium transition-colors ${v.sex === "female" ? "bg-primary text-white" : "bg-background border border-card-border"}`}>Female</button>
        </div>

        {v.unit === "imperial" ? (
          <>
            <div>
              <label className="block text-sm text-muted mb-1">Weight (lbs)</label>
              <input type="number" value={v.weightLbs} onChange={(e) => setV({ weightLbs: e.target.value })} placeholder="e.g. 180" className={ic} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-muted mb-1">Height — Feet</label>
                <input type="number" value={v.heightFt} onChange={(e) => setV({ heightFt: e.target.value })} placeholder="5" className={ic} />
              </div>
              <div>
                <label className="block text-sm text-muted mb-1">Inches</label>
                <input type="number" value={v.heightIn} onChange={(e) => setV({ heightIn: e.target.value })} placeholder="10" className={ic} />
              </div>
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block text-sm text-muted mb-1">Weight (kg)</label>
              <input type="number" value={v.weightKg} onChange={(e) => setV({ weightKg: e.target.value })} placeholder="e.g. 80" className={ic} />
            </div>
            <div>
              <label className="block text-sm text-muted mb-1">Height (cm)</label>
              <input type="number" value={v.heightCm} onChange={(e) => setV({ heightCm: e.target.value })} placeholder="e.g. 178" className={ic} />
            </div>
          </>
        )}

        <div>
          <label className="block text-sm text-muted mb-1">Body Fat % <span className="text-xs">(optional)</span></label>
          <input type="number" value={v.bodyFat} onChange={(e) => setV({ bodyFat: e.target.value })} placeholder="e.g. 18" className={ic} />
        </div>

        {avgLbm && (
          <div className="space-y-3">
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="block text-sm text-muted mb-1">Lean Body Mass (average)</span>
              <span className="block font-mono font-bold text-4xl text-primary">{fmt(avgLbm)}</span>
            </div>

            <p className="text-xs text-muted font-semibold uppercase tracking-wide">Formula comparison</p>
            <div className="space-y-1.5">
              {row("Boer formula", fmt(boer))}
              {row("James formula", fmt(james))}
              {row("Hume formula", fmt(hume))}
              {lbmFromBf && row("From body fat %", fmt(lbmFromBf))}
            </div>

            <p className="text-xs text-muted font-semibold uppercase tracking-wide">Derived metrics</p>
            <div className="space-y-1.5">
              {smm && row("Skeletal muscle mass (est.)", fmt(smm))}
              {fatMass && row("Fat mass (from BF%)", fmt(fatMass))}
              {ffmi && row("Fat-free mass index (FFMI)", ffmi.toFixed(1))}
            </div>

            {ffmi && (
              <div className="text-xs text-muted space-y-1">
                <p className="font-semibold">FFMI interpretation</p>
                <p>Under 18: below average · 18–20: average · 20–22: above average · 22–25: excellent · Over 25: elite/near genetic limit</p>
              </div>
            )}
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
