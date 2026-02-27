"use client";

import { useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";

export default function DueDatePage() {
  const [lmp, setLmp] = useState("");

  const lmpDate = lmp ? new Date(lmp + "T00:00:00") : null;
  const valid = lmpDate && !isNaN(lmpDate.getTime());

  const dueDate = valid ? new Date(lmpDate!.getTime() + 280 * 24 * 60 * 60 * 1000) : null;
  const today = new Date();
  const daysSinceLmp = valid ? Math.floor((today.getTime() - lmpDate!.getTime()) / (24 * 60 * 60 * 1000)) : 0;
  const weeksPregnant = Math.floor(daysSinceLmp / 7);
  const daysExtra = daysSinceLmp % 7;
  const daysUntilDue = dueDate ? Math.floor((dueDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000)) : 0;
  const trimester = weeksPregnant < 13 ? 1 : weeksPregnant < 27 ? 2 : 3;

  return (
    <CalculatorShell title="Pregnancy Due Date Calculator" description="Estimate your due date based on your last menstrual period (LMP).">
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-muted mb-1">First Day of Last Period</label>
          <input type="date" value={lmp} onChange={(e) => setLmp(e.target.value)}
            className="w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        {valid && dueDate && daysSinceLmp >= 0 && (
          <div className="space-y-3">
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="block text-sm text-muted">Estimated Due Date</span>
              <span className="block font-mono font-bold text-2xl text-primary">
                {dueDate.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="px-3 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">Current Week</span>
                <span className="font-mono font-semibold">{weeksPregnant}w {daysExtra}d</span>
              </div>
              <div className="px-3 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">Trimester</span>
                <span className="font-mono font-semibold">{trimester}{trimester === 1 ? "st" : trimester === 2 ? "nd" : "rd"}</span>
              </div>
              <div className="px-3 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">Days Until Due</span>
                <span className="font-mono font-semibold">{daysUntilDue}</span>
              </div>
            </div>
          </div>
        )}
        <p className="text-xs text-muted">Based on Naegele&apos;s rule: LMP + 280 days. Consult your healthcare provider for accurate dating.</p>
      </div>
    </CalculatorShell>
  );
}
