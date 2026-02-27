"use client";

import { useState, useCallback, useRef } from "react";

/**
 * Provides a simple beep sound for timers using the Web Audio API.
 * Returns [soundEnabled, toggleSound, playBeep]
 */
export function useTimerSound(): [boolean, () => void, () => void] {
  const [enabled, setEnabled] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);

  const toggle = useCallback(() => {
    setEnabled((prev) => !prev);
  }, []);

  const playBeep = useCallback(() => {
    if (!enabled) return;
    try {
      if (!ctxRef.current) {
        ctxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      const ctx = ctxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 800;
      osc.type = "sine";
      gain.gain.value = 0.3;
      osc.start();
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.stop(ctx.currentTime + 0.5);
    } catch {
      // Audio not available
    }
  }, [enabled]);

  return [enabled, toggle, playBeep];
}
