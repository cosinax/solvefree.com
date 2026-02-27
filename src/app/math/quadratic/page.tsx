"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

export default function QuadraticPage() {
  const [v, setV] = useHashState({ a: "1", b: "-5", c: "6" });
  const a = parseFloat(v.a), b = parseFloat(v.b), c = parseFloat(v.c);
  const valid = !isNaN(a) && !isNaN(b) && !isNaN(c) && a !== 0;
  const discriminant = b * b - 4 * a * c;
  const vertex_x = -b / (2 * a);
  const vertex_y = a * vertex_x * vertex_x + b * vertex_x + c;
  const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

  let x1: string, x2: string;
  if (discriminant > 0) {
    x1 = ((-b + Math.sqrt(discriminant)) / (2 * a)).toFixed(6).replace(/\.?0+$/, "");
    x2 = ((-b - Math.sqrt(discriminant)) / (2 * a)).toFixed(6).replace(/\.?0+$/, "");
  } else if (discriminant === 0) {
    x1 = x2 = (-b / (2 * a)).toFixed(6).replace(/\.?0+$/, "");
  } else {
    const real = (-b / (2 * a)).toFixed(4);
    const imag = (Math.sqrt(-discriminant) / (2 * a)).toFixed(4);
    x1 = `${real} + ${imag}i`;
    x2 = `${real} − ${imag}i`;
  }

  return (
    <CalculatorShell title="Quadratic Formula" description="Solve ax² + bx + c = 0. Find roots, discriminant, and vertex.">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <input type="number" value={v.a} onChange={e => setV({ a: e.target.value })} className="w-20 px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-center" />
          <span className="text-sm text-muted font-mono">x² +</span>
          <input type="number" value={v.b} onChange={e => setV({ b: e.target.value })} className="w-20 px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-center" />
          <span className="text-sm text-muted font-mono">x +</span>
          <input type="number" value={v.c} onChange={e => setV({ c: e.target.value })} className="w-20 px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-center" />
          <span className="text-sm text-muted font-mono">= 0</span>
        </div>
        {a === 0 && <p className="text-xs text-danger">Coefficient a cannot be 0 (would be linear, not quadratic)</p>}
        {valid && (
          <div className="space-y-3">
            <div className={`rounded-xl p-4 text-center ${discriminant < 0 ? "bg-orange-50 dark:bg-orange-950" : "bg-primary-light"}`}>
              <span className="block text-sm text-muted">Discriminant (b²−4ac)</span>
              <span className={`block font-mono font-bold text-3xl ${discriminant < 0 ? "text-orange-600" : discriminant === 0 ? "text-muted" : "text-primary"}`}>{discriminant.toFixed(4).replace(/\.?0+$/, "")}</span>
              <span className="block text-xs text-muted mt-1">
                {discriminant > 0 ? "2 real roots" : discriminant === 0 ? "1 real root (repeated)" : "2 complex roots"}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="px-4 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">x₁</span>
                <span className="font-mono font-bold">{x1}</span>
              </div>
              <div className="px-4 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">x₂</span>
                <span className="font-mono font-bold">{x2}</span>
              </div>
            </div>
            <div className="px-4 py-3 bg-background border border-card-border rounded-lg">
              <span className="text-xs text-muted block mb-0.5">Vertex (h, k)</span>
              <span className="font-mono font-semibold">({vertex_x.toFixed(4).replace(/\.?0+$/,"")}, {vertex_y.toFixed(4).replace(/\.?0+$/,"")})</span>
              <span className="text-xs text-muted ml-2">— {a > 0 ? "minimum" : "maximum"}</span>
            </div>
            <div className="px-4 py-3 bg-background border border-card-border rounded-lg text-xs font-mono text-muted">
              x = (−{b} ± √{discriminant.toFixed(2).replace(/\.?0+$/, "")}) / {2 * a}
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
