"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
const sc = "w-full px-3 py-2 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm";

type SpeedUnit = "m/s" | "km/h" | "mph" | "ft/s";

function toMs(val: number, unit: SpeedUnit): number {
  if (unit === "km/h") return val / 3.6;
  if (unit === "mph") return val * 0.44704;
  if (unit === "ft/s") return val * 0.3048;
  return val;
}

function fromMs(val: number, unit: SpeedUnit): number {
  if (unit === "km/h") return val * 3.6;
  if (unit === "mph") return val / 0.44704;
  if (unit === "ft/s") return val / 0.3048;
  return val;
}

function unitLabel(unit: SpeedUnit): string {
  return unit;
}

export default function VelocityPage() {
  const [v, setV] = useHashState({
    solveFor: "velocity",
    velocity: "",
    distance: "",
    time: "",
    velocityUnit: "m/s",
    distanceUnit: "m",
    timeUnit: "s",
    v0: "",
    v0Unit: "m/s",
  });

  const speedUnits: SpeedUnit[] = ["m/s", "km/h", "mph", "ft/s"];
  const distanceUnits = ["m", "km", "mi", "ft"];
  const timeUnits = ["s", "min", "h"];

  function toMeters(val: number, unit: string): number {
    if (unit === "km") return val * 1000;
    if (unit === "mi") return val * 1609.344;
    if (unit === "ft") return val * 0.3048;
    return val;
  }

  function fromMeters(val: number, unit: string): number {
    if (unit === "km") return val / 1000;
    if (unit === "mi") return val / 1609.344;
    if (unit === "ft") return val / 0.3048;
    return val;
  }

  function toSeconds(val: number, unit: string): number {
    if (unit === "min") return val * 60;
    if (unit === "h") return val * 3600;
    return val;
  }

  function fromSeconds(val: number, unit: string): number {
    if (unit === "min") return val / 60;
    if (unit === "h") return val / 3600;
    return val;
  }

  const velNum = parseFloat(v.velocity);
  const distNum = parseFloat(v.distance);
  const timeNum = parseFloat(v.time);
  const v0Num = parseFloat(v.v0);

  let resultVel: number | null = null;
  let resultDist: number | null = null;
  let resultTime: number | null = null;
  let resultAccel: number | null = null;

  const velMs = !isNaN(velNum) ? toMs(velNum, v.velocityUnit as SpeedUnit) : NaN;
  const distM = !isNaN(distNum) ? toMeters(distNum, v.distanceUnit) : NaN;
  const timeSec = !isNaN(timeNum) ? toSeconds(timeNum, v.timeUnit) : NaN;

  if (v.solveFor === "velocity" && !isNaN(distM) && !isNaN(timeSec) && timeSec !== 0) {
    resultVel = fromMs(distM / timeSec, v.velocityUnit as SpeedUnit);
    resultDist = distNum;
    resultTime = timeNum;
  } else if (v.solveFor === "distance" && !isNaN(velMs) && !isNaN(timeSec)) {
    resultDist = fromMeters(velMs * timeSec, v.distanceUnit);
    resultVel = velNum;
    resultTime = timeNum;
  } else if (v.solveFor === "time" && !isNaN(velMs) && velMs !== 0 && !isNaN(distM)) {
    resultTime = fromSeconds(distM / velMs, v.timeUnit);
    resultVel = velNum;
    resultDist = distNum;
  }

  if (!isNaN(v0Num) && !isNaN(timeSec) && timeSec > 0) {
    const v0Ms = toMs(v0Num, v.v0Unit as SpeedUnit);
    const finalMs = resultVel !== null ? toMs(resultVel, v.velocityUnit as SpeedUnit) : velMs;
    if (!isNaN(finalMs)) {
      resultAccel = (finalMs - v0Ms) / timeSec;
    }
  }

  const hasResult = resultVel !== null || resultDist !== null || resultTime !== null;

  return (
    <CalculatorShell
      title="Velocity Calculator"
      description="Solve for velocity, distance, or time using v = d / t. Toggle units and optionally compute acceleration."
    >
      <div className="space-y-5">
        <div>
          <label className="block text-sm text-muted mb-1">Solve for</label>
          <select value={v.solveFor} onChange={e => setV({ solveFor: e.target.value })} className={sc}>
            <option value="velocity">Velocity (v)</option>
            <option value="distance">Distance (d)</option>
            <option value="time">Time (t)</option>
          </select>
        </div>

        {v.solveFor !== "velocity" && (
          <div>
            <label className="block text-sm text-muted mb-1">Velocity</label>
            <div className="flex gap-2">
              <input type="number" value={v.velocity} onChange={e => setV({ velocity: e.target.value })} placeholder="e.g. 10" className={ic} />
              <select value={v.velocityUnit} onChange={e => setV({ velocityUnit: e.target.value })} className="px-2 py-2 bg-background border border-card-border rounded-lg text-sm">
                {speedUnits.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>
        )}

        {v.solveFor !== "distance" && (
          <div>
            <label className="block text-sm text-muted mb-1">Distance</label>
            <div className="flex gap-2">
              <input type="number" value={v.distance} onChange={e => setV({ distance: e.target.value })} placeholder="e.g. 100" className={ic} />
              <select value={v.distanceUnit} onChange={e => setV({ distanceUnit: e.target.value })} className="px-2 py-2 bg-background border border-card-border rounded-lg text-sm">
                {distanceUnits.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>
        )}

        {v.solveFor !== "time" && (
          <div>
            <label className="block text-sm text-muted mb-1">Time</label>
            <div className="flex gap-2">
              <input type="number" value={v.time} onChange={e => setV({ time: e.target.value })} placeholder="e.g. 10" className={ic} />
              <select value={v.timeUnit} onChange={e => setV({ timeUnit: e.target.value })} className="px-2 py-2 bg-background border border-card-border rounded-lg text-sm">
                {timeUnits.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>
        )}

        <details className="text-sm">
          <summary className="cursor-pointer text-muted hover:text-primary">Acceleration (optional — enter initial velocity)</summary>
          <div className="mt-2">
            <label className="block text-sm text-muted mb-1">Initial velocity (v₀)</label>
            <div className="flex gap-2">
              <input type="number" value={v.v0} onChange={e => setV({ v0: e.target.value })} placeholder="0" className={ic} />
              <select value={v.v0Unit} onChange={e => setV({ v0Unit: e.target.value })} className="px-2 py-2 bg-background border border-card-border rounded-lg text-sm">
                {speedUnits.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>
        </details>

        {hasResult && (
          <div className="space-y-3">
            {v.solveFor === "velocity" && resultVel !== null && (
              <div className="bg-primary-light rounded-xl p-4 text-center">
                <span className="block text-xs text-muted mb-1">Velocity</span>
                <span className="block font-mono font-bold text-4xl text-primary">{resultVel.toPrecision(6).replace(/\.?0+$/, "")} {v.velocityUnit}</span>
              </div>
            )}
            {v.solveFor === "distance" && resultDist !== null && (
              <div className="bg-primary-light rounded-xl p-4 text-center">
                <span className="block text-xs text-muted mb-1">Distance</span>
                <span className="block font-mono font-bold text-4xl text-primary">{resultDist.toPrecision(6).replace(/\.?0+$/, "")} {v.distanceUnit}</span>
              </div>
            )}
            {v.solveFor === "time" && resultTime !== null && (
              <div className="bg-primary-light rounded-xl p-4 text-center">
                <span className="block text-xs text-muted mb-1">Time</span>
                <span className="block font-mono font-bold text-4xl text-primary">{resultTime.toPrecision(6).replace(/\.?0+$/, "")} {v.timeUnit}</span>
              </div>
            )}

            {resultAccel !== null && (
              <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
                <span className="text-muted">Acceleration (a)</span>
                <span>{resultAccel.toPrecision(4)} m/s²</span>
              </div>
            )}

            <div className="space-y-1 pt-1">
              <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
                <span className="text-muted">Formula</span>
                <span>v = d / t</span>
              </div>
              {resultVel !== null && (
                <>
                  <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
                    <span className="text-muted">In km/h</span>
                    <span>{(toMs(resultVel, v.velocityUnit as SpeedUnit) * 3.6).toPrecision(5)} km/h</span>
                  </div>
                  <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
                    <span className="text-muted">In mph</span>
                    <span>{(toMs(resultVel, v.velocityUnit as SpeedUnit) / 0.44704).toPrecision(5)} mph</span>
                  </div>
                  <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
                    <span className="text-muted">In m/s</span>
                    <span>{toMs(resultVel, v.velocityUnit as SpeedUnit).toPrecision(5)} m/s</span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
