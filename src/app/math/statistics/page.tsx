"use client";

import { useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";

function parseNumbers(input: string): number[] {
  return input
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s !== "" && !isNaN(Number(s)))
    .map(Number);
}

function calcMean(nums: number[]): number {
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function calcMedian(nums: number[]): number {
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}

function calcMode(nums: number[]): string {
  const freq: Record<number, number> = {};
  nums.forEach((n) => (freq[n] = (freq[n] || 0) + 1));
  const maxFreq = Math.max(...Object.values(freq));
  if (maxFreq === 1) return "No mode";
  const modes = Object.keys(freq)
    .filter((k) => freq[Number(k)] === maxFreq)
    .map(Number);
  return modes.join(", ");
}

function calcRange(nums: number[]): number {
  return Math.max(...nums) - Math.min(...nums);
}

function formatNum(value: number): string {
  if (!isFinite(value) || isNaN(value)) return "Error";
  return parseFloat(value.toPrecision(12)).toString();
}

export default function StatisticsPage() {
  const [input, setInput] = useState("");

  const numbers = parseNumbers(input);
  const hasData = numbers.length > 0;

  const stats = hasData
    ? {
        count: numbers.length,
        sum: numbers.reduce((a, b) => a + b, 0),
        mean: calcMean(numbers),
        median: calcMedian(numbers),
        mode: calcMode(numbers),
        range: calcRange(numbers),
        min: Math.min(...numbers),
        max: Math.max(...numbers),
      }
    : null;

  return (
    <CalculatorShell
      title="Statistics Calculator"
      description="Enter comma-separated numbers to calculate mean, median, mode, range, sum, and count."
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-muted mb-1">
            Enter numbers (comma-separated)
          </label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. 4, 8, 15, 16, 23, 42"
            className="w-full px-4 py-3 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            autoComplete="off"
            spellCheck={false}
          />
          {hasData && (
            <p className="text-xs text-muted mt-1">
              Parsed {numbers.length} number{numbers.length !== 1 ? "s" : ""}:{" "}
              {numbers.join(", ")}
            </p>
          )}
        </div>

        {stats && (
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Count", value: stats.count.toString() },
              { label: "Sum", value: formatNum(stats.sum) },
              { label: "Mean", value: formatNum(stats.mean) },
              { label: "Median", value: formatNum(stats.median) },
              { label: "Mode", value: stats.mode },
              { label: "Range", value: formatNum(stats.range) },
              { label: "Min", value: formatNum(stats.min) },
              { label: "Max", value: formatNum(stats.max) },
            ].map((item) => (
              <div
                key={item.label}
                className="px-4 py-3 bg-primary-light rounded-lg"
              >
                <span className="block text-xs text-muted uppercase tracking-wide">
                  {item.label}
                </span>
                <span className="font-mono font-semibold text-lg">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        )}

        {!hasData && input.trim() !== "" && (
          <p className="text-sm text-muted">
            No valid numbers found. Enter comma-separated numbers like: 1, 2, 3
          </p>
        )}
      </div>
    </CalculatorShell>
  );
}
