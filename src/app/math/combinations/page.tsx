"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

export default function CombinationsPage() {
  const [v, setV] = useHashState({ n: "10", r: "3" });
  const n = parseInt(v.n), r = parseInt(v.r);
  const valid = n >= 0 && r >= 0 && r <= n && n <= 30;

  function factorial(x: number): number {
    if (x <= 1) return 1;
    let f = 1;
    for (let i = 2; i <= x; i++) f *= i;
    return f;
  }

  const C = valid ? factorial(n) / (factorial(r) * factorial(n - r)) : 0;
  const P = valid ? factorial(n) / factorial(n - r) : 0;
  const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

  return (
    <CalculatorShell title="Combinations & Permutations" description="Calculate C(n,r) combinations and P(n,r) permutations.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div><label className="block text-sm text-muted mb-1">n (total items)</label><input type="number" value={v.n} onChange={e => setV({ n: e.target.value })} className={ic} /></div>
          <div><label className="block text-sm text-muted mb-1">r (items chosen)</label><input type="number" value={v.r} onChange={e => setV({ r: e.target.value })} className={ic} /></div>
        </div>
        {n > 30 && <p className="text-xs text-muted">Numbers above 30 may overflow. Use a big-number library for larger values.</p>}
        {valid && (
          <div className="space-y-3">
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="block text-sm text-muted">Combinations C({n},{r}) — order doesn&apos;t matter</span>
              <span className="block font-mono font-bold text-4xl text-primary">{C.toLocaleString()}</span>
              <span className="block text-xs font-mono text-muted">{n}! / ({r}! × {n - r}!)</span>
            </div>
            <div className="bg-background border border-card-border rounded-xl p-4 text-center">
              <span className="block text-sm text-muted">Permutations P({n},{r}) — order matters</span>
              <span className="block font-mono font-bold text-3xl">{P.toLocaleString()}</span>
              <span className="block text-xs font-mono text-muted">{n}! / {n - r}!</span>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center text-xs font-mono">
              {[{l:"n!",v:factorial(n).toLocaleString()},{l:`${r}!`,v:factorial(r).toLocaleString()},{l:`${n-r}!`,v:factorial(n-r).toLocaleString()}].map(i=>(
                <div key={i.l} className="px-3 py-2 bg-background border border-card-border rounded-lg">
                  <span className="block text-muted">{i.l}</span><span className="font-semibold">{i.v}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {r > n && <p className="text-xs text-danger">r cannot be greater than n.</p>}
      </div>
    </CalculatorShell>
  );
}
