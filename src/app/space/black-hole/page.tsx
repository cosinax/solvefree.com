"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
const sc = "w-full px-3 py-2 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm";

const G    = 6.674e-11;
const C    = 299792458;     // m/s
const HBAR = 1.0545718e-34; // J·s
const KB   = 1.380649e-23;  // J/K
const M_SUN = 1.989e30;     // kg

const fmt = (n: number, d = 5) => parseFloat(n.toPrecision(d)).toString();

function fmtBig(n: number): string {
  if (!isFinite(n) || n <= 0) return "∞";
  const yr = n / (365.25 * 86400);
  if (yr > 1e30) return `${fmt(yr / 1e30, 4)} × 10³⁰ yr`;
  if (yr > 1e20) return `${fmt(yr / 1e20, 4)} × 10²⁰ yr`;
  if (yr > 1e10) return `${fmt(yr / 1e10, 4)} × 10¹⁰ yr`;
  if (yr > 1e6)  return `${fmt(yr / 1e6, 4)} × 10⁶ yr`;
  return `${fmt(yr, 4)} yr`;
}

export default function BlackHolePage() {
  const [v, setV] = useHashState({
    massUnit: "solar",
    massValue: "1",
  });

  const massRaw = parseFloat(v.massValue);
  const massKg  = v.massUnit === "solar" ? massRaw * M_SUN : massRaw;

  let error = "";
  interface BHResult {
    rs_m: number;
    hawking_T: number;
    power_W: number;
    evap_s: number;
  }
  let result: BHResult | null = null;

  if (isNaN(massKg) || massKg <= 0) {
    error = "Enter a positive mass.";
  } else {
    const rs_m     = (2 * G * massKg) / (C * C);
    const hawking_T = (HBAR * C * C * C) / (8 * Math.PI * G * massKg * KB);
    const power_W   = (HBAR * Math.pow(C, 6)) / (15360 * Math.PI * G * G * massKg * massKg);
    const evap_s    = (5120 * Math.PI * G * G * Math.pow(massKg, 3)) / (HBAR * Math.pow(C, 4));
    result = { rs_m, hawking_T, power_W, evap_s };
  }

  const MASS_PRESETS = [
    { label: "Stellar (10 M☉)",    value: "10",      unit: "solar" },
    { label: "Sagittarius A*",      value: "4.1e6",   unit: "solar" },
    { label: "M87 BH",              value: "6.5e9",   unit: "solar" },
    { label: "Primordial (1 kg)",   value: "1",       unit: "kg" },
    { label: "Moon mass",           value: "7.342e22", unit: "kg" },
  ];

  return (
    <CalculatorShell
      title="Black Hole Calculator"
      description="Schwarzschild radius, Hawking temperature, radiation power, and evaporation time."
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-muted mb-1">Mass unit</label>
            <select value={v.massUnit} onChange={e => setV({ massUnit: e.target.value })} className={sc}>
              <option value="solar">Solar masses (M☉)</option>
              <option value="kg">Kilograms (kg)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Mass ({v.massUnit === "solar" ? "M☉" : "kg"})</label>
            <input type="text" value={v.massValue} onChange={e => setV({ massValue: e.target.value })} className={ic} placeholder={v.massUnit === "solar" ? "e.g. 1" : "e.g. 1.989e30"} />
          </div>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        {result && (
          <div className="mt-4 p-4 bg-card rounded-xl border border-card-border space-y-2">
            <div className="text-sm text-muted mb-1">Black Hole Properties</div>
            <div className="bg-primary-light rounded-lg p-3 text-center mb-2">
              <span className="text-xs text-muted block">Schwarzschild radius</span>
              <span className="text-2xl font-bold font-mono text-primary">
                {result.rs_m >= 1e3
                  ? fmt(result.rs_m / 1e3) + " km"
                  : result.rs_m >= 1
                    ? fmt(result.rs_m) + " m"
                    : fmt(result.rs_m * 1e2) + " cm"}
              </span>
            </div>
            <div className="space-y-1 text-xs font-mono">
              {[
                ["Mass (kg)",                fmt(massKg) + " kg"],
                ["Mass (M☉)",               fmt(massKg / M_SUN) + " M☉"],
                ["Schwarzschild radius (m)", fmt(result.rs_m) + " m"],
                ["Schwarzschild radius (km)", fmt(result.rs_m / 1e3) + " km"],
                ["Hawking temperature",      fmt(result.hawking_T, 4) + " K"],
                ["Hawking radiation power",  fmt(result.power_W, 4) + " W"],
                ["Evaporation time",         fmtBig(result.evap_s)],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded">
                  <span className="text-muted">{label}</span><span className="font-semibold">{val}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted mt-1">
              Note: Hawking radiation is theoretically predicted but not yet observed. Real astrophysical black holes have negligible radiation.
            </p>
          </div>
        )}

        <div>
          <p className="text-xs text-muted mb-1">Notable black holes:</p>
          <div className="grid grid-cols-2 gap-1 sm:grid-cols-3">
            {MASS_PRESETS.map(p => (
              <button
                key={p.label}
                onClick={() => setV({ massUnit: p.unit, massValue: p.value })}
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
