"use client";
import { useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";

const rows = Array.from({ length: 256 }, (_, i) => ({
  dec: i,
  hex: i.toString(16).toUpperCase().padStart(2, "0"),
  bin: i.toString(2).padStart(8, "0"),
  oct: i.toString(8).padStart(3, "0"),
  chr: i >= 32 && i <= 126 ? String.fromCharCode(i) : i === 0 ? "NUL" : i === 9 ? "TAB" : i === 10 ? "LF" : i === 13 ? "CR" : i === 27 ? "ESC" : i === 127 ? "DEL" : "",
}));

export default function BinaryTablePage() {
  const [view, setView] = useState<"all" | "printable" | "control">("printable");
  const [search, setSearch] = useState("");

  const filtered = rows.filter(r => {
    if (view === "printable" && (r.dec < 32 || r.dec > 126)) return false;
    if (view === "control" && r.dec >= 32) return false;
    if (search) {
      const q = search.toLowerCase();
      return r.dec.toString() === q ||
        r.hex.toLowerCase() === q ||
        r.bin === search ||
        r.chr.toLowerCase() === q ||
        ("0x" + r.hex.toLowerCase()) === q;
    }
    return true;
  });

  return (
    <CalculatorShell title="Decimal / Hex / Binary Table" description="0–255 in decimal, hexadecimal, binary, octal, and ASCII.">
      <div className="space-y-3">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by decimal, hex (e.g. 0x41), binary, or char..."
          className="w-full px-3 py-2 text-sm font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />

        <div className="flex gap-1">
          {(["printable", "control", "all"] as const).map(v => (
            <button key={v} onClick={() => setView(v)}
              className={`text-xs px-2.5 py-1 rounded-lg border transition-colors capitalize ${view === v ? "bg-primary text-white border-primary" : "bg-background border-card-border hover:bg-primary-light"}`}>
              {v === "printable" ? "Printable (32–126)" : v === "control" ? "Control (0–31)" : "All (0–255)"}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto rounded-lg border border-card-border">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="bg-card border-b border-card-border">
                <th className="text-left px-3 py-2 text-muted font-semibold">Dec</th>
                <th className="text-left px-3 py-2 text-muted font-semibold">Hex</th>
                <th className="text-left px-3 py-2 text-muted font-semibold">Oct</th>
                <th className="text-left px-3 py-2 text-muted font-semibold">Binary</th>
                <th className="text-left px-3 py-2 text-muted font-semibold">ASCII</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.dec} className="border-b border-card-border hover:bg-primary-light transition-colors">
                  <td className="px-3 py-1.5 font-semibold text-primary">{r.dec}</td>
                  <td className="px-3 py-1.5">0x{r.hex}</td>
                  <td className="px-3 py-1.5 text-muted">{r.oct}</td>
                  <td className="px-3 py-1.5 text-muted">{r.bin}</td>
                  <td className="px-3 py-1.5 font-bold">{r.chr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <p className="text-sm text-muted text-center py-4">No values match.</p>
        )}
      </div>
    </CalculatorShell>
  );
}
