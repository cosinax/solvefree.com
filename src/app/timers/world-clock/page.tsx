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

export default function WorldClockPage() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <CalculatorShell title="World Clock" description="Current time in cities around the world.">
      <div className="space-y-2">
        {cities.map((city) => {
          const timeStr = now.toLocaleTimeString("en-US", { timeZone: city.tz, hour: "numeric", minute: "2-digit", second: "2-digit", hour12: true });
          const dateStr = now.toLocaleDateString("en-US", { timeZone: city.tz, weekday: "short", month: "short", day: "numeric" });
          return (
            <div key={city.tz} className="flex items-center justify-between px-4 py-3 bg-background border border-card-border rounded-lg">
              <div>
                <span className="font-medium">{city.name}</span>
                <span className="text-xs text-muted ml-2">{dateStr}</span>
              </div>
              <span className="font-mono font-semibold">{timeStr}</span>
            </div>
          );
        })}
      </div>
    </CalculatorShell>
  );
}
