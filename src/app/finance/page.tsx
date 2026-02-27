import { PageShell } from "@/components/PageShell";
import { SearchableGrid } from "@/components/SearchableGrid";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Finance Calculators",
  description:
    "Free financial calculators: mortgage, compound interest, investment simulator, loan, savings, retirement, and more.",
};

const calculators = [
  {
    title: "Mortgage Calculator",
    description: "Monthly payments, total interest, and amortization schedule",
    href: "/finance/mortgage",
    icon: "🏠",
  },
  {
    title: "Simple Interest",
    description: "Calculate simple interest on a principal amount",
    href: "/finance/simple-interest",
    icon: "💵",
  },
  {
    title: "Compound Interest",
    description: "See how your money grows with compound interest",
    href: "/finance/compound-interest",
    icon: "📈",
  },
  {
    title: "Investment Simulator",
    description: "Model portfolio growth with regular contributions",
    href: "/finance/investment-simulator",
    icon: "💹",
  },
  {
    title: "Loan Calculator",
    description: "Calculate loan payments and total cost of borrowing",
    href: "/finance/loan",
    icon: "🏦",
  },
  {
    title: "Auto Loan Calculator",
    description: "Calculate monthly car payments and total cost",
    href: "/finance/auto-loan",
    icon: "🚗",
  },
  {
    title: "Savings Goal",
    description: "How much to save each month to reach your goal",
    href: "/finance/savings-goal",
    icon: "🎯",
  },
  {
    title: "Retirement Calculator",
    description: "Estimate how much you need for retirement",
    href: "/finance/retirement",
    icon: "🏖️",
  },
  {
    title: "Tip Calculator",
    description: "Calculate tip and split bills among friends",
    href: "/finance/tip",
    icon: "🍽️",
  },
  {
    title: "Discount Calculator",
    description: "Calculate sale prices and savings",
    href: "/finance/discount",
    icon: "🏷️",
  },
  {
    title: "Currency Converter",
    description: "Convert between world currencies (offline rates)",
    href: "/finance/currency",
    icon: "💱",
  },
  {
    title: "Inflation Calculator",
    description: "See how inflation affects purchasing power over time",
    href: "/finance/inflation",
    icon: "📊",
  },
  {
    title: "Net Worth Calculator",
    description: "Track your assets and liabilities",
    href: "/finance/net-worth",
    icon: "💎",
  },
  {
    title: "Debt Payoff Calculator",
    description: "Plan your debt repayment strategy",
    href: "/finance/debt-payoff",
    icon: "📋",
  },
  { title: "ROI Calculator", description: "Return on investment, gain/loss, and CAGR", href: "/finance/roi", icon: "🏆" },
  { title: "Break-Even Calculator", description: "Units needed to cover your fixed costs", href: "/finance/break-even", icon: "⚖️" },
  { title: "Rule of 72", description: "How long to double your money", href: "/finance/rule-of-72", icon: "⏳" },
  { title: "Payback Period", description: "How long until an investment pays for itself", href: "/finance/payback-period", icon: "⏱️" },
  { title: "VAT / Sales Tax", description: "Calculate tax amounts ex/incl. VAT", href: "/finance/vat", icon: "🧾" },
  { title: "Salary Calculator", description: "Convert pay between hourly, weekly, monthly, and annual", href: "/finance/salary", icon: "💼" },
  { title: "Pay Raise Calculator", description: "See your new salary and per-period difference after a raise", href: "/finance/pay-raise", icon: "🚀" },
  { title: "Overtime Calculator", description: "Regular pay, overtime pay, and effective hourly rate", href: "/finance/overtime", icon: "⏰" },
  { title: "CAGR Calculator", description: "Compound Annual Growth Rate and year-by-year projection", href: "/finance/cagr", icon: "📉" },
  { title: "Future Value Calculator", description: "Grow a lump sum or regular contributions over time", href: "/finance/future-value", icon: "🔮" },
  { title: "Present Value Calculator", description: "Discount future cash flows or annuities to today's value", href: "/finance/present-value", icon: "⏪" },
  { title: "NPV Calculator", description: "Net Present Value and IRR for investment cash flows", href: "/finance/npv", icon: "🧮" },
  { title: "IRR Calculator", description: "Internal Rate of Return with cumulative cash flow table", href: "/finance/irr", icon: "📐" },
  { title: "Gross Margin Calculator", description: "Selling price, gross profit, margin %, and markup %", href: "/finance/margin", icon: "🛒" },
  { title: "Amortization Calculator", description: "Full amortization schedule with monthly payment breakdown", href: "/finance/amortization", icon: "📅" },
  { title: "APY Calculator", description: "Convert APR to APY across compounding frequencies", href: "/finance/apy", icon: "🏧" },
  { title: "Rent Affordability", description: "Max rent based on income using the 28%, 30%, and 36% rules", href: "/finance/rent-affordability", icon: "🏢" },
  { title: "Stock Average Calculator", description: "Average cost per share across multiple purchase lots", href: "/finance/stock-average", icon: "💲" },
  { title: "Markup Calculator", description: "Markup %, profit margin, and target price from cost", href: "/finance/markup", icon: "💰" },
  { title: "Sales Tax Calculator", description: "Add or remove sales tax with quick-reference rate table", href: "/finance/sales-tax", icon: "🪙" },
  { title: "WACC Calculator", description: "Weighted Average Cost of Capital with formula breakdown", href: "/finance/wacc", icon: "🔗" },
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
