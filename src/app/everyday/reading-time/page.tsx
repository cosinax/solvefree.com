"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

export default function ReadingTimePage() {
  const [v, setV] = useHashState({ text: "", wpm: "238" });
  const wpm = parseFloat(v.wpm) || 238;
  const wordCount = v.text.trim() ? v.text.trim().split(/\s+/).length : 0;
  const charCount = v.text.length;
  const sentences = v.text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  const paragraphs = v.text.split(/\n\n+/).filter(p => p.trim().length > 0).length;
  const minutes = wordCount / wpm;

  function fmtTime(min: number): string {
    if (min < 1) return `${Math.round(min * 60)} seconds`;
    if (min < 60) return `${min.toFixed(1)} minutes`;
    return `${(min / 60).toFixed(1)} hours`;
  }

  const speakingTime = wordCount / 130;
  const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

  return (
    <CalculatorShell title="Reading Time Estimator" description="Paste text to estimate how long it takes to read or speak aloud.">
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-muted mb-1">Paste text here</label>
          <textarea value={v.text} onChange={e => setV({ text: e.target.value })} rows={8} placeholder="Paste your article, essay, or document here..."
            className="w-full px-4 py-3 font-mono text-sm bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-y" />
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">Reading Speed (WPM)</label>
          <input type="number" value={v.wpm} onChange={e => setV({ wpm: e.target.value })} className={ic} />
          <div className="flex gap-2 mt-1">
            {[{l:"Slow",v:"150"},{l:"Average",v:"238"},{l:"Fast",v:"350"},{l:"Speed read",v:"700"}].map(p => (
              <button key={p.l} onClick={() => setV({ wpm: p.v })}
                className={`flex-1 text-xs py-1 rounded border ${v.wpm === p.v ? "bg-primary text-white border-primary" : "bg-background border-card-border hover:bg-primary-light"}`}>{p.l}</button>
            ))}
          </div>
        </div>
        {wordCount > 0 && (
          <div className="space-y-3">
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="block text-sm text-muted">Reading Time</span>
              <span className="block font-mono font-bold text-3xl text-primary">{fmtTime(minutes)}</span>
              <span className="block text-xs text-muted">Speaking: {fmtTime(speakingTime)}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[["Words", wordCount.toLocaleString()], ["Characters", charCount.toLocaleString()], ["Sentences", sentences.toLocaleString()], ["Paragraphs", paragraphs.toLocaleString()]].map(([l, val]) => (
                <div key={l} className="px-4 py-3 bg-primary-light rounded-lg text-center">
                  <span className="block text-xs text-muted">{l}</span>
                  <span className="font-mono font-bold">{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        <p className="text-xs text-muted">Average adult reads ~238 WPM silently, ~130 WPM speaking aloud.</p>
      </div>
    </CalculatorShell>
  );
}
