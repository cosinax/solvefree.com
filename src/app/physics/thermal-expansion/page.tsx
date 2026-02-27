"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
const sc = "w-full px-3 py-2 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm";

const MATERIALS = [
  { name: "Steel", alpha: 12e-6 },
  { name: "Aluminum", alpha: 23e-6 },
  { name: "Copper", alpha: 17e-6 },
  { name: "Brass", alpha: 19e-6 },
  { name: "Iron", alpha: 11.8e-6 },
  { name: "Concrete", alpha: 12e-6 },
  { name: "Glass (soda-lime)", alpha: 8.5e-6 },
  { name: "Glass (borosilicate)", alpha: 3.3e-6 },
  { name: "Invar", alpha: 1.2e-6 },
  { name: "Titanium", alpha: 8.6e-6 },
  { name: "PVC plastic", alpha: 52e-6 },
  { name: "Nylon", alpha: 80e-6 },
  { name: "Wood (oak, along grain)", alpha: 5e-6 },
  { name: "Custom", alpha: 0 },
];

export default function ThermalExpansionPage() {
  const [v, setV] = useHashState({
    material: "Steel",
    customAlpha: "",
    length0: "",
    deltaT: "",
    volume0: "",
    tempUnit: "C",
  });

  const mat = MATERIALS.find(m => m.name === v.material) || MATERIALS[0];
  const alpha = v.material === "Custom" ? parseFloat(v.customAlpha) / 1e6 : mat.alpha;
  const beta = 3 * alpha;

  const L0 = parseFloat(v.length0);
  const dT = parseFloat(v.deltaT);
  const V0 = parseFloat(v.volume0);

  let deltaL: number | null = null;
  let L1: number | null = null;
  let deltaV: number | null = null;
  let V1: number | null = null;

  if (!isNaN(alpha) && !isNaN(dT)) {
    if (!isNaN(L0)) {
      deltaL = alpha * L0 * dT;
      L1 = L0 + deltaL;
    }
    if (!isNaN(V0)) {
      deltaV = beta * V0 * dT;
      V1 = V0 + deltaV;
    }
  }

  const fmt = (n: number) => {
    if (Math.abs(n) < 0.001 && n !== 0) return n.toExponential(4);
    return parseFloat(n.toPrecision(5)).toString();
  };

  return (
    <CalculatorShell
      title="Thermal Expansion Calculator"
      description="Calculate linear (ΔL = α·L₀·ΔT) and volumetric (ΔV = β·V₀·ΔT, β ≈ 3α) thermal expansion for common materials."
    >
      <div className="space-y-5">
        <div>
          <label className="block text-sm text-muted mb-1">Material</label>
          <select value={v.material} onChange={e => setV({ material: e.target.value })} className={sc}>
            {MATERIALS.map(m => <option key={m.name} value={m.name}>{m.name}{m.name !== "Custom" ? ` (α = ${(m.alpha * 1e6).toFixed(1)} ×10⁻⁶/°C)` : ""}</option>)}
          </select>
        </div>

        {v.material === "Custom" && (
          <div>
            <label className="block text-sm text-muted mb-1">Custom α (×10⁻⁶ /°C)</label>
            <input type="number" value={v.customAlpha} onChange={e => setV({ customAlpha: e.target.value })} placeholder="e.g. 12" className={ic} />
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-muted mb-1">Temperature change (ΔT)</label>
            <input type="number" value={v.deltaT} onChange={e => setV({ deltaT: e.target.value })} placeholder="e.g. 50" className={ic} />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">ΔT unit</label>
            <select value={v.tempUnit} onChange={e => setV({ tempUnit: e.target.value })} className={sc}>
              <option value="C">°C / K (same diff)</option>
              <option value="F">°F</option>
            </select>
          </div>
        </div>

        <div className="border border-card-border rounded-xl p-4 space-y-3">
          <h3 className="text-sm font-semibold">Linear Expansion — ΔL = α × L₀ × ΔT</h3>
          <div>
            <label className="block text-xs text-muted mb-1">Original length (L₀)</label>
            <input type="number" value={v.length0} onChange={e => setV({ length0: e.target.value })} placeholder="e.g. 10 (any unit)" className={ic} />
          </div>
          {deltaL !== null && L1 !== null && (
            <div className="space-y-2">
              <div className="bg-primary-light rounded-xl p-3 text-center">
                <span className="block text-xs text-muted">Expansion ΔL</span>
                <span className="block font-mono font-bold text-3xl text-primary">{fmt(deltaL)}</span>
              </div>
              <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
                <span className="text-muted">New length (L₁ = L₀ + ΔL)</span>
                <span>{fmt(L1)}</span>
              </div>
              <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
                <span className="text-muted">α used</span>
                <span>{(alpha * 1e6).toFixed(2)} ×10⁻⁶ /°C</span>
              </div>
            </div>
          )}
        </div>

        <div className="border border-card-border rounded-xl p-4 space-y-3">
          <h3 className="text-sm font-semibold">Volumetric Expansion — ΔV = β × V₀ × ΔT (β ≈ 3α)</h3>
          <div>
            <label className="block text-xs text-muted mb-1">Original volume (V₀)</label>
            <input type="number" value={v.volume0} onChange={e => setV({ volume0: e.target.value })} placeholder="e.g. 100 (any unit)" className={ic} />
          </div>
          {deltaV !== null && V1 !== null && (
            <div className="space-y-2">
              <div className="bg-primary-light rounded-xl p-3 text-center">
                <span className="block text-xs text-muted">Expansion ΔV</span>
                <span className="block font-mono font-bold text-3xl text-primary">{fmt(deltaV)}</span>
              </div>
              <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
                <span className="text-muted">New volume (V₁ = V₀ + ΔV)</span>
                <span>{fmt(V1)}</span>
              </div>
              <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
                <span className="text-muted">β used (= 3α)</span>
                <span>{(beta * 1e6).toFixed(2)} ×10⁻⁶ /°C</span>
              </div>
            </div>
          )}
        </div>

        <div className="text-xs text-muted">
          <p>Units for length/volume can be any (m, cm, mm, etc.) — output is in same units.</p>
          {v.tempUnit === "F" && <p>Note: ΔT in °F is converted (ΔT_C = ΔT_F × 5/9).</p>}
        </div>
      </div>
    </CalculatorShell>
  );
}
