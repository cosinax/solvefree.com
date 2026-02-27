"use client";
import { useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
const sel = "w-full px-3 py-2.5 bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

const DICE_PRESETS = [
  { value: "4", label: "d4" }, { value: "6", label: "d6" }, { value: "8", label: "d8" },
  { value: "10", label: "d10" }, { value: "12", label: "d12" }, { value: "20", label: "d20" },
  { value: "custom", label: "Custom" },
];

function buildDistribution(numDice: number, sides: number): Map<number, number> {
  // dp approach: compute exact distribution
  let dp = new Map<number, number>();
  dp.set(0, 1);
  for (let d = 0; d < numDice; d++) {
    const next = new Map<number, number>();
    for (const [sum, ways] of dp) {
      for (let face = 1; face <= sides; face++) {
        const newSum = sum + face;
        next.set(newSum, (next.get(newSum) ?? 0) + ways);
      }
    }
    dp = next;
  }
  return dp;
}

export default function DicePage() {
  const [v, setV] = useHashState({ dice: "2", sidesPreset: "6", sidesCustom: "6" });
  const [rollResult, setRollResult] = useState<number | null>(null);

  const numDice = Math.min(parseInt(v.dice) || 1, 10);
  const sidesRaw = v.sidesPreset === "custom" ? parseInt(v.sidesCustom) || 6 : parseInt(v.sidesPreset) || 6;
  const sides = Math.max(2, Math.min(sidesRaw, 100));

  const min = numDice;
  const max = numDice * sides;
  const mean = numDice * (sides + 1) / 2;
  const variance = numDice * (sides * sides - 1) / 12;
  const stdDev = Math.sqrt(variance);

  const totalCombinations = Math.pow(sides, numDice);
  const showTable = totalCombinations <= 1000000 && (max - min) <= 40;
  const dist = showTable ? buildDistribution(numDice, sides) : null;

  const handleRoll = () => {
    let result = 0;
    for (let i = 0; i < numDice; i++) result += Math.floor(Math.random() * sides) + 1;
    setRollResult(result);
  };

  return (
    <CalculatorShell title="Dice Probability Calculator" description="Calculate probability distributions for dice rolls. Works for all standard dice (d4 through d20) and custom sides.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-muted mb-1">Number of Dice</label>
            <input type="number" value={v.dice} onChange={e => setV({ dice: e.target.value })} min="1" max="10" className={ic} />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Dice Type</label>
            <select value={v.sidesPreset} onChange={e => setV({ sidesPreset: e.target.value })} className={sel}>
              {DICE_PRESETS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
            </select>
          </div>
        </div>
        {v.sidesPreset === "custom" && (
          <div>
            <label className="block text-sm text-muted mb-1">Custom Number of Sides</label>
            <input type="number" value={v.sidesCustom} onChange={e => setV({ sidesCustom: e.target.value })} min="2" max="100" className={ic} />
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-primary-light rounded-xl p-4 text-center">
            <span className="block text-xs text-muted mb-1">Mean</span>
            <span className="block font-mono font-bold text-4xl text-primary">{mean.toFixed(2)}</span>
          </div>
          <div className="flex flex-col justify-center px-3 py-2.5 bg-background border border-card-border rounded text-xs font-mono space-y-1">
            <div className="flex justify-between"><span className="text-muted">Min</span><span>{min}</span></div>
            <div className="flex justify-between"><span className="text-muted">Max</span><span>{max}</span></div>
            <div className="flex justify-between"><span className="text-muted">Variance</span><span>{variance.toFixed(3)}</span></div>
            <div className="flex justify-between"><span className="text-muted">Std Dev</span><span>{stdDev.toFixed(3)}</span></div>
          </div>
        </div>

        <button onClick={handleRoll} className="w-full py-3 bg-primary text-white rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity">
          Roll {numDice}d{sides}
        </button>
        {rollResult !== null && (
          <div className="bg-primary-light rounded-xl p-3 text-center">
            <span className="block text-xs text-muted mb-1">Roll Result</span>
            <span className="block font-mono font-bold text-3xl text-primary">{rollResult}</span>
            {dist && (
              <span className="text-xs text-muted">
                Probability: {(((dist.get(rollResult) ?? 0) / totalCombinations) * 100).toFixed(2)}%
              </span>
            )}
          </div>
        )}

        {dist && (
          <div>
            <p className="text-xs text-muted font-semibold mb-2">Probability Distribution ({numDice}d{sides})</p>
            <div className="space-y-1 max-h-60 overflow-y-auto">
              {Array.from(dist.entries()).sort((a, b) => a[0] - b[0]).map(([sum, ways]) => {
                const prob = ways / totalCombinations;
                return (
                  <div key={sum} className="flex items-center gap-2 px-3 py-1 bg-background border border-card-border rounded text-xs font-mono">
                    <span className="w-8 text-center font-bold">{sum}</span>
                    <div className="flex-1 bg-card-border rounded-full h-1.5">
                      <div className="bg-primary h-1.5 rounded-full" style={{ width: `${Math.min(prob / (1 / sides) * 100, 100)}%` }} />
                    </div>
                    <span className="w-16 text-right text-muted">{(prob * 100).toFixed(2)}%</span>
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
