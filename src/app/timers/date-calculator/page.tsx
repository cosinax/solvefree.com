"use client";

import { useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";

export default function DateCalculatorPage() {
  const [mode, setMode] = useState<"between" | "add">("between");
  const [date1, setDate1] = useState("");
  const [date2, setDate2] = useState("");
  const [baseDate, setBaseDate] = useState("");
  const [addDays, setAddDays] = useState("30");
  const [addDir, setAddDir] = useState<"add" | "subtract">("add");

  // Between dates
  const d1 = date1 ? new Date(date1 + "T00:00:00") : null;
  const d2 = date2 ? new Date(date2 + "T00:00:00") : null;
  const diffMs = d1 && d2 ? Math.abs(d2.getTime() - d1.getTime()) : 0;
  const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = d1 && d2 ? Math.abs((d2.getFullYear() - d1.getFullYear()) * 12 + d2.getMonth() - d1.getMonth()) : 0;

  // Add/subtract days
  const bd = baseDate ? new Date(baseDate + "T00:00:00") : null;
  const n = parseInt(addDays) || 0;
  const resultDate = bd ? new Date(bd.getTime() + (addDir === "add" ? 1 : -1) * n * 24 * 60 * 60 * 1000) : null;

  const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

  return (
    <CalculatorShell title="Date Calculator" description="Calculate days between dates or add/subtract days from a date.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => setMode("between")}
            className={`py-2 rounded-lg text-sm font-medium transition-colors ${mode === "between" ? "bg-primary text-white" : "bg-background border border-card-border"}`}>Days Between</button>
          <button onClick={() => setMode("add")}
            className={`py-2 rounded-lg text-sm font-medium transition-colors ${mode === "add" ? "bg-primary text-white" : "bg-background border border-card-border"}`}>Add / Subtract</button>
        </div>

        {mode === "between" ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-muted mb-1">Start Date</label>
                <input type="date" value={date1} onChange={(e) => setDate1(e.target.value)} className={ic} />
              </div>
              <div>
                <label className="block text-sm text-muted mb-1">End Date</label>
                <input type="date" value={date2} onChange={(e) => setDate2(e.target.value)} className={ic} />
              </div>
            </div>
            {d1 && d2 && (
              <div className="grid grid-cols-3 gap-3">
                <div className="px-4 py-3 bg-primary-light rounded-lg text-center">
                  <span className="block text-xs text-muted">Days</span>
                  <span className="font-mono font-bold text-2xl">{diffDays}</span>
                </div>
                <div className="px-4 py-3 bg-primary-light rounded-lg text-center">
                  <span className="block text-xs text-muted">Weeks</span>
                  <span className="font-mono font-bold text-2xl">{diffWeeks}</span>
                </div>
                <div className="px-4 py-3 bg-primary-light rounded-lg text-center">
                  <span className="block text-xs text-muted">~Months</span>
                  <span className="font-mono font-bold text-2xl">{diffMonths}</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-muted mb-1">Start Date</label>
              <input type="date" value={baseDate} onChange={(e) => setBaseDate(e.target.value)} className={ic} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-muted mb-1">Days</label>
                <input type="number" value={addDays} onChange={(e) => setAddDays(e.target.value)} min="0" className={ic} />
              </div>
              <div>
                <label className="block text-sm text-muted mb-1">Direction</label>
                <select value={addDir} onChange={(e) => setAddDir(e.target.value as "add" | "subtract")} className={ic}>
                  <option value="add">Add (+)</option>
                  <option value="subtract">Subtract (−)</option>
                </select>
              </div>
            </div>
            {resultDate && (
              <div className="bg-primary-light rounded-xl p-4 text-center">
                <span className="block text-sm text-muted">Result</span>
                <span className="block font-mono font-bold text-xl text-primary">
                  {resultDate.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
