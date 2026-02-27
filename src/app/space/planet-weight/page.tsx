"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
const sc = "w-full px-3 py-2 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm";

const EARTH_G = 9.80665; // m/s²

interface World {
  name: string;
  g: number; // m/s²
  emoji: string;
}

const WORLDS: World[] = [
  { name: "Mercury",  g: 3.7,    emoji: "☿" },
  { name: "Venus",    g: 8.87,   emoji: "♀" },
  { name: "Moon",     g: 1.62,   emoji: "🌕" },
  { name: "Mars",     g: 3.72,   emoji: "♂" },
  { name: "Ceres",    g: 0.27,   emoji: "⚪" },
  { name: "Jupiter",  g: 24.79,  emoji: "♃" },
  { name: "Saturn",   g: 10.44,  emoji: "♄" },
  { name: "Uranus",   g: 8.87,   emoji: "♅" },
  { name: "Neptune",  g: 11.15,  emoji: "♆" },
  { name: "Pluto",    g: 0.62,   emoji: "🪐" },
  { name: "Sun",      g: 274,    emoji: "☀️" },
];

const fmt = (n: number, d = 4) => parseFloat(n.toPrecision(d)).toString();

export default function PlanetWeightPage() {
  const [v, setV] = useHashState({
    weightUnit: "kg",
    weight: "70",
  });

  const rawWeight = parseFloat(v.weight);
  const weightKg  = v.weightUnit === "kg" ? rawWeight : rawWeight * 0.453592;
  const valid = !isNaN(weightKg) && weightKg > 0;

  // Earth weight in Newtons
  const earthN = weightKg * EARTH_G;

  return (
    <CalculatorShell
      title="Weight on Other Worlds"
      description="How much would you weigh on other planets, moons, and the Sun?"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-muted mb-1">Weight unit</label>
            <select value={v.weightUnit} onChange={e => setV({ weightUnit: e.target.value })} className={sc}>
              <option value="kg">kg (mass)</option>
              <option value="lbs">lbs (pounds)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Your weight on Earth ({v.weightUnit})</label>
            <input type="number" value={v.weight} onChange={e => setV({ weight: e.target.value })} className={ic} min="0" step="any" />
          </div>
        </div>

        {!valid && <p className="text-sm text-red-500">Enter a positive weight.</p>}

        {valid && (
          <div className="mt-2 p-4 bg-card rounded-xl border border-card-border space-y-3">
            <div className="text-sm text-muted mb-1">Earth reference</div>
            <div className="space-y-1 text-xs font-mono mb-2">
              <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded">
                <span className="text-muted">Mass</span>
                <span className="font-semibold">{fmt(weightKg)} kg = {fmt(weightKg / 0.453592)} lbs</span>
              </div>
              <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded">
                <span className="text-muted">Weight (Earth)</span>
                <span className="font-semibold">{fmt(earthN)} N</span>
              </div>
            </div>

            <div className="text-sm text-muted mb-1">Weight on other worlds</div>
            <div className="overflow-x-auto rounded-lg border border-card-border">
              <table className="w-full text-sm font-mono">
                <thead>
                  <tr className="bg-card border-b border-card-border">
                    <th className="text-left px-3 py-2 text-muted font-medium">World</th>
                    <th className="text-right px-3 py-2 text-muted font-medium">g (m/s²)</th>
                    <th className="text-right px-3 py-2 text-muted font-medium">
                      {v.weightUnit === "kg" ? "kg-force" : "lbs-force"}
                    </th>
                    <th className="text-right px-3 py-2 text-muted font-medium">vs Earth</th>
                  </tr>
                </thead>
                <tbody>
                  {WORLDS.map(w => {
                    const wN = weightKg * w.g;
                    const wLocal = v.weightUnit === "kg" ? wN / EARTH_G : (wN / EARTH_G) / 0.453592;
                    const ratio = w.g / EARTH_G;
                    return (
                      <tr key={w.name} className="border-b border-card-border hover:bg-primary-light transition-colors">
                        <td className="px-3 py-2">{w.emoji} {w.name}</td>
                        <td className="px-3 py-2 text-right text-muted">{w.g}</td>
                        <td className="px-3 py-2 text-right font-semibold">{fmt(wLocal)}</td>
                        <td className="px-3 py-2 text-right text-muted">{fmt(ratio * 100, 3)}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted">
              Note: kg-force shown for comparison (weight you would feel). Mass remains constant everywhere.
              Surface gravity values are averages at the equator/cloud tops for gas giants.
            </p>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
