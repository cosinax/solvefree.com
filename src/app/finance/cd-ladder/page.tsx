"use client";

import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";
import { useMemo } from "react";

const inp =
  "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm";

function fmt(n: number, decimals = 2) {
  if (!isFinite(n)) return "—";
  return n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

function usd(n: number) {
  return "$" + fmt(n, 2);
}

export default function CDLadderPage() {
  const [v, setV] = useHashState({
    principal: "5000",
    rungs: "5",
    baseRate: "4.5",
    rateStep: "0.25",
  });

  const results = useMemo(() => {
    const p = parseFloat(v.principal) || 0;
    const n = Math.min(Math.max(Math.round(parseFloat(v.rungs) || 5), 2), 10);
    const r0 = parseFloat(v.baseRate) / 100 || 0;
    const step = parseFloat(v.rateStep) / 100 || 0;
    const perRung = p / n;

    return Array.from({ length: n }, (_, i) => {
      const years = i + 1;
      const rate = r0 + i * step;
      const maturity = perRung * Math.pow(1 + rate, years);
      const interest = maturity - perRung;
      return { years, rate: rate * 100, principal: perRung, maturity, interest };
    });
  }, [v]);

  const totalPrincipal = results.reduce((s, r) => s + r.principal, 0);
  const totalInterest = results.reduce((s, r) => s + r.interest, 0);
  const totalMaturity = totalPrincipal + totalInterest;

  return (
    <CalculatorShell
      title="CD Ladder Calculator"
      description="Plan a staggered CD investment strategy for regular liquidity and higher yields."
    >
      <div className="space-y-6">
        {/* Inputs */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-muted mb-1">Total Investment ($)</label>
            <input type="number" value={v.principal} onChange={e => setV({ principal: e.target.value })} className={inp} min="0" />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Number of Rungs</label>
            <input type="number" value={v.rungs} onChange={e => setV({ rungs: e.target.value })} className={inp} min="2" max="10" step="1" />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Base APY — 1-year CD (%)</label>
            <input type="number" value={v.baseRate} onChange={e => setV({ baseRate: e.target.value })} className={inp} step="0.05" />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Rate Step per Rung (%)</label>
            <input type="number" value={v.rateStep} onChange={e => setV({ rateStep: e.target.value })} className={inp} step="0.05" />
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Total Principal", value: usd(totalPrincipal) },
            { label: "Total Interest Earned", value: usd(totalInterest), highlight: true },
            { label: "Total at Maturity", value: usd(totalMaturity) },
          ].map(({ label, value, highlight }) => (
            <div key={label} className={`p-3 rounded-lg border ${highlight ? "bg-primary-light border-primary/20" : "bg-card border-card-border"}`}>
              <div className="text-xs text-muted mb-1">{label}</div>
              <div className="font-mono font-semibold">{value}</div>
            </div>
          ))}
        </div>

        {/* Rung table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-card-border text-left text-xs text-muted">
                <th className="pb-2 font-medium">Rung</th>
                <th className="pb-2 font-medium">Term</th>
                <th className="pb-2 font-medium">APY</th>
                <th className="pb-2 font-medium">Principal</th>
                <th className="pb-2 font-medium">Interest</th>
                <th className="pb-2 font-medium">Maturity Value</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r, i) => (
                <tr key={i} className="border-b border-card-border/50 last:border-0">
                  <td className="py-2 font-medium">{i + 1}</td>
                  <td className="py-2">{r.years} yr</td>
                  <td className="py-2 font-mono">{fmt(r.rate, 2)}%</td>
                  <td className="py-2 font-mono">{usd(r.principal)}</td>
                  <td className="py-2 font-mono text-green-600">+{usd(r.interest)}</td>
                  <td className="py-2 font-mono font-medium">{usd(r.maturity)}</td>
                </tr>
              ))}
              <tr className="font-semibold text-sm bg-card/50">
                <td className="py-2" colSpan={3}>Total</td>
                <td className="py-2 font-mono">{usd(totalPrincipal)}</td>
                <td className="py-2 font-mono text-green-600">+{usd(totalInterest)}</td>
                <td className="py-2 font-mono">{usd(totalMaturity)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-xs text-muted">
          A CD ladder splits your investment equally across CDs with staggered maturities. As each CD matures,
          you can reinvest at the longest term or withdraw for liquidity. This balances yield and access.
        </p>
      </div>
    </CalculatorShell>
  );
}
