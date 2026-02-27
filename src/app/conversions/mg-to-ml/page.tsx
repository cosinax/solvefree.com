"use client";

import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

// Common liquid densities in mg/mL (= g/L = kg/m³)
const DENSITY_PRESETS: Record<string, { label: string; density: number }> = {
  water:      { label: "Water",         density: 1000 },
  milk:       { label: "Whole Milk",    density: 1030 },
  honey:      { label: "Honey",         density: 1420 },
  olive_oil:  { label: "Olive Oil",     density: 920 },
  ethanol:    { label: "Ethanol (95%)", density: 790 },
  glycerol:   { label: "Glycerol",      density: 1261 },
  seawater:   { label: "Seawater",      density: 1025 },
  custom:     { label: "Custom",        density: 1000 },
};

function fmt(n: number, decimals = 4): string {
  if (!isFinite(n) || isNaN(n)) return "—";
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
}

export default function MgToMlPage() {
  const [v, setV] = useHashState({
    mg: "1000",
    ml: "",
    density_key: "water",
    custom_density: "1000",
    direction: "mg-to-ml",
  });

  const presetEntry = DENSITY_PRESETS[v.density_key] ?? DENSITY_PRESETS.water;
  const densityMgMl =
    v.density_key === "custom"
      ? parseFloat(v.custom_density)
      : presetEntry.density;
  const densityValid = !isNaN(densityMgMl) && densityMgMl > 0;

  const mgVal = parseFloat(v.mg);
  const mlVal = parseFloat(v.ml);

  let baseMl = 0;
  let baseMg = 0;
  let valid = false;

  if (v.direction === "mg-to-ml") {
    valid = !isNaN(mgVal) && mgVal >= 0 && densityValid;
    baseMg = mgVal;
    baseMl = valid ? mgVal / densityMgMl : 0;
  } else {
    valid = !isNaN(mlVal) && mlVal >= 0 && densityValid;
    baseMl = mlVal;
    baseMg = valid ? mlVal * densityMgMl : 0;
  }

  return (
    <CalculatorShell
      title="mg to mL Converter"
      description="Convert milligrams to milliliters (and back) using liquid density. Accurate for water, oils, honey, milk, and more."
    >
      <div className="space-y-5">
        {/* Direction toggle */}
        <div className="flex rounded-lg overflow-hidden border border-card-border text-sm font-medium">
          <button
            onClick={() => setV({ direction: "mg-to-ml" })}
            className={`flex-1 py-2 transition-colors ${
              v.direction === "mg-to-ml"
                ? "bg-primary text-primary-foreground"
                : "bg-background text-muted hover:bg-card"
            }`}
          >
            mg → mL
          </button>
          <button
            onClick={() => setV({ direction: "ml-to-mg" })}
            className={`flex-1 py-2 transition-colors ${
              v.direction === "ml-to-mg"
                ? "bg-primary text-primary-foreground"
                : "bg-background text-muted hover:bg-card"
            }`}
          >
            mL → mg
          </button>
        </div>

        {/* Density selector */}
        <div>
          <label className="block text-sm text-muted mb-1">Liquid / Substance</label>
          <select
            value={v.density_key}
            onChange={(e) => setV({ density_key: e.target.value })}
            className="w-full px-3 py-2.5 bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          >
            {Object.entries(DENSITY_PRESETS).map(([key, p]) => (
              <option key={key} value={key}>
                {p.label}{key !== "custom" ? ` — ${p.density} mg/mL` : ""}
              </option>
            ))}
          </select>
        </div>

        {v.density_key === "custom" && (
          <div>
            <label className="block text-sm text-muted mb-1">Custom density (mg/mL)</label>
            <input
              type="number"
              min="0.001"
              step="0.001"
              value={v.custom_density}
              onChange={(e) => setV({ custom_density: e.target.value })}
              className="w-full px-4 py-3 text-xl font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        )}

        {v.direction === "mg-to-ml" ? (
          <div>
            <label className="block text-sm text-muted mb-1">Milligrams (mg)</label>
            <input
              type="number"
              min="0"
              step="1"
              value={v.mg}
              onChange={(e) => setV({ mg: e.target.value })}
              className="w-full px-4 py-3 text-xl font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        ) : (
          <div>
            <label className="block text-sm text-muted mb-1">Milliliters (mL)</label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={v.ml}
              onChange={(e) => setV({ ml: e.target.value })}
              className="w-full px-4 py-3 text-xl font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        )}

        {valid && (
          <>
            <div className="bg-primary-light rounded-xl p-4 text-center">
              {v.direction === "mg-to-ml" ? (
                <>
                  <span className="block text-sm text-muted">{fmt(baseMg, 2)} mg =</span>
                  <span className="block font-mono font-bold text-3xl text-primary">{fmt(baseMl)} mL</span>
                </>
              ) : (
                <>
                  <span className="block text-sm text-muted">{fmt(baseMl)} mL =</span>
                  <span className="block font-mono font-bold text-3xl text-primary">{fmt(baseMg, 2)} mg</span>
                </>
              )}
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xs text-muted font-semibold uppercase tracking-wide">All equivalents</h3>
              {[
                { label: "Milligrams (mg)", value: fmt(baseMg, 2) },
                { label: "Milliliters (mL)", value: fmt(baseMl) },
                { label: "Liters (L)", value: fmt(baseMl / 1000, 6) },
                { label: "Fluid Ounces (fl oz)", value: fmt(baseMl / 29.5735) },
                { label: "Teaspoons (tsp)", value: fmt(baseMl / 4.92892) },
                { label: "Tablespoons (tbsp)", value: fmt(baseMl / 14.7868) },
              ].map((r) => (
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

        {/* Important note */}
        <div className="bg-card border border-card-border rounded-lg p-3 text-sm">
          <p className="font-medium mb-1">Important note</p>
          <p className="text-muted text-xs">
            mg ↔ mL conversion requires knowing the <strong className="text-foreground">density</strong> of the substance.
            This converter is for <strong className="text-foreground">liquids only</strong>. For solids or powders (e.g. medications),
            density varies greatly — consult a pharmacist or use a laboratory balance.
          </p>
        </div>

        {/* Density reference table */}
        <div>
          <h3 className="text-xs text-muted font-semibold uppercase tracking-wide mb-2">
            Liquid Density Reference
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-card-border">
                  <th className="text-left py-2 pr-3 text-muted font-medium">Liquid</th>
                  <th className="text-right py-2 pr-3 text-muted font-medium">mg/mL</th>
                  <th className="text-right py-2 text-muted font-medium">g/cm³</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(DENSITY_PRESETS)
                  .filter(([k]) => k !== "custom")
                  .map(([key, p]) => (
                    <tr
                      key={key}
                      className={`border-b border-card-border last:border-0 cursor-pointer hover:bg-card transition-colors ${
                        v.density_key === key ? "bg-primary-light" : ""
                      }`}
                      onClick={() => setV({ density_key: key })}
                    >
                      <td className="py-2 pr-3">{p.label}</td>
                      <td className="py-2 pr-3 text-right font-mono">{p.density}</td>
                      <td className="py-2 text-right font-mono text-muted">{(p.density / 1000).toFixed(3)}</td>
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
