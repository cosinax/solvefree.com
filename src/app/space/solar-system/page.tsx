"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";
import { useMemo } from "react";

interface Planet {
  name: string;
  color: string;
  radiusKm: number;
  distanceAU: number;
  orbitalPeriodDays: number;
  moons: number;
  emoji: string;
  description: string;
}

const PLANETS: Planet[] = [
  { name: "Mercury", color: "#9ca3af", radiusKm: 2440, distanceAU: 0.387, orbitalPeriodDays: 88, moons: 0, emoji: "☿", description: "Smallest planet, no atmosphere, extreme temperature swings" },
  { name: "Venus", color: "#fbbf24", radiusKm: 6052, distanceAU: 0.723, orbitalPeriodDays: 225, moons: 0, emoji: "♀", description: "Hottest planet (462°C), thick CO₂ atmosphere, retrograde rotation" },
  { name: "Earth", color: "#3b82f6", radiusKm: 6371, distanceAU: 1.000, orbitalPeriodDays: 365, moons: 1, emoji: "🌍", description: "Home. Only known planet with life, liquid water on surface" },
  { name: "Mars", color: "#ef4444", radiusKm: 3390, distanceAU: 1.524, orbitalPeriodDays: 687, moons: 2, emoji: "♂", description: "The Red Planet. Largest volcano in solar system (Olympus Mons)" },
  { name: "Jupiter", color: "#f97316", radiusKm: 71492, distanceAU: 5.203, orbitalPeriodDays: 4333, moons: 95, emoji: "♃", description: "Largest planet, Great Red Spot (giant storm), powerful magnetic field" },
  { name: "Saturn", color: "#eab308", radiusKm: 60268, distanceAU: 9.537, orbitalPeriodDays: 10759, moons: 146, emoji: "♄", description: "Famous rings made of ice and rock, least dense planet (floats on water)" },
  { name: "Uranus", color: "#06b6d4", radiusKm: 25559, distanceAU: 19.19, orbitalPeriodDays: 30687, moons: 27, emoji: "♅", description: "Rotates on its side (98°), ice giant, faint rings discovered 1977" },
  { name: "Neptune", color: "#1d4ed8", radiusKm: 24622, distanceAU: 30.07, orbitalPeriodDays: 60190, moons: 16, emoji: "♆", description: "Windiest planet (2,100 km/h), only planet predicted before discovery" },
];

const SUN_RADIUS_KM = 696000;
const EARTH_RADIUS = 6371;

function fmtPeriod(days: number) {
  if (days >= 365) return `${(days / 365.25).toFixed(1)} yr`;
  return `${days} d`;
}

