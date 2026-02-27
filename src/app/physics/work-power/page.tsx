"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
const sc = "w-full px-3 py-2 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm";

function toWatts(val: number, unit: string): number {
  if (unit === "kW") return val * 1000;
  if (unit === "hp") return val * 745.7;
  return val;
}
function fromWatts(val: number, unit: string): number {
  if (unit === "kW") return val / 1000;
  if (unit === "hp") return val / 745.7;
  return val;
}
function toJoules(val: number, unit: string): number {
  return unit === "kJ" ? val * 1000 : val;
}
function fromJoules(val: number, unit: string): number {
  return unit === "kJ" ? val / 1000 : val;
}

export default function WorkPowerPage() {
  const [v, setV] = useHashState({
    // Work
    wSolveFor: "work",
    wForce: "",
    wDist: "",
    wAngle: "0",
    wWork: "",
    wUnit: "J",
    // Power
    pSolveFor: "power",
    pPower: "",
    pWork: "",
    pTime: "",
    pForce: "",
    pVel: "",
    pUnit: "W",
    // Torque power
    torque: "",
    omega: "",
    omegaUnit: "rad/s",
  });

  const fmt = (n: number, d = 5) => parseFloat(n.toPrecision(d)).toString();

  // Work
  const wF = parseFloat(v.wForce);
  const wD = parseFloat(v.wDist);
  const wA = parseFloat(v.wAngle) || 0;

  const wUnit = v.wUnit;

  let resultWork: number | null = null;
  let resultWForce: number | null = null;
  let resultWDist: number | null = null;

  if (v.wSolveFor === "work" && !isNaN(wF) && !isNaN(wD)) {
    resultWork = fromJoules(wF * wD * Math.cos((wA * Math.PI) / 180), wUnit);
  } else if (v.wSolveFor === "force" && !isNaN(parseFloat(v.wWork)) && !isNaN(wD) && wD !== 0) {
    const Wj = toJoules(parseFloat(v.wWork), wUnit);
    resultWForce = Wj / (wD * Math.cos((wA * Math.PI) / 180));
  } else if (v.wSolveFor === "distance" && !isNaN(parseFloat(v.wWork)) && !isNaN(wF) && wF !== 0) {
    const Wj = toJoules(parseFloat(v.wWork), wUnit);
    resultWDist = Wj / (wF * Math.cos((wA * Math.PI) / 180));
  }

  // Power
  const pW = parseFloat(v.pWork);
  const pT = parseFloat(v.pTime);
  const pF = parseFloat(v.pForce);
  const pV = parseFloat(v.pVel);
  const pUnit = v.pUnit;

  let resultPower: number | null = null;
  let resultPWork: number | null = null;
  let resultPTime: number | null = null;

  if (v.pSolveFor === "power") {
    if (!isNaN(pW) && !isNaN(pT) && pT > 0) {
      resultPower = fromWatts(toJoules(pW, "J") / pT, pUnit);
    } else if (!isNaN(pF) && !isNaN(pV)) {
      resultPower = fromWatts(pF * pV, pUnit);
    }
  } else if (v.pSolveFor === "work" && !isNaN(parseFloat(v.pPower || "")) && !isNaN(pT)) {
    const Pw = toWatts(parseFloat(v.pPower || ""), pUnit);
    resultPWork = Pw * pT;
  } else if (v.pSolveFor === "time" && !isNaN(parseFloat(v.pPower || "")) && !isNaN(pW) && parseFloat(v.pPower || "") > 0) {
    const Pw = toWatts(parseFloat(v.pPower || ""), pUnit);
    resultPTime = toJoules(pW, "J") / Pw;
  }

  // Torque power
  const tau = parseFloat(v.torque);
  const omega = parseFloat(v.omega);
  const omegaRad = v.omegaUnit === "rpm" ? (omega * 2 * Math.PI) / 60 : omega;
  let torquePower: number | null = null;
  if (!isNaN(tau) && !isNaN(omega)) {
    torquePower = tau * omegaRad;
  }

  return (
    <CalculatorShell
      title="Work & Power Calculator"
      description="Work = F × d × cos(θ), Power = W/t = F × v, and power from torque P = τ × ω."
    >
      <div className="space-y-6">
        {/* Work section */}
        <div className="border border-card-border rounded-xl p-4 space-y-3">
          <h3 className="text-sm font-semibold">Work — W = F × d × cos(θ)</h3>
          <div>
            <label className="block text-xs text-muted mb-1">Solve for</label>
            <select value={v.wSolveFor} onChange={e => setV({ wSolveFor: e.target.value })} className={sc}>
              <option value="work">Work (W)</option>
              <option value="force">Force (F)</option>
              <option value="distance">Distance (d)</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {v.wSolveFor !== "force" && (
              <div>
                <label className="block text-xs text-muted mb-1">Force (N)</label>
                <input type="number" value={v.wForce} onChange={e => setV({ wForce: e.target.value })} placeholder="N" className={ic} />
              </div>
            )}
            {v.wSolveFor !== "distance" && (
              <div>
                <label className="block text-xs text-muted mb-1">Distance (m)</label>
                <input type="number" value={v.wDist} onChange={e => setV({ wDist: e.target.value })} placeholder="m" className={ic} />
              </div>
            )}
            <div>
              <label className="block text-xs text-muted mb-1">Angle θ (°)</label>
              <input type="number" value={v.wAngle} onChange={e => setV({ wAngle: e.target.value })} placeholder="0" className={ic} />
            </div>
            {v.wSolveFor !== "work" && (
              <div>
                <label className="block text-xs text-muted mb-1">Work</label>
                <div className="flex gap-2">
                  <input type="number" value={v.wWork || ""} onChange={e => setV({ wWork: e.target.value } as any)} placeholder="J or kJ" className={ic} />
                  <select value={v.wUnit} onChange={e => setV({ wUnit: e.target.value })} className="px-2 py-2 bg-background border border-card-border rounded-lg text-sm">
                    <option>J</option><option>kJ</option>
                  </select>
                </div>
              </div>
            )}
          </div>
          {v.wSolveFor === "work" && (
            <div>
              <label className="block text-xs text-muted mb-1">Output unit</label>
              <select value={v.wUnit} onChange={e => setV({ wUnit: e.target.value })} className={sc}>
                <option>J</option><option>kJ</option>
              </select>
            </div>
          )}
          {resultWork !== null && (
            <div className="bg-primary-light rounded-xl p-3 text-center">
              <span className="block text-xs text-muted">Work</span>
              <span className="block font-mono font-bold text-3xl text-primary">{fmt(resultWork)} {wUnit}</span>
            </div>
          )}
          {resultWForce !== null && (
            <div className="bg-primary-light rounded-xl p-3 text-center">
              <span className="block text-xs text-muted">Force</span>
              <span className="block font-mono font-bold text-3xl text-primary">{fmt(resultWForce)} N</span>
            </div>
          )}
          {resultWDist !== null && (
            <div className="bg-primary-light rounded-xl p-3 text-center">
              <span className="block text-xs text-muted">Distance</span>
              <span className="block font-mono font-bold text-3xl text-primary">{fmt(resultWDist)} m</span>
            </div>
          )}
        </div>

        {/* Power section */}
        <div className="border border-card-border rounded-xl p-4 space-y-3">
          <h3 className="text-sm font-semibold">Power — P = W/t or P = F × v</h3>
          <div>
            <label className="block text-xs text-muted mb-1">Solve for</label>
            <select value={v.pSolveFor} onChange={e => setV({ pSolveFor: e.target.value })} className={sc}>
              <option value="power">Power (P)</option>
              <option value="work">Work (W)</option>
              <option value="time">Time (t)</option>
            </select>
          </div>

          {v.pSolveFor === "power" ? (
            <div className="space-y-3">
              <p className="text-xs text-muted">Enter Work + Time, or Force + Velocity:</p>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs text-muted mb-1">Work (J)</label><input type="number" value={v.pWork} onChange={e => setV({ pWork: e.target.value })} placeholder="J" className={ic} /></div>
                <div><label className="block text-xs text-muted mb-1">Time (s)</label><input type="number" value={v.pTime} onChange={e => setV({ pTime: e.target.value })} placeholder="s" className={ic} /></div>
                <div><label className="block text-xs text-muted mb-1">Force (N)</label><input type="number" value={v.pForce} onChange={e => setV({ pForce: e.target.value })} placeholder="N" className={ic} /></div>
                <div><label className="block text-xs text-muted mb-1">Velocity (m/s)</label><input type="number" value={v.pVel} onChange={e => setV({ pVel: e.target.value })} placeholder="m/s" className={ic} /></div>
              </div>
              <div>
                <label className="block text-xs text-muted mb-1">Output unit</label>
                <select value={v.pUnit} onChange={e => setV({ pUnit: e.target.value })} className={sc}>
                  <option>W</option><option>kW</option><option>hp</option>
                </select>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-muted mb-1">Power</label>
                <div className="flex gap-2">
                  <input type="number" value={v.pPower || ""} onChange={e => setV({ pPower: e.target.value } as any)} placeholder="P" className={ic} />
                  <select value={v.pUnit} onChange={e => setV({ pUnit: e.target.value })} className="px-2 py-2 bg-background border border-card-border rounded-lg text-sm">
                    <option>W</option><option>kW</option><option>hp</option>
                  </select>
                </div>
              </div>
              {v.pSolveFor === "work" && (
                <div><label className="block text-xs text-muted mb-1">Time (s)</label><input type="number" value={v.pTime} onChange={e => setV({ pTime: e.target.value })} placeholder="s" className={ic} /></div>
              )}
              {v.pSolveFor === "time" && (
                <div><label className="block text-xs text-muted mb-1">Work (J)</label><input type="number" value={v.pWork} onChange={e => setV({ pWork: e.target.value })} placeholder="J" className={ic} /></div>
              )}
            </div>
          )}

          {resultPower !== null && (
            <div className="bg-primary-light rounded-xl p-3 text-center">
              <span className="block text-xs text-muted">Power</span>
              <span className="block font-mono font-bold text-3xl text-primary">{fmt(resultPower)} {pUnit}</span>
            </div>
          )}
          {resultPWork !== null && (
            <div className="bg-primary-light rounded-xl p-3 text-center">
              <span className="block text-xs text-muted">Work</span>
              <span className="block font-mono font-bold text-3xl text-primary">{fmt(resultPWork)} J</span>
            </div>
          )}
          {resultPTime !== null && (
            <div className="bg-primary-light rounded-xl p-3 text-center">
              <span className="block text-xs text-muted">Time</span>
              <span className="block font-mono font-bold text-3xl text-primary">{fmt(resultPTime)} s</span>
            </div>
          )}

          {resultPower !== null && (
            <div className="space-y-1">
              <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
                <span className="text-muted">In Watts</span><span>{fmt(toWatts(resultPower, pUnit))} W</span>
              </div>
              <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
                <span className="text-muted">In kW</span><span>{fmt(toWatts(resultPower, pUnit) / 1000)} kW</span>
              </div>
              <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
                <span className="text-muted">In hp</span><span>{fmt(toWatts(resultPower, pUnit) / 745.7)} hp</span>
              </div>
            </div>
          )}
        </div>

        {/* Torque power */}
        <div className="border border-card-border rounded-xl p-4 space-y-3">
          <h3 className="text-sm font-semibold">Power from Torque — P = τ × ω</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-muted mb-1">Torque τ (N·m)</label>
              <input type="number" value={v.torque} onChange={e => setV({ torque: e.target.value })} placeholder="N·m" className={ic} />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1">Angular velocity ω</label>
              <div className="flex gap-2">
                <input type="number" value={v.omega} onChange={e => setV({ omega: e.target.value })} placeholder="e.g. 3000" className={ic} />
                <select value={v.omegaUnit} onChange={e => setV({ omegaUnit: e.target.value })} className="px-2 py-2 bg-background border border-card-border rounded-lg text-sm">
                  <option value="rad/s">rad/s</option>
                  <option value="rpm">rpm</option>
                </select>
              </div>
            </div>
          </div>
          {torquePower !== null && (
            <div className="space-y-2">
              <div className="bg-primary-light rounded-xl p-3 text-center">
                <span className="block text-xs text-muted">Power (P = τ × ω)</span>
                <span className="block font-mono font-bold text-3xl text-primary">{fmt(torquePower)} W</span>
              </div>
              <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
                <span className="text-muted">In kW</span><span>{fmt(torquePower / 1000)} kW</span>
              </div>
              <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
                <span className="text-muted">In hp</span><span>{fmt(torquePower / 745.7)} hp</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </CalculatorShell>
  );
}
