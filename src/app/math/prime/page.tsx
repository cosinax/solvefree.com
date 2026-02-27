"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

function isPrime(n: number): boolean {
  if (n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  for (let i = 3; i <= Math.sqrt(n); i += 2) if (n % i === 0) return false;
  return true;
}

function primeFactors(n: number): number[] {
  const factors: number[] = [];
  let d = 2;
  while (d * d <= n) {
    while (n % d === 0) { factors.push(d); n /= d; }
    d++;
  }
  if (n > 1) factors.push(n);
  return factors;
}

function nextPrimes(from: number, count: number): number[] {
  const primes: number[] = [];
  let n = from + 1;
  while (primes.length < count) { if (isPrime(n)) primes.push(n); n++; }
  return primes;
}

export default function PrimePage() {
  const [v, setV] = useHashState({ n: "97" });
  const n = parseInt(v.n);
  const valid = n >= 2 && n <= 1e9;
  const prime = valid ? isPrime(n) : false;
  const factors = valid && !prime && n <= 1e7 ? primeFactors(n) : [];
  const nextP = valid && n <= 1e8 ? nextPrimes(n, 5) : [];
  const ic = "w-full px-4 py-3 text-xl font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

  return (
    <CalculatorShell title="Prime Number Checker" description="Check if a number is prime, get its prime factorization, and find nearby primes.">
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-muted mb-1">Number</label>
          <input type="number" value={v.n} onChange={e => setV({ n: e.target.value })} className={ic} />
        </div>
        {valid && (
          <div className="space-y-3">
            <div className={`rounded-xl p-4 text-center ${prime ? "bg-primary-light" : "bg-background border border-card-border"}`}>
              <span className="block text-sm text-muted">{n.toLocaleString()} is</span>
              <span className={`block font-mono font-bold text-4xl ${prime ? "text-primary" : ""}`}>
                {prime ? "🔢 Prime" : "Not Prime"}
              </span>
            </div>
            {!prime && factors.length > 0 && (
              <div className="px-4 py-3 bg-background border border-card-border rounded-lg">
                <span className="text-sm text-muted block mb-1">Prime factorization:</span>
                <span className="font-mono font-bold">{n.toLocaleString()} = {factors.join(" × ")}</span>
              </div>
            )}
            {nextP.length > 0 && (
              <div className="px-4 py-3 bg-background border border-card-border rounded-lg">
                <span className="text-sm text-muted block mb-1">Next 5 primes:</span>
                <div className="flex flex-wrap gap-2">
                  {nextP.map(p => (
                    <button key={p} onClick={() => setV({ n: p.toString() })}
                      className="px-3 py-1 font-mono text-sm bg-primary-light rounded-lg hover:bg-primary hover:text-white transition-colors">{p.toLocaleString()}</button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        {!valid && v.n && <p className="text-xs text-danger">Enter a number between 2 and 1,000,000,000</p>}
        <div>
          <p className="text-xs text-muted font-semibold mb-1">Famous primes:</p>
          <div className="flex flex-wrap gap-2">
            {[2, 3, 5, 7, 11, 13, 97, 101, 1009, 7919, 104729].map(p => (
              <button key={p} onClick={() => setV({ n: p.toString() })}
                className="px-2 py-1 text-xs font-mono bg-background border border-card-border rounded hover:bg-primary-light">{p}</button>
            ))}
          </div>
        </div>
      </div>
    </CalculatorShell>
  );
}
