"use client";
import { useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
export default function CapacitorPage() {
  const [input, setInput] = useState("100, 220, 470");
  const [mode, setMode] = useState<"series"|"parallel">("parallel");
  const caps = input.split(",").map(s=>parseFloat(s.trim())).filter(n=>n>0&&!isNaN(n));
  let result = 0;
  if (caps.length > 0) {
    if (mode === "parallel") result = caps.reduce((a,b)=>a+b,0);
    else result = 1 / caps.reduce((a,b)=>a+1/b,0);
  }
  return (
    <CalculatorShell title="Capacitor Calculator" description="Calculate total capacitance in series and parallel.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <button onClick={()=>setMode("parallel")} className={`py-2 rounded-lg text-sm font-medium ${mode==="parallel"?"bg-primary text-white":"bg-background border border-card-border"}`}>Parallel</button>
          <button onClick={()=>setMode("series")} className={`py-2 rounded-lg text-sm font-medium ${mode==="series"?"bg-primary text-white":"bg-background border border-card-border"}`}>Series</button>
        </div>
        <div><label className="block text-sm text-muted mb-1">Capacitor values (µF, comma-separated)</label>
          <input type="text" value={input} onChange={e=>setInput(e.target.value)} className="w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"/></div>
        {caps.length>0 && <div className="bg-primary-light rounded-xl p-4 text-center"><span className="block text-sm text-muted">Total Capacitance ({mode})</span><span className="block font-mono font-bold text-3xl text-primary">{result.toFixed(2)} µF</span></div>}
        <p className="text-xs text-muted">Parallel: C = C1+C2+... | Series: 1/C = 1/C1+1/C2+...</p>
      </div>
    </CalculatorShell>
  );
}
