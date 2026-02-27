"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
const sc = "w-full px-3 py-2 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm";

// Distance unit conversions to km
const DIST_UNITS: Record<string, { label: string; km: number }> = {
  m:   { label: "m",          km: 1e-3 },
  km:  { label: "km",         km: 1 },
  AU:  { label: "AU",         km: 1.495978707e8 },
  ly:  { label: "light-year", km: 9.4607304725808e12 },
  pc:  { label: "parsec",     km: 3.085677581e13 },
};

const fmt = (n: number, d = 5) => parseFloat(n.toPrecision(d)).toString();

function rad2deg(r: number)  { return r * (180 / Math.PI); }
function rad2arcmin(r: number) { return rad2deg(r) * 60; }
function rad2arcsec(r: number) { return rad2deg(r) * 3600; }

interface AngSizeResult {
  theta_rad: number;
  theta_deg: number;
  theta_arcmin: number;
  theta_arcsec: number;
}

interface SolveDistResult {
  dist_km: number;
}

interface SolveSizeResult {
  size_km: number;
}

const FAMOUS = [
  { label: "Moon (full disk)",      size_km: 3474.2,       dist_km: 384400 },
  { label: "Sun (full disk)",       size_km: 1.3927e6,     dist_km: 1.495978707e8 },
  { label: "Jupiter (max)",         size_km: 142984,        dist_km: 5.9e8 },
  { label: "Venus (max)",           size_km: 12104,         dist_km: 4.0e7 },
  { label: "Andromeda galaxy",      size_km: 2.2e18,        dist_km: 2.37e19 },
  { label: "Orion Nebula",          size_km: 3.08e15,       dist_km: 1.34e16 },
];

type Mode = "sizeDistToAngle" | "angleDistToSize" | "angleSizeToDist";

