"use client";
import { useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
const colors = [
  {name:"Black",hex:"#000",val:0},{name:"Brown",hex:"#8B4513",val:1},{name:"Red",hex:"#FF0000",val:2},
  {name:"Orange",hex:"#FFA500",val:3},{name:"Yellow",hex:"#FFD700",val:4},{name:"Green",hex:"#008000",val:5},
  {name:"Blue",hex:"#0000FF",val:6},{name:"Violet",hex:"#8B00FF",val:7},{name:"Gray",hex:"#808080",val:8},{name:"White",hex:"#FFF",val:9},
];
const multipliers = [
  {name:"Black",hex:"#000",mult:1},{name:"Brown",hex:"#8B4513",mult:10},{name:"Red",hex:"#FF0000",mult:100},
  {name:"Orange",hex:"#FFA500",mult:1000},{name:"Yellow",hex:"#FFD700",mult:10000},{name:"Green",hex:"#008000",mult:100000},
  {name:"Blue",hex:"#0000FF",mult:1000000},{name:"Gold",hex:"#FFD700",mult:0.1},{name:"Silver",hex:"#C0C0C0",mult:0.01},
];
function fmtR(r:number):string { if(r>=1e6) return (r/1e6).toFixed(1)+"MΩ"; if(r>=1e3) return (r/1e3).toFixed(1)+"kΩ"; return r+"Ω"; }
export default function ResistorColorPage() {
  const [b1, setB1] = useState(1);
  const [b2, setB2] = useState(0);
  const [b3, setB3] = useState(2);
  const resistance = (b1*10+b2)*multipliers[b3].mult;
  const sel = "w-full px-2 py-2 bg-background border border-card-border rounded-lg text-sm";
  return (
    <CalculatorShell title="Resistor Color Code" description="Decode 4-band resistor color codes to resistance values.">
      <div className="space-y-4">
        <div className="flex gap-2 justify-center py-4">{[colors[b1],colors[b2],multipliers[b3]].map((c,i)=>
          <div key={i} className="w-8 h-20 rounded" style={{backgroundColor:c.hex,border:"1px solid #ccc"}}/>
        )}</div>
        <div className="grid grid-cols-3 gap-3">
          <div><label className="block text-sm text-muted mb-1">Band 1</label><select value={b1} onChange={e=>setB1(+e.target.value)} className={sel}>{colors.map(c=><option key={c.val} value={c.val}>{c.name} ({c.val})</option>)}</select></div>
          <div><label className="block text-sm text-muted mb-1">Band 2</label><select value={b2} onChange={e=>setB2(+e.target.value)} className={sel}>{colors.map(c=><option key={c.val} value={c.val}>{c.name} ({c.val})</option>)}</select></div>
          <div><label className="block text-sm text-muted mb-1">Multiplier</label><select value={b3} onChange={e=>setB3(+e.target.value)} className={sel}>{multipliers.map((m,i)=><option key={i} value={i}>{m.name} (×{m.mult})</option>)}</select></div>
        </div>
        <div className="bg-primary-light rounded-xl p-4 text-center"><span className="block text-sm text-muted">Resistance</span><span className="block font-mono font-bold text-3xl text-primary">{fmtR(resistance)}</span></div>
      </div>
    </CalculatorShell>
  );
}
