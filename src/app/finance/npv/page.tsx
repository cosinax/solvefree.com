"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

function fmt(n: number): string {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function calcNPV(rate: number, cashFlows: number[]): number {
  return cashFlows.reduce((acc, cf, i) => acc + cf / Math.pow(1 + rate, i), 0);
}

function calcIRR(cashFlows: number[]): number | null {
  // Newton-Raphson method
  let guess = 0.1;
  for (let iter = 0; iter < 1000; iter++) {
    const npv  = calcNPV(guess, cashFlows);
    const dnpv = cashFlows.reduce((acc, cf, i) => acc - i * cf / Math.pow(1 + guess, i + 1), 0);
    if (Math.abs(dnpv) < 1e-12) break;
    const newGuess = guess - npv / dnpv;
    if (Math.abs(newGuess - guess) < 1e-10) return newGuess;
    guess = newGuess;
    if (guess <= -1) guess = -0.9999;
  }
  return null;
}

export default function NpvPage() {
  const [v, setV] = useHashState({
    rate: "10",
    initialInvestment: "50000",
    cf1: "15000", cf2: "18000", cf3: "20000", cf4: "22000", cf5: "25000",
    cf6: "", cf7: "", cf8: "", cf9: "", cf10: "",
  });
  const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
  const cfKeys = ["cf1","cf2","cf3","cf4","cf5","cf6","cf7","cf8","cf9","cf10"] as const;

  const rate   = parseFloat(v.rate) / 100;
  const init   = parseFloat(v.initialInvestment);
  const flows  = cfKeys.map(k => parseFloat(v[k])).filter(x => !isNaN(x));
  const valid  = !isNaN(rate) && !isNaN(init) && flows.length > 0;

  const allFlows = valid ? [-init, ...flows] : [];
  const npv      = valid ? calcNPV(rate, allFlows) : 0;
  const irr      = valid ? calcIRR(allFlows) : null;

  // Payback period
  let payback: number | null = null;
  if (valid) {
    let cum = -init;
    for (let i = 0; i < flows.length; i++) {
      const prev = cum;
      cum += flows[i];
      if (cum >= 0) {
        payback = i + 1 + prev / flows[i] * -1;
        break;
      }
    }
  }

  const profitabilityIndex = valid && init > 0 ? (npv + init) / init : 0;

  return (
    <CalculatorShell title="NPV Calculator" description="Net Present Value — discount future cash flows to determine investment worth.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-muted mb-1">Discount Rate (%)</label>
            <input type="number" value={v.rate} onChange={e => setV({ rate: e.target.value })} className={ic} step="0.1" />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Initial Investment ($)</label>
            <input type="number" value={v.initialInvestment} onChange={e => setV({ initialInvestment: e.target.value })} className={ic} min="0" />
          </div>
        </div>

        <div>
          <p className="text-sm text-muted mb-2">Annual Cash Flows (Year 1–10)</p>
          <div className="grid grid-cols-2 gap-2">
            {cfKeys.map((k, i) => (
              <div key={k}>
                <label className="block text-xs text-muted mb-1">Year {i + 1}</label>
                <input
                  type="number"
                  value={v[k]}
                  onChange={e => setV({ [k]: e.target.value } as Partial<typeof v>)}
                  className={ic}
                  placeholder="optional"
                />
              </div>
            ))}
          </div>
        </div>

        {valid && (
          <div className="space-y-3">
            <div className={`rounded-xl p-4 text-center ${npv >= 0 ? "bg-primary-light" : "bg-red-50 dark:bg-red-950"}`}>
              <span className="block text-sm text-muted">Net Present Value (NPV)</span>
              <span className={`block font-mono font-bold text-4xl ${npv >= 0 ? "text-primary" : "text-danger"}`}>
                {npv >= 0 ? "+" : ""}${fmt(npv)}
              </span>
              <span className="text-xs text-muted">{npv >= 0 ? "Investment adds value" : "Investment destroys value"}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="px-3 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">IRR</span>
                <span className="font-mono font-semibold">
                  {irr !== null ? `${(irr * 100).toFixed(2)}%` : "N/A"}
                </span>
              </div>
              <div className="px-3 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">Payback Period</span>
                <span className="font-mono font-semibold">
                  {payback !== null ? `${payback.toFixed(2)} yr` : "> horizon"}
                </span>
              </div>
              <div className="px-3 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">Profit. Index</span>
                <span className="font-mono font-semibold">{profitabilityIndex.toFixed(3)}</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted">Cash flow detail (undiscounted vs discounted)</p>
              <div className="max-h-48 overflow-y-auto rounded-lg border border-card-border">
                <table className="w-full text-xs font-mono">
                  <thead className="bg-card sticky top-0">
                    <tr>
                      <th className="px-3 py-2 text-left text-muted">Year</th>
                      <th className="px-3 py-2 text-right text-muted">Cash Flow</th>
                      <th className="px-3 py-2 text-right text-muted">Discounted</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-card-border">
                      <td className="px-3 py-1.5">0</td>
                      <td className="px-3 py-1.5 text-right text-danger">-${fmt(init)}</td>
                      <td className="px-3 py-1.5 text-right text-danger">-${fmt(init)}</td>
                    </tr>
                    {flows.map((cf, i) => {
                      const discounted = cf / Math.pow(1 + rate, i + 1);
                      return (
                        <tr key={i} className="border-t border-card-border">
                          <td className="px-3 py-1.5">{i + 1}</td>
                          <td className={`px-3 py-1.5 text-right ${cf >= 0 ? "text-success" : "text-danger"}`}>
                            {cf >= 0 ? "+" : ""}${fmt(cf)}
                          </td>
                          <td className={`px-3 py-1.5 text-right ${discounted >= 0 ? "text-success" : "text-danger"}`}>
                            {discounted >= 0 ? "+" : ""}${fmt(discounted)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        <p className="text-xs text-muted">NPV = Σ CFt / (1+r)^t − I₀. IRR uses Newton–Raphson approximation. PI = (NPV + I₀) / I₀.</p>
      </div>
    </CalculatorShell>
  );
}
