"use client";

import { useState, useEffect } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";

function AnalogClock({ date }: { date: Date }) {
  const s = date.getSeconds() + date.getMilliseconds() / 1000;
  const m = date.getMinutes() + s / 60;
  const h = (date.getHours() % 12) + m / 60;
  const secDeg = s * 6;
  const minDeg = m * 6;
  const hourDeg = h * 30;
  const R = 80;
  const cx = 100, cy = 100;

  function handEnd(deg: number, len: number) {
    const rad = (deg - 90) * (Math.PI / 180);
    return { x: cx + Math.cos(rad) * len, y: cy + Math.sin(rad) * len };
  }

  const hourEnd = handEnd(hourDeg, 50);
  const minEnd = handEnd(minDeg, 65);
  const secEnd = handEnd(secDeg, 70);

  return (
    <svg viewBox="0 0 200 200" className="w-48 h-48 mx-auto">
      {/* Face */}
      <circle cx={cx} cy={cy} r={R} className="fill-card stroke-card-border" strokeWidth="2" />
      {/* Hour markers */}
      {Array.from({ length: 12 }, (_, i) => {
        const rad = (i * 30 - 90) * (Math.PI / 180);
        const isMajor = i % 3 === 0;
        const inner = isMajor ? R - 12 : R - 7;
        return (
          <line
            key={i}
            x1={cx + Math.cos(rad) * inner} y1={cy + Math.sin(rad) * inner}
            x2={cx + Math.cos(rad) * (R - 2)} y2={cy + Math.sin(rad) * (R - 2)}
            stroke="currentColor" strokeOpacity={isMajor ? 0.6 : 0.3} strokeWidth={isMajor ? 2 : 1}
          />
        );
      })}
      {/* Hour hand */}
      <line x1={cx} y1={cy} x2={hourEnd.x} y2={hourEnd.y} stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      {/* Minute hand */}
      <line x1={cx} y1={cy} x2={minEnd.x} y2={minEnd.y} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      {/* Second hand */}
      <line x1={cx} y1={cy} x2={secEnd.x} y2={secEnd.y} stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
      {/* Center dot */}
      <circle cx={cx} cy={cy} r="4" fill="#ef4444" />
    </svg>
  );
}

export default function ClockPage() {
  const [now, setNow] = useState(new Date());
  const [showAnalog, setShowAnalog] = useState(true);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 100);
    return () => clearInterval(id);
  }, []);

  const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true });
  const dateStr = now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const utcStr = now.toUTCString();
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const tzOffset = (() => {
    const off = -now.getTimezoneOffset();
    const h = Math.floor(Math.abs(off) / 60).toString().padStart(2, "0");
    const m = (Math.abs(off) % 60).toString().padStart(2, "0");
    return `UTC${off >= 0 ? "+" : "-"}${h}:${m}`;
  })();

  return (
    <CalculatorShell title="Clock" description="Current local time with analog and digital display.">
      <div className="space-y-4">
        <div className="flex justify-center gap-2">
          <button onClick={() => setShowAnalog(true)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${showAnalog ? "bg-primary text-white" : "bg-background border border-card-border"}`}>
            Analog
          </button>
          <button onClick={() => setShowAnalog(false)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${!showAnalog ? "bg-primary text-white" : "bg-background border border-card-border"}`}>
            Digital
          </button>
        </div>

        {showAnalog ? (
          <div className="bg-primary-light rounded-xl p-6">
            <AnalogClock date={now} />
            <p className="text-center font-mono font-semibold text-lg mt-3">{timeStr}</p>
            <p className="text-center text-sm text-muted">{dateStr}</p>
          </div>
        ) : (
          <div className="bg-primary-light rounded-xl p-6 text-center">
            <span className="block font-mono font-bold text-5xl tracking-tight">{timeStr}</span>
            <p className="text-sm text-muted mt-2">{dateStr}</p>
          </div>
        )}

        <div className="space-y-1 text-sm">
          <div className="flex justify-between px-4 py-2 bg-background border border-card-border rounded-lg">
            <span className="text-muted">Timezone</span>
            <span className="font-mono font-semibold">{tz} ({tzOffset})</span>
          </div>
          <div className="flex justify-between px-4 py-2 bg-background border border-card-border rounded-lg">
            <span className="text-muted">UTC</span>
            <span className="font-mono font-semibold text-xs">{utcStr}</span>
          </div>
          <div className="flex justify-between px-4 py-2 bg-background border border-card-border rounded-lg">
            <span className="text-muted">Unix timestamp</span>
            <span className="font-mono font-semibold">{Math.floor(now.getTime() / 1000)}</span>
          </div>
        </div>
      </div>
    </CalculatorShell>
  );
}
