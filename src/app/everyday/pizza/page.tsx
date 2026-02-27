"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";
export default function PizzaPage() {
  const [v, setV] = useHashState({ size1: "12", price1: "12", size2: "16", price2: "18" });
  const s1=parseFloat(v.size1), p1=parseFloat(v.price1), s2=parseFloat(v.size2), p2=parseFloat(v.price2);
  const area1=Math.PI*(s1/2)**2, area2=Math.PI*(s2/2)**2;
  const ppi1=p1/area1, ppi2=p2/area2;
  const valid=s1>0&&p1>0&&s2>0&&p2>0;
  const ic="w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
  return (
    <CalculatorShell title="Pizza Calculator" description="Compare pizza sizes by price per square inch. Bigger is usually better!">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2"><h3 className="text-sm font-semibold">Pizza A</h3>
            <div><label className="block text-xs text-muted mb-1">Size (inches)</label><input type="number" value={v.size1} onChange={e=>setV({size1:e.target.value})} className={ic}/></div>
            <div><label className="block text-xs text-muted mb-1">Price ($)</label><input type="number" value={v.price1} onChange={e=>setV({price1:e.target.value})} className={ic}/></div>
          </div>
          <div className="space-y-2"><h3 className="text-sm font-semibold">Pizza B</h3>
            <div><label className="block text-xs text-muted mb-1">Size (inches)</label><input type="number" value={v.size2} onChange={e=>setV({size2:e.target.value})} className={ic}/></div>
            <div><label className="block text-xs text-muted mb-1">Price ($)</label><input type="number" value={v.price2} onChange={e=>setV({price2:e.target.value})} className={ic}/></div>
          </div>
        </div>
        {valid && <div className="grid grid-cols-2 gap-3">
          <div className={`px-4 py-3 rounded-lg text-center ${ppi1<ppi2?"bg-green-50 dark:bg-green-950 border-2 border-success":"bg-primary-light"}`}>
            <span className="block text-xs text-muted">Pizza A ({s1}&quot;)</span>
            <span className="font-mono font-bold text-lg">{area1.toFixed(0)} sq in</span>
            <span className="block font-mono text-sm">${ppi1.toFixed(3)}/sq in</span>
            {ppi1<ppi2 && <span className="text-xs text-success font-semibold">🏆 Better deal!</span>}
          </div>
          <div className={`px-4 py-3 rounded-lg text-center ${ppi2<ppi1?"bg-green-50 dark:bg-green-950 border-2 border-success":"bg-primary-light"}`}>
            <span className="block text-xs text-muted">Pizza B ({s2}&quot;)</span>
            <span className="font-mono font-bold text-lg">{area2.toFixed(0)} sq in</span>
            <span className="block font-mono text-sm">${ppi2.toFixed(3)}/sq in</span>
            {ppi2<ppi1 && <span className="text-xs text-success font-semibold">🏆 Better deal!</span>}
          </div>
        </div>}
      </div>
    </CalculatorShell>
  );
}
