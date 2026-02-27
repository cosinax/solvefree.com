"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

function roundToSigFigs(n: number, sf: number): number {
  if (n === 0) return 0;
  const mag = Math.floor(Math.log10(Math.abs(n)));
  const factor = Math.pow(10, sf - 1 - mag);
  return Math.round(n * factor) / factor;
}

function toEngineering(n: number): string {
  if (n === 0) return "0";
  const exp = Math.floor(Math.log10(Math.abs(n)));
  const engExp = Math.floor(exp / 3) * 3;
  const coeff = n / Math.pow(10, engExp);
  return `${parseFloat(coeff.toPrecision(12))} × 10^${engExp}`;
}

function countSigFigs(s: string): number[] {
  // Returns array of indices (in the digit string) that are significant
  const cleaned = s.replace(/[^0-9.eE+-]/g, "");
  const isNeg = cleaned.startsWith("-");
  const digits = cleaned.replace("-", "");

  // Find significant digit indices in the original string
  const sigIndices: number[] = [];
  const parts = digits.split(/[eE]/);
  const mainPart = parts[0];
  const hasDot = mainPart.includes(".");
  const [intPart, fracPart] = mainPart.split(".");

  let foundNonZero = false;
  let idx = 0;

  // Integer part
  for (let i = 0; i < intPart.length; i++) {
    const ch = intPart[i];
    if (ch !== "0") foundNonZero = true;
    if (foundNonZero) sigIndices.push(idx);
    idx++;
  }

  // Fractional part
  if (fracPart !== undefined) {
    idx++; // skip dot
    for (let i = 0; i < fracPart.length; i++) {
      const ch = fracPart[i];
      if (!foundNonZero && ch !== "0") foundNonZero = true;
      if (foundNonZero) sigIndices.push(idx);
      idx++;
    }
  }

  return sigIndices;
}

export default function SigFigsPage() {
  const [v, setV] = useHashState({ n: "12345.678", sf: "4" });

  const numVal = parseFloat(v.n);
  const sf = parseInt(v.sf);
  const valid = !isNaN(numVal) && !isNaN(sf) && sf >= 1 && sf <= 10 && v.n.trim() !== "";

  const rounded = valid ? roundToSigFigs(numVal, sf) : NaN;
  const sciNotation = valid && !isNaN(rounded) ? rounded.toExponential(sf - 1) : "";
  const engNotation = valid && !isNaN(rounded) ? toEngineering(rounded) : "";

  // Build highlighted display of original number
  const original = v.n.trim();
  const sigIdx = original ? countSigFigs(original) : [];

  return (
    <CalculatorShell title="Significant Figures Calculator" description="Round a number to a given number of significant figures and display in standard, scientific, and engineering notation.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-muted mb-1">Number</label>
            <input type="text" value={v.n} onChange={e => setV({ n: e.target.value })} className={ic} placeholder="e.g. 12345.678" />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Significant Figures (1–10)</label>
            <input type="number" value={v.sf} onChange={e => setV({ sf: e.target.value })} className={ic} min="1" max="10" step="1" />
          </div>
        </div>

        {valid && !isNaN(rounded) && (
          <div className="space-y-3">
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="text-xs text-muted block mb-1">Rounded to {sf} sig fig{sf !== 1 ? "s" : ""}</span>
              <span className="block font-mono font-bold text-4xl text-primary">{rounded}</span>
            </div>

            <div className="space-y-1 text-xs font-mono">
              <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded">
                <span className="text-muted">Standard</span>
                <span className="font-semibold">{rounded}</span>
              </div>
              <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded">
                <span className="text-muted">Scientific notation</span>
                <span className="font-semibold">{sciNotation}</span>
              </div>
              <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded">
                <span className="text-muted">Engineering notation</span>
                <span className="font-semibold">{engNotation}</span>
              </div>
            </div>

            <div>
              <p className="text-xs text-muted mb-1">Significant digits in original ({original}):</p>
              <div className="px-3 py-2 bg-background border border-card-border rounded font-mono text-sm flex flex-wrap gap-0.5">
                {original.split("").map((ch, i) => {
                  const isSig = sigIdx.includes(i);
                  return (
                    <span key={i} className={isSig ? "text-primary font-bold underline decoration-dotted" : "text-muted"}>
                      {ch}
                    </span>
                  );
                })}
              </div>
              <p className="text-xs text-muted mt-1">Underlined digits are significant ({sigIdx.length} total).</p>
            </div>
          </div>
        )}

        {!valid && v.n.trim() !== "" && (
          <div className="text-center text-sm text-danger font-medium">Enter a valid number and sig figs between 1 and 10.</div>
        )}
      </div>
    </CalculatorShell>
  );
}
