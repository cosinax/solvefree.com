"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

const MATERIALS = [
  { label: "Hardwood", min: 5, max: 12 },
  { label: "Laminate", min: 1, max: 4 },
  { label: "Tile (ceramic)", min: 1, max: 5 },
  { label: "Tile (porcelain)", min: 3, max: 8 },
  { label: "Carpet", min: 1, max: 5 },
  { label: "Luxury Vinyl Plank", min: 2, max: 7 },
];

export default function FlooringPage() {
  const [v, setV] = useHashState({ length: "12", width: "10", waste: "10", price: "" });

  const length = parseFloat(v.length);
  const width = parseFloat(v.width);
  const waste = parseFloat(v.waste) || 10;
  const price = parseFloat(v.price);
  const valid = length > 0 && width > 0;

  const baseArea = length * width;
  const totalArea = baseArea * (1 + waste / 100);
  const sqYards = totalArea / 9;
  const cost = !isNaN(price) && price > 0 ? totalArea * price : null;

  return (
    <CalculatorShell title="Flooring Calculator" description="Calculate flooring materials needed including waste factor, and estimate project cost.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-muted mb-1">Room Length (ft)</label>
            <input type="number" value={v.length} onChange={e => setV({ length: e.target.value })} className={ic} />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Room Width (ft)</label>
            <input type="number" value={v.width} onChange={e => setV({ width: e.target.value })} className={ic} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-muted mb-1">Waste Factor (%)</label>
            <input type="number" value={v.waste} onChange={e => setV({ waste: e.target.value })} placeholder="10" className={ic} />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Price per Sq Ft (optional)</label>
            <input type="number" value={v.price} onChange={e => setV({ price: e.target.value })} placeholder="e.g. 4.50" className={ic} />
          </div>
        </div>

        {valid && (
          <div className="space-y-3">
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="block text-xs text-muted mb-1">Square Feet Needed (with {waste}% waste)</span>
              <span className="block font-mono font-bold text-4xl text-primary">{Math.ceil(totalArea)}</span>
              <span className="text-xs text-muted">sq ft</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs font-mono">
              <div className="flex flex-col items-center px-3 py-2.5 bg-background border border-card-border rounded text-center">
                <span className="text-muted mb-1">Base Area</span>
                <span className="font-bold">{baseArea.toFixed(1)} sq ft</span>
              </div>
              <div className="flex flex-col items-center px-3 py-2.5 bg-background border border-card-border rounded text-center">
                <span className="text-muted mb-1">With Waste</span>
                <span className="font-bold">{totalArea.toFixed(1)} sq ft</span>
              </div>
              <div className="flex flex-col items-center px-3 py-2.5 bg-background border border-card-border rounded text-center">
                <span className="text-muted mb-1">Square Yards</span>
                <span className="font-bold">{sqYards.toFixed(2)} sq yd</span>
              </div>
            </div>
            {cost !== null && (
              <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
                <span className="text-muted">Estimated Material Cost</span>
                <span className="font-bold text-primary">${cost.toFixed(2)}</span>
              </div>
            )}
          </div>
        )}

        <div>
          <p className="text-xs text-muted font-semibold mb-2">Typical Material Price Ranges (per sq ft)</p>
          <div className="space-y-1">
            {MATERIALS.map(m => (
              <div key={m.label} className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
                <span className="text-muted">{m.label}</span>
                <span>${m.min}–${m.max}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CalculatorShell>
  );
}
