"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
const sc = "w-full px-3 py-2 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm";

// c in km/s
const C_KMS = 299792.458;
// Unit conversions to km
const DIST_UNITS: Record<string, { label: string; km: number }> = {
  m:   { label: "m",          km: 1e-3 },
  km:  { label: "km",         km: 1 },
  AU:  { label: "AU",         km: 1.495978707e8 },
  ly:  { label: "light-year", km: 9.4607304725808e12 },
  pc:  { label: "parsec",     km: 3.085677581e13 },
};
// Time units to seconds
const TIME_UNITS: Record<string, { label: string; s: number }> = {
  s:   { label: "seconds", s: 1 },
  min: { label: "minutes", s: 60 },
  h:   { label: "hours",   s: 3600 },
  d:   { label: "days",    s: 86400 },
  yr:  { label: "years",   s: 365.25 * 86400 },
};

const fmt = (n: number, d = 5) => parseFloat(n.toPrecision(d)).toString();

function fmtTime(s: number): string {
  const yr  = s / (365.25 * 86400);
  const d   = s / 86400;
  const h   = s / 3600;
  const min = s / 60;
  if (yr >= 1) return `${fmt(yr)} yr`;
  if (d >= 1)  return `${fmt(d)} d`;
  if (h >= 1)  return `${fmt(h)} h`;
  if (min >= 1) return `${fmt(min)} min`;
  return `${fmt(s)} s`;
}

const FAMOUS: { label: string; dist_km: number }[] = [
  { label: "Earth–Moon",         dist_km: 384400 },
  { label: "Earth–Sun (1 AU)",   dist_km: 1.495978707e8 },
  { label: "Earth–Mars (avg)",   dist_km: 2.25e8 },
  { label: "Earth–Jupiter (avg)",dist_km: 6.28e8 },
  { label: "Earth–Saturn (avg)", dist_km: 1.275e9 },
  { label: "Earth–Pluto (avg)",  dist_km: 5.9e9 },
  { label: "Nearest star (α Cen)",dist_km: 4.01e13 },
  { label: "Galactic center",    dist_km: 2.52e17 },
];

