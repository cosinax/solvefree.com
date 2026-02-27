"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";
import { useMemo } from "react";

const inp = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm";

function fmt(n: number) {
  if (!isFinite(n) || isNaN(n)) return "—";
  const abs = Math.abs(n);
  if (abs >= 1e6 || (abs < 0.001 && abs > 0)) return n.toExponential(4);
  return parseFloat(n.toPrecision(6)).toLocaleString("en-US", { maximumFractionDigits: 6 });
}

export default function MomentumPage() {
  const [v, setV] = useHashState({
    mode: "momentum",
    mass: "5",
    velocity: "10",
    momentum: "50",
    m1: "2", v1: "8", m2: "5", v2: "2",
  });

  const result = useMemo(():
    | { type: "momentum"; p: number; ke: number; label: string }
    | { type: "collision"; totalP: number; vFinal: number; ke1: number; ke2: number; keLost: number; label: string }
    | null => {
    switch (v.mode) {
      case "momentum": {
        const m = parseFloat(v.mass), vel = parseFloat(v.velocity);
        if (!isFinite(m) || !isFinite(vel) || m <= 0) return null;
        const p = m * vel;
        const ke = 0.5 * m * vel * vel;
        return { type: "momentum", p, ke, label: "p = mv" };
      }
      case "collision": {
        const m1 = parseFloat(v.m1), vel1 = parseFloat(v.v1), m2 = parseFloat(v.m2), vel2 = parseFloat(v.v2);
        if ([m1, vel1, m2, vel2].some(x => !isFinite(x)) || m1 <= 0 || m2 <= 0) return null;
        const totalP = m1 * vel1 + m2 * vel2;
        const totalM = m1 + m2;
        const vFinal = totalP / totalM;
        const ke1 = 0.5 * m1 * vel1 * vel1 + 0.5 * m2 * vel2 * vel2;
        const ke2 = 0.5 * totalM * vFinal * vFinal;
        return { type: "collision", totalP, vFinal, ke1, ke2, keLost: ke1 - ke2, label: "Perfectly inelastic: v_f = (m₁v₁ + m₂v₂)/(m₁+m₂)" };
      }
      default: return null;
    }
  }, [v]);

  return (
    <CalculatorShell title="Momentum Calculator" description="Calculate momentum, kinetic energy, and collision results.">
      <div className="space-y-4">
        <div>
          <label className="block text-xs text-muted mb-1">Calculation Type</label>
          <select value={v.mode} onChange={e => setV({ mode: e.target.value })} className={inp}>
            <option value="momentum">Single Object Momentum</option>
            <option value="collision">Inelastic Collision</option>
          </select>
        </div>

        {v.mode === "momentum" && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-muted mb-1">Mass (kg)</label>
              <input type="number" value={v.mass} onChange={e => setV({ mass: e.target.value })} className={inp} min="0" step="any" />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1">Velocity (m/s)</label>
              <input type="number" value={v.velocity} onChange={e => setV({ velocity: e.target.value })} className={inp} step="any" />
            </div>
          </div>
        )}

        {v.mode === "collision" && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted">Object 1</p>
              <div>
                <label className="block text-xs text-muted mb-1">Mass (kg)</label>
                <input type="number" value={v.m1} onChange={e => setV({ m1: e.target.value })} className={inp} min="0" step="any" />
              </div>
              <div>
                <label className="block text-xs text-muted mb-1">Velocity (m/s)</label>
                <input type="number" value={v.v1} onChange={e => setV({ v1: e.target.value })} className={inp} step="any" />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted">Object 2</p>
              <div>
                <label className="block text-xs text-muted mb-1">Mass (kg)</label>
                <input type="number" value={v.m2} onChange={e => setV({ m2: e.target.value })} className={inp} min="0" step="any" />
              </div>
              <div>
                <label className="block text-xs text-muted mb-1">Velocity (m/s)</label>
                <input type="number" value={v.v2} onChange={e => setV({ v2: e.target.value })} className={inp} step="any" />
              </div>
            </div>
          </div>
        )}

        {result && (
          <div className="space-y-2">
            {result.type === "momentum" && (
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-primary-light border border-primary/20 rounded-lg text-center">
                  <div className="text-xs text-muted mb-1">Momentum (p)</div>
                  <div className="font-mono font-bold text-2xl text-primary">{fmt(result.p)} kg·m/s</div>
                </div>
                <div className="p-4 bg-card border border-card-border rounded-lg text-center">
                  <div className="text-xs text-muted mb-1">Kinetic Energy</div>
                  <div className="font-mono font-bold text-2xl">{fmt(result.ke)} J</div>
                </div>
              </div>
            )}
            {result.type === "collision" && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 bg-primary-light border border-primary/20 rounded-lg text-center">
                    <div className="text-xs text-muted mb-1">Total Momentum</div>
                    <div className="font-mono font-bold text-xl text-primary">{fmt(result.totalP)} kg·m/s</div>
                  </div>
                  <div className="p-4 bg-card border border-card-border rounded-lg text-center">
                    <div className="text-xs text-muted mb-1">Final Velocity</div>
                    <div className="font-mono font-bold text-xl">{fmt(result.vFinal)} m/s</div>
                  </div>
                </div>
                <div className="p-3 bg-card border border-card-border rounded text-xs text-muted space-y-1">
                  <p>KE before: <span className="font-mono font-semibold">{fmt(result.ke1)} J</span></p>
                  <p>KE after: <span className="font-mono font-semibold">{fmt(result.ke2)} J</span></p>
                  <p>Energy lost: <span className="font-mono font-semibold">{fmt(result.keLost)} J</span></p>
                </div>
              </>
            )}
            <p className="text-xs text-muted">{result.label}</p>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
