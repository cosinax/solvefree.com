"use client";
import { useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
export default function UrlEncoderPage() {
  const [mode, setMode] = useState<"encode"|"decode">("encode");
  const [input, setInput] = useState("hello world & foo=bar");
  let output = "";
  try { output = mode === "encode" ? encodeURIComponent(input) : decodeURIComponent(input); } catch { output = "Invalid input"; }
  return (
    <CalculatorShell title="URL Encoder/Decoder" description="Encode and decode URL components.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => setMode("encode")} className={`py-2 rounded-lg text-sm font-medium ${mode==="encode"?"bg-primary text-white":"bg-background border border-card-border"}`}>Encode</button>
          <button onClick={() => setMode("decode")} className={`py-2 rounded-lg text-sm font-medium ${mode==="decode"?"bg-primary text-white":"bg-background border border-card-border"}`}>Decode</button>
        </div>
        <div><label className="block text-sm text-muted mb-1">Input</label><textarea value={input} onChange={e=>setInput(e.target.value)} rows={3} className="w-full px-4 py-3 font-mono text-sm bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-y"/></div>
        <div><label className="block text-sm text-muted mb-1">Output</label><textarea value={output} readOnly rows={3} className="w-full px-4 py-3 font-mono text-sm bg-background border border-card-border rounded-lg resize-y"/></div>
      </div>
    </CalculatorShell>
  );
}
