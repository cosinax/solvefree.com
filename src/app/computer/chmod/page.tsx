"use client";
import { useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
const perms = ["Read","Write","Execute"];
export default function ChmodPage() {
  const [owner, setOwner] = useState([true,true,true]);
  const [group, setGroup] = useState([true,false,true]);
  const [other, setOther] = useState([true,false,true]);
  const calc = (p: boolean[]) => p.reduce((s,v,i)=>s+(v?[4,2,1][i]:0),0);
  const numeric = `${calc(owner)}${calc(group)}${calc(other)}`;
  const symbolic = (p: boolean[]) => (p[0]?"r":"-")+(p[1]?"w":"-")+(p[2]?"x":"-");
  const toggle = (arr: boolean[], set: (a: boolean[])=>void, i: number) => { const n=[...arr]; n[i]=!n[i]; set(n); };
  return (
    <CalculatorShell title="Chmod Calculator" description="Calculate Unix file permissions in numeric and symbolic notation.">
      <div className="space-y-4">
        {[{l:"Owner",p:owner,s:setOwner},{l:"Group",p:group,s:setGroup},{l:"Other",p:other,s:setOther}].map(r=>
          <div key={r.l}><label className="block text-sm text-muted mb-1">{r.l}</label>
            <div className="flex gap-2">{perms.map((pm,i)=>
              <button key={pm} onClick={()=>toggle(r.p,r.s,i)} className={`flex-1 py-2 rounded-lg text-sm font-medium ${r.p[i]?"bg-primary text-white":"bg-background border border-card-border"}`}>{pm}</button>
            )}</div></div>
        )}
        <div className="grid grid-cols-2 gap-3">
          <div className="px-4 py-4 bg-primary-light rounded-lg text-center"><span className="block text-xs text-muted">Numeric</span><span className="font-mono font-bold text-3xl">{numeric}</span></div>
          <div className="px-4 py-4 bg-primary-light rounded-lg text-center"><span className="block text-xs text-muted">Symbolic</span><span className="font-mono font-bold text-xl">{symbolic(owner)}{symbolic(group)}{symbolic(other)}</span></div>
        </div>
        <div className="text-xs text-muted font-mono text-center">chmod {numeric} filename</div>
      </div>
    </CalculatorShell>
  );
}
