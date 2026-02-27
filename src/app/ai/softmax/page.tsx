"use client";

import { useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";

export default function SoftmaxPage() {
  const [input, setInput] = useState("2.0, 1.0, 0.1");
  const nums = input.split(",").map((s) => s.trim()).filter((s) => s !== "").map(Number).filter((n) => !isNaN(n));
  const max = nums.length > 0 ? Math.max(...nums) : 0;
  const exps = nums.map((n) => Math.exp(n - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  const probs = exps.map((e) => e / sum);
  return (
    <CalculatorShell title="Softmax Calculator" description="Apply the softmax function to convert logits to probabilities.">
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-muted mb-1">Logits (comma-separated)</label>
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="e.g. 2.0, 1.0, 0.1"
            className="w-full px-4 py-3 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        {probs.length > 0 && (
          <div className="space-y-2">
            {probs.map((p, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-sm text-muted w-16 text-right font-mono">{nums[i].toFixed(2)}</span>
                <div className="flex-1 bg-background border border-card-border rounded-full h-6 overflow-hidden">
                  <div className="bg-primary h-full rounded-full transition-all" style={{ width: `${p * 100}%` }} />
                </div>
                <span className="font-mono font-semibold w-16">{(p * 100).toFixed(1)}%</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
