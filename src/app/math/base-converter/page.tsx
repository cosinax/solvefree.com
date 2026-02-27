"use client";

import { useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";

const bases = [
  { name: "Binary", base: 2, prefix: "0b" },
  { name: "Octal", base: 8, prefix: "0o" },
  { name: "Decimal", base: 10, prefix: "" },
  { name: "Hexadecimal", base: 16, prefix: "0x" },
];

export default function BaseConverterPage() {
  const [value, setValue] = useState("");
  const [fromBase, setFromBase] = useState(10);

  let decimal: number | null = null;
  try {
    if (value.trim()) {
      decimal = parseInt(value, fromBase);
      if (isNaN(decimal)) decimal = null;
    }
  } catch { decimal = null; }

  return (
    <CalculatorShell title="Number Base Converter" description="Convert between binary, octal, decimal, and hexadecimal.">
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-muted mb-1">Input</label>
          <input type="text" value={value} onChange={(e) => setValue(e.target.value)}
            placeholder={fromBase === 2 ? "e.g. 11010" : fromBase === 16 ? "e.g. FF" : "e.g. 255"}
            className="w-full px-4 py-3 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            autoComplete="off" spellCheck={false} />
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">Input Base</label>
          <div className="grid grid-cols-4 gap-2">
            {bases.map((b) => (
              <button key={b.base} onClick={() => setFromBase(b.base)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${fromBase === b.base ? "bg-primary text-white" : "bg-background border border-card-border hover:bg-primary-light"}`}>
                {b.name}
              </button>
            ))}
          </div>
        </div>

        {decimal !== null && (
          <div className="space-y-2">
            {bases.map((b) => (
              <div key={b.base} className="flex items-center justify-between px-4 py-3 bg-primary-light rounded-lg">
                <span className="text-sm text-muted font-medium">{b.name}</span>
                <span className="font-mono font-semibold">
                  {b.prefix}{decimal!.toString(b.base).toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
