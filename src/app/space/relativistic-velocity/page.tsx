"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

// Relativistic velocity addition:
//   w = (u + v) / (1 + uv/c²)
// where u = velocity of object in frame S',
//       v = velocity of S' relative to S,
//       w = velocity of object in S.
//
// Also covers: relativistic Doppler shift, relativistic momentum, relativistic kinetic energy

const C = 299792458;

function fmt6(n: number) {
  if (!isFinite(n)) return "∞";
  return parseFloat(n.toPrecision(7)).toString();
}

export default function RelativisticVelocityPage() {
  const [state, setState] = useHashState({
    u: "0.9",   // v1 as fraction of c
    v: "0.9",   // v2 as fraction of c
    mass: "1",  // kg for momentum/energy
  });

  const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

  const u = parseFloat(state.u);
  const v = parseFloat(state.v);
  const m = parseFloat(state.mass);

  const validUV = isFinite(u) && isFinite(v) && Math.abs(u) < 1 && Math.abs(v) < 1;
  const validM = isFinite(m) && m > 0;

  // Relativistic velocity addition
  const w = validUV ? (u + v) / (1 + u * v) : null;

  // Lorentz factors
  const gamma_u = validUV ? 1 / Math.sqrt(1 - u * u) : null;
  const gamma_v = validUV ? 1 / Math.sqrt(1 - v * v) : null;
  const gamma_w = (w !== null && Math.abs(w) < 1) ? 1 / Math.sqrt(1 - w * w) : null;

  // Relativistic momentum p = γmv
  const p_u = (gamma_u && validM) ? gamma_u * m * u * C : null;
  const p_w = (gamma_w && validM) ? gamma_w * m * (w ?? 0) * C : null;

  // Relativistic kinetic energy KE = (γ-1)mc²
  const c2 = C * C;
  const KE_u = (gamma_u && validM) ? (gamma_u - 1) * m * c2 : null;
  const KE_w = (gamma_w && validM) ? ((gamma_w ?? 1) - 1) * m * c2 : null;

  // Relativistic Doppler (source moving toward observer at beta)
  const doppler = (validUV && u > 0 && u < 1)
    ? Math.sqrt((1 + u) / (1 - u))
    : null;

  return (
    <CalculatorShell
      title="Relativistic Velocity & Momentum"
      description="Relativistic velocity addition, Lorentz factor, momentum, kinetic energy, and Doppler shift."
    >
      <div className="space-y-4">

        <div className="px-4 py-3 bg-primary-light border border-primary/20 rounded-lg text-xs">
          <strong>Velocity addition:</strong> w = (u + v) / (1 + uv/c²). Two objects each moving at 0.9c relative to you combine to less than c — never exceeding the speed of light.
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-muted mb-1">v₁ (fraction of c)</label>
            <input type="number" value={state.u} onChange={e => setState({ u: e.target.value })}
              className={ic} min="-0.9999" max="0.9999" step="any" />
            <span className="text-xs text-muted">e.g. 0.9 = 90% of c</span>
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">v₂ (fraction of c)</label>
            <input type="number" value={state.v} onChange={e => setState({ v: e.target.value })}
              className={ic} min="-0.9999" max="0.9999" step="any" />
            <span className="text-xs text-muted">Frame velocity relative to observer</span>
          </div>
        </div>

        {validUV && w !== null && (
          <div className="space-y-3">
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="block text-xs text-muted mb-1">Combined velocity w = (v₁+v₂)/(1+v₁v₂/c²)</span>
              <span className="block font-mono font-bold text-3xl text-primary">{(w * 100).toFixed(6)}% c</span>
              <span className="block text-xs text-muted mt-1">{fmt6(w * C / 1000)} km/s</span>
            </div>

            <div className="space-y-1 text-xs font-mono">
              {[
                ["Classical (wrong): v₁+v₂", ((u + v) * 100).toFixed(4) + "% c"],
                ["Relativistic result w", (w * 100).toFixed(6) + "% c"],
                ["γ for v₁", gamma_u ? (gamma_u >= 100 ? gamma_u.toExponential(4) : gamma_u.toFixed(4)) : "—"],
                ["γ for v₂", gamma_v ? (gamma_v >= 100 ? gamma_v.toExponential(4) : gamma_v.toFixed(4)) : "—"],
                ["γ for w", gamma_w ? (gamma_w >= 100 ? gamma_w.toExponential(4) : gamma_w.toFixed(4)) : "—"],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded">
                  <span className="text-muted">{label}</span>
                  <span className="font-semibold">{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Momentum & energy section */}
        <div className="border-t border-card-border pt-3">
          <label className="block text-sm text-muted mb-1">Rest mass (kg) — for momentum & energy</label>
          <input type="number" value={state.mass} onChange={e => setState({ mass: e.target.value })}
            className={ic} min="0" step="any" />
          {validM && validUV && p_u !== null && KE_u !== null && (
            <div className="mt-2 space-y-1 text-xs font-mono">
              {[
                ["Momentum at v₁", p_u >= 1e12 ? p_u.toExponential(4) + " kg·m/s" : fmt6(p_u) + " kg·m/s"],
                ["Kinetic energy at v₁", KE_u >= 1e15 ? KE_u.toExponential(4) + " J" : fmt6(KE_u) + " J"],
                ...(p_w !== null && KE_w !== null ? [
                  ["Momentum at w", p_w >= 1e12 ? p_w.toExponential(4) + " kg·m/s" : fmt6(p_w) + " kg·m/s"],
                  ["Kinetic energy at w", KE_w >= 1e15 ? KE_w.toExponential(4) + " J" : fmt6(KE_w) + " J"],
                ] : []),
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded">
                  <span className="text-muted">{label}</span>
                  <span className="font-semibold">{val}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Doppler section */}
        {validUV && doppler !== null && (
          <div className="border-t border-card-border pt-3">
            <p className="text-xs text-muted mb-1 font-semibold">Relativistic Doppler shift (source at v₁ toward observer)</p>
            <div className="space-y-1 text-xs font-mono">
              {[
                ["Frequency ratio f_obs/f_source", doppler.toFixed(6)],
                ["Redshift z (recession)", (1/doppler - 1).toFixed(6)],
                ["Blueshift factor (approach)", doppler.toFixed(6) + "×"],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded">
                  <span className="text-muted">{label}</span>
                  <span className="font-semibold">{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="px-4 py-3 bg-background border border-card-border rounded-lg text-xs text-muted space-y-1">
          <p className="font-semibold text-foreground">Special relativity</p>
          <p>Velocities must be given as a fraction of c (e.g. 0.9 = 90% of c). Negative values represent motion in the opposite direction. The combined velocity always stays below c regardless of how close v₁ and v₂ are to c.</p>
        </div>
      </div>
    </CalculatorShell>
  );
}
