"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

export default function FreeFallPage() {
  const [v, setV] = useHashState({
    height: "",
    v0: "0",
    gravity: "9.81",
    airResistance: "false",
    tQuery: "",
  });

  const h0 = parseFloat(v.height);
  const v0 = parseFloat(v.v0) || 0;
  const g = parseFloat(v.gravity) || 9.81;
  const airRes = v.airResistance === "true";
  const TERMINAL_V = 56; // m/s typical for a person

  // Time to hit ground from h0 (using quadratic formula: h0 + v0*t - 0.5*g*t² = 0)
  // 0.5g*t² - v0*t - h0 = 0
  let timeFall: number | null = null;
  let impactVelocity: number | null = null;

  if (!isNaN(h0) && h0 > 0) {
    const disc = v0 * v0 + 2 * g * h0;
    if (disc >= 0) {
      timeFall = (v0 + Math.sqrt(disc)) / g;
      if (airRes) {
        // approximate: iterative using Euler steps
        let vy = v0, y = h0, t = 0, dt = 0.01;
        while (y > 0 && t < 10000) {
          const drag = (vy / TERMINAL_V) * (vy / TERMINAL_V) * g;
          vy += (g - drag) * dt;
          if (vy > TERMINAL_V) vy = TERMINAL_V;
          y -= vy * dt;
          t += dt;
        }
        timeFall = parseFloat(t.toFixed(3));
        impactVelocity = parseFloat(vy.toFixed(3));
      } else {
        impactVelocity = v0 + g * timeFall;
      }
    }
  }

  // Distance fallen at t
  const tQ = parseFloat(v.tQuery);
  let distAtT: number | null = null;
  let velAtT: number | null = null;
  if (!isNaN(tQ) && tQ >= 0) {
    if (airRes) {
      let vy = v0, y = 0, t = 0, dt = 0.001;
      while (t < tQ) {
        const drag = (vy / TERMINAL_V) * (vy / TERMINAL_V) * g;
        vy += (g - drag) * dt;
        if (vy > TERMINAL_V) vy = TERMINAL_V;
        y += vy * dt;
        t += dt;
      }
      distAtT = parseFloat(y.toFixed(3));
      velAtT = parseFloat(vy.toFixed(3));
    } else {
      distAtT = parseFloat((v0 * tQ + 0.5 * g * tQ * tQ).toFixed(3));
      velAtT = parseFloat((v0 + g * tQ).toFixed(3));
    }
  }

  return (
    <CalculatorShell
      title="Free Fall Calculator"
      description="Calculate time to fall, impact velocity, and distance fallen for objects in free fall."
    >
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-muted mb-1">Initial height (m)</label>
            <input type="number" value={v.height} onChange={e => setV({ height: e.target.value })} placeholder="e.g. 100" className={ic} />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Initial velocity (m/s)</label>
            <input type="number" value={v.v0} onChange={e => setV({ v0: e.target.value })} placeholder="0" className={ic} />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Gravity (m/s²)</label>
            <input type="number" value={v.gravity} onChange={e => setV({ gravity: e.target.value })} placeholder="9.81" className={ic} />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Air resistance</label>
            <select value={v.airResistance} onChange={e => setV({ airResistance: e.target.value })} className="w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="false">Off (ideal)</option>
              <option value="true">On (terminal ~56 m/s)</option>
            </select>
          </div>
        </div>

        {timeFall !== null && (
          <div className="space-y-3">
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="block text-xs text-muted mb-1">Time to hit ground</span>
              <span className="block font-mono font-bold text-4xl text-primary">{timeFall.toFixed(3)} s</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="px-4 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">Impact velocity</span>
                <span className="font-mono font-bold text-xl">{impactVelocity!.toFixed(2)} m/s</span>
              </div>
              <div className="px-4 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">Impact (km/h)</span>
                <span className="font-mono font-bold text-xl">{(impactVelocity! * 3.6).toFixed(1)} km/h</span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
                <span className="text-muted">Gravity used</span>
                <span>{g} m/s²</span>
              </div>
              {airRes && (
                <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
                  <span className="text-muted">Terminal velocity</span>
                  <span>~{TERMINAL_V} m/s</span>
                </div>
              )}
              <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
                <span className="text-muted">Formula (no air)</span>
                <span>t = (v₀ + √(v₀²+2gh)) / g</span>
              </div>
            </div>
          </div>
        )}

        <div className="border-t border-card-border pt-4">
          <label className="block text-sm text-muted mb-1">Distance &amp; velocity at time t (s)</label>
          <input type="number" value={v.tQuery} onChange={e => setV({ tQuery: e.target.value })} placeholder="e.g. 2" className={ic} />
          {distAtT !== null && (
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="px-4 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">Distance fallen</span>
                <span className="font-mono font-bold text-xl">{distAtT} m</span>
              </div>
              <div className="px-4 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">Velocity at t</span>
                <span className="font-mono font-bold text-xl">{velAtT} m/s</span>
              </div>
            </div>
          )}
        </div>

        <div className="text-xs text-muted space-y-1">
          <p>Gravity presets: Earth 9.81 · Moon 1.62 · Mars 3.72 · Jupiter 24.79</p>
        </div>
      </div>
    </CalculatorShell>
  );
}
