"use client";

import { useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";

function formatResult(value: number): string {
  if (!isFinite(value) || isNaN(value)) return "Error";
  return parseFloat(value.toPrecision(12)).toString();
}

export default function ExponentsPage() {
  const [base, setBase] = useState("");
  const [power, setPower] = useState("");
  const [nthRoot, setNthRoot] = useState("");
  const [nthRootValue, setNthRootValue] = useState("");

  const powerResult =
    base !== "" && power !== ""
      ? formatResult(Math.pow(parseFloat(base), parseFloat(power)))
      : null;

  const rootResult =
    nthRoot !== "" && nthRootValue !== ""
      ? formatResult(Math.pow(parseFloat(nthRootValue), 1 / parseFloat(nthRoot)))
      : null;

  return (
    <CalculatorShell
      title="Exponent Calculator"
      description="Calculate powers (base^exponent) and nth roots."
    >
      <div className="space-y-8">
        {/* Power section */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Power (base ^ exponent)</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-muted mb-1">Base</label>
              <input
                type="number"
                value={base}
                onChange={(e) => setBase(e.target.value)}
                placeholder="e.g. 2"
                className="w-full px-4 py-3 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                autoComplete="off"
              />
            </div>
            <div>
              <label className="block text-sm text-muted mb-1">Exponent</label>
              <input
                type="number"
                value={power}
                onChange={(e) => setPower(e.target.value)}
                placeholder="e.g. 8"
                className="w-full px-4 py-3 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                autoComplete="off"
              />
            </div>
          </div>
          {powerResult !== null && (
            <div className="mt-3 px-4 py-3 bg-primary-light rounded-lg">
              <span className="text-sm text-muted">Result: </span>
              <span className="font-mono font-semibold text-lg">
                {base}^{power} = {powerResult}
              </span>
            </div>
          )}
        </div>

        <hr className="border-card-border" />

        {/* Nth Root section */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Nth Root</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-muted mb-1">Root (n)</label>
              <input
                type="number"
                value={nthRoot}
                onChange={(e) => setNthRoot(e.target.value)}
                placeholder="e.g. 3"
                className="w-full px-4 py-3 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                autoComplete="off"
              />
            </div>
            <div>
              <label className="block text-sm text-muted mb-1">Value</label>
              <input
                type="number"
                value={nthRootValue}
                onChange={(e) => setNthRootValue(e.target.value)}
                placeholder="e.g. 27"
                className="w-full px-4 py-3 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                autoComplete="off"
              />
            </div>
          </div>
          {rootResult !== null && (
            <div className="mt-3 px-4 py-3 bg-primary-light rounded-lg">
              <span className="text-sm text-muted">Result: </span>
              <span className="font-mono font-semibold text-lg">
                {nthRoot}√{nthRootValue} = {rootResult}
              </span>
            </div>
          )}
        </div>
      </div>
    </CalculatorShell>
  );
}
