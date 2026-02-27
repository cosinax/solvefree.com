"use client";

import { useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

const ic =
  "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
const sc =
  "w-full px-3 py-2 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm";

const usd = (n: number) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });

type RepaymentPlan = "standard" | "graduated" | "extended";

function calcStandardPayment(
  principal: number,
  annualRate: number,
  termYears: number
): number {
  if (principal <= 0 || annualRate <= 0 || termYears <= 0) return 0;
  const r = annualRate / 100 / 12;
  const n = termYears * 12;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

interface YearSummary {
  year: number;
  principalPaid: number;
  interestPaid: number;
  remainingBalance: number;
}

interface LoanResult {
  firstPayment: number;
  lastPayment: number;
  totalPaid: number;
  totalInterest: number;
  yearRows: YearSummary[];
}

function calcLoan(
  principal: number,
  annualRate: number,
  termYears: number,
  plan: RepaymentPlan
): LoanResult | null {
  if (principal <= 0 || annualRate < 0 || termYears <= 0) return null;

  const r = annualRate / 100 / 12;
  const totalMonths = termYears * 12;

  // Build monthly payment schedule
  const payments: number[] = [];

  if (plan === "standard" || plan === "extended") {
    const payment = calcStandardPayment(principal, annualRate, termYears);
    for (let i = 0; i < totalMonths; i++) {
      payments.push(payment);
    }
  } else {
    // Graduated: payments increase every 24 months, ~10% growth each period
    // Iteratively solve for a starting payment such that the loan is fully paid
    const stdPayment = calcStandardPayment(principal, annualRate, termYears);
    let lo = stdPayment * 0.3;
    let hi = stdPayment * 0.9;
    let startPayment = stdPayment * 0.6;

    for (let iter = 0; iter < 60; iter++) {
      startPayment = (lo + hi) / 2;
      let bal = principal;
      for (let m = 0; m < totalMonths; m++) {
        const period = Math.floor(m / 24);
        const pmt = startPayment * Math.pow(1.1, period);
        const intPmt = bal * r;
        const prinPmt = pmt - intPmt;
        bal -= prinPmt;
      }
      if (bal > 0.01) lo = startPayment;
      else hi = startPayment;
    }

    for (let m = 0; m < totalMonths; m++) {
      const period = Math.floor(m / 24);
      payments.push(startPayment * Math.pow(1.1, period));
    }
  }

  // Amortize
  let balance = principal;
  let totalPaid = 0;
  const yearRows: YearSummary[] = [];
  let yearPrincipal = 0;
  let yearInterest = 0;

  for (let m = 0; m < totalMonths; m++) {
    const intPmt = balance * r;
    let payment = payments[m];
    // Adjust final payment to clear exactly
    if (m === totalMonths - 1) {
      payment = balance + intPmt;
    }
    const prinPmt = payment - intPmt;
    balance = Math.max(0, balance - prinPmt);
    totalPaid += payment;
    yearPrincipal += prinPmt;
    yearInterest += intPmt;

    if ((m + 1) % 12 === 0 || m === totalMonths - 1) {
      yearRows.push({
        year: Math.ceil((m + 1) / 12),
        principalPaid: yearPrincipal,
        interestPaid: yearInterest,
        remainingBalance: balance,
      });
      yearPrincipal = 0;
      yearInterest = 0;
    }
  }

  return {
    firstPayment: payments[0],
    lastPayment: payments[totalMonths - 1],
    totalPaid,
    totalInterest: totalPaid - principal,
    yearRows,
  };
}

export default function StudentLoanPage() {
  const [v, setV] = useHashState({
    principal: "30000",
    rate: "6.5",
    term: "10",
    plan: "standard",
  });
  const [showTable, setShowTable] = useState(false);

  const principal = parseFloat(v.principal) || 0;
  const rate = parseFloat(v.rate) || 0;
  const termYears = parseInt(v.term) || 10;
  const plan = v.plan as RepaymentPlan;

  const effectiveTerm =
    plan === "extended" ? 25 : Math.min(termYears, 30);

  const result = calcLoan(principal, rate, effectiveTerm, plan);
  const valid = result !== null;

  return (
    <CalculatorShell
      title="Student Loan Calculator"
      description="Estimate monthly payments and total interest for student loans across repayment plans."
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-muted mb-1">
              Loan Amount ($)
            </label>
            <input
              type="number"
              value={v.principal}
              onChange={(e) => setV({ principal: e.target.value })}
              className={ic}
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">
              Interest Rate (%)
            </label>
            <input
              type="number"
              value={v.rate}
              onChange={(e) => setV({ rate: e.target.value })}
              step="0.05"
              className={ic}
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">
              Loan Term (years)
            </label>
            <input
              type="number"
              value={v.term}
              onChange={(e) => setV({ term: e.target.value })}
              className={ic}
              min="1"
              max="30"
              disabled={plan === "extended"}
            />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">
              Repayment Plan
            </label>
            <select
              value={v.plan}
              onChange={(e) => setV({ plan: e.target.value })}
              className={sc}
            >
              <option value="standard">Standard (equal payments)</option>
              <option value="graduated">Graduated (increases every 2 yrs)</option>
              <option value="extended">Extended (25-year term)</option>
            </select>
          </div>
        </div>

        {plan === "extended" && (
          <div className="text-xs text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400 rounded-lg px-3 py-2">
            Extended plan uses a fixed 25-year term. Loan term input is ignored.
          </div>
        )}

        {valid && result && (
          <div className="space-y-4">
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="block text-sm text-muted">
                {plan === "graduated" ? "Starting " : ""}Monthly Payment
              </span>
              <span className="block font-mono font-bold text-3xl text-primary">
                {usd(result.firstPayment)}
              </span>
              {plan === "graduated" && (
                <span className="block text-sm text-muted mt-1">
                  Final payment: {usd(result.lastPayment)}
                </span>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="px-3 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">Total Paid</span>
                <span className="font-mono font-semibold text-sm">
                  {usd(result.totalPaid)}
                </span>
              </div>
              <div className="px-3 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">Total Interest</span>
                <span className="font-mono font-semibold text-sm">
                  {usd(result.totalInterest)}
                </span>
              </div>
              <div className="px-3 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">
                  Interest / Principal
                </span>
                <span className="font-mono font-semibold text-sm">
                  {principal > 0
                    ? ((result.totalInterest / principal) * 100).toFixed(1)
                    : "0"}
                  %
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowTable(!showTable)}
              className="w-full text-sm text-primary font-medium py-2 hover:underline"
            >
              {showTable ? "Hide" : "Show"} Year-by-Year Amortization
            </button>

            {showTable && (
              <div className="max-h-80 overflow-y-auto rounded-lg border border-card-border">
                <table className="w-full text-xs font-mono">
                  <thead className="bg-card sticky top-0">
                    <tr>
                      <th className="px-2 py-2 text-left text-muted">Year</th>
                      <th className="px-2 py-2 text-right text-muted">
                        Principal
                      </th>
                      <th className="px-2 py-2 text-right text-muted">
                        Interest
                      </th>
                      <th className="px-2 py-2 text-right text-muted">
                        Balance
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.yearRows.map((row) => (
                      <tr
                        key={row.year}
                        className="border-t border-card-border"
                      >
                        <td className="px-2 py-1.5">{row.year}</td>
                        <td className="px-2 py-1.5 text-right">
                          {usd(row.principalPaid)}
                        </td>
                        <td className="px-2 py-1.5 text-right">
                          {usd(row.interestPaid)}
                        </td>
                        <td className="px-2 py-1.5 text-right">
                          {usd(row.remainingBalance)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
