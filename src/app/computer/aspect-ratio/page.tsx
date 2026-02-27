"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

// Aspect ratio utilities
function gcd(a: number, b: number): number { return b === 0 ? a : gcd(b, a % b); }

export default function AspectRatioPage() {
  const [v, setV] = useHashState({ w: "1920", h: "1080" });
  const W = parseFloat(v.w), H = parseFloat(v.h);
  const valid = W > 0 && H > 0;
  const d = valid ? gcd(Math.round(W), Math.round(H)) : 1;
  const rw = Math.round(W) / d, rh = Math.round(H) / d;
  const ratio = W / H;
  const diagonal = valid ? Math.sqrt(W * W + H * H) : 0;

  const commonRatios = [
    { label: "16:9 (HD)", w: 1920, h: 1080 },
    { label: "16:10 (WUXGA)", w: 1920, h: 1200 },
    { label: "4:3 (old monitors)", w: 1024, h: 768 },
    { label: "21:9 (ultrawide)", w: 2560, h: 1080 },
    { label: "1:1 (square)", w: 1080, h: 1080 },
    { label: "9:16 (portrait)", w: 1080, h: 1920 },
    { label: "4:5 (Instagram)", w: 1080, h: 1350 },
    { label: "3:2 (camera)", w: 4500, h: 3000 },
  ];

  const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

  return (
    <CalculatorShell title="Aspect Ratio Calculator" description="Calculate aspect ratios, equivalent resolutions, and common display formats.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div><label className="block text-sm text-muted mb-1">Width (px)</label><input type="number" value={v.w} onChange={e => setV({ w: e.target.value })} className={ic} /></div>
          <div><label className="block text-sm text-muted mb-1">Height (px)</label><input type="number" value={v.h} onChange={e => setV({ h: e.target.value })} className={ic} /></div>
        </div>
        {valid && (
          <div className="space-y-3">
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="block text-sm text-muted">Aspect Ratio</span>
              <span className="block font-mono font-bold text-4xl text-primary">{rw}:{rh}</span>
              <span className="block text-sm text-muted">{ratio.toFixed(4)}:1 · {W.toLocaleString()}×{H.toLocaleString()} px</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="px-4 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">Megapixels</span>
                <span className="font-mono font-bold text-lg">{(W * H / 1e6).toFixed(2)} MP</span>
              </div>
              <div className="px-4 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">Diagonal</span>
                <span className="font-mono font-bold text-lg">{diagonal.toFixed(0)} px</span>
              </div>
              <div className="px-4 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">Ratio (decimal)</span>
                <span className="font-mono font-bold text-lg">{ratio.toFixed(3)}</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted mb-2">Equivalent resolutions at this ratio:</p>
              <div className="grid grid-cols-2 gap-1 text-xs font-mono">
                {[240, 360, 480, 720, 1080, 1440, 2160].map(targetH => {
                  const targetW = Math.round(targetH * ratio);
                  return (
                    <div key={targetH} className={`flex justify-between px-2 py-1.5 rounded border ${Math.round(H) === targetH ? "bg-primary-light border-primary/30" : "bg-background border-card-border"}`}>
                      <span>{targetW}×{targetH}</span>
                      <span className="text-muted">{(targetW * targetH / 1e6).toFixed(2)} MP</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        <div>
          <p className="text-xs text-muted mb-2">Common ratios:</p>
          <div className="grid grid-cols-2 gap-1.5">
            {commonRatios.map(r => (
              <button key={r.label} onClick={() => setV({ w: r.w.toString(), h: r.h.toString() })}
                className="px-3 py-2 text-xs bg-background border border-card-border rounded-lg hover:bg-primary-light text-left">
                <span className="block font-medium">{r.label}</span>
                <span className="font-mono text-muted">{r.w}×{r.h}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </CalculatorShell>
  );
}
