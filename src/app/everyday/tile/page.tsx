"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";
export default function TilePage() {
  const [v, setV] = useHashState({ areaL: "10", areaW: "12", tileL: "12", tileW: "12", waste: "10" });
  const al=parseFloat(v.areaL), aw=parseFloat(v.areaW), tl=parseFloat(v.tileL)/12, tw=parseFloat(v.tileW)/12, waste=parseFloat(v.waste)/100;
  const valid=al>0&&aw>0&&tl>0&&tw>0;
  const areaSqFt=al*aw;
  const tileArea=tl*tw;
  const tilesNeeded=Math.ceil(areaSqFt/tileArea*(1+waste));
  const boxes=Math.ceil(tilesNeeded/12);
  const ic="w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
  return (
    <CalculatorShell title="Tile Calculator" description="Estimate tiles needed for a floor or wall.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div><label className="block text-sm text-muted mb-1">Room Length (ft)</label><input type="number" value={v.areaL} onChange={e=>setV({areaL:e.target.value})} className={ic}/></div>
          <div><label className="block text-sm text-muted mb-1">Room Width (ft)</label><input type="number" value={v.areaW} onChange={e=>setV({areaW:e.target.value})} className={ic}/></div>
          <div><label className="block text-sm text-muted mb-1">Tile Length (in)</label><input type="number" value={v.tileL} onChange={e=>setV({tileL:e.target.value})} className={ic}/></div>
          <div><label className="block text-sm text-muted mb-1">Tile Width (in)</label><input type="number" value={v.tileW} onChange={e=>setV({tileW:e.target.value})} className={ic}/></div>
        </div>
        <div><label className="block text-sm text-muted mb-1">Waste Factor (%)</label><input type="number" value={v.waste} onChange={e=>setV({waste:e.target.value})} className={ic}/></div>
        {valid && <div className="grid grid-cols-3 gap-3">
          <div className="px-4 py-3 bg-primary-light rounded-lg text-center"><span className="block text-xs text-muted">Area</span><span className="font-mono font-bold text-xl">{areaSqFt.toFixed(0)} ft²</span></div>
          <div className="px-4 py-3 bg-primary-light rounded-lg text-center"><span className="block text-xs text-muted">Tiles Needed</span><span className="font-mono font-bold text-xl text-primary">{tilesNeeded}</span></div>
          <div className="px-4 py-3 bg-primary-light rounded-lg text-center"><span className="block text-xs text-muted">Boxes (~12/box)</span><span className="font-mono font-bold text-xl">{boxes}</span></div>
        </div>}
      </div>
    </CalculatorShell>
  );
}
