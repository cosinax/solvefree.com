"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
const sel = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

function toRadians(val: number, unit: string): number {
  if (unit === "rad") return val;
  if (unit === "grad") return (val * Math.PI) / 200;
  return (val * Math.PI) / 180; // degrees
}

function fromRadians(rad: number, unit: string): number {
  if (unit === "rad") return rad;
  if (unit === "grad") return (rad * 200) / Math.PI;
  return (rad * 180) / Math.PI;
}

function fmt(n: number): string {
  if (!isFinite(n)) return "undefined";
  return parseFloat(n.toPrecision(10)).toString();
}

export default function TrigPage() {
  const [v, setV] = useHashState({
    mode: "forward",
    angle: "45",
    unit: "deg",
    ratio: "0.7071",
    invFn: "arcsin",
  });

  // FORWARD MODE
  const angleNum = parseFloat(v.angle);
  const radians = !isNaN(angleNum) ? toRadians(angleNum, v.unit) : NaN;
  const sinVal = !isNaN(radians) ? Math.sin(radians) : NaN;
  const cosVal = !isNaN(radians) ? Math.cos(radians) : NaN;
  const tanVal = !isNaN(radians) ? Math.tan(radians) : NaN;
  const cscVal = sinVal !== 0 ? 1 / sinVal : NaN;
  const secVal = cosVal !== 0 ? 1 / cosVal : NaN;
  const cotVal = tanVal !== 0 ? 1 / tanVal : NaN;

  // INVERSE MODE
  const ratioNum = parseFloat(v.ratio);
  let invRad: number = NaN;
  if (!isNaN(ratioNum)) {
    if (v.invFn === "arcsin" && ratioNum >= -1 && ratioNum <= 1) invRad = Math.asin(ratioNum);
    else if (v.invFn === "arccos" && ratioNum >= -1 && ratioNum <= 1) invRad = Math.acos(ratioNum);
    else if (v.invFn === "arctan") invRad = Math.atan(ratioNum);
  }
  const invDeg = isNaN(invRad) ? NaN : fromRadians(invRad, "deg");
  const invRad2 = isNaN(invRad) ? NaN : invRad;
  const invGrad = isNaN(invRad) ? NaN : fromRadians(invRad, "grad");

  const unitLabel: Record<string, string> = { deg: "degrees", rad: "radians", grad: "gradians" };

  const trigRows = !isNaN(radians)
    ? [
        ["sin", fmt(sinVal)],
        ["cos", fmt(cosVal)],
        ["tan", Math.abs(Math.cos(radians)) < 1e-12 ? "undefined" : fmt(tanVal)],
        ["csc (1/sin)", Math.abs(sinVal) < 1e-12 ? "undefined" : fmt(cscVal)],
        ["sec (1/cos)", Math.abs(cosVal) < 1e-12 ? "undefined" : fmt(secVal)],
        ["cot (1/tan)", Math.abs(tanVal) < 1e-12 ? "undefined" : fmt(cotVal)],
      ]
    : [];

  return (
    <CalculatorShell title="Trigonometry Calculator" description="Calculate all 6 trig functions for any angle, or find an angle from a ratio using inverse trig.">
      <div className="space-y-4">
        <div className="flex gap-2">
          <button
            onClick={() => setV({ mode: "forward" })}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors border ${v.mode === "forward" ? "bg-primary text-white border-primary" : "border-card-border hover:bg-primary-light"}`}
          >Forward (angle → ratios)</button>
          <button
            onClick={() => setV({ mode: "inverse" })}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors border ${v.mode === "inverse" ? "bg-primary text-white border-primary" : "border-card-border hover:bg-primary-light"}`}
          >Inverse (ratio → angle)</button>
        </div>

        {v.mode === "forward" ? (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-muted mb-1">Angle</label>
                <input type="number" value={v.angle} onChange={e => setV({ angle: e.target.value })} className={ic} step="any" />
              </div>
              <div>
                <label className="block text-sm text-muted mb-1">Unit</label>
                <select value={v.unit} onChange={e => setV({ unit: e.target.value })} className={sel}>
                  <option value="deg">Degrees (°)</option>
                  <option value="rad">Radians (rad)</option>
                  <option value="grad">Gradians (grad)</option>
                </select>
              </div>
            </div>

            {!isNaN(radians) && (
              <div className="space-y-3">
                <div className="bg-primary-light rounded-xl p-4 text-center">
                  <span className="text-xs text-muted block mb-1">
                    {fmt(angleNum)} {unitLabel[v.unit]} = {fmt(radians)} rad
                  </span>
                  <span className="block font-mono font-bold text-2xl text-primary">
                    sin = {fmt(sinVal)}
                  </span>
                </div>
                <div className="space-y-1 text-xs font-mono">
                  {trigRows.map(([fn, val]) => (
                    <div key={fn} className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded">
                      <span className="text-muted">{fn}</span>
                      <span className="font-semibold">{val}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-1 text-xs font-mono">
                  <p className="text-xs text-muted">Angle conversions:</p>
                  <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded">
                    <span className="text-muted">Degrees</span>
                    <span className="font-semibold">{fmt(fromRadians(radians, "deg"))}°</span>
                  </div>
                  <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded">
                    <span className="text-muted">Radians</span>
                    <span className="font-semibold">{fmt(radians)}</span>
                  </div>
                  <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded">
                    <span className="text-muted">Gradians</span>
                    <span className="font-semibold">{fmt(fromRadians(radians, "grad"))}</span>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-muted mb-1">Function</label>
                <select value={v.invFn} onChange={e => setV({ invFn: e.target.value })} className={sel}>
                  <option value="arcsin">arcsin (sin⁻¹)</option>
                  <option value="arccos">arccos (cos⁻¹)</option>
                  <option value="arctan">arctan (tan⁻¹)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-muted mb-1">
                  Ratio {v.invFn !== "arctan" ? "(-1 to 1)" : ""}
                </label>
                <input
                  type="number"
                  value={v.ratio}
                  onChange={e => setV({ ratio: e.target.value })}
                  className={ic}
                  step="any"
                  min={v.invFn !== "arctan" ? -1 : undefined}
                  max={v.invFn !== "arctan" ? 1 : undefined}
                />
              </div>
            </div>

            {!isNaN(invRad) ? (
              <div className="space-y-3">
                <div className="bg-primary-light rounded-xl p-4 text-center">
                  <span className="text-xs text-muted block mb-1">{v.invFn}({v.ratio})</span>
                  <span className="block font-mono font-bold text-3xl text-primary">{fmt(invDeg)}°</span>
                </div>
                <div className="space-y-1 text-xs font-mono">
                  <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded">
                    <span className="text-muted">Degrees</span>
                    <span className="font-semibold">{fmt(invDeg)}°</span>
                  </div>
                  <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded">
                    <span className="text-muted">Radians</span>
                    <span className="font-semibold">{fmt(invRad2)}</span>
                  </div>
                  <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded">
                    <span className="text-muted">Gradians</span>
                    <span className="font-semibold">{fmt(invGrad)}</span>
                  </div>
                </div>
              </div>
            ) : (
              !isNaN(ratioNum) && v.invFn !== "arctan" && (
                <div className="text-center text-sm text-danger font-medium">
                  Ratio must be between -1 and 1 for {v.invFn}.
                </div>
              )
            )}
          </>
        )}
      </div>
    </CalculatorShell>
  );
}
