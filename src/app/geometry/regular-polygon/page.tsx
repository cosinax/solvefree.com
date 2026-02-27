"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";
import { useMemo } from "react";

const inp = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm";

function fmt(n: number, d = 5): string {
  if (!isFinite(n) || isNaN(n)) return "—";
  return parseFloat(n.toPrecision(d)).toString();
}

export default function RegularPolygonPage() {
  const [v, setV] = useHashState({ sides: "6", mode: "side", value: "5" });

  const result = useMemo(() => {
    const n = parseInt(v.sides);
    const val = parseFloat(v.value);
    if (!Number.isInteger(n) || n < 3 || !isFinite(val) || val <= 0) return null;

    let s: number; // side length
    let r: number; // circumradius (center to vertex)

    if (v.mode === "side") {
      s = val;
      r = s / (2 * Math.sin(Math.PI / n));
    } else {
      r = val;
      s = 2 * r * Math.sin(Math.PI / n);
    }

    const apothem = r * Math.cos(Math.PI / n); // inradius
    const perimeter = n * s;
    const area = 0.5 * perimeter * apothem;
    const interiorAngle = ((n - 2) * 180) / n;
    const exteriorAngle = 360 / n;

    return { s, r, apothem, perimeter, area, interiorAngle, exteriorAngle, n };
  }, [v]);

  const COMMON = [3, 4, 5, 6, 8, 10, 12];

  return (
    <CalculatorShell title="Regular Polygon Calculator" description="Area, perimeter, and angles for any regular polygon.">
      <div className="space-y-4">
        <div>
          <label className="block text-xs text-muted mb-1">Number of sides</label>
          <div className="flex gap-2 flex-wrap mb-2">
            {COMMON.map(n => (
              <button key={n} onClick={() => setV({ sides: n.toString() })}
                className={`px-3 py-1.5 text-xs font-mono rounded-lg border transition-colors ${v.sides === n.toString() ? "bg-primary text-white border-primary" : "bg-card border-card-border hover:bg-primary-light"}`}>
                {n}
              </button>
            ))}
          </div>
          <input type="number" value={v.sides} onChange={e => setV({ sides: e.target.value })} className={inp} min="3" max="100" step="1" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-muted mb-1">Known measurement</label>
            <select value={v.mode} onChange={e => setV({ mode: e.target.value })} className={inp}>
              <option value="side">Side length</option>
              <option value="circumradius">Circumradius (R)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Value</label>
            <input type="number" value={v.value} onChange={e => setV({ value: e.target.value })} className={inp} min="0" step="any" />
          </div>
        </div>

        {result && (
          <div className="space-y-3">
            {/* Polygon SVG */}
            <div className="flex justify-center p-4 bg-card border border-card-border rounded-lg">
              <svg viewBox="-60 -60 120 120" className="h-24 w-24">
                {(() => {
                  const pts = Array.from({ length: result.n }, (_, i) => {
                    const a = (2 * Math.PI * i / result.n) - Math.PI / 2;
                    return `${50 * Math.cos(a)},${50 * Math.sin(a)}`;
                  }).join(" ");
                  return <polygon points={pts} fill="rgba(99,102,241,0.1)" stroke="rgb(99,102,241)" strokeWidth="1.5" />;
                })()}
              </svg>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              {[
                { label: "Side length", value: fmt(result.s) },
                { label: "Circumradius R", value: fmt(result.r) },
                { label: "Apothem (r)", value: fmt(result.apothem) },
                { label: "Perimeter", value: fmt(result.perimeter) },
                { label: "Area", value: fmt(result.area) },
                { label: "Interior angle", value: fmt(result.interiorAngle) + "°" },
                { label: "Exterior angle", value: fmt(result.exteriorAngle) + "°" },
              ].map(r => (
                <div key={r.label} className={`p-2 border rounded text-center ${r.label === "Area" ? "bg-primary-light border-primary/20" : "bg-card border-card-border"}`}>
                  <div className="text-muted text-[10px]">{r.label}</div>
                  <div className={`font-mono font-semibold ${r.label === "Area" ? "text-primary" : ""}`}>{r.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
