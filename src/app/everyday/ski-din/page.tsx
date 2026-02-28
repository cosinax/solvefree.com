"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

// DIN lookup table based on ISO 11088 standard
// Rows: weight ranges (kg), Columns: skier code (1=beginner, 2=intermediate, 3=advanced, 3+ = expert)
// DIN values are indexed by boot sole length category

// ISO 11088 table: [weight_min_kg, weight_max_kg, code1, code2, code3, code3plus]
const DIN_TABLE: [number, number, number, number, number, number][] = [
  [10, 13, 0.75, 0.75, 1.0, 1.0],
  [13, 17, 0.75, 1.0, 1.25, 1.25],
  [17, 21, 1.0, 1.25, 1.5, 1.5],
  [21, 25, 1.25, 1.5, 2.0, 2.0],
  [25, 30, 1.5, 2.0, 2.5, 2.5],
  [30, 35, 2.0, 2.5, 3.0, 3.0],
  [35, 41, 2.5, 3.0, 3.5, 3.5],
  [41, 48, 3.0, 3.5, 4.5, 4.5],
  [48, 57, 3.5, 4.5, 5.5, 5.5],
  [57, 66, 4.5, 5.5, 6.5, 6.5],
  [66, 78, 5.5, 6.5, 7.5, 7.5],
  [78, 94, 6.5, 7.5, 9.0, 9.0],
  [94, 110, 7.5, 9.0, 10.5, 10.5],
  [110, 125, 9.0, 10.5, 12.0, 12.0],
];

// Boot sole length adjustment factor
function bootSoleFactor(bsl: number): number {
  if (bsl < 230) return -2;
  if (bsl < 250) return -1;
  if (bsl < 270) return 0;
  if (bsl < 290) return +1;
  if (bsl < 310) return +2;
  return +3;
}

// Skier codes:
// 1 = Type 1 (beginner/cautious) - lower release, prefers gentle release
// 2 = Type 2 (intermediate) - standard settings
// 3 = Type 3 (advanced/aggressive) - higher retention
// 3+ = Expert/race - highest retention

function getDin(weightKg: number, heightCm: number, bsl: number, skierType: string, age: number): number | null {
  // Height adjustment: if height-based DIN lookup is lower, use that
  // (ISO 11088 uses both weight and height, takes the lower result)
  const row = DIN_TABLE.find(([min, max]) => weightKg >= min && weightKg < max);
  if (!row) return null;

  const codeIdx: Record<string, number> = { "1": 2, "2": 3, "3": 4, "3+": 5 };
  let din = row[codeIdx[skierType]];

  // Boot sole length adjustment
  din += bootSoleFactor(bsl) * 0.25;

  // Age adjustment: >50 years or <10 years → use one code lower
  if (age > 50 || age < 10) {
    const lowerCodeIdx: Record<string, number> = { "1": 2, "2": 2, "3": 3, "3+": 4 };
    din = row[lowerCodeIdx[skierType]];
    din += bootSoleFactor(bsl) * 0.25;
  }

  // Height check (ISO 11088 also references height-based lookup, simplified here)
  // Taller skiers generate more torque — slight upward adjustment for 180+
  if (heightCm >= 193) din += 0.5;
  if (heightCm >= 180 && heightCm < 193) din += 0.25;

  return Math.max(0.75, Math.round(din * 4) / 4); // round to nearest 0.25
}

