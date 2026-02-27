"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

export default function AsphaltPage() {
  const [v, setV] = useHashState({ length: "100", width: "20", depth: "2.5", density: "145", price: "" });

  const length = parseFloat(v.length);
  const width = parseFloat(v.width);
  const depth = parseFloat(v.depth);
  const density = parseFloat(v.density) || 145;
  const price = parseFloat(v.price);
  const valid = length > 0 && width > 0 && depth > 0;

  const areaSqFt = length * width;
  const cubicFt = areaSqFt * (depth / 12);
  const cubicYd = cubicFt / 27;
  const pounds = cubicFt * density;
  const tons = pounds / 2000;
  const cost = !isNaN(price) && price > 0 ? tons * price : null;

  return (
    <CalculatorShell title="Asphalt Calculator" description="Estimate tons of asphalt needed for a driveway, road, or paving project.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-muted mb-1">Length (ft)</label>
            <input type="number" value={v.length} onChange={e => setV({ length: e.target.value })} className={ic} />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Width (ft)</label>
            <input type="number" value={v.width} onChange={e => setV({ width: e.target.value })} className={ic} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-muted mb-1">Depth (inches)</label>
            <input type="number" value={v.depth} onChange={e => setV({ depth: e.target.value })} step="0.5" className={ic} />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Density (lb/cu ft, default 145)</label>
            <input type="number" value={v.density} onChange={e => setV({ density: e.target.value })} className={ic} />
          </div>
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">Price per Ton (optional)</label>
          <input type="number" value={v.price} onChange={e => setV({ price: e.target.value })} placeholder="e.g. 120" className={ic} />
        </div>

        {valid && (
          <div className="space-y-3">
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="block text-xs text-muted mb-1">Asphalt Needed</span>
              <span className="block font-mono font-bold text-4xl text-primary">{tons.toFixed(2)}</span>
              <span className="text-xs text-muted">tons</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="flex flex-col items-center px-3 py-2.5 bg-background border border-card-border rounded text-xs font-mono text-center">
                <span className="text-muted mb-1">Area</span>
                <span className="font-bold">{areaSqFt.toFixed(0)} sq ft</span>
              </div>
              <div className="flex flex-col items-center px-3 py-2.5 bg-background border border-card-border rounded text-xs font-mono text-center">
                <span className="text-muted mb-1">Cubic Yards</span>
                <span className="font-bold">{cubicYd.toFixed(2)}</span>
              </div>
              <div className="flex flex-col items-center px-3 py-2.5 bg-background border border-card-border rounded text-xs font-mono text-center">
                <span className="text-muted mb-1">Pounds</span>
                <span className="font-bold">{pounds.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
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
        <div className="space-y-1">
          <p className="text-xs text-muted font-semibold">Typical Depth Guidelines</p>
          <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
            <span className="text-muted">Residential driveway</span><span>2–3 inches</span>
          </div>
          <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
            <span className="text-muted">Commercial parking lot</span><span>3–4 inches</span>
          </div>
          <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
            <span className="text-muted">Road / heavy traffic</span><span>4–6 inches</span>
          </div>
        </div>
      </div>
    </CalculatorShell>
  );
}
