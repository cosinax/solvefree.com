"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

function fmt(n: number): string {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export default function AmortizationPage() {
  const [v, setV] = useHashState({
    loan: "300000",
    rate: "6.5",
    years: "30",
    startMonth: "1",
    startYear: "2025",
  });
  const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
  const sc = "w-full px-3 py-2.5 bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

  const loan  = parseFloat(v.loan);
  const rate  = parseFloat(v.rate) / 100 / 12;
  const n     = parseInt(v.years) * 12;
  const valid = loan > 0 && rate > 0 && n > 0 && n <= 360;

  const monthlyPayment = valid
    ? (loan * rate * Math.pow(1 + rate, n)) / (Math.pow(1 + rate, n) - 1)
    : 0;
  const totalPaid    = monthlyPayment * n;
  const totalInterest = totalPaid - loan;

  // Build schedule
  const schedule: { month: number; payment: number; principal: number; interest: number; balance: number; label: string }[] = [];
  if (valid) {
    let balance = loan;
    const sMonth = parseInt(v.startMonth) - 1; // 0-based
    const sYear  = parseInt(v.startYear);
    for (let m = 1; m <= n; m++) {
      const interestPart   = balance * rate;
      const principalPart  = monthlyPayment - interestPart;
      balance             -= principalPart;
      const moIdx = (sMonth + m - 1) % 12;
      const yr    = sYear + Math.floor((sMonth + m - 1) / 12);
      schedule.push({
        month: m,
        payment: monthlyPayment,
        principal: principalPart,
        interest: interestPart,
        balance: Math.max(balance, 0),
        label: `${MONTHS[moIdx]} ${yr}`,
      });
    }
  }

  const lastRow  = schedule.length > 0 ? schedule[schedule.length - 1] : null;
  const payoffDate = lastRow ? lastRow.label : "";

  return (
    <CalculatorShell title="Amortization Calculator" description="Calculate monthly payments and see the full amortization schedule.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-muted mb-1">Loan Amount ($)</label>
            <input type="number" value={v.loan} onChange={e => setV({ loan: e.target.value })} className={ic} min="0" />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Annual Interest Rate (%)</label>
            <input type="number" value={v.rate} onChange={e => setV({ rate: e.target.value })} className={ic} step="0.05" />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Loan Term (years)</label>
            <input type="number" value={v.years} onChange={e => setV({ years: e.target.value })} className={ic} min="1" max="30" />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Start Month</label>
            <select value={v.startMonth} onChange={e => setV({ startMonth: e.target.value })} className={sc}>
              {MONTHS.map((m, i) => <option key={i} value={String(i + 1)}>{m}</option>)}
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-sm text-muted mb-1">Start Year</label>
            <input type="number" value={v.startYear} onChange={e => setV({ startYear: e.target.value })} className={ic} min="2000" max="2100" />
          </div>
        </div>

        {valid && (
          <div className="space-y-3">
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="block text-sm text-muted">Monthly Payment</span>
              <span className="block font-mono font-bold text-4xl text-primary">${fmt(monthlyPayment)}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Total Paid",      value: `$${fmt(totalPaid)}` },
                { label: "Total Interest",  value: `$${fmt(totalInterest)}` },
                { label: "Interest / Principal", value: `${((totalInterest / loan) * 100).toFixed(1)}%` },
                { label: "Payoff Date",     value: payoffDate },
              ].map(r => (
                <div key={r.label} className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
                  <span className="text-muted">{r.label}</span>
                  <span className="font-semibold">{r.value}</span>
                </div>
              ))}
            </div>

            <div className="max-h-64 overflow-y-auto rounded-lg border border-card-border">
              <table className="w-full text-xs font-mono">
                <thead className="bg-card sticky top-0">
                  <tr>
                    <th className="px-2 py-2 text-left text-muted">Month</th>
                    <th className="px-2 py-2 text-right text-muted">Payment</th>
                    <th className="px-2 py-2 text-right text-muted">Principal</th>
                    <th className="px-2 py-2 text-right text-muted">Interest</th>
                    <th className="px-2 py-2 text-right text-muted">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {schedule.map(row => (
                    <tr key={row.month} className="border-t border-card-border">
                      <td className="px-2 py-1.5 whitespace-nowrap">{row.label}</td>
                      <td className="px-2 py-1.5 text-right">${fmt(row.payment)}</td>
                      <td className="px-2 py-1.5 text-right text-success">${fmt(row.principal)}</td>
                      <td className="px-2 py-1.5 text-right text-danger">${fmt(row.interest)}</td>
                      <td className="px-2 py-1.5 text-right">${fmt(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
