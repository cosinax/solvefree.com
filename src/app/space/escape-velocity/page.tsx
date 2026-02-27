"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
const sc = "w-full px-3 py-2 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm";

const G = 6.674e-11;
const C = 299792458; // m/s
const MACH = 340.29; // m/s at sea level

interface Body { label: string; mass: number; radius_km: number }

const BODIES: Record<string, Body> = {
  sun:     { label: "Sun",             mass: 1.989e30, radius_km: 695700 },
  earth:   { label: "Earth",           mass: 5.972e24, radius_km: 6371 },
  moon:    { label: "Moon",            mass: 7.342e22, radius_km: 1737.4 },
  mars:    { label: "Mars",            mass: 6.417e23, radius_km: 3389.5 },
  jupiter: { label: "Jupiter",         mass: 1.898e27, radius_km: 69911 },
  neutron: { label: "Neutron star (ex)", mass: 2.8e30,  radius_km: 10 },
  custom:  { label: "Custom",          mass: 0,        radius_km: 0 },
};

const fmt = (n: number, d = 5) => parseFloat(n.toPrecision(d)).toString();

export default function EscapeVelocityPage() {
  const [v, setV] = useHashState({
    bodyKey: "earth",
    customMass: "5.972e24",
    customRadius: "6371",
  });

  const body = BODIES[v.bodyKey];
  const massKg = v.bodyKey === "custom" ? parseFloat(v.customMass) : body.mass;
  const radius_km = v.bodyKey === "custom" ? parseFloat(v.customRadius) : body.radius_km;

  let vEsc_ms: number | null = null;
  let error = "";

  if (isNaN(massKg) || massKg <= 0) error = "Enter a valid mass.";
  else if (isNaN(radius_km) || radius_km <= 0) error = "Enter a valid radius.";
  else {
    const R = radius_km * 1e3;
    vEsc_ms = Math.sqrt(2 * G * massKg / R);
  }

  const TABLE_BODIES = Object.entries(BODIES).filter(([k]) => k !== "custom");

  return (
    <CalculatorShell
      title="Escape Velocity Calculator"
      description="v_esc = √(2GM/R) — minimum speed to escape a body's gravitational well."
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-muted mb-1">Body</label>
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
              <label className="block text-sm text-muted mb-1">Radius (km)</label>
              <input type="number" value={v.customRadius} onChange={e => setV({ customRadius: e.target.value })} className={ic} min="0" step="any" />
            </div>
          </div>
        )}

        {error && <p className="text-sm text-red-500">{error}</p>}

        {vEsc_ms !== null && (
          <div className="mt-4 p-4 bg-card rounded-xl border border-card-border space-y-2">
            <div className="text-sm text-muted mb-1">Escape Velocity</div>
            <div className="text-2xl font-bold font-mono">{fmt(vEsc_ms / 1e3)} km/s</div>
            <div className="mt-2 space-y-1 text-xs font-mono">
              {[
                ["m/s",       fmt(vEsc_ms) + " m/s"],
                ["km/s",      fmt(vEsc_ms / 1e3) + " km/s"],
                ["km/h",      fmt(vEsc_ms * 3.6) + " km/h"],
                ["Mach",      fmt(vEsc_ms / MACH)],
                ["% of c",    fmt((vEsc_ms / C) * 100) + " %"],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded">
                  <span className="text-muted">{label}</span><span className="font-semibold">{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Comparison table */}
        <div>
          <p className="text-xs text-muted mb-1 mt-2">Escape velocities — common bodies:</p>
          <div className="overflow-x-auto rounded-lg border border-card-border">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="bg-card border-b border-card-border">
                  <th className="text-left px-3 py-2 text-muted font-medium">Body</th>
                  <th className="text-right px-3 py-2 text-muted font-medium">km/s</th>
                  <th className="text-right px-3 py-2 text-muted font-medium">Mach</th>
                  <th className="text-right px-3 py-2 text-muted font-medium">% of c</th>
                </tr>
              </thead>
              <tbody>
                {TABLE_BODIES.map(([k, b]) => {
                  const ve = Math.sqrt(2 * G * b.mass / (b.radius_km * 1e3));
                  return (
                    <tr
                      key={k}
                      className={`border-b border-card-border cursor-pointer hover:bg-primary-light transition-colors ${v.bodyKey === k ? "bg-primary-light" : ""}`}
                      onClick={() => setV({ bodyKey: k })}
                    >
                      <td className="px-3 py-1.5">{b.label}</td>
                      <td className="px-3 py-1.5 text-right">{fmt(ve / 1e3)}</td>
                      <td className="px-3 py-1.5 text-right">{fmt(ve / MACH)}</td>
                      <td className="px-3 py-1.5 text-right">{fmt((ve / C) * 100)}</td>
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
