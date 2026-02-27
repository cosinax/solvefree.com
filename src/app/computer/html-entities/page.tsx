"use client";
import { useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
function encodeHtml(s: string) { return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;"); }
function decodeHtml(s: string) { const el = typeof document !== "undefined" ? document.createElement("textarea") : null; if (!el) return s; el.innerHTML = s; return el.value; }
export default function HtmlEntitiesPage() {
  const [mode, setMode] = useState<"encode"|"decode">("encode");
  const [input, setInput] = useState('<h1>Hello "World" & Friends</h1>');
  const output = mode === "encode" ? encodeHtml(input) : decodeHtml(input);
  return (
    <CalculatorShell title="HTML Entity Encoder" description="Encode and decode HTML entities.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => setMode("encode")} className={`py-2 rounded-lg text-sm font-medium ${mode === "encode" ? "bg-primary text-white" : "bg-background border border-card-border"}`}>Encode</button>
          <button onClick={() => setMode("decode")} className={`py-2 rounded-lg text-sm font-medium ${mode === "decode" ? "bg-primary text-white" : "bg-background border border-card-border"}`}>Decode</button>
        </div>
        <div><label className="block text-sm text-muted mb-1">Input</label><textarea value={input} onChange={e => setInput(e.target.value)} rows={4} className="w-full px-4 py-3 font-mono text-sm bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-y" /></div>
        <div><label className="block text-sm text-muted mb-1">Output</label><textarea value={output} readOnly rows={4} className="w-full px-4 py-3 font-mono text-sm bg-background border border-card-border rounded-lg resize-y" /></div>
      </div>
    </CalculatorShell>
  );
}
