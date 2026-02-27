"use client";

import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

const ic =
  "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

const usd = (n: number) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });

function calcMonthlyPayment(principal: number, annualRate: number, termMonths: number): number {
  if (annualRate === 0) return principal / termMonths;
  const r = annualRate / 100 / 12;
  const n = termMonths;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

function totalInterest(payment: number, months: number, principal: number): number {
  return payment * months - principal;
}

export default function MortgageRefinancePage() {
  const [v, setV] = useHashState({
    balance: "250000",
    currentPayment: "1800",
    newRate: "5.5",
    newTerm: "30",
    closingCosts: "4000",
  });

  const balance = parseFloat(v.balance) || 0;
  const currentPayment = parseFloat(v.currentPayment) || 0;
  const newRate = parseFloat(v.newRate) || 0;
  const newTermYears = parseInt(v.newTerm) || 30;
  const closingCosts = parseFloat(v.closingCosts) || 0;

  const valid = balance > 0 && currentPayment > 0 && newRate > 0 && newTermYears > 0;

  const newTermMonths = newTermYears * 12;
  const newPayment = valid ? calcMonthlyPayment(balance, newRate, newTermMonths) : 0;
  const monthlySavings = currentPayment - newPayment;

  // Break-even: how many months until closing costs are recouped
  const breakEvenMonths =
    monthlySavings > 0 ? Math.ceil(closingCosts / monthlySavings) : null;

  // We don't know the old term/rate precisely, but we can estimate
  // total remaining interest for old vs new loan
  // Old: remaining payments = currentPayment × unknown months. We compute
  // total cost old = remaining months of old payments. Since we don't have
  // old term, we estimate remaining months using current balance + current payment.
  // Approximation: assume old rate not known, so use payment stream.
  // A simpler, user-friendly approach: compare total paid from now.
  // Old: user keeps paying currentPayment. We need to figure out how many months left.
  // Reverse-solve: this is optional because we don't have old rate.
  // Use a conservative approach — show new total interest vs just (payment * newTermMonths) - balance.
  const newTotalInterest = valid ? totalInterest(newPayment, newTermMonths, balance) : 0;

  // Estimate remaining months on old loan (solve for n in: P = payment*(1 - (1+r_old)^-n)/r_old)
  // Since we don't have old rate, we cannot compute this exactly without it.
  // Show new loan metrics only plus monthly savings comparison.

  const lifetimeSavings =
    monthlySavings > 0 && newTermMonths > 0
      ? monthlySavings * newTermMonths - closingCosts
      : null;

  return (
    <CalculatorShell
      title="Mortgage Refinance Calculator"
      description="Compare your current mortgage with a refinance option and find your break-even point."
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-muted mb-1">
              Current Loan Balance ($)
            </label>
            <input
              type="number"
              value={v.balance}
              onChange={(e) => setV({ balance: e.target.value })}
              className={ic}
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">
              Current Monthly Payment ($)
            </label>
            <input
              type="number"
              value={v.currentPayment}
              onChange={(e) => setV({ currentPayment: e.target.value })}
              className={ic}
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">
              New Interest Rate (%)
            </label>
            <input
              type="number"
              value={v.newRate}
              onChange={(e) => setV({ newRate: e.target.value })}
              step="0.05"
              className={ic}
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">
              New Loan Term (years)
            </label>
            <input
              type="number"
              value={v.newTerm}
              onChange={(e) => setV({ newTerm: e.target.value })}
              className={ic}
              min="1"
              max="30"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm text-muted mb-1">
              Closing Costs ($)
            </label>
            <input
              type="number"
              value={v.closingCosts}
              onChange={(e) => setV({ closingCosts: e.target.value })}
              className={ic}
              min="0"
            />
          </div>
        </div>

        {valid && (
          <div className="space-y-4">
            {/* New monthly payment */}
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="block text-sm text-muted">
                New Monthly Payment
              </span>
              <span className="block font-mono font-bold text-3xl text-primary">
                {usd(newPayment)}
              </span>
            </div>

            {/* Summary grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="px-3 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">
                  Monthly Savings
                </span>
                <span
                  className={`font-mono font-semibold ${monthlySavings >= 0 ? "text-green-600" : "text-red-500"}`}
                >
                  {monthlySavings >= 0 ? "+" : ""}
                  {usd(monthlySavings)}
                </span>
              </div>
              <div className="px-3 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">New Total Interest</span>
                <span className="font-mono font-semibold">
                  {usd(newTotalInterest)}
                </span>
              </div>
            </div>

            {/* Break-even callout */}
            <div
              className={`rounded-xl p-4 border ${
                breakEvenMonths !== null && breakEvenMonths > 0
                  ? "bg-card border-card-border"
                  : "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800"
              }`}
            >
              {monthlySavings > 0 && breakEvenMonths !== null ? (
                <>
                  <div className="text-sm text-muted mb-1">Break-Even Point</div>
                  <div className="text-2xl font-bold font-mono">
                    {breakEvenMonths} month{breakEvenMonths !== 1 ? "s" : ""}
                  </div>
                  <div className="text-xs text-muted mt-1">
                    {breakEvenMonths < 12
                      ? `Less than a year to recoup ${usd(closingCosts)} in closing costs`
                      : `${(breakEvenMonths / 12).toFixed(1)} years to recoup closing costs`}
                  </div>
                </>
              ) : monthlySavings <= 0 ? (
                <>
                  <div className="text-sm font-semibold text-red-600">
                    No monthly savings
                  </div>
                  <div className="text-xs text-muted mt-1">
                    The new payment is higher than your current payment. Refinancing may not be beneficial at this rate and term.
                  </div>
                </>
              ) : (
                <>
                  <div className="text-sm font-semibold">No closing costs</div>
                  <div className="text-xs text-muted mt-1">
                    You start saving immediately.
                  </div>
                </>
              )}
            </div>

            {/* Lifetime savings */}
            {lifetimeSavings !== null && (
              <div className="px-3 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">
                  Lifetime Savings (after closing costs)
                </span>
                <span
                  className={`font-mono font-semibold text-lg ${lifetimeSavings >= 0 ? "text-green-600" : "text-red-500"}`}
                >
                  {lifetimeSavings >= 0 ? "+" : ""}
                  {usd(lifetimeSavings)}
                </span>
                <span className="block text-xs text-muted mt-0.5">
                  over the new {newTermYears}-year term
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
