"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
const sc = "px-2 py-2 bg-background border border-card-border rounded-lg text-sm";

type EnergyUnit = "J" | "kJ" | "cal" | "kcal" | "BTU" | "kWh";

function toJoules(val: number, unit: EnergyUnit): number {
  switch (unit) {
    case "kJ": return val * 1000;
    case "cal": return val * 4.184;
    case "kcal": return val * 4184;
    case "BTU": return val * 1055.06;
    case "kWh": return val * 3600000;
    default: return val;
  }
}

function fromJoules(val: number, unit: EnergyUnit): number {
  switch (unit) {
    case "kJ": return val / 1000;
    case "cal": return val / 4.184;
    case "kcal": return val / 4184;
    case "BTU": return val / 1055.06;
    case "kWh": return val / 3600000;
    default: return val;
  }
}

const ENERGY_UNITS: EnergyUnit[] = ["J", "kJ", "cal", "kcal", "BTU", "kWh"];

export default function EnergyPage() {
  const [v, setV] = useHashState({
    // KE
    keMass: "",
    keVelocity: "",
    // PE
    peMass: "",
    peHeight: "",
    peGravity: "9.81",
    // Work
    workForce: "",
    workDist: "",
    workAngle: "0",
    // Output unit
    unit: "J",
  });

  const fmt = (n: number, unit: EnergyUnit) => {
    const val = fromJoules(n, unit);
    return parseFloat(val.toPrecision(5)).toString();
  };

  const keMass = parseFloat(v.keMass);
  const keVel = parseFloat(v.keVelocity);
  const peMass = parseFloat(v.peMass);
  const peH = parseFloat(v.peHeight);
  const peG = parseFloat(v.peGravity) || 9.81;
  const wF = parseFloat(v.workForce);
  const wD = parseFloat(v.workDist);
  const wAngle = parseFloat(v.workAngle) || 0;

  const keJ = !isNaN(keMass) && !isNaN(keVel) ? 0.5 * keMass * keVel * keVel : null;
  const peJ = !isNaN(peMass) && !isNaN(peH) ? peMass * peG * peH : null;
  const workJ = !isNaN(wF) && !isNaN(wD) ? wF * wD * Math.cos((wAngle * Math.PI) / 180) : null;

  const unit = v.unit as EnergyUnit;

  const convRow = (label: string, joules: number) => (
    <>
      {ENERGY_UNITS.map(u => (
        <div key={u} className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
          <span className="text-muted">{label} in {u}</span>
          <span>{fmt(joules, u)} {u}</span>
        </div>
      ))}
    </>
  );

  return (
    <CalculatorShell
      title="Energy Calculator"
      description="Calculate kinetic energy (KE = ½mv²), potential energy (PE = mgh), and work (W = F·d·cos θ)."
    >
      <div className="space-y-6">
        <div>
          <label className="block text-sm text-muted mb-1">Output unit</label>
          <select value={v.unit} onChange={e => setV({ unit: e.target.value })} className="w-full px-3 py-2 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm">
            {ENERGY_UNITS.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>

        {/* Kinetic Energy */}
        <div className="border border-card-border rounded-xl p-4 space-y-3">
          <h3 className="text-sm font-semibold">Kinetic Energy — KE = ½mv²</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-muted mb-1">Mass (kg)</label>
              <input type="number" value={v.keMass} onChange={e => setV({ keMass: e.target.value })} placeholder="kg" className={ic} />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1">Velocity (m/s)</label>
              <input type="number" value={v.keVelocity} onChange={e => setV({ keVelocity: e.target.value })} placeholder="m/s" className={ic} />
            </div>
          </div>
          {keJ !== null && (
            <div className="bg-primary-light rounded-xl p-3 text-center">
              <span className="block text-xs text-muted mb-1">Kinetic Energy</span>
              <span className="block font-mono font-bold text-3xl text-primary">{fmt(keJ, unit)} {unit}</span>
            </div>
          )}
        </div>

        {/* Potential Energy */}
        <div className="border border-card-border rounded-xl p-4 space-y-3">
          <h3 className="text-sm font-semibold">Potential Energy — PE = mgh</h3>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-muted mb-1">Mass (kg)</label>
              <input type="number" value={v.peMass} onChange={e => setV({ peMass: e.target.value })} placeholder="kg" className={ic} />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1">Height (m)</label>
              <input type="number" value={v.peHeight} onChange={e => setV({ peHeight: e.target.value })} placeholder="m" className={ic} />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1">g (m/s²)</label>
              <input type="number" value={v.peGravity} onChange={e => setV({ peGravity: e.target.value })} placeholder="9.81" className={ic} />
            </div>
          </div>
          {peJ !== null && (
            <div className="bg-primary-light rounded-xl p-3 text-center">
              <span className="block text-xs text-muted mb-1">Potential Energy</span>
              <span className="block font-mono font-bold text-3xl text-primary">{fmt(peJ, unit)} {unit}</span>
            </div>
          )}
        </div>

        {/* Work */}
        <div className="border border-card-border rounded-xl p-4 space-y-3">
          <h3 className="text-sm font-semibold">Work — W = F × d × cos(θ)</h3>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-muted mb-1">Force (N)</label>
              <input type="number" value={v.workForce} onChange={e => setV({ workForce: e.target.value })} placeholder="N" className={ic} />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1">Distance (m)</label>
              <input type="number" value={v.workDist} onChange={e => setV({ workDist: e.target.value })} placeholder="m" className={ic} />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1">Angle (°)</label>
              <input type="number" value={v.workAngle} onChange={e => setV({ workAngle: e.target.value })} placeholder="0" className={ic} />
            </div>
          </div>
          {workJ !== null && (
            <div className="bg-primary-light rounded-xl p-3 text-center">
              <span className="block text-xs text-muted mb-1">Work</span>
              <span className="block font-mono font-bold text-3xl text-primary">{fmt(workJ, unit)} {unit}</span>
            </div>
          )}
        </div>

        {/* Combined conversions */}
        {(keJ !== null || peJ !== null || workJ !== null) && (
          <details>
            <summary className="cursor-pointer text-sm text-muted hover:text-primary">All unit conversions</summary>
            <div className="mt-2 space-y-1">
              {keJ !== null && convRow("KE", keJ)}
              {peJ !== null && convRow("PE", peJ)}
              {workJ !== null && convRow("Work", workJ)}
            </div>
          </details>
        )}
      </div>
    </CalculatorShell>
  );
}
