"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";
export default function PxRemPage() {
  const [v, setV] = useHashState({ px: "16", base: "16" });
  const px = parseFloat(v.px), base = parseFloat(v.base) || 16;
  const rem = px / base;
  const em = rem;
  const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
  return (
    <CalculatorShell title="Pixel / REM Converter" description="Convert between px, rem, and em CSS units.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div><label className="block text-sm text-muted mb-1">Pixels (px)</label><input type="number" value={v.px} onChange={e=>setV({px:e.target.value})} className={ic}/></div>
          <div><label className="block text-sm text-muted mb-1">Base Font Size (px)</label><input type="number" value={v.base} onChange={e=>setV({base:e.target.value})} className={ic}/></div>
        </div>
        {!isNaN(px) && <div className="grid grid-cols-3 gap-3">
          <div className="px-4 py-3 bg-primary-light rounded-lg text-center"><span className="block text-xs text-muted">px</span><span className="font-mono font-bold text-xl">{px}</span></div>
          <div className="px-4 py-3 bg-primary-light rounded-lg text-center"><span className="block text-xs text-muted">rem</span><span className="font-mono font-bold text-xl">{rem.toFixed(4)}</span></div>
          <div className="px-4 py-3 bg-primary-light rounded-lg text-center"><span className="block text-xs text-muted">em</span><span className="font-mono font-bold text-xl">{em.toFixed(4)}</span></div>
        </div>}
        <div className="space-y-1 text-xs font-mono text-muted">
          {[8,10,12,14,16,18,20,24,32,48,64].map(p=><div key={p} className="flex justify-between px-3 py-1 bg-background border border-card-border rounded"><span>{p}px</span><span>{(p/base).toFixed(3)}rem</span></div>)}
        </div>
      </div>
    </CalculatorShell>
  );
}
