"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
const sc = "w-full px-3 py-2 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm";

export default function ForcePage() {
  const [v, setV] = useHashState({
    solveFor: "force",
    force: "",
    mass: "",
    accel: "",
    forceUnit: "N",
    massUnit: "kg",
    accelUnit: "m/s2",
  });

  const F = parseFloat(v.force);
  const m = parseFloat(v.mass);
  const a = parseFloat(v.accel);

  function toNewtons(val: number, unit: string): number {
    if (unit === "lbf") return val * 4.44822;
    if (unit === "kN") return val * 1000;
    return val;
  }
  function fromNewtons(val: number, unit: string): number {
    if (unit === "lbf") return val / 4.44822;
    if (unit === "kN") return val / 1000;
    return val;
  }
  function toKg(val: number, unit: string): number {
    if (unit === "lb") return val * 0.453592;
    if (unit === "g") return val / 1000;
    return val;
  }
  function fromKg(val: number, unit: string): number {
    if (unit === "lb") return val / 0.453592;
    if (unit === "g") return val * 1000;
    return val;
  }
  function toMs2(val: number, unit: string): number {
    if (unit === "ft/s2") return val * 0.3048;
    if (unit === "g") return val * 9.80665;
    return val;
  }
  function fromMs2(val: number, unit: string): number {
    if (unit === "ft/s2") return val / 0.3048;
    if (unit === "g") return val / 9.80665;
    return val;
  }

  let resultF: number | null = null;
  let resultM: number | null = null;
  let resultA: number | null = null;
  let weight: number | null = null;

  const FN = !isNaN(F) ? toNewtons(F, v.forceUnit) : NaN;
  const mKg = !isNaN(m) ? toKg(m, v.massUnit) : NaN;
  const aMs2 = !isNaN(a) ? toMs2(a, v.accelUnit) : NaN;

  if (v.solveFor === "force" && !isNaN(mKg) && !isNaN(aMs2)) {
    resultF = fromNewtons(mKg * aMs2, v.forceUnit);
    resultM = m;
    resultA = a;
    weight = fromNewtons(mKg * 9.80665, v.forceUnit);
  } else if (v.solveFor === "mass" && !isNaN(FN) && !isNaN(aMs2) && aMs2 !== 0) {
    resultM = fromKg(FN / aMs2, v.massUnit);
    resultF = F;
    resultA = a;
    weight = fromNewtons((FN / aMs2) * 9.80665, v.forceUnit);
  } else if (v.solveFor === "accel" && !isNaN(FN) && !isNaN(mKg) && mKg !== 0) {
    resultA = fromMs2(FN / mKg, v.accelUnit);
    resultF = F;
    resultM = m;
    weight = fromNewtons(mKg * 9.80665, v.forceUnit);
  }

  const hasResult = resultF !== null || resultM !== null || resultA !== null;

  const fmt = (n: number) => parseFloat(n.toPrecision(6)).toString();

  return (
    <CalculatorShell
      title="Force Calculator"
      description="Apply Newton's second law F = ma. Solve for force, mass, or acceleration. Also computes weight (W = mg)."
    >
      <div className="space-y-5">
        <div>
          <label className="block text-sm text-muted mb-1">Solve for</label>
          <select value={v.solveFor} onChange={e => setV({ solveFor: e.target.value })} className={sc}>
            <option value="force">Force (F)</option>
            <option value="mass">Mass (m)</option>
            <option value="accel">Acceleration (a)</option>
          </select>
        </div>

        {v.solveFor !== "force" && (
          <div>
            <label className="block text-sm text-muted mb-1">Force</label>
            <div className="flex gap-2">
              <input type="number" value={v.force} onChange={e => setV({ force: e.target.value })} placeholder="e.g. 10" className={ic} />
              <select value={v.forceUnit} onChange={e => setV({ forceUnit: e.target.value })} className="px-2 py-2 bg-background border border-card-border rounded-lg text-sm">
                <option>N</option>
                <option>kN</option>
                <option>lbf</option>
              </select>
            </div>
          </div>
        )}

        {v.solveFor !== "mass" && (
          <div>
            <label className="block text-sm text-muted mb-1">Mass</label>
            <div className="flex gap-2">
              <input type="number" value={v.mass} onChange={e => setV({ mass: e.target.value })} placeholder="e.g. 5" className={ic} />
              <select value={v.massUnit} onChange={e => setV({ massUnit: e.target.value })} className="px-2 py-2 bg-background border border-card-border rounded-lg text-sm">
                <option>kg</option>
                <option>g</option>
                <option>lb</option>
              </select>
            </div>
          </div>
        )}

        {v.solveFor !== "accel" && (
          <div>
            <label className="block text-sm text-muted mb-1">Acceleration</label>
            <div className="flex gap-2">
              <input type="number" value={v.accel} onChange={e => setV({ accel: e.target.value })} placeholder="e.g. 9.81" className={ic} />
              <select value={v.accelUnit} onChange={e => setV({ accelUnit: e.target.value })} className="px-2 py-2 bg-background border border-card-border rounded-lg text-sm">
                <option value="m/s2">m/s²</option>
                <option value="ft/s2">ft/s²</option>
                <option value="g">g</option>
              </select>
            </div>
          </div>
        )}

        {hasResult && (
          <div className="space-y-3">
            {v.solveFor === "force" && resultF !== null && (
              <div className="bg-primary-light rounded-xl p-4 text-center">
                <span className="block text-xs text-muted mb-1">Force</span>
                <span className="block font-mono font-bold text-4xl text-primary">{fmt(resultF)} {v.forceUnit}</span>
              </div>
            )}
            {v.solveFor === "mass" && resultM !== null && (
              <div className="bg-primary-light rounded-xl p-4 text-center">
                <span className="block text-xs text-muted mb-1">Mass</span>
                <span className="block font-mono font-bold text-4xl text-primary">{fmt(resultM)} {v.massUnit}</span>
              </div>
            )}
            {v.solveFor === "accel" && resultA !== null && (
              <div className="bg-primary-light rounded-xl p-4 text-center">
                <span className="block text-xs text-muted mb-1">Acceleration</span>
                <span className="block font-mono font-bold text-4xl text-primary">{fmt(resultA)} {v.accelUnit === "m/s2" ? "m/s²" : v.accelUnit === "ft/s2" ? "ft/s²" : v.accelUnit}</span>
              </div>
            )}

            <div className="space-y-1">
              {weight !== null && (
                <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
                  <span className="text-muted">Weight (W = mg, g=9.81)</span>
                  <span>{fmt(weight)} {v.forceUnit}</span>
                </div>
              )}
              {resultF !== null && (
                <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
                  <span className="text-muted">Force in Newtons</span>
                  <span>{fmt(toNewtons(resultF, v.forceUnit))} N</span>
                </div>
              )}
              {resultF !== null && (
                <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
                  <span className="text-muted">Force in lbf</span>
                  <span>{fmt(toNewtons(resultF, v.forceUnit) / 4.44822)} lbf</span>
                </div>
              )}
              <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
                <span className="text-muted">Formula</span>
                <span>F = m × a</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
