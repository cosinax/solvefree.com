"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
const sel = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

const DEG = Math.PI / 180;

function lawOfCosines(a: number, b: number, C: number): number {
  // c² = a² + b² - 2ab cos(C)
  return Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(C * DEG));
}

function lawOfSinesAngle(a: number, A: number, b: number): number {
  // sin(B)/b = sin(A)/a  ->  B = arcsin(b*sin(A)/a)
  return Math.asin((b * Math.sin(A * DEG)) / a) / DEG;
}

interface Triangle { a: number; b: number; c: number; A: number; B: number; C: number; }

function solveTriangle(mode: string, vals: Record<string, string>): Triangle | null {
  const p = (k: string) => parseFloat(vals[k]);
  try {
    let a: number, b: number, c: number, A: number, B: number, C: number;
    if (mode === "SSS") {
      a = p("a"); b = p("b"); c = p("c");
      if ([a, b, c].some(x => isNaN(x) || x <= 0)) return null;
      A = Math.acos((b * b + c * c - a * a) / (2 * b * c)) / DEG;
      B = Math.acos((a * a + c * c - b * b) / (2 * a * c)) / DEG;
      C = 180 - A - B;
    } else if (mode === "SAS") {
      a = p("a"); C = p("C"); b = p("b");
      if ([a, C, b].some(x => isNaN(x) || x <= 0)) return null;
      c = lawOfCosines(a, b, C);
      A = Math.acos((b * b + c * c - a * a) / (2 * b * c)) / DEG;
      B = 180 - A - C;
    } else if (mode === "ASA") {
      A = p("A"); c = p("c"); B = p("B");
      if ([A, c, B].some(x => isNaN(x) || x <= 0)) return null;
      C = 180 - A - B;
      a = (c * Math.sin(A * DEG)) / Math.sin(C * DEG);
      b = (c * Math.sin(B * DEG)) / Math.sin(C * DEG);
    } else if (mode === "AAS") {
      A = p("A"); B = p("B"); a = p("a");
      if ([A, B, a].some(x => isNaN(x) || x <= 0)) return null;
      C = 180 - A - B;
      b = (a * Math.sin(B * DEG)) / Math.sin(A * DEG);
      c = (a * Math.sin(C * DEG)) / Math.sin(A * DEG);
    } else if (mode === "SSA") {
      a = p("a"); b = p("b"); A = p("A");
      if ([a, b, A].some(x => isNaN(x) || x <= 0)) return null;
      const sinB = (b * Math.sin(A * DEG)) / a;
      if (Math.abs(sinB) > 1) return null;
      B = Math.asin(sinB) / DEG;
      C = 180 - A - B;
      c = (a * Math.sin(C * DEG)) / Math.sin(A * DEG);
    } else return null;

    if ([a!, b!, c!, A!, B!, C!].some(x => isNaN(x) || x <= 0)) return null;
    if (Math.abs(A! + B! + C! - 180) > 0.01) return null;
    return { a: a!, b: b!, c: c!, A: A!, B: B!, C: C! };
  } catch {
    return null;
  }
}

const modeFields: Record<string, Array<{ key: string; label: string }>> = {
  SSS: [{ key: "a", label: "Side a" }, { key: "b", label: "Side b" }, { key: "c", label: "Side c" }],
  SAS: [{ key: "a", label: "Side a" }, { key: "C", label: "Angle C (°)" }, { key: "b", label: "Side b" }],
  ASA: [{ key: "A", label: "Angle A (°)" }, { key: "c", label: "Side c" }, { key: "B", label: "Angle B (°)" }],
  AAS: [{ key: "A", label: "Angle A (°)" }, { key: "B", label: "Angle B (°)" }, { key: "a", label: "Side a" }],
  SSA: [{ key: "a", label: "Side a" }, { key: "b", label: "Side b" }, { key: "A", label: "Angle A (°)" }],
};

export default function TrianglePage() {
  const [v, setV] = useHashState({ mode: "SSS", a: "3", b: "4", c: "5", A: "30", B: "60", C: "90" });

  const fields = modeFields[v.mode] || modeFields["SSS"];
  const tri = solveTriangle(v.mode, v);

  function fmt(n: number) { return parseFloat(n.toPrecision(7)).toString(); }
  function fmtA(n: number) { return parseFloat(n.toPrecision(6)).toString() + "°"; }

  function triType(): string {
    if (!tri) return "";
    const sides = [tri.a, tri.b, tri.c];
    const angles = [tri.A, tri.B, tri.C];
    const sideType = sides[0] === sides[1] && sides[1] === sides[2] ? "Equilateral"
      : sides[0] === sides[1] || sides[1] === sides[2] || sides[0] === sides[2] ? "Isosceles"
      : "Scalene";
    const angleType = angles.some(a => Math.abs(a - 90) < 0.01) ? "Right"
      : angles.some(a => a > 90) ? "Obtuse"
      : "Acute";
    return `${angleType}, ${sideType}`;
  }

  const area = tri ? 0.5 * tri.a * tri.b * Math.sin(tri.C * DEG) : 0;
  const perim = tri ? tri.a + tri.b + tri.c : 0;

  return (
    <CalculatorShell title="Triangle Solver" description="Solve any triangle given three known values (SSS, SAS, ASA, AAS, SSA).">
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-muted mb-1">Mode</label>
          <select value={v.mode} onChange={e => setV({ mode: e.target.value })} className={sel}>
            <option value="SSS">SSS — Three sides</option>
            <option value="SAS">SAS — Two sides, included angle</option>
            <option value="ASA">ASA — Two angles, included side</option>
            <option value="AAS">AAS — Two angles, non-included side</option>
            <option value="SSA">SSA — Two sides, non-included angle</option>
          </select>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {fields.map(f => (
            <div key={f.key}>
              <label className="block text-sm text-muted mb-1">{f.label}</label>
              <input type="number" value={v[f.key as keyof typeof v] ?? ""} onChange={e => setV({ [f.key]: e.target.value } as any)} className={ic} min="0" step="any" />
            </div>
          ))}
        </div>

        {tri && (
          <div className="space-y-3">
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="text-xs text-muted block mb-1">Triangle Type</span>
              <span className="block font-mono font-bold text-2xl text-primary">{triType()}</span>
            </div>

            <div className="space-y-1 text-xs font-mono">
              {[
                ["Side a", fmt(tri.a)], ["Side b", fmt(tri.b)], ["Side c", fmt(tri.c)],
                ["Angle A", fmtA(tri.A)], ["Angle B", fmtA(tri.B)], ["Angle C", fmtA(tri.C)],
                ["Area", fmt(area)], ["Perimeter", fmt(perim)],
              ].map(([l, val]) => (
                <div key={l} className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded">
                  <span className="text-muted">{l}</span>
                  <span className="font-semibold">{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {!tri && (
          <div className="text-center text-sm text-muted">Enter valid inputs to solve the triangle.</div>
        )}
      </div>
    </CalculatorShell>
  );
}
