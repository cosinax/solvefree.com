"use client";

import { useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";

function formatResult(value: number): string {
  if (!isFinite(value) || isNaN(value)) return "Error";
  return parseFloat(value.toPrecision(12)).toString();
}

export default function LogarithmPage() {
  const [log10Value, setLog10Value] = useState("");
  const [lnValue, setLnValue] = useState("");
  const [customBase, setCustomBase] = useState("");
  const [customValue, setCustomValue] = useState("");

  const log10Result =
    log10Value !== "" ? formatResult(Math.log10(parseFloat(log10Value))) : null;

  const lnResult =
    lnValue !== "" ? formatResult(Math.log(parseFloat(lnValue))) : null;

  const customResult =
    customBase !== "" && customValue !== ""
      ? formatResult(
          Math.log(parseFloat(customValue)) / Math.log(parseFloat(customBase))
        )
      : null;

  return (
    <CalculatorShell
      title="Logarithm Calculator"
      description="Calculate log base 10, natural log (ln), and logarithms with a custom base."
    >
      <div className="space-y-8">
        {/* Log base 10 */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Log Base 10</h2>
          <div>
            <label className="block text-sm text-muted mb-1">Value</label>
            <input
              type="number"
              value={log10Value}
              onChange={(e) => setLog10Value(e.target.value)}
              placeholder="e.g. 100"
              className="w-full px-4 py-3 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              autoComplete="off"
            />
          </div>
          {log10Result !== null && (
            <div className="mt-3 px-4 py-3 bg-primary-light rounded-lg">
              <span className="text-sm text-muted">Result: </span>
              <span className="font-mono font-semibold text-lg">
                log₁₀({log10Value}) = {log10Result}
              </span>
            </div>
          )}
        </div>

        <hr className="border-card-border" />

        {/* Natural log */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Natural Log (ln)</h2>
          <div>
            <label className="block text-sm text-muted mb-1">Value</label>
            <input
              type="number"
              value={lnValue}
              onChange={(e) => setLnValue(e.target.value)}
              placeholder="e.g. 2.718"
              className="w-full px-4 py-3 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              autoComplete="off"
            />
          </div>
          {lnResult !== null && (
            <div className="mt-3 px-4 py-3 bg-primary-light rounded-lg">
              <span className="text-sm text-muted">Result: </span>
              <span className="font-mono font-semibold text-lg">
                ln({lnValue}) = {lnResult}
              </span>
            </div>
          )}
        </div>

        <hr className="border-card-border" />

        {/* Custom base */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Custom Base</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-muted mb-1">Base</label>
              <input
                type="number"
                value={customBase}
                onChange={(e) => setCustomBase(e.target.value)}
                placeholder="e.g. 2"
                className="w-full px-4 py-3 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                autoComplete="off"
              />
            </div>
            <div>
              <label className="block text-sm text-muted mb-1">Value</label>
              <input
                type="number"
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                placeholder="e.g. 256"
                className="w-full px-4 py-3 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                autoComplete="off"
              />
            </div>
          </div>
          {customResult !== null && (
            <div className="mt-3 px-4 py-3 bg-primary-light rounded-lg">
              <span className="text-sm text-muted">Result: </span>
              <span className="font-mono font-semibold text-lg">
                log{customBase !== "" ? `₍${customBase}₎` : ""}({customValue}) ={" "}
                {customResult}
              </span>
            </div>
          )}
        </div>
      </div>
    </CalculatorShell>
  );
}
