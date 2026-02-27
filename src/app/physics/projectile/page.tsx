"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

export default function ProjectilePage() {
  const [v, setV] = useHashState({
    velocity: "",
    angle: "",
    height: "0",
    gravity: "9.81",
  });

  const v0 = parseFloat(v.velocity);
  const angleDeg = parseFloat(v.angle);
  const h0 = parseFloat(v.height) || 0;
  const g = parseFloat(v.gravity) || 9.81;

  let maxHeight: number | null = null;
  let range: number | null = null;
  let timeFlight: number | null = null;
  let vx: number | null = null;
  let vy0: number | null = null;
  let trajectory: { t: number; x: number; y: number }[] = [];

  if (!isNaN(v0) && !isNaN(angleDeg) && v0 > 0) {
    const angleRad = (angleDeg * Math.PI) / 180;
    vx = v0 * Math.cos(angleRad);
    vy0 = v0 * Math.sin(angleRad);

    // Time of flight: h0 + vy0*t - 0.5*g*t² = 0
    const disc = vy0 * vy0 + 2 * g * h0;
    if (disc >= 0) {
      timeFlight = (vy0 + Math.sqrt(disc)) / g;
      range = vx * timeFlight;
      maxHeight = h0 + (vy0 * vy0) / (2 * g);
      if (vy0 < 0 && h0 === 0) maxHeight = 0;

      // Trajectory table at 0.5s intervals (and final point)
      const step = Math.max(timeFlight / 20, 0.1);
      for (let t = 0; t <= timeFlight + step / 2; t += step) {
        const tCapped = Math.min(t, timeFlight);
        const x = vx * tCapped;
        const y = h0 + vy0 * tCapped - 0.5 * g * tCapped * tCapped;
        trajectory.push({ t: parseFloat(tCapped.toFixed(2)), x: parseFloat(x.toFixed(2)), y: parseFloat(Math.max(y, 0).toFixed(2)) });
        if (tCapped >= timeFlight) break;
      }
    }
  }

  const fmt = (n: number) => parseFloat(n.toPrecision(5)).toString();

  return (
    <CalculatorShell
      title="Projectile Motion Calculator"
      description="Calculate max height, range, time of flight, and trajectory table for projectile motion."
    >
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-muted mb-1">Initial velocity (m/s)</label>
            <input type="number" value={v.velocity} onChange={e => setV({ velocity: e.target.value })} placeholder="e.g. 20" className={ic} />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Launch angle (°)</label>
            <input type="number" value={v.angle} onChange={e => setV({ angle: e.target.value })} placeholder="e.g. 45" min="0" max="90" className={ic} />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Initial height (m)</label>
            <input type="number" value={v.height} onChange={e => setV({ height: e.target.value })} placeholder="0" className={ic} />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Gravity (m/s²)</label>
            <input type="number" value={v.gravity} onChange={e => setV({ gravity: e.target.value })} placeholder="9.81" className={ic} />
          </div>
        </div>

        {range !== null && maxHeight !== null && timeFlight !== null && vx !== null && vy0 !== null && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-primary-light rounded-xl p-3 text-center">
                <span className="block text-xs text-muted">Max Height</span>
                <span className="font-mono font-bold text-2xl text-primary">{fmt(maxHeight)} m</span>
              </div>
              <div className="bg-primary-light rounded-xl p-3 text-center">
                <span className="block text-xs text-muted">Range</span>
                <span className="font-mono font-bold text-2xl text-primary">{fmt(range)} m</span>
              </div>
              <div className="bg-primary-light rounded-xl p-3 text-center">
                <span className="block text-xs text-muted">Time of Flight</span>
                <span className="font-mono font-bold text-2xl text-primary">{fmt(timeFlight)} s</span>
              </div>
              <div className="bg-primary-light rounded-xl p-3 text-center">
                <span className="block text-xs text-muted">Launch Speed</span>
                <span className="font-mono font-bold text-2xl text-primary">{parseFloat(v.velocity)} m/s</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
                <span className="text-muted">Horizontal velocity (vₓ)</span>
                <span>{fmt(vx)} m/s</span>
              </div>
              <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
                <span className="text-muted">Vertical velocity (v_y₀)</span>
                <span>{fmt(vy0)} m/s</span>
              </div>
              <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
                <span className="text-muted">Optimal angle for max range</span>
                <span>45°</span>
              </div>
            </div>

            {trajectory.length > 0 && (
              <details>
                <summary className="cursor-pointer text-sm text-muted hover:text-primary mt-2">Trajectory table</summary>
                <div className="mt-2 overflow-auto max-h-64">
                  <table className="w-full text-xs font-mono">
                    <thead>
                      <tr className="text-muted border-b border-card-border">
                        <th className="text-left py-1 px-2">t (s)</th>
                        <th className="text-right py-1 px-2">x (m)</th>
                        <th className="text-right py-1 px-2">y (m)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trajectory.map((row, i) => (
                        <tr key={i} className="border-b border-card-border last:border-0">
                          <td className="py-1 px-2">{row.t}</td>
                          <td className="text-right py-1 px-2">{row.x}</td>
                          <td className="text-right py-1 px-2">{row.y}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </details>
            )}
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
