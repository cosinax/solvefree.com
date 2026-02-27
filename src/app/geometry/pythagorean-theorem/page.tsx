"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";
import { useMemo } from "react";

const inp = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm";

function fmt(n: number, d = 5): string {
  if (!isFinite(n) || isNaN(n)) return "—";
  return parseFloat(n.toPrecision(d)).toString();
}

export default function PythagoreanTheoremPage() {
  const [v, setV] = useHashState({ mode: "c", a: "3", b: "4", c: "5" });

  const result = useMemo(() => {
    const a = parseFloat(v.a), b = parseFloat(v.b), c = parseFloat(v.c);
    if (v.mode === "c") {
      if (!isFinite(a) || !isFinite(b) || a <= 0 || b <= 0) return null;
      const hyp = Math.sqrt(a * a + b * b);
      return { a, b, c: hyp };
    } else if (v.mode === "a") {
      if (!isFinite(b) || !isFinite(c) || b <= 0 || c <= 0 || c <= b) return null;
      const leg = Math.sqrt(c * c - b * b);
      return { a: leg, b, c };
    } else {
      if (!isFinite(a) || !isFinite(c) || a <= 0 || c <= 0 || c <= a) return null;
      const leg = Math.sqrt(c * c - a * a);
      return { a, b: leg, c };
    }
  }, [v]);

  return (
    <CalculatorShell title="Pythagorean Theorem Calculator" description="a² + b² = c². Find any side of a right triangle from the other two.">
      <div className="space-y-4">
        <div>
          <label className="block text-xs text-muted mb-1">Solve for</label>
          <div className="flex gap-2">
            {[{ k: "c", l: "Hypotenuse c" }, { k: "a", l: "Leg a" }, { k: "b", l: "Leg b" }].map(m => (
              <button key={m.k} onClick={() => setV({ mode: m.k })}
                className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${v.mode === m.k ? "bg-primary text-white border-primary" : "bg-card border-card-border hover:bg-primary-light"}`}>
                {m.l}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {v.mode !== "a" && (
            <div>
              <label className="block text-xs text-muted mb-1">Leg a</label>
              <input type="number" value={v.a} onChange={e => setV({ a: e.target.value })} className={inp} min="0" step="any" />
            </div>
          )}
          {v.mode !== "b" && (
            <div>
              <label className="block text-xs text-muted mb-1">Leg b</label>
              <input type="number" value={v.b} onChange={e => setV({ b: e.target.value })} className={inp} min="0" step="any" />
            </div>
          )}
          {v.mode !== "c" && (
            <div>
              <label className="block text-xs text-muted mb-1">Hypotenuse c</label>
              <input type="number" value={v.c} onChange={e => setV({ c: e.target.value })} className={inp} min="0" step="any" />
            </div>
          )}
        </div>

        {result && (
          <div className="space-y-3">
            <div className="p-4 bg-primary-light border border-primary/20 rounded-lg text-center">
              <div className="text-xs text-muted mb-1">
                {v.mode === "c" ? "Hypotenuse c" : v.mode === "a" ? "Leg a" : "Leg b"}
              </div>
              <div className="font-mono font-bold text-3xl text-primary">
                {v.mode === "c" ? fmt(result.c) : v.mode === "a" ? fmt(result.a) : fmt(result.b)}
              </div>
            </div>
            <div className="p-3 bg-card border border-card-border rounded text-xs font-mono">
              <div className="text-muted mb-1">Verification: a² + b² = c²</div>
              <div>{fmt(result.a)}² + {fmt(result.b)}² = {fmt(result.c)}²</div>
              <div>{fmt(result.a * result.a, 6)} + {fmt(result.b * result.b, 6)} = {fmt(result.c * result.c, 6)}</div>
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
