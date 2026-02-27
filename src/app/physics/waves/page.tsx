"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
const sc = "w-full px-3 py-2 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm";

type FreqUnit = "Hz" | "kHz" | "MHz" | "GHz";
type WaveUnit = "m" | "cm" | "mm" | "μm" | "nm";

function toHz(val: number, unit: FreqUnit): number {
  switch (unit) {
    case "kHz": return val * 1e3;
    case "MHz": return val * 1e6;
    case "GHz": return val * 1e9;
    default: return val;
  }
}
function fromHz(val: number, unit: FreqUnit): number {
  switch (unit) {
    case "kHz": return val / 1e3;
    case "MHz": return val / 1e6;
    case "GHz": return val / 1e9;
    default: return val;
  }
}
function toMeters(val: number, unit: WaveUnit): number {
  switch (unit) {
    case "cm": return val / 100;
    case "mm": return val / 1000;
    case "μm": return val / 1e6;
    case "nm": return val / 1e9;
    default: return val;
  }
}
function fromMeters(val: number, unit: WaveUnit): number {
  switch (unit) {
    case "cm": return val * 100;
    case "mm": return val * 1000;
    case "μm": return val * 1e6;
    case "nm": return val * 1e9;
    default: return val;
  }
}

const FREQ_UNITS: FreqUnit[] = ["Hz", "kHz", "MHz", "GHz"];
const WAVE_UNITS: WaveUnit[] = ["m", "cm", "mm", "μm", "nm"];

const SPEED_PRESETS = [
  { name: "Speed of light", v: 2.998e8 },
  { name: "Speed of sound (air)", v: 343 },
  { name: "Speed of sound (water)", v: 1484 },
  { name: "Speed of sound (steel)", v: 5960 },
];