export default function SolarSystemPage() {
  const [v, setV] = useHashState({ view: "distance", selected: "" });

  const maxDist = PLANETS[PLANETS.length - 1].distanceAU;
  const maxRadius = PLANETS.reduce((m, p) => Math.max(m, p.radiusKm), 0);

  const selectedPlanet = PLANETS.find(p => p.name === v.selected) ?? null;

  // Scale for distance view: logarithmic for readability
  const distScale = (au: number) => {
    if (v.view === "linear") return (au / maxDist) * 100;
    return (Math.log10(au + 0.1) / Math.log10(maxDist + 0.1)) * 100;
  };

  const sizeScale = (r: number) => Math.sqrt(r / maxRadius) * 100;

  return (
    <CalculatorShell
      title="Solar System Explorer"
      description="Visualize the relative sizes and distances of the planets in our solar system."
    >
      <div className="space-y-6">
        {/* View toggle */}
        <div className="flex gap-2">
          {[
            { key: "distance", label: "Distance View" },
            { key: "size", label: "Size Comparison" },
            { key: "stats", label: "Data Table" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setV({ view: key })}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                v.view === key
                  ? "bg-primary text-white border-primary"
                  : "bg-card border-card-border hover:bg-primary-light"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Distance view */}
        {(v.view === "distance" || v.view === "linear") && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <p className="text-xs text-muted">{v.view === "linear" ? "Linear" : "Logarithmic"} scale · AU from Sun</p>
              <button
                onClick={() => setV({ view: v.view === "linear" ? "distance" : "linear" })}
                className="text-xs text-primary hover:underline"
              >
                Switch to {v.view === "linear" ? "log" : "linear"} scale
              </button>
            </div>
            <div className="relative py-4">
              {/* Sun */}
              <div className="flex items-center gap-3 mb-1">
                <div className="w-8 h-8 rounded-full bg-yellow-400 shrink-0 flex items-center justify-center text-xs" style={{ boxShadow: "0 0 12px #fbbf24" }}>☀️</div>
                <div className="text-xs text-muted">Sun (0 AU)</div>
              </div>
              {/* Distance rail */}
              <div className="relative h-1 bg-card-border rounded-full mt-2 mb-6 mx-10">
                {PLANETS.map(p => (
                  <button
                    key={p.name}
                    onClick={() => setV({ selected: v.selected === p.name ? "" : p.name })}
                    className="absolute -translate-x-1/2 group"
                    style={{ left: `${distScale(p.distanceAU)}%`, top: "-6px" }}
                    title={p.name}
                  >
                    <div
                      className={`w-3 h-3 rounded-full border-2 border-background transition-transform group-hover:scale-150 ${v.selected === p.name ? "scale-150" : ""}`}
                      style={{ backgroundColor: p.color }}
                    />
                    <div className="absolute -bottom-5 -translate-x-1/2 text-xs whitespace-nowrap hidden group-hover:block" style={{ color: p.color }}>
                      {p.name}
                    </div>
                  </button>
                ))}
              </div>
              {/* Planet list */}
              <div className="space-y-2 mt-4">
                {PLANETS.map(p => (
                  <button
                    key={p.name}
                    onClick={() => setV({ selected: v.selected === p.name ? "" : p.name })}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg border transition-colors text-left ${
                      v.selected === p.name ? "bg-primary-light border-primary/30" : "bg-card border-card-border hover:bg-primary-light/50"
                    }`}
                  >
                    <span className="text-lg shrink-0">{p.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold">{p.name}</div>
                      <div className="text-xs text-muted">{p.distanceAU} AU · {fmtPeriod(p.orbitalPeriodDays)} orbit</div>
                    </div>
                    <div className="h-2 flex-shrink-0 w-32 bg-card-border rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${distScale(p.distanceAU)}%`, backgroundColor: p.color }} />
                    </div>
                    <span className="text-xs font-mono w-12 text-right">{p.distanceAU} AU</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Size comparison */}
        {v.view === "size" && (
          <div className="space-y-4">
            <p className="text-xs text-muted">Relative sizes (area proportional to actual radius²). Click a planet for details.</p>
            {/* Sun reference */}
            <div className="flex items-center gap-3">
              <div
                className="rounded-full shrink-0 bg-yellow-400"
                style={{ width: 40, height: 40, boxShadow: "0 0 16px #fbbf24" }}
              />
              <div className="text-xs">
                <div className="font-semibold">☀️ Sun</div>
                <div className="text-muted">696,000 km radius · {(SUN_RADIUS_KM / EARTH_RADIUS).toFixed(0)}× Earth</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 items-end">
              {PLANETS.map(p => {
                const size = Math.max(sizeScale(p.radiusKm) * 0.6, 6);
                return (
                  <button
                    key={p.name}
                    onClick={() => setV({ selected: v.selected === p.name ? "" : p.name })}
                    className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition-colors ${
                      v.selected === p.name ? "bg-primary-light border-primary/30" : "border-transparent hover:bg-card"
                    }`}
                  >
                    <div
                      className="rounded-full"
                      style={{
                        width: size, height: size,
                        backgroundColor: p.color,
                        boxShadow: `0 0 ${size / 3}px ${p.color}66`,
                      }}
                    />
                    <div className="text-xs text-center">
                      <div>{p.emoji}</div>
                      <div className="text-muted text-[10px]">{p.name}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Stats table */}
        {v.view === "stats" && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-card-border text-muted text-left">
                  <th className="pb-2 font-medium">Planet</th>
                  <th className="pb-2 font-medium">Radius</th>
                  <th className="pb-2 font-medium">Distance</th>
                  <th className="pb-2 font-medium">Orbital Period</th>
                  <th className="pb-2 font-medium">Moons</th>
                </tr>
              </thead>
              <tbody>
                {PLANETS.map(p => (
                  <tr
                    key={p.name}
                    className="border-b border-card-border/50 last:border-0 cursor-pointer hover:bg-primary-light/50 transition-colors"
                    onClick={() => setV({ selected: v.selected === p.name ? "" : p.name })}
                  >
                    <td className="py-2">
                      <span className="mr-1">{p.emoji}</span>
                      <span style={{ color: p.color }} className="font-semibold">{p.name}</span>
                    </td>
                    <td className="py-2 font-mono">{p.radiusKm.toLocaleString()} km</td>
                    <td className="py-2 font-mono">{p.distanceAU} AU</td>
                    <td className="py-2 font-mono">{fmtPeriod(p.orbitalPeriodDays)}</td>
                    <td className="py-2 font-mono">{p.moons}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Selected planet panel */}
        {selectedPlanet && (
          <div className="p-4 rounded-lg border border-primary/30 bg-primary-light space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{selectedPlanet.emoji}</span>
              <div>
                <div className="font-bold" style={{ color: selectedPlanet.color }}>{selectedPlanet.name}</div>
                <div className="text-xs text-muted">{selectedPlanet.description}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {[
                { label: "Radius", value: `${selectedPlanet.radiusKm.toLocaleString()} km` },
                { label: "vs Earth", value: `${(selectedPlanet.radiusKm / EARTH_RADIUS).toFixed(2)}×` },
                { label: "Distance", value: `${selectedPlanet.distanceAU} AU` },
                { label: "Year length", value: fmtPeriod(selectedPlanet.orbitalPeriodDays) },
                { label: "Moons", value: selectedPlanet.moons.toString() },
                { label: "Light travel", value: `${(selectedPlanet.distanceAU * 8.317).toFixed(1)} min` },
              ].map(r => (
                <div key={r.label} className="p-2 bg-card rounded border border-card-border text-center">
                  <div className="text-muted">{r.label}</div>
                  <div className="font-mono font-semibold">{r.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="text-xs text-muted">
          Distances are average orbital distances (semi-major axis). Sizes use actual planetary radii. Click any planet for details.
        </p>
      </div>
    </CalculatorShell>
  );
}
