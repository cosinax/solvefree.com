"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";
import { useMemo } from "react";

const inp = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm";
const RAD = Math.PI / 180;

function fmt(n: number, d = 5): string {
  if (!isFinite(n) || isNaN(n)) return "—";
  return parseFloat(n.toPrecision(d)).toString();
}

export default function ParallelogramPage() {
  const [v, setV] = useHashState({ a: "8", b: "5", angle: "60" });

  const result = useMemo(() => {
    const a = parseFloat(v.a);
    const b = parseFloat(v.b);
    const angle = parseFloat(v.angle);
    if (!isFinite(a) || !isFinite(b) || !isFinite(angle) || a <= 0 || b <= 0) return null;
    const theta = angle * RAD;
    const area = a * b * Math.sin(theta);
    const perimeter = 2 * (a + b);
    const height = b * Math.sin(theta);
    const d1 = Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(theta));
    const d2 = Math.sqrt(a * a + b * b + 2 * a * b * Math.cos(theta));
    return { area, perimeter, height, d1, d2 };
  }, [v]);

  return (
    <CalculatorShell title="Parallelogram Calculator" description="Area, perimeter, height, and diagonals of a parallelogram.">
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs text-muted mb-1">Side a</label>
            <input type="number" value={v.a} onChange={e => setV({ a: e.target.value })} className={inp} min="0" step="any" />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Side b</label>
            <input type="number" value={v.b} onChange={e => setV({ b: e.target.value })} className={inp} min="0" step="any" />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Angle (°)</label>
            <input type="number" value={v.angle} onChange={e => setV({ angle: e.target.value })} className={inp} min="0" max="180" step="any" />
          </div>
        </div>

        {result && (
          <div className="grid grid-cols-3 gap-2 text-xs">
            {[
              { label: "Area", value: fmt(result.area) },
              { label: "Perimeter", value: fmt(result.perimeter) },
              { label: "Height (h)", value: fmt(result.height) },
              { label: "Diagonal d₁", value: fmt(result.d1) },
              { label: "Diagonal d₂", value: fmt(result.d2) },
            ].map(r => (
              <div key={r.label} className={`p-2 border rounded text-center ${r.label === "Area" ? "bg-primary-light border-primary/20" : "bg-card border-card-border"}`}>
                <div className="text-muted text-[10px]">{r.label}</div>
                <div className={`font-mono font-semibold ${r.label === "Area" ? "text-primary" : ""}`}>{r.value}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
