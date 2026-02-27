"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

export default function VatPage() {
  const [v, setV] = useHashState({ amount: "100", rate: "20", mode: "excl" });
  const amount = parseFloat(v.amount), rate = parseFloat(v.rate) / 100;
  const valid = amount > 0 && rate > 0;
  const vatAmount = v.mode === "excl" ? amount * rate : amount - amount / (1 + rate);
  const totalExcl = v.mode === "excl" ? amount : amount / (1 + rate);
  const totalIncl = v.mode === "excl" ? amount + vatAmount : amount;
  const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

  function fmt(n: number) { return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

  return (
    <CalculatorShell title="VAT / Sales Tax Calculator" description="Calculate VAT or sales tax amounts for prices with or without tax.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => setV({ mode: "excl" })} className={`py-2 rounded-lg text-sm font-medium ${v.mode === "excl" ? "bg-primary text-white" : "bg-background border border-card-border"}`}>Price excl. tax</button>
          <button onClick={() => setV({ mode: "incl" })} className={`py-2 rounded-lg text-sm font-medium ${v.mode === "incl" ? "bg-primary text-white" : "bg-background border border-card-border"}`}>Price incl. tax</button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="block text-sm text-muted mb-1">Amount ($)</label><input type="number" value={v.amount} onChange={e => setV({ amount: e.target.value })} className={ic} /></div>
          <div><label className="block text-sm text-muted mb-1">Tax Rate (%)</label><input type="number" value={v.rate} onChange={e => setV({ rate: e.target.value })} step="0.5" className={ic} /></div>
        </div>
        {valid && (
          <div className="space-y-2">
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="block text-sm text-muted">Tax Amount</span>
              <span className="block font-mono font-bold text-4xl text-primary">${fmt(vatAmount)}</span>
            </div>
            {[["Price (excl. tax)", totalExcl], ["Tax amount", vatAmount], ["Price (incl. tax)", totalIncl]].map(([l, val]) => (
              <div key={l as string} className="flex justify-between items-center px-4 py-2.5 bg-background border border-card-border rounded-lg">
                <span className="text-sm text-muted">{l as string}</span>
                <span className="font-mono font-semibold">${fmt(val as number)}</span>
              </div>
            ))}
          </div>
        )}
        <div>
          <p className="text-xs text-muted mb-1">Common tax rates:</p>
          <div className="flex flex-wrap gap-1.5">
            {[["US avg", "8.5"], ["EU VAT", "20"], ["UK VAT", "20"], ["Canada GST", "5"], ["Australia GST", "10"], ["Japan", "10"]].map(([label, r]) => (
              <button key={label} onClick={() => setV({ rate: r })} className="px-2 py-1 text-xs bg-background border border-card-border rounded hover:bg-primary-light">
                {label} {r}%
              </button>
            ))}
          </div>
        </div>
      </div>
    </CalculatorShell>
  );
}
