"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

const MONITORS = [
  { label: "24\" 1080p (FHD)", diag: "24", w: "1920", h: "1080" },
  { label: "27\" 1440p (QHD)", diag: "27", w: "2560", h: "1440" },
  { label: "27\" 4K (UHD)", diag: "27", w: "3840", h: "2160" },
  { label: "32\" 1440p (QHD)", diag: "32", w: "2560", h: "1440" },
  { label: "32\" 4K (UHD)", diag: "32", w: "3840", h: "2160" },
  { label: "34\" 3440×1440 (UW)", diag: "34", w: "3440", h: "1440" },
  { label: "49\" 5120×1440 (SU)", diag: "49", w: "5120", h: "1440" },
  { label: "13.3\" 2560×1600 (MBP)", diag: "13.3", w: "2560", h: "1600" },
  { label: "14\" 2560×1600 (MBP)", diag: "14", w: "2560", h: "1600" },
  { label: "15.6\" 1920×1080 (laptop)", diag: "15.6", w: "1920", h: "1080" },
  { label: "6.1\" 2532×1170 (iPhone)", diag: "6.1", w: "2532", h: "1170" },
  { label: "6.7\" 2796×1290 (iPhone Pro Max)", diag: "6.7", w: "2796", h: "1290" },
  { label: "11\" 2388×1668 (iPad Pro)", diag: "11", w: "2388", h: "1668" },
];

function ppiLabel(ppi: number): { label: string; color: string } {
  if (ppi < 90) return { label: "Low (you'll see pixels)", color: "text-danger" };
  if (ppi < 110) return { label: "Standard", color: "text-accent" };
  if (ppi < 160) return { label: "Good", color: "text-success" };
  if (ppi < 220) return { label: "Retina / HiDPI", color: "text-primary" };
  return { label: "Super Retina", color: "text-primary" };
}

export default function MonitorPpiPage() {
  const [v, setV] = useHashState({ diag: "27", w: "2560", h: "1440" });
  const diag = parseFloat(v.diag);
  const W = parseFloat(v.w);
  const H = parseFloat(v.h);
  const valid = diag > 0 && W > 0 && H > 0;

  const ppi = valid ? Math.sqrt(W * W + H * H) / diag : 0;
  const dotPitch = ppi > 0 ? 25.4 / ppi : 0; // mm per pixel
  const physW = valid ? (W / ppi).toFixed(2) : "—";
  const physH = valid ? (H / ppi).toFixed(2) : "—";
  const physDiag = valid ? diag.toFixed(2) : "—";

  // Typical viewing distances and whether pixels are visible
  const viewingDistances = [
    { dist: 18, label: "18\" (very close)" },
    { dist: 24, label: "24\" (desk)" },
    { dist: 36, label: "36\" (arm's length)" },
    { dist: 60, label: "60\" (TV distance)" },
  ];
  // Retina threshold: ~1 arcmin per pixel → ppi_min = 3438 / dist_inches
  function isRetina(distIn: number) { return ppi >= 3438 / distIn; }

  const quality = ppi > 0 ? ppiLabel(ppi) : null;
  const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

  return (
    <CalculatorShell title="Monitor PPI Calculator" description="Calculate pixels per inch (PPI) for any screen size and resolution.">
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-sm text-muted mb-1">Diagonal (inches)</label>
            <input type="number" value={v.diag} onChange={e => setV({ diag: e.target.value })} className={ic} min="0" step="0.1" />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Width (px)</label>
            <input type="number" value={v.w} onChange={e => setV({ w: e.target.value })} className={ic} min="0" step="1" />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Height (px)</label>
            <input type="number" value={v.h} onChange={e => setV({ h: e.target.value })} className={ic} min="0" step="1" />
          </div>
        </div>

        {valid && ppi > 0 && (
          <div className="space-y-3">
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="block text-sm text-muted">Pixels Per Inch</span>
              <span className="block font-mono font-bold text-4xl text-primary">{ppi.toFixed(1)}</span>
              {quality && <span className={`block text-sm font-semibold mt-1 ${quality.color}`}>{quality.label}</span>}
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="px-4 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">Dot Pitch</span>
                <span className="font-mono font-bold">{dotPitch.toFixed(3)} mm</span>
              </div>
              <div className="px-4 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">Physical Size</span>
                <span className="font-mono font-bold">{physW}″ × {physH}″</span>
              </div>
              <div className="px-4 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">Megapixels</span>
                <span className="font-mono font-bold">{(W * H / 1e6).toFixed(2)} MP</span>
              </div>
            </div>

            <div>
              <p className="text-xs text-muted mb-1.5">Retina threshold by viewing distance</p>
              <div className="space-y-1">
                {viewingDistances.map(({ dist, label }) => {
                  const retina = isRetina(dist);
                  const minPpi = Math.round(3438 / dist);
                  return (
                    <div key={dist} className="flex items-center justify-between px-3 py-2 bg-background border border-card-border rounded-lg text-sm">
                      <span className="text-muted">{label}</span>
                      <span className={`font-semibold ${retina ? "text-success" : "text-muted"}`}>
                        {retina ? "✓ Retina" : `Need ≥${minPpi} PPI`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <div>
          <p className="text-xs text-muted mb-1.5">Common monitors:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {MONITORS.map(m => {
              const mppi = Math.sqrt(parseInt(m.w) ** 2 + parseInt(m.h) ** 2) / parseFloat(m.diag);
              return (
                <button
                  key={m.label}
                  onClick={() => setV({ diag: m.diag, w: m.w, h: m.h })}
                  className="px-3 py-2 text-xs bg-background border border-card-border rounded-lg hover:bg-primary-light text-left flex justify-between items-center"
                >
                  <span className="font-medium">{m.label}</span>
                  <span className="font-mono text-muted">{mppi.toFixed(0)} ppi</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </CalculatorShell>
  );
}
