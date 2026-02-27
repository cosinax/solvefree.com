"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

// Typical typing speed benchmarks
const benchmarks = [
  { label: "Hunt & peck beginner", wpm: 25 },
  { label: "Average typist", wpm: 40 },
  { label: "Good typist", wpm: 65 },
  { label: "Fast typist", wpm: 80 },
  { label: "Professional typist", wpm: 100 },
  { label: "Speed typer", wpm: 120 },
];

export default function TypingSpeedPage() {
  const [v, setV] = useHashState({ words: "250", minutes: "5" });
  const words = parseFloat(v.words);
  const minutes = parseFloat(v.minutes);
  const valid = words > 0 && minutes > 0;
  const wpm = valid ? words / minutes : 0;
  const cpm = wpm * 5; // avg 5 chars per word
  const pagesPerHour = wpm * 60 / 250; // ~250 words per page

  const percentile = benchmarks.filter(b => wpm > b.wpm).length;
  const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

  return (
    <CalculatorShell title="Typing Speed Calculator" description="Calculate WPM (words per minute) from word count and time.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div><label className="block text-sm text-muted mb-1">Words Typed</label><input type="number" value={v.words} onChange={e => setV({ words: e.target.value })} className={ic} /></div>
          <div><label className="block text-sm text-muted mb-1">Time (minutes)</label><input type="number" value={v.minutes} onChange={e => setV({ minutes: e.target.value })} step="0.5" className={ic} /></div>
        </div>
        {valid && (
          <div className="space-y-3">
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="block text-sm text-muted">Typing Speed</span>
              <span className="block font-mono font-bold text-4xl text-primary">{wpm.toFixed(1)} WPM</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="px-4 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">Chars/min (CPM)</span>
                <span className="font-mono font-bold text-lg">{cpm.toFixed(0)}</span>
              </div>
              <div className="px-4 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">Pages/hour</span>
                <span className="font-mono font-bold text-lg">{pagesPerHour.toFixed(1)}</span>
              </div>
              <div className="px-4 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">Keystrokes/hr</span>
                <span className="font-mono font-bold text-lg">{(cpm * 60).toFixed(0)}</span>
              </div>
            </div>
            <div className="space-y-1 text-xs font-mono">
              {benchmarks.map(b => (
                <div key={b.label} className={`flex justify-between px-3 py-1.5 rounded border ${wpm >= b.wpm ? "bg-primary-light border-primary/30" : "bg-background border-card-border text-muted"}`}>
                  <span>{b.wpm} WPM</span>
                  <span>{b.label}</span>
                  <span>{wpm >= b.wpm ? "✓" : ""}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
