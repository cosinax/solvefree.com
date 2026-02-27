"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";
import { useMemo } from "react";

const inp = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm";

function fmt(n: number, d = 5): string {
  if (!isFinite(n) || isNaN(n)) return "—";
  return parseFloat(n.toPrecision(d)).toString();
}

export default function CirclePage() {
  const [v, setV] = useHashState({ mode: "radius", value: "5", angle: "90" });

  const result = useMemo(() => {
    const val = parseFloat(v.value);
    const angle = parseFloat(v.angle);
    if (!isFinite(val) || val <= 0) return null;

    let r: number;
    if (v.mode === "radius") r = val;
    else if (v.mode === "diameter") r = val / 2;
    else if (v.mode === "circumference") r = val / (2 * Math.PI);
    else r = Math.sqrt(val / Math.PI); // area

    const diameter = 2 * r;
    const circumference = 2 * Math.PI * r;
    const area = Math.PI * r * r;

    // Sector/arc (central angle)
    const ang = isFinite(angle) && angle > 0 && angle <= 360 ? angle : null;
    const arcLength = ang ? (ang / 360) * circumference : null;
    const sectorArea = ang ? (ang / 360) * area : null;
    const chordLength = ang ? 2 * r * Math.sin((ang * Math.PI) / 360) : null;

    return { r, diameter, circumference, area, arcLength, sectorArea, chordLength };
  }, [v]);

  const modes = [
    { k: "radius", l: "Radius" },
    { k: "diameter", l: "Diameter" },
    { k: "circumference", l: "Circumference" },
    { k: "area", l: "Area" },
  ];

  return (
    <CalculatorShell title="Circle Calculator" description="Area, circumference, arc length, sector area, and chord length for any circle.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-muted mb-1">Given</label>
            <select value={v.mode} onChange={e => setV({ mode: e.target.value })} className={inp}>
              {modes.map(m => <option key={m.k} value={m.k}>{m.l}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Value</label>
            <input type="number" value={v.value} onChange={e => setV({ value: e.target.value })} className={inp} min="0" step="any" />
          </div>
        </div>

        <div>
          <label className="block text-xs text-muted mb-1">Central angle (°) for arc/sector</label>
          <input type="number" value={v.angle} onChange={e => setV({ angle: e.target.value })} className={inp} min="0" max="360" step="1" />
        </div>

        {result && (
          <div className="space-y-3">
            {/* Circle SVG */}
            <div className="flex justify-center p-4 bg-card border border-card-border rounded-lg">
              <svg viewBox="-60 -60 120 120" className="h-24 w-24">
                <circle cx="0" cy="0" r="50" fill="rgba(99,102,241,0.1)" stroke="rgb(99,102,241)" strokeWidth="1.5" />
                <line x1="0" y1="0" x2="50" y2="0" stroke="rgb(99,102,241)" strokeWidth="1" strokeDasharray="3,2" />
                <text x="25" y="-4" fontSize="8" fill="rgb(99,102,241)" textAnchor="middle">r</text>
              </svg>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { label: "Radius", value: fmt(result.r) },
                { label: "Diameter", value: fmt(result.diameter) },
                { label: "Circumference", value: fmt(result.circumference) },
                { label: "Area", value: fmt(result.area) },
                ...(result.arcLength != null ? [
                  { label: `Arc Length (${v.angle}°)`, value: fmt(result.arcLength) },
                  { label: `Sector Area (${v.angle}°)`, value: fmt(result.sectorArea!) },
                  { label: "Chord Length", value: fmt(result.chordLength!) },
                ] : []),
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
