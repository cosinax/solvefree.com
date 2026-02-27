"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

export default function NumberPropertiesPage() {
  const [v, setV] = useHashState({ n: "360" });
  const n = parseInt(v.n);
  const valid = n >= 1 && n <= 1e8;

  function isPrime(x: number): boolean {
    if (x < 2) return false;
    for (let i = 2; i <= Math.sqrt(x); i++) if (x % i === 0) return false;
    return true;
  }
  function getDivisors(x: number): number[] {
    const d: number[] = [];
    for (let i = 1; i <= Math.sqrt(x); i++) {
      if (x % i === 0) { d.push(i); if (i !== x / i) d.push(x / i); }
    }
    return d.sort((a, b) => a - b);
  }
  function isPerfect(x: number): boolean {
    const d = getDivisors(x).filter(d => d < x);
    return d.reduce((a, b) => a + b, 0) === x;
  }
  function isAbundant(x: number): boolean {
    const d = getDivisors(x).filter(d => d < x);
    return d.reduce((a, b) => a + b, 0) > x;
  }
  function toBinary(x: number): string { return x.toString(2); }
  function toHex(x: number): string { return x.toString(16).toUpperCase(); }
  function toOctal(x: number): string { return x.toString(8); }

  const divisors = valid ? getDivisors(n) : [];
  const prime = valid ? isPrime(n) : false;
  const perfect = valid && n <= 1e7 ? isPerfect(n) : false;
  const abundant = valid && n <= 1e7 ? isAbundant(n) : false;
  const ic = "w-full px-4 py-3 text-xl font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

  return (
    <CalculatorShell title="Number Properties" description="Divisors, prime status, bases, and mathematical properties of any integer.">
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-muted mb-1">Number</label>
          <input type="number" value={v.n} onChange={e => setV({ n: e.target.value })} className={ic} />
        </div>
        {valid && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              {[["Binary", toBinary(n)], ["Octal", toOctal(n)], ["Decimal", n.toLocaleString()], ["Hexadecimal", "0x" + toHex(n)]].map(([l, val]) => (
                <div key={l} className="flex justify-between px-3 py-2 bg-background border border-card-border rounded-lg">
                  <span className="text-muted">{l}</span><span className="font-semibold">{val}</span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className={`px-3 py-2 rounded-lg text-center border ${prime ? "bg-primary-light border-primary/30" : "bg-background border-card-border"}`}>
                <span className="block text-muted">Prime</span>
                <span className="font-semibold">{prime ? "✓ Yes" : "No"}</span>
              </div>
              <div className={`px-3 py-2 rounded-lg text-center border ${perfect ? "bg-primary-light border-primary/30" : "bg-background border-card-border"}`}>
                <span className="block text-muted">Perfect</span>
                <span className="font-semibold">{perfect ? "✓ Yes" : "No"}</span>
              </div>
              <div className={`px-3 py-2 rounded-lg text-center border ${abundant ? "bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800" : "bg-background border-card-border"}`}>
                <span className="block text-muted">Abundant</span>
                <span className="font-semibold">{abundant ? "✓ Yes" : "No"}</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {[["Divisors", divisors.length], ["Digit sum", n.toString().split("").reduce((a, d) => a + parseInt(d), 0)], ["Sqrt", Math.sqrt(n).toFixed(4)]].map(([l, val]) => (
                <div key={l as string} className="px-3 py-2 bg-background border border-card-border rounded-lg text-center">
                  <span className="block text-muted">{l as string}</span><span className="font-semibold font-mono">{val}</span>
                </div>
              ))}
            </div>
            {divisors.length <= 48 && (
              <div>
                <p className="text-xs text-muted mb-1">All {divisors.length} divisors:</p>
                <div className="flex flex-wrap gap-1">
                  {divisors.map(d => <span key={d} className="px-2 py-0.5 text-xs font-mono bg-background border border-card-border rounded">{d}</span>)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
