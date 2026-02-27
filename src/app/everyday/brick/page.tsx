"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
const sel = "w-full px-3 py-2.5 bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

// Standard brick: 7.625" × 3.625" × 2.25"
// Bricks per sq ft depends on bond pattern and mortar joint
// Running bond ~6.75 bricks/sq ft with 3/8" mortar, stack ~7, herringbone ~6.5
const BOND_DATA: Record<string, { label: string; bricksPerSqFt: number }> = {
  running: { label: "Running Bond", bricksPerSqFt: 6.75 },
  stack: { label: "Stack Bond", bricksPerSqFt: 7.0 },
  herringbone: { label: "Herringbone", bricksPerSqFt: 6.5 },
};

// Mortar: approx 1 bag (60 lb) covers 25-30 bricks
const BRICKS_PER_MORTAR_BAG = 25;

export default function BrickPage() {
  const [v, setV] = useHashState({ area: "100", bond: "running", mortar: "0.375", price: "" });

  const area = parseFloat(v.area);
  const bond = BOND_DATA[v.bond] ?? BOND_DATA.running;
  const price = parseFloat(v.price);
  const valid = area > 0;

  const bricksNeeded = Math.ceil(area * bond.bricksPerSqFt * 1.05); // 5% waste
  const mortarBags = Math.ceil(bricksNeeded / BRICKS_PER_MORTAR_BAG);
  const cost = !isNaN(price) && price > 0 ? bricksNeeded * price : null;

  return (
    <CalculatorShell title="Brick Calculator" description={'Calculate bricks and mortar needed for a wall or paving project. Standard brick: 7.625" × 3.625" × 2.25"'}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-muted mb-1">Wall / Surface Area (sq ft)</label>
          <input type="number" value={v.area} onChange={e => setV({ area: e.target.value })} className={ic} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-muted mb-1">Bond Pattern</label>
            <select value={v.bond} onChange={e => setV({ bond: e.target.value })} className={sel}>
              {Object.entries(BOND_DATA).map(([k, d]) => <option key={k} value={k}>{d.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Mortar Joint (inches)</label>
            <select value={v.mortar} onChange={e => setV({ mortar: e.target.value })} className={sel}>
              <option value="0.25">1/4"</option>
              <option value="0.375">3/8"</option>
              <option value="0.5">1/2"</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">Price per Brick (optional)</label>
          <input type="number" value={v.price} onChange={e => setV({ price: e.target.value })} placeholder="e.g. 0.75" className={ic} />
        </div>

        {valid && (
          <div className="space-y-3">
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="block text-xs text-muted mb-1">Bricks Needed (incl. 5% waste)</span>
              <span className="block font-mono font-bold text-4xl text-primary">{bricksNeeded.toLocaleString()}</span>
              <span className="text-xs text-muted">bricks</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col items-center px-3 py-2.5 bg-background border border-card-border rounded text-xs font-mono text-center">
                <span className="text-muted mb-1">Mortar Bags (60 lb)</span>
                <span className="font-bold">{mortarBags}</span>
              </div>
              <div className="flex flex-col items-center px-3 py-2.5 bg-background border border-card-border rounded text-xs font-mono text-center">
                <span className="text-muted mb-1">Bricks per Sq Ft</span>
                <span className="font-bold">{bond.bricksPerSqFt}</span>
              </div>
            </div>
            {cost !== null && (
              <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
                <span className="text-muted">Estimated Brick Cost</span>
                <span className="font-bold text-primary">${cost.toFixed(2)}</span>
              </div>
            )}
          </div>
        )}
        <div className="space-y-1">
          <p className="text-xs text-muted font-semibold">Standard Brick Dimensions</p>
          <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
            <span className="text-muted">Length × Height × Depth</span>
            <span>7.625" × 2.25" × 3.625"</span>
          </div>
        </div>
      </div>
    </CalculatorShell>
  );
}
