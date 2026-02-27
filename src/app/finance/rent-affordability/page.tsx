"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

function fmt(n: number): string {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function RentAffordabilityPage() {
  const [v, setV] = useHashState({
    mode: "income",
    income: "5000",
    debt: "300",
    desiredRent: "1500",
  });
  const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
  const sc = "w-full px-3 py-2.5 bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

  const income       = parseFloat(v.income);
  const debt         = parseFloat(v.debt);
  const desiredRent  = parseFloat(v.desiredRent);

  const isForward = v.mode === "income";

  // Forward: income → max rent
  const maxRent28    = income > 0 ? income * 0.28 : 0;
  const maxRent30    = income > 0 ? income * 0.30 : 0;
  const maxDebt36    = income > 0 ? income * 0.36 : 0;
  const maxRentDebt  = income > 0 ? Math.max(0, maxDebt36 - debt) : 0;
  const disposable28 = income > 0 ? income - maxRent28 - debt : 0;
  const disposable30 = income > 0 ? income - maxRent30 - debt : 0;

  // Reverse: desired rent → required income
  const reqIncome28 = desiredRent > 0 ? desiredRent / 0.28 : 0;
  const reqIncome30 = desiredRent > 0 ? desiredRent / 0.30 : 0;
  const reqIncome36 = desiredRent > 0 && debt >= 0 ? (desiredRent + debt) / 0.36 : 0;

  const fwdValid = isForward && income > 0;
  const revValid = !isForward && desiredRent > 0;

  return (
    <CalculatorShell title="Rent Affordability Calculator" description="Find your maximum affordable rent using common budgeting rules.">
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-muted mb-1">Mode</label>
          <select value={v.mode} onChange={e => setV({ mode: e.target.value })} className={sc}>
            <option value="income">From income → max rent</option>
            <option value="rent">From desired rent → required income</option>
          </select>
        </div>

        {isForward ? (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-muted mb-1">Monthly Gross Income ($)</label>
              <input type="number" value={v.income} onChange={e => setV({ income: e.target.value })} className={ic} min="0" />
            </div>
            <div>
              <label className="block text-sm text-muted mb-1">Existing Monthly Debt ($)</label>
              <input type="number" value={v.debt} onChange={e => setV({ debt: e.target.value })} className={ic} min="0" />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-muted mb-1">Desired Monthly Rent ($)</label>
              <input type="number" value={v.desiredRent} onChange={e => setV({ desiredRent: e.target.value })} className={ic} min="0" />
            </div>
            <div>
              <label className="block text-sm text-muted mb-1">Other Monthly Debt ($)</label>
              <input type="number" value={v.debt} onChange={e => setV({ debt: e.target.value })} className={ic} min="0" />
            </div>
          </div>
        )}

        {fwdValid && (
          <div className="space-y-3">
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="block text-sm text-muted">Max Rent (28% Rule)</span>
              <span className="block font-mono font-bold text-4xl text-primary">${fmt(maxRent28)}</span>
            </div>
            <div className="space-y-2">
              {[
                { label: "Max Rent — 28% rule",          value: `$${fmt(maxRent28)}` },
                { label: "Max Rent — 30% rule",          value: `$${fmt(maxRent30)}` },
                { label: "Max Total Debt — 36% rule",    value: `$${fmt(maxDebt36)}` },
                { label: "Max Rent w/ existing debt",    value: `$${fmt(maxRentDebt)}` },
                { label: "Disposable after rent (28%)",  value: `$${fmt(disposable28)}` },
                { label: "Disposable after rent (30%)",  value: `$${fmt(disposable30)}` },
              ].map(r => (
                <div key={r.label} className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
                  <span className="text-muted">{r.label}</span>
                  <span className="font-semibold">{r.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {revValid && (
          <div className="space-y-3">
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="block text-sm text-muted">Required Income (28% Rule)</span>
              <span className="block font-mono font-bold text-4xl text-primary">${fmt(reqIncome28)}</span>
            </div>
            <div className="space-y-2">
              {[
                { label: "Required Income (28% rule)", value: `$${fmt(reqIncome28)}` },
                { label: "Required Income (30% rule)", value: `$${fmt(reqIncome30)}` },
                { label: "Required Income (36% rule, incl. debt)", value: `$${fmt(reqIncome36)}` },
              ].map(r => (
                <div key={r.label} className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
                  <span className="text-muted">{r.label}</span>
                  <span className="font-semibold">{r.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        <p className="text-xs text-muted">Rules: 28% of gross for housing; 30% rule (common guideline); 36% for all debt combined.</p>
      </div>
    </CalculatorShell>
  );
}
