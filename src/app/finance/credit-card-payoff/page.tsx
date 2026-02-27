"use client";

import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";
import { useState } from "react";

const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
const sc = "w-full px-3 py-2 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm";
const usd = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });

interface AmortRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

function computePayoff(balance: number, apr: number, monthlyPayment: number): AmortRow[] {
  const r = apr / 100 / 12;
  const rows: AmortRow[] = [];
  let bal = balance;
  let month = 0;
  while (bal > 0.005 && month < 1200) {
    month++;
    const intCharge = bal * r;
    const pmt = Math.min(monthlyPayment, bal + intCharge);
    const princ = pmt - intCharge;
    bal = Math.max(bal - princ, 0);
    rows.push({ month, payment: pmt, principal: princ, interest: intCharge, balance: bal });
  }
  return rows;
}

function requiredPayment(balance: number, apr: number, months: number): number {
  const r = apr / 100 / 12;
  if (r === 0) return balance / months;
  return (balance * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}

export default function CreditCardPayoffPage() {
  const [v, setV] = useHashState({
    balance: "5000",
    apr: "24.99",
    payment: "150",
    targetMonths: "24",
    mode: "fixed",
  });
  const [showTable, setShowTable] = useState(false);

  const balance = parseFloat(v.balance) || 0;
  const apr = parseFloat(v.apr) || 0;
  const r = apr / 100 / 12;
  const minPayment = balance * r; // interest-only minimum

  const mode = v.mode as "fixed" | "target";

  let payment = parseFloat(v.payment) || 0;
  const targetMonths = parseInt(v.targetMonths) || 24;

  if (mode === "target") {
    payment = requiredPayment(balance, apr, targetMonths);
  }

  const valid = balance > 0 && apr >= 0 && payment > minPayment;
  const rows = valid ? computePayoff(balance, apr, payment) : [];
  const totalInterest = rows.reduce((s, r) => s + r.interest, 0);
  const totalPaid = rows.reduce((s, r) => s + r.payment, 0);
  const months = rows.length;

  // +$50/month comparison
  const rows50 = valid ? computePayoff(balance, apr, payment + 50) : [];
  const totalInterest50 = rows50.reduce((s, r) => s + r.interest, 0);
  const months50 = rows50.length;

  const interestSaved = totalInterest - totalInterest50;
  const monthsSaved = months - months50;

  return (
    <CalculatorShell
      title="Credit Card Payoff Calculator"
      description="Find out how long it takes to pay off your credit card and how much interest you'll pay."
    >
      <div className="space-y-5">
        {/* Mode Toggle */}
        <div className="flex rounded-lg overflow-hidden border border-card-border">
          <button
            onClick={() => setV({ mode: "fixed" })}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${mode === "fixed" ? "bg-primary text-white" : "bg-background text-muted hover:text-foreground"}`}
          >
            Fixed Payment
          </button>
          <button
            onClick={() => setV({ mode: "target" })}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${mode === "target" ? "bg-primary text-white" : "bg-background text-muted hover:text-foreground"}`}
          >
            Target Payoff Date
          </button>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-muted mb-1">Balance ($)</label>
            <input type="number" value={v.balance} onChange={(e) => setV({ balance: e.target.value })} className={ic} min="0" />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">APR (%)</label>
            <input type="number" value={v.apr} onChange={(e) => setV({ apr: e.target.value })} className={ic} step="0.01" min="0" />
          </div>
          {mode === "fixed" ? (
            <div className="col-span-2">
              <label className="block text-sm text-muted mb-1">Monthly Payment ($)</label>
              <input type="number" value={v.payment} onChange={(e) => setV({ payment: e.target.value })} className={ic} min="0" />
            </div>
          ) : (
            <div className="col-span-2">
              <label className="block text-sm text-muted mb-1">Pay off in (months)</label>
              <input type="number" value={v.targetMonths} onChange={(e) => setV({ targetMonths: e.target.value })} className={ic} min="1" />
            </div>
          )}
        </div>

        {/* Warning: payment too low */}
        {balance > 0 && apr > 0 && mode === "fixed" && payment > 0 && payment <= minPayment && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
            Warning: Your payment of {usd(payment)} does not cover the monthly interest of {usd(minPayment)}. You will never pay off this balance.
          </div>
        )}

        {/* Results */}
        {valid && rows.length > 0 && (
          <div className="space-y-4">
            {mode === "target" && (
              <div className="bg-primary-light rounded-xl p-4 text-center">
                <span className="block text-sm text-muted">Required Monthly Payment</span>
                <span className="block font-mono font-bold text-3xl text-primary">{usd(payment)}</span>
              </div>
            )}

            <div className="grid grid-cols-3 gap-3">
              <div className="px-3 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">Months to Pay Off</span>
                <span className="font-mono font-semibold">{months}</span>
              </div>
              <div className="px-3 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">Total Interest</span>
                <span className="font-mono font-semibold">{usd(totalInterest)}</span>
              </div>
              <div className="px-3 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">Total Paid</span>
                <span className="font-mono font-semibold">{usd(totalPaid)}</span>
              </div>
            </div>

            {/* +$50 comparison */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <p className="text-sm font-semibold text-green-800 mb-2">What if you paid {usd(payment + 50)}/month (+$50)?</p>
              <div className="grid grid-cols-2 gap-2 text-sm text-green-700">
                <span>Interest saved:</span>
                <span className="font-mono font-semibold text-right">{usd(Math.max(interestSaved, 0))}</span>
                <span>Months saved:</span>
                <span className="font-mono font-semibold text-right">{Math.max(monthsSaved, 0)} months</span>
                <span>Pay off in:</span>
                <span className="font-mono font-semibold text-right">{months50} months</span>
              </div>
            </div>

            {/* Collapsible table */}
            <button
              onClick={() => setShowTable(!showTable)}
              className="w-full text-sm text-primary font-medium py-2 hover:underline"
            >
              {showTable ? "Hide" : "Show"} Month-by-Month Schedule
            </button>

            {showTable && (
              <div className="max-h-80 overflow-y-auto rounded-lg border border-card-border">
                <table className="w-full text-xs font-mono">
                  <thead className="bg-card sticky top-0">
                    <tr>
                      <th className="px-2 py-2 text-left text-muted">#</th>
                      <th className="px-2 py-2 text-right text-muted">Payment</th>
                      <th className="px-2 py-2 text-right text-muted">Principal</th>
                      <th className="px-2 py-2 text-right text-muted">Interest</th>
                      <th className="px-2 py-2 text-right text-muted">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row.month} className="border-t border-card-border">
                        <td className="px-2 py-1.5">{row.month}</td>
                        <td className="px-2 py-1.5 text-right">{usd(row.payment)}</td>
                        <td className="px-2 py-1.5 text-right">{usd(row.principal)}</td>
                        <td className="px-2 py-1.5 text-right">{usd(row.interest)}</td>
                        <td className="px-2 py-1.5 text-right">{usd(row.balance)}</td>
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
