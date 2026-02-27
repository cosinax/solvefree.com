"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";
import { useMemo } from "react";

const inp = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm";

function fmt(n: number, d = 2) {
  return n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
}

export default function FencePage() {
  const [v, setV] = useHashState({
    perimeter: "200",
    gates: "1",
    postSpacing: "8",
    fenceHeight: "6",
    pricePerFt: "15",
    style: "wood",
  });

  const result = useMemo(() => {
    const perim = parseFloat(v.perimeter) || 0;
    const gates = parseInt(v.gates) || 0;
    const postSpacing = parseFloat(v.postSpacing) || 8;
    const h = parseFloat(v.fenceHeight) || 0;
    const pricePerFt = parseFloat(v.pricePerFt) || 0;

    if (perim <= 0) return null;

    const gateWidth = 4; // standard 4-ft gate
    const fenceLength = perim - gates * gateWidth;
    const posts = Math.ceil(fenceLength / postSpacing) + 1 + gates * 2;
    const rails = Math.ceil(fenceLength / 8) * (h <= 4 ? 2 : 3); // rails per 8-ft section
    const pickets = Math.ceil(fenceLength / (3.5 / 12)); // 3.5" wide pickets

    const materialCost = fenceLength * pricePerFt;
    const totalCost = materialCost * 1.3; // 30% labor estimate

    return { fenceLength, posts, rails, pickets, materialCost, totalCost };
  }, [v]);

  return (
    <CalculatorShell title="Fence Calculator" description="Estimate materials and cost for a fence project.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-muted mb-1">Total Perimeter (ft)</label>
            <input type="number" value={v.perimeter} onChange={e => setV({ perimeter: e.target.value })} className={inp} min="0" step="1" />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Number of Gates</label>
            <input type="number" value={v.gates} onChange={e => setV({ gates: e.target.value })} className={inp} min="0" step="1" />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Post Spacing (ft)</label>
            <input type="number" value={v.postSpacing} onChange={e => setV({ postSpacing: e.target.value })} className={inp} min="4" max="12" step="1" />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Fence Height (ft)</label>
            <input type="number" value={v.fenceHeight} onChange={e => setV({ fenceHeight: e.target.value })} className={inp} min="2" max="10" step="0.5" />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Fence Style</label>
            <select value={v.style} onChange={e => setV({ style: e.target.value })} className={inp}>
              <option value="wood">Wood Privacy</option>
              <option value="picket">Wood Picket</option>
              <option value="chain">Chain Link</option>
              <option value="vinyl">Vinyl</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Material Price ($/linear ft)</label>
            <input type="number" value={v.pricePerFt} onChange={e => setV({ pricePerFt: e.target.value })} className={inp} min="0" step="0.5" />
          </div>
        </div>

        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-primary-light border border-primary/20 rounded-lg text-center">
                <div className="text-xs text-muted mb-1">Material Cost</div>
                <div className="font-mono font-bold text-2xl text-primary">${fmt(result.materialCost, 0)}</div>
              </div>
              <div className="p-4 bg-card border border-card-border rounded-lg text-center">
                <div className="text-xs text-muted mb-1">Total Estimate (w/ labor)</div>
                <div className="font-mono font-bold text-2xl">${fmt(result.totalCost, 0)}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-center">
              {[
                { label: "Fence Length", value: `${fmt(result.fenceLength, 0)} ft` },
                { label: "Posts Needed", value: result.posts.toString() },
                { label: "Rails", value: result.rails.toString() },
                { label: "Pickets (est.)", value: result.pickets.toLocaleString() },
              ].map(r => (
                <div key={r.label} className="p-2 bg-card border border-card-border rounded">
                  <div className="text-muted">{r.label}</div>
                  <div className="font-mono font-semibold">{r.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="text-xs text-muted">Labor estimate is +30% of materials. Picket count assumes 3.5" wide boards. Check local prices for accurate material costs.</p>
      </div>
    </CalculatorShell>
  );
}
