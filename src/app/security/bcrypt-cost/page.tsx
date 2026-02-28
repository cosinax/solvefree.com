"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

export default function BcryptCostPage() {
  const [v, setV] = useHashState({ cost: "12" });
  const cost = parseInt(v.cost);
  const valid = cost >= 4 && cost <= 31;
  // Each increment doubles the time. Base reference: cost=10 ≈ ~100ms on modern hardware
  const baseCostFactor = Math.pow(2, 10); // cost 10 = 2^10 iterations
  const iterations = valid ? Math.pow(2, cost) : 0;
  const baseMsPerHash = 100; // ~100ms at cost=10 on modern server
  const msPerHash = valid ? baseMsPerHash * (iterations / baseCostFactor) : 0;
  const hashesPerSec = msPerHash > 0 ? 1000 / msPerHash : 0;

  const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

  function fmtTime(ms: number): string {
    if (ms < 1) return (ms * 1000).toFixed(1) + " µs";
    if (ms < 1000) return ms.toFixed(1) + " ms";
    return (ms / 1000).toFixed(2) + " s";
  }

  return (
    <CalculatorShell title="bcrypt Cost Factor Calculator" description="Estimate bcrypt hashing time and cost factor for password hashing.">
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-muted mb-1">Cost Factor (4–31): {cost}</label>
          <input type="range" min="4" max="20" value={v.cost} onChange={e => setV({ cost: e.target.value })} className="w-full" />
          <div className="flex justify-between text-xs text-muted mt-1"><span>4 (fastest)</span><span>20 (slowest)</span></div>
        </div>
        {valid && (
          <div className="space-y-3">
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="block text-sm text-muted">Time per hash (approx.)</span>
              <span className="block font-mono font-bold text-3xl text-primary">{fmtTime(msPerHash)}</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="px-4 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">Iterations (2^N)</span>
                <span className="font-mono font-bold text-sm">{iterations.toLocaleString()}</span>
              </div>
              <div className="px-4 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">Hashes/sec</span>
                <span className="font-mono font-bold text-sm">{hashesPerSec < 1 ? hashesPerSec.toFixed(2) : hashesPerSec.toFixed(0)}</span>
              </div>
              <div className="px-4 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">Cost Factor</span>
                <span className="font-mono font-bold text-xl">{cost}</span>
              </div>
            </div>
            {cost < 10 && <div className="px-4 py-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg text-sm text-danger">Cost {cost} is too low for production use. Minimum recommended: 10.</div>}
            {cost >= 10 && cost <= 12 && <div className="px-4 py-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg text-sm text-success">Cost {cost} is appropriate for most web applications.</div>}
            {cost > 12 && <div className="px-4 py-3 bg-primary-light rounded-lg text-sm">High cost factor — excellent security, but may slow login for users.</div>}
          </div>
        )}
        <div className="space-y-1 text-xs font-mono">
          {[10, 11, 12, 13, 14].map(c => {
            const ms = baseMsPerHash * Math.pow(2, c - 10);
            return (
              <div key={c} className={`flex justify-between px-3 py-1.5 rounded border ${c === cost ? "bg-primary-light border-primary/30" : "bg-background border-card-border"}`}>
                <span>cost={c}</span><span>{fmtTime(ms)}/hash</span><span className="text-muted">{Math.pow(2, c).toLocaleString()} iterations</span>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-muted">Times are estimates based on ~100ms at cost=10 on modern server hardware. Actual times vary by CPU.</p>
      </div>
    </CalculatorShell>
  );
}
