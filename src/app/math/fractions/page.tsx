"use client";

import { useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";

function gcd(a: number, b: number): number {
  a = Math.abs(a); b = Math.abs(b);
  while (b) { [a, b] = [b, a % b]; }
  return a;
}

function simplify(num: number, den: number): [number, number] {
  if (den === 0) return [num, den];
  const g = gcd(num, den);
  const sign = den < 0 ? -1 : 1;
  return [(num / g) * sign, (den / g) * sign];
}

function toMixed(num: number, den: number): string {
  if (den === 0) return "undefined";
  const [sn, sd] = simplify(num, den);
  if (sd === 1) return sn.toString();
  const whole = Math.trunc(sn / sd);
  const remainder = Math.abs(sn % sd);
  if (whole === 0) return `${sn}/${sd}`;
  return `${whole} ${remainder}/${sd}`;
}

export default function FractionsPage() {
  const [n1, setN1] = useState("");
  const [d1, setD1] = useState("");
  const [n2, setN2] = useState("");
  const [d2, setD2] = useState("");
  const [operation, setOperation] = useState("+");

  const hasInput = n1 !== "" && d1 !== "" && n2 !== "" && d2 !== "";
  let resultNum = 0, resultDen = 1, error = "";

  if (hasInput) {
    const a = parseInt(n1), b = parseInt(d1), c = parseInt(n2), d = parseInt(d2);
    if (b === 0 || d === 0) { error = "Denominator cannot be zero"; }
    else {
      switch (operation) {
        case "+": resultNum = a * d + c * b; resultDen = b * d; break;
        case "-": resultNum = a * d - c * b; resultDen = b * d; break;
        case "×": resultNum = a * c; resultDen = b * d; break;
        case "÷":
          if (c === 0) { error = "Cannot divide by zero"; }
          else { resultNum = a * d; resultDen = b * c; }
          break;
      }
    }
  }

  const [sn, sd] = error ? [0, 1] : simplify(resultNum, resultDen);
  const inputClass = "w-full px-3 py-2 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-center";

  return (
    <CalculatorShell title="Fraction Calculator" description="Add, subtract, multiply, and divide fractions. Results are automatically simplified.">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          {/* Fraction 1 */}
          <div className="flex-1 text-center">
            <input type="number" value={n1} onChange={(e) => setN1(e.target.value)} placeholder="num" className={inputClass} />
            <div className="border-t-2 border-foreground my-1 mx-2" />
            <input type="number" value={d1} onChange={(e) => setD1(e.target.value)} placeholder="den" className={inputClass} />
          </div>

          {/* Operation */}
          <select value={operation} onChange={(e) => setOperation(e.target.value)}
            className="px-3 py-2 bg-primary text-white rounded-lg font-bold text-lg cursor-pointer">
            <option value="+">+</option>
            <option value="-">−</option>
            <option value="×">×</option>
            <option value="÷">÷</option>
          </select>

          {/* Fraction 2 */}
          <div className="flex-1 text-center">
            <input type="number" value={n2} onChange={(e) => setN2(e.target.value)} placeholder="num" className={inputClass} />
            <div className="border-t-2 border-foreground my-1 mx-2" />
            <input type="number" value={d2} onChange={(e) => setD2(e.target.value)} placeholder="den" className={inputClass} />
          </div>
        </div>

        {hasInput && !error && (
          <div className="bg-primary-light rounded-xl p-4 space-y-2">
            <div className="text-center">
              <span className="text-sm text-muted">Result: </span>
              <span className="font-mono font-bold text-xl">
                {sd === 1 ? sn : `${sn}/${sd}`}
              </span>
            </div>
            {sd !== 1 && Math.abs(sn) > Math.abs(sd) && (
              <div className="text-center">
                <span className="text-sm text-muted">Mixed: </span>
                <span className="font-mono font-semibold">{toMixed(sn, sd)}</span>
              </div>
            )}
            <div className="text-center">
              <span className="text-sm text-muted">Decimal: </span>
              <span className="font-mono font-semibold">{sd !== 0 ? parseFloat((sn / sd).toPrecision(12)) : "undefined"}</span>
            </div>
          </div>
        )}
        {error && <div className="text-center text-danger font-medium">{error}</div>}
      </div>
    </CalculatorShell>
  );
}
