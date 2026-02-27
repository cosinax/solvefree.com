"use client";
import { useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";

// Identify hash type by length and charset
const hashTypes: { regex: RegExp; name: string; bits: number }[] = [
  { regex: /^[0-9a-f]{32}$/i, name: "MD5", bits: 128 },
  { regex: /^[0-9a-f]{40}$/i, name: "SHA-1", bits: 160 },
  { regex: /^[0-9a-f]{56}$/i, name: "SHA-224", bits: 224 },
  { regex: /^[0-9a-f]{64}$/i, name: "SHA-256", bits: 256 },
  { regex: /^[0-9a-f]{96}$/i, name: "SHA-384", bits: 384 },
  { regex: /^[0-9a-f]{128}$/i, name: "SHA-512", bits: 512 },
  { regex: /^\$2[aby]\$\d{2}\$/, name: "bcrypt", bits: 184 },
  { regex: /^\$argon2(i|d|id)\$/, name: "Argon2", bits: 256 },
  { regex: /^\$pbkdf2/, name: "PBKDF2", bits: 256 },
  { regex: /^[0-9a-f]{8}$/i, name: "CRC-32 (hex)", bits: 32 },
  { regex: /^[0-9a-zA-Z+/]{43}=$/i, name: "SHA-256 (Base64)", bits: 256 },
  { regex: /^[0-9a-zA-Z+/]{27}=$/i, name: "MD5 (Base64)", bits: 128 },
];

export default function HashIdentifierPage() {
  const [hash, setHash] = useState("");
  const matches = hash.trim() ? hashTypes.filter(h => h.regex.test(hash.trim())) : [];

  return (
    <CalculatorShell title="Hash Identifier" description="Identify the likely hash algorithm from a hash string based on length and format.">
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-muted mb-1">Hash String</label>
          <textarea value={hash} onChange={e => setHash(e.target.value)} rows={3} placeholder="Paste a hash string here..."
            className="w-full px-4 py-3 font-mono text-sm bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-y" />
        </div>
        {hash.trim() && (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="px-4 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">Length</span>
                <span className="font-mono font-bold text-xl">{hash.trim().length} chars</span>
              </div>
              <div className="px-4 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">Matches</span>
                <span className="font-mono font-bold text-xl">{matches.length}</span>
              </div>
            </div>
            {matches.length > 0 ? (
              <div className="space-y-2">
                <p className="text-sm font-semibold">Possible algorithms:</p>
                {matches.map(m => (
                  <div key={m.name} className="flex justify-between items-center px-4 py-3 bg-background border border-card-border rounded-lg">
                    <div>
                      <span className="font-semibold">{m.name}</span>
                      {m.name.startsWith("MD5") && <span className="ml-2 text-xs text-danger">⚠️ Broken — do not use for security</span>}
                      {m.name === "SHA-1" && <span className="ml-2 text-xs text-danger">⚠️ Deprecated for security use</span>}
                    </div>
                    <span className="text-sm text-muted font-mono">{m.bits} bits</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-4 py-3 bg-background border border-card-border rounded-lg text-sm text-muted">
                No known hash type matched. The hash may be custom, truncated, or use an unusual encoding.
              </div>
            )}
          </div>
        )}
        <div className="space-y-1 text-xs text-muted">
          <p className="font-semibold">Common hash lengths (hex):</p>
          <div className="grid grid-cols-2 gap-1 font-mono">
            {[["MD5","32"],["SHA-1","40"],["SHA-256","64"],["SHA-512","128"]].map(([n,l]) => (
              <span key={n}>{l} chars → {n}</span>
            ))}
          </div>
        </div>
      </div>
    </CalculatorShell>
  );
}
