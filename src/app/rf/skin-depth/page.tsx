"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
const sc = "w-full px-3 py-2 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm";

const fmt = (n: number, d = 5) => parseFloat(n.toPrecision(d)).toString();

const MU0 = 4 * Math.PI * 1e-7; // H/m

const freqMultipliers: Record<string, number> = { Hz: 1, kHz: 1e3, MHz: 1e6, GHz: 1e9 };

type MaterialKey = "copper" | "aluminum" | "silver" | "gold" | "custom";

const materials: Record<MaterialKey, { label: string; sigma: number }> = {
  copper:   { label: "Copper (σ = 5.96×10⁷ S/m)",   sigma: 5.96e7 },
  aluminum: { label: "Aluminum (σ = 3.77×10⁷ S/m)", sigma: 3.77e7 },
  silver:   { label: "Silver (σ = 6.30×10⁷ S/m)",   sigma: 6.30e7 },
  gold:     { label: "Gold (σ = 4.10×10⁷ S/m)",     sigma: 4.10e7 },
  custom:   { label: "Custom",                        sigma: 0 },
};

export default function SkinDepthPage() {
  const [v, setV] = useHashState({
    freqVal: "1",
    freqUnit: "MHz",
    material: "copper",
    customSigma: "5.96e7",
  });

  const fHz = parseFloat(v.freqVal) * (freqMultipliers[v.freqUnit] ?? 1e6);
  const matKey = v.material as MaterialKey;
  const sigma =
    matKey === "custom"
      ? parseFloat(v.customSigma)
      : materials[matKey]?.sigma ?? 0;

  const valid = isFinite(fHz) && fHz > 0 && isFinite(sigma) && sigma > 0;

  let deltaM: number | null = null;
  let deltaUm: number | null = null;
  let deltaMm: number | null = null;
  let freqFor1mm: number | null = null;

  if (valid) {
    const rho = 1 / sigma;
    deltaM = Math.sqrt(rho / (Math.PI * fHz * MU0));
    deltaUm = deltaM * 1e6;
    deltaMm = deltaM * 1e3;
    // f where delta = 1 mm: delta = sqrt(rho/(pi*f*mu0)) => f = rho/(pi*delta^2*mu0)
    const delta1mm = 1e-3;
    freqFor1mm = rho / (Math.PI * delta1mm * delta1mm * MU0);
  }

  return (
    <CalculatorShell
      title="Skin Depth Calculator"
      description="Calculate the RF skin depth in conductors by frequency and material. δ = √(ρ / (π × f × μ₀))"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-muted mb-1">Frequency</label>
            <input
              type="number"
              value={v.freqVal}
              onChange={(e) => setV({ freqVal: e.target.value })}
              className={ic}
              placeholder="1"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Unit</label>
            <select value={v.freqUnit} onChange={(e) => setV({ freqUnit: e.target.value })} className={sc}>
              {Object.keys(freqMultipliers).map((u) => (
                <option key={u}>{u}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm text-muted mb-1">Material</label>
          <select value={v.material} onChange={(e) => setV({ material: e.target.value })} className={sc}>
            {(Object.keys(materials) as MaterialKey[]).map((k) => (
              <option key={k} value={k}>{materials[k].label}</option>
            ))}
          </select>
        </div>

        {matKey === "custom" && (
          <div>
            <label className="block text-sm text-muted mb-1">Conductivity σ (S/m)</label>
            <input
              type="text"
              value={v.customSigma}
              onChange={(e) => setV({ customSigma: e.target.value })}
              className={ic}
              placeholder="e.g. 5.96e7"
            />
          </div>
        )}

        {valid && deltaUm !== null && deltaMm !== null && (
          <div className="mt-4 space-y-3">
            <div className="p-4 bg-card rounded-xl border border-card-border">
              <div className="text-sm text-muted mb-1">Skin Depth (δ)</div>
              <div className="text-3xl font-bold font-mono">{fmt(deltaUm, 5)} μm</div>
              <div className="text-sm text-muted mt-1 font-mono">{fmt(deltaMm, 5)} mm</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-card rounded-xl border border-card-border">
                <div className="text-xs text-muted mb-1">Skin Depth (μm)</div>
                <div className="text-lg font-bold font-mono">{fmt(deltaUm, 5)}</div>
              </div>
              <div className="p-3 bg-card rounded-xl border border-card-border">
                <div className="text-xs text-muted mb-1">Skin Depth (mm)</div>
                <div className="text-lg font-bold font-mono">{fmt(deltaMm, 5)}</div>
              </div>
            </div>
            {freqFor1mm !== null && (
              <div className="p-3 bg-card rounded-xl border border-card-border">
                <div className="text-xs text-muted mb-1">Frequency for δ = 1 mm</div>
                <div className="text-base font-bold font-mono">
                  {freqFor1mm >= 1e6
                    ? `${fmt(freqFor1mm / 1e6, 4)} MHz`
                    : freqFor1mm >= 1e3
                    ? `${fmt(freqFor1mm / 1e3, 4)} kHz`
                    : `${fmt(freqFor1mm, 4)} Hz`}
                </div>
              </div>
            )}
          </div>
        )}

        {!valid && (
          <div className="mt-2 text-sm text-muted">Enter a positive frequency and select a material to calculate.</div>
        )}

        <div className="text-xs text-muted border-t border-card-border pt-3 space-y-1">
          <div>δ = √(ρ / (π × f × μ₀))</div>
          <div>ρ = 1/σ (resistivity), μ₀ = 4π×10⁻⁷ H/m</div>
        </div>
      </div>
    </CalculatorShell>
  );
}
