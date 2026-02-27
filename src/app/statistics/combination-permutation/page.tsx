"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";
import { useMemo } from "react";

const inp = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm";

function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) return NaN;
  if (n > 170) return Infinity;
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

function combination(n: number, r: number): number {
  if (r < 0 || r > n) return 0;
  if (r === 0 || r === n) return 1;
  // Use logs to avoid overflow
  if (n > 170) {
    let logResult = 0;
    for (let i = 0; i < r; i++) logResult += Math.log(n - i) - Math.log(i + 1);
    return Math.exp(logResult);
  }
  return factorial(n) / (factorial(r) * factorial(n - r));
}

function permutation(n: number, r: number): number {
  if (r < 0 || r > n) return 0;
  if (n > 170) {
    let result = 1;
    for (let i = 0; i < r; i++) result *= (n - i);
    return result;
  }
  return factorial(n) / factorial(n - r);
}

function fmt(n: number): string {
  if (!isFinite(n) || isNaN(n)) return "—";
  if (n >= 1e15) return n.toExponential(4);
  return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

export default function CombinationPermutationPage() {
  const [v, setV] = useHashState({ n: "10", r: "3" });

  const result = useMemo(() => {
    const n = parseInt(v.n);
    const r = parseInt(v.r);
    if (!Number.isInteger(n) || !Number.isInteger(r) || n < 0 || r < 0) return null;
    const C = combination(n, r);
    const P = permutation(n, r);
    const factN = n <= 20 ? fmt(factorial(n)) : n + "!";
    const factR = r <= 20 ? fmt(factorial(r)) : r + "!";
    const factNR = (n - r) >= 0 && (n - r) <= 20 ? fmt(factorial(n - r)) : (n - r) + "!";
    return { n, r, C, P, factN, factR, factNR };
  }, [v]);

  return (
    <CalculatorShell title="Combination & Permutation Calculator" description="Count ways to choose r items from n — ordered (permutation) or unordered (combination).">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-muted mb-1">Total items (n)</label>
            <input type="number" value={v.n} onChange={e => setV({ n: e.target.value })} className={inp} min="0" step="1" />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Choose (r)</label>
            <input type="number" value={v.r} onChange={e => setV({ r: e.target.value })} className={inp} min="0" step="1" />
          </div>
        </div>

        {result && result.n >= result.r && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-primary-light border border-primary/20 rounded-lg text-center">
                <div className="text-xs text-muted mb-1">Combination C({result.n},{result.r})</div>
                <div className="font-mono font-bold text-3xl text-primary">{fmt(result.C)}</div>
                <div className="text-xs text-muted mt-1 font-mono">n! / (r!(n−r)!)</div>
              </div>
              <div className="p-4 bg-card border border-card-border rounded-lg text-center">
                <div className="text-xs text-muted mb-1">Permutation P({result.n},{result.r})</div>
                <div className="font-mono font-bold text-3xl">{fmt(result.P)}</div>
                <div className="text-xs text-muted mt-1 font-mono">n! / (n−r)!</div>
              </div>
            </div>
            <div className="p-3 bg-card border border-card-border rounded text-xs text-muted space-y-1">
              <p>n! = {result.factN}</p>
              <p>r! = {result.factR}</p>
              <p>(n−r)! = {result.factNR}</p>
            </div>
            <div className="p-3 bg-card border border-card-border rounded text-xs text-muted">
              <p className="mb-1"><strong>Combination</strong>: Order doesn&apos;t matter. Selecting a committee of {result.r} from {result.n} people → {fmt(result.C)} ways</p>
              <p><strong>Permutation</strong>: Order matters. Arranging {result.r} items from {result.n} → {fmt(result.P)} ways</p>
            </div>
          </div>
        )}

        {result && result.n < result.r && (
          <p className="text-sm text-red-500">r must be ≤ n.</p>
        )}
      </div>
    </CalculatorShell>
  );
}
