"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";
import { useMemo } from "react";

const inp = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm";

function fmt(n: number) {
  if (!isFinite(n) || isNaN(n)) return "—";
  return parseFloat(n.toPrecision(6)).toLocaleString("en-US", { maximumFractionDigits: 6 });
}

const PI = Math.PI;

export default function VolumePage() {
  const [v, setV] = useHashState({
    shape: "box",
    a: "5", b: "4", c: "3",
  });

  const a = parseFloat(v.a) || 0;
  const b = parseFloat(v.b) || 0;
  const c = parseFloat(v.c) || 0;

  const results = useMemo(() => {
    switch (v.shape) {
      case "box": {
        const vol = a * b * c;
        const sa = 2 * (a*b + b*c + a*c);
        return { volume: vol, surfaceArea: sa, label: `l=${a}, w=${b}, h=${c}` };
      }
      case "cube": {
        const vol = a * a * a;
        const sa = 6 * a * a;
        return { volume: vol, surfaceArea: sa, label: `side=${a}` };
      }
      case "cylinder": {
        const vol = PI * a * a * b;
        const sa = 2 * PI * a * (a + b);
        return { volume: vol, surfaceArea: sa, label: `r=${a}, h=${b}` };
      }
      case "sphere": {
        const vol = (4/3) * PI * a * a * a;
        const sa = 4 * PI * a * a;
        return { volume: vol, surfaceArea: sa, label: `r=${a}` };
      }
      case "cone": {
        const slant = Math.sqrt(a*a + b*b);
        const vol = (1/3) * PI * a * a * b;
        const sa = PI * a * (a + slant);
        return { volume: vol, surfaceArea: sa, label: `r=${a}, h=${b}` };
      }
      case "pyramid": {
        const vol = (1/3) * a * b * c;
        const sa = a * b + a * Math.sqrt((b/2)**2 + c**2) + b * Math.sqrt((a/2)**2 + c**2);
        return { volume: vol, surfaceArea: sa, label: `l=${a}, w=${b}, h=${c}` };
      }
      default: return null;
    }
  }, [v.shape, a, b, c]);

  const shapes: { value: string; label: string; inputs: { key: "a"|"b"|"c"; label: string }[] }[] = [
    { value: "box", label: "Rectangular Box (Cuboid)", inputs: [{ key: "a", label: "Length" }, { key: "b", label: "Width" }, { key: "c", label: "Height" }] },
    { value: "cube", label: "Cube", inputs: [{ key: "a", label: "Side length" }] },
    { value: "cylinder", label: "Cylinder", inputs: [{ key: "a", label: "Radius" }, { key: "b", label: "Height" }] },
    { value: "sphere", label: "Sphere", inputs: [{ key: "a", label: "Radius" }] },
    { value: "cone", label: "Cone", inputs: [{ key: "a", label: "Radius" }, { key: "b", label: "Height" }] },
    { value: "pyramid", label: "Rectangular Pyramid", inputs: [{ key: "a", label: "Base Length" }, { key: "b", label: "Base Width" }, { key: "c", label: "Height" }] },
  ];

  const selected = shapes.find(s => s.value === v.shape)!;

  return (
    <CalculatorShell title="Volume Calculator" description="Calculate the volume and surface area of common 3D shapes.">
      <div className="space-y-4">
        <div>
          <label className="block text-xs text-muted mb-1">Shape</label>
          <select value={v.shape} onChange={e => setV({ shape: e.target.value })} className={inp}>
            {shapes.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {selected.inputs.map(inp2 => (
            <div key={inp2.key}>
              <label className="block text-xs text-muted mb-1">{inp2.label}</label>
              <input
                type="number"
                value={v[inp2.key]}
                onChange={e => setV({ [inp2.key]: e.target.value })}
                className={inp}
                min="0" step="any"
              />
            </div>
          ))}
        </div>

        {results && (
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 bg-primary-light border border-primary/20 rounded-lg text-center">
              <div className="text-xs text-muted mb-1">Volume</div>
              <div className="font-mono font-bold text-2xl text-primary">{fmt(results.volume)}</div>
            </div>
            <div className="p-4 bg-card border border-card-border rounded-lg text-center">
              <div className="text-xs text-muted mb-1">Surface Area</div>
              <div className="font-mono font-bold text-2xl">{fmt(results.surfaceArea)}</div>
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
