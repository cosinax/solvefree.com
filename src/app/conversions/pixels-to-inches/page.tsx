"use client";

import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

const DPI_PRESETS = [72, 96, 120, 144, 150, 192, 300, 600];

// Common screen/device resolutions
const SCREEN_REFS = [
  { name: "SD Video (480p)", w: 640, h: 480 },
  { name: "HD (720p)", w: 1280, h: 720 },
  { name: "Full HD (1080p)", w: 1920, h: 1080 },
  { name: "2K / QHD (1440p)", w: 2560, h: 1440 },
  { name: "4K UHD", w: 3840, h: 2160 },
  { name: "iPhone 15 (6.1\")", w: 2556, h: 1179, diag: 6.1, note: "460 PPI" },
  { name: "MacBook Pro 14\" (2023)", w: 3024, h: 1964, diag: 14.2, note: "254 PPI" },
  { name: "Print — A4 @ 300dpi", w: 2480, h: 3508 },
];

function fmt(n: number, decimals = 4): string {
  if (!isFinite(n) || isNaN(n)) return "—";
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
}

export default function PixelsToInchesPage() {
  const [v, setV] = useHashState({
    pixels: "96",
    dpi: "96",
    inches: "",
    direction: "px-to-in",
  });

  const pixelsVal = parseFloat(v.pixels);
  const dpiVal = parseFloat(v.dpi);
  const inchesVal = parseFloat(v.inches);
  const dpiValid = !isNaN(dpiVal) && dpiVal > 0;

  let inches = 0;
  let pixels = 0;
  let valid = false;

  if (v.direction === "px-to-in") {
    valid = !isNaN(pixelsVal) && pixelsVal >= 0 && dpiValid;
    inches = valid ? pixelsVal / dpiVal : 0;
    pixels = pixelsVal;
  } else {
    valid = !isNaN(inchesVal) && inchesVal >= 0 && dpiValid;
    pixels = valid ? inchesVal * dpiVal : 0;
    inches = inchesVal;
  }

  const cm = inches * 2.54;
  const mm = inches * 25.4;
  const points = inches * 72;   // 1 pt = 1/72 inch
  const picas = inches * 6;     // 1 pica = 12 pt = 1/6 inch

  return (
    <CalculatorShell
      title="Pixels to Inches Converter"
      description="Convert pixels to inches, cm, mm, points, and picas at any DPI/PPI. Includes common screen resolution reference."
    >
      <div className="space-y-5">
        {/* Direction toggle */}
        <div className="flex rounded-lg overflow-hidden border border-card-border text-sm font-medium">
          <button
            onClick={() => setV({ direction: "px-to-in" })}
            className={`flex-1 py-2 transition-colors ${
              v.direction === "px-to-in"
                ? "bg-primary text-primary-foreground"
                : "bg-background text-muted hover:bg-card"
            }`}
          >
            Pixels → Inches
          </button>
          <button
            onClick={() => setV({ direction: "in-to-px" })}
            className={`flex-1 py-2 transition-colors ${
              v.direction === "in-to-px"
                ? "bg-primary text-primary-foreground"
                : "bg-background text-muted hover:bg-card"
            }`}
          >
            Inches → Pixels
          </button>
        </div>

        {/* DPI selector */}
        <div>
          <label className="block text-sm text-muted mb-1">DPI / PPI</label>
          <div className="flex gap-2">
            <input
              type="number"
              min="1"
              step="1"
              value={v.dpi}
              onChange={(e) => setV({ dpi: e.target.value })}
              className="flex-1 px-4 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-base"
            />
            <select
              value={DPI_PRESETS.includes(parseInt(v.dpi)) ? v.dpi : ""}
              onChange={(e) => { if (e.target.value) setV({ dpi: e.target.value }); }}
              className="px-3 py-2.5 bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            >
              <option value="">Presets</option>
              {DPI_PRESETS.map((d) => (
                <option key={d} value={String(d)}>{d} PPI</option>
              ))}
            </select>
          </div>
          <p className="text-xs text-muted mt-1">72=web/print, 96=Windows screen, 144=HiDPI, 300=photo print</p>
        </div>

        {v.direction === "px-to-in" ? (
          <div>
            <label className="block text-sm text-muted mb-1">Pixels (px)</label>
            <input
              type="number"
              min="0"
              step="1"
              value={v.pixels}
              onChange={(e) => setV({ pixels: e.target.value })}
              className="w-full px-4 py-3 text-xl font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        ) : (
          <div>
            <label className="block text-sm text-muted mb-1">Inches (in)</label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={v.inches}
              onChange={(e) => setV({ inches: e.target.value })}
              className="w-full px-4 py-3 text-xl font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        )}

        {valid && (
          <>
            <div className="bg-primary-light rounded-xl p-4 text-center">
              {v.direction === "px-to-in" ? (
                <>
                  <span className="block text-sm text-muted">{fmt(pixels, 0)} px at {fmt(dpiVal, 0)} DPI =</span>
                  <span className="block font-mono font-bold text-3xl text-primary">{fmt(inches)} inches</span>
                </>
              ) : (
                <>
                  <span className="block text-sm text-muted">{fmt(inches)} inches at {fmt(dpiVal, 0)} DPI =</span>
                  <span className="block font-mono font-bold text-3xl text-primary">{fmt(pixels, 0)} pixels</span>
                </>
              )}
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xs text-muted font-semibold uppercase tracking-wide">All equivalents</h3>
              {[
                { label: "Inches (in)", value: fmt(inches) },
                { label: "Pixels (px)", value: fmt(pixels, 0) },
                { label: "Centimeters (cm)", value: fmt(cm) },
                { label: "Millimeters (mm)", value: fmt(mm) },
                { label: "Points (pt) — 1 pt = 1/72\"", value: fmt(points) },
                { label: "Picas (pc) — 1 pc = 1/6\"", value: fmt(picas) },
              ].map((r) => (
                <div
                  key={r.label}
                  className="flex justify-between items-center px-3 py-2 bg-background border border-card-border rounded-lg text-sm"
                >
                  <span className="text-muted">{r.label}</span>
                  <span className="font-mono font-semibold">{r.value}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Quick reference: common resolutions */}
        <div>
          <h3 className="text-xs text-muted font-semibold uppercase tracking-wide mb-2">
            Common Screen Resolutions
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-card-border">
                  <th className="text-left py-2 pr-3 text-muted font-medium">Display</th>
                  <th className="text-right py-2 pr-3 text-muted font-medium">Width (px)</th>
                  <th className="text-right py-2 pr-3 text-muted font-medium">Height (px)</th>
                  <th className="text-right py-2 text-muted font-medium">Note</th>
                </tr>
              </thead>
              <tbody>
                {SCREEN_REFS.map((r) => (
                  <tr key={r.name} className="border-b border-card-border last:border-0">
                    <td className="py-2 pr-3">{r.name}</td>
                    <td className="py-2 pr-3 text-right font-mono text-muted">{r.w.toLocaleString()}</td>
                    <td className="py-2 pr-3 text-right font-mono text-muted">{r.h.toLocaleString()}</td>
                    <td className="py-2 text-right text-muted text-xs">{r.note ?? ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-card border border-card-border rounded-lg p-3 text-sm">
          <p className="font-medium mb-1">Typography units</p>
          <ul className="text-muted text-xs space-y-0.5">
            <li>1 inch = 72 points (pt)</li>
            <li>1 inch = 6 picas (pc)</li>
            <li>1 pica = 12 points</li>
            <li>CSS px at 96 DPI: 1 in = 96 px</li>
          </ul>
        </div>
      </div>
    </CalculatorShell>
  );
}
