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

export default function AccelerationPage() {
  const [v, setV] = useHashState({
    mode: "newton",
    force: "100",
    mass: "10",
    v0: "0",
    v1: "30",
    time: "5",
    dist: "150",
  });

  const result = useMemo(() => {
    switch (v.mode) {
      case "newton": {
        const F = parseFloat(v.force), m = parseFloat(v.mass);
        if (m <= 0 || !isFinite(F) || !isFinite(m)) return null;
        return { a: F / m, label: "a = F / m" };
      }
      case "velocity": {
        const v0 = parseFloat(v.v0), v1 = parseFloat(v.v1), t = parseFloat(v.time);
        if (t <= 0 || !isFinite(v0) || !isFinite(v1)) return null;
        return { a: (v1 - v0) / t, label: "a = (v₁ − v₀) / t" };
      }
      case "kinematic": {
        const v0 = parseFloat(v.v0), v1 = parseFloat(v.v1), d = parseFloat(v.dist);
        if (d <= 0 || !isFinite(v0) || !isFinite(v1)) return null;
        return { a: (v1*v1 - v0*v0) / (2 * d), label: "a = (v₁²− v₀²) / 2d" };
      }
      default: return null;
    }
  }, [v]);

  const modes = [
    { value: "newton", label: "Newton's 2nd Law (F = ma)" },
    { value: "velocity", label: "From Velocity Change (Δv/t)" },
    { value: "kinematic", label: "Kinematic (v²= v₀²+ 2ad)" },
  ];

  return (
    <CalculatorShell title="Acceleration Calculator" description="Calculate acceleration using Newton's second law or kinematic equations.">
      <div className="space-y-4">
        <div>
          <label className="block text-xs text-muted mb-1">Method</label>
          <select value={v.mode} onChange={e => setV({ mode: e.target.value })} className={inp}>
            {modes.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
        </div>

        {v.mode === "newton" && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-muted mb-1">Force (N)</label>
              <input type="number" value={v.force} onChange={e => setV({ force: e.target.value })} className={inp} step="any" />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1">Mass (kg)</label>
              <input type="number" value={v.mass} onChange={e => setV({ mass: e.target.value })} className={inp} min="0" step="any" />
            </div>
          </div>
        )}

        {v.mode === "velocity" && (
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-muted mb-1">Initial Velocity v₀ (m/s)</label>
              <input type="number" value={v.v0} onChange={e => setV({ v0: e.target.value })} className={inp} step="any" />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1">Final Velocity v₁ (m/s)</label>
              <input type="number" value={v.v1} onChange={e => setV({ v1: e.target.value })} className={inp} step="any" />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1">Time (s)</label>
              <input type="number" value={v.time} onChange={e => setV({ time: e.target.value })} className={inp} min="0" step="any" />
            </div>
          </div>
        )}

        {v.mode === "kinematic" && (
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-muted mb-1">Initial Velocity v₀ (m/s)</label>
              <input type="number" value={v.v0} onChange={e => setV({ v0: e.target.value })} className={inp} step="any" />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1">Final Velocity v₁ (m/s)</label>
              <input type="number" value={v.v1} onChange={e => setV({ v1: e.target.value })} className={inp} step="any" />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1">Distance (m)</label>
              <input type="number" value={v.dist} onChange={e => setV({ dist: e.target.value })} className={inp} min="0" step="any" />
            </div>
          </div>
        )}

        {result && (
          <div className="space-y-2">
            <div className="p-4 bg-primary-light border border-primary/20 rounded-lg text-center">
              <div className="text-xs text-muted mb-1">Acceleration</div>
              <div className="font-mono font-bold text-3xl text-primary">{fmt(result.a)} m/s²</div>
              <div className="text-xs text-muted mt-1">{result.label}</div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 bg-card border border-card-border rounded">
                <div className="text-muted">g units</div>
                <div className="font-mono font-semibold">{fmt(result.a / 9.81)} g</div>
              </div>
              <div className="p-2 bg-card border border-card-border rounded">
                <div className="text-muted">ft/s²</div>
                <div className="font-mono font-semibold">{fmt(result.a * 3.28084)}</div>
              </div>
              <div className="p-2 bg-card border border-card-border rounded">
                <div className="text-muted">km/h/s</div>
                <div className="font-mono font-semibold">{fmt(result.a * 3.6)}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
