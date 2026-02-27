"use client";

import { useState, useEffect } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";

export default function UnixTimestampPage() {
  const [now, setNow] = useState(Date.now());
  const [timestamp, setTimestamp] = useState("");
  const [dateInput, setDateInput] = useState("");
  const [timeInput, setTimeInput] = useState("");

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Timestamp to date
  const ts = parseInt(timestamp);
  const tsDate = !isNaN(ts) ? new Date(ts > 1e12 ? ts : ts * 1000) : null;

  // Date to timestamp
  const dtStr = dateInput && timeInput ? `${dateInput}T${timeInput}` : dateInput ? `${dateInput}T00:00:00` : "";
  const dt = dtStr ? new Date(dtStr) : null;
  const dtValid = dt && !isNaN(dt.getTime());

  const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

  return (
    <CalculatorShell title="Unix Timestamp Converter" description="Convert between Unix timestamps and human-readable dates.">
      <div className="space-y-6">
        <div className="bg-primary-light rounded-xl p-4 text-center">
          <span className="block text-sm text-muted">Current Unix Timestamp</span>
          <span className="block font-mono font-bold text-2xl text-primary">{Math.floor(now / 1000)}</span>
          <span className="block text-xs text-muted">{new Date(now).toISOString()}</span>
        </div>

        <hr className="border-card-border" />

        <div>
          <h2 className="text-lg font-semibold mb-3">Timestamp → Date</h2>
          <input type="number" value={timestamp} onChange={(e) => setTimestamp(e.target.value)}
            placeholder="e.g. 1700000000" className={ic} />
          {tsDate && (
            <div className="mt-3 px-4 py-3 bg-primary-light rounded-lg space-y-1">
              <div className="text-sm"><span className="text-muted">Local: </span><span className="font-mono">{tsDate.toLocaleString()}</span></div>
              <div className="text-sm"><span className="text-muted">UTC: </span><span className="font-mono">{tsDate.toUTCString()}</span></div>
              <div className="text-sm"><span className="text-muted">ISO: </span><span className="font-mono">{tsDate.toISOString()}</span></div>
            </div>
          )}
        </div>

        <hr className="border-card-border" />

        <div>
          <h2 className="text-lg font-semibold mb-3">Date → Timestamp</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-muted mb-1">Date</label>
              <input type="date" value={dateInput} onChange={(e) => setDateInput(e.target.value)} className={ic} />
            </div>
            <div>
              <label className="block text-sm text-muted mb-1">Time</label>
              <input type="time" value={timeInput} onChange={(e) => setTimeInput(e.target.value)} className={ic} />
            </div>
          </div>
          {dtValid && dt && (
            <div className="mt-3 px-4 py-3 bg-primary-light rounded-lg">
              <span className="text-sm text-muted">Unix Timestamp: </span>
              <span className="font-mono font-bold text-lg">{Math.floor(dt.getTime() / 1000)}</span>
              <span className="text-xs text-muted ml-2">(ms: {dt.getTime()})</span>
            </div>
          )}
        </div>
      </div>
    </CalculatorShell>
  );
}
