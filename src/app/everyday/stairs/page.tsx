"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";
export default function StairsPage() {
  const [v, setV] = useHashState({ totalRise: "108", riserHeight: "7.5" });
  const totalRise=parseFloat(v.totalRise), riser=parseFloat(v.riserHeight);
  const valid=totalRise>0&&riser>0;
  const numSteps=Math.ceil(totalRise/riser);
  const actualRiser=totalRise/numSteps;
  const tread=Math.max(10,25-2*actualRiser); // Rule: 2R+T=25
  const totalRun=tread*(numSteps-1);
  const angle=Math.atan(actualRiser/tread)*180/Math.PI;
  const ic="w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
  return (
    <CalculatorShell title="Stair Calculator" description="Calculate stair rise, run, number of steps, and angle.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div><label className="block text-sm text-muted mb-1">Total Rise (inches)</label><input type="number" value={v.totalRise} onChange={e=>setV({totalRise:e.target.value})} className={ic}/></div>
          <div><label className="block text-sm text-muted mb-1">Target Riser Height (in)</label><input type="number" value={v.riserHeight} onChange={e=>setV({riserHeight:e.target.value})} step="0.25" className={ic}/></div>
        </div>
        {valid && <div className="grid grid-cols-2 gap-3">
          <div className="px-4 py-3 bg-primary-light rounded-lg text-center"><span className="block text-xs text-muted">Number of Steps</span><span className="font-mono font-bold text-2xl text-primary">{numSteps}</span></div>
          <div className="px-4 py-3 bg-primary-light rounded-lg text-center"><span className="block text-xs text-muted">Actual Riser</span><span className="font-mono font-bold text-xl">{actualRiser.toFixed(2)}&quot;</span></div>
          <div className="px-4 py-3 bg-primary-light rounded-lg text-center"><span className="block text-xs text-muted">Tread Depth</span><span className="font-mono font-bold text-xl">{tread.toFixed(1)}&quot;</span></div>
          <div className="px-4 py-3 bg-primary-light rounded-lg text-center"><span className="block text-xs text-muted">Total Run</span><span className="font-mono font-bold text-xl">{totalRun.toFixed(1)}&quot;</span></div>
          <div className="px-4 py-3 bg-primary-light rounded-lg text-center col-span-2"><span className="block text-xs text-muted">Stair Angle</span><span className="font-mono font-bold text-xl">{angle.toFixed(1)}°</span></div>
        </div>}
        <p className="text-xs text-muted">IRC residential code: risers 4–7.75&quot;, treads ≥10&quot;. Rule of thumb: 2R + T = 25&quot;</p>
      </div>
    </CalculatorShell>
  );
}
