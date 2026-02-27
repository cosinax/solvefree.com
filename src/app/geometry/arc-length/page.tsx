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

export default function ArcLengthPage() {
  const [v, setV] = useHashState({ mode: "deg", r: "5", angle: "90" });

  const result = useMemo(() => {
    const r = parseFloat(v.r);
    const angle = parseFloat(v.angle);
    if (!isFinite(r) || !isFinite(angle) || r <= 0 || angle <= 0) return null;

    const angleRad = v.mode === "deg" ? angle * RAD : angle;
    const angleDeg = v.mode === "deg" ? angle : angle / RAD;
    if (angleDeg > 360) return null;

    const arcLength = r * angleRad;
    const sectorArea = 0.5 * r * r * angleRad;
    const chordLength = 2 * r * Math.sin(angleRad / 2);
    const segmentArea = sectorArea - 0.5 * r * r * Math.sin(angleRad);

    return { arcLength, sectorArea, chordLength, segmentArea, angleDeg, angleRad, r };
  }, [v]);

  return (
    <CalculatorShell title="Arc Length Calculator" description="Arc length, sector area, chord, and segment area from radius and central angle.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-muted mb-1">Radius (r)</label>
            <input type="number" value={v.r} onChange={e => setV({ r: e.target.value })} className={inp} min="0" step="any" />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Central angle</label>
            <div className="flex gap-2">
              <input type="number" value={v.angle} onChange={e => setV({ angle: e.target.value })} className={inp} min="0" step="any" />
              <div className="flex gap-1">
                {["deg", "rad"].map(m => (
                  <button key={m} onClick={() => setV({ mode: m })}
                    className={`px-2 py-2 text-xs rounded-lg border transition-colors ${v.mode === m ? "bg-primary text-white border-primary" : "bg-card border-card-border"}`}>
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {result && (
          <div className="space-y-3">
            {/* Arc visualization */}
            <div className="flex justify-center p-4 bg-card border border-card-border rounded-lg">
              <svg viewBox="-65 -65 130 130" className="h-24 w-24">
                <circle cx="0" cy="0" r="55" fill="none" stroke="var(--color-card-border)" strokeWidth="1" />
                {(() => {
                  const startAngle = -90 * RAD;
                  const endAngle = startAngle + Math.min(result.angleRad, 2 * Math.PI);
                  const x1 = 55 * Math.cos(startAngle);
                  const y1 = 55 * Math.sin(startAngle);
                  const x2 = 55 * Math.cos(endAngle);
                  const y2 = 55 * Math.sin(endAngle);
                  const largeArc = result.angleDeg > 180 ? 1 : 0;
                  return <>
                    <path d={`M 0 0 L ${x1} ${y1} A 55 55 0 ${largeArc} 1 ${x2} ${y2} Z`}
                      fill="rgba(99,102,241,0.2)" stroke="rgb(99,102,241)" strokeWidth="1.5" />
                    <line x1="0" y1="0" x2={x1} y2={y1} stroke="rgb(99,102,241)" strokeWidth="1" />
                  </>;
                })()}
              </svg>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { label: "Arc Length", value: fmt(result.arcLength) },
                { label: "Sector Area", value: fmt(result.sectorArea) },
                { label: "Chord Length", value: fmt(result.chordLength) },
                { label: "Segment Area", value: fmt(result.segmentArea) },
                { label: "Angle (deg)", value: fmt(result.angleDeg) + "°" },
                { label: "Angle (rad)", value: fmt(result.angleRad) + " rad" },
              ].map(r => (
                <div key={r.label} className={`p-2 border rounded text-center ${r.label === "Arc Length" ? "bg-primary-light border-primary/20" : "bg-card border-card-border"}`}>
                  <div className="text-muted text-[10px]">{r.label}</div>
                  <div className={`font-mono font-semibold ${r.label === "Arc Length" ? "text-primary" : ""}`}>{r.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
