"use client";
import { useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
export default function InductorPage() {
  const [input, setInput] = useState("10, 22, 47");
  const [mode, setMode] = useState<"series"|"parallel">("series");
  const inductors = input.split(",").map(s=>parseFloat(s.trim())).filter(n=>n>0&&!isNaN(n));
  let result = 0;
  if (inductors.length > 0) {
    if (mode === "series") result = inductors.reduce((a,b)=>a+b,0);
    else result = 1 / inductors.reduce((a,b)=>a+1/b,0);
  }
  return (
    <CalculatorShell title="Inductor Calculator" description="Calculate total inductance in series and parallel.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <button onClick={()=>setMode("series")} className={`py-2 rounded-lg text-sm font-medium ${mode==="series"?"bg-primary text-white":"bg-background border border-card-border"}`}>Series</button>
          <button onClick={()=>setMode("parallel")} className={`py-2 rounded-lg text-sm font-medium ${mode==="parallel"?"bg-primary text-white":"bg-background border border-card-border"}`}>Parallel</button>
        </div>
        <div><label className="block text-sm text-muted mb-1">Inductor values (mH, comma-separated)</label>
          <input type="text" value={input} onChange={e=>setInput(e.target.value)} className="w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"/></div>
        {inductors.length>0 && <div className="bg-primary-light rounded-xl p-4 text-center"><span className="block text-sm text-muted">Total Inductance ({mode})</span><span className="block font-mono font-bold text-3xl text-primary">{result.toFixed(2)} mH</span></div>}
        <p className="text-xs text-muted">Series: L = L1+L2+... | Parallel: 1/L = 1/L1+1/L2+...</p>
      </div>
    </CalculatorShell>
  );
}
