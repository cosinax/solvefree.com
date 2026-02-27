"use client";
import { useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
function uuidv4() { return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => { const r = Math.random()*16|0; return (c==="x"?r:(r&0x3|0x8)).toString(16); }); }
export default function UuidGeneratorPage() {
  const [count, setCount] = useState("5");
  const [uuids, setUuids] = useState<string[]>([]);
  function generate() { setUuids(Array.from({length: Math.min(parseInt(count)||1,100)}, ()=>uuidv4())); }
  return (
    <CalculatorShell title="UUID Generator" description="Generate random UUIDs (v4).">
      <div className="space-y-4">
        <div className="flex gap-3"><div className="flex-1"><label className="block text-sm text-muted mb-1">Count</label><input type="number" value={count} onChange={e=>setCount(e.target.value)} min="1" max="100" className="w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"/></div>
          <div className="flex items-end"><button onClick={generate} className="px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover">Generate</button></div></div>
        {uuids.length>0 && <div className="space-y-1">{uuids.map((u,i)=><div key={i} className="px-3 py-2 bg-background border border-card-border rounded-lg font-mono text-sm select-all cursor-pointer">{u}</div>)}</div>}
      </div>
    </CalculatorShell>
  );
}
