"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";
export default function PaintPage() {
  const [v, setV] = useHashState({ length: "20", width: "15", height: "8", doors: "2", windows: "3", coats: "2" });
  const l=parseFloat(v.length), w=parseFloat(v.width), h=parseFloat(v.height), doors=parseInt(v.doors), windows=parseInt(v.windows), coats=parseInt(v.coats);
  const valid=l>0&&w>0&&h>0;
  const wallArea=2*(l+w)*h;
  const doorArea=doors*21; // ~3x7ft
  const windowArea=windows*12; // ~3x4ft
  const paintableArea=(wallArea-doorArea-windowArea)*coats;
  const gallons=paintableArea/350; // ~350 sq ft per gallon
  const ic="w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
  return (
    <CalculatorShell title="Paint Calculator" description="Estimate paint needed for a room.">
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div><label className="block text-sm text-muted mb-1">Length (ft)</label><input type="number" value={v.length} onChange={e=>setV({length:e.target.value})} className={ic}/></div>
          <div><label className="block text-sm text-muted mb-1">Width (ft)</label><input type="number" value={v.width} onChange={e=>setV({width:e.target.value})} className={ic}/></div>
          <div><label className="block text-sm text-muted mb-1">Height (ft)</label><input type="number" value={v.height} onChange={e=>setV({height:e.target.value})} className={ic}/></div>
          <div><label className="block text-sm text-muted mb-1">Doors</label><input type="number" value={v.doors} onChange={e=>setV({doors:e.target.value})} className={ic}/></div>
          <div><label className="block text-sm text-muted mb-1">Windows</label><input type="number" value={v.windows} onChange={e=>setV({windows:e.target.value})} className={ic}/></div>
          <div><label className="block text-sm text-muted mb-1">Coats</label><input type="number" value={v.coats} onChange={e=>setV({coats:e.target.value})} className={ic}/></div>
        </div>
        {valid && <div className="grid grid-cols-2 gap-3">
          <div className="px-4 py-3 bg-primary-light rounded-lg text-center"><span className="block text-xs text-muted">Paintable Area</span><span className="font-mono font-bold text-xl">{paintableArea.toFixed(0)} sq ft</span></div>
          <div className="px-4 py-3 bg-primary-light rounded-lg text-center"><span className="block text-xs text-muted">Gallons Needed</span><span className="font-mono font-bold text-xl text-primary">{Math.ceil(gallons)}</span></div>
        </div>}
      </div>
    </CalculatorShell>
  );
}