export default function AngularSizePage() {
  const [v, setV] = useHashState({
    mode: "sizeDistToAngle",
    size: "3474.2",
    sizeUnit: "km",
    dist: "384400",
    distUnit: "km",
    angle: "0.5",
    angleUnit: "deg",
  });

  const mode = v.mode as Mode;

  let error = "";
  let resultAngle:  AngSizeResult  | null = null;
  let resultDist:   SolveDistResult | null = null;
  let resultSize:   SolveSizeResult | null = null;

  const sizeKm = parseFloat(v.size) * (DIST_UNITS[v.sizeUnit]?.km ?? 1);
  const distKm = parseFloat(v.dist) * (DIST_UNITS[v.distUnit]?.km ?? 1);

  // angle in radians from input
  const angleUnitToRad: Record<string, number> = {
    deg:    Math.PI / 180,
    arcmin: Math.PI / (180 * 60),
    arcsec: Math.PI / (180 * 3600),
    rad:    1,
  };
  const theta_rad_input = parseFloat(v.angle) * (angleUnitToRad[v.angleUnit] ?? 1);

  if (mode === "sizeDistToAngle") {
    if (isNaN(sizeKm) || sizeKm <= 0) error = "Enter valid size.";
    else if (isNaN(distKm) || distKm <= 0) error = "Enter valid distance.";
    else {
      const theta = 2 * Math.atan(sizeKm / (2 * distKm));
      resultAngle = {
        theta_rad: theta,
        theta_deg: rad2deg(theta),
        theta_arcmin: rad2arcmin(theta),
        theta_arcsec: rad2arcsec(theta),
      };
    }
  } else if (mode === "angleDistToSize") {
    if (isNaN(theta_rad_input) || theta_rad_input <= 0) error = "Enter valid angle.";
    else if (isNaN(distKm) || distKm <= 0) error = "Enter valid distance.";
    else {
      const size_km = 2 * distKm * Math.tan(theta_rad_input / 2);
      resultSize = { size_km };
    }
  } else {
    if (isNaN(theta_rad_input) || theta_rad_input <= 0) error = "Enter valid angle.";
    else if (isNaN(sizeKm) || sizeKm <= 0) error = "Enter valid size.";
    else {
      const dist_km = sizeKm / (2 * Math.tan(theta_rad_input / 2));
      resultDist = { dist_km };
    }
  }

  return (
    <CalculatorShell
      title="Angular Size Calculator"
      description="θ = 2 arctan(size / 2d) — angular diameter from physical size and distance."
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-muted mb-1">Solve for</label>
          <select value={v.mode} onChange={e => setV({ mode: e.target.value })} className={sc}>
            <option value="sizeDistToAngle">Angular size (given physical size + distance)</option>
            <option value="angleDistToSize">Physical size (given angle + distance)</option>
            <option value="angleSizeToDist">Distance (given angle + physical size)</option>
          </select>
        </div>

        {/* Size input */}
        {(mode === "sizeDistToAngle" || mode === "angleSizeToDist") && (
          <div>
            <label className="block text-sm text-muted mb-1">Physical size of object</label>
            <div className="flex gap-2">
              <input type="number" value={v.size} onChange={e => setV({ size: e.target.value })} className={ic} min="0" step="any" />
              <select value={v.sizeUnit} onChange={e => setV({ sizeUnit: e.target.value })} className="px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary min-w-[90px]">
                {Object.entries(DIST_UNITS).map(([k, u]) => (
                  <option key={k} value={k}>{u.label}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Distance input */}
        {(mode === "sizeDistToAngle" || mode === "angleDistToSize") && (
          <div>
            <label className="block text-sm text-muted mb-1">Distance to object</label>
            <div className="flex gap-2">
              <input type="number" value={v.dist} onChange={e => setV({ dist: e.target.value })} className={ic} min="0" step="any" />
              <select value={v.distUnit} onChange={e => setV({ distUnit: e.target.value })} className="px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary min-w-[90px]">
                {Object.entries(DIST_UNITS).map(([k, u]) => (
                  <option key={k} value={k}>{u.label}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Angle input */}
        {(mode === "angleDistToSize" || mode === "angleSizeToDist") && (
          <div>
            <label className="block text-sm text-muted mb-1">Angular size</label>
            <div className="flex gap-2">
              <input type="number" value={v.angle} onChange={e => setV({ angle: e.target.value })} className={ic} min="0" step="any" />
              <select value={v.angleUnit} onChange={e => setV({ angleUnit: e.target.value })} className="px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary min-w-[90px]">
                <option value="deg">degrees</option>
                <option value="arcmin">arcmin</option>
                <option value="arcsec">arcsec</option>
                <option value="rad">rad</option>
              </select>
            </div>
          </div>
        )}

        {error && <p className="text-sm text-red-500">{error}</p>}

        {resultAngle && (
          <div className="mt-4 p-4 bg-card rounded-xl border border-card-border space-y-2">
            <div className="text-sm text-muted mb-1">Angular Size</div>
            <div className="bg-primary-light rounded-lg p-3 text-center mb-2">
              <span className="text-xs text-muted block">Angular diameter</span>
              <span className="text-2xl font-bold font-mono text-primary">
                {resultAngle.theta_deg >= 1
                  ? fmt(resultAngle.theta_deg) + "°"
                  : resultAngle.theta_arcmin >= 1
                    ? fmt(resultAngle.theta_arcmin) + "′"
                    : fmt(resultAngle.theta_arcsec) + "″"}
              </span>
            </div>
            <div className="space-y-1 text-xs font-mono">
              {[
                ["Degrees (°)",    fmt(resultAngle.theta_deg) + "°"],
                ["Arcminutes (′)", fmt(resultAngle.theta_arcmin) + "′"],
                ["Arcseconds (″)", fmt(resultAngle.theta_arcsec) + "″"],
                ["Radians",        fmt(resultAngle.theta_rad)],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded">
                  <span className="text-muted">{label}</span><span className="font-semibold">{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {resultSize && (
          <div className="mt-4 p-4 bg-card rounded-xl border border-card-border space-y-2">
            <div className="text-sm text-muted mb-1">Physical Size</div>
            <div className="bg-primary-light rounded-lg p-3 text-center mb-2">
              <span className="text-xs text-muted block">Physical diameter</span>
              <span className="text-2xl font-bold font-mono text-primary">{fmt(resultSize.size_km)} km</span>
            </div>
            <div className="space-y-1 text-xs font-mono">
              {[
                ["km",  fmt(resultSize.size_km) + " km"],
                ["m",   fmt(resultSize.size_km * 1e3) + " m"],
                ["AU",  fmt(resultSize.size_km / 1.495978707e8) + " AU"],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded">
                  <span className="text-muted">{label}</span><span className="font-semibold">{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {resultDist && (
          <div className="mt-4 p-4 bg-card rounded-xl border border-card-border space-y-2">
            <div className="text-sm text-muted mb-1">Distance</div>
            <div className="bg-primary-light rounded-lg p-3 text-center mb-2">
              <span className="text-xs text-muted block">Distance to object</span>
              <span className="text-2xl font-bold font-mono text-primary">{fmt(resultDist.dist_km)} km</span>
            </div>
            <div className="space-y-1 text-xs font-mono">
              {[
                ["km",  fmt(resultDist.dist_km) + " km"],
                ["AU",  fmt(resultDist.dist_km / 1.495978707e8) + " AU"],
                ["ly",  fmt(resultDist.dist_km / 9.4607304725808e12) + " ly"],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded">
                  <span className="text-muted">{label}</span><span className="font-semibold">{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Famous reference */}
        <div>
          <p className="text-xs text-muted mb-1">Famous angular sizes (click to load):</p>
          <div className="overflow-x-auto rounded-lg border border-card-border">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="bg-card border-b border-card-border">
                  <th className="text-left px-3 py-2 text-muted font-medium">Object</th>
                  <th className="text-right px-3 py-2 text-muted font-medium">Angular diameter</th>
                </tr>
              </thead>
              <tbody>
                {FAMOUS.map(f => {
                  const theta = 2 * Math.atan(f.size_km / (2 * f.dist_km));
                  const deg = rad2deg(theta);
                  const arcmin = rad2arcmin(theta);
                  const arcsec = rad2arcsec(theta);
                  const display = deg >= 1 ? `${fmt(deg)}°` : arcmin >= 1 ? `${fmt(arcmin)}′` : `${fmt(arcsec)}″`;
                  return (
                    <tr
                      key={f.label}
                      className="border-b border-card-border cursor-pointer hover:bg-primary-light transition-colors"
                      onClick={() => setV({ mode: "sizeDistToAngle", size: f.size_km.toString(), sizeUnit: "km", dist: f.dist_km.toString(), distUnit: "km" })}
                    >
                      <td className="px-3 py-1.5">{f.label}</td>
                      <td className="px-3 py-1.5 text-right">{display}</td>
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
