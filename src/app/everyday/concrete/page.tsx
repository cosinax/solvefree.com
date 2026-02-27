"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";
export default function ConcretePage() {
  const [v, setV] = useHashState({ length: "10", width: "10", depth: "4" });
  const l=parseFloat(v.length), w=parseFloat(v.width), d=parseFloat(v.depth)/12; // depth in inches -> feet
  const valid=l>0&&w>0&&d>0;
  const cubicFt=l*w*d;
  const cubicYd=cubicFt/27;
  const bags60=Math.ceil(cubicFt/0.45);
  const bags80=Math.ceil(cubicFt/0.6);
  const ic="w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
  return (
    <CalculatorShell title="Concrete Calculator" description="Calculate concrete volume needed for a slab, footing, or project.">
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div><label className="block text-sm text-muted mb-1">Length (ft)</label><input type="number" value={v.length} onChange={e=>setV({length:e.target.value})} className={ic}/></div>
          <div><label className="block text-sm text-muted mb-1">Width (ft)</label><input type="number" value={v.width} onChange={e=>setV({width:e.target.value})} className={ic}/></div>
          <div><label className="block text-sm text-muted mb-1">Depth (in)</label><input type="number" value={v.depth} onChange={e=>setV({depth:e.target.value})} className={ic}/></div>
        </div>
        {valid && <div className="grid grid-cols-2 gap-3">
          <div className="px-4 py-3 bg-primary-light rounded-lg text-center"><span className="block text-xs text-muted">Cubic Feet</span><span className="font-mono font-bold text-xl">{cubicFt.toFixed(1)}</span></div>
          <div className="px-4 py-3 bg-primary-light rounded-lg text-center"><span className="block text-xs text-muted">Cubic Yards</span><span className="font-mono font-bold text-xl text-primary">{cubicYd.toFixed(2)}</span></div>
          <div className="px-4 py-3 bg-primary-light rounded-lg text-center"><span className="block text-xs text-muted">60-lb Bags</span><span className="font-mono font-bold text-xl">{bags60}</span></div>
          <div className="px-4 py-3 bg-primary-light rounded-lg text-center"><span className="block text-xs text-muted">80-lb Bags</span><span className="font-mono font-bold text-xl">{bags80}</span></div>
        </div>}
        <p className="text-xs text-muted">Add 5-10% extra for waste.</p>
      </div>
    </CalculatorShell>
  );
}
