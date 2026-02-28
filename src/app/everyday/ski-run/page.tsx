"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

// Ski resort vertical drops for reference
const FAMOUS_RUNS = [
  { name: "Vallée Blanche (Chamonix)", vert: 2807, dist: 20000, diff: "Black" },
  { name: "La Grave, France", vert: 2150, dist: 8000, diff: "Black" },
  { name: "Jackson Hole (Corbet's Couloir)", vert: 1262, dist: 4800, diff: "Black" },
  { name: "Whistler (Peak to Creek)", vert: 1530, dist: 11000, diff: "Blue" },
  { name: "Snowbird, Utah", vert: 1097, dist: 4800, diff: "Black" },
  { name: "Verbier (Mont Fort)", vert: 1525, dist: 5500, diff: "Black" },
  { name: "Vail (Blue Sky Basin)", vert: 800, dist: 5000, diff: "Blue" },
  { name: "Park City (King Con)", vert: 600, dist: 2000, diff: "Black" },
];

export default function SkiRunPage() {
  const [v, setV] = useHashState({ vert: "500", dist: "2000", unit: "metric" });

  const unit = v.unit as "metric" | "imperial";
  const vertM = unit === "metric" ? parseFloat(v.vert) : parseFloat(v.vert) * 0.3048;
  const distM = unit === "metric" ? parseFloat(v.dist) : parseFloat(v.dist) * 0.3048;
  const valid = vertM > 0 && distM > 0 && distM >= vertM;

  // Derived metrics
  const grade = valid ? (vertM / distM) * 100 : 0;
  const angleDeg = valid ? Math.atan(vertM / Math.sqrt(distM * distM - vertM * vertM)) * (180 / Math.PI) : 0;
  const horizontalM = valid ? Math.sqrt(distM * distM - vertM * vertM) : 0;

  // Time to ski down at typical speeds
  function timeAtSpeed(speedKph: number): string {
    if (!valid) return "—";
    const speedMs = speedKph / 3.6;
    const seconds = distM / speedMs;
    const m = Math.floor(seconds / 60);
    const s = Math.round(seconds % 60);
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  }

  // Difficulty category
  function difficulty(): { label: string; color: string } {
    if (angleDeg < 12) return { label: "Green (Beginner)", color: "text-success" };
    if (angleDeg < 20) return { label: "Blue (Intermediate)", color: "text-blue-500" };
    if (angleDeg < 30) return { label: "Black (Advanced)", color: "text-foreground" };
    return { label: "Double Black (Expert)", color: "text-danger" };
  }

  const diff = valid ? difficulty() : null;

  const vertLabel = unit === "metric" ? "m" : "ft";
  const distLabel = unit === "metric" ? "m" : "ft";
  const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

  return (
    <CalculatorShell title="Ski Run Calculator" description="Calculate vertical drop, slope angle, grade, and estimated run time.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => setV({ unit: "metric" })}
            className={`py-2 rounded-lg text-sm font-medium transition-colors ${unit === "metric" ? "bg-primary text-white" : "bg-background border border-card-border"}`}>
            Metric (m)
          </button>
          <button onClick={() => setV({ unit: "imperial" })}
            className={`py-2 rounded-lg text-sm font-medium transition-colors ${unit === "imperial" ? "bg-primary text-white" : "bg-background border border-card-border"}`}>
            Imperial (ft)
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-muted mb-1">Vertical Drop ({vertLabel})</label>
            <input type="number" value={v.vert} onChange={e => setV({ vert: e.target.value })} className={ic} min="0" step="1" />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Run Length ({distLabel})</label>
            <input type="number" value={v.dist} onChange={e => setV({ dist: e.target.value })} className={ic} min="0" step="1" />
          </div>
        </div>

        {valid && diff && (
          <div className="space-y-3">
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="block text-sm text-muted">Slope Angle</span>
              <span className="block font-mono font-bold text-4xl text-primary">{angleDeg.toFixed(1)}°</span>
              <span className={`block text-sm font-semibold mt-1 ${diff.color}`}>{diff.label}</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="px-3 py-2.5 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">Grade</span>
                <span className="font-mono font-bold">{grade.toFixed(1)}%</span>
              </div>
              <div className="px-3 py-2.5 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">Horizontal</span>
                <span className="font-mono font-bold">
                  {unit === "metric"
                    ? horizontalM >= 1000 ? `${(horizontalM / 1000).toFixed(2)} km` : `${horizontalM.toFixed(0)} m`
                    : `${(horizontalM / 0.3048).toFixed(0)} ft`}
                </span>
              </div>
              <div className="px-3 py-2.5 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">Vert Drop</span>
                <span className="font-mono font-bold">{unit === "metric" ? `${vertM.toFixed(0)} m` : `${parseFloat(v.vert).toFixed(0)} ft`}</span>
              </div>
            </div>

            <div>
              <p className="text-xs text-muted mb-1.5">Estimated run time by speed</p>
              <div className="grid grid-cols-2 gap-1 text-xs font-mono">
                {[20, 30, 50, 80, 100, 130].map(spd => (
                  <div key={spd} className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded">
                    <span className="text-muted">{spd} km/h</span>
                    <span>{timeAtSpeed(spd)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {!valid && parseFloat(v.dist) > 0 && parseFloat(v.vert) > parseFloat(v.dist) && (
          <p className="text-sm text-danger">Run length must be greater than vertical drop.</p>
        )}

        <div>
          <p className="text-xs text-muted mb-1.5">Famous runs for reference:</p>
          <div className="space-y-1">
            {FAMOUS_RUNS.map(r => (
              <button
                key={r.name}
                onClick={() => setV({
                  unit: "metric",
                  vert: r.vert.toString(),
                  dist: r.dist.toString(),
                })}
                className="w-full text-left px-3 py-2 text-xs bg-background border border-card-border rounded-lg hover:bg-primary-light flex justify-between items-center"
              >
                <span className="font-medium">{r.name}</span>
                <span className="text-muted font-mono">{r.vert}m vert · {r.diff}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </CalculatorShell>
  );
}
