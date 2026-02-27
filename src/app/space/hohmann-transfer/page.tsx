"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
const sc = "w-full px-3 py-2 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm";

const G = 6.674e-11;

const BODIES: Record<string, { label: string; mu: number }> = {
  earth:   { label: "Earth",   mu: G * 5.972e24 },
  sun:     { label: "Sun",     mu: G * 1.989e30 },
  mars:    { label: "Mars",    mu: G * 6.417e23 },
  jupiter: { label: "Jupiter", mu: G * 1.898e27 },
  moon:    { label: "Moon",    mu: G * 7.342e22 },
  custom:  { label: "Custom",  mu: 0 },
};

const fmt = (n: number, d = 5) => parseFloat(n.toPrecision(d)).toString();

function fmtTime(s: number): string {
  const d = s / 86400;
  const h = s / 3600;
  const m = s / 60;
  if (d >= 1) return `${fmt(d)} d`;
  if (h >= 1) return `${fmt(h)} h`;
  if (m >= 1) return `${fmt(m)} min`;
  return `${fmt(s)} s`;
}

export default function HohmannTransferPage() {
  const [v, setV] = useHashState({
    bodyKey: "earth",
    customMu: "",
    r1: "6778",
    r2: "42164",
  });

  const muVal = v.bodyKey === "custom" ? parseFloat(v.customMu) : BODIES[v.bodyKey].mu;
  const r1_km = parseFloat(v.r1);
  const r2_km = parseFloat(v.r2);

  let error = "";
  interface HResult {
    v1_circ: number; v2_circ: number;
    dv1: number; dv2: number; dvTotal: number;
    transferTime_s: number;
    a_t: number;
    v_peri: number; v_apo: number;
  }
  let result: HResult | null = null;

  if (isNaN(muVal) || muVal <= 0) error = "Enter valid central body / mu.";
  else if (isNaN(r1_km) || r1_km <= 0) error = "Enter valid r1.";
  else if (isNaN(r2_km) || r2_km <= 0) error = "Enter valid r2.";
  else if (r1_km === r2_km) error = "r1 and r2 must differ.";
  else {
    const r1 = r1_km * 1e3;
    const r2 = r2_km * 1e3;
    const a_t = (r1 + r2) / 2;
    const v1_circ = Math.sqrt(muVal / r1);
    const v2_circ = Math.sqrt(muVal / r2);
    const v_peri  = Math.sqrt(muVal * (2 / r1 - 1 / a_t));
    const v_apo   = Math.sqrt(muVal * (2 / r2 - 1 / a_t));
    const dv1 = Math.abs(v_peri - v1_circ);
    const dv2 = Math.abs(v2_circ - v_apo);
    const dvTotal = dv1 + dv2;
    const transferTime_s = Math.PI * Math.sqrt(Math.pow(a_t, 3) / muVal);
    result = { v1_circ, v2_circ, dv1, dv2, dvTotal, transferTime_s, a_t: a_t / 1e3, v_peri, v_apo };
  }

  const PRESETS = [
    { label: "LEO→GEO (Earth)", r1: "6778", r2: "42164", bodyKey: "earth" },
    { label: "Earth→Mars",      r1: "149597871", r2: "227940000", bodyKey: "sun" },
    { label: "Earth→Jupiter",   r1: "149597871", r2: "778600000", bodyKey: "sun" },
  ];

  return (
    <CalculatorShell
      title="Hohmann Transfer ΔV Calculator"
      description="Minimum energy transfer between two circular orbits. Calculates both burns and transfer time."
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
          <div>
            <label className="block text-sm text-muted mb-1">Gravitational parameter μ = GM (m³/s²)</label>
            <input type="text" value={v.customMu} onChange={e => setV({ customMu: e.target.value })} className={ic} placeholder="e.g. 3.986e14" />
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-muted mb-1">r₁ — initial orbit radius (km)</label>
            <input type="number" value={v.r1} onChange={e => setV({ r1: e.target.value })} className={ic} min="0" step="any" />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">r₂ — final orbit radius (km)</label>
            <input type="number" value={v.r2} onChange={e => setV({ r2: e.target.value })} className={ic} min="0" step="any" />
          </div>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        {result && (
          <div className="mt-4 p-4 bg-card rounded-xl border border-card-border space-y-2">
            <div className="text-sm text-muted mb-1">Transfer Results</div>
            <div className="bg-primary-light rounded-lg p-3 text-center mb-2">
              <span className="text-xs text-muted block">Total Δv</span>
              <span className="text-2xl font-bold font-mono text-primary">{fmt(result.dvTotal / 1e3)} km/s</span>
            </div>
            <div className="space-y-1 text-xs font-mono">
              {[
                ["v₁ circular",          fmt(result.v1_circ / 1e3) + " km/s"],
                ["v₂ circular",          fmt(result.v2_circ / 1e3) + " km/s"],
                ["v transfer (periapsis)", fmt(result.v_peri / 1e3) + " km/s"],
                ["v transfer (apoapsis)",  fmt(result.v_apo / 1e3) + " km/s"],
                ["Δv₁ (first burn)",     fmt(result.dv1 / 1e3) + " km/s"],
                ["Δv₂ (second burn)",    fmt(result.dv2 / 1e3) + " km/s"],
                ["Total Δv",             fmt(result.dvTotal / 1e3) + " km/s  (" + fmt(result.dvTotal) + " m/s)"],
                ["Transfer semi-major axis", fmt(result.a_t) + " km"],
                ["Transfer time",         fmtTime(result.transferTime_s)],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded">
                  <span className="text-muted">{label}</span><span className="font-semibold">{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <p className="text-xs text-muted mb-1">Common transfers:</p>
          <div className="grid grid-cols-3 gap-1">
            {PRESETS.map(p => (
              <button
                key={p.label}
                onClick={() => setV({ bodyKey: p.bodyKey, r1: p.r1, r2: p.r2 })}
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
