"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";
import { useMemo } from "react";

const inp = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm";

function fmt(n: number, d = 2) {
  if (!isFinite(n)) return "—";
  return n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
}

export default function RoofingPage() {
  const [v, setV] = useHashState({
    length: "40",
    width: "30",
    pitch: "6",
    ridges: "0",
    valleys: "0",
    pricePerSquare: "150",
    layers: "1",
  });

  const result = useMemo(() => {
    const l = parseFloat(v.length) || 0;
    const w = parseFloat(v.width) || 0;
    const pitch = parseFloat(v.pitch) || 0; // rise per 12" run
    const ridges = parseFloat(v.ridges) || 0; // linear ft
    const valleys = parseFloat(v.valleys) || 0; // linear ft
    const pricePerSquare = parseFloat(v.pricePerSquare) || 0;
    const layers = parseInt(v.layers) || 1;

    if (l <= 0 || w <= 0) return null;

    // Pitch multiplier: √(1 + (rise/12)²)
    const pitchMultiplier = Math.sqrt(1 + (pitch / 12) ** 2);
    const flatArea = l * w;
    const actualArea = flatArea * pitchMultiplier;

    // Roofing squares (1 square = 100 sq ft)
    const squares = actualArea / 100;
    // Add 10% waste
    const squaresWithWaste = squares * 1.1;

    // Bundles: 3 bundles = 1 square
    const bundles = Math.ceil(squaresWithWaste * 3);

    // Ridge cap: 1 bundle per 35 linear ft
    const ridgeBundles = Math.ceil(ridges / 35);
    // Valley flashing: 1 roll per 32 linear ft (assumed 18" wide)
    const valleyRolls = Math.ceil(valleys / 32);

    const materialCost = squaresWithWaste * pricePerSquare;
    const tearOffCost = layers > 1 ? (layers - 1) * squares * 30 : 0; // ~$30/sq to tear off
    const totalCost = materialCost + tearOffCost;

    return { flatArea, actualArea, squares, squaresWithWaste, bundles, ridgeBundles, valleyRolls, materialCost, tearOffCost, totalCost, pitchMultiplier };
  }, [v]);

  const pitchOptions = [
    { value: "0", label: "0/12 (flat)" },
    { value: "2", label: "2/12 (low)" },
    { value: "4", label: "4/12" },
    { value: "6", label: "6/12 (standard)" },
    { value: "8", label: "8/12 (steep)" },
    { value: "10", label: "10/12" },
    { value: "12", label: "12/12 (very steep)" },
  ];

  return (
    <CalculatorShell title="Roofing Calculator" description="Estimate shingles, bundles, and cost for a roof replacement or new installation.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-muted mb-1">Roof Length (ft)</label>
            <input type="number" value={v.length} onChange={e => setV({ length: e.target.value })} className={inp} min="0" step="1" />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Roof Width (ft)</label>
            <input type="number" value={v.width} onChange={e => setV({ width: e.target.value })} className={inp} min="0" step="1" />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Roof Pitch</label>
            <select value={v.pitch} onChange={e => setV({ pitch: e.target.value })} className={inp}>
              {pitchOptions.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Existing Layers</label>
            <select value={v.layers} onChange={e => setV({ layers: e.target.value })} className={inp}>
              <option value="1">1 (new roof)</option>
              <option value="2">2 (tear off 1 layer)</option>
              <option value="3">3 (tear off 2 layers)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Ridge Length (linear ft)</label>
            <input type="number" value={v.ridges} onChange={e => setV({ ridges: e.target.value })} className={inp} min="0" step="1" />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Price per Square ($)</label>
            <input type="number" value={v.pricePerSquare} onChange={e => setV({ pricePerSquare: e.target.value })} className={inp} min="0" step="5" />
          </div>
        </div>

        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-primary-light border border-primary/20 rounded-lg text-center">
                <div className="text-xs text-muted mb-1">Shingle Bundles</div>
                <div className="font-mono font-bold text-3xl text-primary">{result.bundles}</div>
                <div className="text-xs text-muted mt-1">{fmt(result.squaresWithWaste, 1)} squares (incl. 10% waste)</div>
              </div>
              <div className="p-4 bg-card border border-card-border rounded-lg text-center">
                <div className="text-xs text-muted mb-1">Material Cost</div>
                <div className="font-mono font-bold text-2xl">${fmt(result.materialCost, 0)}</div>
                {result.tearOffCost > 0 && <div className="text-xs text-muted mt-1">+${fmt(result.tearOffCost, 0)} tear-off</div>}
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-center">
              {[
                { label: "Flat Area", value: `${fmt(result.flatArea, 0)} ft²` },
                { label: "Actual Area", value: `${fmt(result.actualArea, 0)} ft²` },
                { label: "Ridge Cap Bundles", value: result.ridgeBundles > 0 ? result.ridgeBundles.toString() : "0" },
                { label: "Pitch Multiplier", value: `×${fmt(result.pitchMultiplier, 3)}` },
              ].map(r => (
                <div key={r.label} className="p-2 bg-card border border-card-border rounded">
                  <div className="text-muted">{r.label}</div>
                  <div className="font-mono font-semibold">{r.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="text-xs text-muted">1 roofing square = 100 sq ft. 3 bundles = 1 square (for 3-tab shingles). Includes 10% waste. Does not include underlayment, nails, or labor.</p>
      </div>
    </CalculatorShell>
  );
}
