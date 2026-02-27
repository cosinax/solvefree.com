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

export default function IrrPage() {
  const [v, setV] = useHashState({
    initialInvestment: "50000",
    cf1: "15000", cf2: "18000", cf3: "20000", cf4: "22000", cf5: "25000",
    cf6: "", cf7: "", cf8: "", cf9: "", cf10: "",
  });
  const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
  const cfKeys = ["cf1","cf2","cf3","cf4","cf5","cf6","cf7","cf8","cf9","cf10"] as const;

  const init  = parseFloat(v.initialInvestment);
  const flows = cfKeys.map(k => parseFloat(v[k])).filter(x => !isNaN(x));
  const valid = !isNaN(init) && init > 0 && flows.length > 0;

  const allFlows   = valid ? [-init, ...flows] : [];
  const irr        = valid ? calcIRR(allFlows) : null;
  const npvAtZero  = valid ? calcNPV(0, allFlows) : 0;

  // Payback and cumulative table
  const cumTable: { year: number; cf: number; cumulative: number }[] = [];
  let payback: number | null = null;
  if (valid) {
    let cum = -init;
    cumTable.push({ year: 0, cf: -init, cumulative: cum });
    for (let i = 0; i < flows.length; i++) {
      const prev = cum;
      cum += flows[i];
      cumTable.push({ year: i + 1, cf: flows[i], cumulative: cum });
      if (payback === null && cum >= 0) {
        payback = (i + 1) + prev / flows[i] * -1;
      }
    }
  }

  return (
    <CalculatorShell title="IRR Calculator" description="Internal Rate of Return — the discount rate that makes NPV equal to zero.">
      <div className="space-y-4">
        <div>
          <p className="text-xs text-muted mb-3">IRR is the discount rate at which the net present value (NPV) of all cash flows equals zero. A higher IRR indicates a more attractive investment.</p>
        </div>
        <div>
          <label className="block text-sm text-muted mb-1">Initial Investment ($)</label>
          <input type="number" value={v.initialInvestment} onChange={e => setV({ initialInvestment: e.target.value })} className={ic} min="0" />
        </div>
        <div>
          <p className="text-sm text-muted mb-2">Annual Cash Inflows (Year 1–10)</p>
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
            <div className={`rounded-xl p-4 text-center ${irr !== null && irr > 0 ? "bg-primary-light" : "bg-red-50 dark:bg-red-950"}`}>
              <span className="block text-sm text-muted">IRR</span>
              <span className={`block font-mono font-bold text-4xl ${irr !== null && irr > 0 ? "text-primary" : "text-danger"}`}>
                {irr !== null ? `${(irr * 100).toFixed(4)}%` : "Cannot compute"}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="px-3 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">NPV at 0% Rate</span>
                <span className={`font-mono font-semibold ${npvAtZero >= 0 ? "text-success" : "text-danger"}`}>
                  {npvAtZero >= 0 ? "+" : ""}${fmt(npvAtZero)}
                </span>
              </div>
              <div className="px-3 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">Payback Period</span>
                <span className="font-mono font-semibold">
                  {payback !== null ? `${payback.toFixed(2)} yr` : "> horizon"}
                </span>
              </div>
            </div>

            <div className="max-h-56 overflow-y-auto rounded-lg border border-card-border">
              <table className="w-full text-xs font-mono">
                <thead className="bg-card sticky top-0">
                  <tr>
                    <th className="px-3 py-2 text-left text-muted">Year</th>
                    <th className="px-3 py-2 text-right text-muted">Cash Flow</th>
                    <th className="px-3 py-2 text-right text-muted">Cumulative</th>
                  </tr>
                </thead>
                <tbody>
                  {cumTable.map(row => (
                    <tr key={row.year} className="border-t border-card-border">
                      <td className="px-3 py-1.5">{row.year}</td>
                      <td className={`px-3 py-1.5 text-right ${row.cf >= 0 ? "text-success" : "text-danger"}`}>
                        {row.cf >= 0 ? "+" : ""}${fmt(row.cf)}
                      </td>
                      <td className={`px-3 py-1.5 text-right font-semibold ${row.cumulative >= 0 ? "text-success" : "text-danger"}`}>
                        {row.cumulative >= 0 ? "+" : ""}${fmt(row.cumulative)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        <p className="text-xs text-muted">IRR uses Newton–Raphson iteration. Multiple sign changes may yield multiple IRRs.</p>
      </div>
    </CalculatorShell>
  );
}
