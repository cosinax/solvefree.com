"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
const sc = "w-full px-3 py-2 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm";

const R = 8.314; // J/(mol·K)

function toPa(val: number, unit: string): number {
  switch (unit) {
    case "atm": return val * 101325;
    case "bar": return val * 100000;
    case "psi": return val * 6894.76;
    default: return val; // Pa
  }
}
function fromPa(val: number, unit: string): number {
  switch (unit) {
    case "atm": return val / 101325;
    case "bar": return val / 100000;
    case "psi": return val / 6894.76;
    default: return val;
  }
}
function toM3(val: number, unit: string): number {
  return unit === "L" ? val / 1000 : val;
}
function fromM3(val: number, unit: string): number {
  return unit === "L" ? val * 1000 : val;
}
function toK(val: number, unit: string): number {
  if (unit === "C") return val + 273.15;
  if (unit === "F") return (val - 32) * 5 / 9 + 273.15;
  return val;
}
function fromK(val: number, unit: string): number {
  if (unit === "C") return val - 273.15;
  if (unit === "F") return (val - 273.15) * 9 / 5 + 32;
  return val;
}

export default function IdealGasPage() {
  const [v, setV] = useHashState({
    solveFor: "pressure",
    pressure: "",
    volume: "",
    moles: "",
    temperature: "",
    pUnit: "Pa",
    vUnit: "L",
    tUnit: "K",
    // Combined gas law
    p1: "", v1: "", t1: "",
    p2: "", v2: "", t2: "",
    solveCombined: "p2",
    cUnit: "atm",
    cvUnit: "L",
    ctUnit: "K",
  });

  const P = parseFloat(v.pressure);
  const V = parseFloat(v.volume);
  const n = parseFloat(v.moles);
  const T = parseFloat(v.temperature);

  const PPa = !isNaN(P) ? toPa(P, v.pUnit) : NaN;
  const VM3 = !isNaN(V) ? toM3(V, v.vUnit) : NaN;
  const TK = !isNaN(T) ? toK(T, v.tUnit) : NaN;

  let result: number | null = null;
  let resultLabel = "";
  let resultUnit = "";

  if (v.solveFor === "pressure" && !isNaN(n) && !isNaN(VM3) && VM3 > 0 && !isNaN(TK)) {
    const Pa = n * R * TK / VM3;
    result = parseFloat(fromPa(Pa, v.pUnit).toPrecision(5));
    resultLabel = "Pressure";
    resultUnit = v.pUnit;
  } else if (v.solveFor === "volume" && !isNaN(PPa) && !isNaN(n) && !isNaN(TK) && PPa > 0) {
    const m3 = n * R * TK / PPa;
    result = parseFloat(fromM3(m3, v.vUnit).toPrecision(5));
    resultLabel = "Volume";
    resultUnit = v.vUnit;
  } else if (v.solveFor === "moles" && !isNaN(PPa) && !isNaN(VM3) && !isNaN(TK) && TK > 0) {
    result = parseFloat((PPa * VM3 / (R * TK)).toPrecision(5));
    resultLabel = "Moles";
    resultUnit = "mol";
  } else if (v.solveFor === "temperature" && !isNaN(PPa) && !isNaN(VM3) && !isNaN(n) && n > 0) {
    const Kelvin = PPa * VM3 / (n * R);
    result = parseFloat(fromK(Kelvin, v.tUnit).toPrecision(5));
    resultLabel = "Temperature";
    resultUnit = v.tUnit === "K" ? "K" : v.tUnit === "C" ? "°C" : "°F";
  }

  // Combined gas law
  const p1 = parseFloat(v.p1), V1 = parseFloat(v.v1), T1K = !isNaN(parseFloat(v.t1)) ? toK(parseFloat(v.t1), v.ctUnit) : NaN;
  const p2 = parseFloat(v.p2), V2 = parseFloat(v.v2), T2K = !isNaN(parseFloat(v.t2)) ? toK(parseFloat(v.t2), v.ctUnit) : NaN;

  let combinedResult: number | null = null;
  const sc2 = v.solveCombined;
  if (sc2 === "p2" && !isNaN(p1) && !isNaN(V1) && !isNaN(T1K) && !isNaN(V2) && !isNaN(T2K) && V2 > 0 && T1K > 0) {
    combinedResult = parseFloat((p1 * V1 * T2K / (T1K * V2)).toPrecision(5));
  } else if (sc2 === "v2" && !isNaN(p1) && !isNaN(V1) && !isNaN(T1K) && !isNaN(p2) && !isNaN(T2K) && p2 > 0 && T1K > 0) {
    combinedResult = parseFloat((p1 * V1 * T2K / (T1K * p2)).toPrecision(5));
  } else if (sc2 === "t2" && !isNaN(p1) && !isNaN(V1) && !isNaN(T1K) && !isNaN(p2) && !isNaN(V2) && p1 > 0 && V1 > 0) {
    const T2raw = p2 * V2 * T1K / (p1 * V1);
    combinedResult = parseFloat(fromK(T2raw, v.ctUnit).toPrecision(5));
  }

  return (
    <CalculatorShell
      title="Ideal Gas Law Calculator"
      description="PV = nRT — solve for pressure, volume, moles, or temperature. Also includes the combined gas law."
    >
      <div className="space-y-6">
        {/* PV = nRT */}
        <div className="border border-card-border rounded-xl p-4 space-y-4">
          <h3 className="text-sm font-semibold">PV = nRT &nbsp;·&nbsp; R = 8.314 J/(mol·K)</h3>
          <div>
            <label className="block text-xs text-muted mb-1">Solve for</label>
            <select value={v.solveFor} onChange={e => setV({ solveFor: e.target.value })} className={sc}>
              <option value="pressure">Pressure (P)</option>
              <option value="volume">Volume (V)</option>
              <option value="moles">Moles (n)</option>
              <option value="temperature">Temperature (T)</option>
            </select>
          </div>

          {v.solveFor !== "pressure" && (
            <div>
              <label className="block text-xs text-muted mb-1">Pressure</label>
              <div className="flex gap-2">
                <input type="number" value={v.pressure} onChange={e => setV({ pressure: e.target.value })} placeholder="e.g. 101325" className={ic} />
                <select value={v.pUnit} onChange={e => setV({ pUnit: e.target.value })} className="px-2 py-2 bg-background border border-card-border rounded-lg text-sm">
                  <option>Pa</option><option>atm</option><option>bar</option><option>psi</option>
                </select>
              </div>
            </div>
          )}
          {v.solveFor !== "volume" && (
            <div>
              <label className="block text-xs text-muted mb-1">Volume</label>
              <div className="flex gap-2">
                <input type="number" value={v.volume} onChange={e => setV({ volume: e.target.value })} placeholder="e.g. 22.4" className={ic} />
                <select value={v.vUnit} onChange={e => setV({ vUnit: e.target.value })} className="px-2 py-2 bg-background border border-card-border rounded-lg text-sm">
                  <option>L</option><option>m3</option>
                </select>
              </div>
            </div>
          )}
          {v.solveFor !== "moles" && (
            <div>
              <label className="block text-xs text-muted mb-1">Moles (n)</label>
              <input type="number" value={v.moles} onChange={e => setV({ moles: e.target.value })} placeholder="e.g. 1" className={ic} />
            </div>
          )}
          {v.solveFor !== "temperature" && (
            <div>
              <label className="block text-xs text-muted mb-1">Temperature</label>
              <div className="flex gap-2">
                <input type="number" value={v.temperature} onChange={e => setV({ temperature: e.target.value })} placeholder="e.g. 273.15" className={ic} />
                <select value={v.tUnit} onChange={e => setV({ tUnit: e.target.value })} className="px-2 py-2 bg-background border border-card-border rounded-lg text-sm">
                  <option>K</option><option value="C">°C</option><option value="F">°F</option>
                </select>
              </div>
            </div>
          )}
          {v.solveFor === "pressure" && (
            <div>
              <label className="block text-xs text-muted mb-1">Output unit</label>
              <select value={v.pUnit} onChange={e => setV({ pUnit: e.target.value })} className={sc}>
                <option>Pa</option><option>atm</option><option>bar</option><option>psi</option>
              </select>
            </div>
          )}

          {result !== null && (
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="block text-xs text-muted mb-1">{resultLabel}</span>
              <span className="block font-mono font-bold text-4xl text-primary">{result} {resultUnit}</span>
            </div>
          )}
        </div>

        {/* Combined gas law */}
        <div className="border border-card-border rounded-xl p-4 space-y-3">
          <h3 className="text-sm font-semibold">Combined Gas Law — P₁V₁/T₁ = P₂V₂/T₂</h3>
          <div>
            <label className="block text-xs text-muted mb-1">Solve for</label>
            <select value={v.solveCombined} onChange={e => setV({ solveCombined: e.target.value })} className={sc}>
              <option value="p2">P₂</option>
              <option value="v2">V₂</option>
              <option value="t2">T₂</option>
            </select>
          </div>
          <p className="text-xs text-muted">State 1:</p>
          <div className="grid grid-cols-3 gap-2">
            <div><label className="block text-xs text-muted mb-1">P₁</label><input type="number" value={v.p1} onChange={e => setV({ p1: e.target.value })} placeholder="P₁" className={ic} /></div>
            <div><label className="block text-xs text-muted mb-1">V₁</label><input type="number" value={v.v1} onChange={e => setV({ v1: e.target.value })} placeholder="V₁" className={ic} /></div>
            <div><label className="block text-xs text-muted mb-1">T₁</label><input type="number" value={v.t1} onChange={e => setV({ t1: e.target.value })} placeholder="T₁" className={ic} /></div>
          </div>
          <p className="text-xs text-muted">State 2 (enter known values, leave unknown blank):</p>
          <div className="grid grid-cols-3 gap-2">
            <div><label className="block text-xs text-muted mb-1">P₂</label><input type="number" value={v.p2} onChange={e => setV({ p2: e.target.value })} placeholder="P₂" className={ic} disabled={v.solveCombined === "p2"} /></div>
            <div><label className="block text-xs text-muted mb-1">V₂</label><input type="number" value={v.v2} onChange={e => setV({ v2: e.target.value })} placeholder="V₂" className={ic} disabled={v.solveCombined === "v2"} /></div>
            <div><label className="block text-xs text-muted mb-1">T₂</label><input type="number" value={v.t2} onChange={e => setV({ t2: e.target.value })} placeholder="T₂" className={ic} disabled={v.solveCombined === "t2"} /></div>
          </div>
          <p className="text-xs text-muted">Pressure unit: {v.cUnit} · Volume: {v.cvUnit} · Temp: {v.ctUnit}</p>
          {combinedResult !== null && (
            <div className="bg-primary-light rounded-xl p-3 text-center">
              <span className="block text-xs text-muted mb-1">{v.solveCombined === "p2" ? "P₂" : v.solveCombined === "v2" ? "V₂" : "T₂"}</span>
              <span className="block font-mono font-bold text-3xl text-primary">{combinedResult}</span>
            </div>
          )}
        </div>
      </div>
    </CalculatorShell>
  );
}
