"use client";
import { useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
export default function BinaryTextPage() {
  const [mode, setMode] = useState<"toBin"|"toText">("toBin");
  const [input, setInput] = useState("Hello");
  let output = "";
  if (mode === "toBin") { output = input.split("").map(c=>c.charCodeAt(0).toString(2).padStart(8,"0")).join(" "); }
  else { try { output = input.trim().split(/\s+/).map(b=>String.fromCharCode(parseInt(b,2))).join(""); } catch { output = "Invalid binary"; } }
  return (
    <CalculatorShell title="Binary / Text Converter" description="Convert between binary and text (ASCII/UTF-8).">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <button onClick={()=>setMode("toBin")} className={`py-2 rounded-lg text-sm font-medium ${mode==="toBin"?"bg-primary text-white":"bg-background border border-card-border"}`}>Text → Binary</button>
          <button onClick={()=>setMode("toText")} className={`py-2 rounded-lg text-sm font-medium ${mode==="toText"?"bg-primary text-white":"bg-background border border-card-border"}`}>Binary → Text</button>
        </div>
        <div><label className="block text-sm text-muted mb-1">Input</label><textarea value={input} onChange={e=>setInput(e.target.value)} rows={3} className="w-full px-4 py-3 font-mono text-sm bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-y"/></div>
        <div><label className="block text-sm text-muted mb-1">Output</label><textarea value={output} readOnly rows={3} className="w-full px-4 py-3 font-mono text-sm bg-background border border-card-border rounded-lg resize-y"/></div>
      </div>
    </CalculatorShell>
  );
}
