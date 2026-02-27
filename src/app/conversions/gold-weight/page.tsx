"use client";

import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

// All values in grams relative to 1 troy ounce (ozt) = 31.1035 g
// Reference: 1 troy oz = 31.1035 g = 20 dwt = 480 grains
// 1 pennyweight (dwt) = 1.55517 g
// 1 grain = 0.06479891 g
// 1 troy pound = 12 troy oz = 373.242 g
// 1 avoirdupois oz = 28.3495 g
// 1 avoirdupois pound = 453.592 g

const UNITS: Record<string, { label: string; grams: number }> = {
  ozt:    { label: "Troy Ounce (ozt)",          grams: 31.1035 },
  troy_lb:{ label: "Troy Pound (troy lb)",       grams: 373.2417 },
  dwt:    { label: "Pennyweight (dwt)",          grams: 1.55517 },
  g:      { label: "Gram (g)",                   grams: 1 },
  kg:     { label: "Kilogram (kg)",              grams: 1000 },
  grain:  { label: "Grain (gr)",                 grams: 0.06479891 },
  oz_av:  { label: "Avoirdupois Ounce (oz)",     grams: 28.3495 },
  lb_av:  { label: "Avoirdupois Pound (lb)",     grams: 453.592 },
};

function fmt(n: number, decimals = 6): string {
  if (!isFinite(n) || isNaN(n)) return "—";
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
}

export default function GoldWeightPage() {
  const [v, setV] = useHashState({
    amount: "1",
    from: "ozt",
  });

  const amountVal = parseFloat(v.amount);
  const valid = !isNaN(amountVal) && amountVal >= 0;
  const fromUnit = UNITS[v.from] ?? UNITS.ozt;
  const baseGrams = valid ? amountVal * fromUnit.grams : 0;

  const results = valid
    ? Object.entries(UNITS)
        .filter(([key]) => key !== v.from)
        .map(([key, unit]) => ({
          key,
          label: unit.label,
          value: fmt(baseGrams / unit.grams),
        }))
    : [];

  // Quick reference table: 1 ozt in all units
  const REF_ROWS = [
    { label: "1 troy ounce (ozt)", ozt: "1", g: "31.1035", dwt: "20", grains: "480", oz_av: fmt(31.1035 / 28.3495), lb_av: fmt(31.1035 / 453.592) },
    { label: "1 pennyweight (dwt)", ozt: "0.05", g: "1.55517", dwt: "1", grains: "24", oz_av: fmt(1.55517 / 28.3495), lb_av: fmt(1.55517 / 453.592) },
    { label: "1 gram", ozt: fmt(1 / 31.1035), g: "1", dwt: fmt(1 / 1.55517), grains: fmt(1 / 0.06479891), oz_av: fmt(1 / 28.3495), lb_av: fmt(1 / 453.592) },
    { label: "1 troy pound", ozt: "12", g: "373.24", dwt: "240", grains: "5760", oz_av: fmt(373.2417 / 28.3495), lb_av: fmt(373.2417 / 453.592) },
  ];

  return (
    <CalculatorShell
      title="Precious Metals Weight Converter"
      description="Convert troy ounces, pennyweights, grains, grams, and avoirdupois units — commonly used for gold, silver, and platinum."
    >
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-muted mb-1">Amount</label>
            <input
              type="number"
              min="0"
              step="0.001"
              value={v.amount}
              onChange={(e) => setV({ amount: e.target.value })}
              className="w-full px-4 py-3 text-xl font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">From unit</label>
            <select
              value={v.from}
              onChange={(e) => setV({ from: e.target.value })}
              className="w-full px-3 py-2.5 bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            >
              {Object.entries(UNITS).map(([key, unit]) => (
                <option key={key} value={key}>{unit.label}</option>
              ))}
            </select>
          </div>
        </div>

        {valid && baseGrams > 0 && (
          <>
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="block text-sm text-muted">{v.amount} {fromUnit.label} =</span>
              <span className="block font-mono font-bold text-2xl text-primary">{fmt(baseGrams)} grams</span>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xs text-muted font-semibold uppercase tracking-wide">All conversions</h3>
              {results.map((r) => (
                <div
                  key={r.key}
                  className="flex justify-between items-center px-3 py-2 bg-background border border-card-border rounded-lg text-sm"
                >
                  <span className="text-muted">{r.label}</span>
                  <span className="font-mono font-semibold">{r.value}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Explainer */}
        <div className="bg-card border border-card-border rounded-lg p-3 text-sm">
          <p className="font-medium mb-1">Troy vs Avoirdupois</p>
          <p className="text-muted text-xs">
            Precious metals (gold, silver, platinum) are measured in the <strong className="text-foreground">troy system</strong>.
            A troy ounce (31.10 g) is heavier than an avoirdupois ounce (28.35 g) used for everyday goods.
            Always check which ounce is being quoted when buying metals.
          </p>
        </div>

        {/* Quick reference */}
        <div>
          <h3 className="text-xs text-muted font-semibold uppercase tracking-wide mb-2">
            Quick Reference
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-card-border">
                  <th className="text-left py-2 pr-2 text-muted font-medium">Unit</th>
                  <th className="text-right py-2 pr-2 text-muted font-medium">ozt</th>
                  <th className="text-right py-2 pr-2 text-muted font-medium">g</th>
                  <th className="text-right py-2 pr-2 text-muted font-medium">dwt</th>
                  <th className="text-right py-2 pr-2 text-muted font-medium">grains</th>
                  <th className="text-right py-2 text-muted font-medium">av oz</th>
                </tr>
              </thead>
              <tbody>
                {REF_ROWS.map((r) => (
                  <tr key={r.label} className="border-b border-card-border last:border-0">
                    <td className="py-2 pr-2 font-medium text-xs">{r.label}</td>
                    <td className="py-2 pr-2 text-right font-mono text-muted text-xs">{r.ozt}</td>
                    <td className="py-2 pr-2 text-right font-mono text-muted text-xs">{r.g}</td>
                    <td className="py-2 pr-2 text-right font-mono text-muted text-xs">{r.dwt}</td>
                    <td className="py-2 pr-2 text-right font-mono text-muted text-xs">{r.grains}</td>
                    <td className="py-2 text-right font-mono text-muted text-xs">{r.oz_av}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </CalculatorShell>
  );
}
