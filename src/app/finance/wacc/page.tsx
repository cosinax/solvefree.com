"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

function fmt(n: number): string {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 4 });
}

export default function WaccPage() {
  const [v, setV] = useHashState({
    equity: "500000",
    debt: "200000",
    costOfEquity: "10",
    costOfDebt: "5",
    taxRate: "21",
  });
  const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

  const E   = parseFloat(v.equity);
  const D   = parseFloat(v.debt);
  const Re  = parseFloat(v.costOfEquity) / 100;
  const Rd  = parseFloat(v.costOfDebt) / 100;
  const T   = parseFloat(v.taxRate) / 100;
  const valid = E >= 0 && D >= 0 && (E + D) > 0 && Re >= 0 && Rd >= 0 && T >= 0;

  const V_total    = E + D;
  const wE         = valid ? E / V_total : 0;
  const wD         = valid ? D / V_total : 0;
  const afterTaxRd = valid ? Rd * (1 - T) : 0;
  const wacc       = valid ? wE * Re + wD * afterTaxRd : 0;

  return (
    <CalculatorShell title="WACC Calculator" description="Weighted Average Cost of Capital — the blended rate a company pays to finance its assets.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-muted mb-1">Equity Value ($)</label>
            <input type="number" value={v.equity} onChange={e => setV({ equity: e.target.value })} className={ic} min="0" />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Debt Value ($)</label>
            <input type="number" value={v.debt} onChange={e => setV({ debt: e.target.value })} className={ic} min="0" />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Cost of Equity (%)</label>
            <input type="number" value={v.costOfEquity} onChange={e => setV({ costOfEquity: e.target.value })} className={ic} step="0.1" min="0" />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Cost of Debt (%)</label>
            <input type="number" value={v.costOfDebt} onChange={e => setV({ costOfDebt: e.target.value })} className={ic} step="0.1" min="0" />
          </div>
          <div className="col-span-2">
            <label className="block text-sm text-muted mb-1">Corporate Tax Rate (%)</label>
            <input type="number" value={v.taxRate} onChange={e => setV({ taxRate: e.target.value })} className={ic} step="0.5" min="0" max="100" />
          </div>
        </div>

        {valid && (
          <div className="space-y-3">
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="block text-sm text-muted">WACC</span>
              <span className="block font-mono font-bold text-4xl text-primary">{(wacc * 100).toFixed(4)}%</span>
            </div>
            <div className="space-y-2">
              {[
                { label: "Total Capital (E + D)",    value: `$${E + D > 1e6 ? (V_total / 1e6).toFixed(2) + "M" : V_total.toLocaleString()}` },
                { label: "Weight of Equity",          value: `${(wE * 100).toFixed(2)}%` },
                { label: "Weight of Debt",            value: `${(wD * 100).toFixed(2)}%` },
                { label: "Cost of Equity",            value: `${(Re * 100).toFixed(2)}%` },
                { label: "After-tax Cost of Debt",    value: `${(afterTaxRd * 100).toFixed(4)}%` },
                { label: "Equity contribution",       value: `${(wE * Re * 100).toFixed(4)}%` },
                { label: "Debt contribution",         value: `${(wD * afterTaxRd * 100).toFixed(4)}%` },
              ].map(r => (
                <div key={r.label} className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
                  <span className="text-muted">{r.label}</span>
                  <span className="font-semibold">{r.value}</span>
                </div>
              ))}
            </div>
            <div className="bg-card border border-card-border rounded-lg p-3 text-xs text-muted space-y-1">
              <p className="font-semibold text-foreground">Formula</p>
              <p>WACC = (E/V) × Re + (D/V) × Rd × (1 − T)</p>
              <p>Where V = E + D, Re = cost of equity, Rd = cost of debt, T = tax rate.</p>
              <p>Debt is tax-deductible, so after-tax cost of debt = Rd × (1 − T).</p>
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