export default function LightTravelTimePage() {
  const [v, setV] = useHashState({
    mode: "distToTime",
    distValue: "149597870.7",
    distUnit: "km",
    timeValue: "499",
    timeUnit: "s",
  });

  let error = "";
  let dist_km = 0;

  if (v.mode === "distToTime") {
    const raw = parseFloat(v.distValue);
    if (isNaN(raw) || raw <= 0) error = "Enter a positive distance.";
    else dist_km = raw * (DIST_UNITS[v.distUnit]?.km ?? 1);
  } else {
    const raw = parseFloat(v.timeValue);
    if (isNaN(raw) || raw <= 0) error = "Enter a positive time.";
    else {
      const t_s = raw * (TIME_UNITS[v.timeUnit]?.s ?? 1);
      dist_km = C_KMS * t_s;
    }
  }

  const lightTime_s = dist_km / C_KMS;

  return (
    <CalculatorShell
      title="Light Travel Time / Distance"
      description="Convert between distance and travel time at the speed of light (c = 299,792.458 km/s)."
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-muted mb-1">Mode</label>
          <select value={v.mode} onChange={e => setV({ mode: e.target.value })} className={sc}>
            <option value="distToTime">Distance → Travel time</option>
            <option value="timeToDist">Travel time → Distance</option>
          </select>
        </div>

        {v.mode === "distToTime" ? (
          <div>
            <label className="block text-sm text-muted mb-1">Distance</label>
            <div className="flex gap-2">
              <input type="number" value={v.distValue} onChange={e => setV({ distValue: e.target.value })} className={ic} min="0" step="any" />
              <select value={v.distUnit} onChange={e => setV({ distUnit: e.target.value })} className="px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary min-w-[90px]">
                {Object.entries(DIST_UNITS).map(([k, u]) => (
                  <option key={k} value={k}>{u.label}</option>
                ))}
              </select>
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-sm text-muted mb-1">Travel time</label>
            <div className="flex gap-2">
              <input type="number" value={v.timeValue} onChange={e => setV({ timeValue: e.target.value })} className={ic} min="0" step="any" />
              <select value={v.timeUnit} onChange={e => setV({ timeUnit: e.target.value })} className="px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary min-w-[90px]">
                {Object.entries(TIME_UNITS).map(([k, u]) => (
                  <option key={k} value={k}>{u.label}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {error && <p className="text-sm text-red-500">{error}</p>}

        {!error && dist_km > 0 && (
          <div className="mt-4 p-4 bg-card rounded-xl border border-card-border space-y-2">
            <div className="text-sm text-muted mb-1">Results</div>
            <div className="space-y-1 text-xs font-mono">
              <div className="bg-primary-light rounded-lg p-3 text-center mb-2">
                <span className="text-xs text-muted block">Travel time at c</span>
                <span className="text-2xl font-bold font-mono text-primary">{fmtTime(lightTime_s)}</span>
              </div>
              {[
                ["Distance (km)",    fmt(dist_km) + " km"],
                ["Distance (AU)",    fmt(dist_km / 1.495978707e8) + " AU"],
                ["Distance (ly)",    fmt(dist_km / 9.4607304725808e12) + " ly"],
                ["At c (100%)",      fmtTime(lightTime_s)],
                ["At 10% c",         fmtTime(lightTime_s * 10)],
                ["At 1% c",          fmtTime(lightTime_s * 100)],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded">
                  <span className="text-muted">{label}</span><span className="font-semibold">{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Scale visualization */}
        {!error && dist_km > 0 && (
          <div className="p-4 bg-card rounded-xl border border-card-border">
            <div className="text-xs text-muted mb-3">Scale: your distance vs. famous references (log scale)</div>
            <div className="space-y-2">
              {(() => {
                const references = [
                  { label: "Moon", km: 384400, color: "#9ca3af" },
                  { label: "Sun (1 AU)", km: 1.496e8, color: "#fbbf24" },
                  { label: "Mars (avg)", km: 2.25e8, color: "#ef4444" },
                  { label: "Jupiter (avg)", km: 6.28e8, color: "#f97316" },
                  { label: "Pluto (avg)", km: 5.9e9, color: "#8b5cf6" },
                  { label: "α Cen", km: 4.01e13, color: "#3b82f6" },
                ];
                // Include user's distance
                const allKms = [...references.map(r => r.km), dist_km];
                const logMax = Math.log10(Math.max(...allKms));
                const logMin = Math.log10(Math.min(...allKms));
                const pct = (km: number) => ((Math.log10(km) - logMin) / (logMax - logMin)) * 95 + 2;
                return (
                  <>
                    {references.map(r => (
                      <div key={r.label} className="flex items-center gap-2 text-xs">
                        <span className="w-24 text-right text-muted shrink-0">{r.label}</span>
                        <div className="flex-1 h-3 bg-background border border-card-border rounded-full overflow-hidden relative">
                          <div className="h-full rounded-full opacity-60" style={{ width: `${pct(r.km)}%`, backgroundColor: r.color }} />
                        </div>
                        <span className="w-20 text-right font-mono text-muted shrink-0">{fmtTime(r.km / C_KMS)}</span>
                      </div>
                    ))}
                    <div className="flex items-center gap-2 text-xs border-t border-card-border pt-2">
                      <span className="w-24 text-right font-semibold text-primary shrink-0">Your dist</span>
                      <div className="flex-1 h-3 bg-background border border-primary/30 rounded-full overflow-hidden relative">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${pct(dist_km)}%` }} />
                      </div>
                      <span className="w-20 text-right font-mono font-semibold text-primary shrink-0">{fmtTime(lightTime_s)}</span>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}

        {/* Famous distances */}
        <div>
          <p className="text-xs text-muted mb-1 mt-2">Famous distances:</p>
          <div className="overflow-x-auto rounded-lg border border-card-border">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="bg-card border-b border-card-border">
                  <th className="text-left px-3 py-2 text-muted font-medium">From–To</th>
                  <th className="text-right px-3 py-2 text-muted font-medium">Light travel time</th>
                </tr>
              </thead>
              <tbody>
                {FAMOUS.map(f => {
                  const t = f.dist_km / C_KMS;
                  return (
                    <tr
                      key={f.label}
                      className="border-b border-card-border cursor-pointer hover:bg-primary-light transition-colors"
                      onClick={() => setV({ mode: "distToTime", distValue: f.dist_km.toString(), distUnit: "km" })}
                    >
                      <td className="px-3 py-1.5">{f.label}</td>
                      <td className="px-3 py-1.5 text-right">{fmtTime(t)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </CalculatorShell>
  );
}
