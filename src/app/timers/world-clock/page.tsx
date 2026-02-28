"use client";

import { useState, useEffect } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";

const cities = [
  { name: "New York", tz: "America/New_York" },
  { name: "Los Angeles", tz: "America/Los_Angeles" },
  { name: "Chicago", tz: "America/Chicago" },
  { name: "Denver", tz: "America/Denver" },
  { name: "London", tz: "Europe/London" },
  { name: "Paris", tz: "Europe/Paris" },
  { name: "Berlin", tz: "Europe/Berlin" },
  { name: "Moscow", tz: "Europe/Moscow" },
  { name: "Dubai", tz: "Asia/Dubai" },
  { name: "Mumbai", tz: "Asia/Kolkata" },
  { name: "Shanghai", tz: "Asia/Shanghai" },
  { name: "Tokyo", tz: "Asia/Tokyo" },
  { name: "Seoul", tz: "Asia/Seoul" },
  { name: "Singapore", tz: "Asia/Singapore" },
  { name: "Sydney", tz: "Australia/Sydney" },
  { name: "Auckland", tz: "Pacific/Auckland" },
  { name: "São Paulo", tz: "America/Sao_Paulo" },
  { name: "Mexico City", tz: "America/Mexico_City" },
  { name: "Cairo", tz: "Africa/Cairo" },
  { name: "Johannesburg", tz: "Africa/Johannesburg" },
  { name: "Honolulu", tz: "Pacific/Honolulu" },
  { name: "Anchorage", tz: "America/Anchorage" },
];

function getUtcOffset(tz: string, date: Date): string {
  try {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      timeZoneName: "shortOffset",
    });
    const parts = formatter.formatToParts(date);
    const tzName = parts.find(p => p.type === "timeZoneName")?.value ?? "";
    // shortOffset gives "GMT+5:30" etc — convert to +05:30
    return tzName.replace("GMT", "UTC");
  } catch {
    return "";
  }
}

export default function WorldClockPage() {
  const [now, setNow] = useState(new Date());
  const [browserTz, setBrowserTz] = useState("");

  useEffect(() => {
    setBrowserTz(Intl.DateTimeFormat().resolvedOptions().timeZone);
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <CalculatorShell title="World Clock" description="Current time in cities around the world.">
      {browserTz && !cities.some(c => c.tz === browserTz) && (
        <div className="mb-2 px-4 py-3 bg-primary-light border border-primary rounded-lg flex items-center justify-between">
          <div>
            <span className="font-medium">Your timezone</span>
            <span className="text-xs text-muted ml-2">{browserTz}</span>
          </div>
          <div className="text-right">
            <span className="font-mono font-semibold block">
              {now.toLocaleTimeString("en-US", { timeZone: browserTz, hour: "numeric", minute: "2-digit", second: "2-digit", hour12: true })}
            </span>
            <span className="text-xs text-muted">{getUtcOffset(browserTz, now)}</span>
          </div>
        </div>
      )}
      <div className="space-y-2">
        {cities.map((city) => {
          const timeStr = now.toLocaleTimeString("en-US", { timeZone: city.tz, hour: "numeric", minute: "2-digit", second: "2-digit", hour12: true });
          const dateStr = now.toLocaleDateString("en-US", { timeZone: city.tz, weekday: "short", month: "short", day: "numeric" });
          const offset = getUtcOffset(city.tz, now);
          const isBrowser = city.tz === browserTz;
          return (
            <div key={city.tz} className={`flex items-center justify-between px-4 py-3 rounded-lg border ${isBrowser ? "bg-primary-light border-primary" : "bg-background border-card-border"}`}>
              <div>
                <span className="font-medium">{city.name}</span>
                {isBrowser && <span className="ml-2 text-xs bg-primary text-white px-1.5 py-0.5 rounded font-medium">You</span>}
                <span className="text-xs text-muted ml-2">{dateStr}</span>
              </div>
              <div className="text-right">
                <span className="font-mono font-semibold block">{timeStr}</span>
                <span className="text-xs text-muted">{offset}</span>
              </div>
            </div>
          );
        })}
      </div>
    </CalculatorShell>
  );
}
