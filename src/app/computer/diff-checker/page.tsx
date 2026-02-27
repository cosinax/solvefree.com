"use client";
import { useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
export default function DiffCheckerPage() {
  const [text1, setText1] = useState("Hello World\nThis is line two\nLine three here");
  const [text2, setText2] = useState("Hello World\nThis is line 2\nLine three here\nNew line four");
  const lines1 = text1.split("\n"), lines2 = text2.split("\n");
  const maxLen = Math.max(lines1.length, lines2.length);
  return (
    <CalculatorShell title="Diff Checker" description="Compare two texts line by line and see differences highlighted.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div><label className="block text-sm text-muted mb-1">Original</label>
            <textarea value={text1} onChange={e=>setText1(e.target.value)} rows={6} className="w-full px-3 py-2 font-mono text-xs bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-y"/></div>
          <div><label className="block text-sm text-muted mb-1">Modified</label>
            <textarea value={text2} onChange={e=>setText2(e.target.value)} rows={6} className="w-full px-3 py-2 font-mono text-xs bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-y"/></div>
        </div>
        <div className="space-y-0.5">
          {Array.from({length:maxLen}).map((_,i)=>{
            const l1=lines1[i]??"", l2=lines2[i]??"";
            const same=l1===l2;
            return <div key={i} className={`grid grid-cols-2 gap-1 text-xs font-mono ${same?"":"bg-red-50 dark:bg-red-950"}`}>
              <div className={`px-2 py-0.5 rounded-l ${!same&&l1?"bg-red-100 dark:bg-red-900 text-danger":""}`}>{l1||<span className="text-muted italic">empty</span>}</div>
              <div className={`px-2 py-0.5 rounded-r ${!same&&l2?"bg-green-100 dark:bg-green-900 text-success":""}`}>{l2||<span className="text-muted italic">empty</span>}</div>
            </div>;
          })}
        </div>
        <div className="text-xs text-muted text-center">
          {lines1.length} lines vs {lines2.length} lines · {Array.from({length:maxLen}).filter((_,i)=>(lines1[i]??"")!==(lines2[i]??"")).length} differences
        </div>
      </div>
    </CalculatorShell>
  );
}
