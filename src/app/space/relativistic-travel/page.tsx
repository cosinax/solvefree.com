"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

// Constant proper-acceleration relativistic rocket travel
// Physics:
//   For constant proper acceleration a over proper time τ:
//     coordinate time:  t = (c/a) sinh(aτ/c)
//     distance:         d = (c²/a)(cosh(aτ/c) − 1)
//     velocity:         v = c tanh(aτ/c)
//     gamma:            γ = cosh(aτ/c)
//
// Full trip profile (4 phases):
//   1. Accelerate for accelFrac/2 of trip (distance)
//   2. Decelerate for accelFrac/2 of trip to midpoint (if accelFrac=1, accel to midpoint, decel to midpoint)
//      Actually: accelFrac applies to what fraction of total trip involves thrust.
//      Simplest interpretation: accel for (accelFrac/2) of coordinate distance, coast (1-accelFrac),
//      decel for (accelFrac/2) at end.
//
// For a full accel+decel trip (accelFrac = 1.0, no coasting):
//   Ship time = 4*(c/a)*arcsinh(sqrt(d_total*a/(2c²)))  ... derived below
//
// General: split into 3 phases by distance fraction:
//   d_accel = accelFrac/2 * D  (first burn)
//   d_coast = (1-accelFrac) * D
//   d_decel = accelFrac/2 * D  (last burn, mirror of first)
//
// For accel phase: solve d = (c²/a)(cosh(aτ/c)-1) for τ
//   => τ_accel = (c/a) * arccosh(1 + a*d_accel/c²)
//   coordinate time: t_accel = (c/a)*sinh(a*τ_accel/c)
//   peak velocity: v_peak = c * tanh(a*τ_accel/c)
//
// Coast phase: d_coast at v_peak, gamma_peak = cosh(a*τ_accel/c)
//   coordinate time for coast: t_coast = d_coast / v_peak
//   ship time for coast: τ_coast = t_coast / gamma_peak
//
// Decel phase: mirror of accel
//
// Total: τ_total = 2*τ_accel + τ_coast, t_total = 2*t_accel + t_coast

const C = 299792458; // m/s
const C2 = C * C;
const LY_M = 9.4607304725808e15; // meters per light-year
const AU_M = 1.496e11;
const G_ACCEL = 9.80665; // 1g in m/s²
const YEAR_S = 365.25 * 86400;

function fmtTime(s: number): string {
  if (!isFinite(s)) return "∞";
  if (s < 120) return s.toFixed(1) + " s";
  const m = s / 60;
  if (m < 120) return m.toFixed(1) + " min";
  const h = s / 3600;
  if (h < 48) return h.toFixed(2) + " hr";
  const d = s / 86400;
  if (d < 365) return d.toFixed(1) + " days";
  const y = s / YEAR_S;
  if (y < 1000) return y.toFixed(2) + " yr";
  return y.toExponential(3) + " yr";
}

function fmtDist(m: number): string {
  if (!isFinite(m)) return "∞";
  const ly = m / LY_M;
  if (ly >= 0.01) return ly.toFixed(4) + " ly";
  const au = m / AU_M;
  if (au >= 0.01) return au.toFixed(3) + " AU";
  if (m >= 1e6) return (m / 1e3).toFixed(0) + " km";
  return m.toFixed(0) + " m";
}

function fmtVel(v: number): string {
  const beta = v / C;
  if (beta > 0.0001) return (beta * 100).toFixed(4) + "% c";
  return (v / 1000).toFixed(2) + " km/s";
}

interface TripResult {
  tau_total_s: number;   // proper (ship) time seconds
  t_total_s: number;     // coordinate time seconds
  v_peak: number;        // peak velocity m/s
  gamma_peak: number;    // peak Lorentz factor
  tau_accel_s: number;
  tau_coast_s: number;
  t_accel_s: number;
  t_coast_s: number;
  d_accel_m: number;
  d_coast_m: number;
}

