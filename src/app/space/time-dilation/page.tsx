"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

// Special relativity: velocity-based time dilation (Lorentz factor)
// γ = 1 / sqrt(1 - v²/c²)
// Moving clock ticks slower: τ = t / γ
// Twin paradox: traveler ages less during round trip

const C = 299792458;
const YEAR_S = 365.25 * 86400;

function fmtTime(s: number): string {
  if (!isFinite(s)) return "∞";
  const y = s / YEAR_S;
  if (y >= 1) return y.toFixed(4) + " yr";
  const d = s / 86400;
  if (d >= 1) return d.toFixed(2) + " days";
  const h = s / 3600;
  if (h >= 1) return h.toFixed(2) + " hr";
  const m = s / 60;
  if (m >= 1) return m.toFixed(2) + " min";
  return s.toFixed(3) + " s";
}

const VELOCITY_PRESETS = [
  { label: "ISS (7.66 km/s)", beta: 7660 / C },
  { label: "Parker Solar Probe (~190 km/s)", beta: 190000 / C },
  { label: "0.1c", beta: 0.1 },
  { label: "0.5c", beta: 0.5 },
  { label: "0.9c", beta: 0.9 },
  { label: "0.99c", beta: 0.99 },
  { label: "0.9999c", beta: 0.9999 },
];

export default function TimeDilationPage() {
  const [v, setV] = useHashState({
    beta: "0.9",         // v/c
    duration: "10",      // coordinate time in years
    durationUnit: "yr",
  });

  const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
  const sc = "w-full px-3 py-2 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm";

  const beta = parseFloat(v.beta);
  const valid = isFinite(beta) && beta > 0 && beta < 1;

  const gamma = valid ? 1 / Math.sqrt(1 - beta * beta) : null;

  let dur_s = parseFloat(v.duration);
  if (v.durationUnit === "yr") dur_s *= YEAR_S;
  else if (v.durationUnit === "days") dur_s *= 86400;
  else if (v.durationUnit === "hr") dur_s *= 3600;

  const tau_s = (gamma && isFinite(dur_s) && dur_s > 0) ? dur_s / gamma : null;

  // Velocity in km/s
  const v_kms = beta * C / 1000;

  return (
    <CalculatorShell
      title="Velocity Time Dilation"
      description="Lorentz factor and time dilation for motion at relativistic speeds."
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-muted mb-1">
            Velocity (fraction of c) — β = v/c
          </label>
          <input type="number" value={v.beta} onChange={e => setV({ beta: e.target.value })}
            className={ic} min="0" max="0.9999999" step="any" />
          <div className="flex flex-wrap gap-1 mt-1">
            {VELOCITY_PRESETS.map(p => (
              <button key={p.label}
                onClick={() => setV({ beta: p.beta.toPrecision(6) })}
                className="text-xs px-2 py-0.5 bg-background border border-card-border rounded hover:bg-primary-light transition-colors">
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {valid && gamma && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-primary-light rounded-xl p-4 text-center">
                <span className="block text-xs text-muted mb-1">Lorentz factor γ</span>
                <span className="block font-mono font-bold text-2xl text-primary">
                  {gamma >= 1000 ? gamma.toExponential(4) : gamma.toFixed(6)}
                </span>
              </div>
              <div className="bg-card border border-card-border rounded-xl p-4 text-center">
                <span className="block text-xs text-muted mb-1">Speed</span>
                <span className="block font-mono font-bold text-lg">
                  {v_kms >= 1e6 ? (v_kms / 1e6).toFixed(4) + "M km/s" : v_kms.toFixed(2) + " km/s"}
                </span>
                <span className="text-xs text-muted">{(beta * 100).toFixed(6)}% of c</span>
              </div>
            </div>

            <div className="space-y-1 text-xs font-mono">
              {[
                ["γ (Lorentz factor)", gamma >= 1e9 ? gamma.toExponential(4) : gamma.toFixed(8)],
                ["Time dilation", `moving clock runs at ${(1/gamma * 100).toFixed(6)}% rate`],
                ["Length contraction", `${(1/gamma * 100).toFixed(6)}% of rest length`],
                ["Kinetic energy factor", (gamma - 1).toExponential(4) + " × mc²"],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded">
                  <span className="text-muted">{label}</span>
                  <span className="font-semibold">{val}</span>
                </div>
              ))}
            </div>

            {/* Duration calculator */}
            <div className="border-t border-card-border pt-3">
              <p className="text-xs text-muted mb-2 font-semibold">Twin paradox: time elapsed at this speed</p>
              <div className="flex gap-2 mb-2">
                <input type="number" value={v.duration} onChange={e => setV({ duration: e.target.value })}
                  className={ic + " flex-1"} min="0" step="any" />
                <select value={v.durationUnit} onChange={e => setV({ durationUnit: e.target.value })} className={sc + " w-24"}>
                  <option value="yr">yr</option>
                  <option value="days">days</option>
                  <option value="hr">hr</option>
                  <option value="s">s</option>
                </select>
              </div>
              {tau_s && (
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="px-3 py-2 bg-primary-light rounded-lg text-center">
                    <div className="text-muted">Observer time</div>
                    <div className="font-mono font-bold">{fmtTime(dur_s)}</div>
                  </div>
                  <div className="px-3 py-2 bg-card border border-card-border rounded-lg text-center">
                    <div className="text-muted">Traveler ages</div>
                    <div className="font-mono font-bold">{fmtTime(tau_s)}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {!valid && v.beta !== "" && (
          <p className="text-sm text-red-500">Velocity must be between 0 and 1 (fraction of c).</p>
        )}

        {/* Reference table */}
        <div>
          <p className="text-xs text-muted mb-1">Reference: γ by velocity</p>
          <div className="overflow-x-auto rounded-lg border border-card-border">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="bg-card border-b border-card-border">
                  <th className="text-left px-3 py-2 text-muted font-medium">v/c (β)</th>
                  <th className="text-right px-3 py-2 text-muted font-medium">γ</th>
                  <th className="text-right px-3 py-2 text-muted font-medium">Clock rate</th>
                </tr>
              </thead>
              <tbody>
                {[0.1, 0.5, 0.8, 0.9, 0.99, 0.999, 0.9999, 0.99999].map(b => {
                  const g = 1 / Math.sqrt(1 - b * b);
                  const isCurrent = Math.abs(b - beta) < 1e-9;
                  return (
                    <tr key={b}
                      onClick={() => setV({ beta: b.toString() })}
                      className={`border-b border-card-border cursor-pointer hover:bg-primary-light transition-colors ${isCurrent ? "bg-primary-light" : ""}`}>
                      <td className="px-3 py-1.5">{b}c</td>
                      <td className="px-3 py-1.5 text-right">{g >= 1000 ? g.toExponential(3) : g.toFixed(4)}</td>
                      <td className="px-3 py-1.5 text-right">{(100/g).toFixed(4)}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="px-4 py-3 bg-background border border-card-border rounded-lg text-xs text-muted space-y-1">
          <p className="font-semibold text-foreground">Special relativity</p>
          <p>γ = 1/√(1−v²/c²). A moving clock ticks at 1/γ the rate of a stationary clock. For a round trip at constant speed, the traveler ages 2×τ while the Earth observer ages 2×t = 2×γτ. For accelerating rockets see the Relativistic Rocket Travel calculator.</p>
        </div>
      </div>
    </CalculatorShell>
  );
}
