"use client";

import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

// 1 US cup = 236.588 mL
const US_CUP_ML = 236.588;
// 1 UK cup = 284.131 mL
const UK_CUP_ML = 284.131;

function fmt(n: number, decimals = 2): string {
  if (!isFinite(n) || isNaN(n)) return "—";
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
}

interface Row {
  label: string;
  value: string;
}

export default function CupsToMlPage() {
  const [v, setV] = useHashState({ cups: "1" });

  const cupsVal = parseFloat(v.cups);
  const valid = !isNaN(cupsVal) && cupsVal >= 0;

  const ml = valid ? cupsVal * US_CUP_ML : 0;

  const rows: Row[] = valid
    ? [
        { label: "Milliliters (mL)", value: `${fmt(ml)} mL` },
        { label: "Liters (L)", value: `${fmt(ml / 1000, 4)} L` },
        { label: "Fluid Ounces (US fl oz)", value: `${fmt(ml / 29.5735)} fl oz` },
        { label: "Tablespoons (US tbsp)", value: `${fmt(ml / 14.7868)} tbsp` },
        { label: "Teaspoons (US tsp)", value: `${fmt(ml / 4.92892)} tsp` },
        { label: "Pints (US)", value: `${fmt(ml / 473.176)} pt` },
        { label: "Quarts (US)", value: `${fmt(ml / 946.353)} qt` },
        { label: "UK Cups equivalent", value: `${fmt(cupsVal * US_CUP_ML / UK_CUP_ML, 4)} UK cups` },
      ]
    : [];

  const QUICK_REF = [
    { fraction: "⅛ cup", us: "30 mL", fl_oz: "1 fl oz", tbsp: "2 tbsp", tsp: "6 tsp" },
    { fraction: "¼ cup", us: "59 mL", fl_oz: "2 fl oz", tbsp: "4 tbsp", tsp: "12 tsp" },
    { fraction: "⅓ cup", us: "79 mL", fl_oz: "2⅔ fl oz", tbsp: "5⅓ tbsp", tsp: "16 tsp" },
    { fraction: "½ cup", us: "118 mL", fl_oz: "4 fl oz", tbsp: "8 tbsp", tsp: "24 tsp" },
    { fraction: "⅔ cup", us: "158 mL", fl_oz: "5⅓ fl oz", tbsp: "10⅔ tbsp", tsp: "32 tsp" },
    { fraction: "¾ cup", us: "177 mL", fl_oz: "6 fl oz", tbsp: "12 tbsp", tsp: "36 tsp" },
    { fraction: "1 cup", us: "237 mL", fl_oz: "8 fl oz", tbsp: "16 tbsp", tsp: "48 tsp" },
    { fraction: "2 cups", us: "473 mL", fl_oz: "16 fl oz", tbsp: "32 tbsp", tsp: "96 tsp" },
  ];

  return (
    <CalculatorShell
      title="Cups to mL Converter"
      description="Convert US cups to milliliters, fluid ounces, tablespoons, teaspoons, liters, pints, and quarts."
    >
      <div className="space-y-5">
        <div>
          <label className="block text-sm text-muted mb-1">Amount (US cups)</label>
          <input
            type="number"
            min="0"
            step="0.25"
            value={v.cups}
            onChange={(e) => setV({ cups: e.target.value })}
            className="w-full px-4 py-3 text-xl font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {valid && ml > 0 && (
          <>
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="block text-sm text-muted">{v.cups} US cup{cupsVal !== 1 ? "s" : ""} =</span>
              <span className="block font-mono font-bold text-3xl text-primary">{fmt(ml)} mL</span>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xs text-muted font-semibold uppercase tracking-wide">All conversions</h3>
              {rows.map((r) => (
                <div
                  key={r.label}
                  className="flex justify-between items-center px-3 py-2 bg-background border border-card-border rounded-lg text-sm"
                >
                  <span className="text-muted">{r.label}</span>
                  <span className="font-mono font-semibold">{r.value}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* US vs UK note */}
        <div className="bg-card border border-card-border rounded-lg p-3 text-sm space-y-1">
          <p className="font-medium">US cup vs UK cup</p>
          <p className="text-muted">
            <strong className="text-foreground">US cup</strong> = 236.6 mL (most recipes use this)
          </p>
          <p className="text-muted">
            <strong className="text-foreground">UK / Imperial cup</strong> = 284.1 mL
          </p>
          <p className="text-muted">
            <strong className="text-foreground">Metric cup</strong> (AU/CA) = 250 mL
          </p>
        </div>

        {/* Quick reference table */}
        <div>
          <h3 className="text-xs text-muted font-semibold uppercase tracking-wide mb-2">
            Quick Reference (US cups)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-card-border">
                  <th className="text-left py-2 pr-3 text-muted font-medium">Cups</th>
                  <th className="text-right py-2 pr-3 text-muted font-medium">mL</th>
                  <th className="text-right py-2 pr-3 text-muted font-medium">fl oz</th>
                  <th className="text-right py-2 pr-3 text-muted font-medium">tbsp</th>
                  <th className="text-right py-2 text-muted font-medium">tsp</th>
                </tr>
              </thead>
              <tbody>
                {QUICK_REF.map((r) => (
                  <tr key={r.fraction} className="border-b border-card-border last:border-0">
                    <td className="py-2 pr-3 font-medium">{r.fraction}</td>
                    <td className="py-2 pr-3 text-right font-mono text-muted">{r.us}</td>
                    <td className="py-2 pr-3 text-right font-mono text-muted">{r.fl_oz}</td>
                    <td className="py-2 pr-3 text-right font-mono text-muted">{r.tbsp}</td>
                    <td className="py-2 text-right font-mono text-muted">{r.tsp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Key equivalents */}
        <div className="bg-card border border-card-border rounded-lg p-3 text-sm">
          <p className="font-medium mb-1">Key equivalents</p>
          <ul className="text-muted space-y-0.5 text-xs">
            <li>1 cup = 237 mL = 16 tbsp = 48 tsp = 8 fl oz</li>
            <li>1 tbsp = 3 tsp = 15 mL = ½ fl oz</li>
            <li>1 tsp = 5 mL</li>
          </ul>
        </div>
      </div>
    </CalculatorShell>
  );
}
