"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

const fmt = (n: number, d = 5) => parseFloat(n.toPrecision(d)).toString();

const T0 = 290; // Reference temperature (K)

export default function NoiseFigurePage() {
  const [v, setV] = useHashState({
    nfInput: "nf",
    nfVal: "3",
    teVal: "289",
    // Cascaded (Friis) - up to 3 stages
    showFriis: "false",
    nf1: "3",
    g1: "20",
    nf2: "10",
    g2: "10",
    nf3: "6",
  });

  // Single conversion
  const inputMode = v.nfInput;
  let nfDb: number | null = null;
  let te: number | null = null;

  if (inputMode === "nf") {
    const nf = parseFloat(v.nfVal);
    if (isFinite(nf) && nf >= 0) {
      nfDb = nf;
      const F = Math.pow(10, nf / 10);
      te = T0 * (F - 1);
    }
  } else {
    const teVal = parseFloat(v.teVal);
    if (isFinite(teVal) && teVal >= 0) {
      te = teVal;
      const F = 1 + teVal / T0;
      nfDb = 10 * Math.log10(F);
    }
  }

  // Friis cascaded noise figure
  const nf1 = parseFloat(v.nf1);
  const g1 = parseFloat(v.g1);
  const nf2 = parseFloat(v.nf2);
  const g2 = parseFloat(v.g2);
  const nf3 = parseFloat(v.nf3);

  let friisValid = false;
  let f_total_dB: number | null = null;
  let te_total: number | null = null;

  if ([nf1, g1, nf2, g2, nf3].every(isFinite)) {
    friisValid = true;
    const F1 = Math.pow(10, nf1 / 10);
    const G1 = Math.pow(10, g1 / 10);
    const F2 = Math.pow(10, nf2 / 10);
    const G2 = Math.pow(10, g2 / 10);
    const F3 = Math.pow(10, nf3 / 10);
    const F_total = F1 + (F2 - 1) / G1 + (F3 - 1) / (G1 * G2);
    f_total_dB = 10 * Math.log10(F_total);
    te_total = T0 * (F_total - 1);
  }

  return (
    <CalculatorShell
      title="Noise Figure & Noise Temperature"
      description="Convert between noise figure (dB) and noise temperature (K). Also compute cascaded noise figure using the Friis formula."
    >
      <div className="space-y-4">
        <div className="flex gap-2">
          {([
            { key: "nf", label: "Noise Figure (dB)" },
            { key: "te", label: "Noise Temp (K)" },
          ] as const).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setV({ nfInput: key })}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                inputMode === key
                  ? "bg-primary text-white"
                  : "bg-card border border-card-border text-muted hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {inputMode === "nf" && (
          <div>
            <label className="block text-sm text-muted mb-1">Noise Figure (dB)</label>
            <input
              type="number"
              value={v.nfVal}
              onChange={(e) => setV({ nfVal: e.target.value })}
              className={ic}
              placeholder="e.g. 3"
              min="0"
              step="0.1"
            />
          </div>
        )}
        {inputMode === "te" && (
          <div>
            <label className="block text-sm text-muted mb-1">Noise Temperature (K)</label>
            <input
              type="number"
              value={v.teVal}
              onChange={(e) => setV({ teVal: e.target.value })}
              className={ic}
              placeholder="e.g. 289"
              min="0"
            />
          </div>
        )}

        {nfDb !== null && te !== null && (
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 bg-card rounded-xl border border-card-border">
              <div className="text-sm text-muted mb-1">Noise Figure</div>
              <div className="text-2xl font-bold font-mono">{fmt(nfDb, 5)} dB</div>
              <div className="text-xs text-muted mt-1">F = {fmt(Math.pow(10, nfDb / 10), 4)} (linear)</div>
            </div>
            <div className="p-4 bg-card rounded-xl border border-card-border">
              <div className="text-sm text-muted mb-1">Noise Temperature</div>
              <div className="text-2xl font-bold font-mono">{fmt(te, 5)} K</div>
              <div className="text-xs text-muted mt-1">T_e = T0 × (F − 1)</div>
            </div>
          </div>
        )}

        <div className="border-t border-card-border pt-4">
          <button
            onClick={() => setV({ showFriis: v.showFriis === "true" ? "false" : "true" })}
            className="text-sm text-primary hover:underline"
          >
            {v.showFriis === "true" ? "Hide" : "Show"} Friis cascaded noise figure
          </button>

          {v.showFriis === "true" && (
            <div className="mt-3 space-y-3">
              <div className="text-xs text-muted">Enter NF (dB) and Gain (dB) for each stage.</div>
              {([
                { nfKey: "nf1" as const, gKey: "g1" as const, label: "Stage 1" },
                { nfKey: "nf2" as const, gKey: "g2" as const, label: "Stage 2" },
                { nfKey: "nf3" as const, gKey: undefined, label: "Stage 3" },
              ] as const).map(({ nfKey, gKey, label }) => (
                <div key={label} className="grid grid-cols-2 gap-3 items-end">
                  <div>
                    <label className="block text-xs text-muted mb-1">{label} NF (dB)</label>
                    <input
                      type="number"
                      value={v[nfKey]}
                      onChange={(e) => setV({ [nfKey]: e.target.value } as Partial<typeof v>)}
                      className={ic}
                    />
                  </div>
                  {gKey && (
                    <div>
                      <label className="block text-xs text-muted mb-1">{label} Gain (dB)</label>
                      <input
                        type="number"
                        value={v[gKey]}
                        onChange={(e) => setV({ [gKey]: e.target.value } as Partial<typeof v>)}
                        className={ic}
                      />
                    </div>
                  )}
                </div>
              ))}

              {friisValid && f_total_dB !== null && te_total !== null && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 bg-card rounded-xl border border-card-border">
                    <div className="text-sm text-muted mb-1">Total NF (Friis)</div>
                    <div className="text-2xl font-bold font-mono">{fmt(f_total_dB, 5)} dB</div>
                  </div>
                  <div className="p-4 bg-card rounded-xl border border-card-border">
                    <div className="text-sm text-muted mb-1">Total T_e</div>
                    <div className="text-2xl font-bold font-mono">{fmt(te_total, 5)} K</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="text-xs text-muted border-t border-card-border pt-3 space-y-1">
          <div>T_e = T₀ × (F − 1), T₀ = 290 K</div>
          <div>Friis: F_tot = F₁ + (F₂−1)/G₁ + (F₃−1)/(G₁G₂)</div>
        </div>
      </div>
    </CalculatorShell>
  );
}
