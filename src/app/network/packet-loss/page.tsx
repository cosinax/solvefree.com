"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

export default function PacketLossPage() {
  const [v, setV] = useHashState({ loss: "1", rtt: "50", bandwidth: "100" });
  const p = parseFloat(v.loss) / 100;
  const rtt = parseFloat(v.rtt) / 1000;
  const bwMbps = parseFloat(v.bandwidth);
  const valid = p >= 0 && p < 1 && rtt > 0 && bwMbps > 0;

  // Mathis formula: throughput ≈ (MSS/RTT) * (1/sqrt(p))
  // MSS ≈ 1460 bytes = 11680 bits
  const mss = 11680;
  const mathisMbps = valid && p > 0 ? (mss / rtt) * (1 / Math.sqrt(p)) / 1e6 : bwMbps;
  const effectiveMbps = Math.min(mathisMbps, bwMbps);
  const degradation = ((bwMbps - effectiveMbps) / bwMbps) * 100;

  const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

  return (
    <CalculatorShell title="Packet Loss Impact Calculator" description="Estimate TCP throughput degradation caused by packet loss (Mathis formula).">
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div><label className="block text-sm text-muted mb-1">Packet Loss (%)</label><input type="number" value={v.loss} onChange={e => setV({ loss: e.target.value })} step="0.1" className={ic} /></div>
          <div><label className="block text-sm text-muted mb-1">RTT (ms)</label><input type="number" value={v.rtt} onChange={e => setV({ rtt: e.target.value })} className={ic} /></div>
          <div><label className="block text-sm text-muted mb-1">Link Speed (Mbps)</label><input type="number" value={v.bandwidth} onChange={e => setV({ bandwidth: e.target.value })} className={ic} /></div>
        </div>
        {valid && (
          <div className="space-y-3">
            <div className={`rounded-xl p-4 text-center ${degradation > 50 ? "bg-red-50 dark:bg-red-950" : degradation > 20 ? "bg-yellow-50 dark:bg-yellow-950" : "bg-primary-light"}`}>
              <span className="block text-sm text-muted">Effective Throughput</span>
              <span className={`block font-mono font-bold text-3xl ${degradation > 50 ? "text-danger" : degradation > 20 ? "text-yellow-600" : "text-primary"}`}>
                {effectiveMbps.toFixed(2)} Mbps
              </span>
              <span className="block text-xs text-muted">of {bwMbps} Mbps ({(100 - degradation).toFixed(1)}% efficiency)</span>
            </div>
            <div className="space-y-1 text-xs font-mono">
              {[0.01, 0.1, 0.5, 1, 2, 5].map(loss => {
                const t = Math.min((mss / rtt) * (1 / Math.sqrt(loss / 100)) / 1e6, bwMbps);
                const pct = (t / bwMbps * 100).toFixed(1);
                return (
                  <div key={loss} className={`flex justify-between px-3 py-1.5 rounded border ${parseFloat(v.loss) === loss ? "bg-primary-light border-primary/30" : "bg-background border-card-border"}`}>
                    <span>{loss}% loss</span>
                    <span>{t.toFixed(2)} Mbps</span>
                    <span className="text-muted">{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        <p className="text-xs text-muted">Uses the Mathis formula: Throughput ≈ MSS / (RTT × √p). Even 1% packet loss can cause significant throughput drops.</p>
      </div>
    </CalculatorShell>
  );
}
