"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";
import { useMemo } from "react";

const inp = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm";

function fmt(n: number) {
  if (!isFinite(n) || isNaN(n)) return "—";
  return parseFloat(n.toPrecision(8)).toString();
}

export default function DistancePage() {
  const [v, setV] = useHashState({ mode: "2d", x1: "1", y1: "2", x2: "7", y2: "10", z1: "0", z2: "4" });

  const is3d = v.mode === "3d";

  const coords = useMemo(() => ({
    x1: parseFloat(v.x1), y1: parseFloat(v.y1), x2: parseFloat(v.x2), y2: parseFloat(v.y2),
    z1: parseFloat(v.z1), z2: parseFloat(v.z2),
  }), [v]);

  const results = useMemo(() => {
    const { x1, y1, x2, y2, z1, z2 } = coords;
    if ([x1, y1, x2, y2].some(isNaN)) return null;
    if (is3d && [z1, z2].some(isNaN)) return null;
    const dx = x2 - x1, dy = y2 - y1;
    const dz = is3d ? (z2 - z1) : 0;
    const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
    const taxicab = is3d ? (Math.abs(dx) + Math.abs(dy) + Math.abs(dz)) : (Math.abs(dx) + Math.abs(dy));
    return { dist, taxicab, dx, dy, dz };
  }, [coords, is3d]);

  return (
    <CalculatorShell title="Distance Calculator" description="Calculate the Euclidean distance between two points in 2D or 3D space.">
      <div className="space-y-4">
        <div>
          <label className="block text-xs text-muted mb-1">Dimensions</label>
          <select value={v.mode} onChange={e => setV({ mode: e.target.value })} className={inp}>
            <option value="2d">2D (x, y)</option>
            <option value="3d">3D (x, y, z)</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted">Point 1</p>
            <input type="number" value={v.x1} onChange={e => setV({ x1: e.target.value })} className={inp} placeholder="x₁" step="any" />
            <input type="number" value={v.y1} onChange={e => setV({ y1: e.target.value })} className={inp} placeholder="y₁" step="any" />
            {is3d && <input type="number" value={v.z1} onChange={e => setV({ z1: e.target.value })} className={inp} placeholder="z₁" step="any" />}
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted">Point 2</p>
            <input type="number" value={v.x2} onChange={e => setV({ x2: e.target.value })} className={inp} placeholder="x₂" step="any" />
            <input type="number" value={v.y2} onChange={e => setV({ y2: e.target.value })} className={inp} placeholder="y₂" step="any" />
            {is3d && <input type="number" value={v.z2} onChange={e => setV({ z2: e.target.value })} className={inp} placeholder="z₂" step="any" />}
          </div>
        </div>

        {results && (
          <div className="space-y-2">
            <div className="p-4 bg-primary-light border border-primary/20 rounded-lg text-center">
              <div className="text-xs text-muted mb-1">Euclidean Distance</div>
              <div className="font-mono font-bold text-3xl text-primary">{fmt(results.dist)}</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-card border border-card-border rounded-lg text-center">
                <div className="text-xs text-muted mb-1">Manhattan (Taxicab) Distance</div>
                <div className="font-mono font-bold text-xl">{fmt(results.taxicab)}</div>
              </div>
              <div className="p-3 bg-card border border-card-border rounded-lg text-center">
                <div className="text-xs text-muted mb-1">Differences (Δx, Δy{is3d ? ", Δz" : ""})</div>
                <div className="font-mono font-semibold">{fmt(results.dx)}, {fmt(results.dy)}{is3d ? `, ${fmt(results.dz)}` : ""}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
