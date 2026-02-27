"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
const sel = "w-full px-3 py-2.5 bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

const TYPES = [
  { label: "Mulch (bark/wood)", value: "mulch" },
  { label: "Topsoil", value: "topsoil" },
  { label: "Sand", value: "sand" },
  { label: "Pea Gravel", value: "gravel" },
];

export default function MulchPage() {
  const [v, setV] = useHashState({ area: "200", depth: "3", type: "mulch", price: "" });

  const area = parseFloat(v.area);
  const depth = parseFloat(v.depth);
  const price = parseFloat(v.price);
  const valid = area > 0 && depth > 0;

  const cubicFt = valid ? (area * depth) / 12 : 0;
  const cubicYd = cubicFt / 27;
  const bags2 = Math.ceil(cubicFt / 2);
  const bags3 = Math.ceil(cubicFt / 3);
  const cost = !isNaN(price) && price > 0 ? cubicYd * price : null;

  return (
    <CalculatorShell title="Mulch & Topsoil Calculator" description="Estimate how much mulch, topsoil, sand, or gravel you need for a landscaping project.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-muted mb-1">Area (sq ft)</label>
            <input type="number" value={v.area} onChange={e => setV({ area: e.target.value })} className={ic} />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Desired Depth (inches)</label>
            <input type="number" value={v.depth} onChange={e => setV({ depth: e.target.value })} className={ic} />
          </div>
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">Material Type</label>
          <select value={v.type} onChange={e => setV({ type: e.target.value })} className={sel}>
            {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">Price per Cubic Yard (optional)</label>
          <input type="number" value={v.price} onChange={e => setV({ price: e.target.value })} placeholder="e.g. 45" className={ic} />
        </div>

        {valid && (
          <div className="space-y-3">
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="block text-xs text-muted mb-1">Cubic Yards Needed</span>
              <span className="block font-mono font-bold text-4xl text-primary">{cubicYd.toFixed(2)}</span>
              <span className="text-xs text-muted">cu yd</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col items-center px-3 py-2.5 bg-background border border-card-border rounded text-xs font-mono text-center">
                <span className="text-muted mb-1">Cubic Feet</span>
                <span className="font-bold">{cubicFt.toFixed(1)}</span>
              </div>
              <div className="flex flex-col items-center px-3 py-2.5 bg-background border border-card-border rounded text-xs font-mono text-center">
                <span className="text-muted mb-1">2 cu ft Bags</span>
                <span className="font-bold">{bags2}</span>
              </div>
              <div className="flex flex-col items-center px-3 py-2.5 bg-background border border-card-border rounded text-xs font-mono text-center">
                <span className="text-muted mb-1">3 cu ft Bags</span>
                <span className="font-bold">{bags3}</span>
              </div>
            </div>
            {cost !== null && (
              <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
                <span className="text-muted">Estimated Cost</span>
                <span className="font-bold text-primary">${cost.toFixed(2)}</span>
              </div>
            )}
          </div>
        )}
        <p className="text-xs text-muted">Add 10% extra for uneven surfaces or waste. 1 cubic yard = 27 cubic feet.</p>
      </div>
    </CalculatorShell>
  );
}
