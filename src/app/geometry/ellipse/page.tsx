"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";
import { useMemo } from "react";

const inp = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm";

function fmt(n: number, d = 5): string {
  if (!isFinite(n) || isNaN(n)) return "—";
  return parseFloat(n.toPrecision(d)).toString();
}

export default function EllipsePage() {
  const [v, setV] = useHashState({ a: "8", b: "5" });

  const result = useMemo(() => {
    const a = parseFloat(v.a); // semi-major
    const b = parseFloat(v.b); // semi-minor
    if (!isFinite(a) || !isFinite(b) || a <= 0 || b <= 0) return null;
    const major = Math.max(a, b), minor = Math.min(a, b);
    const area = Math.PI * major * minor;
    // Ramanujan approximation for perimeter
    const h = ((major - minor) / (major + minor)) ** 2;
    const perimeter = Math.PI * (major + minor) * (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h)));
    const e = Math.sqrt(1 - (minor / major) ** 2);
    const c = Math.sqrt(major * major - minor * minor);
    const directrix = major / e;
    return { area, perimeter, e, c, directrix, major, minor };
  }, [v]);

  return (
    <CalculatorShell title="Ellipse Calculator" description="Area, perimeter (Ramanujan approximation), eccentricity, and foci.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-muted mb-1">Semi-major axis a</label>
            <input type="number" value={v.a} onChange={e => setV({ a: e.target.value })} className={inp} min="0" step="any" />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Semi-minor axis b</label>
            <input type="number" value={v.b} onChange={e => setV({ b: e.target.value })} className={inp} min="0" step="any" />
          </div>
        </div>

        {result && (
          <div className="space-y-3">
            <div className="flex justify-center p-4 bg-card border border-card-border rounded-lg">
              <svg viewBox="-65 -45 130 90" className="h-20">
                {(() => {
                  const maxR = 60;
                  const scaleA = result.major > result.minor ? maxR / result.major : maxR / result.minor;
                  const a2 = result.major * scaleA;
                  const b2 = result.minor * scaleA;
                  const c2 = result.c * scaleA;
                  return <>
                    <ellipse cx="0" cy="0" rx={a2} ry={b2} fill="rgba(99,102,241,0.1)" stroke="rgb(99,102,241)" strokeWidth="1.5" />
                    <line x1={-a2} y1="0" x2={a2} y2="0" stroke="rgb(99,102,241)" strokeWidth="0.5" strokeDasharray="3,2" />
                    <line x1="0" y1={-b2} x2="0" y2={b2} stroke="rgb(99,102,241)" strokeWidth="0.5" strokeDasharray="3,2" />
                    <circle cx={c2} cy="0" r="2" fill="rgb(239,68,68)" />
                    <circle cx={-c2} cy="0" r="2" fill="rgb(239,68,68)" />
                  </>;
                })()}
              </svg>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {[
                { label: "Semi-major (a)", value: fmt(result.major) },
                { label: "Semi-minor (b)", value: fmt(result.minor) },
                { label: "Area", value: fmt(result.area) },
                { label: "Perimeter (≈)", value: fmt(result.perimeter) },
                { label: "Eccentricity (e)", value: fmt(result.e) },
                { label: "Focal distance (c)", value: fmt(result.c) },
              ].map(r => (
                <div key={r.label} className={`p-2 border rounded text-center ${r.label === "Area" ? "bg-primary-light border-primary/20" : "bg-card border-card-border"}`}>
                  <div className="text-muted text-[10px]">{r.label}</div>
                  <div className={`font-mono font-semibold ${r.label === "Area" ? "text-primary" : ""}`}>{r.value}</div>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted">Red dots mark the two foci. Eccentricity: 0 = circle, closer to 1 = more elongated.</p>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
