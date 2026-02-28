"use client";
import { useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";

const prefixes = [
  // SI decimal
  { symbol: "Q",  name: "Quetta",  exp: 30,  value: 1e30,  type: "decimal" },
  { symbol: "R",  name: "Ronna",   exp: 27,  value: 1e27,  type: "decimal" },
  { symbol: "Y",  name: "Yotta",   exp: 24,  value: 1e24,  type: "decimal" },
  { symbol: "Z",  name: "Zetta",   exp: 21,  value: 1e21,  type: "decimal" },
  { symbol: "E",  name: "Exa",     exp: 18,  value: 1e18,  type: "decimal" },
  { symbol: "P",  name: "Peta",    exp: 15,  value: 1e15,  type: "decimal" },
  { symbol: "T",  name: "Tera",    exp: 12,  value: 1e12,  type: "decimal" },
  { symbol: "G",  name: "Giga",    exp: 9,   value: 1e9,   type: "decimal" },
  { symbol: "M",  name: "Mega",    exp: 6,   value: 1e6,   type: "decimal" },
  { symbol: "k",  name: "Kilo",    exp: 3,   value: 1e3,   type: "decimal" },
  { symbol: "h",  name: "Hecto",   exp: 2,   value: 1e2,   type: "decimal" },
  { symbol: "da", name: "Deka",    exp: 1,   value: 10,    type: "decimal" },
  { symbol: "—",  name: "(base)",  exp: 0,   value: 1,     type: "decimal" },
  { symbol: "d",  name: "Deci",    exp: -1,  value: 1e-1,  type: "decimal" },
  { symbol: "c",  name: "Centi",   exp: -2,  value: 1e-2,  type: "decimal" },
  { symbol: "m",  name: "Milli",   exp: -3,  value: 1e-3,  type: "decimal" },
  { symbol: "μ",  name: "Micro",   exp: -6,  value: 1e-6,  type: "decimal" },
  { symbol: "n",  name: "Nano",    exp: -9,  value: 1e-9,  type: "decimal" },
  { symbol: "p",  name: "Pico",    exp: -12, value: 1e-12, type: "decimal" },
  { symbol: "f",  name: "Femto",   exp: -15, value: 1e-15, type: "decimal" },
  { symbol: "a",  name: "Atto",    exp: -18, value: 1e-18, type: "decimal" },
  { symbol: "z",  name: "Zepto",   exp: -21, value: 1e-21, type: "decimal" },
  { symbol: "y",  name: "Yocto",   exp: -24, value: 1e-24, type: "decimal" },
  // Binary (IEC)
  { symbol: "Ki", name: "Kibi",    exp: 10, value: 1024,        type: "binary" },
  { symbol: "Mi", name: "Mebi",    exp: 20, value: 1048576,     type: "binary" },
  { symbol: "Gi", name: "Gibi",    exp: 30, value: 1073741824,  type: "binary" },
  { symbol: "Ti", name: "Tebi",    exp: 40, value: 1.0995e12,   type: "binary" },
  { symbol: "Pi", name: "Pebi",    exp: 50, value: 1.1259e15,   type: "binary" },
  { symbol: "Ei", name: "Exbi",    exp: 60, value: 1.1529e18,   type: "binary" },
];

export default function SIPrefixesPage() {
  const [view, setView] = useState<"all" | "decimal" | "binary">("decimal");
  const [inputVal, setInputVal] = useState("1");
  const [fromPrefix, setFromPrefix] = useState("G");

  const filtered = prefixes.filter(p => view === "all" || p.type === view);

  const fromP = prefixes.find(p => p.symbol === fromPrefix);
  const baseValue = fromP ? parseFloat(inputVal) * fromP.value : null;

  return (
    <CalculatorShell title="SI Prefixes" description="SI (metric) prefix reference and unit converter. Kilo, mega, giga, and binary IEC prefixes.">
      <div className="space-y-4">
        <div className="flex gap-1">
          {(["decimal", "binary", "all"] as const).map(v => (
            <button key={v} onClick={() => setView(v)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-colors capitalize ${view === v ? "bg-primary text-white border-primary" : "bg-background border-card-border hover:bg-primary-light"}`}>
              {v === "decimal" ? "SI Decimal" : v === "binary" ? "Binary (IEC)" : "All"}
            </button>
          ))}
        </div>

        {/* Quick converter */}
        <div className="border border-card-border rounded-lg p-3 space-y-2">
          <p className="text-xs text-muted font-semibold">Quick Converter</p>
          <div className="flex gap-2">
            <input type="number" value={inputVal} onChange={e => setInputVal(e.target.value)}
              className="flex-1 px-3 py-2 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm" />
            <select value={fromPrefix} onChange={e => setFromPrefix(e.target.value)}
              className="px-2 py-2 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm">
              {prefixes.filter(p => p.type === "decimal" && p.symbol !== "—").map(p => (
                <option key={p.symbol} value={p.symbol}>{p.symbol} ({p.name})</option>
              ))}
            </select>
          </div>
          {baseValue !== null && isFinite(baseValue) && (
            <div className="space-y-1 text-xs font-mono max-h-40 overflow-y-auto">
              {prefixes.filter(p => p.type === "decimal" && p.symbol !== "—" && p.symbol !== fromPrefix).map(p => {
                const converted = baseValue / p.value;
                if (!isFinite(converted) || converted === 0) return null;
                return (
                  <div key={p.symbol} className="flex justify-between px-2 py-1 bg-background border border-card-border rounded">
                    <span className="text-muted">{p.name} ({p.symbol})</span>
                    <span className="font-semibold">{converted >= 1e6 || converted < 1e-6 ? converted.toExponential(4) : parseFloat(converted.toPrecision(6)).toString()}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Reference table */}
        <div className="overflow-x-auto rounded-lg border border-card-border">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="bg-card border-b border-card-border">
                <th className="text-left px-3 py-2 text-muted font-semibold">Symbol</th>
                <th className="text-left px-3 py-2 text-muted font-semibold">Name</th>
                <th className="text-right px-3 py-2 text-muted font-semibold">Factor</th>
                <th className="text-right px-3 py-2 text-muted font-semibold">Power</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.symbol + p.name} className="border-b border-card-border hover:bg-primary-light transition-colors">
                  <td className="px-3 py-1.5 font-bold text-primary">{p.symbol}</td>
                  <td className="px-3 py-1.5">{p.name}</td>
                  <td className="px-3 py-1.5 text-right">{p.value >= 1e6 || (p.value < 1 && p.value > 0) ? p.value.toExponential(0) : p.value.toLocaleString()}</td>
                  <td className="px-3 py-1.5 text-right text-muted">{p.type === "binary" ? `2^${p.exp}` : p.exp === 0 ? "1" : `10^${p.exp}`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </CalculatorShell>
  );
}
