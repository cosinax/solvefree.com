"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

function fmt(n: number): string {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function BreakEvenPage() {
  const [v, setV] = useHashState({ fixedCosts: "50000", pricePerUnit: "29.99", variableCostPerUnit: "12.50" });
  const fixed = parseFloat(v.fixedCosts);
  const price = parseFloat(v.pricePerUnit);
  const variable = parseFloat(v.variableCostPerUnit);
  const valid = fixed >= 0 && price > variable && variable >= 0;
  const contribution = price - variable;
  const breakEvenUnits = valid ? fixed / contribution : 0;
  const breakEvenRevenue = breakEvenUnits * price;
  const marginPct = (contribution / price) * 100;
  const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

  return (
    <CalculatorShell title="Break-Even Calculator" description="Calculate how many units you need to sell to cover costs.">
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div><label className="block text-sm text-muted mb-1">Fixed Costs ($)</label><input type="number" value={v.fixedCosts} onChange={e => setV({ fixedCosts: e.target.value })} className={ic} /></div>
          <div><label className="block text-sm text-muted mb-1">Price per Unit ($)</label><input type="number" value={v.pricePerUnit} onChange={e => setV({ pricePerUnit: e.target.value })} step="0.01" className={ic} /></div>
          <div><label className="block text-sm text-muted mb-1">Variable Cost/Unit ($)</label><input type="number" value={v.variableCostPerUnit} onChange={e => setV({ variableCostPerUnit: e.target.value })} step="0.01" className={ic} /></div>
        </div>
        {price > 0 && price <= variable && <p className="text-xs text-danger">Price must be greater than variable cost to make a profit.</p>}
        {valid && (
          <div className="space-y-3">
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="block text-sm text-muted">Break-Even Point</span>
              <span className="block font-mono font-bold text-4xl text-primary">{Math.ceil(breakEvenUnits).toLocaleString()} units</span>
              <span className="block text-sm text-muted">${fmt(breakEvenRevenue)} in revenue</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="px-4 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">Contribution/Unit</span>
                <span className="font-mono font-bold text-lg">${fmt(contribution)}</span>
              </div>
              <div className="px-4 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">Gross Margin</span>
                <span className="font-mono font-bold text-lg">{marginPct.toFixed(1)}%</span>
              </div>
              <div className="px-4 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">Fixed Costs</span>
                <span className="font-mono font-bold text-sm">${fmt(fixed)}</span>
              </div>
            </div>
            <div className="space-y-1 text-xs font-mono">
              {[0.5, 1, 1.5, 2].map(mult => {
                const units = Math.ceil(breakEvenUnits * mult);
                const profit = units * contribution - fixed;
                return (
                  <div key={mult} className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded">
                    <span>{units.toLocaleString()} units ({mult}× BEP)</span>
                    <span className={profit >= 0 ? "text-success" : "text-danger"}>{profit >= 0 ? "+" : ""}${fmt(profit)} profit</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
