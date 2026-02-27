"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

function fmt(n: number): string {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function MarkupPage() {
  const [v, setV] = useHashState({
    cost: "40",
    price: "60",
    targetMargin: "50",
    targetMarkup: "100",
  });
  const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

  const cost         = parseFloat(v.cost);
  const price        = parseFloat(v.price);
  const targetMargin = parseFloat(v.targetMargin) / 100;
  const targetMarkup = parseFloat(v.targetMarkup) / 100;
  const valid        = cost > 0 && price > 0;

  const grossProfit  = valid ? price - cost : 0;
  const markupPct    = valid ? (grossProfit / cost) * 100 : 0;
  const marginPct    = valid && price > 0 ? (grossProfit / price) * 100 : 0;

  // Price for target margin: P = C / (1 - margin)
  const priceForMargin = cost > 0 && targetMargin > 0 && targetMargin < 1
    ? cost / (1 - targetMargin)
    : 0;

  // Price for target markup: P = C * (1 + markup)
  const priceForMarkup = cost > 0 && targetMarkup > 0
    ? cost * (1 + targetMarkup)
    : 0;

  return (
    <CalculatorShell title="Markup Calculator" description="Calculate markup, profit margin, and target prices from cost.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-muted mb-1">Cost Price ($)</label>
            <input type="number" value={v.cost} onChange={e => setV({ cost: e.target.value })} className={ic} min="0" step="0.01" />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Selling Price ($)</label>
            <input type="number" value={v.price} onChange={e => setV({ price: e.target.value })} className={ic} min="0" step="0.01" />
          </div>
        </div>

        {valid && (
          <div className="space-y-3">
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="block text-sm text-muted">Gross Profit</span>
              <span className="block font-mono font-bold text-4xl text-primary">${fmt(grossProfit)}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="px-3 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">Markup %</span>
                <span className="font-mono font-bold text-lg">{markupPct.toFixed(2)}%</span>
                <p className="text-xs text-muted mt-1">Profit ÷ Cost</p>
              </div>
              <div className="px-3 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">Profit Margin %</span>
                <span className="font-mono font-bold text-lg">{marginPct.toFixed(2)}%</span>
                <p className="text-xs text-muted mt-1">Profit ÷ Price</p>
              </div>
            </div>
            <div className="bg-card border border-card-border rounded-lg p-3 text-xs text-muted space-y-1">
              <p><strong className="text-foreground">Markup</strong> = (Price − Cost) / Cost × 100 — based on cost</p>
              <p><strong className="text-foreground">Margin</strong> = (Price − Cost) / Price × 100 — based on revenue</p>
              <p>Same profit, different bases. Markup is always higher than margin for the same dollar profit.</p>
            </div>
          </div>
        )}

        <div className="border-t border-card-border pt-4 space-y-3">
          <p className="text-sm font-semibold text-muted">Target Price Calculator</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-muted mb-1">Target Margin (%)</label>
              <input type="number" value={v.targetMargin} onChange={e => setV({ targetMargin: e.target.value })} className={ic} min="0" max="99" step="0.5" />
              {cost > 0 && targetMargin > 0 && targetMargin < 100 && (
                <p className="text-xs text-success mt-1 font-mono">→ Sell at ${fmt(priceForMargin)}</p>
              )}
            </div>
            <div>
              <label className="block text-sm text-muted mb-1">Target Markup (%)</label>
              <input type="number" value={v.targetMarkup} onChange={e => setV({ targetMarkup: e.target.value })} className={ic} min="0" step="0.5" />
              {cost > 0 && targetMarkup > 0 && (
                <p className="text-xs text-success mt-1 font-mono">→ Sell at ${fmt(priceForMarkup)}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </CalculatorShell>
  );
}
