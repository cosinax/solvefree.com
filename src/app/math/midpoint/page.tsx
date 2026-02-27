"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";
import { useMemo } from "react";

const inp = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm";

function fmt(n: number) {
  if (!isFinite(n) || isNaN(n)) return "—";
  return parseFloat(n.toPrecision(8)).toString();
}

export default function MidpointPage() {
  const [v, setV] = useHashState({ x1: "1", y1: "2", x2: "5", y2: "8" });

  const x1 = parseFloat(v.x1);
  const y1 = parseFloat(v.y1);
  const x2 = parseFloat(v.x2);
  const y2 = parseFloat(v.y2);

  const results = useMemo(() => {
    if ([x1, y1, x2, y2].some(isNaN)) return null;
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    const dist = Math.sqrt((x2-x1)**2 + (y2-y1)**2);
    const slope = x2 !== x1 ? (y2 - y1) / (x2 - x1) : Infinity;
    return { mx, my, dist, slope };
  }, [x1, y1, x2, y2]);

  return (
    <CalculatorShell title="Midpoint Calculator" description="Find the midpoint, distance, and slope between two coordinate points.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted">Point 1 (x₁, y₁)</p>
            <input type="number" value={v.x1} onChange={e => setV({ x1: e.target.value })} className={inp} placeholder="x₁" step="any" />
            <input type="number" value={v.y1} onChange={e => setV({ y1: e.target.value })} className={inp} placeholder="y₁" step="any" />
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted">Point 2 (x₂, y₂)</p>
            <input type="number" value={v.x2} onChange={e => setV({ x2: e.target.value })} className={inp} placeholder="x₂" step="any" />
            <input type="number" value={v.y2} onChange={e => setV({ y2: e.target.value })} className={inp} placeholder="y₂" step="any" />
          </div>
        </div>

        {results && (
          <div className="space-y-2">
            <div className="p-3 bg-primary-light border border-primary/20 rounded-lg text-center">
              <div className="text-xs text-muted mb-1">Midpoint</div>
              <div className="font-mono font-bold text-2xl text-primary">({fmt(results.mx)}, {fmt(results.my)})</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-card border border-card-border rounded-lg text-center">
                <div className="text-xs text-muted mb-1">Distance</div>
                <div className="font-mono font-bold text-xl">{fmt(results.dist)}</div>
              </div>
              <div className="p-3 bg-card border border-card-border rounded-lg text-center">
                <div className="text-xs text-muted mb-1">Slope</div>
                <div className="font-mono font-bold text-xl">
                  {isFinite(results.slope) ? fmt(results.slope) : "undefined (vertical)"}
                </div>
              </div>
            </div>
            <div className="p-3 bg-card border border-card-border rounded-lg text-xs text-muted space-y-1 font-mono">
              <p>Midpoint: (({v.x1}+{v.x2})/2, ({v.y1}+{v.y2})/2) = ({fmt(results.mx)}, {fmt(results.my)})</p>
              <p>Distance: √(({v.x2}-{v.x1})² + ({v.y2}-{v.y1})²) = {fmt(results.dist)}</p>
              {isFinite(results.slope) && <p>Slope: ({v.y2}-{v.y1}) / ({v.x2}-{v.x1}) = {fmt(results.slope)}</p>}
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
