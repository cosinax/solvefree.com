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

const RAD = Math.PI / 180;

export default function TorquePage() {
  const [v, setV] = useHashState({
    mode: "torque",
    force: "50",
    arm: "0.3",
    angle: "90",
    torque: "15",
  });

  const result = useMemo(() => {
    const F = parseFloat(v.force);
    const r = parseFloat(v.arm);
    const theta = parseFloat(v.angle);
    const tau = parseFloat(v.torque);

    switch (v.mode) {
      case "torque": {
        if (!isFinite(F) || !isFinite(r) || !isFinite(theta) || r <= 0 || F === 0) return null;
        const torqueVal = F * r * Math.sin(theta * RAD);
        return { type: "torque" as const, torque: torqueVal, label: "τ = F × r × sin(θ)" };
      }
      case "force": {
        if (!isFinite(tau) || !isFinite(r) || !isFinite(theta) || r <= 0) return null;
        const forceVal = tau / (r * Math.sin(theta * RAD));
        return { type: "force" as const, force: forceVal, label: "F = τ / (r × sin(θ))" };
      }
      case "arm": {
        if (!isFinite(tau) || !isFinite(F) || !isFinite(theta) || F === 0) return null;
        const armVal = tau / (F * Math.sin(theta * RAD));
        return { type: "arm" as const, arm: armVal, label: "r = τ / (F × sin(θ))" };
      }
      default: return null;
    }
  }, [v]);

  const modes = [
    { value: "torque", label: "Find Torque (τ)" },
    { value: "force", label: "Find Force (F)" },
    { value: "arm", label: "Find Moment Arm (r)" },
  ];

  return (
    <CalculatorShell title="Torque Calculator" description="Calculate torque, force, or moment arm using τ = F × r × sin(θ).">
      <div className="space-y-4">
        <div>
          <label className="block text-xs text-muted mb-1">Solve for</label>
          <select value={v.mode} onChange={e => setV({ mode: e.target.value })} className={inp}>
            {modes.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {v.mode !== "torque" && (
            <div>
              <label className="block text-xs text-muted mb-1">Torque τ (N·m)</label>
              <input type="number" value={v.torque} onChange={e => setV({ torque: e.target.value })} className={inp} step="any" />
            </div>
          )}
          {v.mode !== "force" && (
            <div>
              <label className="block text-xs text-muted mb-1">Force F (N)</label>
              <input type="number" value={v.force} onChange={e => setV({ force: e.target.value })} className={inp} step="any" />
            </div>
          )}
          {v.mode !== "arm" && (
            <div>
              <label className="block text-xs text-muted mb-1">Moment Arm r (m)</label>
              <input type="number" value={v.arm} onChange={e => setV({ arm: e.target.value })} className={inp} min="0" step="any" />
            </div>
          )}
          <div>
            <label className="block text-xs text-muted mb-1">Angle θ (degrees)</label>
            <input type="number" value={v.angle} onChange={e => setV({ angle: e.target.value })} className={inp} min="0" max="360" step="1" />
          </div>
        </div>

        {result && (
          <div className="space-y-2">
            {result.type === "torque" && (
              <div className="p-4 bg-primary-light border border-primary/20 rounded-lg text-center">
                <div className="text-xs text-muted mb-1">Torque (τ)</div>
                <div className="font-mono font-bold text-3xl text-primary">{fmt(result.torque)} N·m</div>
              </div>
            )}
            {result.type === "force" && (
              <div className="p-4 bg-primary-light border border-primary/20 rounded-lg text-center">
                <div className="text-xs text-muted mb-1">Force (F)</div>
                <div className="font-mono font-bold text-3xl text-primary">{fmt(result.force)} N</div>
              </div>
            )}
            {result.type === "arm" && (
              <div className="p-4 bg-primary-light border border-primary/20 rounded-lg text-center">
                <div className="text-xs text-muted mb-1">Moment Arm (r)</div>
                <div className="font-mono font-bold text-3xl text-primary">{fmt(result.arm)} m</div>
              </div>
            )}
            <p className="text-xs text-muted">{result.label}. At θ=90°, torque is maximized (pure perpendicular force).</p>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
