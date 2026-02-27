"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

const fmt = (n: number, d = 5) => parseFloat(n.toPrecision(d)).toString();

type InputMode = "dbm" | "watts" | "mw";

export default function DbmConverterPage() {
  const [v, setV] = useHashState({
    mode: "dbm",
    dbmVal: "20",
    wattsVal: "0.1",
    mwVal: "100",
    impedance: "50",
  });

  const mode = v.mode as InputMode;
  const Z = parseFloat(v.impedance);

  interface Result {
    dBm: number;
    watts: number;
    mW: number;
    dBW: number;
    vRms: number;
  }

  let result: Result | null = null;

  const fromWatts = (w: number): Result | null => {
    if (!isFinite(w) || w <= 0) return null;
    const dBm = 10 * Math.log10(w * 1000);
    const dBW = 10 * Math.log10(w);
    const vRms = isFinite(Z) && Z > 0 ? Math.sqrt(w * Z) : 0;
    return { dBm, watts: w, mW: w * 1000, dBW, vRms };
  };

  if (mode === "dbm") {
    const dBm = parseFloat(v.dbmVal);
    if (isFinite(dBm)) {
      const w = Math.pow(10, (dBm - 30) / 10);
      result = fromWatts(w);
    }
  } else if (mode === "watts") {
    const w = parseFloat(v.wattsVal);
    result = fromWatts(w);
  } else if (mode === "mw") {
    const mw = parseFloat(v.mwVal);
    result = fromWatts(isFinite(mw) ? mw / 1000 : NaN);
  }

  return (
    <CalculatorShell
      title="dBm / Watt Converter"
      description="Convert between dBm, Watts, milliwatts, dBW, and RMS voltage at a given impedance."
    >
      <div className="space-y-4">
        <div className="flex gap-2">
          {([
            { key: "dbm", label: "dBm" },
            { key: "watts", label: "Watts" },
            { key: "mw", label: "mW" },
          ] as const).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setV({ mode: key })}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                mode === key
                  ? "bg-primary text-white"
                  : "bg-card border border-card-border text-muted hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {mode === "dbm" && (
          <div>
            <label className="block text-sm text-muted mb-1">Power (dBm)</label>
            <input
              type="number"
              value={v.dbmVal}
              onChange={(e) => setV({ dbmVal: e.target.value })}
              className={ic}
              placeholder="e.g. 20"
              step="1"
            />
          </div>
        )}
        {mode === "watts" && (
          <div>
            <label className="block text-sm text-muted mb-1">Power (W)</label>
            <input
              type="number"
              value={v.wattsVal}
              onChange={(e) => setV({ wattsVal: e.target.value })}
              className={ic}
              placeholder="e.g. 0.1"
              min="0"
            />
          </div>
        )}
        {mode === "mw" && (
          <div>
            <label className="block text-sm text-muted mb-1">Power (mW)</label>
            <input
              type="number"
              value={v.mwVal}
              onChange={(e) => setV({ mwVal: e.target.value })}
              className={ic}
              placeholder="e.g. 100"
              min="0"
            />
          </div>
        )}

        <div>
          <label className="block text-sm text-muted mb-1">Impedance (Ω, for voltage)</label>
          <input
            type="number"
            value={v.impedance}
            onChange={(e) => setV({ impedance: e.target.value })}
            className={ic}
            placeholder="50"
            min="1"
          />
        </div>

        {result && (
          <div className="mt-4 grid grid-cols-2 gap-3">
            {[
              { label: "dBm", value: fmt(result.dBm, 5), unit: "dBm" },
              { label: "Watts", value: fmt(result.watts, 5), unit: "W" },
              { label: "Milliwatts", value: fmt(result.mW, 5), unit: "mW" },
              { label: "dBW", value: fmt(result.dBW, 5), unit: "dBW" },
              { label: `V_rms (Z = ${fmt(Z, 4)} Ω)`, value: fmt(result.vRms, 5), unit: "V" },
            ].map(({ label, value, unit }) => (
              <div key={label} className={`p-3 bg-card rounded-xl border border-card-border ${label.startsWith("V_rms") ? "col-span-2" : ""}`}>
                <div className="text-xs text-muted mb-1">{label}</div>
                <div className="text-lg font-bold font-mono">
                  {value} <span className="text-sm font-normal text-muted">{unit}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-xs text-muted border-t border-card-border pt-3 space-y-1">
          <div>P_W = 10^((dBm − 30) / 10)</div>
          <div>V_rms = √(P_W × Z)</div>
          <div>dBW = dBm − 30</div>
        </div>
      </div>
    </CalculatorShell>
  );
}
