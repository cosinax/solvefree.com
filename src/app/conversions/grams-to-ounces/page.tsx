"use client";

import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

// All values in grams
const GRAM = 1;
const OZ_AV = 28.3495;   // avoirdupois ounce
const POUND_AV = 453.592;
const KG = 1000;
const MG = 0.001;
const TROY_OZ = 31.1035; // troy ounce (precious metals)

function fmt(n: number, decimals = 6): string {
  if (!isFinite(n) || isNaN(n)) return "—";
  // Use up to `decimals` sig figs but strip trailing zeros
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
}

const QUICK_REF = [
  { grams: 100,  oz: fmt(100 / OZ_AV),  lb: fmt(100 / POUND_AV, 4), kg: "0.1", troy: fmt(100 / TROY_OZ) },
  { grams: 200,  oz: fmt(200 / OZ_AV),  lb: fmt(200 / POUND_AV, 4), kg: "0.2", troy: fmt(200 / TROY_OZ) },
  { grams: 250,  oz: fmt(250 / OZ_AV),  lb: fmt(250 / POUND_AV, 4), kg: "0.25", troy: fmt(250 / TROY_OZ) },
  { grams: 500,  oz: fmt(500 / OZ_AV),  lb: fmt(500 / POUND_AV, 4), kg: "0.5", troy: fmt(500 / TROY_OZ) },
  { grams: 1000, oz: fmt(1000 / OZ_AV), lb: fmt(1000 / POUND_AV, 4), kg: "1", troy: fmt(1000 / TROY_OZ) },
];

export default function GramsToOuncesPage() {
  const [v, setV] = useHashState({
    grams: "100",
    ounces: "",
    direction: "g-to-oz",
  });

  const gramsVal = parseFloat(v.grams);
  const ozVal = parseFloat(v.ounces);

  let baseGrams = 0;
  let validG = false;
  let validOz = false;

  if (v.direction === "g-to-oz") {
    validG = !isNaN(gramsVal) && gramsVal >= 0;
    baseGrams = validG ? gramsVal : 0;
  } else {
    validOz = !isNaN(ozVal) && ozVal >= 0;
    baseGrams = validOz ? ozVal * OZ_AV : 0;
  }

  const valid = v.direction === "g-to-oz" ? validG : validOz;

  const results = valid && baseGrams >= 0
    ? [
        { label: "Grams (g)", value: fmt(baseGrams) },
        { label: "Ounces — Avoirdupois (oz)", value: fmt(baseGrams / OZ_AV) },
        { label: "Pounds (lb)", value: fmt(baseGrams / POUND_AV) },
        { label: "Kilograms (kg)", value: fmt(baseGrams / KG) },
        { label: "Milligrams (mg)", value: fmt(baseGrams / MG) },
        { label: "Troy Ounces (ozt)", value: fmt(baseGrams / TROY_OZ) },
      ]
    : [];

  const primaryLabel =
    v.direction === "g-to-oz"
      ? `${v.grams} g = ${fmt(gramsVal / OZ_AV)} oz`
      : `${v.ounces} oz = ${fmt(ozVal * OZ_AV)} g`;

  return (
    <CalculatorShell
      title="Grams to Ounces Converter"
      description="Convert grams to ounces, pounds, kilograms, milligrams, and troy ounces. Bidirectional — enter either value."
    >
      <div className="space-y-5">
        {/* Direction toggle */}
        <div className="flex rounded-lg overflow-hidden border border-card-border text-sm font-medium">
          <button
            onClick={() => setV({ direction: "g-to-oz" })}
            className={`flex-1 py-2 transition-colors ${
              v.direction === "g-to-oz"
                ? "bg-primary text-primary-foreground"
                : "bg-background text-muted hover:bg-card"
            }`}
          >
            Grams → Ounces
          </button>
          <button
            onClick={() => setV({ direction: "oz-to-g" })}
            className={`flex-1 py-2 transition-colors ${
              v.direction === "oz-to-g"
                ? "bg-primary text-primary-foreground"
                : "bg-background text-muted hover:bg-card"
            }`}
          >
            Ounces → Grams
          </button>
        </div>

        {v.direction === "g-to-oz" ? (
          <div>
            <label className="block text-sm text-muted mb-1">Grams (g)</label>
            <input
              type="number"
              min="0"
              step="1"
              value={v.grams}
              onChange={(e) => setV({ grams: e.target.value })}
              className="w-full px-4 py-3 text-xl font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        ) : (
          <div>
            <label className="block text-sm text-muted mb-1">Ounces (oz)</label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={v.ounces}
              onChange={(e) => setV({ ounces: e.target.value })}
              className="w-full px-4 py-3 text-xl font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        )}

        {valid && baseGrams >= 0 && (
          <>
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="block font-mono font-bold text-2xl text-primary">{primaryLabel}</span>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xs text-muted font-semibold uppercase tracking-wide">All conversions</h3>
              {results.map((r) => (
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

        {/* Troy ounce note */}
        <div className="bg-card border border-card-border rounded-lg p-3 text-sm">
          <p className="font-medium mb-1">Troy oz vs Avoirdupois oz</p>
          <p className="text-muted text-xs">
            A <strong className="text-foreground">troy ounce</strong> (used for gold, silver, and precious metals) = 31.1035 g.
            A standard <strong className="text-foreground">avoirdupois ounce</strong> (food, everyday weight) = 28.3495 g.
            Troy ounces are ~10% heavier.
          </p>
        </div>

        {/* Quick reference table */}
        <div>
          <h3 className="text-xs text-muted font-semibold uppercase tracking-wide mb-2">
            Quick Reference
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-card-border">
                  <th className="text-left py-2 pr-3 text-muted font-medium">Grams</th>
                  <th className="text-right py-2 pr-3 text-muted font-medium">oz (av)</th>
                  <th className="text-right py-2 pr-3 text-muted font-medium">lb</th>
                  <th className="text-right py-2 pr-3 text-muted font-medium">kg</th>
                  <th className="text-right py-2 text-muted font-medium">ozt</th>
                </tr>
              </thead>
              <tbody>
                {QUICK_REF.map((r) => (
                  <tr key={r.grams} className="border-b border-card-border last:border-0">
                    <td className="py-2 pr-3 font-medium">{r.grams} g</td>
                    <td className="py-2 pr-3 text-right font-mono text-muted">{r.oz}</td>
                    <td className="py-2 pr-3 text-right font-mono text-muted">{r.lb}</td>
                    <td className="py-2 pr-3 text-right font-mono text-muted">{r.kg}</td>
                    <td className="py-2 text-right font-mono text-muted">{r.troy}</td>
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
