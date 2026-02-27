"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

function toSci(n: number): { coeff: number; exp: number } {
  if (n === 0) return { coeff: 0, exp: 0 };
  const exp = Math.floor(Math.log10(Math.abs(n)));
  const coeff = n / Math.pow(10, exp);
  return { coeff, exp };
}

function toEng(n: number): { coeff: number; exp: number } {
  if (n === 0) return { coeff: 0, exp: 0 };
  const exp = Math.floor(Math.log10(Math.abs(n)));
  const engExp = Math.floor(exp / 3) * 3;
  const coeff = n / Math.pow(10, engExp);
  return { coeff, exp: engExp };
}

function parseSciNotation(s: string): number | null {
  // Handle formats like 1.5e10, 1.5E10, 1.5 × 10^10, 1.5x10^10
  const cleaned = s.trim()
    .replace(/×|x/gi, "e")
    .replace(/\s*\*\s*10\s*\^\s*/gi, "e")
    .replace(/\s*10\s*\^\s*/gi, "e")
    .replace(/\^/g, "")
    .replace(/\s+/g, "");
  const n = parseFloat(cleaned);
  return isNaN(n) ? null : n;
}

export default function ScientificNotationPage() {
  const [v, setV] = useHashState({ n: "299792458" });

  const raw = v.n.trim();
  const parsed = raw ? parseSciNotation(raw) : null;
  const valid = parsed !== null && isFinite(parsed);

  const sci = valid ? toSci(parsed!) : null;
  const eng = valid ? toEng(parsed!) : null;

  function fmtCoeff(c: number) {
    return parseFloat(c.toPrecision(10)).toString();
  }

  function fmtStandard(n: number) {
    if (Math.abs(n) >= 1e15 || (Math.abs(n) < 1e-6 && n !== 0)) {
      return n.toExponential();
    }
    return parseFloat(n.toPrecision(12)).toString();
  }

  return (
    <CalculatorShell title="Scientific Notation Converter" description="Convert between standard form, scientific notation, and engineering notation. Accepts scientific notation as input.">
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-muted mb-1">Number (standard or scientific notation)</label>
          <input
            type="text"
            value={v.n}
            onChange={e => setV({ n: e.target.value })}
            className={ic}
            placeholder="e.g. 299792458 or 2.998e8 or 2.998 × 10^8"
          />
          <p className="text-xs text-muted mt-1">Accepts: 1.5e10, 1.5E10, 1.5 × 10^10, 1.5x10^10</p>
        </div>

        {valid && sci && eng && (
          <div className="space-y-3">
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="text-xs text-muted block mb-1">Scientific Notation</span>
              <span className="block font-mono font-bold text-3xl text-primary">
                {fmtCoeff(sci.coeff)} × 10<sup>{sci.exp}</sup>
              </span>
            </div>

            <div className="space-y-1 text-xs font-mono">
              <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded">
                <span className="text-muted">Standard form</span>
                <span className="font-semibold">{fmtStandard(parsed!)}</span>
              </div>
              <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded">
                <span className="text-muted">Scientific notation</span>
                <span className="font-semibold">{fmtCoeff(sci.coeff)} × 10^{sci.exp}</span>
              </div>
              <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded">
                <span className="text-muted">Engineering notation</span>
                <span className="font-semibold">{fmtCoeff(eng.coeff)} × 10^{eng.exp}</span>
              </div>
              <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded">
                <span className="text-muted">E-notation</span>
                <span className="font-semibold">{parsed!.toExponential()}</span>
              </div>
              <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded">
                <span className="text-muted">Coefficient (a)</span>
                <span className="font-semibold">{fmtCoeff(sci.coeff)}</span>
              </div>
              <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded">
                <span className="text-muted">Exponent (n)</span>
                <span className="font-semibold">{sci.exp}</span>
              </div>
            </div>
          </div>
        )}

        {!valid && raw !== "" && (
          <div className="text-center text-sm text-danger font-medium">Could not parse input. Try: 2.998e8 or 299792458</div>
        )}
      </div>
    </CalculatorShell>
  );
}