export default function WavesPage() {
  const [v, setV] = useHashState({
    solveFor: "speed",
    speed: "",
    frequency: "",
    wavelength: "",
    freqUnit: "Hz",
    waveUnit: "m",
  });

  const fHz = !isNaN(parseFloat(v.frequency)) ? toHz(parseFloat(v.frequency), v.freqUnit as FreqUnit) : NaN;
  const wM = !isNaN(parseFloat(v.wavelength)) ? toMeters(parseFloat(v.wavelength), v.waveUnit as WaveUnit) : NaN;
  const speed = parseFloat(v.speed);

  let resultSpeed: number | null = null;
  let resultFreq: number | null = null;
  let resultWave: number | null = null;

  if (v.solveFor === "speed" && !isNaN(fHz) && !isNaN(wM)) {
    resultSpeed = fHz * wM;
  } else if (v.solveFor === "frequency" && !isNaN(speed) && !isNaN(wM) && wM !== 0) {
    resultFreq = speed / wM;
  } else if (v.solveFor === "wavelength" && !isNaN(speed) && !isNaN(fHz) && fHz !== 0) {
    resultWave = speed / fHz;
  }

  const fmt = (n: number) => {
    if (Math.abs(n) >= 1e6 || (Math.abs(n) < 0.001 && n !== 0)) {
      return n.toExponential(4);
    }
    return parseFloat(n.toPrecision(5)).toString();
  };

  return (
    <CalculatorShell
      title="Wave Calculator"
      description="Calculate wave speed, frequency, or wavelength using v = f × λ."
    >
      <div className="space-y-5">
        <div>
          <label className="block text-sm text-muted mb-1">Solve for</label>
          <select value={v.solveFor} onChange={e => setV({ solveFor: e.target.value })} className={sc}>
            <option value="speed">Wave speed (v)</option>
            <option value="frequency">Frequency (f)</option>
            <option value="wavelength">Wavelength (λ)</option>
          </select>
        </div>

        {v.solveFor !== "speed" && (
          <div>
            <label className="block text-sm text-muted mb-1">Wave speed (m/s)</label>
            <div className="flex gap-2">
              <input type="number" value={v.speed} onChange={e => setV({ speed: e.target.value })} placeholder="e.g. 343" className={ic} />
              <select value={v.speed} onChange={e => setV({ speed: e.target.value })} className="px-2 py-2 bg-background border border-card-border rounded-lg text-xs w-28">
                <option value="">Custom</option>
                {SPEED_PRESETS.map(p => <option key={p.name} value={p.v.toString()}>{p.name}</option>)}
              </select>
            </div>
          </div>
        )}

        {v.solveFor !== "frequency" && (
          <div>
            <label className="block text-sm text-muted mb-1">Frequency</label>
            <div className="flex gap-2">
              <input type="number" value={v.frequency} onChange={e => setV({ frequency: e.target.value })} placeholder="e.g. 440" className={ic} />
              <select value={v.freqUnit} onChange={e => setV({ freqUnit: e.target.value })} className="px-2 py-2 bg-background border border-card-border rounded-lg text-sm">
                {FREQ_UNITS.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>
        )}

        {v.solveFor !== "wavelength" && (
          <div>
            <label className="block text-sm text-muted mb-1">Wavelength</label>
            <div className="flex gap-2">
              <input type="number" value={v.wavelength} onChange={e => setV({ wavelength: e.target.value })} placeholder="e.g. 0.779" className={ic} />
              <select value={v.waveUnit} onChange={e => setV({ waveUnit: e.target.value })} className="px-2 py-2 bg-background border border-card-border rounded-lg text-sm">
                {WAVE_UNITS.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>
        )}

        {(resultSpeed !== null || resultFreq !== null || resultWave !== null) && (
          <div className="space-y-3">
            {v.solveFor === "speed" && resultSpeed !== null && (
              <div className="bg-primary-light rounded-xl p-4 text-center">
                <span className="block text-xs text-muted mb-1">Wave Speed</span>
                <span className="block font-mono font-bold text-4xl text-primary">{fmt(resultSpeed)} m/s</span>
              </div>
            )}
            {v.solveFor === "frequency" && resultFreq !== null && (
              <div className="bg-primary-light rounded-xl p-4 text-center">
                <span className="block text-xs text-muted mb-1">Frequency</span>
                <span className="block font-mono font-bold text-4xl text-primary">
                  {fmt(fromHz(resultFreq, v.freqUnit as FreqUnit))} {v.freqUnit}
                </span>
              </div>
            )}
            {v.solveFor === "wavelength" && resultWave !== null && (
              <div className="bg-primary-light rounded-xl p-4 text-center">
                <span className="block text-xs text-muted mb-1">Wavelength</span>
                <span className="block font-mono font-bold text-4xl text-primary">
                  {fmt(fromMeters(resultWave, v.waveUnit as WaveUnit))} {v.waveUnit}
                </span>
              </div>
            )}

            {resultFreq !== null && (
              <div className="space-y-1">
                {FREQ_UNITS.map(u => (
                  <div key={u} className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
                    <span className="text-muted">In {u}</span>
                    <span>{fmt(fromHz(resultFreq!, u))} {u}</span>
                  </div>
                ))}
              </div>
            )}
            {resultWave !== null && (
              <div className="space-y-1">
                {WAVE_UNITS.map(u => (
                  <div key={u} className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
                    <span className="text-muted">In {u}</span>
                    <span>{fmt(fromMeters(resultWave!, u))} {u}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
              <span className="text-muted">Formula</span>
              <span>v = f × λ</span>
            </div>
          </div>
        )}

        <div className="border-t border-card-border pt-4">
          <h3 className="text-sm font-semibold mb-2">Reference speeds</h3>
          <div className="space-y-1">
            {SPEED_PRESETS.map(p => (
              <div key={p.name} className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
                <span className="text-muted">{p.name}</span>
                <span>{p.v.toExponential(3)} m/s</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CalculatorShell>
  );
}
