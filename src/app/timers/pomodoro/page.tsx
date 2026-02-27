"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";

export default function PomodoroPage() {
  const [workMin, setWorkMin] = useState(25);
  const [breakMin, setBreakMin] = useState(5);
  const [isWork, setIsWork] = useState(true);
  const [running, setRunning] = useState(false);
  const [remaining, setRemaining] = useState(25 * 60 * 1000);
  const [sessions, setSessions] = useState(0);
  const endRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  const update = useCallback(() => {
    const rem = Math.max(endRef.current - Date.now(), 0);
    setRemaining(rem);
    if (rem <= 0) {
      setRunning(false);
      return;
    }
    rafRef.current = requestAnimationFrame(update);
  }, []);

  function start() {
    endRef.current = Date.now() + remaining;
    setRunning(true);
    rafRef.current = requestAnimationFrame(update);
  }

  function pause() {
    setRunning(false);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }

  function skip() {
    pause();
    if (isWork) {
      setSessions((s) => s + 1);
      setIsWork(false);
      setRemaining(breakMin * 60 * 1000);
    } else {
      setIsWork(true);
      setRemaining(workMin * 60 * 1000);
    }
  }

  function reset() {
    pause();
    setIsWork(true);
    setRemaining(workMin * 60 * 1000);
    setSessions(0);
  }

  // Auto-advance when timer hits 0
  useEffect(() => {
    if (!running && remaining === 0) {
      skip();
    }
  }, [remaining, running]);

  useEffect(() => { return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }; }, []);

  const totalSec = Math.ceil(remaining / 1000);
  const mins = Math.floor(totalSec / 60);
  const secs = totalSec % 60;

  return (
    <CalculatorShell title="Pomodoro Timer" description="Stay focused with work/break intervals. Default: 25 min work, 5 min break.">
      <div className="space-y-4">
        {!running && remaining === workMin * 60 * 1000 && sessions === 0 && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-muted mb-1">Work (min)</label>
              <input type="number" value={workMin} onChange={(e) => { setWorkMin(Number(e.target.value)); setRemaining(Number(e.target.value) * 60 * 1000); }} min="1"
                className="w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-center" />
            </div>
            <div>
              <label className="block text-sm text-muted mb-1">Break (min)</label>
              <input type="number" value={breakMin} onChange={(e) => setBreakMin(Number(e.target.value))} min="1"
                className="w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-center" />
            </div>
          </div>
        )}

        <div className={`text-center py-8 rounded-xl ${isWork ? "bg-primary-light" : "bg-green-50 dark:bg-green-950"}`}>
          <span className={`block text-sm font-semibold mb-2 ${isWork ? "text-primary" : "text-success"}`}>
            {isWork ? "🍅 Work" : "☕ Break"}
          </span>
          <span className="font-mono font-bold text-6xl">
            {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
          </span>
        </div>

        <div className="flex gap-2 justify-center">
          {!running ? (
            <button onClick={start} className="px-6 py-2.5 rounded-lg font-medium bg-success text-white">Start</button>
          ) : (
            <button onClick={pause} className="px-6 py-2.5 rounded-lg font-medium bg-danger text-white">Pause</button>
          )}
          <button onClick={skip} className="px-4 py-2.5 rounded-lg font-medium bg-primary text-white">Skip ⏭</button>
          <button onClick={reset} className="px-4 py-2.5 rounded-lg font-medium bg-card border border-card-border">Reset</button>
        </div>

        <div className="text-center text-sm text-muted">
          Sessions completed: <span className="font-mono font-semibold">{sessions}</span>
        </div>
      </div>
    </CalculatorShell>
  );
}
