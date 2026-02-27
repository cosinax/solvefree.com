"use client";

import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

const INGREDIENTS: Record<string, { gramsPerCup: number; label: string }> = {
  "all-purpose-flour":  { label: "All-Purpose Flour",      gramsPerCup: 125 },
  "bread-flour":        { label: "Bread Flour",             gramsPerCup: 130 },
  "cake-flour":         { label: "Cake Flour",              gramsPerCup: 114 },
  "sugar-white":        { label: "Sugar (White/Granulated)", gramsPerCup: 200 },
  "brown-sugar-packed": { label: "Brown Sugar (Packed)",    gramsPerCup: 220 },
  "powdered-sugar":     { label: "Powdered Sugar",          gramsPerCup: 120 },
  "butter":             { label: "Butter",                  gramsPerCup: 227 },
  "honey":              { label: "Honey",                   gramsPerCup: 340 },
  "milk":               { label: "Milk",                    gramsPerCup: 244 },
  "water":              { label: "Water",                   gramsPerCup: 237 },
  "rice-dry":           { label: "Rice (Dry, Long Grain)",  gramsPerCup: 185 },
  "oats":               { label: "Oats (Rolled)",           gramsPerCup: 90  },
  "cocoa-powder":       { label: "Cocoa Powder",            gramsPerCup: 85  },
  "cornstarch":         { label: "Cornstarch",              gramsPerCup: 128 },
  "salt":               { label: "Salt (Table)",            gramsPerCup: 273 },
  "baking-soda":        { label: "Baking Soda",             gramsPerCup: 230 },
};

function fmt(n: number, decimals = 2): string {
  if (!isFinite(n)) return "—";
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
}

export default function CupsToGramsPage() {
  const [v, setV] = useHashState({
    cups: "1",
    grams: "",
    ingredient: "all-purpose-flour",
    direction: "cups-to-grams",
  });

  const ingredient = INGREDIENTS[v.ingredient] ?? INGREDIENTS["all-purpose-flour"];
  const gpC = ingredient.gramsPerCup;

  let grams = 0;
  let cups = 0;
  let displayGrams = "";
  let displayOz = "";
  let displayKg = "";
  let displayCups = "";

  if (v.direction === "cups-to-grams") {
    const cupsVal = parseFloat(v.cups);
    if (!isNaN(cupsVal) && cupsVal >= 0) {
      grams = cupsVal * gpC;
      const oz = grams / 28.3495;
      const kg = grams / 1000;
      displayGrams = fmt(grams);
      displayOz = fmt(oz);
      displayKg = fmt(kg, 4);
    }
  } else {
    const gramsVal = parseFloat(v.grams);
    if (!isNaN(gramsVal) && gramsVal >= 0) {
      cups = gramsVal / gpC;
      displayCups = fmt(cups, 4);
    }
  }

  return (
    <CalculatorShell
      title="Cups to Grams Converter"
      description="Convert cups to grams for common baking ingredients. Each ingredient has a different weight per cup."
    >
      <div className="space-y-5">
        {/* Ingredient selector */}
        <div>
          <label className="block text-sm text-muted mb-1">Ingredient</label>
          <select
            value={v.ingredient}
            onChange={(e) => setV({ ingredient: e.target.value })}
            className="w-full px-3 py-2.5 bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          >
            {Object.entries(INGREDIENTS).map(([key, ing]) => (
              <option key={key} value={key}>{ing.label}</option>
            ))}
          </select>
        </div>

        {/* Direction toggle */}
        <div className="flex rounded-lg overflow-hidden border border-card-border text-sm font-medium">
          <button
            onClick={() => setV({ direction: "cups-to-grams" })}
            className={`flex-1 py-2 transition-colors ${
              v.direction === "cups-to-grams"
                ? "bg-primary text-primary-foreground"
                : "bg-background text-muted hover:bg-card"
            }`}
          >
            Cups → Grams
          </button>
          <button
            onClick={() => setV({ direction: "grams-to-cups" })}
            className={`flex-1 py-2 transition-colors ${
              v.direction === "grams-to-cups"
                ? "bg-primary text-primary-foreground"
                : "bg-background text-muted hover:bg-card"
            }`}
          >
            Grams → Cups
          </button>
        </div>

        {v.direction === "cups-to-grams" ? (
          <>
            <div>
              <label className="block text-sm text-muted mb-1">Amount (cups)</label>
              <input
                type="number"
                min="0"
                step="0.25"
                value={v.cups}
                onChange={(e) => setV({ cups: e.target.value })}
                className="w-full px-4 py-3 text-xl font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            {displayGrams && (
              <div className="bg-primary-light rounded-xl p-4 space-y-2">
                <div className="text-center">
                  <span className="block text-sm text-muted">{v.cups} cup{v.cups === "1" ? "" : "s"} of {ingredient.label} =</span>
                  <span className="block font-mono font-bold text-3xl text-primary">{displayGrams} g</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-card-border">
                  <div className="text-center">
                    <span className="block text-xs text-muted">Ounces</span>
                    <span className="block font-mono font-semibold">{displayOz} oz</span>
                  </div>
                  <div className="text-center">
                    <span className="block text-xs text-muted">Kilograms</span>
                    <span className="block font-mono font-semibold">{displayKg} kg</span>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <div>
              <label className="block text-sm text-muted mb-1">Amount (grams)</label>
              <input
                type="number"
                min="0"
                step="1"
                value={v.grams}
                onChange={(e) => setV({ grams: e.target.value })}
                className="w-full px-4 py-3 text-xl font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            {displayCups && (
              <div className="bg-primary-light rounded-xl p-4 text-center">
                <span className="block text-sm text-muted">{v.grams} g of {ingredient.label} =</span>
                <span className="block font-mono font-bold text-3xl text-primary">{displayCups} cups</span>
              </div>
            )}
          </>
        )}

        {/* Info note */}
        <p className="text-xs text-muted">
          Based on 1 US cup = 236.6 mL. Values are for the ingredient in its standard measured state (e.g., flour spooned and leveled, not packed, unless noted).
        </p>

        {/* Quick reference table */}
        <div>
          <h3 className="text-xs text-muted font-semibold uppercase tracking-wide mb-2">
            Quick Reference — All Ingredients (per 1 cup)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-card-border">
                  <th className="text-left py-2 pr-4 text-muted font-medium">Ingredient</th>
                  <th className="text-right py-2 pr-4 text-muted font-medium">Grams</th>
                  <th className="text-right py-2 text-muted font-medium">Oz</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(INGREDIENTS).map(([key, ing]) => (
                  <tr
                    key={key}
                    className={`border-b border-card-border last:border-0 cursor-pointer hover:bg-card transition-colors ${
                      v.ingredient === key ? "bg-primary-light" : ""
                    }`}
                    onClick={() => setV({ ingredient: key })}
                  >
                    <td className="py-2 pr-4">{ing.label}</td>
                    <td className="py-2 pr-4 text-right font-mono">{ing.gramsPerCup} g</td>
                    <td className="py-2 text-right font-mono">{fmt(ing.gramsPerCup / 28.3495)} oz</td>
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
