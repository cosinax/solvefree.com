"use client";

import { useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";

export default function RegexTesterPage() {
  const [pattern, setPattern] = useState("\\b\\w+@\\w+\\.\\w+\\b");
  const [flags, setFlags] = useState("gi");
  const [text, setText] = useState("Contact us at hello@example.com or support@freecalc.com for help.");
  let matches: RegExpMatchArray[] = [], error = "";
  try { const re = new RegExp(pattern, flags); matches = [...text.matchAll(re)]; } catch (e) { error = (e as Error).message; }
  const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
  return (
    <CalculatorShell title="Regex Tester" description="Test regular expressions with live matching and highlighting.">
      <div className="space-y-4">
        <div className="flex gap-2"><div className="flex-1"><label className="block text-sm text-muted mb-1">Pattern</label><input type="text" value={pattern} onChange={(e) => setPattern(e.target.value)} className={ic} /></div>
          <div className="w-20"><label className="block text-sm text-muted mb-1">Flags</label><input type="text" value={flags} onChange={(e) => setFlags(e.target.value)} className={ic} /></div></div>
        <div><label className="block text-sm text-muted mb-1">Test String</label>
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} className="w-full px-4 py-3 font-mono text-sm bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-y" /></div>
        {error ? <div className="px-4 py-3 bg-red-50 dark:bg-red-950 rounded-lg text-danger text-sm">{error}</div> : (
          <div className="space-y-2">
            <div className="px-4 py-3 bg-primary-light rounded-lg text-center"><span className="text-sm text-muted">Matches: </span><span className="font-mono font-bold text-xl">{matches.length}</span></div>
            {matches.length > 0 && <div className="space-y-1">{matches.map((m, i) => (
              <div key={i} className="px-3 py-2 bg-background border border-card-border rounded-lg text-sm font-mono flex justify-between">
                <span className="text-primary font-semibold">{m[0]}</span><span className="text-muted">index {m.index}</span></div>
            ))}</div>}
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
