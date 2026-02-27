"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";
import { useMemo } from "react";

const inp = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm";

const PI = Math.PI;

function fmt(n: number, d = 4) {
  if (!isFinite(n) || isNaN(n)) return "—";
  return parseFloat(n.toPrecision(d > 0 ? 6 : 4)).toLocaleString("en-US", { maximumFractionDigits: 6 });
}

export default function CylinderPage() {
  const [v, setV] = useHashState({ radius: "5", height: "10" });

  const r = parseFloat(v.radius) || 0;
  const h = parseFloat(v.height) || 0;
  const valid = r > 0 && h > 0;

  const results = useMemo(() => {
    if (!valid) return null;
    const volume = PI * r * r * h;
    const lateralArea = 2 * PI * r * h;
    const baseArea = PI * r * r;
    const totalArea = lateralArea + 2 * baseArea;
    const diagonal = Math.sqrt(4 * r * r + h * h);
    return { volume, lateralArea, baseArea, totalArea, diagonal };
  }, [r, h, valid]);

  const rows = results ? [
    { label: "Volume (V = πr²h)", value: fmt(results.volume), formula: `π × ${r}² × ${h}` },
    { label: "Lateral Surface Area", value: fmt(results.lateralArea), formula: `2π × ${r} × ${h}` },
    { label: "Base Area (πr²)", value: fmt(results.baseArea), formula: `π × ${r}²` },
    { label: "Total Surface Area", value: fmt(results.totalArea), formula: "Lateral + 2 × Base" },
    { label: "Diagonal Length", value: fmt(results.diagonal), formula: "√(4r² + h²)" },
  ] : [];

  return (
    <CalculatorShell title="Cylinder Calculator" description="Calculate volume, surface area, and other properties of a cylinder.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-muted mb-1">Radius (r)</label>
            <input type="number" value={v.radius} onChange={e => setV({ radius: e.target.value })} className={inp} min="0" step="any" />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Height (h)</label>
            <input type="number" value={v.height} onChange={e => setV({ height: e.target.value })} className={inp} min="0" step="any" />
          </div>
        </div>

        {valid && results && (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-primary-light border border-primary/20 rounded-lg text-center">
                <div className="text-xs text-muted mb-1">Volume</div>
                <div className="font-mono font-bold text-xl text-primary">{fmt(results.volume)}</div>
              </div>
              <div className="p-3 bg-card border border-card-border rounded-lg text-center">
                <div className="text-xs text-muted mb-1">Total Surface Area</div>
                <div className="font-mono font-bold text-xl">{fmt(results.totalArea)}</div>
              </div>
            </div>
            <div className="space-y-1">
              {rows.map(row => (
                <div key={row.label} className="flex justify-between items-center px-3 py-2 bg-background border border-card-border rounded text-sm">
                  <span className="text-muted text-xs">{row.label}</span>
                  <span className="font-mono font-semibold">{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="text-xs text-muted">All units are in the same unit system as your input (e.g., cm → cm² and cm³).</p>
      </div>
    </CalculatorShell>
  );
}
