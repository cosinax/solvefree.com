"use client";

import { useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}

export default function SleepPage() {
  const [mode, setMode] = useState<"wake" | "sleep">("wake");
  const [time, setTime] = useState("07:00");

  const [h, m] = time.split(":").map(Number);
  const CYCLE = 90; // minutes
  const FALL_ASLEEP = 15; // minutes

  function getSleepTimes() {
    const wake = new Date();
    wake.setHours(h, m, 0, 0);
    const results = [];
    for (let cycles = 6; cycles >= 3; cycles--) {
      const sleepTime = new Date(wake.getTime() - (cycles * CYCLE + FALL_ASLEEP) * 60000);
      results.push({ cycles, time: sleepTime, hours: (cycles * CYCLE) / 60 });
    }
    return results;
  }

  function getWakeTimes() {
    const sleep = new Date();
    sleep.setHours(h, m, 0, 0);
    const results = [];
    for (let cycles = 3; cycles <= 6; cycles++) {
      const wakeTime = new Date(sleep.getTime() + (cycles * CYCLE + FALL_ASLEEP) * 60000);
      results.push({ cycles, time: wakeTime, hours: (cycles * CYCLE) / 60 });
    }
    return results;
  }

  const results = mode === "wake" ? getSleepTimes() : getWakeTimes();

  return (
    <CalculatorShell title="Sleep Calculator" description="Find optimal bedtime and wake times based on 90-minute sleep cycles.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => setMode("wake")}
            className={`py-2 rounded-lg text-sm font-medium transition-colors ${mode === "wake" ? "bg-primary text-white" : "bg-background border border-card-border"}`}>
            I need to wake up at...
          </button>
          <button onClick={() => setMode("sleep")}
            className={`py-2 rounded-lg text-sm font-medium transition-colors ${mode === "sleep" ? "bg-primary text-white" : "bg-background border border-card-border"}`}>
            I&apos;m going to sleep at...
          </button>
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">{mode === "wake" ? "Wake up time" : "Bedtime"}</label>
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)}
            className="w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-muted">
            {mode === "wake" ? "Go to sleep at:" : "Wake up at:"}
          </h3>
          {results.map((r) => (
            <div key={r.cycles} className={`flex items-center justify-between px-4 py-3 rounded-lg ${r.cycles >= 5 ? "bg-primary-light" : "bg-background border border-card-border"}`}>
              <div>
                <span className="font-mono font-bold text-lg">{formatTime(r.time)}</span>
                {r.cycles >= 5 && <span className="ml-2 text-xs text-success font-medium">✓ recommended</span>}
              </div>
              <span className="text-sm text-muted">{r.hours}h · {r.cycles} cycles</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted">Assumes ~15 minutes to fall asleep. Each sleep cycle is ~90 minutes.</p>
      </div>
    </CalculatorShell>
  );
}
