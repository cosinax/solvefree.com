"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";
import { useMemo } from "react";

const inp = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm";
const R_GAS = 8.314; // J/(mol·K)

function fmt(n: number, d = 5): string {
  if (!isFinite(n) || isNaN(n)) return "—";
  const abs = Math.abs(n);
  if (abs >= 1e6 || (abs < 0.001 && abs > 0)) return n.toExponential(4);
  return parseFloat(n.toPrecision(d)).toString();
}

export default function IdealGasPage() {
  const [v, setV] = useHashState({
    mode: "P",
    P: "101325", Punit: "Pa",
    V: "0.0224", Vunit: "m3",
    n: "1",
    T: "273.15", Tunit: "K",
  });

  const P_UNITS: Record<string, number> = { Pa: 1, kPa: 1e3, MPa: 1e6, atm: 101325, bar: 1e5, psi: 6894.76, mmHg: 133.322 };
  const V_UNITS: Record<string, number> = { m3: 1, L: 0.001, mL: 1e-6, ft3: 0.0283168 };

  const result = useMemo(() => {
    const toKelvin = (t: number, unit: string) =>
      unit === "K" ? t : unit === "C" ? t + 273.15 : (t + 459.67) * 5 / 9;

    const P_Pa = parseFloat(v.P) * (P_UNITS[v.Punit] ?? 1);
    const V_m3 = parseFloat(v.V) * (V_UNITS[v.Vunit] ?? 1);
    const n = parseFloat(v.n);
    const T_K = toKelvin(parseFloat(v.T), v.Tunit);

    if (v.mode === "P") {
      if (!isFinite(V_m3) || !isFinite(n) || !isFinite(T_K) || V_m3 <= 0 || n <= 0 || T_K <= 0) return null;
      const P = n * R_GAS * T_K / V_m3;
      return { label: "Pressure", value: `${fmt(P)} Pa`, extra: `${fmt(P / 1e3)} kPa · ${fmt(P / 101325)} atm` };
    } else if (v.mode === "V") {
      if (!isFinite(P_Pa) || !isFinite(n) || !isFinite(T_K) || P_Pa <= 0 || n <= 0 || T_K <= 0) return null;
      const V = n * R_GAS * T_K / P_Pa;
      return { label: "Volume", value: `${fmt(V)} m³`, extra: `${fmt(V * 1000)} L` };
    } else if (v.mode === "n") {
      if (!isFinite(P_Pa) || !isFinite(V_m3) || !isFinite(T_K) || P_Pa <= 0 || V_m3 <= 0 || T_K <= 0) return null;
      const mol = P_Pa * V_m3 / (R_GAS * T_K);
      return { label: "Amount", value: `${fmt(mol)} mol`, extra: `${fmt(mol * 28.97)} g (if air)` };
    } else {
      if (!isFinite(P_Pa) || !isFinite(V_m3) || !isFinite(n) || P_Pa <= 0 || V_m3 <= 0 || n <= 0) return null;
      const T = P_Pa * V_m3 / (n * R_GAS);
      return { label: "Temperature", value: `${fmt(T)} K`, extra: `${fmt(T - 273.15)}°C · ${fmt(T * 9 / 5 - 459.67)}°F` };
    }
  }, [v]);

  return (
    <CalculatorShell title="Ideal Gas Law Calculator" description="PV = nRT — find pressure, volume, moles, or temperature.">
      <div className="space-y-4">
        <div>
          <label className="block text-xs text-muted mb-1">Solve for</label>
          <div className="flex flex-wrap gap-2">
            {[{ k: "P", l: "Pressure (P)" }, { k: "V", l: "Volume (V)" }, { k: "n", l: "Moles (n)" }, { k: "T", l: "Temp (T)" }].map(m => (
              <button key={m.k} onClick={() => setV({ mode: m.k })}
                className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${v.mode === m.k ? "bg-primary text-white border-primary" : "bg-card border-card-border hover:bg-primary-light"}`}>
                {m.l}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {v.mode !== "P" && (
            <div>
              <label className="block text-xs text-muted mb-1">Pressure</label>
              <div className="flex gap-2">
                <input type="number" value={v.P} onChange={e => setV({ P: e.target.value })} className={inp} min="0" step="any" />
                <select value={v.Punit} onChange={e => setV({ Punit: e.target.value })} className="px-2 py-2 text-xs bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                  {Object.keys(P_UNITS).map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>
          )}
          {v.mode !== "V" && (
            <div>
              <label className="block text-xs text-muted mb-1">Volume</label>
              <div className="flex gap-2">
                <input type="number" value={v.V} onChange={e => setV({ V: e.target.value })} className={inp} min="0" step="any" />
                <select value={v.Vunit} onChange={e => setV({ Vunit: e.target.value })} className="px-2 py-2 text-xs bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                  {Object.keys(V_UNITS).map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>
          )}
          {v.mode !== "n" && (
            <div>
              <label className="block text-xs text-muted mb-1">Moles (n)</label>
              <input type="number" value={v.n} onChange={e => setV({ n: e.target.value })} className={inp} min="0" step="any" />
            </div>
          )}
          {v.mode !== "T" && (
            <div>
              <label className="block text-xs text-muted mb-1">Temperature</label>
              <div className="flex gap-2">
                <input type="number" value={v.T} onChange={e => setV({ T: e.target.value })} className={inp} step="any" />
                <select value={v.Tunit} onChange={e => setV({ Tunit: e.target.value })} className="px-2 py-2 text-xs bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                  {["K", "C", "F"].map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>
          )}
        </div>

        {result && (
          <div className="space-y-3">
            <div className="p-4 bg-primary-light border border-primary/20 rounded-lg text-center">
              <div className="text-xs text-muted mb-1">{result.label}</div>
              <div className="font-mono font-bold text-2xl text-primary">{result.value}</div>
              {result.extra && <div className="text-xs text-muted mt-1">{result.extra}</div>}
            </div>
            <p className="text-xs text-muted">PV = nRT · R = 8.314 J/(mol·K). Valid for ideal (non-interacting) gas molecules.</p>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
