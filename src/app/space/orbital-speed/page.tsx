"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
const sc = "w-full px-3 py-2 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm";

const G = 6.674e-11;

interface Body { label: string; mass: number; radius_km: number }

const BODIES: Record<string, Body> = {
  earth:   { label: "Earth",   mass: 5.972e24, radius_km: 6371 },
  moon:    { label: "Moon",    mass: 7.342e22, radius_km: 1737.4 },
  mars:    { label: "Mars",    mass: 6.417e23, radius_km: 3389.5 },
  jupiter: { label: "Jupiter", mass: 1.898e27, radius_km: 69911 },
  sun:     { label: "Sun",     mass: 1.989e30, radius_km: 695700 },
  custom:  { label: "Custom",  mass: 0,        radius_km: 0 },
};

const fmt = (n: number, d = 5) => parseFloat(n.toPrecision(d)).toString();

function fmtPeriod(s: number): string {
  const h = s / 3600;
  const d = s / 86400;
  if (d >= 1) return `${fmt(d)} d`;
  if (h >= 1) return `${fmt(h)} h`;
  return `${fmt(s / 60)} min`;
}

function altitudeHint(alt_km: number): string {
  if (alt_km < 200)   return "Sub-orbital";
  if (alt_km < 2000)  return "LEO (Low Earth Orbit)";
  if (alt_km < 8000)  return "MEO (Medium Earth Orbit)";
  if (alt_km < 36786) return "Below GEO";
  if (alt_km < 36787) return "GEO (Geostationary)";
  return "HEO (High Earth Orbit)";
}

export default function OrbitalSpeedPage() {
  const [v, setV] = useHashState({
    bodyKey: "earth",
    altitude: "408",
    customMass: "5.972e24",
    customRadius: "6371",
  });

  const body = BODIES[v.bodyKey];
  const massKg    = v.bodyKey === "custom" ? parseFloat(v.customMass)   : body.mass;
  const bodyR_km  = v.bodyKey === "custom" ? parseFloat(v.customRadius) : body.radius_km;
  const alt_km    = parseFloat(v.altitude);

  let error = "";
  interface OSResult {
    v_circ: number;
    v_esc: number;
    period_s: number;
    r_km: number;
  }
  let result: OSResult | null = null;

  if (isNaN(massKg) || massKg <= 0) error = "Enter valid body mass.";
  else if (isNaN(bodyR_km) || bodyR_km <= 0) error = "Enter valid body radius.";
  else if (isNaN(alt_km) || alt_km < 0) error = "Enter valid altitude.";
  else {
    const r = (bodyR_km + alt_km) * 1e3;
    const v_circ = Math.sqrt((G * massKg) / r);
    const v_esc  = Math.sqrt(2 * G * massKg / r);
    const period_s = 2 * Math.PI * Math.sqrt(Math.pow(r, 3) / (G * massKg));
    result = { v_circ, v_esc, period_s, r_km: bodyR_km + alt_km };
  }

  const PRESETS = [
    { label: "ISS",    alt: "408",   bodyKey: "earth" },
    { label: "GPS",    alt: "20200", bodyKey: "earth" },
    { label: "GEO",    alt: "35786", bodyKey: "earth" },
    { label: "Moon",   alt: "100",   bodyKey: "moon" },
    { label: "Mars LO",alt: "300",   bodyKey: "mars" },
  ];

  return (
    <CalculatorShell
      title="Orbital Speed Calculator"
      description="v = √(GM/r) — circular orbital velocity at any altitude above any body."
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-muted mb-1">Central body</label>
          <select value={v.bodyKey} onChange={e => setV({ bodyKey: e.target.value })} className={sc}>
            {Object.entries(BODIES).map(([k, b]) => (
              <option key={k} value={k}>{b.label}</option>
            ))}
          </select>
        </div>

        {v.bodyKey === "custom" && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-muted mb-1">Mass (kg)</label>
              <input type="text" value={v.customMass} onChange={e => setV({ customMass: e.target.value })} className={ic} placeholder="e.g. 5.972e24" />
            </div>
            <div>
              <label className="block text-sm text-muted mb-1">Equatorial radius (km)</label>
              <input type="number" value={v.customRadius} onChange={e => setV({ customRadius: e.target.value })} className={ic} min="0" step="any" />
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm text-muted mb-1">Altitude above surface (km)</label>
          <input type="number" value={v.altitude} onChange={e => setV({ altitude: e.target.value })} className={ic} min="0" step="any" />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        {result && (
          <div className="mt-4 p-4 bg-card rounded-xl border border-card-border space-y-2">
            {v.bodyKey === "earth" && (
              <div className="text-xs font-mono text-primary bg-primary-light px-3 py-1.5 rounded mb-1">
                {altitudeHint(alt_km)}
              </div>
            )}
            <div className="bg-primary-light rounded-lg p-3 text-center mb-2">
              <span className="text-xs text-muted block">Circular orbital speed</span>
              <span className="text-2xl font-bold font-mono text-primary">{fmt(result.v_circ / 1e3)} km/s</span>
            </div>
            <div className="space-y-1 text-xs font-mono">
              {[
                ["Orbital radius",          fmt(result.r_km) + " km"],
                ["Orbital speed (m/s)",     fmt(result.v_circ) + " m/s"],
                ["Orbital speed (km/s)",    fmt(result.v_circ / 1e3) + " km/s"],
                ["Orbital speed (km/h)",    fmt(result.v_circ * 3.6) + " km/h"],
                ["Escape velocity (km/s)",  fmt(result.v_esc / 1e3) + " km/s"],
                ["Orbital period",          fmtPeriod(result.period_s)],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded">
                  <span className="text-muted">{label}</span><span className="font-semibold">{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <p className="text-xs text-muted mb-1">Common orbits:</p>
          <div className="grid grid-cols-3 gap-1 sm:grid-cols-5">
            {PRESETS.map(p => (
              <button
                key={p.label}
                onClick={() => setV({ bodyKey: p.bodyKey, altitude: p.alt })}
                className="px-2 py-1.5 text-xs font-mono bg-background border border-card-border rounded hover:bg-primary-light transition-colors text-center"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </CalculatorShell>
  );
}
