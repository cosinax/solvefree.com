"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
const sel = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a)); b = Math.abs(Math.round(b));
  while (b) { [a, b] = [b, a % b]; }
  return a;
}

function decimalToFraction(decStr: string): { num: number; den: number } | null {
  const dec = parseFloat(decStr);
  if (isNaN(dec)) return null;
  const str = decStr.trim().replace("-", "");
  const dotIdx = str.indexOf(".");
  if (dotIdx === -1) return { num: dec, den: 1 };
  const decimals = str.length - dotIdx - 1;
  const den = Math.pow(10, decimals);
  const num = Math.round(Math.abs(dec) * den);
  const g = gcd(num, den);
  return { num: (dec < 0 ? -1 : 1) * (num / g), den: den / g };
}

function toMixed(num: number, den: number): string {
  const whole = Math.trunc(num / den);
  const rem = Math.abs(num % den);
  if (rem === 0) return whole.toString();
  if (whole === 0) return `${num}/${den}`;
  return `${whole} ${rem}/${den}`;
}

function fractionType(num: number, den: number): string {
  if (den === 0) return "undefined";
  const abs = Math.abs(num / den);
  if (abs < 1) return "Proper fraction";
  if (abs === 1) return "Whole number";
  return "Improper fraction";
}

export default function DecimalFractionPage() {
  const [v, setV] = useHashState({ mode: "decimal", dec: "0.75", num: "3", den: "4" });

  const isDecMode = v.mode === "decimal";

  // Decimal -> Fraction
  const dfResult = isDecMode && v.dec.trim() ? decimalToFraction(v.dec) : null;
  const dfNum = dfResult ? dfResult.num : 0;
  const dfDen = dfResult ? dfResult.den : 1;

  // Fraction -> Decimal
  const fdNum = parseFloat(v.num);
  const fdDen = parseFloat(v.den);
  const fdValid = !isNaN(fdNum) && !isNaN(fdDen) && fdDen !== 0;
  const fdResult = fdValid ? fdNum / fdDen : NaN;
  const fdPct = fdValid ? (fdResult * 100) : NaN;
  const g = fdValid ? gcd(Math.abs(fdNum), Math.abs(fdDen)) : 1;
  const simNum = fdValid ? fdNum / g : 0;
  const simDen = fdValid ? fdDen / g : 1;

  function fmt(n: number) { return parseFloat(n.toPrecision(12)).toString(); }

  return (
    <CalculatorShell title="Decimal ↔ Fraction Converter" description="Convert between decimals and fractions. Shows simplified form, mixed number, and percentage.">
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-muted mb-1">Mode</label>
          <select value={v.mode} onChange={e => setV({ mode: e.target.value })} className={sel}>
            <option value="decimal">Decimal → Fraction</option>
            <option value="fraction">Fraction → Decimal</option>
          </select>
        </div>

        {isDecMode ? (
          <>
            <div>
              <label className="block text-sm text-muted mb-1">Decimal</label>
              <input type="text" value={v.dec} onChange={e => setV({ dec: e.target.value })} className={ic} placeholder="e.g. 0.75" />
            </div>
            {dfResult && (
              <div className="space-y-3">
                <div className="bg-primary-light rounded-xl p-4 text-center">
                  <span className="text-xs text-muted block mb-1">Fraction</span>
                  <span className="block font-mono font-bold text-4xl text-primary">{dfNum}/{dfDen}</span>
                </div>
                <div className="space-y-1 text-xs font-mono">
                  <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded">
                    <span className="text-muted">Simplified fraction</span>
                    <span className="font-semibold">{dfNum}/{dfDen}</span>
                  </div>
                  <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded">
                    <span className="text-muted">Mixed number</span>
                    <span className="font-semibold">{toMixed(dfNum, dfDen)}</span>
                  </div>
                  <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded">
                    <span className="text-muted">Percentage</span>
                    <span className="font-semibold">{fmt(parseFloat(v.dec) * 100)}%</span>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-muted mb-1">Numerator</label>
                <input type="number" value={v.num} onChange={e => setV({ num: e.target.value })} className={ic} step="1" />
              </div>
              <div>
                <label className="block text-sm text-muted mb-1">Denominator</label>
                <input type="number" value={v.den} onChange={e => setV({ den: e.target.value })} className={ic} step="1" />
              </div>
            </div>
            {fdValid && !isNaN(fdResult) && (
              <div className="space-y-3">
                <div className="bg-primary-light rounded-xl p-4 text-center">
                  <span className="text-xs text-muted block mb-1">Decimal</span>
                  <span className="block font-mono font-bold text-4xl text-primary">{fmt(fdResult)}</span>
                </div>
                <div className="space-y-1 text-xs font-mono">
                  <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded">
                    <span className="text-muted">Decimal</span>
                    <span className="font-semibold">{fmt(fdResult)}</span>
                  </div>
                  <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded">
                    <span className="text-muted">Percentage</span>
                    <span className="font-semibold">{fmt(fdPct)}%</span>
                  </div>
                  <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded">
                    <span className="text-muted">Simplified</span>
                    <span className="font-semibold">{simNum}/{simDen}</span>
                  </div>
                  <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded">
                    <span className="text-muted">Mixed number</span>
                    <span className="font-semibold">{toMixed(simNum, simDen)}</span>
                  </div>
                  <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded">
                    <span className="text-muted">Type</span>
                    <span className="font-semibold">{fractionType(fdNum, fdDen)}</span>
                  </div>
                </div>
              </div>
            )}
            {fdDen === 0 && (
              <div className="text-center text-sm text-danger font-medium">Denominator cannot be zero.</div>
            )}
          </>
        )}
      </div>
    </CalculatorShell>
  );
}
