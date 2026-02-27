"use client";

import { useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";

export default function RandomPage() {
  const [min, setMin] = useState("1");
  const [max, setMax] = useState("100");
  const [count, setCount] = useState("1");
  const [integers, setIntegers] = useState(true);
  const [results, setResults] = useState<number[]>([]);

  function generate() {
    const lo = parseFloat(min);
    const hi = parseFloat(max);
    const n = Math.min(Math.max(parseInt(count) || 1, 1), 1000);
    if (isNaN(lo) || isNaN(hi) || lo > hi) return;

    const nums: number[] = [];
    for (let i = 0; i < n; i++) {
      if (integers) {
        nums.push(Math.floor(Math.random() * (hi - lo + 1)) + lo);
      } else {
        nums.push(parseFloat((Math.random() * (hi - lo) + lo).toFixed(6)));
      }
    }
    setResults(nums);
  }

  return (
    <CalculatorShell title="Random Number Generator" description="Generate random numbers within a range.">
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-sm text-muted mb-1">Min</label>
            <input type="number" value={min} onChange={(e) => setMin(e.target.value)}
              className="w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Max</label>
            <input type="number" value={max} onChange={(e) => setMax(e.target.value)}
              className="w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Count</label>
            <input type="number" value={count} onChange={(e) => setCount(e.target.value)} min="1" max="1000"
              className="w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={integers} onChange={(e) => setIntegers(e.target.checked)}
            className="rounded border-card-border" />
          Integers only
        </label>

        <button onClick={generate}
          className="w-full bg-primary text-white py-2.5 rounded-lg font-medium hover:bg-primary-hover transition-colors">
          🎲 Generate
        </button>

        {results.length > 0 && (
          <div className="bg-primary-light rounded-xl p-4">
            <div className="flex flex-wrap gap-2">
              {results.map((n, i) => (
                <span key={i} className="px-3 py-1.5 bg-card border border-card-border rounded-lg font-mono font-semibold text-sm">
                  {n}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
