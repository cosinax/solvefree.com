"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

export default function EntropyPage() {
  const [v, setV] = useHashState({ charset: "62", length: "16" });
  const N = parseFloat(v.charset);
  const L = parseFloat(v.length);
  const valid = N > 1 && L > 0;
  const entropy = valid ? L * Math.log2(N) : 0;

  function getLabel(e: number): string {
    if (e < 40) return "Very Weak — cracklable in seconds";
    if (e < 60) return "Weak — crackable in hours/days";
    if (e < 80) return "Moderate — crackable in years";
    if (e < 100) return "Strong — extremely hard to crack";
    return "Very Strong — practically uncrackable";
  }

  const presets = [
    { label: "PIN (4 digits)", charset: 10, length: 4 },
    { label: "PIN (6 digits)", charset: 10, length: 6 },
    { label: "Hex key (lowercase)", charset: 16, length: 32 },
    { label: "Alphanumeric", charset: 62, length: 12 },
    { label: "Full ASCII printable", charset: 95, length: 16 },
    { label: "Diceware passphrase (5 words)", charset: 7776, length: 5 },
  ];

  const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

  return (
    <CalculatorShell title="Password Entropy Calculator" description="Calculate entropy bits for any password length and character set size.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-muted mb-1">Character Set Size (N)</label>
            <input type="number" value={v.charset} onChange={e => setV({ charset: e.target.value })} className={ic} />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Password Length</label>
            <input type="number" value={v.length} onChange={e => setV({ length: e.target.value })} className={ic} />
          </div>
        </div>
        <div>
          <p className="text-xs text-muted mb-2">Common presets:</p>
          <div className="grid grid-cols-2 gap-1.5">
            {presets.map(p => (
              <button key={p.label} onClick={() => setV({ charset: p.charset.toString(), length: p.length.toString() })}
                className="px-3 py-2 text-xs bg-background border border-card-border rounded-lg hover:bg-primary-light text-left">
                <span className="block font-medium">{p.label}</span>
                <span className="text-muted font-mono">N={p.charset}, L={p.length}</span>
              </button>
            ))}
          </div>
        </div>
        {valid && (
          <div className="space-y-3">
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="block text-sm text-muted">Entropy</span>
              <span className="block font-mono font-bold text-4xl text-primary">{entropy.toFixed(1)} bits</span>
            </div>
            <div className="px-4 py-3 bg-background border border-card-border rounded-lg text-sm">
              <p className={entropy < 60 ? "text-danger font-medium" : entropy < 80 ? "text-yellow-600 font-medium" : "text-success font-medium"}>{getLabel(entropy)}</p>
              <p className="text-xs text-muted mt-1">Possible combinations: 10<sup>{(entropy / Math.log2(10)).toFixed(0)}</sup></p>
            </div>
            <p className="text-xs text-muted">H = L × log₂(N) where N = charset size, L = length. Aim for ≥ 80 bits for strong security.</p>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
