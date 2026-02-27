"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
const sc = "w-full px-3 py-2 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm";

const C = 299_792_458; // m/s

const freqMultipliers: Record<string, number> = { Hz: 1, kHz: 1e3, MHz: 1e6, GHz: 1e9 };
const waveMultipliers: Record<string, number> = { mm: 1e-3, cm: 1e-2, m: 1 };

const fmt = (n: number, d = 5) => parseFloat(n.toPrecision(d)).toString();

function fmtWave(meters: number): string {
  if (meters < 0.001) return `${fmt(meters * 1000)} mm`;
  if (meters < 1) return `${fmt(meters * 100)} cm`;
  return `${fmt(meters)} m`;
}

export default function WavelengthPage() {
  const [v, setV] = useHashState({
    mode: "freq",
    freqVal: "100",
    freqUnit: "MHz",
    waveVal: "3",
    waveUnit: "m",
  });

  const solveFromFreq = (): { lambda: number; half: number; quarter: number } | null => {
    const f = parseFloat(v.freqVal) * (freqMultipliers[v.freqUnit] ?? 1e6);
    if (!isFinite(f) || f <= 0) return null;
    const lambda = C / f;
    return { lambda, half: lambda / 2, quarter: lambda / 4 };
  };

  const solveFromWave = (): { freq: number; half: number; quarter: number } | null => {
    const lambda = parseFloat(v.waveVal) * (waveMultipliers[v.waveUnit] ?? 1);
    if (!isFinite(lambda) || lambda <= 0) return null;
    const freq = C / lambda;
    return { freq, half: lambda / 2, quarter: lambda / 4 };
  };

  const fromFreq = v.mode === "freq" ? solveFromFreq() : null;
  const fromWave = v.mode === "wave" ? solveFromWave() : null;

  return (
    <CalculatorShell
      title="Wavelength / Frequency Converter"
      description="Convert between frequency and wavelength using λ = c / f. Shows full, half, and quarter-wave lengths."
    >
      <div className="space-y-5">
        <div className="flex gap-2">
          {(["freq", "wave"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setV({ mode: m })}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                v.mode === m
                  ? "bg-primary text-white"
                  : "bg-card border border-card-border text-muted hover:text-foreground"
              }`}
            >
              {m === "freq" ? "Frequency → Wavelength" : "Wavelength → Frequency"}
            </button>
          ))}
        </div>

        {v.mode === "freq" && (
          <div>
            <label className="block text-sm text-muted mb-1">Frequency</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                value={v.freqVal}
                onChange={(e) => setV({ freqVal: e.target.value })}
                className={ic}
                placeholder="e.g. 100"
              />
              <select value={v.freqUnit} onChange={(e) => setV({ freqUnit: e.target.value })} className={sc}>
                {Object.keys(freqMultipliers).map((u) => (
                  <option key={u}>{u}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {v.mode === "wave" && (
          <div>
            <label className="block text-sm text-muted mb-1">Wavelength</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                value={v.waveVal}
                onChange={(e) => setV({ waveVal: e.target.value })}
                className={ic}
                placeholder="e.g. 3"
              />
              <select value={v.waveUnit} onChange={(e) => setV({ waveUnit: e.target.value })} className={sc}>
                {Object.keys(waveMultipliers).map((u) => (
                  <option key={u}>{u}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {fromFreq && (
          <div className="mt-4 space-y-3">
            <div className="p-4 bg-card rounded-xl border border-card-border">
              <div className="text-sm text-muted mb-1">Full Wavelength (λ)</div>
              <div className="text-2xl font-bold font-mono">{fmtWave(fromFreq.lambda)}</div>
              <div className="text-xs text-muted mt-1">{fmt(fromFreq.lambda)} m</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-card rounded-xl border border-card-border">
                <div className="text-sm text-muted mb-1">Half-Wave (λ/2)</div>
                <div className="text-lg font-bold font-mono">{fmtWave(fromFreq.half)}</div>
              </div>
              <div className="p-3 bg-card rounded-xl border border-card-border">
                <div className="text-sm text-muted mb-1">Quarter-Wave (λ/4)</div>
                <div className="text-lg font-bold font-mono">{fmtWave(fromFreq.quarter)}</div>
              </div>
            </div>
          </div>
        )}

        {fromWave && (
          <div className="mt-4 space-y-3">
            <div className="p-4 bg-card rounded-xl border border-card-border">
              <div className="text-sm text-muted mb-1">Frequency</div>
              {(() => {
                const f = fromWave.freq;
                let display: string;
                if (f >= 1e9) display = `${fmt(f / 1e9)} GHz`;
                else if (f >= 1e6) display = `${fmt(f / 1e6)} MHz`;
                else if (f >= 1e3) display = `${fmt(f / 1e3)} kHz`;
                else display = `${fmt(f)} Hz`;
                return <div className="text-2xl font-bold font-mono">{display}</div>;
              })()}
              <div className="text-xs text-muted mt-1">{fmt(fromWave.freq)} Hz</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-card rounded-xl border border-card-border">
                <div className="text-sm text-muted mb-1">Half-Wave (λ/2)</div>
                <div className="text-lg font-bold font-mono">{fmtWave(fromWave.half)}</div>
              </div>
              <div className="p-3 bg-card rounded-xl border border-card-border">
                <div className="text-sm text-muted mb-1">Quarter-Wave (λ/4)</div>
                <div className="text-lg font-bold font-mono">{fmtWave(fromWave.quarter)}</div>
              </div>
            </div>
          </div>
        )}

        <div className="text-xs text-muted border-t border-card-border pt-3">
          c = 299,792,458 m/s (speed of light in vacuum)
        </div>
      </div>
    </CalculatorShell>
  );
}
