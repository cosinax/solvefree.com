"use client";
import { useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
export default function PasswordGeneratorPage() {
  const [length, setLength] = useState("16");
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [digits, setDigits] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [passwords, setPasswords] = useState<string[]>([]);
  function generate() {
    let chars = "";
    if (lower) chars += "abcdefghijklmnopqrstuvwxyz";
    if (upper) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (digits) chars += "0123456789";
    if (symbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";
    if (!chars) return;
    const len = Math.min(Math.max(parseInt(length)||8,4),128);
    const arr = crypto.getRandomValues(new Uint32Array(len));
    const pw = Array.from(arr, n => chars[n % chars.length]).join("");
    setPasswords(prev => [pw, ...prev].slice(0,10));
  }
  const entropy = (() => { let c=0; if(lower)c+=26; if(upper)c+=26; if(digits)c+=10; if(symbols)c+=27; return c>0?Math.round((parseInt(length)||8)*Math.log2(c)):0; })();
  return (
    <CalculatorShell title="Password Generator" description="Generate secure random passwords.">
      <div className="space-y-4">
        <div><label className="block text-sm text-muted mb-1">Length: {length}</label><input type="range" min="4" max="128" value={length} onChange={e=>setLength(e.target.value)} className="w-full"/></div>
        <div className="flex flex-wrap gap-3">
          {[{l:"Lowercase",v:lower,s:setLower},{l:"Uppercase",v:upper,s:setUpper},{l:"Digits",v:digits,s:setDigits},{l:"Symbols",v:symbols,s:setSymbols}].map(o=>
            <label key={o.l} className="flex items-center gap-1.5 text-sm cursor-pointer"><input type="checkbox" checked={o.v} onChange={e=>o.s(e.target.checked)} className="rounded"/>{o.l}</label>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button onClick={generate} className="px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover">🔑 Generate</button>
          <span className="text-xs text-muted">~{entropy} bits entropy</span>
        </div>
        {passwords.length>0 && <div className="space-y-1">{passwords.map((p,i)=><div key={i} className="px-3 py-2 bg-background border border-card-border rounded-lg font-mono text-sm select-all cursor-pointer break-all">{p}</div>)}</div>}
      </div>
    </CalculatorShell>
  );
}
