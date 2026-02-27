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

function formatNum(value: number): string {
  if (!isFinite(value) || isNaN(value)) return "Error";
  return parseFloat(value.toPrecision(12)).toString();
}

function calcMean(nums: number[]): number {
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function calcPopulationVariance(nums: number[]): number {
  const mean = calcMean(nums);
  return nums.reduce((sum, n) => sum + (n - mean) ** 2, 0) / nums.length;
}

function calcSampleVariance(nums: number[]): number {
  if (nums.length < 2) return 0;
  const mean = calcMean(nums);
  return nums.reduce((sum, n) => sum + (n - mean) ** 2, 0) / (nums.length - 1);
}

export default function StandardDeviationPage() {
  const [input, setInput] = useState("");

  const numbers = parseNumbers(input);
  const hasData = numbers.length > 0;

  const stats = hasData
    ? {
        count: numbers.length,
        mean: calcMean(numbers),
        populationVariance: calcPopulationVariance(numbers),
        sampleVariance: calcSampleVariance(numbers),
        populationStdDev: Math.sqrt(calcPopulationVariance(numbers)),
        sampleStdDev: Math.sqrt(calcSampleVariance(numbers)),
      }
    : null;

  return (
    <CalculatorShell
      title="Standard Deviation Calculator"
      description="Enter comma-separated numbers to calculate population and sample standard deviation and variance."
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
            placeholder="e.g. 10, 12, 23, 23, 16, 23, 21, 16"
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
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="px-4 py-3 bg-primary-light rounded-lg">
                <span className="block text-xs text-muted uppercase tracking-wide">
                  Count (n)
                </span>
                <span className="font-mono font-semibold text-lg">
                  {stats.count}
                </span>
              </div>
              <div className="px-4 py-3 bg-primary-light rounded-lg">
                <span className="block text-xs text-muted uppercase tracking-wide">
                  Mean (x̄)
                </span>
                <span className="font-mono font-semibold text-lg">
                  {formatNum(stats.mean)}
                </span>
              </div>
            </div>

            {/* Population */}
            <div>
              <h3 className="text-sm font-semibold text-muted uppercase tracking-wide mb-2">
                Population (σ)
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="px-4 py-3 bg-primary-light rounded-lg">
                  <span className="block text-xs text-muted uppercase tracking-wide">
                    Variance (σ²)
                  </span>
                  <span className="font-mono font-semibold text-lg">
                    {formatNum(stats.populationVariance)}
                  </span>
                </div>
                <div className="px-4 py-3 bg-primary-light rounded-lg">
                  <span className="block text-xs text-muted uppercase tracking-wide">
                    Std Dev (σ)
                  </span>
                  <span className="font-mono font-semibold text-lg">
                    {formatNum(stats.populationStdDev)}
                  </span>
                </div>
              </div>
            </div>

            {/* Sample */}
            <div>
              <h3 className="text-sm font-semibold text-muted uppercase tracking-wide mb-2">
                Sample (s)
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="px-4 py-3 bg-primary-light rounded-lg">
                  <span className="block text-xs text-muted uppercase tracking-wide">
                    Variance (s²)
                  </span>
                  <span className="font-mono font-semibold text-lg">
                    {formatNum(stats.sampleVariance)}
                  </span>
                </div>
                <div className="px-4 py-3 bg-primary-light rounded-lg">
                  <span className="block text-xs text-muted uppercase tracking-wide">
                    Std Dev (s)
                  </span>
                  <span className="font-mono font-semibold text-lg">
                    {formatNum(stats.sampleStdDev)}
                  </span>
                </div>
              </div>
            </div>

            {numbers.length < 2 && (
              <p className="text-xs text-muted">
                Note: Sample standard deviation requires at least 2 data points.
              </p>
            )}
          </div>
        )}

        {!hasData && input.trim() !== "" && (
          <p className="text-sm text-muted">
            No valid numbers found. Enter comma-separated numbers like: 10, 20, 30
          </p>
        )}
      </div>
    </CalculatorShell>
  );
}
