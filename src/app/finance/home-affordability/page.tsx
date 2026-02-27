"use client";

import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

const ic =
  "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

const usd = (n: number) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

function calcMonthlyPayment(
  principal: number,
  annualRate: number,
  termYears: number
): number {
  if (principal <= 0 || annualRate <= 0 || termYears <= 0) return 0;
  const r = annualRate / 100 / 12;
  const n = termYears * 12;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

// Given a target monthly P&I payment, solve for max loan principal
function maxLoanFromPayment(
  targetPI: number,
  annualRate: number,
  termYears: number
): number {
  if (targetPI <= 0 || annualRate <= 0 || termYears <= 0) return 0;
  const r = annualRate / 100 / 12;
  const n = termYears * 12;
  return (targetPI * (Math.pow(1 + r, n) - 1)) / (r * Math.pow(1 + r, n));
}

export default function HomeAffordabilityPage() {
  const [v, setV] = useHashState({
    income: "90000",
    debts: "500",
    downPayment: "40000",
    rate: "6.5",
    term: "30",
    taxRate: "1.2",
    insurance: "1200",
    hoa: "0",
  });

  const annualIncome = parseFloat(v.income) || 0;
  const monthlyDebts = parseFloat(v.debts) || 0;
  const downPayment = parseFloat(v.downPayment) || 0;
  const rate = parseFloat(v.rate) || 0;
  const termYears = parseInt(v.term) || 30;
  const taxRate = parseFloat(v.taxRate) || 0; // annual % of home value
  const annualInsurance = parseFloat(v.insurance) || 0;
  const monthlyHOA = parseFloat(v.hoa) || 0;

  const valid = annualIncome > 0 && rate > 0 && termYears > 0;

  const grossMonthlyIncome = annualIncome / 12;

  // 28% rule: max total housing payment (PITI)
  const maxHousing28 = grossMonthlyIncome * 0.28;
  // 36% rule: max total debt including housing
  const maxTotalDebt36 = grossMonthlyIncome * 0.36;
  // Max housing under 36% rule = max total - existing debts
  const maxHousing36 = Math.max(0, maxTotalDebt36 - monthlyDebts);

  // Effective max housing = min of both rules
  const effectiveMaxHousing = Math.min(maxHousing28, maxHousing36);

  // Monthly fixed costs: tax + insurance + HOA
  // Tax and insurance depend on home value — iterative solve
  // Approximate: start with a first guess, then iterate
  function solveMaxHomePrice(maxPITI: number): number {
    if (maxPITI <= 0) return 0;
    const monthlyInsurance = annualInsurance / 12;
    // PI budget = maxPITI - insurance - hoa - (estimated tax)
    // tax monthly = homeValue * taxRate/100 / 12
    // homeValue = loanPrincipal + downPayment = maxLoanFromPayment(PI) + downPayment
    // Iterative:
    let homePrice = 300000; // initial guess
    for (let i = 0; i < 20; i++) {
      const monthlyTax = (homePrice * taxRate) / 100 / 12;
      const piBudget = maxPITI - monthlyInsurance - monthlyHOA - monthlyTax;
      if (piBudget <= 0) {
        homePrice = homePrice * 0.9;
        continue;
      }
      const maxLoan = maxLoanFromPayment(piBudget, rate, termYears);
      homePrice = maxLoan + downPayment;
    }
    return Math.max(0, homePrice);
  }

  const maxHomePrice28 = valid ? solveMaxHomePrice(maxHousing28) : 0;
  const maxHomePrice36 = valid ? solveMaxHomePrice(maxHousing36) : 0;
  const maxHomePrice = Math.min(maxHomePrice28, maxHomePrice36);

  // PITI breakdown for the recommended max home price
  const loanAmount = Math.max(0, maxHomePrice - downPayment);
  const monthlyPI = valid ? calcMonthlyPayment(loanAmount, rate, termYears) : 0;
  const monthlyTax = (maxHomePrice * taxRate) / 100 / 12;
  const monthlyInsurance = annualInsurance / 12;
  const totalMonthly = monthlyPI + monthlyTax + monthlyInsurance + monthlyHOA;

  const limitingRule =
    maxHomePrice36 < maxHomePrice28 && maxHousing36 < maxHousing28
      ? "36% debt-to-income rule (existing debts)"
      : "28% housing-to-income rule";

  return (
    <CalculatorShell
      title="Home Affordability Calculator"
      description="Estimate the maximum home price you can afford using the 28/36 rule."
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-muted mb-1">
              Annual Income ($)
            </label>
            <input
              type="number"
              value={v.income}
              onChange={(e) => setV({ income: e.target.value })}
              className={ic}
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">
              Monthly Debts ($)
            </label>
            <input
              type="number"
              value={v.debts}
              onChange={(e) => setV({ debts: e.target.value })}
              className={ic}
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">
              Down Payment ($)
            </label>
            <input
              type="number"
              value={v.downPayment}
              onChange={(e) => setV({ downPayment: e.target.value })}
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
            />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">
              Property Tax Rate (%/yr)
            </label>
            <input
              type="number"
              value={v.taxRate}
              onChange={(e) => setV({ taxRate: e.target.value })}
              step="0.1"
              className={ic}
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">
              Home Insurance ($/yr)
            </label>
            <input
              type="number"
              value={v.insurance}
              onChange={(e) => setV({ insurance: e.target.value })}
              className={ic}
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">
              HOA ($/month)
            </label>
            <input
              type="number"
              value={v.hoa}
              onChange={(e) => setV({ hoa: e.target.value })}
              className={ic}
              min="0"
            />
          </div>
        </div>

        {valid && (
          <div className="space-y-4">
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="block text-sm text-muted">
                Max Affordable Home Price
              </span>
              <span className="block font-mono font-bold text-3xl text-primary">
                {usd(maxHomePrice)}
              </span>
              <span className="block text-xs text-muted mt-1">
                Limited by {limitingRule}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="px-3 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">
                  28% Rule Max
                </span>
                <span className="font-mono font-semibold">
                  {usd(maxHomePrice28)}
                </span>
              </div>
              <div className="px-3 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">
                  36% Rule Max
                </span>
                <span className="font-mono font-semibold">
                  {usd(maxHomePrice36)}
                </span>
              </div>
            </div>

            {/* PITI Breakdown */}
            <div className="bg-background border border-card-border rounded-xl p-4">
              <h3 className="text-sm font-semibold mb-3">
                Monthly PITI Breakdown
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Principal &amp; Interest</span>
                  <span className="font-mono font-medium">{usd(monthlyPI)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Property Taxes</span>
                  <span className="font-mono font-medium">{usd(monthlyTax)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Homeowners Insurance</span>
                  <span className="font-mono font-medium">
                    {usd(monthlyInsurance)}
                  </span>
                </div>
                {monthlyHOA > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted">HOA</span>
                    <span className="font-mono font-medium">{usd(monthlyHOA)}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-card-border pt-2 font-semibold">
                  <span>Total Monthly</span>
                  <span className="font-mono">{usd(totalMonthly)}</span>
                </div>
                <div className="flex justify-between text-xs text-muted">
                  <span>% of Gross Monthly Income</span>
                  <span className="font-mono">
                    {grossMonthlyIncome > 0
                      ? ((totalMonthly / grossMonthlyIncome) * 100).toFixed(1)
                      : "0"}
                    %
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs text-muted text-center">
              Based on 28/36 debt-to-income rule. Does not include PMI or other costs.
            </p>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
