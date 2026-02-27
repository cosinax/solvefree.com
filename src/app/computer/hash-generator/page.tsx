"use client";
import { useState, useEffect } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
async function hash(algo: string, text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest(algo, data);
  return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,"0")).join("");
}
export default function HashGeneratorPage() {
  const [input, setInput] = useState("Hello, World!");
  const [hashes, setHashes] = useState<Record<string,string>>({});
  useEffect(() => {
    const algos = [["SHA-1","SHA-1"],["SHA-256","SHA-256"],["SHA-384","SHA-384"],["SHA-512","SHA-512"]];
    Promise.all(algos.map(async([name,algo])=>[name,await hash(algo,input)])).then(results => setHashes(Object.fromEntries(results)));
  }, [input]);
  return (
    <CalculatorShell title="Hash Generator" description="Generate SHA-1, SHA-256, SHA-384, SHA-512 hashes using Web Crypto API.">
      <div className="space-y-4">
        <div><label className="block text-sm text-muted mb-1">Input Text</label>
          <textarea value={input} onChange={e=>setInput(e.target.value)} rows={3} className="w-full px-4 py-3 font-mono text-sm bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-y"/></div>
        <div className="space-y-2">{Object.entries(hashes).map(([name,val])=>
          <div key={name} className="px-3 py-2 bg-background border border-card-border rounded-lg"><span className="block text-xs text-muted font-semibold">{name}</span><span className="font-mono text-xs break-all select-all cursor-pointer">{val}</span></div>
        )}</div>
      </div>
    </CalculatorShell>
  );
}
