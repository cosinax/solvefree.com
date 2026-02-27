"use client";

import { useHashState } from "@/hooks/useHashState";
import { CalculatorShell } from "@/components/CalculatorShell";

const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

// CDC growth chart data: [age] -> { p3, p5, p10, p25, p50, p75, p90, p95, p97 } in cm
// Hardcoded for ages 2, 4, 6, 8, 10, 12, 14, 16, 18, 20
const CDC_MALE: Record<number, number[]> = {
  // [p3, p5, p10, p25, p50, p75, p90, p95, p97]
  2:  [80.0, 81.0, 82.4, 84.4, 87.1, 89.8, 91.9, 93.0, 93.9],
  4:  [94.0, 95.4, 97.1, 99.6, 102.9, 106.2, 108.8, 110.2, 111.2],
  6:  [106.1, 107.7, 109.7, 112.6, 116.1, 119.5, 122.3, 123.9, 124.9],
  8:  [116.8, 118.6, 120.9, 124.2, 128.0, 131.8, 134.9, 136.7, 137.8],
  10: [126.2, 128.3, 130.8, 134.5, 138.5, 142.7, 146.2, 148.1, 149.4],
  12: [135.0, 137.2, 140.0, 144.3, 149.1, 154.1, 158.1, 160.3, 161.7],
  14: [148.2, 150.7, 153.8, 158.6, 163.8, 169.1, 173.4, 175.7, 177.2],
  16: [160.5, 162.7, 165.4, 169.5, 173.8, 178.2, 182.0, 184.0, 185.4],
  18: [163.8, 165.8, 168.3, 172.2, 176.4, 180.8, 184.4, 186.4, 187.7],
  20: [164.5, 166.4, 169.0, 173.0, 177.0, 181.5, 185.2, 187.1, 188.4],
};

const CDC_FEMALE: Record<number, number[]> = {
  2:  [78.2, 79.3, 80.7, 82.8, 85.7, 88.5, 90.7, 91.9, 92.7],
  4:  [92.5, 93.8, 95.6, 98.3, 101.6, 105.0, 107.6, 109.0, 110.0],
  6:  [104.7, 106.1, 108.1, 111.1, 114.6, 118.1, 121.0, 122.7, 123.6],
  8:  [115.2, 116.9, 119.1, 122.4, 127.8, 131.2, 134.2, 136.2, 137.3],
  10: [124.8, 126.6, 129.1, 132.9, 138.3, 143.3, 147.2, 149.4, 150.8],
  12: [136.5, 138.5, 141.1, 145.5, 151.5, 157.1, 161.5, 163.7, 165.2],
  14: [147.2, 149.1, 151.5, 155.5, 159.8, 164.0, 167.5, 169.3, 170.5],
  16: [150.4, 152.1, 154.4, 158.2, 162.5, 166.6, 170.0, 171.8, 173.0],
  18: [151.1, 152.7, 155.1, 158.9, 163.0, 167.1, 170.5, 172.3, 173.5],
  20: [151.3, 153.0, 155.4, 159.1, 163.3, 167.4, 170.8, 172.6, 173.8],
};

const PERCENTILE_LABELS = [3, 5, 10, 25, 50, 75, 90, 95, 97];

function getHeightPercentile(heightCm: number, age: number, sex: "male" | "female"): number {
  const table = sex === "male" ? CDC_MALE : CDC_FEMALE;
  const ages = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20];

  // Interpolate between ages
  let lo = 2, hi = 20;
  if (age <= 2) { lo = hi = 2; }
  else if (age >= 20) { lo = hi = 20; }
  else {
    for (let i = 0; i < ages.length - 1; i++) {
      if (age >= ages[i] && age <= ages[i + 1]) { lo = ages[i]; hi = ages[i + 1]; break; }
    }
  }

  const tFrac = lo === hi ? 0 : (age - lo) / (hi - lo);
  const interpolated = PERCENTILE_LABELS.map((_, i) => table[lo][i] + tFrac * (table[hi][i] - table[lo][i]));

  // Find where heightCm falls
  if (heightCm <= interpolated[0]) return PERCENTILE_LABELS[0];
  if (heightCm >= interpolated[interpolated.length - 1]) return PERCENTILE_LABELS[interpolated.length - 1];

  for (let i = 0; i < interpolated.length - 1; i++) {
    if (heightCm >= interpolated[i] && heightCm <= interpolated[i + 1]) {
      const t = (heightCm - interpolated[i]) / (interpolated[i + 1] - interpolated[i]);
      return Math.round(PERCENTILE_LABELS[i] + t * (PERCENTILE_LABELS[i + 1] - PERCENTILE_LABELS[i]));
    }
  }
  return 50;
}

function getInterpretation(p: number): { label: string; color: string } {
  if (p <= 5) return { label: "Short stature (at or below 5th percentile) — clinical evaluation may be warranted", color: "text-blue-500" };
  if (p < 25) return { label: "Below average", color: "text-muted" };
  if (p <= 75) return { label: "Average range", color: "text-success" };
  if (p < 95) return { label: "Above average", color: "text-muted" };
  return { label: "Tall stature (at or above 95th percentile)", color: "text-accent" };
}

