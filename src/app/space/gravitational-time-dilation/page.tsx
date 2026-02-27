"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
const sc = "w-full px-3 py-2 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm";

const G = 6.674e-11;
const C = 299792458; // m/s

interface Preset { label: string; mass: number; radius_km: number }

const PRESETS: Record<string, Preset> = {
  earth_surface: { label: "Earth surface",   mass: 5.972e24, radius_km: 6371 },
  iss:           { label: "ISS orbit",        mass: 5.972e24, radius_km: 6371 + 408 },
  moon_surface:  { label: "Moon surface",     mass: 7.342e22, radius_km: 1737.4 },
  mars_surface:  { label: "Mars surface",     mass: 6.417e23, radius_km: 3389.5 },
  sun_surface:   { label: "Sun surface",      mass: 1.989e30, radius_km: 695700 },
  neutron:       { label: "Neutron star (ex)", mass: 2.8e30, radius_km: 10 },
  custom:        { label: "Custom",            mass: 0, radius_km: 0 },
};

const fmt = (n: number, d = 6) => parseFloat(n.toPrecision(d)).toString();

export default function GravTimeDilationPage() {
  const [v, setV] = useHashState({
    presetKey: "earth_surface",
    customMass: "5.972e24",
    customRadius: "6371",
  });

  const presetKey = v.presetKey;
  const preset = PRESETS[presetKey];
  const mass_kg   = presetKey === "custom" ? parseFloat(v.customMass)   : preset.mass;
  const radius_km = presetKey === "custom" ? parseFloat(v.customRadius) : preset.radius_km;

  let error = "";
  interface GTResult {
    ratio: number;
    us_per_day: number;
    s_per_year: number;
    rs_over_r: number;
  }
  let result: GTResult | null = null;

  if (isNaN(mass_kg) || mass_kg <= 0) error = "Enter valid mass.";
  else if (isNaN(radius_km) || radius_km <= 0) error = "Enter valid radius.";
  else {
    const R = radius_km * 1e3;
    const rs_over_r = (2 * G * mass_kg) / (R * C * C);
    if (rs_over_r >= 1) {
      error = "Radius is inside or at the Schwarzschild radius (black hole). Time dilation is infinite.";
    } else {
      const ratio = Math.sqrt(1 - rs_over_r);
      const us_per_day = (1 - ratio) * 86400 * 1e6; // microseconds per day slower vs. infinity
      const s_per_year = (1 - ratio) * 365.25 * 86400;
      result = { ratio, us_per_day, s_per_year, rs_over_r };
    }
  }

  return (
    <CalculatorShell
      title="Gravitational Time Dilation"
      description="Δt_surface/Δt_far = √(1 − 2GM/Rc²) — clocks run slower deeper in a gravity well."
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-muted mb-1">Location / body</label>
          <select value={v.presetKey} onChange={e => setV({ presetKey: e.target.value })} className={sc}>
            {Object.entries(PRESETS).map(([k, p]) => (
              <option key={k} value={k}>{p.label}</option>
            ))}
          </select>
        </div>

        {presetKey === "custom" && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-muted mb-1">Mass (kg)</label>
              <input type="text" value={v.customMass} onChange={e => setV({ customMass: e.target.value })} className={ic} placeholder="e.g. 5.972e24" />
            </div>
            <div>
              <label className="block text-sm text-muted mb-1">Radius (km)</label>
              <input type="number" value={v.customRadius} onChange={e => setV({ customRadius: e.target.value })} className={ic} min="0" step="any" />
            </div>
          </div>
        )}

        {error && <p className="text-sm text-red-500">{error}</p>}

        {result && (
          <div className="mt-4 p-4 bg-card rounded-xl border border-card-border space-y-2">
            <div className="text-sm text-muted mb-1">Time Dilation Results</div>
            <div className="bg-primary-light rounded-lg p-3 text-center mb-2">
              <span className="text-xs text-muted block">Time ratio (surface / far away)</span>
              <span className="text-2xl font-bold font-mono text-primary">{fmt(result.ratio, 9)}</span>
            </div>
            <div className="space-y-1 text-xs font-mono">
              {[
                ["Time ratio",               fmt(result.ratio, 10)],
                ["rs / R (compactness)",      fmt(result.rs_over_r, 6)],
                ["Slower vs. ∞ (μs/day)",    fmt(result.us_per_day, 6) + " μs/day"],
                ["Slower vs. ∞ (s/year)",    fmt(result.s_per_year, 6) + " s/yr"],
                ["Slower vs. ∞ (ms/year)",   fmt(result.s_per_year * 1e3, 6) + " ms/yr"],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded">
                  <span className="text-muted">{label}</span><span className="font-semibold">{val}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted mt-2">
              A ratio of 0.9999... means clocks at this location tick slightly slower than clocks infinitely far from all gravity.
              GPS satellites must correct for both gravitational and velocity time dilation.
            </p>
          </div>
        )}

        {/* Comparison table */}
        <div>
          <p className="text-xs text-muted mb-1 mt-2">Comparison:</p>
          <div className="overflow-x-auto rounded-lg border border-card-border">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="bg-card border-b border-card-border">
                  <th className="text-left px-3 py-2 text-muted font-medium">Location</th>
                  <th className="text-right px-3 py-2 text-muted font-medium">Ratio</th>
                  <th className="text-right px-3 py-2 text-muted font-medium">μs/day slower</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(PRESETS).filter(([k]) => k !== "custom").map(([k, p]) => {
                  const R = p.radius_km * 1e3;
                  const rsr = (2 * G * p.mass) / (R * C * C);
                  if (rsr >= 1) return null;
                  const ratio = Math.sqrt(1 - rsr);
                  const uspd = (1 - ratio) * 86400 * 1e6;
                  return (
                    <tr
                      key={k}
                      className={`border-b border-card-border cursor-pointer hover:bg-primary-light transition-colors ${v.presetKey === k ? "bg-primary-light" : ""}`}
                      onClick={() => setV({ presetKey: k })}
                    >
                      <td className="px-3 py-1.5">{p.label}</td>
                      <td className="px-3 py-1.5 text-right">{fmt(ratio, 10)}</td>
                      <td className="px-3 py-1.5 text-right">{fmt(uspd, 4)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </CalculatorShell>
  );
}
