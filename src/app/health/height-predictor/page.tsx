"use client";

import { useHashState } from "@/hooks/useHashState";
import { CalculatorShell } from "@/components/CalculatorShell";

const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

// CDC growth chart approximate 50th percentile heights in cm for ages 2–20
// [age]: { male, female } in cm (50th percentile)
const CDC_50TH: Record<number, { m: number; f: number }> = {
  2: { m: 87.1, f: 85.7 },
  4: { m: 102.9, f: 101.6 },
  6: { m: 116.1, f: 114.6 },
  8: { m: 128.0, f: 127.8 },
  10: { m: 138.5, f: 138.3 },
  12: { m: 149.1, f: 151.5 },
  14: { m: 163.8, f: 159.8 },
  16: { m: 173.1, f: 162.5 },
  18: { m: 176.4, f: 163.0 },
  20: { m: 177.0, f: 163.3 },
};

// Approximate SD for each age (used for percentile calc)
const CDC_SD: Record<number, { m: number; f: number }> = {
  2: { m: 3.8, f: 3.7 },
  4: { m: 4.2, f: 4.2 },
  6: { m: 4.8, f: 5.0 },
  8: { m: 5.5, f: 5.8 },
  10: { m: 6.2, f: 6.8 },
  12: { m: 7.2, f: 7.0 },
  14: { m: 8.5, f: 6.5 },
  16: { m: 7.0, f: 6.2 },
  18: { m: 6.5, f: 6.0 },
  20: { m: 6.5, f: 6.0 },
};

// Normal CDF approximation
function normCDF(z: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp(-0.5 * z * z);
  const poly = t * (0.3193815 + t * (-0.3565638 + t * (1.7814779 + t * (-1.8212560 + t * 1.3302744))));
  const cdf = 1 - d * poly;
  return z >= 0 ? cdf : 1 - cdf;
}

// Find the two surrounding ages for interpolation
function getInterpolatedStats(age: number, sex: "male" | "female"): { mean: number; sd: number } {
  const key = sex === "male" ? "m" : "f";
  const ages = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20];
  if (age <= 2) return { mean: CDC_50TH[2][key], sd: CDC_SD[2][key] };
  if (age >= 20) return { mean: CDC_50TH[20][key], sd: CDC_SD[20][key] };

  let lo = ages[0], hi = ages[ages.length - 1];
  for (let i = 0; i < ages.length - 1; i++) {
    if (age >= ages[i] && age <= ages[i + 1]) { lo = ages[i]; hi = ages[i + 1]; break; }
  }
  const t = (age - lo) / (hi - lo);
  return {
    mean: CDC_50TH[lo][key] + t * (CDC_50TH[hi][key] - CDC_50TH[lo][key]),
    sd: CDC_SD[lo][key] + t * (CDC_SD[hi][key] - CDC_SD[lo][key]),
  };
}

