"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

function fmt(n: number): string {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const quickRates = [5, 6, 7, 7.5, 8, 8.25, 8.5, 9, 10];

export default function SalesTaxPage() {
  const [v, setV] = useHashState({
    mode: "add",
    price: "100",
    rate: "8.25",
  });
  const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
  const sc = "w-full px-3 py-2.5 bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

  const price = parseFloat(v.price);
  const rate  = parseFloat(v.rate) / 100;
  const valid = price > 0 && rate > 0;

  // add mode: pre-tax → total
  const taxAmount  = valid && v.mode === "add" ? price * rate : 0;
  const totalPrice = valid && v.mode === "add" ? price + taxAmount : 0;

  // remove mode: total with tax → pre-tax
  const preTax     = valid && v.mode === "remove" ? price / (1 + rate) : 0;
  const taxPaid    = valid && v.mode === "remove" ? price - preTax : 0;

  return (
    <CalculatorShell title="Sales Tax Calculator" description="Add or remove sales tax from a price, and see a quick reference table.">
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-muted mb-1">Mode</label>
          <select value={v.mode} onChange={e => setV({ mode: e.target.value })} className={sc}>
            <option value="add">Add tax to pre-tax price</option>
            <option value="remove">Remove tax from total price</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-muted mb-1">
              {v.mode === "add" ? "Pre-tax Price ($)" : "Total Price with Tax ($)"}
            </label>
            <input type="number" value={v.price} onChange={e => setV({ price: e.target.value })} className={ic} min="0" step="0.01" />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Tax Rate (%)</label>
            <input type="number" value={v.rate} onChange={e => setV({ rate: e.target.value })} className={ic} min="0" step="0.01" />
          </div>
        </div>

        {valid && (
          <div className="space-y-3">
            {v.mode === "add" ? (
              <>
                <div className="bg-primary-light rounded-xl p-4 text-center">
                  <span className="block text-sm text-muted">Total Price</span>
                  <span className="block font-mono font-bold text-4xl text-primary">${fmt(totalPrice)}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
                    <span className="text-muted">Pre-tax</span>
                    <span>${fmt(price)}</span>
                  </div>
                  <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
                    <span className="text-muted">Tax Amount</span>
                    <span>${fmt(taxAmount)}</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="bg-primary-light rounded-xl p-4 text-center">
                  <span className="block text-sm text-muted">Pre-tax Price</span>
                  <span className="block font-mono font-bold text-4xl text-primary">${fmt(preTax)}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
                    <span className="text-muted">Total (incl. tax)</span>
                    <span>${fmt(price)}</span>
                  </div>
                  <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
                    <span className="text-muted">Tax Paid</span>
                    <span>${fmt(taxPaid)}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {price > 0 && (
          <div>
            <p className="text-sm font-semibold text-muted mb-2">Quick Reference — Tax on ${fmt(price)}</p>
            <div className="rounded-lg border border-card-border overflow-hidden">
              <table className="w-full text-xs font-mono">
                <thead className="bg-card">
                  <tr>
                    <th className="px-3 py-2 text-left text-muted">Rate</th>
                    <th className="px-3 py-2 text-right text-muted">Tax</th>
                    <th className="px-3 py-2 text-right text-muted">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {quickRates.map(r => (
                    <tr key={r} className={`border-t border-card-border ${Math.abs(r - parseFloat(v.rate)) < 0.01 ? "bg-primary-light" : ""}`}>
                      <td className="px-3 py-1.5">{r}%</td>
                      <td className="px-3 py-1.5 text-right">${fmt(price * r / 100)}</td>
                      <td className="px-3 py-1.5 text-right font-semibold">${fmt(price * (1 + r / 100))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
