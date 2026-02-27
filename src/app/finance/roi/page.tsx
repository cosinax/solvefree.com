"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

function fmt(n: number): string {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function RoiPage() {
  const [v, setV] = useHashState({ initial: "10000", final: "14500", years: "3" });
  const initial = parseFloat(v.initial), final_ = parseFloat(v.final), years = parseFloat(v.years);
  const valid = initial > 0 && final_ > 0;
  const roi = ((final_ - initial) / initial) * 100;
  const gain = final_ - initial;
  const cagr = years > 0 && valid ? (Math.pow(final_ / initial, 1 / years) - 1) * 100 : 0;
  const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

  return (
    <CalculatorShell title="ROI Calculator" description="Calculate return on investment, gain/loss, and annualized CAGR.">
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div><label className="block text-sm text-muted mb-1">Initial Investment ($)</label><input type="number" value={v.initial} onChange={e => setV({ initial: e.target.value })} className={ic} /></div>
          <div><label className="block text-sm text-muted mb-1">Final Value ($)</label><input type="number" value={v.final} onChange={e => setV({ final: e.target.value })} className={ic} /></div>
          <div><label className="block text-sm text-muted mb-1">Time (years)</label><input type="number" value={v.years} onChange={e => setV({ years: e.target.value })} step="0.5" className={ic} /></div>
        </div>
        {valid && (
          <div className="space-y-3">
            <div className={`rounded-xl p-4 text-center ${roi >= 0 ? "bg-primary-light" : "bg-red-50 dark:bg-red-950"}`}>
              <span className="block text-sm text-muted">Return on Investment</span>
              <span className={`block font-mono font-bold text-4xl ${roi >= 0 ? "text-primary" : "text-danger"}`}>{roi >= 0 ? "+" : ""}{roi.toFixed(2)}%</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="px-4 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">Net Gain/Loss</span>
                <span className={`font-mono font-bold text-lg ${gain >= 0 ? "text-success" : "text-danger"}`}>{gain >= 0 ? "+" : ""}${fmt(gain)}</span>
              </div>
              <div className="px-4 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">CAGR</span>
                <span className="font-mono font-bold text-lg">{cagr.toFixed(2)}%</span>
              </div>
              <div className="px-4 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">Multiplier</span>
                <span className="font-mono font-bold text-lg">{(final_ / initial).toFixed(2)}×</span>
              </div>
            </div>
          </div>
        )}
        <p className="text-xs text-muted">ROI = (Final − Initial) / Initial × 100. CAGR = (Final/Initial)^(1/years) − 1.</p>
      </div>
    </CalculatorShell>
  );
}
