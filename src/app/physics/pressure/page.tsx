"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
const sc = "w-full px-3 py-2 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm";

type PressureUnit = "Pa" | "kPa" | "MPa" | "psi" | "bar" | "atm" | "mmHg" | "inHg";

function toPa(val: number, unit: PressureUnit): number {
  switch (unit) {
    case "kPa": return val * 1000;
    case "MPa": return val * 1e6;
    case "psi": return val * 6894.76;
    case "bar": return val * 100000;
    case "atm": return val * 101325;
    case "mmHg": return val * 133.322;
    case "inHg": return val * 3386.39;
    default: return val;
  }
}

function fromPa(val: number, unit: PressureUnit): number {
  switch (unit) {
    case "kPa": return val / 1000;
    case "MPa": return val / 1e6;
    case "psi": return val / 6894.76;
    case "bar": return val / 100000;
    case "atm": return val / 101325;
    case "mmHg": return val / 133.322;
    case "inHg": return val / 3386.39;
    default: return val;
  }
}

const PRESSURE_UNITS: PressureUnit[] = ["Pa", "kPa", "MPa", "psi", "bar", "atm", "mmHg", "inHg"];

export default function PressurePage() {
  const [v, setV] = useHashState({
    solveFor: "pressure",
    pressure: "",
    force: "",
    area: "",
    pressureUnit: "Pa",
    // Fluid pressure
    density: "",
    gravity: "9.81",
    height: "",
    fluidUnit: "Pa",
  });

  const P = parseFloat(v.pressure);
  const F = parseFloat(v.force);
  const A = parseFloat(v.area);

  const PPa = !isNaN(P) ? toPa(P, v.pressureUnit as PressureUnit) : NaN;
  const unit = v.pressureUnit as PressureUnit;
  const fmt = (n: number) => parseFloat(fromPa(n, unit).toPrecision(5)).toString();

  let resultP: number | null = null;
  let resultF: number | null = null;
  let resultA: number | null = null;

  if (v.solveFor === "pressure" && !isNaN(F) && !isNaN(A) && A !== 0) {
    // force in N / area in m² = Pa, then convert
    const paResult = F / A;
    resultP = parseFloat(fromPa(paResult, unit).toPrecision(5));
  } else if (v.solveFor === "force" && !isNaN(PPa) && !isNaN(A)) {
    resultF = parseFloat((PPa * A).toPrecision(5));
  } else if (v.solveFor === "area" && !isNaN(PPa) && !isNaN(F) && PPa !== 0) {
    resultA = parseFloat((F / PPa).toPrecision(5));
  }

  // Fluid pressure
  const rho = parseFloat(v.density);
  const g = parseFloat(v.gravity) || 9.81;
  const h = parseFloat(v.height);
  let fluidPa: number | null = null;
  if (!isNaN(rho) && !isNaN(h)) {
    fluidPa = rho * g * h;
  }
  const fluidUnit = v.fluidUnit as PressureUnit;

  const hasResult = resultP !== null || resultF !== null || resultA !== null;

  return (
    <CalculatorShell
      title="Pressure Calculator"
      description="Solve P = F/A for pressure, force, or area. Also calculates fluid pressure P = ρgh."
    >
      <div className="space-y-6">
        {/* P = F/A section */}
        <div className="border border-card-border rounded-xl p-4 space-y-4">
          <h3 className="text-sm font-semibold">P = F / A</h3>
          <div>
            <label className="block text-sm text-muted mb-1">Solve for</label>
            <select value={v.solveFor} onChange={e => setV({ solveFor: e.target.value })} className={sc}>
              <option value="pressure">Pressure (P)</option>
              <option value="force">Force (F)</option>
              <option value="area">Area (A)</option>
            </select>
          </div>

          {v.solveFor !== "pressure" && (
            <div>
              <label className="block text-sm text-muted mb-1">Pressure</label>
              <div className="flex gap-2">
                <input type="number" value={v.pressure} onChange={e => setV({ pressure: e.target.value })} placeholder="e.g. 101325" className={ic} />
                <select value={v.pressureUnit} onChange={e => setV({ pressureUnit: e.target.value })} className="px-2 py-2 bg-background border border-card-border rounded-lg text-sm">
                  {PRESSURE_UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>
          )}

          {v.solveFor !== "force" && (
            <div>
              <label className="block text-sm text-muted mb-1">Force (N)</label>
              <input type="number" value={v.force} onChange={e => setV({ force: e.target.value })} placeholder="e.g. 100" className={ic} />
            </div>
          )}

          {v.solveFor !== "area" && (
            <div>
              <label className="block text-sm text-muted mb-1">Area (m²)</label>
              <input type="number" value={v.area} onChange={e => setV({ area: e.target.value })} placeholder="e.g. 0.01" className={ic} />
            </div>
          )}

          {v.solveFor === "pressure" && (
            <div>
              <label className="block text-sm text-muted mb-1">Output unit</label>
              <select value={v.pressureUnit} onChange={e => setV({ pressureUnit: e.target.value })} className={sc}>
                {PRESSURE_UNITS.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          )}

          {hasResult && (
            <div className="space-y-3">
              {v.solveFor === "pressure" && resultP !== null && (
                <div className="bg-primary-light rounded-xl p-4 text-center">
                  <span className="block text-xs text-muted mb-1">Pressure</span>
                  <span className="block font-mono font-bold text-4xl text-primary">{resultP} {v.pressureUnit}</span>
                </div>
              )}
              {v.solveFor === "force" && resultF !== null && (
                <div className="bg-primary-light rounded-xl p-4 text-center">
                  <span className="block text-xs text-muted mb-1">Force</span>
                  <span className="block font-mono font-bold text-4xl text-primary">{resultF} N</span>
                </div>
              )}
              {v.solveFor === "area" && resultA !== null && (
                <div className="bg-primary-light rounded-xl p-4 text-center">
                  <span className="block text-xs text-muted mb-1">Area</span>
                  <span className="block font-mono font-bold text-4xl text-primary">{resultA} m²</span>
                </div>
              )}

              {resultP !== null && (
                <div className="space-y-1">
                  {PRESSURE_UNITS.filter(u => u !== v.pressureUnit).map(u => (
                    <div key={u} className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
                      <span className="text-muted">In {u}</span>
                      <span>{parseFloat(fromPa(toPa(resultP!, v.pressureUnit as PressureUnit), u).toPrecision(5))} {u}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Fluid pressure section */}
        <div className="border border-card-border rounded-xl p-4 space-y-3">
          <h3 className="text-sm font-semibold">Fluid Pressure — P = ρgh</h3>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-muted mb-1">Density ρ (kg/m³)</label>
              <input type="number" value={v.density} onChange={e => setV({ density: e.target.value })} placeholder="e.g. 1000" className={ic} />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1">g (m/s²)</label>
              <input type="number" value={v.gravity} onChange={e => setV({ gravity: e.target.value })} placeholder="9.81" className={ic} />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1">Height h (m)</label>
              <input type="number" value={v.height} onChange={e => setV({ height: e.target.value })} placeholder="m" className={ic} />
            </div>
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Output unit</label>
            <select value={v.fluidUnit} onChange={e => setV({ fluidUnit: e.target.value })} className={sc}>
              {PRESSURE_UNITS.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          {fluidPa !== null && (
            <div className="bg-primary-light rounded-xl p-3 text-center">
              <span className="block text-xs text-muted mb-1">Fluid Pressure</span>
              <span className="block font-mono font-bold text-3xl text-primary">
                {parseFloat(fromPa(fluidPa, fluidUnit).toPrecision(5))} {fluidUnit}
              </span>
            </div>
          )}
          {fluidPa !== null && (
            <div className="space-y-1">
              {PRESSURE_UNITS.filter(u => u !== fluidUnit).map(u => (
                <div key={u} className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
                  <span className="text-muted">In {u}</span>
                  <span>{parseFloat(fromPa(fluidPa!, u).toPrecision(5))} {u}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="text-xs text-muted space-y-1">
          <p>Common densities: Water = 1000 kg/m³, Seawater ≈ 1025, Air ≈ 1.225, Mercury ≈ 13,534</p>
        </div>
      </div>
    </CalculatorShell>
  );
}
