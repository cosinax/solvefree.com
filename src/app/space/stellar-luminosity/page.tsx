"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
const sc = "w-full px-3 py-2 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm";

const SIGMA  = 5.6704e-8;   // W/m²/K⁴
const R_SUN  = 6.957e8;     // m
const L_SUN  = 3.828e26;    // W
const M_SUN_ABS = 4.83;     // Absolute magnitude

const fmt = (n: number, d = 5) => parseFloat(n.toPrecision(d)).toString();

function spectralClass(T: number): string {
  if (T >= 30000) return "O (blue, very hot)";
  if (T >= 10000) return "B (blue-white)";
  if (T >= 7500)  return "A (white)";
  if (T >= 6000)  return "F (yellow-white)";
  if (T >= 5200)  return "G (yellow, like Sun)";
  if (T >= 3700)  return "K (orange)";
  return "M (red, cool)";
}

const STAR_PRESETS = [
  { label: "Sun",          T: "5778",  R: "1",     mode: "TR" },
  { label: "Sirius A",     T: "9940",  R: "1.711", mode: "TR" },
  { label: "Betelgeuse",   T: "3600",  R: "764",   mode: "TR" },
  { label: "Rigel",        T: "12100", R: "78.9",  mode: "TR" },
  { label: "Proxima Cen",  T: "3042",  R: "0.1542",mode: "TR" },
];

export default function StellarLuminosityPage() {
  const [v, setV] = useHashState({
    mode: "TR",        // "TR" = T+R → L, "L" = L → ...
    T: "5778",         // K
    R: "1",            // solar radii
    L: "1",            // solar luminosities
    Lunit: "solar",    // "solar" or "W"
  });

  let error = "";
  interface StellarResult {
    L_W: number;
    L_solar: number;
    T_K: number;
    R_m: number;
    R_solar: number;
    abs_mag: number;
    hz_inner: number;
    hz_outer: number;
  }
  let result: StellarResult | null = null;

  if (v.mode === "TR") {
    const T = parseFloat(v.T);
    const R_solar = parseFloat(v.R);
    if (isNaN(T) || T <= 0) error = "Enter valid temperature.";
    else if (isNaN(R_solar) || R_solar <= 0) error = "Enter valid radius.";
    else {
      const R_m = R_solar * R_SUN;
      const L_W = 4 * Math.PI * R_m * R_m * SIGMA * Math.pow(T, 4);
      const L_solar = L_W / L_SUN;
      const abs_mag = M_SUN_ABS - 2.5 * Math.log10(L_solar);
      const hz_inner = Math.sqrt(L_solar / 1.1);
      const hz_outer = Math.sqrt(L_solar / 0.53);
      result = { L_W, L_solar, T_K: T, R_m, R_solar, abs_mag, hz_inner, hz_outer };
    }
  } else {
    const L_solar = v.Lunit === "solar" ? parseFloat(v.L) : parseFloat(v.L) / L_SUN;
    if (isNaN(L_solar) || L_solar <= 0) error = "Enter valid luminosity.";
    else {
      const L_W = L_solar * L_SUN;
      const abs_mag = M_SUN_ABS - 2.5 * Math.log10(L_solar);
      const hz_inner = Math.sqrt(L_solar / 1.1);
      const hz_outer = Math.sqrt(L_solar / 0.53);
      // Can't derive T and R separately without more info; show what we can
      result = { L_W, L_solar, T_K: NaN, R_m: NaN, R_solar: NaN, abs_mag, hz_inner, hz_outer };
    }
  }

  return (
    <CalculatorShell
      title="Stellar Luminosity & Properties"
      description="L = 4πR²σT⁴ — luminosity, absolute magnitude, and habitable zone from temperature and radius."
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-muted mb-1">Input mode</label>
          <select value={v.mode} onChange={e => setV({ mode: e.target.value })} className={sc}>
            <option value="TR">Temperature + Radius → Luminosity</option>
            <option value="L">Luminosity → Magnitude + Habitable Zone</option>
          </select>
        </div>

        {v.mode === "TR" ? (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-muted mb-1">Temperature (K)</label>
              <input type="number" value={v.T} onChange={e => setV({ T: e.target.value })} className={ic} min="0" step="any" />
            </div>
            <div>
              <label className="block text-sm text-muted mb-1">Radius (R☉)</label>
              <input type="number" value={v.R} onChange={e => setV({ R: e.target.value })} className={ic} min="0" step="any" />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-muted mb-1">Luminosity unit</label>
              <select value={v.Lunit} onChange={e => setV({ Lunit: e.target.value })} className={sc}>
                <option value="solar">Solar luminosities (L☉)</option>
                <option value="W">Watts</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-muted mb-1">Luminosity ({v.Lunit === "solar" ? "L☉" : "W"})</label>
              <input type="text" value={v.L} onChange={e => setV({ L: e.target.value })} className={ic} placeholder={v.Lunit === "solar" ? "e.g. 1" : "e.g. 3.828e26"} />
            </div>
          </div>
        )}

        {error && <p className="text-sm text-red-500">{error}</p>}

        {result && (
          <div className="mt-4 p-4 bg-card rounded-xl border border-card-border space-y-2">
            <div className="text-sm text-muted mb-1">Stellar Properties</div>
            <div className="bg-primary-light rounded-lg p-3 text-center mb-2">
              <span className="text-xs text-muted block">Luminosity</span>
              <span className="text-2xl font-bold font-mono text-primary">{fmt(result.L_solar)} L☉</span>
            </div>
            <div className="space-y-1 text-xs font-mono">
              {[
                ["Luminosity (L☉)",          fmt(result.L_solar) + " L☉"],
                ["Luminosity (W)",            fmt(result.L_W, 4) + " W"],
                ...(v.mode === "TR" && !isNaN(result.T_K) ? [
                  ["Temperature",              fmt(result.T_K) + " K"],
                  ["Spectral class (approx)", spectralClass(result.T_K)],
                  ["Radius (R☉)",             fmt(result.R_solar) + " R☉"],
                  ["Radius (m)",              fmt(result.R_m, 4) + " m"],
                ] : []),
                ["Absolute magnitude",         fmt(result.abs_mag, 4)],
                ["Habitable zone inner",       fmt(result.hz_inner, 4) + " AU"],
                ["Habitable zone outer",       fmt(result.hz_outer, 4) + " AU"],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded">
                  <span className="text-muted">{label}</span><span className="font-semibold">{val}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted mt-1">
              Habitable zone uses simple flux model: inner at 1.1 S☉, outer at 0.53 S☉ (Kopparapu approximation).
            </p>
          </div>
        )}

        <div>
          <p className="text-xs text-muted mb-1">Famous stars:</p>
          <div className="grid grid-cols-3 gap-1 sm:grid-cols-5">
            {STAR_PRESETS.map(p => (
              <button
                key={p.label}
                onClick={() => setV({ mode: p.mode, T: p.T, R: p.R })}
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
