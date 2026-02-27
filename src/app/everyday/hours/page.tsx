"use client";
import { useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
const icSmall = "w-full px-2 py-1.5 font-mono bg-background border border-card-border rounded focus:outline-none focus:ring-1 focus:ring-primary text-sm";

function toTotalMinutes(h: string, m: string): number {
  const hours = parseInt(h) || 0;
  const mins = parseInt(m) || 0;
  return hours * 60 + mins;
}

function formatHM(totalMinutes: number): string {
  const sign = totalMinutes < 0 ? "-" : "";
  const abs = Math.abs(totalMinutes);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  return `${sign}${h}:${String(m).padStart(2, "0")}`;
}

interface Entry { h: string; m: string; op: "add" | "sub"; }

export default function HoursPage() {
  const [v, setV] = useHashState({ mode: "sum", startH: "9", startM: "00", endH: "17", endM: "30" });
  const [entries, setEntries] = useState<Entry[]>([
    { h: "3", m: "30", op: "add" },
    { h: "1", m: "45", op: "add" },
  ]);

  const updateEntry = (i: number, field: keyof Entry, val: string) => {
    setEntries(prev => prev.map((e, idx) => idx === i ? { ...e, [field]: val } : e));
  };
  const addEntry = () => { if (entries.length < 8) setEntries(prev => [...prev, { h: "0", m: "0", op: "add" }]); };
  const removeEntry = (i: number) => setEntries(prev => prev.filter((_, idx) => idx !== i));

  const totalMinutes = entries.reduce((sum, e) => {
    const mins = toTotalMinutes(e.h, e.m);
    return e.op === "add" ? sum + mins : sum - mins;
  }, 0);
  const decimalHours = totalMinutes / 60;
  const totalSeconds = totalMinutes * 60;

  // Clock duration
  const startTotal = toTotalMinutes(v.startH, v.startM);
  const endTotal = toTotalMinutes(v.endH, v.endM);
  let clockDiff = endTotal - startTotal;
  if (clockDiff < 0) clockDiff += 24 * 60; // crosses midnight

  return (
    <CalculatorShell title="Hours Calculator" description="Add or subtract time durations, or calculate time between two clock times.">
      <div className="space-y-4">
        <div className="flex gap-2">
          <button onClick={() => setV({ mode: "sum" })} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${v.mode === "sum" ? "bg-primary text-white" : "bg-background border border-card-border text-muted"}`}>Add/Subtract Time</button>
          <button onClick={() => setV({ mode: "clock" })} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${v.mode === "clock" ? "bg-primary text-white" : "bg-background border border-card-border text-muted"}`}>Time Between</button>
        </div>

        {v.mode === "sum" && (
          <>
            <div className="space-y-2">
              {entries.map((e, i) => (
                <div key={i} className="flex items-center gap-2">
                  <select value={e.op} onChange={x => updateEntry(i, "op", x.target.value as "add" | "sub")} className="px-2 py-1.5 bg-background border border-card-border rounded text-sm focus:outline-none w-14">
                    <option value="add">+</option>
                    <option value="sub">−</option>
                  </select>
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <div>
                      {i === 0 && <label className="block text-xs text-muted mb-1">Hours</label>}
                      <input type="number" value={e.h} onChange={x => updateEntry(i, "h", x.target.value)} min="0" className={icSmall} />
                    </div>
                    <div>
                      {i === 0 && <label className="block text-xs text-muted mb-1">Minutes</label>}
                      <input type="number" value={e.m} onChange={x => updateEntry(i, "m", x.target.value)} min="0" max="59" className={icSmall} />
                    </div>
                  </div>
                  {entries.length > 1 && <button onClick={() => removeEntry(i)} className="text-xs text-red-400 hover:text-red-500 mt-auto mb-1">✕</button>}
                </div>
              ))}
            </div>
            {entries.length < 8 && (
              <button onClick={addEntry} className="w-full py-2 border border-dashed border-card-border rounded-lg text-sm text-muted hover:text-primary hover:border-primary transition-colors">+ Add Entry</button>
            )}
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="block text-xs text-muted mb-1">Total</span>
              <span className="block font-mono font-bold text-4xl text-primary">{formatHM(totalMinutes)}</span>
              <span className="text-xs text-muted">hours:minutes</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
                <span className="text-muted">Decimal hours</span>
                <span>{decimalHours.toFixed(4)}</span>
              </div>
              <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
                <span className="text-muted">Total seconds</span>
                <span>{Math.abs(totalSeconds).toLocaleString()}</span>
              </div>
            </div>
          </>
        )}

        {v.mode === "clock" && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-muted mb-1">Start Time</label>
                <div className="flex gap-1">
                  <input type="number" value={v.startH} onChange={e => setV({ startH: e.target.value })} min="0" max="23" placeholder="HH" className="w-full px-2 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-center" />
                  <span className="py-2.5 text-muted font-bold">:</span>
                  <input type="number" value={v.startM} onChange={e => setV({ startM: e.target.value })} min="0" max="59" placeholder="MM" className="w-full px-2 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-center" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-muted mb-1">End Time</label>
                <div className="flex gap-1">
                  <input type="number" value={v.endH} onChange={e => setV({ endH: e.target.value })} min="0" max="23" placeholder="HH" className="w-full px-2 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-center" />
                  <span className="py-2.5 text-muted font-bold">:</span>
                  <input type="number" value={v.endM} onChange={e => setV({ endM: e.target.value })} min="0" max="59" placeholder="MM" className="w-full px-2 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-center" />
                </div>
              </div>
            </div>
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="block text-xs text-muted mb-1">Duration</span>
              <span className="block font-mono font-bold text-4xl text-primary">{formatHM(clockDiff)}</span>
              <span className="text-xs text-muted">hours:minutes</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
                <span className="text-muted">Decimal hours</span>
                <span>{(clockDiff / 60).toFixed(4)}</span>
              </div>
              <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
                <span className="text-muted">Total seconds</span>
                <span>{(clockDiff * 60).toLocaleString()}</span>
              </div>
            </div>
            {endTotal < startTotal && (
              <p className="text-xs text-muted">Crosses midnight — duration calculated over 24 hours.</p>
            )}
          </>
        )}
      </div>
    </CalculatorShell>
  );
}
