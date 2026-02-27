"use client";

import { useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";

export default function PacePage() {
  const [distance, setDistance] = useState("3.1");
  const [unit, setUnit] = useState<"miles" | "km">("miles");
  const [hours, setHours] = useState("0");
  const [minutes, setMinutes] = useState("25");
  const [seconds, setSeconds] = useState("0");

  const d = parseFloat(distance);
  const totalSec = parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds);
  const valid = d > 0 && totalSec > 0;

  const paceSecPerUnit = totalSec / d;
  const paceMin = Math.floor(paceSecPerUnit / 60);
  const paceSec = Math.round(paceSecPerUnit % 60);

  const distKm = unit === "miles" ? d * 1.60934 : d;
  const distMi = unit === "km" ? d / 1.60934 : d;
  const speedMph = (distMi / totalSec) * 3600;
  const speedKph = (distKm / totalSec) * 3600;

  const pacePerKm = totalSec / distKm;
  const pacePerMi = totalSec / distMi;

  function fmtPace(sec: number) {
    return `${Math.floor(sec / 60)}:${String(Math.round(sec % 60)).padStart(2, "0")}`;
  }

  const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

  return (
    <CalculatorShell title="Pace Calculator" description="Calculate running/walking pace, speed, and finish time.">
      <div className="space-y-4">
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-sm text-muted mb-1">Distance</label>
            <input type="number" value={distance} onChange={(e) => setDistance(e.target.value)} step="0.1" className={ic} />
          </div>
          <div className="w-24">
            <label className="block text-sm text-muted mb-1">Unit</label>
            <select value={unit} onChange={(e) => setUnit(e.target.value as "miles" | "km")}
              className="w-full px-3 py-2.5 bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="miles">Miles</option>
              <option value="km">Km</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">Time</label>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <input type="number" value={hours} onChange={(e) => setHours(e.target.value)} min="0" placeholder="hrs" className={ic} />
              <span className="text-xs text-muted">hours</span>
            </div>
            <div>
              <input type="number" value={minutes} onChange={(e) => setMinutes(e.target.value)} min="0" placeholder="min" className={ic} />
              <span className="text-xs text-muted">minutes</span>
            </div>
            <div>
              <input type="number" value={seconds} onChange={(e) => setSeconds(e.target.value)} min="0" placeholder="sec" className={ic} />
              <span className="text-xs text-muted">seconds</span>
            </div>
          </div>
        </div>
        {valid && (
          <div className="space-y-3">
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="block text-sm text-muted">Pace</span>
              <span className="block font-mono font-bold text-3xl text-primary">{paceMin}:{String(paceSec).padStart(2, "0")} /{unit === "miles" ? "mi" : "km"}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="px-4 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">Pace /mi</span>
                <span className="font-mono font-semibold">{fmtPace(pacePerMi)}</span>
              </div>
              <div className="px-4 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">Pace /km</span>
                <span className="font-mono font-semibold">{fmtPace(pacePerKm)}</span>
              </div>
              <div className="px-4 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">Speed (mph)</span>
                <span className="font-mono font-semibold">{speedMph.toFixed(2)}</span>
              </div>
              <div className="px-4 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">Speed (kph)</span>
                <span className="font-mono font-semibold">{speedKph.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
