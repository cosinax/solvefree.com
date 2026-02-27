"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

// Epley formula: 1RM = w * (1 + r/30)
// Brzycki: 1RM = w * 36 / (37 - r)
// Lombardi: 1RM = w * r^0.1
function epley(w: number, r: number): number { return r === 1 ? w : w * (1 + r / 30); }
function brzycki(w: number, r: number): number { return r === 1 ? w : w * (36 / (37 - r)); }
function lombardi(w: number, r: number): number { return r === 1 ? w : w * Math.pow(r, 0.1); }

export default function OneRepMaxPage() {
  const [v, setV] = useHashState({ weight: "185", reps: "5", unit: "lbs" });
  const w = parseFloat(v.weight), r = parseInt(v.reps);
  const valid = w > 0 && r >= 1 && r <= 20;
  const avg = valid ? (epley(w, r) + brzycki(w, r) + lombardi(w, r)) / 3 : 0;
  const percentages = [100, 95, 90, 85, 80, 75, 70, 65, 60, 55, 50];
  const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

  return (
    <CalculatorShell title="One Rep Max (1RM) Calculator" description="Estimate your 1-rep max and training percentages from a submaximal lift.">
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div><label className="block text-sm text-muted mb-1">Weight Lifted</label><input type="number" value={v.weight} onChange={e => setV({ weight: e.target.value })} className={ic} /></div>
          <div><label className="block text-sm text-muted mb-1">Reps (1–20)</label><input type="number" value={v.reps} onChange={e => setV({ reps: e.target.value })} min="1" max="20" className={ic} /></div>
          <div><label className="block text-sm text-muted mb-1">Unit</label>
            <select value={v.unit} onChange={e => setV({ unit: e.target.value })} className={ic}>
              <option>lbs</option><option>kg</option>
            </select>
          </div>
        </div>
        {valid && (
          <div className="space-y-3">
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="block text-sm text-muted">Estimated 1RM</span>
              <span className="block font-mono font-bold text-4xl text-primary">{avg.toFixed(1)} {v.unit}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs font-mono">
              {[["Epley", epley(w, r)], ["Brzycki", brzycki(w, r)], ["Lombardi", lombardi(w, r)]].map(([name, val]) => (
                <div key={name as string} className="px-3 py-2 bg-background border border-card-border rounded-lg text-center">
                  <span className="block text-muted">{name as string}</span>
                  <span className="font-semibold">{(val as number).toFixed(1)}</span>
                </div>
              ))}
            </div>
            <div>
              <p className="text-xs text-muted font-semibold mb-1">Training percentages:</p>
              <div className="space-y-1 text-xs font-mono">
                {percentages.map(pct => {
                  const weight = (avg * pct / 100).toFixed(1);
                  const repsFor = pct >= 90 ? "1–2" : pct >= 80 ? "3–5" : pct >= 70 ? "6–8" : pct >= 60 ? "10–12" : "15+";
                  return (
                    <div key={pct} className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded">
                      <span>{pct}%</span><span>{weight} {v.unit}</span><span className="text-muted">{repsFor} reps</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