export default function HeightPredictorPage() {
  const [v, setV] = useHashState({
    unit: "imperial",
    sex: "male",
    age: "",
    heightFt: "", heightIn: "", heightCm: "",
    weightLbs: "", weightKg: "",
    fatherFt: "", fatherIn: "", fatherCm: "",
    motherFt: "", motherIn: "", motherCm: "",
  });

  const age = parseFloat(v.age);
  let heightCm = v.unit === "metric" ? parseFloat(v.heightCm) : (parseFloat(v.heightFt) * 12 + (parseFloat(v.heightIn) || 0)) * 2.54;
  let weightKg = v.unit === "metric" ? parseFloat(v.weightKg) : parseFloat(v.weightLbs) * 0.453592;
  let fatherCm = v.unit === "metric" ? parseFloat(v.fatherCm) : (parseFloat(v.fatherFt) * 12 + (parseFloat(v.fatherIn) || 0)) * 2.54;
  let motherCm = v.unit === "metric" ? parseFloat(v.motherCm) : (parseFloat(v.motherFt) * 12 + (parseFloat(v.motherIn) || 0)) * 2.54;

  const validParents = fatherCm > 0 && motherCm > 0;
  const validChild = heightCm > 0 && age >= 2 && age <= 18;

  // Mid-parental height
  let midParentalCm: number | null = null;
  if (validParents) {
    const avg = (fatherCm + motherCm) / 2;
    midParentalCm = v.sex === "male" ? avg + 6.5 : avg - 6.5;
  }

  // Katch-McArdle not applicable — use simplified Khamis-Roche (requires weight)
  // Khamis-Roche uses regression coefficients based on sex, child height, weight, and mid-parental height
  let khamisCm: number | null = null;
  if (validParents && validChild && weightKg > 0 && midParentalCm) {
    // Simplified Khamis-Roche prediction (boys/girls)
    // Values approximated from original Khamis & Roche (1994) for ~50th percentile
    const h = heightCm;
    const w = weightKg;
    const mp = midParentalCm;
    if (v.sex === "male") {
      khamisCm = 0.461 * h + 0.143 * w + 0.296 * mp + 7.313;
    } else {
      khamisCm = 0.502 * h + 0.150 * w + 0.333 * mp - 10.079;
    }
  }

  function cmToFtIn(cm: number): string {
    const totalInches = cm / 2.54;
    const ft = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return `${ft}′${inches}″ (${cm.toFixed(1)} cm)`;
  }

  // Height percentile
  let percentile: number | null = null;
  if (validChild) {
    const stats = getInterpolatedStats(age, v.sex === "male" ? "male" : "female");
    const z = (heightCm - stats.mean) / stats.sd;
    percentile = Math.round(normCDF(z) * 100);
    if (percentile < 1) percentile = 1;
    if (percentile > 99) percentile = 99;
  }

  function percentileLabel(p: number): string {
    if (p <= 5) return "Short stature (≤5th percentile)";
    if (p < 25) return "Below average";
    if (p <= 75) return "Average";
    if (p < 95) return "Above average";
    return "Tall stature (≥95th percentile)";
  }

  const row = (label: string, value: string) => (
    <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
      <span className="text-muted">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );

  return (
    <CalculatorShell title="Height Predictor" description="Predict a child's adult height using mid-parental height and the Khamis-Roche method.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => setV({ unit: "imperial" })} className={`py-2 rounded-lg text-sm font-medium transition-colors ${v.unit === "imperial" ? "bg-primary text-white" : "bg-background border border-card-border"}`}>Imperial (lb, ft)</button>
          <button onClick={() => setV({ unit: "metric" })} className={`py-2 rounded-lg text-sm font-medium transition-colors ${v.unit === "metric" ? "bg-primary text-white" : "bg-background border border-card-border"}`}>Metric (kg, cm)</button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => setV({ sex: "male" })} className={`py-2 rounded-lg text-sm font-medium transition-colors ${v.sex === "male" ? "bg-primary text-white" : "bg-background border border-card-border"}`}>Boy</button>
          <button onClick={() => setV({ sex: "female" })} className={`py-2 rounded-lg text-sm font-medium transition-colors ${v.sex === "female" ? "bg-primary text-white" : "bg-background border border-card-border"}`}>Girl</button>
        </div>

        <div>
          <label className="block text-sm text-muted mb-1">Child's current age (2–18)</label>
          <input type="number" value={v.age} onChange={(e) => setV({ age: e.target.value })} placeholder="e.g. 10" min="2" max="18" className={ic} />
        </div>

        {v.unit === "imperial" ? (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-muted mb-1">Child's height — Feet</label>
                <input type="number" value={v.heightFt} onChange={(e) => setV({ heightFt: e.target.value })} placeholder="4" className={ic} />
              </div>
              <div>
                <label className="block text-sm text-muted mb-1">Inches</label>
                <input type="number" value={v.heightIn} onChange={(e) => setV({ heightIn: e.target.value })} placeholder="6" className={ic} />
              </div>
            </div>
            <div>
              <label className="block text-sm text-muted mb-1">Child's weight (lbs) <span className="text-xs">(optional — for Khamis-Roche)</span></label>
              <input type="number" value={v.weightLbs} onChange={(e) => setV({ weightLbs: e.target.value })} placeholder="e.g. 90" className={ic} />
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block text-sm text-muted mb-1">Child's height (cm)</label>
              <input type="number" value={v.heightCm} onChange={(e) => setV({ heightCm: e.target.value })} placeholder="e.g. 140" className={ic} />
            </div>
            <div>
              <label className="block text-sm text-muted mb-1">Child's weight (kg) <span className="text-xs">(optional — for Khamis-Roche)</span></label>
              <input type="number" value={v.weightKg} onChange={(e) => setV({ weightKg: e.target.value })} placeholder="e.g. 35" className={ic} />
            </div>
          </>
        )}

        <p className="text-xs text-muted font-semibold uppercase tracking-wide">Parent heights</p>
        {v.unit === "imperial" ? (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-muted mb-1">Father — Feet</label>
                <input type="number" value={v.fatherFt} onChange={(e) => setV({ fatherFt: e.target.value })} placeholder="5" className={ic} />
              </div>
              <div>
                <label className="block text-sm text-muted mb-1">Inches</label>
                <input type="number" value={v.fatherIn} onChange={(e) => setV({ fatherIn: e.target.value })} placeholder="10" className={ic} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-muted mb-1">Mother — Feet</label>
                <input type="number" value={v.motherFt} onChange={(e) => setV({ motherFt: e.target.value })} placeholder="5" className={ic} />
              </div>
              <div>
                <label className="block text-sm text-muted mb-1">Inches</label>
                <input type="number" value={v.motherIn} onChange={(e) => setV({ motherIn: e.target.value })} placeholder="5" className={ic} />
              </div>
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block text-sm text-muted mb-1">Father's height (cm)</label>
              <input type="number" value={v.fatherCm} onChange={(e) => setV({ fatherCm: e.target.value })} placeholder="e.g. 178" className={ic} />
            </div>
            <div>
              <label className="block text-sm text-muted mb-1">Mother's height (cm)</label>
              <input type="number" value={v.motherCm} onChange={(e) => setV({ motherCm: e.target.value })} placeholder="e.g. 165" className={ic} />
            </div>
          </>
        )}

        {(midParentalCm || percentile !== null) && (
          <div className="space-y-3">
            {midParentalCm && (
              <div className="bg-primary-light rounded-xl p-4 text-center">
                <span className="block text-sm text-muted mb-1">Predicted adult height</span>
                <span className="block font-mono font-bold text-3xl text-primary">{cmToFtIn(midParentalCm)}</span>
                <span className="block text-xs text-muted mt-1">Mid-parental method (±2 in / ±5 cm range)</span>
              </div>
            )}

            <div className="space-y-1.5">
              {midParentalCm && row("Mid-parental height method", cmToFtIn(midParentalCm))}
              {khamisCm && row("Khamis-Roche method", cmToFtIn(khamisCm))}
              {percentile !== null && row(`Height percentile (age ${age})`, `${percentile}th — ${percentileLabel(percentile)}`)}
            </div>

            <p className="text-xs text-muted pt-1 border-t border-card-border">
              These are estimates only. Adult height is influenced by nutrition, health, and many genetic factors. Consult a pediatrician for clinical assessment.
            </p>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
