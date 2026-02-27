"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
const sel = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

const ROMAN_MAP: [number, string][] = [
  [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
  [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
  [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
];

const SYMBOL_REF: [string, number][] = [
  ["I", 1], ["V", 5], ["X", 10], ["L", 50],
  ["C", 100], ["D", 500], ["M", 1000],
];

function toRoman(n: number): string {
  if (n < 1 || n > 3999) return "Out of range";
  let result = "";
  for (const [val, sym] of ROMAN_MAP) {
    while (n >= val) { result += sym; n -= val; }
  }
  return result;
}

function fromRoman(s: string): number | null {
  const str = s.toUpperCase().trim();
  if (!/^[IVXLCDM]+$/.test(str)) return null;
  const vals: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let result = 0;
  for (let i = 0; i < str.length; i++) {
    const cur = vals[str[i]];
    const next = vals[str[i + 1]];
    if (next && cur < next) result -= cur;
    else result += cur;
  }
  // Verify round-trip
  if (result < 1 || result > 3999) return null;
  if (toRoman(result) !== str) return null;
  return result;
}

function breakdown(roman: string): Array<{ sym: string; val: number; sub: boolean }> {
  const vals: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  const str = roman.toUpperCase();
  const result: Array<{ sym: string; val: number; sub: boolean }> = [];
  for (let i = 0; i < str.length; i++) {
    const cur = vals[str[i]];
    const next = vals[str[i + 1]];
    if (next && cur < next) {
      result.push({ sym: str[i] + str[i + 1], val: next - cur, sub: true });
      i++;
    } else {
      result.push({ sym: str[i], val: cur, sub: false });
    }
  }
  return result;
}

export default function RomanNumeralsPage() {
  const [v, setV] = useHashState({ mode: "toRoman", n: "2024", r: "" });

  const isToRoman = v.mode === "toRoman";

  const numVal = parseInt(v.n);
  const romanResult = isToRoman && !isNaN(numVal) && numVal >= 1 && numVal <= 3999 ? toRoman(numVal) : null;
  const bd = romanResult ? breakdown(romanResult) : [];

  const fromVal = !isToRoman && v.r.trim() ? fromRoman(v.r.trim()) : null;
  const fromRomanRoman = !isToRoman && v.r.trim() ? v.r.trim().toUpperCase() : "";
  const fromBd = fromVal && fromRomanRoman ? breakdown(fromRomanRoman) : [];

  return (
    <CalculatorShell title="Roman Numerals Converter" description="Convert between integers and Roman numerals with a symbol-by-symbol breakdown.">
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-muted mb-1">Mode</label>
          <select value={v.mode} onChange={e => setV({ mode: e.target.value })} className={sel}>
            <option value="toRoman">Number → Roman</option>
            <option value="fromRoman">Roman → Number</option>
          </select>
        </div>

        {isToRoman ? (
          <div>
            <label className="block text-sm text-muted mb-1">Integer (1–3999)</label>
            <input type="number" value={v.n} onChange={e => setV({ n: e.target.value })} className={ic} min="1" max="3999" step="1" />
          </div>
        ) : (
          <div>
            <label className="block text-sm text-muted mb-1">Roman numeral</label>
            <input type="text" value={v.r} onChange={e => setV({ r: e.target.value })} className={ic} placeholder="e.g. MMXXIV" />
          </div>
        )}

        {isToRoman && romanResult && (
          <div className="space-y-3">
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="text-xs text-muted block mb-1">{numVal} in Roman numerals</span>
              <span className="block font-mono font-bold text-4xl text-primary">{romanResult}</span>
            </div>
            <div>
              <p className="text-xs text-muted mb-1">Breakdown:</p>
              <div className="space-y-1 text-xs font-mono">
                {bd.map((item, i) => (
                  <div key={i} className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded">
                    <span className={item.sub ? "text-primary" : ""}>{item.sym}</span>
                    <span className="font-semibold">{item.sub ? `−` : "+"}{item.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {!isToRoman && v.r.trim() && fromVal !== null && (
          <div className="space-y-3">
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="text-xs text-muted block mb-1">{fromRomanRoman} in Arabic numerals</span>
              <span className="block font-mono font-bold text-4xl text-primary">{fromVal}</span>
            </div>
            <div>
              <p className="text-xs text-muted mb-1">Breakdown:</p>
              <div className="space-y-1 text-xs font-mono">
                {fromBd.map((item, i) => (
                  <div key={i} className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded">
                    <span className={item.sub ? "text-primary" : ""}>{item.sym}</span>
                    <span className="font-semibold">{item.sub ? "−" : "+"}{item.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {!isToRoman && v.r.trim() && fromVal === null && (
          <div className="text-center text-sm text-danger font-medium">Invalid Roman numeral.</div>
        )}

        <div>
          <p className="text-xs text-muted mb-1">Symbol reference:</p>
          <div className="grid grid-cols-7 gap-1 text-xs font-mono text-center">
            {SYMBOL_REF.map(([sym, val]) => (
              <div key={sym} className="px-2 py-1.5 bg-background border border-card-border rounded">
                <div className="font-bold">{sym}</div>
                <div className="text-muted">{val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CalculatorShell>
  );
}
