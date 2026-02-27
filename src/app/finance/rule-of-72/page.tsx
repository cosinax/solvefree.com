"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

export default function RuleOf72Page() {
  const [v, setV] = useHashState({ rate: "7" });
  const r = parseFloat(v.rate);
  const valid = r > 0;
  const years72 = 72 / r;
  const years69 = 69.3 / r; // more precise
  const tripleYears = 114 / r; // rule of 114
  const quadYears = 144 / r; // rule of 144
  const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

  const examples = [2, 4, 6, 7, 8, 10, 12, 15, 20, 25];

  return (
    <CalculatorShell title="Rule of 72 Calculator" description="Estimate how many years to double (or triple/quadruple) an investment at a given return rate.">
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-muted mb-1">Annual Return Rate (%)</label>
          <input type="number" value={v.rate} onChange={e => setV({ rate: e.target.value })} step="0.5" className={ic} />
        </div>
        {valid && (
          <div className="space-y-3">
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="block text-sm text-muted">Years to Double (Rule of 72)</span>
              <span className="block font-mono font-bold text-4xl text-primary">{years72.toFixed(1)} years</span>
              <span className="block text-xs text-muted">More precise: {years69.toFixed(1)} years</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="px-4 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">3× (Rule of 114)</span>
                <span className="font-mono font-bold text-xl">{tripleYears.toFixed(1)} yrs</span>
              </div>
              <div className="px-4 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">4× (Rule of 144)</span>
                <span className="font-mono font-bold text-xl">{quadYears.toFixed(1)} yrs</span>
              </div>
            </div>
          </div>
        )}
        <div>
          <p className="text-xs text-muted font-semibold mb-2">Reference table:</p>
          <div className="space-y-1 text-xs font-mono">
            {examples.map(rate => (
              <div key={rate} className={`flex justify-between px-3 py-1.5 rounded border ${r === rate ? "bg-primary-light border-primary/30" : "bg-background border-card-border"}`}>
                <span>{rate}% / year</span>
                <span>doubles in {(72 / rate).toFixed(1)} yrs</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-muted">The Rule of 72 is an approximation. For exact doubling: t = ln(2) / ln(1 + r/100).</p>
      </div>
    </CalculatorShell>
  );
}
