"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";
import { useMemo } from "react";

const inp = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm";

function fmt(n: number, d = 5): string {
  if (!isFinite(n) || isNaN(n)) return "—";
  return parseFloat(n.toPrecision(d)).toString();
}

export default function TrapezoidPage() {
  const [v, setV] = useHashState({ a: "8", b: "5", h: "4", c: "3", d: "3" });

  const result = useMemo(() => {
    const a = parseFloat(v.a); // parallel base 1
    const b = parseFloat(v.b); // parallel base 2
    const h = parseFloat(v.h); // height
    const c = parseFloat(v.c); // leg 1
    const d2 = parseFloat(v.d); // leg 2
    if (!isFinite(a) || !isFinite(b) || !isFinite(h) || a <= 0 || b <= 0 || h <= 0) return null;

    const area = 0.5 * (a + b) * h;
    const perimeter = isFinite(c) && isFinite(d2) && c > 0 && d2 > 0 ? a + b + c + d2 : NaN;
    const median = (a + b) / 2;

    return { area, perimeter, median };
  }, [v]);

  return (
    <CalculatorShell title="Trapezoid Calculator" description="Area, perimeter, and median of a trapezoid.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-muted mb-1">Base a (longer)</label>
            <input type="number" value={v.a} onChange={e => setV({ a: e.target.value })} className={inp} min="0" step="any" />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Base b (shorter)</label>
            <input type="number" value={v.b} onChange={e => setV({ b: e.target.value })} className={inp} min="0" step="any" />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Height h</label>
            <input type="number" value={v.h} onChange={e => setV({ h: e.target.value })} className={inp} min="0" step="any" />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Leg c (optional)</label>
            <input type="number" value={v.c} onChange={e => setV({ c: e.target.value })} className={inp} min="0" step="any" />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Leg d (optional)</label>
            <input type="number" value={v.d} onChange={e => setV({ d: e.target.value })} className={inp} min="0" step="any" />
          </div>
        </div>

        {result && (
          <div className="grid grid-cols-3 gap-2 text-xs">
            {[
              { label: "Area", value: fmt(result.area) },
              { label: "Perimeter", value: fmt(result.perimeter) },
              { label: "Median", value: fmt(result.median) },
            ].map(r => (
              <div key={r.label} className={`p-3 border rounded text-center ${r.label === "Area" ? "bg-primary-light border-primary/20" : "bg-card border-card-border"}`}>
                <div className="text-muted text-[10px]">{r.label}</div>
                <div className={`font-mono font-bold text-lg ${r.label === "Area" ? "text-primary" : ""}`}>{r.value}</div>
              </div>
            ))}
          </div>
        )}
        <p className="text-xs text-muted">Area = ½ × (a + b) × h · Median (midsegment) = (a + b) / 2</p>
      </div>
    </CalculatorShell>
  );
}
