"use client";

import { useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";

function fmt(n: number): string {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function TipPage() {
  const [bill, setBill] = useState("");
  const [tipPct, setTipPct] = useState("18");
  const [people, setPeople] = useState("1");

  const b = parseFloat(bill), t = parseFloat(tipPct) / 100, p = parseInt(people) || 1;
  const valid = b > 0;
  const tip = b * t;
  const total = b + tip;
  const perPerson = total / p;
  const tipPerPerson = tip / p;

  const presets = [10, 15, 18, 20, 25];

  return (
    <CalculatorShell title="Tip Calculator" description="Calculate tip and split the bill among friends.">
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-muted mb-1">Bill Amount ($)</label>
          <input type="number" value={bill} onChange={(e) => setBill(e.target.value)} placeholder="0.00"
            className="w-full px-4 py-3 text-xl font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">Tip Percentage</label>
          <div className="flex gap-2 mb-2">
            {presets.map((p) => (
              <button key={p} onClick={() => setTipPct(p.toString())}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${parseInt(tipPct) === p ? "bg-primary text-white" : "bg-background border border-card-border hover:bg-primary-light"}`}>
                {p}%
              </button>
            ))}
          </div>
          <input type="number" value={tipPct} onChange={(e) => setTipPct(e.target.value)} min="0" step="1"
            className="w-full px-3 py-2 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">Split Between</label>
          <input type="number" value={people} onChange={(e) => setPeople(e.target.value)} min="1"
            className="w-full px-3 py-2 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        {valid && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="px-4 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">Tip</span>
                <span className="font-mono font-bold text-xl">${fmt(tip)}</span>
              </div>
              <div className="px-4 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">Total</span>
                <span className="font-mono font-bold text-xl">${fmt(total)}</span>
              </div>
            </div>
            {p > 1 && (
              <div className="grid grid-cols-2 gap-3">
                <div className="px-4 py-3 bg-primary-light rounded-lg text-center">
                  <span className="block text-xs text-muted">Tip / Person</span>
                  <span className="font-mono font-semibold">${fmt(tipPerPerson)}</span>
                </div>
                <div className="px-4 py-3 bg-primary-light rounded-lg text-center">
                  <span className="block text-xs text-muted">Total / Person</span>
                  <span className="font-mono font-semibold">${fmt(perPerson)}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
