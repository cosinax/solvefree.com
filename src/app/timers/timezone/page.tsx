"use client";

import { useState, useEffect } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";

const timezones = [
  "America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles",
  "America/Anchorage", "Pacific/Honolulu", "America/Sao_Paulo", "America/Mexico_City",
  "Europe/London", "Europe/Paris", "Europe/Berlin", "Europe/Moscow",
  "Africa/Cairo", "Africa/Johannesburg",
  "Asia/Dubai", "Asia/Kolkata", "Asia/Shanghai", "Asia/Tokyo", "Asia/Seoul", "Asia/Singapore",
  "Australia/Sydney", "Pacific/Auckland",
  "UTC",
];

function tzLabel(tz: string): string {
  return tz.replace(/_/g, " ").replace(/\//g, " / ");
}

function getNowTimeStr(): string {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

function getNowDateStr(): string {
  return new Date().toISOString().split("T")[0];
}

function detectTimezone(): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (timezones.includes(tz)) return tz;
    return "America/New_York";
  } catch {
    return "America/New_York";
  }
}

export default function TimezonePage() {
  const [time, setTime] = useState("12:00");
  const [date, setDate] = useState("");
  const [fromTz, setFromTz] = useState("America/New_York");
  const [toTz, setToTz] = useState("Europe/London");
  const [initialized, setInitialized] = useState(false);

  // On mount: detect browser timezone, use current time
  useEffect(() => {
    const detectedTz = detectTimezone();
    setFromTz(detectedTz);
    setTime(getNowTimeStr());
    setDate(getNowDateStr());
    // Set a sensible "to" timezone different from detected
    if (detectedTz.startsWith("America")) setToTz("Europe/London");
    else if (detectedTz.startsWith("Europe")) setToTz("America/New_York");
    else if (detectedTz.startsWith("Asia")) setToTz("America/New_York");
    else setToTz("America/New_York");
    setInitialized(true);
  }, []);

  const inputDate = date && time ? new Date(`${date}T${time}:00`) : null;
  const valid = inputDate && !isNaN(inputDate.getTime()) && initialized;

  // Format in source timezone
  const fromStr = valid
    ? inputDate.toLocaleString("en-US", {
        timeZone: fromTz,
        hour: "numeric", minute: "2-digit", hour12: true,
        weekday: "short", month: "short", day: "numeric",
      })
    : "";

  // Convert: interpret the input as being in fromTz, then display in toTz
  let convertedStr = "";
  if (valid && inputDate) {
    // Get offsets
    const fromLocal = new Date(inputDate.toLocaleString("en-US", { timeZone: fromTz }));
    const toLocal = new Date(inputDate.toLocaleString("en-US", { timeZone: toTz }));
    const diff = toLocal.getTime() - fromLocal.getTime();
    const targetTime = new Date(inputDate.getTime() + diff);
    convertedStr = targetTime.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
    const targetDateStr = targetTime.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
    convertedStr += ` — ${targetDateStr}`;
  }

  const sc = "w-full px-3 py-2.5 bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm";

  return (
    <CalculatorShell title="Time Zone Converter" description="Convert times between different time zones. Defaults to your current time and detected timezone.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-muted mb-1">Time</label>
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)}
              className="w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">From Time Zone</label>
          <select value={fromTz} onChange={(e) => setFromTz(e.target.value)} className={sc}>
            {timezones.map((tz) => <option key={tz} value={tz}>{tzLabel(tz)}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">To Time Zone</label>
          <select value={toTz} onChange={(e) => setToTz(e.target.value)} className={sc}>
            {timezones.map((tz) => <option key={tz} value={tz}>{tzLabel(tz)}</option>)}
          </select>
        </div>
        <button onClick={() => { setFromTz(toTz); setToTz(fromTz); }}
          className="w-full text-sm text-primary font-medium py-1 hover:underline">⇄ Swap time zones</button>
        <button onClick={() => { setTime(getNowTimeStr()); setDate(getNowDateStr()); }}
          className="w-full text-xs text-muted hover:text-primary py-1">Use current time</button>
        {valid && convertedStr && (
          <div className="bg-primary-light rounded-xl p-4 text-center space-y-2">
            <div>
              <span className="text-xs text-muted">{tzLabel(fromTz)}</span>
              <div className="font-mono font-semibold">{fromStr}</div>
            </div>
            <div className="text-xl">↓</div>
            <div>
              <span className="text-xs text-muted">{tzLabel(toTz)}</span>
              <div className="font-mono font-bold text-xl text-primary">{convertedStr}</div>
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
