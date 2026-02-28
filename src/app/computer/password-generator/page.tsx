"use client";
import { useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";

const LOWER = "abcdefghijklmnopqrstuvwxyz";
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DIGITS = "0123456789";
const SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,.<>?";

function strengthLabel(bits: number): { label: string; color: string; width: string } {
  if (bits < 40) return { label: "Very Weak", color: "bg-danger", width: "w-1/5" };
  if (bits < 60) return { label: "Weak", color: "bg-orange-400", width: "w-2/5" };
  if (bits < 80) return { label: "Fair", color: "bg-accent", width: "w-3/5" };
  if (bits < 100) return { label: "Strong", color: "bg-success", width: "w-4/5" };
  return { label: "Very Strong", color: "bg-success", width: "w-full" };
}

export default function PasswordGeneratorPage() {
  const [length, setLength] = useState("16");
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [digits, setDigits] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [passwords, setPasswords] = useState<string[]>([]);
  const [copied, setCopied] = useState<number | null>(null);

  function generate() {
    let chars = "";
    if (lower) chars += LOWER;
    if (upper) chars += UPPER;
    if (digits) chars += DIGITS;
    if (symbols) chars += SYMBOLS;
    if (!chars) return;
    const len = Math.min(Math.max(parseInt(length) || 8, 4), 128);
    const arr = crypto.getRandomValues(new Uint32Array(len));
    const pw = Array.from(arr, n => chars[n % chars.length]).join("");
    setPasswords(prev => [pw, ...prev].slice(0, 10));
  }

  function copyPassword(pw: string, i: number) {
    navigator.clipboard.writeText(pw);
    setCopied(i);
    setTimeout(() => setCopied(null), 1500);
  }

  let charsetSize = 0;
  if (lower) charsetSize += 26;
  if (upper) charsetSize += 26;
  if (digits) charsetSize += 10;
  if (symbols) charsetSize += SYMBOLS.length;
  const entropy = charsetSize > 0 ? Math.round((parseInt(length) || 8) * Math.log2(charsetSize)) : 0;
  const strength = strengthLabel(entropy);
  const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

  return (
    <CalculatorShell title="Password Generator" description="Generate secure random passwords.">
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-muted mb-1">Length: {length}</label>
          <input type="range" min="4" max="128" value={length} onChange={e => setLength(e.target.value)} className="w-full" />
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">Custom length</label>
          <input type="number" min="4" max="128" value={length} onChange={e => setLength(e.target.value)} className={ic} />
        </div>
        <div className="flex flex-wrap gap-3">
          {[
            { l: "Lowercase", v: lower, s: setLower },
            { l: "Uppercase", v: upper, s: setUpper },
            { l: "Digits", v: digits, s: setDigits },
            { l: "Symbols", v: symbols, s: setSymbols },
          ].map(o => (
            <label key={o.l} className="flex items-center gap-1.5 text-sm cursor-pointer">
              <input type="checkbox" checked={o.v} onChange={e => o.s(e.target.checked)} className="rounded" />
              {o.l}
            </label>
          ))}
        </div>
        {charsetSize > 0 && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-muted">
              <span>Strength: <span className="font-semibold text-foreground">{strength.label}</span></span>
              <span>~{entropy} bits entropy</span>
            </div>
            <div className="w-full h-1.5 bg-card rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all ${strength.color} ${strength.width}`} />
            </div>
          </div>
        )}
        <button
          onClick={generate}
          className="w-full py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover"
          disabled={charsetSize === 0}
        >
          Generate Password
        </button>
        {passwords.length > 0 && (
          <div className="space-y-1">
            {passwords.map((p, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-2 bg-background border border-card-border rounded-lg">
                <span className="font-mono text-sm break-all flex-1 select-all">{p}</span>
                <button
                  onClick={() => copyPassword(p, i)}
                  className="shrink-0 text-xs px-2 py-1 rounded bg-card border border-card-border hover:bg-primary-light transition-colors"
                >
                  {copied === i ? "✓" : "Copy"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
