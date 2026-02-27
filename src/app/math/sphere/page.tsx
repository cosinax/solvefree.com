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

export default function SpherePage() {
  const [v, setV] = useHashState({ mode: "radius", value: "5" });

  const raw = parseFloat(v.value) || 0;
  const valid = raw > 0;

  const results = useMemo(() => {
    if (!valid) return null;
    let r = 0;
    switch (v.mode) {
      case "radius": r = raw; break;
      case "diameter": r = raw / 2; break;
      case "surface": r = Math.sqrt(raw / (4 * PI)); break;
      case "volume": r = Math.cbrt((3 * raw) / (4 * PI)); break;
    }
    return {
      radius: r,
      diameter: 2 * r,
      surfaceArea: 4 * PI * r * r,
      volume: (4 / 3) * PI * r * r * r,
      greatCircleArea: PI * r * r,
      greatCircleCircumference: 2 * PI * r,
    };
  }, [v, raw, valid]);

  const modes = [
    { value: "radius", label: "Radius (r)" },
    { value: "diameter", label: "Diameter (d)" },
    { value: "surface", label: "Surface Area (A)" },
    { value: "volume", label: "Volume (V)" },
  ];

  return (
    <CalculatorShell title="Sphere Calculator" description="Enter any one measurement of a sphere to calculate all others.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-muted mb-1">Known value type</label>
            <select value={v.mode} onChange={e => setV({ mode: e.target.value })} className={inp}>
              {modes.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">{modes.find(m => m.value === v.mode)?.label}</label>
            <input type="number" value={v.value} onChange={e => setV({ value: e.target.value })} className={inp} min="0" step="any" />
          </div>
        </div>

        {valid && results && (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-primary-light border border-primary/20 rounded-lg text-center">
                <div className="text-xs text-muted mb-1">Volume</div>
                <div className="font-mono font-bold text-xl text-primary">{fmt(results.volume)}</div>
                <div className="text-xs text-muted mt-1">(4/3)πr³</div>
              </div>
              <div className="p-3 bg-card border border-card-border rounded-lg text-center">
                <div className="text-xs text-muted mb-1">Surface Area</div>
                <div className="font-mono font-bold text-xl">{fmt(results.surfaceArea)}</div>
                <div className="text-xs text-muted mt-1">4πr²</div>
              </div>
            </div>
            {[
              { label: "Radius (r)", value: fmt(results.radius) },
              { label: "Diameter (d = 2r)", value: fmt(results.diameter) },
              { label: "Surface Area (4πr²)", value: fmt(results.surfaceArea) },
              { label: "Volume ((4/3)πr³)", value: fmt(results.volume) },
              { label: "Great Circle Area (πr²)", value: fmt(results.greatCircleArea) },
              { label: "Great Circle Circumference (2πr)", value: fmt(results.greatCircleCircumference) },
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