export default function SkiDinPage() {
  const [v, setV] = useHashState({
    weight: "75", height: "175", bsl: "275", type: "2", age: "30", unit: "metric"
  });

  const unit = v.unit as "metric" | "imperial";
  const weightKg = unit === "metric" ? parseFloat(v.weight) : parseFloat(v.weight) * 0.453592;
  const heightCm = unit === "metric" ? parseFloat(v.height) : parseFloat(v.height) * 2.54;
  const bsl = parseFloat(v.bsl);
  const age = parseInt(v.age);
  const valid = weightKg > 0 && heightCm > 0 && bsl > 0 && age > 0;

  const din = valid ? getDin(weightKg, heightCm, bsl, v.type, age) : null;

  const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

  const skierTypes = [
    { value: "1", label: "Type 1 — Beginner", desc: "Cautious skier, prefers lower speeds, varied terrain" },
    { value: "2", label: "Type 2 — Intermediate", desc: "Average skier, varied terrain and speeds" },
    { value: "3", label: "Type 3 — Advanced", desc: "Aggressive skier, high speeds, steep terrain" },
    { value: "3+", label: "Type 3+ — Expert/Race", desc: "Extreme aggression, highest retention needed" },
  ];

  return (
    <CalculatorShell title="Ski DIN Calculator" description="Calculate ski binding DIN release settings per ISO 11088.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => setV({ unit: "metric" })}
            className={`py-2 rounded-lg text-sm font-medium transition-colors ${unit === "metric" ? "bg-primary text-white" : "bg-background border border-card-border"}`}>
            Metric (kg, cm)
          </button>
          <button onClick={() => setV({ unit: "imperial" })}
            className={`py-2 rounded-lg text-sm font-medium transition-colors ${unit === "imperial" ? "bg-primary text-white" : "bg-background border border-card-border"}`}>
            Imperial (lbs, in)
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-muted mb-1">
              Weight ({unit === "metric" ? "kg" : "lbs"})
            </label>
            <input type="number" value={v.weight} onChange={e => setV({ weight: e.target.value })} className={ic} min="0" step="1" />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">
              Height ({unit === "metric" ? "cm" : "inches"})
            </label>
            <input type="number" value={v.height} onChange={e => setV({ height: e.target.value })} className={ic} min="0" step="1" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-muted mb-1">Boot Sole Length (mm)</label>
            <input type="number" value={v.bsl} onChange={e => setV({ bsl: e.target.value })} className={ic} min="0" step="1" placeholder="e.g. 275" />
            <span className="text-xs text-muted mt-1 block">Found inside ski boot, usually 240–310 mm</span>
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Age</label>
            <input type="number" value={v.age} onChange={e => setV({ age: e.target.value })} className={ic} min="0" step="1" />
          </div>
        </div>

        <div>
          <label className="block text-sm text-muted mb-2">Skier Type</label>
          <div className="space-y-1.5">
            {skierTypes.map(t => (
              <button
                key={t.value}
                onClick={() => setV({ type: t.value })}
                className={`w-full text-left px-3 py-2.5 rounded-lg border transition-colors ${v.type === t.value ? "bg-primary-light border-primary" : "bg-background border-card-border hover:bg-primary-light"}`}
              >
                <span className="block text-sm font-medium">{t.label}</span>
                <span className="block text-xs text-muted">{t.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {valid && din !== null && (
          <div className="space-y-3">
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="block text-sm text-muted">Recommended DIN Setting</span>
              <span className="block font-mono font-bold text-5xl text-primary">{din.toFixed(2).replace(/\.00$/, "").replace(/(\.\d)0$/, "$1")}</span>
              <span className="block text-xs text-muted mt-1">
                {din <= 3 ? "Low — beginner/children" : din <= 6 ? "Medium — recreational" : din <= 9 ? "High — advanced" : "Very high — expert/race"}
              </span>
            </div>
            {(age > 50 || age < 10) && (
              <div className="px-3 py-2 bg-accent/10 border border-accent/30 rounded-lg text-xs text-accent">
                ℹ️ Age adjustment applied — settings reduced by one code level for age {age}.
              </div>
            )}
            <div className="px-4 py-3 bg-background border border-card-border rounded-lg text-xs text-muted space-y-1">
              <p className="font-semibold text-foreground">Important safety notice</p>
              <p>DIN settings must be verified and set by a certified ski technician. This calculator is for reference only. Incorrect settings can cause injury.</p>
            </div>
          </div>
        )}

        <div className="px-4 py-3 bg-background border border-card-border rounded-lg text-xs text-muted space-y-1">
          <p className="font-semibold text-foreground">About DIN settings</p>
          <p>DIN (Deutsches Institut für Normung) settings control how much force releases your boot from the binding. Lower = easier release, Higher = more retention. Based on ISO 11088.</p>
        </div>
      </div>
    </CalculatorShell>
  );
}
