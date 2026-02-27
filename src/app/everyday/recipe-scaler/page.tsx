"use client";
import { useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";

interface Ingredient { name: string; amount: string; unit: string; }

export default function RecipeScalerPage() {
  const [servings, setServings] = useState("4");
  const [targetServings, setTargetServings] = useState("6");
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: "Flour", amount: "2", unit: "cups" },
    { name: "Sugar", amount: "0.5", unit: "cups" },
    { name: "Butter", amount: "100", unit: "g" },
    { name: "Eggs", amount: "2", unit: "" },
    { name: "Milk", amount: "1", unit: "cup" },
  ]);

  const original = parseFloat(servings) || 1;
  const target = parseFloat(targetServings) || 1;
  const factor = target / original;
  const ic = "px-2 py-1.5 font-mono bg-background border border-card-border rounded focus:outline-none focus:ring-1 focus:ring-primary text-sm";

  function update(idx: number, field: keyof Ingredient, val: string) {
    setIngredients(prev => prev.map((ing, i) => i === idx ? { ...ing, [field]: val } : ing));
  }
  function addRow() { setIngredients(prev => [...prev, { name: "", amount: "1", unit: "" }]); }
  function removeRow(idx: number) { setIngredients(prev => prev.filter((_, i) => i !== idx)); }

  function scaleAmount(amount: string): string {
    const n = parseFloat(amount);
    if (isNaN(n)) return amount;
    const scaled = n * factor;
    // Try to express as nice fractions for small numbers
    if (scaled === Math.round(scaled)) return scaled.toString();
    return parseFloat(scaled.toFixed(3)).toString();
  }

  return (
    <CalculatorShell title="Recipe Scaler" description="Scale recipe ingredients up or down to any number of servings.">
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3 items-end">
          <div><label className="block text-sm text-muted mb-1">Original Servings</label>
            <input type="number" value={servings} onChange={e => setServings(e.target.value)} className="w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div className="text-center text-2xl pb-2">→</div>
          <div><label className="block text-sm text-muted mb-1">Target Servings</label>
            <input type="number" value={targetServings} onChange={e => setTargetServings(e.target.value)} className="w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
        </div>
        {factor !== 1 && (
          <div className="px-4 py-2 bg-primary-light rounded-lg text-sm text-center">
            Scale factor: <span className="font-mono font-bold text-primary">{factor.toFixed(3)}×</span>
          </div>
        )}
        <div className="space-y-2">
          <div className="grid grid-cols-12 gap-1 text-xs text-muted px-1">
            <span className="col-span-4">Ingredient</span>
            <span className="col-span-2">Original</span>
            <span className="col-span-1"></span>
            <span className="col-span-3 text-primary font-semibold">Scaled</span>
            <span className="col-span-1">Unit</span>
          </div>
          {ingredients.map((ing, i) => (
            <div key={i} className="grid grid-cols-12 gap-1 items-center">
              <input value={ing.name} onChange={e => update(i, "name", e.target.value)} placeholder="Name" className={ic + " col-span-4"} />
              <input value={ing.amount} onChange={e => update(i, "amount", e.target.value)} className={ic + " col-span-2"} />
              <span className="text-center text-muted text-xs">→</span>
              <div className="col-span-3 px-2 py-1.5 bg-primary-light rounded font-mono font-semibold text-sm text-center text-primary">
                {scaleAmount(ing.amount)}
              </div>
              <input value={ing.unit} onChange={e => update(i, "unit", e.target.value)} placeholder="unit" className={ic + " col-span-1 text-xs"} />
              <button onClick={() => removeRow(i)} className="col-span-1 text-muted hover:text-danger text-sm">×</button>
            </div>
          ))}
        </div>
        <button onClick={addRow} className="w-full text-sm text-primary py-2 border border-dashed border-primary/40 rounded-lg hover:bg-primary-light">+ Add ingredient</button>
      </div>
    </CalculatorShell>
  );
}
