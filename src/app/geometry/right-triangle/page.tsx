"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";
import { useMemo } from "react";

const inp = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm";
const RAD = Math.PI / 180;

function fmt(n: number, d = 5): string {
  if (!isFinite(n) || isNaN(n)) return "—";
  return parseFloat(n.toPrecision(d)).toString();
}

export default function RightTrianglePage() {
  const [v, setV] = useHashState({ mode: "ab", a: "3", b: "4", c: "5", angle: "30" });

  const result = useMemo(() => {
    const a = parseFloat(v.a);
    const b = parseFloat(v.b);
    const c = parseFloat(v.c);
    const angle = parseFloat(v.angle); // in degrees

    if (v.mode === "ab") {
      if (!isFinite(a) || !isFinite(b) || a <= 0 || b <= 0) return null;
      const hyp = Math.sqrt(a * a + b * b);
      const A = Math.atan(a / b) / RAD; // opposite/adjacent → angle at B
      const B = 90 - A;
      return { a, b, c: hyp, angleA: A, angleB: B, area: 0.5 * a * b, perimeter: a + b + hyp };
    } else if (v.mode === "ac") {
      if (!isFinite(a) || !isFinite(c) || a <= 0 || c <= 0 || a >= c) return null;
      const side = Math.sqrt(c * c - a * a);
      const A = Math.asin(a / c) / RAD;
      const B = 90 - A;
      return { a, b: side, c, angleA: A, angleB: B, area: 0.5 * a * side, perimeter: a + side + c };
    } else {
      // leg from hypotenuse + angle
      if (!isFinite(c) || !isFinite(angle) || c <= 0 || angle <= 0 || angle >= 90) return null;
      const side1 = c * Math.sin(angle * RAD);
      const side2 = c * Math.cos(angle * RAD);
      return { a: side1, b: side2, c, angleA: angle, angleB: 90 - angle, area: 0.5 * side1 * side2, perimeter: side1 + side2 + c };
    }
  }, [v]);

  const modes = [
    { k: "ab", l: "Two Legs (a, b)" },
    { k: "ac", l: "Leg + Hypotenuse" },
    { k: "ca", l: "Hypotenuse + Angle" },
  ];

  return (
    <CalculatorShell title="Right Triangle Calculator" description="Solve a right triangle from two known values.">
      <div className="space-y-4">
        <div>
          <label className="block text-xs text-muted mb-1">Known values</label>
          <select value={v.mode} onChange={e => setV({ mode: e.target.value })} className={inp}>
            {modes.map(m => <option key={m.k} value={m.k}>{m.l}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {(v.mode === "ab" || v.mode === "ac") && (
            <div>
              <label className="block text-xs text-muted mb-1">Leg a</label>
              <input type="number" value={v.a} onChange={e => setV({ a: e.target.value })} className={inp} min="0" step="any" />
            </div>
          )}
          {v.mode === "ab" && (
            <div>
              <label className="block text-xs text-muted mb-1">Leg b</label>
              <input type="number" value={v.b} onChange={e => setV({ b: e.target.value })} className={inp} min="0" step="any" />
            </div>
          )}
          {v.mode === "ac" && (
            <div>
              <label className="block text-xs text-muted mb-1">Hypotenuse c</label>
              <input type="number" value={v.c} onChange={e => setV({ c: e.target.value })} className={inp} min="0" step="any" />
            </div>
          )}
          {v.mode === "ca" && (
            <>
              <div>
                <label className="block text-xs text-muted mb-1">Hypotenuse c</label>
                <input type="number" value={v.c} onChange={e => setV({ c: e.target.value })} className={inp} min="0" step="any" />
              </div>
              <div>
                <label className="block text-xs text-muted mb-1">Angle A (°)</label>
                <input type="number" value={v.angle} onChange={e => setV({ angle: e.target.value })} className={inp} min="0" max="90" step="any" />
              </div>
            </>
          )}
        </div>

        {result && (
          <div className="space-y-3">
            {/* Triangle SVG */}
            <div className="flex justify-center p-4 bg-card border border-card-border rounded-lg">
              <svg viewBox="-10 -10 130 90" className="h-24">
                <polygon points="0,70 100,70 0,0" fill="rgba(99,102,241,0.1)" stroke="rgb(99,102,241)" strokeWidth="1.5" />
                {/* Right angle marker */}
                <polyline points="0,60 10,60 10,70" fill="none" stroke="rgb(99,102,241)" strokeWidth="1" />
                {/* Labels */}
                <text x="-8" y="38" fontSize="9" fill="currentColor">a</text>
                <text x="50" y="82" fontSize="9" fill="currentColor" textAnchor="middle">b</text>
                <text x="54" y="30" fontSize="9" fill="currentColor">c</text>
                <text x="2" y="88" fontSize="8" fill="rgb(99,102,241)">{fmt(result.angleB, 4)}°</text>
                <text x="96" y="88" fontSize="8" fill="rgb(99,102,241)" textAnchor="end">{fmt(result.angleA, 4)}°</text>
              </svg>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              {[
                { label: "Leg a", value: fmt(result.a) },
                { label: "Leg b", value: fmt(result.b) },
                { label: "Hypotenuse c", value: fmt(result.c) },
                { label: "Angle A", value: fmt(result.angleA) + "°" },
                { label: "Angle B", value: fmt(result.angleB) + "°" },
                { label: "Angle C", value: "90°" },
                { label: "Area", value: fmt(result.area) },
                { label: "Perimeter", value: fmt(result.perimeter) },
              ].map(r => (
                <div key={r.label} className={`p-2 border rounded text-center ${r.label.includes("Hyp") || r.label === "Area" ? "bg-primary-light border-primary/20" : "bg-card border-card-border"}`}>
                  <div className="text-muted text-[10px]">{r.label}</div>
                  <div className={`font-mono font-semibold ${r.label.includes("Hyp") || r.label === "Area" ? "text-primary" : ""}`}>{r.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
