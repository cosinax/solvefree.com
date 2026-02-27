"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

const units: Record<string, number> = { "bps": 1, "Kbps": 1e3, "Mbps": 1e6, "Gbps": 1e9, "KBps": 8e3, "MBps": 8e6, "GBps": 8e9 };
const sizes: Record<string, number> = { "KB": 8e3, "MB": 8e6, "GB": 8e9, "TB": 8e12 };

function fmtTime(s: number): string {
  if (s < 60) return s.toFixed(1) + "s";
  if (s < 3600) return (s / 60).toFixed(1) + " min";
  if (s < 86400) return (s / 3600).toFixed(2) + " hrs";
  return (s / 86400).toFixed(2) + " days";
}

export default function BandwidthPage() {
  const [v, setV] = useHashState({ speed: "100", speedUnit: "Mbps", fileSize: "1", sizeUnit: "GB" });
  const speedBps = parseFloat(v.speed) * (units[v.speedUnit] ?? 1e6);
  const fileBits = parseFloat(v.fileSize) * (sizes[v.sizeUnit] ?? 8e9);
  const valid = speedBps > 0 && fileBits > 0;
  const transferSec = fileBits / speedBps;
  const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
  const sel = "w-full px-3 py-2.5 bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm";

  return (
    <CalculatorShell title="Bandwidth Calculator" description="Calculate file transfer time from speed and file size, or required bandwidth for a transfer.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-muted mb-1">Network Speed</label>
            <input type="number" value={v.speed} onChange={e => setV({ speed: e.target.value })} className={ic} />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Unit</label>
            <select value={v.speedUnit} onChange={e => setV({ speedUnit: e.target.value })} className={sel}>
              {Object.keys(units).map(u => <option key={u}>{u}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">File Size</label>
            <input type="number" value={v.fileSize} onChange={e => setV({ fileSize: e.target.value })} className={ic} />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Unit</label>
            <select value={v.sizeUnit} onChange={e => setV({ sizeUnit: e.target.value })} className={sel}>
              {Object.keys(sizes).map(u => <option key={u}>{u}</option>)}
            </select>
          </div>
        </div>
        {valid && (
          <div className="space-y-3">
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="block text-sm text-muted">Transfer Time</span>
              <span className="block font-mono font-bold text-3xl text-primary">{fmtTime(transferSec)}</span>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              {[["Seconds", transferSec.toFixed(1)], ["Minutes", (transferSec / 60).toFixed(2)], ["Hours", (transferSec / 3600).toFixed(4)]].map(([l, val]) => (
                <div key={l} className="px-3 py-3 bg-primary-light rounded-lg">
                  <span className="block text-xs text-muted">{l}</span>
                  <span className="font-mono font-semibold">{val}</span>
                </div>
              ))}
            </div>
            <div className="space-y-1 text-xs font-mono">
              {[1, 10, 50, 100, 1000].map(s => {
                const t = fileBits / (s * 1e6);
                return (
                  <div key={s} className="flex justify-between px-3 py-1 bg-background border border-card-border rounded">
                    <span>{s} Mbps</span><span>{fmtTime(t)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
