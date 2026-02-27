"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";
export default function GradePage() {
  const [v, setV] = useHashState({ current: "85", weight: "70", desired: "90", finalWeight: "30" });
  const cur = parseFloat(v.current), w = parseFloat(v.weight)/100, des = parseFloat(v.desired), fw = parseFloat(v.finalWeight)/100;
  const valid = cur>=0 && w>0 && des>=0 && fw>0;
  const needed = valid ? (des - cur*w) / fw : 0;
  const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
  return (
    <CalculatorShell title="Grade Calculator" description="What grade do I need on the final exam?">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div><label className="block text-sm text-muted mb-1">Current Grade (%)</label><input type="number" value={v.current} onChange={e=>setV({current:e.target.value})} className={ic}/></div>
          <div><label className="block text-sm text-muted mb-1">Current Weight (%)</label><input type="number" value={v.weight} onChange={e=>setV({weight:e.target.value})} className={ic}/></div>
          <div><label className="block text-sm text-muted mb-1">Desired Grade (%)</label><input type="number" value={v.desired} onChange={e=>setV({desired:e.target.value})} className={ic}/></div>
          <div><label className="block text-sm text-muted mb-1">Final Exam Weight (%)</label><input type="number" value={v.finalWeight} onChange={e=>setV({finalWeight:e.target.value})} className={ic}/></div>
        </div>
        {valid && <div className={`bg-primary-light rounded-xl p-4 text-center`}>
          <span className="block text-sm text-muted">You need on the final</span>
          <span className={`block font-mono font-bold text-3xl ${needed>100?"text-danger":needed<0?"text-success":"text-primary"}`}>{needed.toFixed(1)}%</span>
          {needed>100 && <span className="text-xs text-danger">Not achievable with current grades</span>}
          {needed<=0 && <span className="text-xs text-success">You already have enough!</span>}
        </div>}
      </div>
    </CalculatorShell>
  );
}
