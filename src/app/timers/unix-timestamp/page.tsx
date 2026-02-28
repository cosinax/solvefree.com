"use client";

import { useState, useEffect } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";

const INT32_MAX = 2147483647;
const UINT32_MAX = 4294967295;

export default function UnixTimestampPage() {
  const [now, setNow] = useState(Date.now());
  const [timestamp, setTimestamp] = useState("");
  const [dateInput, setDateInput] = useState("");
  const [timeInput, setTimeInput] = useState("");
  const [use64bit, setUse64bit] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const ts = parseInt(timestamp);
  const tsDate = !isNaN(ts) ? new Date(ts > 1e12 ? ts : ts * 1000) : null;
  const tsSeconds = !isNaN(ts) ? (ts > 1e12 ? Math.floor(ts / 1000) : ts) : null;

  const dtStr = dateInput && timeInput ? `${dateInput}T${timeInput}` : dateInput ? `${dateInput}T00:00:00` : "";
  const dt = dtStr ? new Date(dtStr) : null;
  const dtValid = dt && !isNaN(dt.getTime());
  const dtSeconds = dtValid && dt ? Math.floor(dt.getTime() / 1000) : null;

  const currentTs = Math.floor(now / 1000);
  const daysUntilRollover = Math.floor((INT32_MAX - currentTs) / 86400);

  const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

  return (
    <CalculatorShell title="Unix Timestamp Converter" description="Convert between Unix timestamps and human-readable dates.">
      <div className="space-y-6">
        <div className="bg-primary-light rounded-xl p-4 text-center">
          <span className="block text-sm text-muted">Current Unix Timestamp</span>
          <span className="block font-mono font-bold text-2xl text-primary">{currentTs}</span>
          <span className="block text-xs text-muted">{new Date(now).toISOString()}</span>
          {!use64bit && (
            <span className="block text-xs text-muted mt-1">
              {daysUntilRollover > 0
                ? `${daysUntilRollover.toLocaleString()} days until 32-bit signed overflow (Jan 19, 2038)`
                : "⚠️ 32-bit signed integer overflow has occurred!"}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between px-4 py-2.5 bg-background border border-card-border rounded-lg">
          <div>
            <span className="text-sm font-medium">64-bit mode</span>
            <span className="block text-xs text-muted">Timestamps beyond year 2038 (no 32-bit limit)</span>
          </div>
          <button
            onClick={() => setUse64bit(v => !v)}
            className={`relative w-10 h-6 rounded-full transition-colors ${use64bit ? "bg-primary" : "bg-card-border"}`}
          >
            <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${use64bit ? "translate-x-4" : ""}`} />
          </button>
        </div>

        <hr className="border-card-border" />

        <div>
          <h2 className="text-lg font-semibold mb-3">Timestamp → Date</h2>
          <input type="number" value={timestamp} onChange={(e) => setTimestamp(e.target.value)}
            placeholder="e.g. 1700000000" className={ic} />
          {!use64bit && tsSeconds !== null && tsSeconds > INT32_MAX && (
            <div className="mt-2 px-3 py-2 bg-orange-50 dark:bg-orange-950 border border-orange-300 dark:border-orange-700 rounded-lg text-xs text-orange-700 dark:text-orange-300">
              ⚠️ Beyond 32-bit signed integer max ({INT32_MAX.toLocaleString()}). On systems using signed 32-bit timestamps, this overflows (Y2K38 problem). Enable 64-bit mode above.
            </div>
          )}
          {!use64bit && tsSeconds !== null && tsSeconds <= INT32_MAX && INT32_MAX - tsSeconds < 365 * 24 * 3600 && (
            <div className="mt-2 px-3 py-2 bg-accent/10 border border-accent/30 rounded-lg text-xs text-accent">
              ⚠️ Within 1 year of 32-bit signed overflow (Jan 19, 2038).
            </div>
          )}
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
          {!use64bit && dtSeconds !== null && dtSeconds > INT32_MAX && (
            <div className="mt-2 px-3 py-2 bg-orange-50 dark:bg-orange-950 border border-orange-300 dark:border-orange-700 rounded-lg text-xs text-orange-700 dark:text-orange-300">
              ⚠️ This date is beyond the Y2K38 overflow. As a signed 32-bit int it would wrap to a negative number.
            </div>
          )}
          {dtValid && dt && (
            <div className="mt-3 px-4 py-3 bg-primary-light rounded-lg">
              <span className="text-sm text-muted">Unix Timestamp: </span>
              <span className="font-mono font-bold text-lg">{Math.floor(dt.getTime() / 1000)}</span>
              <span className="text-xs text-muted ml-2">(ms: {dt.getTime()})</span>
            </div>
          )}
        </div>

        <div className="px-4 py-3 bg-background border border-card-border rounded-lg text-xs text-muted space-y-1">
          <p className="font-semibold text-foreground">Integer overflow reference</p>
          <p>Signed 32-bit max: <span className="font-mono">{INT32_MAX.toLocaleString()}</span> → Jan 19, 2038 03:14:07 UTC</p>
          <p>Unsigned 32-bit max: <span className="font-mono">{UINT32_MAX.toLocaleString()}</span> → Feb 7, 2106 06:28:15 UTC</p>
          <p>JavaScript numbers are 64-bit floats — safe integers up to 2⁵³−1 (~285 million years)</p>
        </div>
      </div>
    </CalculatorShell>
  );
}
