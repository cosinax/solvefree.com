"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
const sc = "w-full px-3 py-2 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm";

const fmt = (n: number, d = 5) => parseFloat(n.toPrecision(d)).toString();

const C = 299_792_458;

type AntennaType = "isotropic" | "dipole" | "yagi" | "dish" | "manual";

const presetGains: Record<string, number> = {
  isotropic: 0,
  dipole: 2.15,
  yagi: 10,
  dish: 30,
};

const antennaLabels: Record<string, string> = {
  isotropic: "Isotropic (0 dBi)",
  dipole: "Half-wave Dipole (2.15 dBi)",
  yagi: "Yagi (typ. 10 dBi)",
  dish: "Parabolic Dish (calculated)",
  manual: "Manual entry",
};

export default function AntennaGainPage() {
  const [v, setV] = useHashState({
    antennaType: "dish",
    manualGain: "20",
    dishEff: "0.6",
    dishDiam: "0.6",
    dishFreq: "12",
  });

  const type = v.antennaType as AntennaType;

  let gainDbi: number | null = null;
  let isDish = false;

  if (type === "dish") {
    isDish = true;
    const eta = parseFloat(v.dishEff);
    const D = parseFloat(v.dishDiam);
    const fGHz = parseFloat(v.dishFreq);
    if ([eta, D, fGHz].every((x) => isFinite(x) && x > 0) && eta <= 1) {
      const fHz = fGHz * 1e9;
      const lambda = C / fHz;
      const gainLinear = eta * Math.pow((Math.PI * D) / lambda, 2);
      gainDbi = 10 * Math.log10(gainLinear);
    }
  } else if (type === "manual") {
    const g = parseFloat(v.manualGain);
    if (isFinite(g)) gainDbi = g;
  } else {
    gainDbi = presetGains[type] ?? null;
  }

  let ae: number | null = null;
  let beamwidth: number | null = null;

  if (gainDbi !== null) {
    const gainLinear = Math.pow(10, gainDbi / 10);

    // Effective aperture requires a frequency reference — use dish freq for dish, else show formula note
    if (type === "dish" || type === "manual") {
      const fGHz = parseFloat(type === "dish" ? v.dishFreq : "1");
      if (isFinite(fGHz) && fGHz > 0) {
        const lambda = C / (fGHz * 1e9);
        ae = (lambda * lambda * gainLinear) / (4 * Math.PI);
      }
    }

    if (isDish) {
      const D = parseFloat(v.dishDiam);
      const fGHz = parseFloat(v.dishFreq);
      if (isFinite(D) && D > 0 && isFinite(fGHz) && fGHz > 0) {
        const lambda = C / (fGHz * 1e9);
        beamwidth = (65 * lambda) / D;
      }
    }
  }

  return (
    <CalculatorShell
      title="Antenna Gain & Effective Aperture"
      description="Calculate antenna gain (dBi), effective aperture, and beamwidth for various antenna types."
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-muted mb-1">Antenna Type</label>
          <select
            value={v.antennaType}
            onChange={(e) => setV({ antennaType: e.target.value })}
            className={sc}
          >
            {Object.entries(antennaLabels).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>

        {type === "manual" && (
          <div>
            <label className="block text-sm text-muted mb-1">Gain (dBi)</label>
            <input
              type="number"
              value={v.manualGain}
              onChange={(e) => setV({ manualGain: e.target.value })}
              className={ic}
              placeholder="e.g. 20"
            />
            <p className="text-xs text-muted mt-1">Effective aperture calculated at 1 GHz reference.</p>
          </div>
        )}

        {type === "dish" && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-muted mb-1">Diameter (m)</label>
                <input
                  type="number"
                  value={v.dishDiam}
                  onChange={(e) => setV({ dishDiam: e.target.value })}
                  className={ic}
                  placeholder="0.6"
                  min="0.01"
                  step="0.1"
                />
              </div>
              <div>
                <label className="block text-sm text-muted mb-1">Frequency (GHz)</label>
                <input
                  type="number"
                  value={v.dishFreq}
                  onChange={(e) => setV({ dishFreq: e.target.value })}
                  className={ic}
                  placeholder="12"
                  min="0.001"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-muted mb-1">Efficiency η (0–1, default 0.6)</label>
              <input
                type="number"
                value={v.dishEff}
                onChange={(e) => setV({ dishEff: e.target.value })}
                className={ic}
                min="0.01"
                max="1"
                step="0.01"
                placeholder="0.6"
              />
            </div>
          </div>
        )}

        {(type === "isotropic" || type === "dipole" || type === "yagi") && (
          <div className="p-3 bg-card rounded-xl border border-card-border text-sm text-muted">
            Using typical gain for {antennaLabels[type]}. Effective aperture varies with frequency.
          </div>
        )}

        {gainDbi !== null && (
          <div className="mt-4 space-y-3">
            <div className="p-4 bg-card rounded-xl border border-card-border">
              <div className="text-sm text-muted mb-1">Gain</div>
              <div className="text-3xl font-bold font-mono">{fmt(gainDbi, 5)} dBi</div>
              <div className="text-xs text-muted mt-1">
                {fmt(Math.pow(10, gainDbi / 10), 5)} (linear)
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {ae !== null && (
                <div className="p-3 bg-card rounded-xl border border-card-border">
                  <div className="text-xs text-muted mb-1">Effective Aperture (Ae)</div>
                  <div className="text-base font-bold font-mono">{fmt(ae, 4)} m²</div>
                  <div className="text-xs text-muted">λ²G / 4π</div>
                </div>
              )}
              {beamwidth !== null && (
                <div className="p-3 bg-card rounded-xl border border-card-border">
                  <div className="text-xs text-muted mb-1">Beamwidth (est.)</div>
                  <div className="text-base font-bold font-mono">{fmt(beamwidth, 4)}°</div>
                  <div className="text-xs text-muted">65λ/D</div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="text-xs text-muted border-t border-card-border pt-3 space-y-1">
          <div>Dish gain: G = η × (πD/λ)²</div>
          <div>Effective aperture: Ae = λ²G / 4π</div>
          <div>Beamwidth: θ ≈ 65λ/D degrees</div>
        </div>
      </div>
    </CalculatorShell>
  );
}
