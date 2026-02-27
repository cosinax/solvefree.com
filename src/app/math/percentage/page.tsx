"use client";

import { useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";

function fmt(n: number): string {
  if (!isFinite(n) || isNaN(n)) return "—";
  return parseFloat(n.toPrecision(12)).toString();
}

export default function PercentagePage() {
  const [p1x, setP1x] = useState("");
  const [p1y, setP1y] = useState("");
  const [p2x, setP2x] = useState("");
  const [p2y, setP2y] = useState("");
  const [p3from, setP3from] = useState("");
  const [p3to, setP3to] = useState("");
  const [p4val, setP4val] = useState("");
  const [p4pct, setP4pct] = useState("");

  const inputClass =
    "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent";
  const resultClass =
    "mt-3 px-4 py-3 bg-primary-light rounded-lg font-mono font-semibold text-lg";

  return (
    <CalculatorShell
      title="Percentage Calculator"
      description="Calculate percentages, increases, decreases, and more."
    >
      <div className="space-y-8">
        {/* What is X% of Y? */}
        <div>
          <h2 className="text-lg font-semibold mb-3">What is X% of Y?</h2>
          <div className="flex items-center gap-2">
            <input type="number" value={p1x} onChange={(e) => setP1x(e.target.value)} placeholder="X" className={inputClass} />
            <span className="text-muted font-medium">% of</span>
            <input type="number" value={p1y} onChange={(e) => setP1y(e.target.value)} placeholder="Y" className={inputClass} />
          </div>
          {p1x && p1y && (
            <div className={resultClass}>
              {p1x}% of {p1y} = {fmt((parseFloat(p1x) / 100) * parseFloat(p1y))}
            </div>
          )}
        </div>

        <hr className="border-card-border" />

        {/* X is what % of Y? */}
        <div>
          <h2 className="text-lg font-semibold mb-3">X is what % of Y?</h2>
          <div className="flex items-center gap-2">
            <input type="number" value={p2x} onChange={(e) => setP2x(e.target.value)} placeholder="X" className={inputClass} />
            <span className="text-muted font-medium">is what % of</span>
            <input type="number" value={p2y} onChange={(e) => setP2y(e.target.value)} placeholder="Y" className={inputClass} />
          </div>
          {p2x && p2y && (
            <div className={resultClass}>
              {p2x} is {fmt((parseFloat(p2x) / parseFloat(p2y)) * 100)}% of {p2y}
            </div>
          )}
        </div>

        <hr className="border-card-border" />

        {/* Percentage change */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Percentage Change</h2>
          <div className="flex items-center gap-2">
            <input type="number" value={p3from} onChange={(e) => setP3from(e.target.value)} placeholder="From" className={inputClass} />
            <span className="text-muted font-medium">→</span>
            <input type="number" value={p3to} onChange={(e) => setP3to(e.target.value)} placeholder="To" className={inputClass} />
          </div>
          {p3from && p3to && (
            <div className={resultClass}>
              {(() => {
                const change = ((parseFloat(p3to) - parseFloat(p3from)) / Math.abs(parseFloat(p3from))) * 100;
                return `${change >= 0 ? "+" : ""}${fmt(change)}% change`;
              })()}
            </div>
          )}
        </div>

        <hr className="border-card-border" />

        {/* Increase/decrease by % */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Increase / Decrease by %</h2>
          <div className="flex items-center gap-2">
            <input type="number" value={p4val} onChange={(e) => setP4val(e.target.value)} placeholder="Value" className={inputClass} />
            <span className="text-muted font-medium">±</span>
            <input type="number" value={p4pct} onChange={(e) => setP4pct(e.target.value)} placeholder="%" className={inputClass} />
          </div>
          {p4val && p4pct && (
            <div className="mt-3 space-y-2">
              <div className={resultClass}>
                + {p4pct}% → {fmt(parseFloat(p4val) * (1 + parseFloat(p4pct) / 100))}
              </div>
              <div className={resultClass}>
                − {p4pct}% → {fmt(parseFloat(p4val) * (1 - parseFloat(p4pct) / 100))}
              </div>
            </div>
          )}
        </div>
      </div>
    </CalculatorShell>
  );
}
