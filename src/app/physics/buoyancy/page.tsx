"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";
import { useMemo } from "react";

const inp = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm";

function fmt(n: number) {
  if (!isFinite(n) || isNaN(n)) return "—";
  const abs = Math.abs(n);
  if (abs >= 1e6 || (abs < 0.001 && abs > 0)) return n.toExponential(4);
  return parseFloat(n.toPrecision(6)).toLocaleString("en-US", { maximumFractionDigits: 6 });
}

const G = 9.81; // m/s²

export default function BuoyancyPage() {
  const [v, setV] = useHashState({
    fluidDensity: "1000",
    objectDensity: "500",
    volume: "0.5",
    useVolume: "true",
    width: "1", length: "1", height: "0.5",
  });

  const result = useMemo(() => {
    const rhoFluid = parseFloat(v.fluidDensity);
    const rhoObj = parseFloat(v.objectDensity);
    const vol = v.useVolume === "true"
      ? parseFloat(v.volume)
      : parseFloat(v.width) * parseFloat(v.length) * parseFloat(v.height);

    if (!isFinite(rhoFluid) || !isFinite(vol) || rhoFluid <= 0 || vol <= 0) return null;
    if (!isFinite(rhoObj)) return null;

    const buoyantForce = rhoFluid * G * vol; // N
    const weight = rhoObj * G * vol; // N
    const netForce = buoyantForce - weight; // + = floats, - = sinks
    const floats = netForce >= 0;
    const submergedFraction = floats ? rhoObj / rhoFluid : 1;

    return { buoyantForce, weight, netForce, floats, submergedFraction, vol };
  }, [v]);

  return (
    <CalculatorShell title="Buoyancy Calculator" description="Calculate buoyant force, weight, and whether an object floats or sinks using Archimedes' principle.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-muted mb-1">Fluid Density (kg/m³)</label>
            <input type="number" value={v.fluidDensity} onChange={e => setV({ fluidDensity: e.target.value })} className={inp} min="0" step="any" />
            <p className="text-xs text-muted mt-1">Water: 1000, Seawater: 1025, Oil: ~850</p>
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Object Density (kg/m³)</label>
            <input type="number" value={v.objectDensity} onChange={e => setV({ objectDensity: e.target.value })} className={inp} min="0" step="any" />
            <p className="text-xs text-muted mt-1">Wood: ~500, Steel: 7800, Ice: 917</p>
          </div>
        </div>

        <div>
          <label className="block text-xs text-muted mb-1">Volume Input</label>
          <select value={v.useVolume} onChange={e => setV({ useVolume: e.target.value })} className={inp}>
            <option value="true">Enter volume directly (m³)</option>
            <option value="false">Enter box dimensions (m)</option>
          </select>
        </div>

        {v.useVolume === "true" ? (
          <div>
            <label className="block text-xs text-muted mb-1">Object Volume (m³)</label>
            <input type="number" value={v.volume} onChange={e => setV({ volume: e.target.value })} className={inp} min="0" step="any" />
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {[["width", "Width (m)", v.width], ["length", "Length (m)", v.length], ["height", "Height (m)", v.height]].map(([key, label, val]) => (
              <div key={key}>
                <label className="block text-xs text-muted mb-1">{label}</label>
                <input type="number" value={val} onChange={e => setV({ [key]: e.target.value })} className={inp} min="0" step="any" />
              </div>
            ))}
          </div>
        )}

        {result && (
          <div className="space-y-2">
            <div className={`p-4 rounded-lg border text-center ${result.floats ? "bg-primary-light border-primary/20" : "bg-red-50 border-red-200"}`}>
              <div className="text-xs text-muted mb-1">Result</div>
              <div className={`font-bold text-2xl ${result.floats ? "text-primary" : "text-red-600"}`}>
                {result.floats ? "Floats ✓" : "Sinks ✗"}
              </div>
              {result.floats && (
                <div className="text-sm text-muted mt-1">{(result.submergedFraction * 100).toFixed(1)}% submerged</div>
              )}
            </div>
            {[
              { label: "Buoyant Force (F_b = ρ_fluid × g × V)", value: `${fmt(result.buoyantForce)} N` },
              { label: "Object Weight (W = ρ_obj × g × V)", value: `${fmt(result.weight)} N` },
              { label: "Net Force (F_b − W)", value: `${result.netForce >= 0 ? "+" : ""}${fmt(result.netForce)} N` },
              { label: "Displaced Volume", value: `${fmt(result.vol)} m³` },
            ].map(row => (
              <div key={row.label} className="flex justify-between px-3 py-2 bg-background border border-card-border rounded text-sm">
                <span className="text-muted text-xs">{row.label}</span>
                <span className="font-mono font-semibold">{row.value}</span>
              </div>
            ))}
          </div>
        )}

        <p className="text-xs text-muted">Archimedes' Principle: F_b = ρ_fluid × g × V_displaced. An object floats when its average density is less than the fluid's density.</p>
      </div>
    </CalculatorShell>
  );
}
