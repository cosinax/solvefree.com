"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

export default function PaybackPeriodPage() {
  const [v, setV] = useHashState({ investment: "100000", annualReturn: "25000" });
  const invest = parseFloat(v.investment);
  const annual = parseFloat(v.annualReturn);
  const valid = invest > 0 && annual > 0;
  const years = invest / annual;
  const months = years * 12;
  const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

  return (
    <CalculatorShell title="Payback Period Calculator" description="How long until an investment pays for itself from its returns.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div><label className="block text-sm text-muted mb-1">Initial Investment ($)</label><input type="number" value={v.investment} onChange={e => setV({ investment: e.target.value })} className={ic} /></div>
          <div><label className="block text-sm text-muted mb-1">Annual Net Return ($)</label><input type="number" value={v.annualReturn} onChange={e => setV({ annualReturn: e.target.value })} className={ic} /></div>
        </div>
        {valid && (
          <div className="space-y-3">
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="block text-sm text-muted">Payback Period</span>
              <span className="block font-mono font-bold text-4xl text-primary">{years.toFixed(2)} years</span>
              <span className="block text-sm text-muted">≈ {months.toFixed(1)} months</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="px-4 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">Monthly Return</span>
                <span className="font-mono font-bold text-lg">${(annual / 12).toLocaleString("en-US", { maximumFractionDigits: 0 })}</span>
              </div>
              <div className="px-4 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">Return Multiple (5yr)</span>
                <span className="font-mono font-bold text-lg">{((annual * 5 - invest) / invest * 100).toFixed(0)}%</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
