"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";
export default function PoolPage() {
  const [v, setV] = useHashState({ shape: "rect", length: "30", width: "15", depth1: "3", depth2: "8", diameter: "18" });
  const l=parseFloat(v.length), w=parseFloat(v.width), d1=parseFloat(v.depth1), d2=parseFloat(v.depth2), dia=parseFloat(v.diameter);
  const avgDepth=(d1+d2)/2;
  let cubicFt=0;
  if (v.shape==="rect") cubicFt=l*w*avgDepth;
  else cubicFt=Math.PI*(dia/2)**2*avgDepth;
  const gallons=cubicFt*7.48052;
  const valid=cubicFt>0;
  const ic="w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
  return (
    <CalculatorShell title="Pool Volume Calculator" description="Calculate pool water volume in gallons.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <button onClick={()=>setV({shape:"rect"})} className={`py-2 rounded-lg text-sm font-medium ${v.shape==="rect"?"bg-primary text-white":"bg-background border border-card-border"}`}>Rectangular</button>
          <button onClick={()=>setV({shape:"round"})} className={`py-2 rounded-lg text-sm font-medium ${v.shape==="round"?"bg-primary text-white":"bg-background border border-card-border"}`}>Round</button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {v.shape==="rect"?<><div><label className="block text-sm text-muted mb-1">Length (ft)</label><input type="number" value={v.length} onChange={e=>setV({length:e.target.value})} className={ic}/></div>
            <div><label className="block text-sm text-muted mb-1">Width (ft)</label><input type="number" value={v.width} onChange={e=>setV({width:e.target.value})} className={ic}/></div></>
          :<div className="col-span-2"><label className="block text-sm text-muted mb-1">Diameter (ft)</label><input type="number" value={v.diameter} onChange={e=>setV({diameter:e.target.value})} className={ic}/></div>}
          <div><label className="block text-sm text-muted mb-1">Shallow End (ft)</label><input type="number" value={v.depth1} onChange={e=>setV({depth1:e.target.value})} className={ic}/></div>
          <div><label className="block text-sm text-muted mb-1">Deep End (ft)</label><input type="number" value={v.depth2} onChange={e=>setV({depth2:e.target.value})} className={ic}/></div>
        </div>
        {valid && <div className="bg-primary-light rounded-xl p-4 text-center"><span className="block text-sm text-muted">Pool Volume</span><span className="block font-mono font-bold text-3xl text-primary">{Math.round(gallons).toLocaleString()} gallons</span>
          <span className="block text-xs text-muted">{cubicFt.toFixed(0)} cubic feet</span></div>}
      </div>
    </CalculatorShell>
  );
}
