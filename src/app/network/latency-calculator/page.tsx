"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

export default function LatencyCalculatorPage() {
  const [v, setV] = useHashState({ distance: "5000", medium: "fiber" });
  const dist = parseFloat(v.distance);
  const valid = dist > 0;

  // Speed of light in different media (km/ms)
  const speeds: Record<string, { label: string; speed: number; factor: string }> = {
    fiber: { label: "Fiber optic", speed: 200, factor: "~0.67c (refractive index 1.5)" },
    copper: { label: "Copper (Cat6)", speed: 230, factor: "~0.77c" },
    vacuum: { label: "Vacuum / free space", speed: 299.792, factor: "c (speed of light)" },
    satellite_geo: { label: "Geostationary satellite", speed: 299.792, factor: "~35,786 km altitude, 4× trip" },
  };

  const rttMs = v.medium === "satellite_geo"
    ? (35786 * 2 / 299.792).toFixed(1)
    : valid ? (dist * 2 / speeds[v.medium].speed).toFixed(2) : "—";

  const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

  return (
    <CalculatorShell title="Network Latency Calculator" description="Estimate theoretical minimum latency based on distance and transmission medium.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-muted mb-1">Distance (km)</label>
            <input type="number" value={v.distance} onChange={e => setV({ distance: e.target.value })} className={ic} />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Medium</label>
            <select value={v.medium} onChange={e => setV({ medium: e.target.value })} className={ic}>
              {Object.entries(speeds).map(([k, s]) => <option key={k} value={k}>{s.label}</option>)}
            </select>
          </div>
        </div>
        {valid && (
          <div className="space-y-3">
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="block text-sm text-muted">Theoretical Minimum RTT</span>
              <span className="block font-mono font-bold text-3xl text-primary">{rttMs} ms</span>
              <span className="block text-xs text-muted">One-way: {v.medium === "satellite_geo" ? (35786 / 299.792).toFixed(1) : (parseFloat(rttMs) / 2).toFixed(2)} ms</span>
            </div>
            <div className="text-xs text-muted px-4 py-3 bg-background border border-card-border rounded-lg">
              <p className="font-medium mb-1">{speeds[v.medium]?.label}</p>
              <p>{speeds[v.medium]?.factor}</p>
              <p className="mt-1">This is the <em>theoretical minimum</em>. Real latency adds routing hops, processing delays, queuing, etc.</p>
            </div>
            <div className="space-y-1 text-xs font-mono">
              {[["New York → London", 5570], ["LA → Tokyo", 8800], ["NYC → Sydney", 16000], ["Across a datacenter", 0.3]].map(([label, d]) => {
                const rtt = typeof d === "number" && v.medium !== "satellite_geo" ? (d * 2 / speeds[v.medium].speed).toFixed(2) : "—";
                return (
                  <div key={label} className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded">
                    <span>{label}</span><span className="text-primary">{rtt} ms RTT</span>
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
