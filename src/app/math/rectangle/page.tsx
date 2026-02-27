"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";
import { useMemo } from "react";

const inp = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm";

function fmt(n: number) {
  if (!isFinite(n) || isNaN(n)) return "—";
  return parseFloat(n.toPrecision(6)).toLocaleString("en-US", { maximumFractionDigits: 6 });
}

export default function RectanglePage() {
  const [v, setV] = useHashState({ length: "8", width: "5" });

  const l = parseFloat(v.length) || 0;
  const w = parseFloat(v.width) || 0;
  const valid = l > 0 && w > 0;

  const results = useMemo(() => {
    if (!valid) return null;
    const area = l * w;
    const perimeter = 2 * (l + w);
    const diagonal = Math.sqrt(l * l + w * w);
    return { area, perimeter, diagonal };
  }, [l, w, valid]);

  return (
    <CalculatorShell title="Rectangle Calculator" description="Calculate area, perimeter, and diagonal of a rectangle.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-muted mb-1">Length (l)</label>
            <input type="number" value={v.length} onChange={e => setV({ length: e.target.value })} className={inp} min="0" step="any" />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Width (w)</label>
            <input type="number" value={v.width} onChange={e => setV({ width: e.target.value })} className={inp} min="0" step="any" />
          </div>
        </div>

        {valid && results && (
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-primary-light border border-primary/20 rounded-lg text-center">
                <div className="text-xs text-muted mb-1">Area</div>
                <div className="font-mono font-bold text-xl text-primary">{fmt(results.area)}</div>
                <div className="text-xs text-muted mt-1">l × w</div>
              </div>
              <div className="p-3 bg-card border border-card-border rounded-lg text-center">
                <div className="text-xs text-muted mb-1">Perimeter</div>
                <div className="font-mono font-bold text-xl">{fmt(results.perimeter)}</div>
                <div className="text-xs text-muted mt-1">2(l + w)</div>
              </div>
              <div className="p-3 bg-card border border-card-border rounded-lg text-center">
                <div className="text-xs text-muted mb-1">Diagonal</div>
                <div className="font-mono font-bold text-xl">{fmt(results.diagonal)}</div>
                <div className="text-xs text-muted mt-1">√(l²+w²)</div>
              </div>
            </div>
            <div className="p-3 bg-card border border-card-border rounded-lg text-xs text-muted space-y-1">
              <p><strong>Area</strong> = {l} × {w} = {fmt(results.area)}</p>
              <p><strong>Perimeter</strong> = 2({l} + {w}) = {fmt(results.perimeter)}</p>
              <p><strong>Diagonal</strong> = √({l}² + {w}²) = √{fmt(l*l + w*w)} = {fmt(results.diagonal)}</p>
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
