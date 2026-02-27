"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";
import { useMemo } from "react";

const inp = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm";

function fmt(n: number, d = 5): string {
  if (!isFinite(n) || isNaN(n)) return "—";
  const abs = Math.abs(n);
  if (abs >= 1e6 || (abs < 0.001 && abs > 0)) return n.toExponential(4);
  return parseFloat(n.toPrecision(d)).toString();
}

export default function HookesLawPage() {
  const [v, setV] = useHashState({ mode: "F", k: "200", x: "0.05", F: "10" });

  const result = useMemo(() => {
    const k = parseFloat(v.k);
    const x = parseFloat(v.x);
    const F = parseFloat(v.F);

    if (v.mode === "F") {
      if (!isFinite(k) || !isFinite(x) || k <= 0) return null;
      const force = k * Math.abs(x);
      const pe = 0.5 * k * x * x;
      return { type: "F" as const, F: force, k, x, pe };
    } else if (v.mode === "k") {
      if (!isFinite(F) || !isFinite(x) || x === 0) return null;
      const spring = F / Math.abs(x);
      const pe = 0.5 * spring * x * x;
      return { type: "k" as const, F, k: spring, x, pe };
    } else {
      if (!isFinite(F) || !isFinite(k) || k <= 0) return null;
      const displacement = F / k;
      const pe = 0.5 * k * displacement * displacement;
      return { type: "x" as const, F, k, x: displacement, pe };
    }
  }, [v]);

  const modes = [
    { k: "F", l: "Find Force (F)" },
    { k: "k", l: "Find Spring Constant (k)" },
    { k: "x", l: "Find Displacement (x)" },
  ];

  return (
    <CalculatorShell title="Hooke's Law Calculator" description="F = kx — Calculate spring force, constant, or displacement.">
      <div className="space-y-4">
        <div>
          <label className="block text-xs text-muted mb-1">Solve for</label>
          <select value={v.mode} onChange={e => setV({ mode: e.target.value })} className={inp}>
            {modes.map(m => <option key={m.k} value={m.k}>{m.l}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {v.mode !== "k" && (
            <div>
              <label className="block text-xs text-muted mb-1">Spring constant k (N/m)</label>
              <input type="number" value={v.k} onChange={e => setV({ k: e.target.value })} className={inp} min="0" step="any" />
            </div>
          )}
          {v.mode !== "x" && (
            <div>
              <label className="block text-xs text-muted mb-1">Displacement x (m)</label>
              <input type="number" value={v.x} onChange={e => setV({ x: e.target.value })} className={inp} step="any" />
            </div>
          )}
          {v.mode !== "F" && (
            <div>
              <label className="block text-xs text-muted mb-1">Force F (N)</label>
              <input type="number" value={v.F} onChange={e => setV({ F: e.target.value })} className={inp} step="any" />
            </div>
          )}
        </div>

        {result && (
          <div className="space-y-3">
            <div className="p-4 bg-primary-light border border-primary/20 rounded-lg text-center">
              <div className="text-xs text-muted mb-1">
                {result.type === "F" ? "Spring Force (F)" : result.type === "k" ? "Spring Constant (k)" : "Displacement (x)"}
              </div>
              <div className="font-mono font-bold text-3xl text-primary">
                {result.type === "F" ? `${fmt(result.F)} N` : result.type === "k" ? `${fmt(result.k)} N/m` : `${fmt(result.x)} m`}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {[
                { label: "Force F", value: fmt(result.F) + " N" },
                { label: "Spring k", value: fmt(result.k) + " N/m" },
                { label: "Displacement x", value: fmt(result.x) + " m" },
                { label: "Elastic PE", value: fmt(result.pe) + " J" },
                { label: "Formula", value: "F = k × x" },
              ].map(r => (
                <div key={r.label} className="p-2 bg-card border border-card-border rounded text-center">
                  <div className="text-muted text-[10px]">{r.label}</div>
                  <div className="font-mono font-semibold text-xs">{r.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
