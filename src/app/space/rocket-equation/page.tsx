"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
const sc = "w-full px-3 py-2 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm";

const G0 = 9.80665; // m/s²

const fmt = (n: number, d = 5) => parseFloat(n.toPrecision(d)).toString();

type SolveFor = "dv" | "m0" | "mf" | "isp";

export default function RocketEquationPage() {
  const [v, setV] = useHashState({
    solveFor: "dv",
    isp: "350",
    m0: "100000",
    mf: "20000",
    dv: "5600",
  });

  const solveFor = v.solveFor as SolveFor;
  const isp  = parseFloat(v.isp);
  const m0   = parseFloat(v.m0);
  const mf   = parseFloat(v.mf);
  const dv   = parseFloat(v.dv);

  interface Result {
    dv_ms: number;
    m0_kg: number;
    mf_kg: number;
    isp_s: number;
    massRatio: number;
    propellantFrac: number;
    propellantMass: number;
  }

  let result: Result | null = null;
  let error = "";

  function compute(): Result | null {
    switch (solveFor) {
      case "dv": {
        if (isNaN(isp) || isp <= 0) { error = "Enter valid Isp."; return null; }
        if (isNaN(m0) || m0 <= 0)   { error = "Enter valid m0.";  return null; }
        if (isNaN(mf) || mf <= 0)   { error = "Enter valid mf.";  return null; }
        if (m0 <= mf) { error = "Initial mass must be greater than final mass."; return null; }
        const dv_ms = isp * G0 * Math.log(m0 / mf);
        return { dv_ms, m0_kg: m0, mf_kg: mf, isp_s: isp, massRatio: m0/mf, propellantFrac: (m0-mf)/m0, propellantMass: m0-mf };
      }
      case "m0": {
        if (isNaN(isp) || isp <= 0) { error = "Enter valid Isp."; return null; }
        if (isNaN(mf) || mf <= 0)   { error = "Enter valid mf.";  return null; }
        if (isNaN(dv) || dv <= 0)   { error = "Enter valid Δv.";  return null; }
        const calc_m0 = mf * Math.exp(dv / (isp * G0));
        return { dv_ms: dv, m0_kg: calc_m0, mf_kg: mf, isp_s: isp, massRatio: calc_m0/mf, propellantFrac: (calc_m0-mf)/calc_m0, propellantMass: calc_m0-mf };
      }
      case "mf": {
        if (isNaN(isp) || isp <= 0) { error = "Enter valid Isp."; return null; }
        if (isNaN(m0) || m0 <= 0)   { error = "Enter valid m0.";  return null; }
        if (isNaN(dv) || dv <= 0)   { error = "Enter valid Δv.";  return null; }
        const calc_mf = m0 / Math.exp(dv / (isp * G0));
        if (calc_mf >= m0) { error = "Impossible: final mass >= initial mass."; return null; }
        return { dv_ms: dv, m0_kg: m0, mf_kg: calc_mf, isp_s: isp, massRatio: m0/calc_mf, propellantFrac: (m0-calc_mf)/m0, propellantMass: m0-calc_mf };
      }
      case "isp": {
        if (isNaN(m0) || m0 <= 0)   { error = "Enter valid m0.";  return null; }
        if (isNaN(mf) || mf <= 0)   { error = "Enter valid mf.";  return null; }
        if (isNaN(dv) || dv <= 0)   { error = "Enter valid Δv.";  return null; }
        if (m0 <= mf) { error = "Initial mass must be greater than final mass."; return null; }
        const calc_isp = dv / (G0 * Math.log(m0 / mf));
        return { dv_ms: dv, m0_kg: m0, mf_kg: mf, isp_s: calc_isp, massRatio: m0/mf, propellantFrac: (m0-mf)/m0, propellantMass: m0-mf };
      }
    }
  }

  result = compute();

  const PRESETS = [
    { label: "Falcon 9 MVac", isp: "348", m0: "100000", mf: "20000" },
    { label: "RS-25 (SLS)",   isp: "452", m0: "100000", mf: "20000" },
    { label: "Ion thruster",  isp: "3000", m0: "1000", mf: "800" },
  ];

  return (
    <CalculatorShell
      title="Tsiolkovsky Rocket Equation"
      description="Δv = Isp × g₀ × ln(m₀/mf) — solve for any variable."
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-muted mb-1">Solve for</label>
          <select value={v.solveFor} onChange={e => setV({ solveFor: e.target.value })} className={sc}>
            <option value="dv">Delta-V (Δv)</option>
            <option value="m0">Initial mass (m₀)</option>
            <option value="mf">Final mass (mf)</option>
            <option value="isp">Specific impulse (Isp)</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {solveFor !== "isp" && (
            <div>
              <label className="block text-sm text-muted mb-1">Isp (s)</label>
              <input type="number" value={v.isp} onChange={e => setV({ isp: e.target.value })} className={ic} min="0" step="any" />
            </div>
          )}
          {solveFor !== "m0" && (
            <div>
              <label className="block text-sm text-muted mb-1">Initial mass m₀ (kg)</label>
              <input type="number" value={v.m0} onChange={e => setV({ m0: e.target.value })} className={ic} min="0" step="any" />
            </div>
          )}
          {solveFor !== "mf" && (
            <div>
              <label className="block text-sm text-muted mb-1">Final mass mf (kg)</label>
              <input type="number" value={v.mf} onChange={e => setV({ mf: e.target.value })} className={ic} min="0" step="any" />
            </div>
          )}
          {solveFor !== "dv" && (
            <div>
              <label className="block text-sm text-muted mb-1">Δv (m/s)</label>
              <input type="number" value={v.dv} onChange={e => setV({ dv: e.target.value })} className={ic} min="0" step="any" />
            </div>
          )}
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        {result && (
          <div className="mt-4 p-4 bg-card rounded-xl border border-card-border space-y-2">
            <div className="text-sm text-muted mb-1">Results</div>
            <div className="space-y-1 text-xs font-mono">
              {[
                ["Δv",               fmt(result.dv_ms) + " m/s"],
                ["Δv",               fmt(result.dv_ms / 1e3) + " km/s"],
                ["Δv",               fmt(result.dv_ms * 3.6) + " km/h"],
                ["Isp",              fmt(result.isp_s) + " s"],
                ["Initial mass m₀",  fmt(result.m0_kg) + " kg"],
                ["Final mass mf",    fmt(result.mf_kg) + " kg"],
                ["Propellant mass",  fmt(result.propellantMass) + " kg"],
                ["Mass ratio m₀/mf", fmt(result.massRatio)],
                ["Propellant fraction", fmt(result.propellantFrac * 100) + " %"],
              ].map(([label, val]) => (
                <div key={label + val} className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded">
                  <span className="text-muted">{label}</span><span className="font-semibold">{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <p className="text-xs text-muted mb-1">Engine presets:</p>
          <div className="grid grid-cols-3 gap-1">
            {PRESETS.map(p => (
              <button
                key={p.label}
                onClick={() => setV({ solveFor: "dv", isp: p.isp, m0: p.m0, mf: p.mf })}
                className="px-2 py-1.5 text-xs font-mono bg-background border border-card-border rounded hover:bg-primary-light transition-colors text-center"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </CalculatorShell>
  );
}
