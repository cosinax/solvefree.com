"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
const sel = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

const PI = Math.PI;

export default function CirclePage() {
  const [v, setV] = useHashState({ mode: "radius", value: "5" });

  const raw = parseFloat(v.value);
  const valid = !isNaN(raw) && raw > 0;

  let radius = 0, diameter = 0, area = 0, circumference = 0;
  if (valid) {
    switch (v.mode) {
      case "radius":
        radius = raw; diameter = raw * 2; area = PI * raw * raw; circumference = 2 * PI * raw; break;
      case "diameter":
        diameter = raw; radius = raw / 2; area = PI * radius * radius; circumference = PI * raw; break;
      case "area":
        area = raw; radius = Math.sqrt(raw / PI); diameter = radius * 2; circumference = 2 * PI * radius; break;
      case "circumference":
        circumference = raw; radius = raw / (2 * PI); diameter = raw / PI; area = PI * radius * radius; break;
    }
  }

  function fmt(n: number) { return parseFloat(n.toPrecision(10)).toString(); }
  function fmtPi(n: number) {
    const ratio = n / PI;
    const ratioStr = parseFloat(ratio.toPrecision(6)).toString();
    return `${ratioStr}π ≈ ${fmt(n)}`;
  }

  const modeLabel: Record<string, string> = {
    radius: "Radius", diameter: "Diameter", area: "Area", circumference: "Circumference"
  };

  return (
    <CalculatorShell title="Circle Calculator" description="Enter any one measurement of a circle to calculate all others.">
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-muted mb-1">Known value</label>
          <select value={v.mode} onChange={e => setV({ mode: e.target.value })} className={sel}>
            <option value="radius">Radius (r)</option>
            <option value="diameter">Diameter (d)</option>
            <option value="area">Area (A)</option>
            <option value="circumference">Circumference (C)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-muted mb-1">{modeLabel[v.mode]}</label>
          <input type="number" value={v.value} onChange={e => setV({ value: e.target.value })} className={ic} min="0" step="any" />
        </div>

        {valid && (
          <div className="space-y-3">
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="text-xs text-muted block mb-1">Radius</span>
              <span className="block font-mono font-bold text-4xl text-primary">{fmt(radius)}</span>
            </div>

            <div className="space-y-1 text-xs font-mono">
              <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded">
                <span className="text-muted">Radius (r)</span>
                <span className="font-semibold">{fmt(radius)}</span>
              </div>
              <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded">
                <span className="text-muted">Diameter (d = 2r)</span>
                <span className="font-semibold">{fmt(diameter)}</span>
              </div>
              <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded">
                <span className="text-muted">Area (A = πr²)</span>
                <span className="font-semibold">{fmtPi(area)}</span>
              </div>
              <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded">
                <span className="text-muted">Circumference (C = 2πr)</span>
                <span className="font-semibold">{fmtPi(circumference)}</span>
              </div>
            </div>

            <div className="space-y-1 text-xs font-mono">
              <p className="text-xs text-muted">Formulas:</p>
              <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded">
                <span className="text-muted">Area formula</span>
                <span className="font-semibold">A = π × r² = π × {fmt(radius)}² = {fmt(area)}</span>
              </div>
              <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded">
                <span className="text-muted">Circumference formula</span>
                <span className="font-semibold">C = 2 × π × {fmt(radius)} = {fmt(circumference)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
