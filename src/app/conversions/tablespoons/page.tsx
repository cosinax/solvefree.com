"use client";

import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

// All conversion factors expressed in mL
const UNITS: Record<string, { label: string; ml: number }> = {
  tbsp:  { label: "Tablespoons (tbsp)", ml: 14.7868 },
  tsp:   { label: "Teaspoons (tsp)",    ml: 4.92892 },
  cup:   { label: "US Cups",            ml: 236.588 },
  floz:  { label: "Fluid Ounces (fl oz)", ml: 29.5735 },
  ml:    { label: "Milliliters (mL)",   ml: 1 },
  liter: { label: "Liters (L)",         ml: 1000 },
  pint:  { label: "Pints (US)",         ml: 473.176 },
  quart: { label: "Quarts (US)",        ml: 946.353 },
};

function fmt(n: number, decimals = 4): string {
  if (!isFinite(n) || isNaN(n)) return "—";
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
}

export default function TablespoonsPage() {
  const [v, setV] = useHashState({
    amount: "1",
    from: "tbsp",
  });

  const amountVal = parseFloat(v.amount);
  const valid = !isNaN(amountVal) && amountVal >= 0;
  const fromUnit = UNITS[v.from] ?? UNITS.tbsp;
  const baseMl = valid ? amountVal * fromUnit.ml : 0;

  const results = valid
    ? Object.entries(UNITS)
        .filter(([key]) => key !== v.from)
        .map(([key, unit]) => ({
          key,
          label: unit.label,
          value: fmt(baseMl / unit.ml),
        }))
    : [];

  return (
    <CalculatorShell
      title="Tablespoon Converter"
      description="Convert tablespoons to teaspoons, cups, fluid ounces, milliliters, and more."
    >
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-muted mb-1">Amount</label>
            <input
              type="number"
              min="0"
              step="0.5"
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

        {valid && baseMl > 0 && (
          <div className="space-y-1.5">
            <h3 className="text-xs text-muted font-semibold uppercase tracking-wide">Equivalents</h3>
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
        )}

        {/* Key equivalents box */}
        <div className="bg-card border border-card-border rounded-lg p-4 text-sm">
          <p className="font-medium mb-2">Key equivalents</p>
          <ul className="text-muted space-y-1 text-xs">
            <li>1 tbsp = 3 tsp = 15 mL = ½ fl oz = 1/16 cup</li>
            <li>2 tbsp = 6 tsp = 30 mL = 1 fl oz = ⅛ cup</li>
            <li>4 tbsp = 12 tsp = 60 mL = 2 fl oz = ¼ cup</li>
            <li>8 tbsp = 24 tsp = 118 mL = 4 fl oz = ½ cup</li>
            <li>16 tbsp = 48 tsp = 237 mL = 8 fl oz = 1 cup</li>
          </ul>
        </div>

        {/* Quick reference table */}
        <div>
          <h3 className="text-xs text-muted font-semibold uppercase tracking-wide mb-2">
            Quick Reference — Tablespoons
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-card-border">
                  <th className="text-left py-2 pr-3 text-muted font-medium">tbsp</th>
                  <th className="text-right py-2 pr-3 text-muted font-medium">tsp</th>
                  <th className="text-right py-2 pr-3 text-muted font-medium">cups</th>
                  <th className="text-right py-2 pr-3 text-muted font-medium">fl oz</th>
                  <th className="text-right py-2 text-muted font-medium">mL</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 6, 8, 12, 16, 32].map((t) => {
                  const ml = t * 14.7868;
                  return (
                    <tr key={t} className="border-b border-card-border last:border-0">
                      <td className="py-2 pr-3 font-medium">{t}</td>
                      <td className="py-2 pr-3 text-right font-mono text-muted">{t * 3}</td>
                      <td className="py-2 pr-3 text-right font-mono text-muted">{fmt(t / 16)}</td>
                      <td className="py-2 pr-3 text-right font-mono text-muted">{fmt(ml / 29.5735)}</td>
                      <td className="py-2 text-right font-mono text-muted">{fmt(ml, 1)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </CalculatorShell>
  );
}
