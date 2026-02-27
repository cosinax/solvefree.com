"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

const fmt = (n: number, d = 5) => parseFloat(n.toPrecision(d)).toString();

type InputMode = "vswr" | "gamma" | "rl";

export default function VswrPage() {
  const [v, setV] = useHashState({
    mode: "vswr",
    vswrVal: "1.5",
    gammaVal: "0.2",
    rlVal: "14",
  });

  const mode = v.mode as InputMode;

  interface Results {
    vswr: number;
    gamma: number;
    rl: number;
    mismatchLoss: number;
    powerReflPct: number;
  }

  let result: Results | null = null;

  if (mode === "vswr") {
    const vswr = parseFloat(v.vswrVal);
    if (isFinite(vswr) && vswr >= 1) {
      const gamma = (vswr - 1) / (vswr + 1);
      const rl = -20 * Math.log10(gamma);
      const mismatchLoss = -10 * Math.log10(1 - gamma * gamma);
      result = { vswr, gamma, rl, mismatchLoss, powerReflPct: gamma * gamma * 100 };
    }
  } else if (mode === "gamma") {
    const gamma = parseFloat(v.gammaVal);
    if (isFinite(gamma) && gamma >= 0 && gamma < 1) {
      const vswr = (1 + gamma) / (1 - gamma);
      const rl = -20 * Math.log10(gamma);
      const mismatchLoss = -10 * Math.log10(1 - gamma * gamma);
      result = { vswr, gamma, rl, mismatchLoss, powerReflPct: gamma * gamma * 100 };
    }
  } else if (mode === "rl") {
    const rl = parseFloat(v.rlVal);
    if (isFinite(rl) && rl >= 0) {
      const gamma = Math.pow(10, -rl / 20);
      const vswr = (1 + gamma) / (1 - gamma);
      const mismatchLoss = -10 * Math.log10(1 - gamma * gamma);
      result = { vswr, gamma, rl, mismatchLoss, powerReflPct: gamma * gamma * 100 };
    }
  }

  return (
    <CalculatorShell
      title="VSWR & Return Loss"
      description="Convert between VSWR, reflection coefficient (Γ), return loss, mismatch loss, and reflected power."
    >
      <div className="space-y-4">
        <div className="flex gap-2">
          {([
            { key: "vswr", label: "VSWR" },
            { key: "gamma", label: "Γ (reflection coeff)" },
            { key: "rl", label: "Return Loss (dB)" },
          ] as const).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setV({ mode: key })}
              className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${
                mode === key
                  ? "bg-primary text-white"
                  : "bg-card border border-card-border text-muted hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {mode === "vswr" && (
          <div>
            <label className="block text-sm text-muted mb-1">VSWR (≥ 1.0)</label>
            <input
              type="number"
              value={v.vswrVal}
              onChange={(e) => setV({ vswrVal: e.target.value })}
              className={ic}
              min="1"
              step="0.1"
              placeholder="e.g. 1.5"
            />
          </div>
        )}

        {mode === "gamma" && (
          <div>
            <label className="block text-sm text-muted mb-1">Reflection Coefficient Γ (0 – 1)</label>
            <input
              type="number"
              value={v.gammaVal}
              onChange={(e) => setV({ gammaVal: e.target.value })}
              className={ic}
              min="0"
              max="0.9999"
              step="0.01"
              placeholder="e.g. 0.2"
            />
          </div>
        )}

        {mode === "rl" && (
          <div>
            <label className="block text-sm text-muted mb-1">Return Loss (dB, ≥ 0)</label>
            <input
              type="number"
              value={v.rlVal}
              onChange={(e) => setV({ rlVal: e.target.value })}
              className={ic}
              min="0"
              step="0.5"
              placeholder="e.g. 14"
            />
          </div>
        )}

        {result && (
          <div className="mt-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "VSWR", value: fmt(result.vswr, 5), unit: "" },
                { label: "Reflection Coeff (Γ)", value: fmt(result.gamma, 5), unit: "" },
                { label: "Return Loss", value: fmt(result.rl, 5), unit: "dB" },
                { label: "Mismatch Loss", value: fmt(result.mismatchLoss, 4), unit: "dB" },
              ].map(({ label, value, unit }) => (
                <div key={label} className="p-3 bg-card rounded-xl border border-card-border">
                  <div className="text-xs text-muted mb-1">{label}</div>
                  <div className="text-lg font-bold font-mono">
                    {value}{unit && <span className="text-sm font-normal ml-1">{unit}</span>}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 bg-card rounded-xl border border-card-border">
              <div className="text-sm text-muted mb-2">Reflected Power</div>
              <div className="text-2xl font-bold font-mono">{fmt(result.powerReflPct, 4)}%</div>
              <div className="mt-2 h-3 bg-background rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${Math.min(result.powerReflPct, 100)}%` }}
                />
              </div>
              <div className="text-xs text-muted mt-1">
                {fmt(100 - result.powerReflPct, 4)}% of power reaches the load
              </div>
            </div>
          </div>
        )}

        <div className="text-xs text-muted border-t border-card-border pt-3 space-y-1">
          <div>Γ = (VSWR − 1) / (VSWR + 1)</div>
          <div>RL = −20·log₁₀(Γ) dB</div>
          <div>Mismatch Loss = −10·log₁₀(1 − Γ²) dB</div>
        </div>
      </div>
    </CalculatorShell>
  );
}