function calcTrip(dist_m: number, accel_ms2: number, accelFrac: number): TripResult | null {
  if (dist_m <= 0 || accel_ms2 <= 0 || accelFrac < 0 || accelFrac > 1) return null;

  const af = Math.max(0, Math.min(1, accelFrac));
  const d_accel = (af / 2) * dist_m;
  const d_coast = (1 - af) * dist_m;

  // Accel phase: d = (c²/a)(cosh(aτ/c) - 1) → cosh(aτ/c) = 1 + a*d/c²
  const coshArg = 1 + accel_ms2 * d_accel / C2;
  if (coshArg < 1) return null; // d_accel=0 case handled below

  let tau_accel_s: number;
  let t_accel_s: number;
  let v_peak: number;
  let gamma_peak: number;

  if (d_accel === 0) {
    tau_accel_s = 0;
    t_accel_s = 0;
    v_peak = 0;
    gamma_peak = 1;
  } else {
    const acoshVal = Math.log(coshArg + Math.sqrt(coshArg * coshArg - 1)); // acosh
    tau_accel_s = (C / accel_ms2) * acoshVal;
    const sinhVal = Math.sqrt(coshArg * coshArg - 1);
    t_accel_s = (C / accel_ms2) * sinhVal;
    v_peak = C * (sinhVal / coshArg); // tanh(x) = sinh/cosh
    gamma_peak = coshArg;
  }

  // Coast phase at v_peak
  let tau_coast_s: number;
  let t_coast_s: number;

  if (d_coast <= 0 || v_peak <= 0) {
    tau_coast_s = 0;
    t_coast_s = 0;
  } else {
    t_coast_s = d_coast / v_peak;
    tau_coast_s = t_coast_s / gamma_peak;
  }

  return {
    tau_total_s: 2 * tau_accel_s + tau_coast_s,
    t_total_s: 2 * t_accel_s + t_coast_s,
    v_peak,
    gamma_peak,
    tau_accel_s,
    tau_coast_s,
    t_accel_s,
    t_coast_s,
    d_accel_m: d_accel,
    d_coast_m: d_coast,
  };
}

const DIST_PRESETS = [
  { label: "Moon (0.00257 ly)", m: 3.844e8 },
  { label: "Mars (max ~2.5 AU)", m: 2.5 * AU_M },
  { label: "Alpha Centauri (4.37 ly)", m: 4.37 * LY_M },
  { label: "Sirius (8.6 ly)", m: 8.6 * LY_M },
  { label: "Galactic Center (26,000 ly)", m: 26000 * LY_M },
  { label: "Andromeda (2.537M ly)", m: 2.537e6 * LY_M },
];

const ACCEL_PRESETS = [
  { label: "0.1g", ms2: 0.1 * G_ACCEL },
  { label: "1g (comfortable)", ms2: 1.0 * G_ACCEL },
  { label: "2g", ms2: 2.0 * G_ACCEL },
  { label: "10g", ms2: 10.0 * G_ACCEL },
];

