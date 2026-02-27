"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
const sc = "w-full px-3 py-2 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm";

const fmt = (n: number, d = 5) => parseFloat(n.toPrecision(d)).toString();

const distMultipliers: Record<string, number> = { m: 1, km: 1e3, mi: 1609.344 };
const freqMultipliers: Record<string, number> = { MHz: 1e6, GHz: 1e9 };

export default function PathLossPage() {
  const [v, setV] = useHashState({
    dist: "1",
    distUnit: "km",
    freq: "2.4",
    freqUnit: "GHz",
    txPower: "20",
    txGain: "0",
    rxGain: "0",
    showLinkHelper: "false",
  });

  const dM = parseFloat(v.dist) * (distMultipliers[v.distUnit] ?? 1);
  const fHz = parseFloat(v.freq) * (freqMultipliers[v.freqUnit] ?? 1e6);
  const valid = isFinite(dM) && dM > 0 && isFinite(fHz) && fHz > 0;

  const fspl = valid ? 20 * Math.log10(dM) + 20 * Math.log10(fHz) - 147.55 : null;

  const txPow = parseFloat(v.txPower);
  const txG = parseFloat(v.txGain);
  const rxG = parseFloat(v.rxGain);
  const linkValid = fspl !== null && isFinite(txPow) && isFinite(txG) && isFinite(rxG);
  const received = linkValid ? txPow + txG - (fspl ?? 0) + rxG : null;

  return (
    <CalculatorShell
      title="Free-Space Path Loss"
      description="Calculate FSPL in dB from distance and frequency. Optionally compute received signal strength."
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-muted mb-1">Distance</label>
            <input
              type="number"
              value={v.dist}
              onChange={(e) => setV({ dist: e.target.value })}
              className={ic}
              placeholder="1"
            />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Unit</label>
            <select value={v.distUnit} onChange={(e) => setV({ distUnit: e.target.value })} className={sc}>
              {Object.keys(distMultipliers).map((u) => (
                <option key={u}>{u}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Frequency</label>
            <input
              type="number"
              value={v.freq}
              onChange={(e) => setV({ freq: e.target.value })}
              className={ic}
              placeholder="2.4"
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

        {fspl !== null && (
          <div className="p-4 bg-card rounded-xl border border-card-border">
            <div className="text-sm text-muted mb-1">Free-Space Path Loss (FSPL)</div>
            <div className="text-3xl font-bold font-mono">{fmt(fspl, 5)} dB</div>
            <div className="text-xs text-muted mt-1">
              FSPL = 20·log₁₀({fmt(dM)} m) + 20·log₁₀({fmt(fHz)} Hz) − 147.55
            </div>
          </div>
        )}

        <div className="border-t border-card-border pt-4">
          <button
            onClick={() => setV({ showLinkHelper: v.showLinkHelper === "true" ? "false" : "true" })}
            className="text-sm text-primary hover:underline"
          >
            {v.showLinkHelper === "true" ? "Hide" : "Show"} link budget helper
          </button>

          {v.showLinkHelper === "true" && (
            <div className="mt-3 space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-muted mb-1">Tx Power (dBm)</label>
                  <input
                    type="number"
                    value={v.txPower}
                    onChange={(e) => setV({ txPower: e.target.value })}
                    className={ic}
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted mb-1">Tx Gain (dBi)</label>
                  <input
                    type="number"
                    value={v.txGain}
                    onChange={(e) => setV({ txGain: e.target.value })}
                    className={ic}
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted mb-1">Rx Gain (dBi)</label>
                  <input
                    type="number"
                    value={v.rxGain}
                    onChange={(e) => setV({ rxGain: e.target.value })}
                    className={ic}
                  />
                </div>
              </div>

              {received !== null && (
                <div className="p-3 bg-card rounded-xl border border-card-border">
                  <div className="text-sm text-muted mb-1">Received Signal</div>
                  <div className="text-2xl font-bold font-mono">{fmt(received, 5)} dBm</div>
                  <div className="text-xs text-muted mt-1">
                    {fmt(txPow)} + {fmt(txG)} − {fmt(fspl ?? 0, 5)} + {fmt(rxG)}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="text-xs text-muted border-t border-card-border pt-3">
          FSPL (dB) = 20·log₁₀(d_m) + 20·log₁₀(f_Hz) − 147.55
        </div>
      </div>
    </CalculatorShell>
  );
}
