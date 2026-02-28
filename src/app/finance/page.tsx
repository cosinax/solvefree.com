import { PageShell } from "@/components/PageShell";
import { SearchableGrid } from "@/components/SearchableGrid";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Finance Calculators",
  description:
    "Free financial calculators: mortgage, compound interest, investment simulator, loan, savings, retirement, and more.",
  openGraph: {
    type: "website",
    siteName: "SolveFree",
    title: "Finance Calculators — SolveFree",
    description: "Free finance calculators for mortgage, compound interest, loans, retirement, and more.",
    url: "https://solvefree.com/finance",
  },
  alternates: { canonical: "https://solvefree.com/finance" },
};

const calculators = [
  {
    title: "Mortgage Calculator",
    description: "Monthly payments, total interest, and amortization schedule",
    href: "/finance/mortgage",
    icon: "home",
  },
  {
    title: "Simple Interest",
    description: "Calculate simple interest on a principal amount",
    href: "/finance/simple-interest",
    icon: "dollar",
  },
  {
    title: "Compound Interest",
    description: "See how your money grows with compound interest",
    href: "/finance/compound-interest",
    icon: "trending-up",
  },
  {
    title: "Investment Simulator",
    description: "Model portfolio growth with regular contributions",
    href: "/finance/investment-simulator",
    icon: "trending-up",
  },
  {
    title: "Loan Calculator",
    description: "Calculate loan payments and total cost of borrowing",
    href: "/finance/loan",
    icon: "landmark",
  },
  {
    title: "Auto Loan Calculator",
    description: "Calculate monthly car payments and total cost",
    href: "/finance/auto-loan",
    icon: "car",
  },
  {
    title: "Savings Goal",
    description: "How much to save each month to reach your goal",
    href: "/finance/savings-goal",
    icon: "target",
  },
  {
    title: "Retirement Calculator",
    description: "Estimate how much you need for retirement",
    href: "/finance/retirement",
    icon: "mountain",
  },
  {
    title: "Tip Calculator",
    description: "Calculate tip and split bills among friends",
    href: "/finance/tip",
    icon: "utensils",
  },
  {
    title: "Discount Calculator",
    description: "Calculate sale prices and savings",
    href: "/finance/discount",
    icon: "tag",
  },
  {
    title: "Currency Converter",
    description: "Convert between world currencies (offline rates)",
    href: "/finance/currency",
    icon: "trending-up",
  },
  {
    title: "Inflation Calculator",
    description: "See how inflation affects purchasing power over time",
    href: "/finance/inflation",
    icon: "bar-chart",
  },
  {
    title: "Net Worth Calculator",
    description: "Track your assets and liabilities",
    href: "/finance/net-worth",
    icon: "gem",
  },
  {
    title: "Debt Payoff Calculator",
    description: "Plan your debt repayment strategy",
    href: "/finance/debt-payoff",
    icon: "clipboard",
  },
  { title: "ROI Calculator", description: "Return on investment, gain/loss, and CAGR", href: "/finance/roi", icon: "star" },
  { title: "Break-Even Calculator", description: "Units needed to cover your fixed costs", href: "/finance/break-even", icon: "scale" },
  { title: "Rule of 72", description: "How long to double your money", href: "/finance/rule-of-72", icon: "hourglass" },
  { title: "Payback Period", description: "How long until an investment pays for itself", href: "/finance/payback-period", icon: "timer" },
  { title: "VAT / Sales Tax", description: "Calculate tax amounts ex/incl. VAT", href: "/finance/vat", icon: "receipt" },
  { title: "Salary Calculator", description: "Convert pay between hourly, weekly, monthly, and annual", href: "/finance/salary", icon: "wallet" },
  { title: "Pay Raise Calculator", description: "See your new salary and per-period difference after a raise", href: "/finance/pay-raise", icon: "rocket" },
  { title: "Overtime Calculator", description: "Regular pay, overtime pay, and effective hourly rate", href: "/finance/overtime", icon: "alarm-clock" },
  { title: "CAGR Calculator", description: "Compound Annual Growth Rate and year-by-year projection", href: "/finance/cagr", icon: "trending-down" },
  { title: "Future Value Calculator", description: "Grow a lump sum or regular contributions over time", href: "/finance/future-value", icon: "circle-dot" },
  { title: "Present Value Calculator", description: "Discount future cash flows or annuities to today's value", href: "/finance/present-value", icon: "fast-forward" },
  { title: "NPV Calculator", description: "Net Present Value and IRR for investment cash flows", href: "/finance/npv", icon: "calculator" },
  { title: "IRR Calculator", description: "Internal Rate of Return with cumulative cash flow table", href: "/finance/irr", icon: "ruler" },
  { title: "Gross Margin Calculator", description: "Selling price, gross profit, margin %, and markup %", href: "/finance/margin", icon: "tag" },
  { title: "Amortization Calculator", description: "Full amortization schedule with monthly payment breakdown", href: "/finance/amortization", icon: "calendar" },
  { title: "APY Calculator", description: "Convert APR to APY across compounding frequencies", href: "/finance/apy", icon: "banknote" },
  { title: "Rent Affordability", description: "Max rent based on income using the 28%, 30%, and 36% rules", href: "/finance/rent-affordability", icon: "building-2" },
  { title: "Stock Average Calculator", description: "Average cost per share across multiple purchase lots", href: "/finance/stock-average", icon: "dollar" },
  { title: "Markup Calculator", description: "Markup %, profit margin, and target price from cost", href: "/finance/markup", icon: "banknote" },
  { title: "Sales Tax Calculator", description: "Add or remove sales tax with quick-reference rate table", href: "/finance/sales-tax", icon: "coins" },
  { title: "WACC Calculator", description: "Weighted Average Cost of Capital with formula breakdown", href: "/finance/wacc", icon: "link" },
  { title: "401(k) Savings Calculator", description: "Project your 401(k) balance at retirement including employer matching", href: "/finance/401k-calculator", icon: "wallet" },
  { title: "Roth IRA Calculator", description: "Project your Roth IRA balance with tax-free growth", href: "/finance/roth-ira", icon: "trending-up" },
  { title: "CD Calculator", description: "Calculate earnings on a Certificate of Deposit", href: "/finance/cd-calculator", icon: "landmark" },
  { title: "CD Ladder Calculator", description: "Plan a staggered CD strategy for regular liquidity", href: "/finance/cd-ladder", icon: "stairs" },
  { title: "Mortgage Refinance", description: "Compare refinancing options and find your break-even point", href: "/finance/mortgage-refinance", icon: "home" },
  { title: "Home Affordability", description: "Estimate the max home price you can afford using 28/36 rule", href: "/finance/home-affordability", icon: "home" },
  { title: "Home Equity Calculator", description: "See how your home equity grows over time", href: "/finance/home-equity", icon: "hard-hat" },
  { title: "HELOC Calculator", description: "Calculate your HELOC line, draw-period payments, and repayment schedule", href: "/finance/heloc", icon: "home" },
  { title: "Cost of Living Calculator", description: "Compare cost of living between US cities and find equivalent salary", href: "/finance/cost-of-living", icon: "globe" },
  { title: "Credit Card Payoff", description: "See how long to pay off your credit card and total interest paid", href: "/finance/credit-card-payoff", icon: "credit-card" },
  { title: "Balance Transfer Calculator", description: "Compare your current card vs a low-APR transfer offer", href: "/finance/balance-transfer", icon: "arrow-left-right" },
  { title: "Credit Utilization Calculator", description: "Track per-card and overall utilization — keep under 30%", href: "/finance/credit-utilization", icon: "bar-chart" },
  { title: "Student Loan Calculator", description: "Estimate monthly payments and total interest across repayment plans", href: "/finance/student-loan", icon: "graduation-cap" },
  { title: "Business Loan Calculator", description: "Monthly payments, total interest, and amortization for business loans", href: "/finance/business-loan", icon: "building-2" },
];

export default function FinancePage() {
  return (
    <PageShell
      title="Finance Calculators"
      description="Mortgage, loans, interest, investments, retirement, and more"
    >
      <SearchableGrid items={calculators} placeholder="Search finance calculators..." />
    </PageShell>
  );
}
