"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

const G = 6.674e-11;

const PLANETS = [
  { name: "Earth", M: 5.972e24, r: 6.371e6 },
  { name: "Moon", M: 7.342e22, r: 1.737e6 },
  { name: "Mars", M: 6.417e23, r: 3.39e6 },
  { name: "Jupiter", M: 1.898e27, r: 6.991e7 },
  { name: "Venus", M: 4.867e24, r: 6.052e6 },
  { name: "Saturn", M: 5.683e26, r: 5.823e7 },
];

export default function GravitationalPage() {
  const [v, setV] = useHashState({
    m1: "",
    m2: "",
    distance: "",
    surfM: "",
    surfR: "",
  });

  const m1 = parseFloat(v.m1);
  const m2 = parseFloat(v.m2);
  const r = parseFloat(v.distance);
  const surfM = parseFloat(v.surfM);
  const surfR = parseFloat(v.surfR);

  let force: number | null = null;
  let surfaceG: number | null = null;

  if (!isNaN(m1) && !isNaN(m2) && !isNaN(r) && r > 0) {
    force = (G * m1 * m2) / (r * r);
  }

  if (!isNaN(surfM) && !isNaN(surfR) && surfR > 0) {
    surfaceG = (G * surfM) / (surfR * surfR);
  }

  const fmt = (n: number) => {
    if (Math.abs(n) >= 1e6 || (Math.abs(n) < 0.001 && n !== 0)) {
      return n.toExponential(4);
    }
    return parseFloat(n.toPrecision(5)).toString();
  };

  return (
    <CalculatorShell
      title="Gravitational Force Calculator"
      description="Newton's law of gravitation: F = G × m₁ × m₂ / r². Also computes surface gravity g = GM/r²."
    >
      <div className="space-y-6">
        {/* Gravitational force */}
        <div className="border border-card-border rounded-xl p-4 space-y-3">
          <h3 className="text-sm font-semibold">Gravitational Force — F = G × m₁ × m₂ / r²</h3>
          <p className="text-xs text-muted">G = 6.674 × 10⁻¹¹ N·m²/kg²</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-muted mb-1">Mass 1 (kg)</label>
              <input type="number" value={v.m1} onChange={e => setV({ m1: e.target.value })} placeholder="e.g. 5.972e24" className={ic} />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1">Mass 2 (kg)</label>
              <input type="number" value={v.m2} onChange={e => setV({ m2: e.target.value })} placeholder="e.g. 7.342e22" className={ic} />
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-muted mb-1">Distance between centers (m)</label>
              <input type="number" value={v.distance} onChange={e => setV({ distance: e.target.value })} placeholder="e.g. 3.844e8" className={ic} />
            </div>
          </div>
          {force !== null && (
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="block text-xs text-muted mb-1">Gravitational Force</span>
              <span className="block font-mono font-bold text-3xl text-primary">{fmt(force)} N</span>
            </div>
          )}
        </div>

        {/* Surface gravity */}
        <div className="border border-card-border rounded-xl p-4 space-y-3">
          <h3 className="text-sm font-semibold">Surface Gravity — g = GM / r²</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-muted mb-1">Planet mass (kg)</label>
              <input type="number" value={v.surfM} onChange={e => setV({ surfM: e.target.value })} placeholder="e.g. 5.972e24" className={ic} />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1">Planet radius (m)</label>
              <input type="number" value={v.surfR} onChange={e => setV({ surfR: e.target.value })} placeholder="e.g. 6.371e6" className={ic} />
            </div>
          </div>
          {surfaceG !== null && (
            <div className="bg-primary-light rounded-xl p-3 text-center">
              <span className="block text-xs text-muted mb-1">Surface gravity</span>
              <span className="block font-mono font-bold text-3xl text-primary">{fmt(surfaceG)} m/s²</span>
            </div>
          )}
        </div>

        {/* Planet reference */}
        <div className="border-t border-card-border pt-4">
          <h3 className="text-sm font-semibold mb-2">Planet reference</h3>
          <div className="space-y-1">
            {PLANETS.map(p => {
              const g = (G * p.M) / (p.r * p.r);
              return (
                <div key={p.name} className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
                  <span className="text-muted">{p.name}</span>
                  <span>g = {g.toFixed(2)} m/s² · M = {p.M.toExponential(3)} kg</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </CalculatorShell>
  );
}
