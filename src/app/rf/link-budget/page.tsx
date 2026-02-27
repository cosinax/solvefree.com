"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
const sc = "w-full px-3 py-2 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm";

const fmt = (n: number, d = 5) => parseFloat(n.toPrecision(d)).toString();

const distMultipliers: Record<string, number> = { m: 1, km: 1e3, mi: 1609.344 };
const freqMultipliers: Record<string, number> = { MHz: 1e6, GHz: 1e9 };

export default function LinkBudgetPage() {
  const [v, setV] = useHashState({
    txPower: "20",
    txGain: "2",
    rxGain: "2",
    cableLoss: "1",
    otherLoss: "0",
    rxSensitivity: "-90",
    useAutoFspl: "true",
    fsplManual: "100",
    dist: "1",
    distUnit: "km",
    freq: "2.4",
    freqUnit: "GHz",
  });

  const distM = parseFloat(v.dist) * (distMultipliers[v.distUnit] ?? 1);
  const fHz = parseFloat(v.freq) * (freqMultipliers[v.freqUnit] ?? 1e6);
  const autoFsplValid = isFinite(distM) && distM > 0 && isFinite(fHz) && fHz > 0;
  const autoFspl = autoFsplValid ? 20 * Math.log10(distM) + 20 * Math.log10(fHz) - 147.55 : null;

  const fspl = v.useAutoFspl === "true" ? (autoFspl ?? 0) : parseFloat(v.fsplManual);
  const txPow = parseFloat(v.txPower);
  const txG = parseFloat(v.txGain);
  const rxG = parseFloat(v.rxGain);
  const cL = parseFloat(v.cableLoss);
  const oL = parseFloat(v.otherLoss);
  const rxS = parseFloat(v.rxSensitivity);

  const allValid = [txPow, txG, rxG, cL, oL, rxS, fspl].every(isFinite);
  const received = allValid ? txPow + txG - fspl - cL - oL + rxG : null;
  const margin = received !== null && isFinite(rxS) ? received - rxS : null;

  const marginColor =
    margin === null
      ? ""
      : margin >= 10
      ? "text-green-600 dark:text-green-400"
      : margin >= 0
      ? "text-yellow-600 dark:text-yellow-400"
      : "text-red-600 dark:text-red-400";

  const marginBg =
    margin === null
      ? "bg-card"
      : margin >= 10
      ? "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800"
      : margin >= 0
      ? "bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800"
      : "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800";

  return (
    <CalculatorShell
      title="RF Link Budget"
      description="Calculate received signal power and link margin from transmitter, antenna, and path parameters."
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-muted mb-1">Tx Power (dBm)</label>
            <input type="number" value={v.txPower} onChange={(e) => setV({ txPower: e.target.value })} className={ic} />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Tx Antenna Gain (dBi)</label>
            <input type="number" value={v.txGain} onChange={(e) => setV({ txGain: e.target.value })} className={ic} />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Rx Antenna Gain (dBi)</label>
            <input type="number" value={v.rxGain} onChange={(e) => setV({ rxGain: e.target.value })} className={ic} />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Cable Loss (dB)</label>
            <input type="number" value={v.cableLoss} onChange={(e) => setV({ cableLoss: e.target.value })} className={ic} />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Other Losses (dB)</label>
            <input type="number" value={v.otherLoss} onChange={(e) => setV({ otherLoss: e.target.value })} className={ic} />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Rx Sensitivity (dBm)</label>
            <input type="number" value={v.rxSensitivity} onChange={(e) => setV({ rxSensitivity: e.target.value })} className={ic} />
          </div>
        </div>

        <div className="border border-card-border rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Path Loss (FSPL)</span>
            <div className="flex gap-2 text-sm">
              <button
                onClick={() => setV({ useAutoFspl: "true" })}
                className={`px-3 py-1 rounded-md transition-colors ${
                  v.useAutoFspl === "true" ? "bg-primary text-white" : "bg-card border border-card-border text-muted"
                }`}
              >
                Auto
              </button>
              <button
                onClick={() => setV({ useAutoFspl: "false" })}
                className={`px-3 py-1 rounded-md transition-colors ${
                  v.useAutoFspl !== "true" ? "bg-primary text-white" : "bg-card border border-card-border text-muted"
                }`}
              >
                Manual
              </button>
            </div>
          </div>

          {v.useAutoFspl === "true" ? (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-muted mb-1">Distance</label>
                <input type="number" value={v.dist} onChange={(e) => setV({ dist: e.target.value })} className={ic} />
              </div>
              <div>
                <label className="block text-xs text-muted mb-1">Unit</label>
                <select value={v.distUnit} onChange={(e) => setV({ distUnit: e.target.value })} className={sc}>
                  {Object.keys(distMultipliers).map((u) => <option key={u}>{u}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-muted mb-1">Frequency</label>
                <input type="number" value={v.freq} onChange={(e) => setV({ freq: e.target.value })} className={ic} />
              </div>
              <div>
                <label className="block text-xs text-muted mb-1">Unit</label>
                <select value={v.freqUnit} onChange={(e) => setV({ freqUnit: e.target.value })} className={sc}>
                  {Object.keys(freqMultipliers).map((u) => <option key={u}>{u}</option>)}
                </select>
              </div>
              {autoFspl !== null && (
                <div className="col-span-2 text-sm font-mono text-muted">
                  FSPL = {fmt(autoFspl, 5)} dB
                </div>
              )}
            </div>
          ) : (
            <div>
              <label className="block text-xs text-muted mb-1">FSPL (dB)</label>
              <input
                type="number"
                value={v.fsplManual}
                onChange={(e) => setV({ fsplManual: e.target.value })}
                className={ic}
              />
            </div>
          )}
        </div>

        {received !== null && (
          <div className="space-y-3">
            <div className="p-4 bg-card rounded-xl border border-card-border">
              <div className="text-sm text-muted mb-1">Received Signal</div>
              <div className="text-2xl font-bold font-mono">{fmt(received, 5)} dBm</div>
              <div className="text-xs text-muted mt-1 font-mono">
                {fmt(txPow)} + {fmt(txG)} − {fmt(fspl, 5)} − {fmt(cL)} − {fmt(oL)} + {fmt(rxG)}
              </div>
            </div>
            {margin !== null && (
              <div className={`p-4 rounded-xl border ${marginBg}`}>
                <div className="text-sm text-muted mb-1">Link Margin</div>
                <div className={`text-2xl font-bold font-mono ${marginColor}`}>
                  {margin >= 0 ? "+" : ""}{fmt(margin, 4)} dB
                </div>
                <div className="text-xs text-muted mt-1">
                  {margin >= 10 ? "Good link — sufficient margin" : margin >= 0 ? "Marginal link — consider improvements" : "Link failure — insufficient margin"}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="text-xs text-muted border-t border-card-border pt-3">
          Rx = Tx_dBm + Tx_gain − FSPL − Cable_loss − Other_loss + Rx_gain
        </div>
      </div>
    </CalculatorShell>
  );
}