export default function RelativisticTravelPage() {
  const [v, setV] = useHashState({
    distLy: "4.37",
    distUnit: "ly",
    accel: "9.80665",
    accelFrac: "1.0",
  });

  const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
  const sc = "w-full px-3 py-2 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm";

  const distVal = parseFloat(v.distLy);
  let dist_m = 0;
  if (v.distUnit === "ly") dist_m = distVal * LY_M;
  else if (v.distUnit === "au") dist_m = distVal * AU_M;
  else if (v.distUnit === "km") dist_m = distVal * 1e3;
  else dist_m = distVal; // m

  const accel_ms2 = parseFloat(v.accel);
  const accelFrac = parseFloat(v.accelFrac);

  const trip = (isFinite(dist_m) && isFinite(accel_ms2) && isFinite(accelFrac))
    ? calcTrip(dist_m, accel_ms2, accelFrac)
    : null;

  const accelG = accel_ms2 / G_ACCEL;

  return (
    <CalculatorShell
      title="Relativistic Rocket Travel"
      description="Ship time vs. Earth time for constant proper-acceleration interstellar travel."
    >
      <div className="space-y-4">

        {/* Distance */}
        <div>
          <label className="block text-sm text-muted mb-1">Destination Distance</label>
          <div className="flex gap-2">
            <input type="number" value={v.distLy} onChange={e => setV({ distLy: e.target.value })}
              className={ic + " flex-1"} min="0" step="any" />
            <select value={v.distUnit} onChange={e => setV({ distUnit: e.target.value })} className={sc + " w-24"}>
              <option value="ly">ly</option>
              <option value="au">AU</option>
              <option value="km">km</option>
              <option value="m">m</option>
            </select>
          </div>
          <div className="flex flex-wrap gap-1 mt-1">
            {DIST_PRESETS.map(p => (
              <button key={p.label} onClick={() => {
                const ly = p.m / LY_M;
                setV({ distLy: ly.toPrecision(4), distUnit: "ly" });
              }} className="text-xs px-2 py-0.5 bg-background border border-card-border rounded hover:bg-primary-light transition-colors">
                {p.label.split(" (")[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Acceleration */}
        <div>
          <label className="block text-sm text-muted mb-1">
            Proper Acceleration — {accelG.toFixed(2)}g ({accel_ms2.toFixed(3)} m/s²)
          </label>
          <input type="number" value={v.accel} onChange={e => setV({ accel: e.target.value })}
            className={ic} min="0.001" step="any" />
          <div className="flex gap-1 mt-1">
            {ACCEL_PRESETS.map(p => (
              <button key={p.label} onClick={() => setV({ accel: p.ms2.toString() })}
                className="text-xs px-2 py-0.5 bg-background border border-card-border rounded hover:bg-primary-light transition-colors">
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Acceleration fraction */}
        <div>
          <label className="block text-sm text-muted mb-1">
            Thrust fraction — {(accelFrac * 100).toFixed(0)}% of trip under thrust
            {accelFrac >= 1 ? " (accel to midpoint, decel to dest)" : accelFrac <= 0 ? " (pure coast — not relativistic)" : " (accel, coast, decel)"}
          </label>
          <input type="range" min="0" max="1" step="0.05" value={v.accelFrac}
            onChange={e => setV({ accelFrac: e.target.value })} className="w-full" />
          <div className="flex justify-between text-xs text-muted mt-0.5">
            <span>0% (coast only)</span>
            <span>50% (accel + decel)</span>
            <span>100% (accel+decel no coast)</span>
          </div>
        </div>

        {trip && (
          <div className="space-y-3">
            {/* Hero result */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-primary-light rounded-xl p-4 text-center">
                <span className="block text-xs text-muted mb-1">Ship time (proper)</span>
                <span className="block font-mono font-bold text-2xl text-primary">{fmtTime(trip.tau_total_s)}</span>
              </div>
              <div className="bg-card border border-card-border rounded-xl p-4 text-center">
                <span className="block text-xs text-muted mb-1">Earth time (coordinate)</span>
                <span className="block font-mono font-bold text-2xl">{fmtTime(trip.t_total_s)}</span>
              </div>
            </div>

            {/* Key stats */}
            <div className="space-y-1 text-xs font-mono">
              {[
                ["Peak velocity", fmtVel(trip.v_peak)],
                ["Peak γ (Lorentz factor)", trip.gamma_peak.toFixed(4)],
                ["Time dilation factor", trip.t_total_s > 0 ? (trip.t_total_s / trip.tau_total_s).toFixed(4) : "—"],
                ["Distance", fmtDist(dist_m)],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded">
                  <span className="text-muted">{label}</span>
                  <span className="font-semibold">{val}</span>
                </div>
              ))}
            </div>

            {/* Phase breakdown */}
            {accelFrac < 1 && accelFrac > 0 && (
              <div className="space-y-1 text-xs font-mono">
                <div className="text-xs text-muted mb-1">Phase breakdown:</div>
                {[
                  ["Accel phase (dist)", fmtDist(trip.d_accel_m)],
                  ["Accel phase (ship time)", fmtTime(trip.tau_accel_s)],
                  ["Accel phase (coord time)", fmtTime(trip.t_accel_s)],
                  ["Coast phase (dist)", fmtDist(trip.d_coast_m)],
                  ["Coast phase (ship time)", fmtTime(trip.tau_coast_s)],
                  ["Coast phase (coord time)", fmtTime(trip.t_coast_s)],
                  ["Decel phase (mirror of accel)", ""],
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded">
                    <span className="text-muted">{label}</span>
                    <span className="font-semibold">{val}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Aging difference */}
            {trip.t_total_s > trip.tau_total_s && (
              <div className="px-4 py-3 bg-primary-light border border-primary/20 rounded-lg text-sm">
                Earth ages <strong>{fmtTime(trip.t_total_s - trip.tau_total_s)}</strong> more than the crew during this trip.
              </div>
            )}
          </div>
        )}

        <div className="px-4 py-3 bg-background border border-card-border rounded-lg text-xs text-muted space-y-1">
          <p className="font-semibold text-foreground">How it works</p>
          <p>Uses exact special-relativistic kinematics for constant proper acceleration. "Ship time" (τ) is what clocks aboard experience. "Earth time" (t) is coordinate time in the departure frame. Thrust fraction splits the trip into accel / coast / decel phases. No fuel or propulsion system is modeled — this is purely kinematic.</p>
        </div>
      </div>
    </CalculatorShell>
  );
}
