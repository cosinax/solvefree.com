"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

export default function SlopePage() {
  const [v, setV] = useHashState({ x1: "1", y1: "2", x2: "4", y2: "8" });

  const x1 = parseFloat(v.x1);
  const y1 = parseFloat(v.y1);
  const x2 = parseFloat(v.x2);
  const y2 = parseFloat(v.y2);
  const valid = !isNaN(x1) && !isNaN(y1) && !isNaN(x2) && !isNaN(y2);

  const dx = valid ? x2 - x1 : 0;
  const dy = valid ? y2 - y1 : 0;
  const isVertical = valid && dx === 0;
  const slope = valid && !isVertical ? dy / dx : NaN;
  const yIntercept = valid && !isVertical ? y1 - slope * x1 : NaN;
  const angleDeg = valid && !isVertical ? Math.atan(slope) * (180 / Math.PI) : (isVertical ? 90 : NaN);
  const distance = valid ? Math.sqrt(dx * dx + dy * dy) : NaN;

  function fmt(n: number, d = 6) {
    return parseFloat(n.toPrecision(d)).toString();
  }

  function fmtEq() {
    if (!valid || isVertical) return isVertical ? `x = ${x1}` : "";
    const mStr = fmt(slope);
    const bVal = yIntercept!;
    const bStr = bVal >= 0 ? `+ ${fmt(bVal)}` : `- ${fmt(Math.abs(bVal))}`;
    return `y = ${mStr}x ${bStr}`;
  }

  return (
    <CalculatorShell title="Slope Calculator" description="Find the slope, y-intercept, equation, angle, and distance between two points.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-muted mb-1">Point 1 (x1)</label>
            <input type="number" value={v.x1} onChange={e => setV({ x1: e.target.value })} className={ic} />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Point 1 (y1)</label>
            <input type="number" value={v.y1} onChange={e => setV({ y1: e.target.value })} className={ic} />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Point 2 (x2)</label>
            <input type="number" value={v.x2} onChange={e => setV({ x2: e.target.value })} className={ic} />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Point 2 (y2)</label>
            <input type="number" value={v.y2} onChange={e => setV({ y2: e.target.value })} className={ic} />
          </div>
        </div>

        {valid && (
          <div className="space-y-3">
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="text-xs text-muted block mb-1">Slope (m)</span>
              <span className="block font-mono font-bold text-4xl text-primary">
                {isVertical ? "undefined" : fmt(slope)}
              </span>
              {!isVertical && <span className="text-xs text-muted mt-1 block">{fmtEq()}</span>}
            </div>

            <div className="space-y-1 text-xs font-mono">
              <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded">
                <span className="text-muted">Slope (m = Δy/Δx)</span>
                <span className="font-semibold">{isVertical ? "undefined" : fmt(slope)}</span>
              </div>
              <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded">
                <span className="text-muted">Y-intercept (b)</span>
                <span className="font-semibold">{isVertical ? "N/A" : fmt(yIntercept!)}</span>
              </div>
              <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded">
                <span className="text-muted">Equation</span>
                <span className="font-semibold">{fmtEq()}</span>
              </div>
              <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded">
                <span className="text-muted">Angle (degrees)</span>
                <span className="font-semibold">{isNaN(angleDeg) ? "N/A" : fmt(angleDeg) + "°"}</span>
              </div>
              <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded">
                <span className="text-muted">Distance</span>
                <span className="font-semibold">{fmt(distance)}</span>
              </div>
              <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded">
                <span className="text-muted">Rise (Δy)</span>
                <span className="font-semibold">{fmt(dy)}</span>
              </div>
              <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded">
                <span className="text-muted">Run (Δx)</span>
                <span className="font-semibold">{fmt(dx)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
