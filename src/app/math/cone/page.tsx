"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";
import { useMemo } from "react";

const inp = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm";

const PI = Math.PI;

function fmt(n: number) {
  if (!isFinite(n) || isNaN(n)) return "—";
  return parseFloat(n.toPrecision(6)).toLocaleString("en-US", { maximumFractionDigits: 6 });
}

export default function ConePage() {
  const [v, setV] = useHashState({ radius: "5", height: "10" });

  const r = parseFloat(v.radius) || 0;
  const h = parseFloat(v.height) || 0;
  const valid = r > 0 && h > 0;

  const results = useMemo(() => {
    if (!valid) return null;
    const slantHeight = Math.sqrt(r * r + h * h);
    const baseArea = PI * r * r;
    const lateralArea = PI * r * slantHeight;
    const totalArea = baseArea + lateralArea;
    const volume = (1 / 3) * PI * r * r * h;
    return { slantHeight, baseArea, lateralArea, totalArea, volume };
  }, [r, h, valid]);

  return (
    <CalculatorShell title="Cone Calculator" description="Calculate volume, surface area, slant height, and more for a right circular cone.">
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
                <div className="text-xs text-muted mt-1">(1/3)πr²h</div>
              </div>
              <div className="p-3 bg-card border border-card-border rounded-lg text-center">
                <div className="text-xs text-muted mb-1">Total Surface Area</div>
                <div className="font-mono font-bold text-xl">{fmt(results.totalArea)}</div>
              </div>
            </div>
            {[
              { label: "Slant Height (l = √(r²+h²))", value: fmt(results.slantHeight) },
              { label: "Base Area (πr²)", value: fmt(results.baseArea) },
              { label: "Lateral Area (πrl)", value: fmt(results.lateralArea) },
              { label: "Total Surface Area (πr² + πrl)", value: fmt(results.totalArea) },
              { label: "Volume ((1/3)πr²h)", value: fmt(results.volume) },
            ].map(row => (
              <div key={row.label} className="flex justify-between items-center px-3 py-2 bg-background border border-card-border rounded text-sm">
                <span className="text-muted text-xs">{row.label}</span>
                <span className="font-mono font-semibold">{row.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
