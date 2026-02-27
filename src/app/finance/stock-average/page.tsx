"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

function fmt(n: number, d = 2): string {
  return n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
}

const NUM_LOTS = 8;
type LotKey = `shares${1|2|3|4|5|6|7|8}` | `price${1|2|3|4|5|6|7|8}`;

const defaults: Record<string, string> = {
  shares1: "100", price1: "50.00",
  shares2: "50",  price2: "60.00",
  shares3: "", price3: "",
  shares4: "", price4: "",
  shares5: "", price5: "",
  shares6: "", price6: "",
  shares7: "", price7: "",
  shares8: "", price8: "",
  currentPrice: "65.00",
};

export default function StockAveragePage() {
  const [v, setV] = useHashState(defaults);
  const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

  // Parse lots
  const lots: { shares: number; price: number }[] = [];
  for (let i = 1; i <= NUM_LOTS; i++) {
    const sh = parseFloat(v[`shares${i}`] ?? "");
    const pr = parseFloat(v[`price${i}`] ?? "");
    if (!isNaN(sh) && sh > 0 && !isNaN(pr) && pr > 0) {
      lots.push({ shares: sh, price: pr });
    }
  }

  const totalShares    = lots.reduce((s, l) => s + l.shares, 0);
  const totalInvested  = lots.reduce((s, l) => s + l.shares * l.price, 0);
  const avgCost        = totalShares > 0 ? totalInvested / totalShares : 0;
  const currentPrice   = parseFloat(v.currentPrice);
  const hasCurrentPrice = !isNaN(currentPrice) && currentPrice > 0;
  const currentValue   = hasCurrentPrice ? totalShares * currentPrice : 0;
  const gainLoss       = hasCurrentPrice ? currentValue - totalInvested : 0;
  const gainLossPct    = totalInvested > 0 && hasCurrentPrice ? (gainLoss / totalInvested) * 100 : 0;
  const valid          = lots.length > 0;

  return (
    <CalculatorShell title="Stock Average Calculator" description="Calculate average cost per share across multiple purchase lots.">
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-x-3 gap-y-0">
            <p className="text-xs text-muted font-semibold">Shares</p>
            <p className="text-xs text-muted font-semibold">Price per Share ($)</p>
          </div>
          {Array.from({ length: NUM_LOTS }, (_, i) => {
            const idx = i + 1;
            return (
              <div key={idx} className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  value={v[`shares${idx}`] ?? ""}
                  onChange={e => setV({ [`shares${idx}`]: e.target.value } as Partial<typeof v>)}
                  placeholder={`Lot ${idx} shares`}
                  className={ic}
                  min="0"
                />
                <input
                  type="number"
                  value={v[`price${idx}`] ?? ""}
                  onChange={e => setV({ [`price${idx}`]: e.target.value } as Partial<typeof v>)}
                  placeholder="0.00"
                  className={ic}
                  min="0"
                  step="0.01"
                />
              </div>
            );
          })}
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">Current Price ($) — optional</label>
          <input type="number" value={v.currentPrice} onChange={e => setV({ currentPrice: e.target.value })} className={ic} step="0.01" />
        </div>

        {valid && (
          <div className="space-y-3">
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="block text-sm text-muted">Average Cost per Share</span>
              <span className="block font-mono font-bold text-4xl text-primary">${fmt(avgCost)}</span>
            </div>
            <div className="space-y-2">
              {[
                { label: "Total Shares",    value: fmt(totalShares, 4).replace(/\.?0+$/, "") },
                { label: "Total Invested",  value: `$${fmt(totalInvested)}` },
                ...(hasCurrentPrice ? [
                  { label: "Current Value", value: `$${fmt(currentValue)}` },
                  { label: "Gain / Loss",   value: `${gainLoss >= 0 ? "+" : ""}$${fmt(gainLoss)} (${gainLoss >= 0 ? "+" : ""}${gainLossPct.toFixed(2)}%)` },
                ] : []),
              ].map(r => (
                <div key={r.label} className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
                  <span className="text-muted">{r.label}</span>
                  <span className={`font-semibold ${r.label === "Gain / Loss" ? (gainLoss >= 0 ? "text-success" : "text-danger") : ""}`}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
