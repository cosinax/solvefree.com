"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

function ParabolaSVG({ a, b, c, vertex_x, vertex_y, discriminant }: {
  a: number; b: number; c: number; vertex_x: number; vertex_y: number; discriminant: number;
}) {
  const W = 280, H = 200, PAD = 24;
  // Sample points to find y range
  const xs = Array.from({ length: 81 }, (_, i) => vertex_x + (i - 40) * 0.25);
  const ys = xs.map(x => a * x * x + b * x + c);
  const yMin = Math.min(...ys), yMax = Math.max(...ys);
  const xMin = xs[0], xMax = xs[xs.length - 1];
  const yRange = yMax - yMin || 1;
  const xRange = xMax - xMin || 1;

  function sx(x: number) { return PAD + ((x - xMin) / xRange) * (W - 2 * PAD); }
  function sy(y: number) { return H - PAD - ((y - yMin) / yRange) * (H - 2 * PAD); }

  const path = xs.map((x, i) => `${i === 0 ? "M" : "L"}${sx(x).toFixed(1)},${sy(ys[i]).toFixed(1)}`).join(" ");
  const axisY = sy(0);
  const axisX = sx(0);
  const vx = sx(vertex_x), vy = sy(vertex_y);

  // Root x positions
  const roots: number[] = [];
  if (discriminant >= 0) {
    roots.push((-b + Math.sqrt(Math.max(0, discriminant))) / (2 * a));
    if (discriminant > 0) roots.push((-b - Math.sqrt(discriminant)) / (2 * a));
  }

  return (
    <div className="bg-background border border-card-border rounded-lg overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 200 }}>
        {/* Axis lines */}
        {axisY >= PAD && axisY <= H - PAD && <line x1={PAD} y1={axisY} x2={W - PAD} y2={axisY} stroke="currentColor" strokeOpacity="0.15" strokeWidth="1" />}
        {axisX >= PAD && axisX <= W - PAD && <line x1={axisX} y1={PAD} x2={axisX} y2={H - PAD} stroke="currentColor" strokeOpacity="0.15" strokeWidth="1" />}
        {/* Axis of symmetry */}
        <line x1={vx} y1={PAD} x2={vx} y2={H - PAD} stroke="#6366f1" strokeOpacity="0.4" strokeWidth="1" strokeDasharray="4,3" />
        {/* Parabola */}
        <path d={path} fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" />
        {/* Vertex */}
        <circle cx={vx} cy={vy} r="4" fill="#6366f1" />
        {/* Roots */}
        {roots.map((rx, i) => {
          const rcx = sx(rx);
          if (rcx < PAD || rcx > W - PAD) return null;
          return <circle key={i} cx={rcx} cy={axisY >= PAD && axisY <= H - PAD ? axisY : sy(0)} r="4" fill="#22c55e" />;
        })}
      </svg>
      <div className="flex gap-4 px-3 pb-2 text-xs text-muted">
        <span className="flex items-center gap-1"><span className="inline-block w-2 h-2 rounded-full bg-[#6366f1]" /> vertex</span>
        {discriminant >= 0 && <span className="flex items-center gap-1"><span className="inline-block w-2 h-2 rounded-full bg-[#22c55e]" /> root{roots.length > 1 ? "s" : ""}</span>}
        <span className="flex items-center gap-1"><span className="inline-block w-3 border-t border-dashed border-[#6366f1]" /> axis of symmetry</span>
      </div>
    </div>
  );
}

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
            <ParabolaSVG a={a} b={b} c={c} vertex_x={vertex_x} vertex_y={vertex_y} discriminant={discriminant} />
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
