"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

export default function TcpThroughputPage() {
  const [v, setV] = useHashState({ windowKB: "64", rttMs: "50", bandwidth: "1000" });
  const W = parseFloat(v.windowKB) * 1024 * 8; // bits
  const rtt = parseFloat(v.rttMs) / 1000; // seconds
  const BW = parseFloat(v.bandwidth) * 1e6; // bps
  const valid = W > 0 && rtt > 0 && BW > 0;
  // Max throughput = Window / RTT (bits/s)
  const maxThroughput = W / rtt;
  const effectiveMbps = Math.min(maxThroughput, BW) / 1e6;
  const bdp = BW * rtt; // bits in flight
  const bdpKB = bdp / 8 / 1024;
  const efficiency = Math.min(maxThroughput / BW, 1) * 100;
  const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

  return (
    <CalculatorShell title="TCP Throughput Calculator" description="Estimate maximum TCP throughput based on window size and round-trip time.">
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div><label className="block text-sm text-muted mb-1">TCP Window (KB)</label><input type="number" value={v.windowKB} onChange={e => setV({ windowKB: e.target.value })} className={ic} /></div>
          <div><label className="block text-sm text-muted mb-1">RTT (ms)</label><input type="number" value={v.rttMs} onChange={e => setV({ rttMs: e.target.value })} className={ic} /></div>
          <div><label className="block text-sm text-muted mb-1">Link Speed (Mbps)</label><input type="number" value={v.bandwidth} onChange={e => setV({ bandwidth: e.target.value })} className={ic} /></div>
        </div>
        {valid && (
          <div className="space-y-3">
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="block text-sm text-muted">Max TCP Throughput</span>
              <span className="block font-mono font-bold text-3xl text-primary">{effectiveMbps.toFixed(2)} Mbps</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="px-4 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">Efficiency</span>
                <span className={`font-mono font-bold text-xl ${efficiency > 90 ? "text-success" : efficiency > 60 ? "text-primary" : "text-danger"}`}>{efficiency.toFixed(1)}%</span>
              </div>
              <div className="px-4 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">BDP (bandwidth-delay product)</span>
                <span className="font-mono font-bold text-sm">{bdpKB.toFixed(0)} KB</span>
              </div>
              <div className="px-4 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">Ideal Window</span>
                <span className="font-mono font-bold text-sm">{(bdpKB).toFixed(0)} KB</span>
              </div>
            </div>
            {efficiency < 95 && (
              <div className="px-4 py-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg text-sm">
                💡 To fully utilize the link, increase TCP window size to <strong>{(bdpKB).toFixed(0)} KB</strong> (the bandwidth-delay product).
              </div>
            )}
          </div>
        )}
        <p className="text-xs text-muted">Max throughput = Window Size / RTT. Capped by link bandwidth.</p>
      </div>
    </CalculatorShell>
  );
}
