"use client";

import { useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";

const zones = [
  { name: "Zone 1 — Warm-up", min: 0.5, max: 0.6, color: "text-blue-400" },
  { name: "Zone 2 — Fat Burn", min: 0.6, max: 0.7, color: "text-green-400" },
  { name: "Zone 3 — Cardio", min: 0.7, max: 0.8, color: "text-yellow-400" },
  { name: "Zone 4 — Hard", min: 0.8, max: 0.9, color: "text-orange-400" },
  { name: "Zone 5 — Maximum", min: 0.9, max: 1.0, color: "text-red-400" },
];

export default function HeartRatePage() {
  const [age, setAge] = useState("30");
  const [restingHr, setRestingHr] = useState("65");

  const a = parseInt(age), rhr = parseInt(restingHr);
  const valid = a > 0 && a < 120;
  const maxHr = 220 - a;
  const hrReserve = maxHr - rhr;

  return (
    <CalculatorShell title="Heart Rate Zones" description="Calculate target heart rate zones using the Karvonen method.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-muted mb-1">Age</label>
            <input type="number" value={age} onChange={(e) => setAge(e.target.value)}
              className="w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Resting HR (bpm)</label>
            <input type="number" value={restingHr} onChange={(e) => setRestingHr(e.target.value)}
              className="w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
        </div>
        {valid && (
          <div className="space-y-3">
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="block text-sm text-muted">Max Heart Rate</span>
              <span className="block font-mono font-bold text-3xl text-primary">{maxHr} bpm</span>
            </div>
            <div className="space-y-2">
              {zones.map((z) => (
                <div key={z.name} className="flex items-center justify-between px-4 py-3 bg-background border border-card-border rounded-lg">
                  <span className={`text-sm font-medium ${z.color}`}>{z.name}</span>
                  <span className="font-mono font-semibold text-sm">
                    {Math.round(hrReserve * z.min + rhr)}–{Math.round(hrReserve * z.max + rhr)} bpm
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
