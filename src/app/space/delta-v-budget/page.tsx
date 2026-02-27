"use client";
import { useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
const sc = "w-full px-3 py-2 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm";

const fmt = (n: number, d = 4) => parseFloat(n.toPrecision(d)).toString();

interface ManeuverRef {
  label: string;
  dv: number; // km/s
}

const MANEUVER_REFS: ManeuverRef[] = [
  { label: "Earth surface → LEO",         dv: 9.3 },
  { label: "LEO → GEO",                   dv: 3.9 },
  { label: "LEO → Moon (landing)",         dv: 5.8 },
  { label: "LEO → Mars (Hohmann)",         dv: 5.6 },
  { label: "LEO → Venus",                  dv: 3.5 },
  { label: "LEO → Jupiter",               dv: 9.2 },
  { label: "GEO → escape (Earth SOI)",     dv: 1.5 },
  { label: "Lunar descent & landing",      dv: 1.9 },
  { label: "Mars EDL (aerobraking)",       dv: 0.5 },
  { label: "Mars ascent → orbit",          dv: 4.1 },
  { label: "LEO plane change 45°",         dv: 5.2 },
  { label: "Custom",                       dv: 0 },
];

interface ManeuverRow {
  id: number;
  maneuverIdx: number;
  customDv: string;
}

export default function DeltaVBudgetPage() {
  const [v, setV] = useHashState({ vehicleDv: "10" });
  const [maneuvers, setManeuvers] = useState<ManeuverRow[]>([
    { id: 1, maneuverIdx: 0, customDv: "" },
    { id: 2, maneuverIdx: 1, customDv: "" },
  ]);
  const [nextId, setNextId] = useState(3);

  function addManeuver() {
    if (maneuvers.length >= 10) return;
    setManeuvers(m => [...m, { id: nextId, maneuverIdx: 0, customDv: "" }]);
    setNextId(n => n + 1);
  }

  function removeManeuver(id: number) {
    setManeuvers(m => m.filter(r => r.id !== id));
  }

  function updateManeuver(id: number, field: keyof ManeuverRow, value: string | number) {
    setManeuvers(m => m.map(r => r.id === id ? { ...r, [field]: value } : r));
  }

  function dvFor(row: ManeuverRow): number {
    const ref = MANEUVER_REFS[row.maneuverIdx];
    if (ref.label === "Custom") {
      const v = parseFloat(row.customDv);
      return isNaN(v) ? 0 : v;
    }
    return ref.dv;
  }

  const totalDv = maneuvers.reduce((sum, row) => sum + dvFor(row), 0);
  const vehicleDv = parseFloat(v.vehicleDv);
  const remaining = isNaN(vehicleDv) ? null : vehicleDv - totalDv;

  return (
    <CalculatorShell
      title="Delta-V Budget Estimator"
      description="Stack mission maneuvers and sum total Δv. Compare against vehicle Δv capacity."
    >
      <div className="space-y-4">
        {/* Reference table */}
        <details className="border border-card-border rounded-lg">
          <summary className="px-3 py-2 text-sm cursor-pointer hover:bg-primary-light rounded-lg transition-colors text-muted">
            Reference: Common Δv costs (click to expand)
          </summary>
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono border-t border-card-border">
              <thead>
                <tr className="bg-card">
                  <th className="text-left px-3 py-2 text-muted font-medium">Maneuver</th>
                  <th className="text-right px-3 py-2 text-muted font-medium">Δv (km/s)</th>
                </tr>
              </thead>
              <tbody>
                {MANEUVER_REFS.filter(r => r.label !== "Custom").map(r => (
                  <tr key={r.label} className="border-t border-card-border">
                    <td className="px-3 py-1.5">{r.label}</td>
                    <td className="px-3 py-1.5 text-right">{r.dv}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>

        {/* Vehicle Dv */}
        <div>
          <label className="block text-sm text-muted mb-1">Vehicle total Δv capacity (km/s)</label>
          <input type="number" value={v.vehicleDv} onChange={e => setV({ vehicleDv: e.target.value })} className={ic} min="0" step="any" />
        </div>

        {/* Maneuver rows */}
        <div className="space-y-2">
          <div className="text-sm text-muted mb-1">Mission maneuvers</div>
          {maneuvers.map((row, idx) => {
            const ref = MANEUVER_REFS[row.maneuverIdx];
            const isCustom = ref.label === "Custom";
            return (
              <div key={row.id} className="flex gap-2 items-start">
                <span className="text-xs text-muted pt-3 min-w-[18px]">{idx + 1}.</span>
                <div className="flex-1 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <select
                    value={row.maneuverIdx}
                    onChange={e => updateManeuver(row.id, "maneuverIdx", parseInt(e.target.value))}
                    className={sc}
                  >
                    {MANEUVER_REFS.map((m, i) => (
                      <option key={m.label} value={i}>{m.label}{m.label !== "Custom" ? ` (${m.dv} km/s)` : ""}</option>
                    ))}
                  </select>
                  {isCustom && (
                    <input
                      type="number"
                      placeholder="Δv (km/s)"
                      value={row.customDv}
                      onChange={e => updateManeuver(row.id, "customDv", e.target.value)}
                      className={ic}
                      min="0"
                      step="any"
                    />
                  )}
                </div>
                <button
                  onClick={() => removeManeuver(row.id)}
                  className="mt-2.5 text-muted hover:text-red-500 text-sm px-1.5"
                  title="Remove"
                >
                  ✕
                </button>
              </div>
            );
          })}
          {maneuvers.length < 10 && (
            <button
              onClick={addManeuver}
              className="text-sm text-primary hover:underline mt-1"
            >
              + Add maneuver
            </button>
          )}
        </div>

        {/* Results */}
        <div className="mt-4 p-4 bg-card rounded-xl border border-card-border space-y-2">
          <div className="text-sm text-muted mb-1">Budget Summary</div>
          <div className="space-y-1 text-xs font-mono">
            <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded">
              <span className="text-muted">Total mission Δv</span>
              <span className="font-bold text-primary">{fmt(totalDv)} km/s = {fmt(totalDv * 1e3)} m/s</span>
            </div>
            {!isNaN(vehicleDv) && vehicleDv > 0 && (
              <>
                <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded">
                  <span className="text-muted">Vehicle capacity</span>
                  <span className="font-semibold">{fmt(vehicleDv)} km/s</span>
                </div>
                <div className={`flex justify-between px-3 py-1.5 border rounded ${remaining !== null && remaining < 0 ? "bg-red-50 border-red-300 dark:bg-red-900/20 dark:border-red-700" : "bg-background border-card-border"}`}>
                  <span className="text-muted">Remaining budget</span>
                  <span className={`font-semibold ${remaining !== null && remaining < 0 ? "text-red-500" : ""}`}>
                    {remaining !== null ? fmt(remaining) + " km/s" : "—"}
                  </span>
                </div>
                {remaining !== null && remaining < 0 && (
                  <p className="text-xs text-red-500 px-1">
                    Mission requires {fmt(Math.abs(remaining))} km/s more than vehicle capacity.
                  </p>
                )}
              </>
            )}
          </div>
          {maneuvers.length > 0 && (
            <div className="mt-2">
              <p className="text-xs text-muted mb-1">Breakdown:</p>
              {maneuvers.map((row, idx) => {
                const dv = dvFor(row);
                const pct = totalDv > 0 ? (dv / totalDv) * 100 : 0;
                return (
                  <div key={row.id} className="flex justify-between text-xs font-mono px-3 py-1 bg-background border border-card-border rounded mb-1">
                    <span className="text-muted">{idx + 1}. {MANEUVER_REFS[row.maneuverIdx].label}</span>
                    <span>{fmt(dv)} km/s ({fmt(pct, 3)}%)</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </CalculatorShell>
  );
}
