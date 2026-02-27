"use client";
import { useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
const sc = "w-full px-3 py-2 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm";

const G = 6.674e-11;

const CENTRAL_BODIES: Record<string, { label: string; mass: number }> = {
  sun:     { label: "Sun",     mass: 1.989e30 },
  earth:   { label: "Earth",   mass: 5.972e24 },
  jupiter: { label: "Jupiter", mass: 1.898e27 },
  mars:    { label: "Mars",    mass: 6.417e23 },
  moon:    { label: "Moon",    mass: 7.342e22 },
  custom:  { label: "Custom",  mass: 0 },
};

const PRESETS: { label: string; a_km: number; body: string }[] = [
  { label: "ISS",           a_km: 6778,          body: "earth" },
  { label: "Moon",          a_km: 384400,         body: "earth" },
  { label: "Geostationary", a_km: 42164,          body: "earth" },
  { label: "Earth (Sun)",   a_km: 149597870.7,    body: "sun"   },
  { label: "Mars (Sun)",    a_km: 227940000,       body: "sun"   },
  { label: "Jupiter (Sun)", a_km: 778600000,       body: "sun"   },
];

const fmt = (n: number, d = 5) => parseFloat(n.toPrecision(d)).toString();

function fmtPeriod(seconds: number): string {
  const mins  = seconds / 60;
  const hours = seconds / 3600;
  const days  = seconds / 86400;
  const years = seconds / (365.25 * 86400);
  if (years >= 1) return `${fmt(years)} yr (${fmt(days)} d)`;
  if (days >= 1)  return `${fmt(days)} d (${fmt(hours)} h)`;
  if (hours >= 1) return `${fmt(hours)} h (${fmt(mins)} min)`;
  if (mins >= 1)  return `${fmt(mins)} min (${fmt(seconds)} s)`;
  return `${fmt(seconds)} s`;
}

export default function OrbitalPeriodPage() {
  const [v, setV] = useHashState({
    mode: "aToT",
    aValue: "6778",
    aUnit: "km",
    bodyKey: "earth",
    customMass: "5.972e24",
    tValue: "5559",
    tUnit: "s",
  });

  const [preset, setPreset] = useState("");

  function applyPreset(p: typeof PRESETS[0]) {
    setPreset(p.label);
    setV({ aValue: p.a_km.toString(), aUnit: "km", bodyKey: p.body, mode: "aToT" });
  }

  const massKg =
    v.bodyKey === "custom"
      ? parseFloat(v.customMass)
      : CENTRAL_BODIES[v.bodyKey]?.mass ?? 0;

  let result: { T_s: number; a_km: number } | null = null;
  let error = "";

  if (v.mode === "aToT") {
    const rawA = parseFloat(v.aValue);
    if (isNaN(rawA) || rawA <= 0) {
      error = "Enter a positive semi-major axis.";
    } else if (isNaN(massKg) || massKg <= 0) {
      error = "Enter a valid central body mass.";
    } else {
      const a_m = v.aUnit === "km" ? rawA * 1e3 : rawA * 1.495978707e11;
      const T_s = 2 * Math.PI * Math.sqrt(Math.pow(a_m, 3) / (G * massKg));
      result = { T_s, a_km: rawA * (v.aUnit === "km" ? 1 : 1.495978707e8) };
    }
  } else {
    const rawT = parseFloat(v.tValue);
    if (isNaN(rawT) || rawT <= 0) {
      error = "Enter a positive period.";
    } else if (isNaN(massKg) || massKg <= 0) {
      error = "Enter a valid central body mass.";
    } else {
      const tUnit: Record<string, number> = { s: 1, min: 60, h: 3600, d: 86400, yr: 365.25 * 86400 };
      const T_s = rawT * (tUnit[v.tUnit] ?? 1);
      const a_m = Math.cbrt((G * massKg * T_s * T_s) / (4 * Math.PI * Math.PI));
      result = { T_s, a_km: a_m / 1e3 };
    }
  }

  return (
    <CalculatorShell
      title="Orbital Period Calculator"
      description="T = 2π × √(a³ / GM) — calculate orbital period or semi-major axis."
    >
      <div className="space-y-4">
        {/* Mode */}
        <div>
          <label className="block text-sm text-muted mb-1">Solve for</label>
          <select value={v.mode} onChange={e => setV({ mode: e.target.value })} className={sc}>
            <option value="aToT">Period T (given semi-major axis a)</option>
            <option value="tToA">Semi-major axis a (given period T)</option>
          </select>
        </div>

        {/* Central body */}
        <div>
          <label className="block text-sm text-muted mb-1">Central body</label>
          <select value={v.bodyKey} onChange={e => setV({ bodyKey: e.target.value })} className={sc}>
            {Object.entries(CENTRAL_BODIES).map(([k, b]) => (
              <option key={k} value={k}>{b.label}</option>
            ))}
          </select>
        </div>

        {v.bodyKey === "custom" && (
          <div>
            <label className="block text-sm text-muted mb-1">Central body mass (kg)</label>
            <input type="text" value={v.customMass} onChange={e => setV({ customMass: e.target.value })} className={ic} placeholder="e.g. 5.972e24" />
          </div>
        )}

        {v.mode === "aToT" ? (
          <div>
            <label className="block text-sm text-muted mb-1">Semi-major axis</label>
            <div className="flex gap-2">
              <input type="number" value={v.aValue} onChange={e => setV({ aValue: e.target.value })} className={ic} min="0" step="any" />
              <select value={v.aUnit} onChange={e => setV({ aUnit: e.target.value })} className="px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary min-w-[70px]">
                <option value="km">km</option>
                <option value="AU">AU</option>
              </select>
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-sm text-muted mb-1">Period</label>
            <div className="flex gap-2">
              <input type="number" value={v.tValue} onChange={e => setV({ tValue: e.target.value })} className={ic} min="0" step="any" />
              <select value={v.tUnit} onChange={e => setV({ tUnit: e.target.value })} className="px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary min-w-[70px]">
                <option value="s">s</option>
                <option value="min">min</option>
                <option value="h">h</option>
                <option value="d">d</option>
                <option value="yr">yr</option>
              </select>
            </div>
          </div>
        )}

        {error && <p className="text-sm text-red-500">{error}</p>}

        {result && (
          <div className="mt-4 p-4 bg-card rounded-xl border border-card-border space-y-2">
            {/* Orbit visualization */}
            {(() => {
              const a_km = result.a_km;
              const cx = 80, cy = 80, maxR = 70;
              // Compare to known orbits for scale
              const refOrbits = [
                { name: "ISS", a: 6778, color: "#6b7280" },
                { name: "Moon", a: 384400, color: "#9ca3af" },
                { name: "Earth", a: 149597870.7, color: "#3b82f6" },
                { name: "Mars", a: 227940000, color: "#ef4444" },
              ];
              const allOrbits = [...refOrbits, { name: "Current", a: a_km, color: "#f59e0b" }];
              const maxA = Math.max(...allOrbits.map(o => o.a));
              const toR = (a: number) => Math.max((a / maxA) * maxR, 2);
              return (
                <div className="flex justify-center py-2">
                  <svg width={160} height={160} viewBox="0 0 160 160">
                    {/* Central body */}
                    <circle cx={cx} cy={cy} r={6} fill="#fbbf24" />
                    {/* Reference orbits */}
                    {refOrbits.map(o => (
                      <circle key={o.name} cx={cx} cy={cy} r={toR(o.a)} fill="none" stroke={o.color} strokeWidth={0.5} strokeDasharray="2,3" opacity={0.5} />
                    ))}
                    {/* Current orbit */}
                    <circle cx={cx} cy={cy} r={toR(a_km)} fill="none" stroke="#f59e0b" strokeWidth={2} />
                    {/* Satellite dot */}
                    <circle cx={cx + toR(a_km)} cy={cy} r={3} fill="#f59e0b" />
                    {/* Labels */}
                    {refOrbits.filter(o => toR(o.a) > 8).map(o => (
                      <text key={o.name} x={cx + toR(o.a) + 2} y={cy - 2} fontSize={6} fill={o.color} opacity={0.7}>{o.name}</text>
                    ))}
                    <text x={cx + toR(a_km) + 2} y={cy + 4} fontSize={7} fill="#f59e0b" fontWeight="bold">← orbit</text>
                  </svg>
                </div>
              );
            })()}
            {v.mode === "aToT" ? (
              <>
                <div className="text-sm text-muted mb-1">Orbital Period</div>
                <div className="text-2xl font-bold font-mono">{fmtPeriod(result.T_s)}</div>
                <div className="mt-2 space-y-1 text-xs font-mono">
                  {[
                    ["Seconds",  fmt(result.T_s) + " s"],
                    ["Minutes",  fmt(result.T_s / 60) + " min"],
                    ["Hours",    fmt(result.T_s / 3600) + " h"],
                    ["Days",     fmt(result.T_s / 86400) + " d"],
                    ["Years",    fmt(result.T_s / (365.25 * 86400)) + " yr"],
                  ].map(([label, val]) => (
                    <div key={label} className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded">
                      <span className="text-muted">{label}</span><span className="font-semibold">{val}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="text-sm text-muted mb-1">Semi-major axis</div>
                <div className="text-2xl font-bold font-mono">{fmt(result.a_km)} km</div>
                <div className="mt-2 space-y-1 text-xs font-mono">
                  {[
                    ["km",  fmt(result.a_km) + " km"],
                    ["AU",  fmt(result.a_km / 1.495978707e8) + " AU"],
                    ["m",   fmt(result.a_km * 1e3) + " m"],
                  ].map(([label, val]) => (
                    <div key={label} className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded">
                      <span className="text-muted">{label}</span><span className="font-semibold">{val}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Presets */}
        <div>
          <p className="text-xs text-muted mb-1">Common orbits:</p>
          <div className="grid grid-cols-3 gap-1">
            {PRESETS.map(p => (
              <button
                key={p.label}
                onClick={() => applyPreset(p)}
                className={`px-2 py-1.5 text-xs font-mono border rounded hover:bg-primary-light transition-colors text-center ${preset === p.label ? "bg-primary-light border-primary text-primary" : "bg-background border-card-border"}`}
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