export default function HeightPercentilePage() {
  const [v, setV] = useHashState({
    unit: "imperial",
    sex: "male",
    age: "",
    heightFt: "",
    heightIn: "",
    heightCm: "",
  });

  const age = parseFloat(v.age);
  let heightCm = v.unit === "metric"
    ? parseFloat(v.heightCm)
    : (parseFloat(v.heightFt) * 12 + (parseFloat(v.heightIn) || 0)) * 2.54;

  const valid = heightCm > 0 && age >= 2 && age <= 20;
  const percentile = valid ? getHeightPercentile(heightCm, age, v.sex === "male" ? "male" : "female") : null;
  const interp = percentile !== null ? getInterpretation(percentile) : null;

  const table = v.sex === "male" ? CDC_MALE : CDC_FEMALE;
  const ages = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20];

  function cmToDisplay(cm: number): string {
    if (v.unit === "imperial") {
      const totalIn = cm / 2.54;
      const ft = Math.floor(totalIn / 12);
      const inches = Math.round(totalIn % 12);
      return `${ft}′${inches}″`;
    }
    return `${cm.toFixed(1)} cm`;
  }

  return (
    <CalculatorShell title="Height Percentile (CDC)" description="Find a child's height percentile based on CDC growth charts (ages 2–20).">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => setV({ unit: "imperial" })} className={`py-2 rounded-lg text-sm font-medium transition-colors ${v.unit === "imperial" ? "bg-primary text-white" : "bg-background border border-card-border"}`}>Imperial (ft/in)</button>
          <button onClick={() => setV({ unit: "metric" })} className={`py-2 rounded-lg text-sm font-medium transition-colors ${v.unit === "metric" ? "bg-primary text-white" : "bg-background border border-card-border"}`}>Metric (cm)</button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => setV({ sex: "male" })} className={`py-2 rounded-lg text-sm font-medium transition-colors ${v.sex === "male" ? "bg-primary text-white" : "bg-background border border-card-border"}`}>Male</button>
          <button onClick={() => setV({ sex: "female" })} className={`py-2 rounded-lg text-sm font-medium transition-colors ${v.sex === "female" ? "bg-primary text-white" : "bg-background border border-card-border"}`}>Female</button>
        </div>

        <div>
          <label className="block text-sm text-muted mb-1">Age (2–20 years)</label>
          <input type="number" value={v.age} onChange={(e) => setV({ age: e.target.value })} placeholder="e.g. 10" min="2" max="20" step="0.5" className={ic} />
        </div>

        {v.unit === "imperial" ? (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-muted mb-1">Height — Feet</label>
              <input type="number" value={v.heightFt} onChange={(e) => setV({ heightFt: e.target.value })} placeholder="4" className={ic} />
            </div>
            <div>
              <label className="block text-sm text-muted mb-1">Inches</label>
              <input type="number" value={v.heightIn} onChange={(e) => setV({ heightIn: e.target.value })} placeholder="6" className={ic} />
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-sm text-muted mb-1">Height (cm)</label>
            <input type="number" value={v.heightCm} onChange={(e) => setV({ heightCm: e.target.value })} placeholder="e.g. 140" className={ic} />
          </div>
        )}

        {percentile !== null && interp && (
          <div className="space-y-3">
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="block text-sm text-muted mb-1">Height Percentile</span>
              <span className="block font-mono font-bold text-4xl text-primary">{percentile}th</span>
              <span className={`block text-sm mt-1 font-medium ${interp.color}`}>{interp.label}</span>
            </div>
            <p className="text-xs text-muted">Height is {cmToDisplay(heightCm)} — taller than {percentile}% of {v.sex === "male" ? "boys" : "girls"} at age {age}.</p>
          </div>
        )}

        <div className="overflow-x-auto">
          <p className="text-xs text-muted font-semibold uppercase tracking-wide mb-2">CDC Percentile Reference Table ({v.sex === "male" ? "Boys" : "Girls"})</p>
          <table className="w-full text-xs font-mono border-collapse">
            <thead>
              <tr>
                <th className="px-2 py-1 text-left text-muted border border-card-border bg-background">Age</th>
                {PERCENTILE_LABELS.map((p) => (
                  <th key={p} className="px-1.5 py-1 text-center text-muted border border-card-border bg-background">P{p}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ages.map((a) => (
                <tr key={a} className={age >= a - 1 && age <= a + 1 ? "bg-primary-light" : ""}>
                  <td className="px-2 py-1 border border-card-border">{a}</td>
                  {table[a].map((h, i) => (
                    <td key={i} className="px-1.5 py-1 text-center border border-card-border">
                      {cmToDisplay(h)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-muted">Data approximated from CDC clinical growth charts. A percentile below 5th or above 95th warrants clinical evaluation by a healthcare provider.</p>
      </div>
    </CalculatorShell>
  );
}
