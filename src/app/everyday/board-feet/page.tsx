"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

export default function BoardFeetPage() {
  const [v, setV] = useHashState({ thickness: "1", width: "6", length: "8", qty: "1", price: "" });

  const t = parseFloat(v.thickness);
  const w = parseFloat(v.width);
  const l = parseFloat(v.length);
  const qty = parseFloat(v.qty) || 1;
  const price = parseFloat(v.price);
  const valid = t > 0 && w > 0 && l > 0;

  // Board Feet = (T × W × L) / 12  (T in inches, W in inches, L in feet)
  const bfPerPiece = (t * w * l) / 12;
  const totalBf = bfPerPiece * qty;
  const totalLinearFt = l * qty;
  const cost = !isNaN(price) && price > 0 ? totalBf * price : null;

  return (
    <CalculatorShell title="Board Feet Calculator" description="Calculate board feet for lumber using thickness, width, and length. BF = (T × W × L) / 12">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-muted mb-1">Thickness (inches)</label>
            <input type="number" value={v.thickness} onChange={e => setV({ thickness: e.target.value })} step="0.25" className={ic} />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Width (inches)</label>
            <input type="number" value={v.width} onChange={e => setV({ width: e.target.value })} step="0.25" className={ic} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-muted mb-1">Length (feet)</label>
            <input type="number" value={v.length} onChange={e => setV({ length: e.target.value })} className={ic} />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Quantity (pieces)</label>
            <input type="number" value={v.qty} onChange={e => setV({ qty: e.target.value })} className={ic} />
          </div>
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">Cost per Board Foot (optional)</label>
          <input type="number" value={v.price} onChange={e => setV({ price: e.target.value })} placeholder="e.g. 4.50" className={ic} />
        </div>

        {valid && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-primary-light rounded-xl p-4 text-center">
                <span className="block text-xs text-muted mb-1">Board Feet per Piece</span>
                <span className="block font-mono font-bold text-4xl text-primary">{bfPerPiece.toFixed(2)}</span>
                <span className="text-xs text-muted">BF</span>
              </div>
              <div className="bg-primary-light rounded-xl p-4 text-center">
                <span className="block text-xs text-muted mb-1">Total Board Feet</span>
                <span className="block font-mono font-bold text-4xl text-primary">{totalBf.toFixed(2)}</span>
                <span className="text-xs text-muted">BF ({qty} piece{qty !== 1 ? "s" : ""})</span>
              </div>
            </div>
            <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
              <span className="text-muted">Total Linear Feet</span>
              <span>{totalLinearFt.toFixed(1)} ft</span>
            </div>
            <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
              <span className="text-muted">Board Feet Formula</span>
              <span>({t}" × {w}" × {l}') / 12 = {bfPerPiece.toFixed(3)} BF</span>
            </div>
            {cost !== null && (
              <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
                <span className="text-muted">Estimated Cost</span>
                <span className="font-bold text-primary">${cost.toFixed(2)}</span>
              </div>
            )}
          </div>
        )}
        <p className="text-xs text-muted">1 board foot = 1 inch thick × 12 inches wide × 12 inches long = 144 cubic inches.</p>
      </div>
    </CalculatorShell>
  );
}
