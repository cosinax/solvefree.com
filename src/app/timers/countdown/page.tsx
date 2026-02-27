"use client";

import { useState, useEffect } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";

export default function CountdownPage() {
  const [targetDate, setTargetDate] = useState("");
  const [label, setLabel] = useState("");
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const target = targetDate ? new Date(targetDate + "T00:00:00") : null;
  const valid = target && !isNaN(target.getTime());
  const diffMs = valid ? target!.getTime() - now.getTime() : 0;
  const isPast = diffMs < 0;
  const absDiff = Math.abs(diffMs);

  const days = Math.floor(absDiff / (24 * 60 * 60 * 1000));
  const hours = Math.floor((absDiff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const minutes = Math.floor((absDiff % (60 * 60 * 1000)) / (60 * 1000));
  const seconds = Math.floor((absDiff % (60 * 1000)) / 1000);

  const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

  return (
    <CalculatorShell title="Countdown to Date" description="How many days, hours, minutes until a specific date.">
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-muted mb-1">Target Date</label>
          <input type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} className={ic} />
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">Label (optional)</label>
          <input type="text" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. My Birthday, New Year"
            className="w-full px-3 py-2.5 bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        {valid && (
          <div className="space-y-3">
            {label && <div className="text-center text-lg font-semibold">{label}</div>}
            <div className="text-center text-sm text-muted">{isPast ? "Time since:" : "Time until:"}</div>
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: "Days", value: days },
                { label: "Hours", value: hours },
                { label: "Minutes", value: minutes },
                { label: "Seconds", value: seconds },
              ].map((item) => (
                <div key={item.label} className="bg-primary-light rounded-xl p-4 text-center">
                  <span className="block font-mono font-bold text-3xl text-primary">{item.value}</span>
                  <span className="block text-xs text-muted">{item.label}</span>
                </div>
              ))}
            </div>
            <div className="text-center text-sm text-muted">
              {target!.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
