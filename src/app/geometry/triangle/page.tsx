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

export default function TrianglePage() {
  const [v, setV] = useHashState({
    mode: "SSS",
    a: "5", b: "7", c: "8",
    A: "40", B: "60",
  });

  const result = useMemo(() => {
    try {
      const a = parseFloat(v.a), b = parseFloat(v.b), c = parseFloat(v.c);
      const A = parseFloat(v.A) * RAD, B = parseFloat(v.B) * RAD;

      let sides: [number, number, number] | null = null;
      let angles: [number, number, number] | null = null;

      if (v.mode === "SSS") {
        if (!isFinite(a) || !isFinite(b) || !isFinite(c) || a <= 0 || b <= 0 || c <= 0) return null;
        if (a + b <= c || a + c <= b || b + c <= a) return null;
        const cosA = (b * b + c * c - a * a) / (2 * b * c);
        const cosB = (a * a + c * c - b * b) / (2 * a * c);
        const angA = Math.acos(cosA);
        const angB = Math.acos(cosB);
        const angC = Math.PI - angA - angB;
        sides = [a, b, c];
        angles = [angA / RAD, angB / RAD, angC / RAD];
      } else if (v.mode === "SAS") {
        if (!isFinite(a) || !isFinite(b) || !isFinite(B)) return null;
        // sides a, b and included angle B
        const cSide = Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(B));
        const cosA = (b * b + cSide * cSide - a * a) / (2 * b * cSide);
        const angA = Math.acos(cosA);
        const angC = Math.PI - angA - B;
        sides = [a, b, cSide];
        angles = [angA / RAD, B / RAD, angC / RAD];
      } else if (v.mode === "ASA") {
        if (!isFinite(A) || !isFinite(B) || !isFinite(c)) return null;
        const angC = Math.PI - A - B;
        if (angC <= 0) return null;
        const sideA = c * Math.sin(A) / Math.sin(angC);
        const sideB = c * Math.sin(B) / Math.sin(angC);
        sides = [sideA, sideB, c];
        angles = [A / RAD, B / RAD, angC / RAD];
      } else {
        return null;
      }

      if (!sides || !angles) return null;
      const [sA, sB, sC] = sides;
      const [angA, angB, angC] = angles;
      const s = (sA + sB + sC) / 2;
      const area = Math.sqrt(s * (s - sA) * (s - sB) * (s - sC));
      const R = (sA * sB * sC) / (4 * area);
      const r = area / s;
      return { a: sA, b: sB, c: sC, A: angA, B: angB, C: angC, area, perimeter: sA + sB + sC, R, r };
    } catch {
      return null;
    }
  }, [v]);

  const modes = [
    { k: "SSS", l: "SSS (3 sides)" },
    { k: "SAS", l: "SAS (2 sides + angle)" },
    { k: "ASA", l: "ASA (2 angles + side)" },
  ];

  return (
    <CalculatorShell title="Triangle Calculator" description="Solve any triangle from SSS, SAS, or ASA. Finds all sides, angles, area, and circumradius.">
      <div className="space-y-4">
        <div>
          <label className="block text-xs text-muted mb-1">Known values</label>
          <select value={v.mode} onChange={e => setV({ mode: e.target.value })} className={inp}>
            {modes.map(m => <option key={m.k} value={m.k}>{m.l}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {(v.mode === "SSS" || v.mode === "SAS") && (
            <div>
              <label className="block text-xs text-muted mb-1">Side a</label>
              <input type="number" value={v.a} onChange={e => setV({ a: e.target.value })} className={inp} min="0" step="any" />
            </div>
          )}
          {(v.mode === "SSS" || v.mode === "SAS") && (
            <div>
              <label className="block text-xs text-muted mb-1">Side b</label>
              <input type="number" value={v.b} onChange={e => setV({ b: e.target.value })} className={inp} min="0" step="any" />
            </div>
          )}
          {(v.mode === "SSS" || v.mode === "ASA") && (
            <div>
              <label className="block text-xs text-muted mb-1">{v.mode === "ASA" ? "Side c" : "Side c"}</label>
              <input type="number" value={v.c} onChange={e => setV({ c: e.target.value })} className={inp} min="0" step="any" />
            </div>
          )}
          {(v.mode === "SAS" || v.mode === "ASA") && (
            <div>
              <label className="block text-xs text-muted mb-1">Angle A (°)</label>
              <input type="number" value={v.A} onChange={e => setV({ A: e.target.value })} className={inp} min="0" max="180" step="any" />
            </div>
          )}
          {v.mode === "ASA" && (
            <div>
              <label className="block text-xs text-muted mb-1">Angle B (°)</label>
              <input type="number" value={v.B} onChange={e => setV({ B: e.target.value })} className={inp} min="0" max="180" step="any" />
            </div>
          )}
          {v.mode === "SAS" && (
            <div>
              <label className="block text-xs text-muted mb-1">Included Angle B (°)</label>
              <input type="number" value={v.B} onChange={e => setV({ B: e.target.value })} className={inp} min="0" max="180" step="any" />
            </div>
          )}
        </div>

        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2 text-xs">
              {[
                { label: "Side a", value: fmt(result.a) },
                { label: "Side b", value: fmt(result.b) },
                { label: "Side c", value: fmt(result.c) },
                { label: "Angle A", value: fmt(result.A) + "°" },
                { label: "Angle B", value: fmt(result.B) + "°" },
                { label: "Angle C", value: fmt(result.C) + "°" },
                { label: "Area", value: fmt(result.area) },
                { label: "Perimeter", value: fmt(result.perimeter) },
                { label: "Circumradius R", value: fmt(result.R) },
                { label: "Inradius r", value: fmt(result.r) },
              ].map(r => (
                <div key={r.label} className={`p-2 border rounded text-center ${r.label === "Area" ? "bg-primary-light border-primary/20" : "bg-card border-card-border"}`}>
                  <div className="text-muted text-[10px]">{r.label}</div>
                  <div className={`font-mono font-semibold ${r.label === "Area" ? "text-primary" : ""}`}>{r.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
