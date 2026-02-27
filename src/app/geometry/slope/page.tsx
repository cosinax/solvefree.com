"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";
import { useMemo } from "react";

const inp = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm";

function fmt(n: number, d = 5): string {
  if (!isFinite(n) || isNaN(n)) return "—";
  return parseFloat(n.toPrecision(d)).toString();
}

export default function SlopePage() {
  const [v, setV] = useHashState({ x1: "1", y1: "2", x2: "4", y2: "8" });

  const result = useMemo(() => {
    const x1 = parseFloat(v.x1), y1 = parseFloat(v.y1);
    const x2 = parseFloat(v.x2), y2 = parseFloat(v.y2);
    if ([x1, y1, x2, y2].some(n => !isFinite(n))) return null;

    const dx = x2 - x1, dy = y2 - y1;
    const slope = dx === 0 ? Infinity : dy / dx;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const midX = (x1 + x2) / 2, midY = (y1 + y2) / 2;
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

    // Equation: y = mx + b
    const b = y1 - slope * x1;
    const slopeStr = isFinite(slope) ? fmt(slope) : "undefined (vertical)";
    const equation = isFinite(slope)
      ? `y = ${fmt(slope)}x ${b >= 0 ? "+" : ""} ${fmt(b)}`
      : `x = ${fmt(x1)}`;

    // Perpendicular slope
    const perpSlope = slope === 0 ? Infinity : -1 / slope;
    const perpEq = isFinite(perpSlope)
      ? `y = ${fmt(perpSlope)}x ${midY - perpSlope * midX >= 0 ? "+" : ""} ${fmt(midY - perpSlope * midX)}`
      : `x = ${fmt(midX)}`;

    return { slope, slopeStr, distance, midX, midY, angle, equation, perpEq, b };
  }, [v]);

  return (
    <CalculatorShell title="Slope Calculator" description="Slope, distance, midpoint, angle, and line equation for two points.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <p className="text-xs font-semibold text-muted">Point 1</p>
            <div>
              <label className="block text-xs text-muted mb-1">x₁</label>
              <input type="number" value={v.x1} onChange={e => setV({ x1: e.target.value })} className={inp} step="any" />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1">y₁</label>
              <input type="number" value={v.y1} onChange={e => setV({ y1: e.target.value })} className={inp} step="any" />
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-xs font-semibold text-muted">Point 2</p>
            <div>
              <label className="block text-xs text-muted mb-1">x₂</label>
              <input type="number" value={v.x2} onChange={e => setV({ x2: e.target.value })} className={inp} step="any" />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1">y₂</label>
              <input type="number" value={v.y2} onChange={e => setV({ y2: e.target.value })} className={inp} step="any" />
            </div>
          </div>
        </div>

        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-primary-light border border-primary/20 rounded-lg text-center">
                <div className="text-xs text-muted mb-1">Slope (m)</div>
                <div className="font-mono font-bold text-3xl text-primary">{result.slopeStr}</div>
              </div>
              <div className="p-4 bg-card border border-card-border rounded-lg text-center">
                <div className="text-xs text-muted mb-1">Distance</div>
                <div className="font-mono font-bold text-3xl">{fmt(result.distance)}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { label: "Midpoint", value: `(${fmt(result.midX)}, ${fmt(result.midY)})` },
                { label: "Angle (°)", value: fmt(result.angle) + "°" },
                { label: "Line equation", value: result.equation },
                { label: "Perpendicular line", value: result.perpEq },
              ].map(r => (
                <div key={r.label} className="p-2 bg-card border border-card-border rounded text-center">
                  <div className="text-muted text-[10px]">{r.label}</div>
                  <div className="font-mono font-semibold text-xs break-all">{r.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
