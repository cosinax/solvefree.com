"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
const sel = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

const TRIPLES = [
  [3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25],
  [6, 8, 10], [9, 12, 15], [10, 24, 26], [20, 21, 29],
];

export default function PythagoreanPage() {
  const [v, setV] = useHashState({ unknown: "c", s1: "3", s2: "4" });

  const s1 = parseFloat(v.s1);
  const s2 = parseFloat(v.s2);
  const valid = !isNaN(s1) && !isNaN(s2) && s1 > 0 && s2 > 0;

  let a = 0, b = 0, c = 0;
  if (valid) {
    if (v.unknown === "c") { a = s1; b = s2; c = Math.sqrt(a * a + b * b); }
    else if (v.unknown === "a") { b = s1; c = s2; a = Math.sqrt(c * c - b * b); }
    else { a = s1; c = s2; b = Math.sqrt(c * c - a * a); }
  }

  const imaginary = valid && (isNaN(a) || isNaN(b) || isNaN(c) || a <= 0 || b <= 0 || c <= 0);
  const area = valid && !imaginary ? 0.5 * a * b : 0;
  const perim = valid && !imaginary ? a + b + c : 0;
  const angleA = valid && !imaginary ? Math.atan(a / b) * (180 / Math.PI) : 0;
  const angleB = valid && !imaginary ? Math.atan(b / a) * (180 / Math.PI) : 0;

  function fmt(n: number) { return parseFloat(n.toPrecision(8)).toString(); }

  const unknownLabel: Record<string, string> = { a: "Leg a", b: "Leg b", c: "Hypotenuse c" };
  const s1Label: Record<string, string> = { a: "Leg b", b: "Leg a", c: "Leg a" };
  const s2Label: Record<string, string> = { a: "Hypotenuse c", b: "Hypotenuse c", c: "Leg b" };

  return (
    <CalculatorShell title="Pythagorean Theorem Calculator" description="Find any side of a right triangle and compute angles, area, and perimeter.">
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-muted mb-1">Find the unknown</label>
          <select value={v.unknown} onChange={e => setV({ unknown: e.target.value })} className={sel}>
            <option value="c">Hypotenuse c (given legs a and b)</option>
            <option value="a">Leg a (given leg b and hypotenuse c)</option>
            <option value="b">Leg b (given leg a and hypotenuse c)</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-muted mb-1">{s1Label[v.unknown]}</label>
            <input type="number" value={v.s1} onChange={e => setV({ s1: e.target.value })} className={ic} min="0" step="any" />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">{s2Label[v.unknown]}</label>
            <input type="number" value={v.s2} onChange={e => setV({ s2: e.target.value })} className={ic} min="0" step="any" />
          </div>
        </div>

        {valid && imaginary && (
          <div className="text-center text-sm text-danger font-medium">
            The hypotenuse must be longer than each leg.
          </div>
        )}

        {valid && !imaginary && (
          <div className="space-y-3">
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="text-xs text-muted block mb-1">{unknownLabel[v.unknown]}</span>
              <span className="block font-mono font-bold text-4xl text-primary">
                {v.unknown === "c" ? fmt(c) : v.unknown === "a" ? fmt(a) : fmt(b)}
              </span>
              <span className="text-xs text-muted block mt-1">a² + b² = c² → {fmt(a)}² + {fmt(b)}² = {fmt(c)}²</span>
            </div>

            <div className="space-y-1 text-xs font-mono">
              <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded">
                <span className="text-muted">Leg a</span><span className="font-semibold">{fmt(a)}</span>
              </div>
              <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded">
                <span className="text-muted">Leg b</span><span className="font-semibold">{fmt(b)}</span>
              </div>
              <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded">
                <span className="text-muted">Hypotenuse c</span><span className="font-semibold">{fmt(c)}</span>
              </div>
              <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded">
                <span className="text-muted">Angle A (opposite a)</span><span className="font-semibold">{fmt(angleA)}°</span>
              </div>
              <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded">
                <span className="text-muted">Angle B (opposite b)</span><span className="font-semibold">{fmt(angleB)}°</span>
              </div>
              <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded">
                <span className="text-muted">Angle C</span><span className="font-semibold">90°</span>
              </div>
              <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded">
                <span className="text-muted">Area</span><span className="font-semibold">{fmt(area)}</span>
              </div>
              <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded">
                <span className="text-muted">Perimeter</span><span className="font-semibold">{fmt(perim)}</span>
              </div>
            </div>
          </div>
        )}

        <div>
          <p className="text-xs text-muted mb-1">Common Pythagorean triples:</p>
          <div className="grid grid-cols-4 gap-1 text-xs font-mono">
            {TRIPLES.map(([ta, tb, tc]) => (
              <button
                key={`${ta}-${tb}-${tc}`}
                onClick={() => setV({ unknown: "c", s1: ta.toString(), s2: tb.toString() })}
                className="px-2 py-1.5 bg-background border border-card-border rounded hover:bg-primary-light transition-colors text-center"
              >
                {ta},{tb},{tc}
              </button>
            ))}
          </div>
        </div>
      </div>
    </CalculatorShell>
  );
}
