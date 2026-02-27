"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
const sel = "w-full px-3 py-2.5 bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

// z-values for common confidence levels
const CI_Z: Record<string, { z: number; label: string }> = {
  "90": { z: 1.6449, label: "90%" },
  "95": { z: 1.9600, label: "95%" },
  "99": { z: 2.5758, label: "99%" },
};

export default function ConfidenceIntervalPage() {
  const [v, setV] = useHashState({ mean: "100", sd: "15", n: "30", level: "95", inputType: "sd" });

  const mean = parseFloat(v.mean);
  const sd = parseFloat(v.sd);
  const n = parseFloat(v.n);
  const ciData = CI_Z[v.level] ?? CI_Z["95"];
  const valid = !isNaN(mean) && !isNaN(sd) && sd >= 0 && n >= 1;

  const se = valid ? (v.inputType === "se" ? sd : sd / Math.sqrt(n)) : null;
  const marginOfError = se !== null ? ciData.z * se : null;
  const lower = marginOfError !== null ? mean - marginOfError : null;
  const upper = marginOfError !== null ? mean + marginOfError : null;

  return (
    <CalculatorShell title="Confidence Interval Calculator" description="Calculate confidence intervals for a population mean using z-distribution.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-muted mb-1">Sample Mean (x̄)</label>
            <input type="number" value={v.mean} onChange={e => setV({ mean: e.target.value })} className={ic} />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Confidence Level</label>
            <select value={v.level} onChange={e => setV({ level: e.target.value })} className={sel}>
              <option value="90">90%</option>
              <option value="95">95%</option>
              <option value="99">99%</option>
            </select>
          </div>
        </div>
        <div className="flex gap-2 mb-1">
          <button onClick={() => setV({ inputType: "sd" })} className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors ${v.inputType === "sd" ? "bg-primary text-white" : "bg-background border border-card-border text-muted"}`}>Std Deviation + n</button>
          <button onClick={() => setV({ inputType: "se" })} className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors ${v.inputType === "se" ? "bg-primary text-white" : "bg-background border border-card-border text-muted"}`}>Std Error directly</button>
        </div>
        {v.inputType === "sd" ? (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-muted mb-1">Std Deviation (s)</label>
              <input type="number" value={v.sd} onChange={e => setV({ sd: e.target.value })} className={ic} />
            </div>
            <div>
              <label className="block text-sm text-muted mb-1">Sample Size (n)</label>
              <input type="number" value={v.n} onChange={e => setV({ n: e.target.value })} min="1" className={ic} />
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-sm text-muted mb-1">Standard Error (SE)</label>
            <input type="number" value={v.sd} onChange={e => setV({ sd: e.target.value })} className={ic} />
          </div>
        )}

        {valid && se !== null && marginOfError !== null && lower !== null && upper !== null && (
          <div className="space-y-3">
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="block text-xs text-muted mb-1">{ciData.label} Confidence Interval</span>
              <span className="block font-mono font-bold text-3xl text-primary">
                [{lower.toFixed(4)}, {upper.toFixed(4)}]
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col items-center px-3 py-2.5 bg-background border border-card-border rounded text-xs font-mono text-center">
                <span className="text-muted mb-1">Margin of Error</span>
                <span className="font-bold">± {marginOfError.toFixed(4)}</span>
              </div>
              <div className="flex flex-col items-center px-3 py-2.5 bg-background border border-card-border rounded text-xs font-mono text-center">
                <span className="text-muted mb-1">Standard Error</span>
                <span className="font-bold">{se.toFixed(4)}</span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
                <span className="text-muted">Z-value for {ciData.label}</span>
                <span>± {ciData.z}</span>
              </div>
              <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
                <span className="text-muted">Formula</span>
                <span>x̄ ± z × {v.inputType === "sd" ? `(s/√n)` : "SE"}</span>
              </div>
              {v.inputType === "sd" && (
                <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
                  <span className="text-muted">SE = s / √n</span>
                  <span>{sd} / √{n} = {se.toFixed(4)}</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div>
          <p className="text-xs text-muted font-semibold mb-2">Z-Values by Confidence Level</p>
          <div className="space-y-1">
            {Object.values(CI_Z).map(ci => (
              <div key={ci.label} className={`flex justify-between px-3 py-1.5 rounded text-xs font-mono border ${v.level && CI_Z[v.level]?.label === ci.label ? "border-primary bg-primary-light" : "border-card-border bg-background"}`}>
                <span>{ci.label}</span>
                <span className="text-muted">z = ± {ci.z}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CalculatorShell>
  );
}
