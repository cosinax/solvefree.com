"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";

function formatMs(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const hours = Math.floor(totalSec / 3600);
  const mins = Math.floor((totalSec % 3600) / 60);
  const secs = totalSec % 60;
  const centis = Math.floor((ms % 1000) / 10);
  if (hours > 0) return `${hours}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}.${String(centis).padStart(2, "0")}`;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}.${String(centis).padStart(2, "0")}`;
}

export default function TimerPage() {
  const [mode, setMode] = useState<"stopwatch" | "timer">("stopwatch");

  // Stopwatch
  const [swRunning, setSwRunning] = useState(false);
  const [swElapsed, setSwElapsed] = useState(0);
  const [laps, setLaps] = useState<number[]>([]);
  const swStart = useRef(0);
  const swRef = useRef<number | null>(null);

  const updateSw = useCallback(() => {
    setSwElapsed(Date.now() - swStart.current);
    swRef.current = requestAnimationFrame(updateSw);
  }, []);

  function startSw() {
    swStart.current = Date.now() - swElapsed;
    setSwRunning(true);
    swRef.current = requestAnimationFrame(updateSw);
  }

  function stopSw() {
    setSwRunning(false);
    if (swRef.current) cancelAnimationFrame(swRef.current);
  }

  function resetSw() {
    stopSw();
    setSwElapsed(0);
    setLaps([]);
  }

  function lapSw() {
    setLaps((prev) => [swElapsed, ...prev]);
  }

  useEffect(() => { return () => { if (swRef.current) cancelAnimationFrame(swRef.current); }; }, []);

  // Timer
  const [timerMinutes, setTimerMinutes] = useState("5");
  const [timerSeconds, setTimerSeconds] = useState("0");
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerRemaining, setTimerRemaining] = useState(0);
  const timerEnd = useRef(0);
  const timerRef = useRef<number | null>(null);

  const updateTimer = useCallback(() => {
    const rem = Math.max(timerEnd.current - Date.now(), 0);
    setTimerRemaining(rem);
    if (rem <= 0) {
      setTimerRunning(false);
      return;
    }
    timerRef.current = requestAnimationFrame(updateTimer);
  }, []);

  function startTimer() {
    const totalMs = (parseInt(timerMinutes) * 60 + parseInt(timerSeconds)) * 1000;
    if (totalMs <= 0) return;
    timerEnd.current = Date.now() + (timerRunning ? timerRemaining : totalMs);
    if (!timerRunning) setTimerRemaining(totalMs);
    setTimerRunning(true);
    timerRef.current = requestAnimationFrame(updateTimer);
  }

  function stopTimer() {
    setTimerRunning(false);
    if (timerRef.current) cancelAnimationFrame(timerRef.current);
  }

  function resetTimer() {
    stopTimer();
    setTimerRemaining(0);
  }

  useEffect(() => { return () => { if (timerRef.current) cancelAnimationFrame(timerRef.current); }; }, []);

  const btn = "px-4 py-2.5 rounded-lg font-medium transition-colors text-sm";
  const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-center";

  return (
    <CalculatorShell title="Timer & Stopwatch" description="Countdown timer and stopwatch with lap times.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => { setMode("stopwatch"); resetTimer(); }}
            className={`py-2 rounded-lg text-sm font-medium transition-colors ${mode === "stopwatch" ? "bg-primary text-white" : "bg-background border border-card-border"}`}>⏱️ Stopwatch</button>
          <button onClick={() => { setMode("timer"); resetSw(); }}
            className={`py-2 rounded-lg text-sm font-medium transition-colors ${mode === "timer" ? "bg-primary text-white" : "bg-background border border-card-border"}`}>⏲️ Timer</button>
        </div>

        {mode === "stopwatch" ? (
          <div className="space-y-4">
            <div className="text-center py-6">
              <span className="font-mono font-bold text-5xl">{formatMs(swElapsed)}</span>
            </div>
            <div className="flex gap-2 justify-center">
              {!swRunning ? (
                <button onClick={startSw} className={`${btn} bg-success text-white`}>
                  {swElapsed > 0 ? "Resume" : "Start"}
                </button>
              ) : (
                <button onClick={stopSw} className={`${btn} bg-danger text-white`}>Stop</button>
              )}
              {swRunning && <button onClick={lapSw} className={`${btn} bg-primary text-white`}>Lap</button>}
              {!swRunning && swElapsed > 0 && <button onClick={resetSw} className={`${btn} bg-card border border-card-border`}>Reset</button>}
            </div>
            {laps.length > 0 && (
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {laps.map((l, i) => (
                  <div key={i} className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded-lg text-sm font-mono">
                    <span className="text-muted">Lap {laps.length - i}</span>
                    <span>{formatMs(l)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {!timerRunning && timerRemaining === 0 && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-muted mb-1">Minutes</label>
                  <input type="number" value={timerMinutes} onChange={(e) => setTimerMinutes(e.target.value)} min="0" className={ic} />
                </div>
                <div>
                  <label className="block text-sm text-muted mb-1">Seconds</label>
                  <input type="number" value={timerSeconds} onChange={(e) => setTimerSeconds(e.target.value)} min="0" max="59" className={ic} />
                </div>
              </div>
            )}
            <div className="text-center py-6">
              <span className={`font-mono font-bold text-5xl ${timerRemaining === 0 && timerRunning === false && timerRemaining === 0 ? "" : timerRemaining < 10000 && timerRemaining > 0 ? "text-danger" : ""}`}>
                {timerRemaining > 0 || timerRunning ? formatMs(timerRemaining) : formatMs((parseInt(timerMinutes) * 60 + parseInt(timerSeconds)) * 1000)}
              </span>
              {timerRemaining === 0 && !timerRunning && laps.length === 0 && timerMinutes !== "0" && (
                <span className="block text-sm text-muted mt-2">Set time and press Start</span>
              )}
            </div>
            <div className="flex gap-2 justify-center">
              {!timerRunning ? (
                <button onClick={startTimer} className={`${btn} bg-success text-white`}>
                  {timerRemaining > 0 ? "Resume" : "Start"}
                </button>
              ) : (
                <button onClick={stopTimer} className={`${btn} bg-danger text-white`}>Pause</button>
              )}
              {(timerRunning || timerRemaining > 0) && (
                <button onClick={resetTimer} className={`${btn} bg-card border border-card-border`}>Reset</button>
              )}
            </div>
            {timerRemaining === 0 && !timerRunning && swElapsed === 0 && (
              <div className="flex gap-2 justify-center">
                {[1, 2, 5, 10, 15, 30].map((m) => (
                  <button key={m} onClick={() => setTimerMinutes(m.toString())}
                    className="px-3 py-1.5 text-xs rounded-lg bg-background border border-card-border hover:bg-primary-light">
                    {m}m
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
