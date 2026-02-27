"use client";

import { useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";

export default function Base64Page() {
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("Hello, World!");
  let output = "", error = "";
  try {
    if (mode === "encode") output = btoa(unescape(encodeURIComponent(input)));
    else output = decodeURIComponent(escape(atob(input)));
  } catch { error = "Invalid input for " + mode; }
  return (
    <CalculatorShell title="Base64 Encoder/Decoder" description="Encode and decode Base64 strings.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => setMode("encode")} className={`py-2 rounded-lg text-sm font-medium ${mode === "encode" ? "bg-primary text-white" : "bg-background border border-card-border"}`}>Encode</button>
          <button onClick={() => setMode("decode")} className={`py-2 rounded-lg text-sm font-medium ${mode === "decode" ? "bg-primary text-white" : "bg-background border border-card-border"}`}>Decode</button>
        </div>
        <div><label className="block text-sm text-muted mb-1">Input</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={4} className="w-full px-4 py-3 font-mono text-sm bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-y" /></div>
        {error ? <div className="text-danger text-sm">{error}</div> : (
          <div><label className="block text-sm text-muted mb-1">Output</label>
            <textarea value={output} readOnly rows={4} className="w-full px-4 py-3 font-mono text-sm bg-background border border-card-border rounded-lg resize-y" /></div>
        )}
      </div>
    </CalculatorShell>
  );
}
