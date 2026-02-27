"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

function fmt(n: number): string {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const refTable = [
  { margin: 10, markup: 11.11 },
  { margin: 20, markup: 25.00 },
  { margin: 25, markup: 33.33 },
  { margin: 30, markup: 42.86 },
  { margin: 33, markup: 49.25 },
  { margin: 40, markup: 66.67 },
  { margin: 50, markup: 100.00 },
];

export default function MarginPage() {
  const [v, setV] = useHashState({
    mode: "cost_margin",
    cost: "50",
    margin: "40",
    markup: "67",
    price: "83.33",
  });
  const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
  const sc = "w-full px-3 py-2.5 bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

  const cost   = parseFloat(v.cost);
  const margin = parseFloat(v.margin) / 100;
  const markup = parseFloat(v.markup) / 100;
  const price  = parseFloat(v.price);

  let sellingPrice = 0, grossProfit = 0, marginPct = 0, markupPct = 0;
  let valid = false;

  if (v.mode === "cost_margin") {
    valid = cost > 0 && margin > 0 && margin < 1;
    if (valid) {
      sellingPrice = cost / (1 - margin);
      grossProfit  = sellingPrice - cost;
      marginPct    = margin * 100;
      markupPct    = (grossProfit / cost) * 100;
    }
  } else if (v.mode === "cost_markup") {
    valid = cost > 0 && markup > 0;
    if (valid) {
      sellingPrice = cost * (1 + markup);
      grossProfit  = sellingPrice - cost;
      marginPct    = (grossProfit / sellingPrice) * 100;
      markupPct    = markup * 100;
    }
  } else if (v.mode === "cost_price") {
    valid = cost > 0 && price > cost;
    if (valid) {
      sellingPrice = price;
      grossProfit  = price - cost;
      marginPct    = (grossProfit / price) * 100;
      markupPct    = (grossProfit / cost) * 100;
    }
  }

  return (
    <CalculatorShell title="Gross Margin Calculator" description="Calculate selling price, gross profit, margin %, and markup %.">
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-muted mb-1">Calculation Mode</label>
          <select value={v.mode} onChange={e => setV({ mode: e.target.value })} className={sc}>
            <option value="cost_margin">Cost + Margin % → Selling Price</option>
            <option value="cost_markup">Cost + Markup % → Selling Price</option>
            <option value="cost_price">Cost + Price → Margin & Markup</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-muted mb-1">Cost Price ($)</label>
            <input type="number" value={v.cost} onChange={e => setV({ cost: e.target.value })} className={ic} min="0" step="0.01" />
          </div>
          {v.mode === "cost_margin" && (
            <div>
              <label className="block text-sm text-muted mb-1">Gross Margin (%)</label>
              <input type="number" value={v.margin} onChange={e => setV({ margin: e.target.value })} className={ic} min="0" max="99.99" step="0.1" />
            </div>
          )}
          {v.mode === "cost_markup" && (
            <div>
              <label className="block text-sm text-muted mb-1">Markup (%)</label>
              <input type="number" value={v.markup} onChange={e => setV({ markup: e.target.value })} className={ic} min="0" step="0.1" />
            </div>
          )}
          {v.mode === "cost_price" && (
            <div>
              <label className="block text-sm text-muted mb-1">Selling Price ($)</label>
              <input type="number" value={v.price} onChange={e => setV({ price: e.target.value })} className={ic} min="0" step="0.01" />
            </div>
          )}
        </div>

        {valid && (
          <div className="space-y-3">
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="block text-sm text-muted">Selling Price</span>
              <span className="block font-mono font-bold text-4xl text-primary">${fmt(sellingPrice)}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Cost",         value: `$${fmt(cost)}` },
                { label: "Gross Profit", value: `$${fmt(grossProfit)}` },
                { label: "Gross Margin", value: `${marginPct.toFixed(2)}%` },
                { label: "Markup",       value: `${markupPct.toFixed(2)}%` },
              ].map(r => (
                <div key={r.label} className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
                  <span className="text-muted">{r.label}</span>
                  <span className="font-semibold">{r.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <p className="text-sm font-semibold text-muted mb-2">Margin vs Markup Reference</p>
          <div className="rounded-lg border border-card-border overflow-hidden">
            <table className="w-full text-xs font-mono">
              <thead className="bg-card">
                <tr>
                  <th className="px-3 py-2 text-left text-muted">Margin %</th>
                  <th className="px-3 py-2 text-right text-muted">Markup %</th>
                </tr>
              </thead>
              <tbody>
                {refTable.map(row => (
                  <tr key={row.margin} className="border-t border-card-border">
                    <td className="px-3 py-1.5">{row.margin}%</td>
                    <td className="px-3 py-1.5 text-right">{row.markup.toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted mt-1">Markup = Margin / (1 − Margin). Margin = Markup / (1 + Markup).</p>
        </div>
      </div>
    </CalculatorShell>
  );
}
