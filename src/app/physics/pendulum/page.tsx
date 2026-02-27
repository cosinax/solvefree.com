"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

const PLANETS = [
  { name: "Earth", g: 9.81 },
  { name: "Moon", g: 1.62 },
  { name: "Mars", g: 3.72 },
  { name: "Jupiter", g: 24.79 },
  { name: "Venus", g: 8.87 },
  { name: "Saturn", g: 10.44 },
];

export default function PendulumPage() {
  const [v, setV] = useHashState({
    length: "",
    gravity: "9.81",
    amplitude: "",
    mass: "",
  });

  const L = parseFloat(v.length);
  const g = parseFloat(v.gravity) || 9.81;
  const amp = parseFloat(v.amplitude);
  const m = parseFloat(v.mass);

  let period: number | null = null;
  let frequency: number | null = null;
  let omega: number | null = null;
  let maxPE: number | null = null;

  if (!isNaN(L) && L > 0 && g > 0) {
    period = 2 * Math.PI * Math.sqrt(L / g);
    frequency = 1 / period;
    omega = 2 * Math.PI * frequency;

    if (!isNaN(amp) && !isNaN(m)) {
      const h = L * (1 - Math.cos((amp * Math.PI) / 180));
      maxPE = m * g * h;
    }
  }

  const fmt = (n: number) => parseFloat(n.toPrecision(5)).toString();

  return (
    <CalculatorShell
      title="Pendulum Calculator"
      description="Calculate the period, frequency, and angular frequency of a simple pendulum. T = 2π√(L/g)."
    >
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-muted mb-1">Length (m)</label>
            <input type="number" value={v.length} onChange={e => setV({ length: e.target.value })} placeholder="e.g. 1" className={ic} />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Gravity g (m/s²)</label>
            <input type="number" value={v.gravity} onChange={e => setV({ gravity: e.target.value })} placeholder="9.81" className={ic} />
          </div>
        </div>

        <details>
          <summary className="cursor-pointer text-sm text-muted hover:text-primary">Energy calculation (optional)</summary>
          <div className="mt-2 grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-muted mb-1">Amplitude (°)</label>
              <input type="number" value={v.amplitude} onChange={e => setV({ amplitude: e.target.value })} placeholder="e.g. 15" className={ic} />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1">Bob mass (kg)</label>
              <input type="number" value={v.mass} onChange={e => setV({ mass: e.target.value })} placeholder="e.g. 0.5" className={ic} />
            </div>
          </div>
        </details>

        {period !== null && (
          <div className="space-y-3">
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="block text-xs text-muted mb-1">Period (T)</span>
              <span className="block font-mono font-bold text-4xl text-primary">{fmt(period)} s</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="px-4 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">Frequency</span>
                <span className="font-mono font-bold text-xl">{fmt(frequency!)} Hz</span>
              </div>
              <div className="px-4 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">Angular freq (ω)</span>
                <span className="font-mono font-bold text-xl">{fmt(omega!)} rad/s</span>
              </div>
            </div>

            {maxPE !== null && (
              <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
                <span className="text-muted">Max potential energy</span>
                <span>{fmt(maxPE)} J</span>
              </div>
            )}

            <div className="space-y-1">
              <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
                <span className="text-muted">Formula</span>
                <span>T = 2π√(L/g)</span>
              </div>
            </div>
          </div>
        )}

        <div className="border-t border-card-border pt-4">
          <h3 className="text-sm font-semibold mb-2">Period on other worlds (same L = {v.length || "1"} m)</h3>
          {!isNaN(L) && L > 0 ? (
            <div className="space-y-1">
              {PLANETS.map(p => {
                const T = 2 * Math.PI * Math.sqrt(L / p.g);
                return (
                  <div key={p.name} className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
                    <span className="text-muted">{p.name} (g = {p.g})</span>
                    <span>T = {fmt(T)} s</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-muted">Enter a length above to see planetary comparison.</p>
          )}
        </div>
      </div>
    </CalculatorShell>
  );
}
