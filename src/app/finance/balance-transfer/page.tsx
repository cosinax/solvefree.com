"use client";

import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";
import { useState } from "react";

const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
const usd = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });

interface PayoffResult {
  months: number;
  totalInterest: number;
  totalPaid: number;
  table: { month: number; balance: number; payment: number; interest: number; principal: number }[];
}

function simulatePayoff(
  startBalance: number,
  apr: number,
  monthlyPayment: number,
  maxMonths = 600
): PayoffResult {
  const r = apr / 100 / 12;
  let bal = startBalance;
  let totalInterest = 0;
  let totalPaid = 0;
  const table: PayoffResult["table"] = [];

  for (let m = 1; m <= maxMonths && bal > 0.005; m++) {
    const intCharge = bal * r;
    const pmt = Math.min(monthlyPayment, bal + intCharge);
    const princ = pmt - intCharge;
    bal = Math.max(bal - princ, 0);
    totalInterest += intCharge;
    totalPaid += pmt;
    table.push({ month: m, balance: bal, payment: pmt, interest: intCharge, principal: princ });
  }

  return { months: table.length, totalInterest, totalPaid, table };
}

export default function BalanceTransferPage() {
  const [v, setV] = useHashState({
    balance: "8000",
    currentApr: "24.99",
    monthlyPayment: "200",
    transferFee: "3",
    promoApr: "0",
    promoPeriod: "12",
    postPromoApr: "20.99",
  });
  const [showTable, setShowTable] = useState(false);

  const balance = parseFloat(v.balance) || 0;
  const currentApr = parseFloat(v.currentApr) || 0;
  const monthlyPayment = parseFloat(v.monthlyPayment) || 0;
  const transferFee = parseFloat(v.transferFee) || 0;
  const promoApr = parseFloat(v.promoApr) || 0;
  const promoPeriod = parseInt(v.promoPeriod) || 12;
  const postPromoApr = parseFloat(v.postPromoApr) || 0;

  const valid = balance > 0 && monthlyPayment > 0;

  // Current card scenario
  const current = valid ? simulatePayoff(balance, currentApr, monthlyPayment) : null;

  // Transfer scenario
  const transferBalance = balance * (1 + transferFee / 100);
  let transferTotalInterest = 0;
  let transferTotalPaid = 0;
  const transferTable: { month: number; balance: number; payment: number; interest: number; principal: number; scenario: string }[] = [];

  if (valid) {
    // Promo period: low/zero APR
    const promoR = promoApr / 100 / 12;
    let bal = transferBalance;
    for (let m = 1; m <= promoPeriod && bal > 0.005; m++) {
      const intCharge = bal * promoR;
      const pmt = Math.min(monthlyPayment, bal + intCharge);
      const princ = pmt - intCharge;
      bal = Math.max(bal - princ, 0);
      transferTotalInterest += intCharge;
      transferTotalPaid += pmt;
      transferTable.push({ month: m, balance: bal, payment: pmt, interest: intCharge, principal: princ, scenario: "Promo" });
    }

    // Post-promo period
    if (bal > 0.005) {
      const postR = postPromoApr / 100 / 12;
      let postMonth = promoPeriod;
      while (bal > 0.005 && postMonth < 600) {
        postMonth++;
        const intCharge = bal * postR;
        const pmt = Math.min(monthlyPayment, bal + intCharge);
        const princ = pmt - intCharge;
        bal = Math.max(bal - princ, 0);
        transferTotalInterest += intCharge;
        transferTotalPaid += pmt;
        transferTable.push({ month: postMonth, balance: bal, payment: pmt, interest: intCharge, principal: princ, scenario: "Post-promo" });
      }
    }
  }

  const feeAmount = balance * (transferFee / 100);
  const savings = current ? current.totalInterest - transferTotalInterest : 0;
  const netSavings = savings - feeAmount;

  return (
    <CalculatorShell
      title="Balance Transfer Calculator"
      description="Compare keeping your current card vs transferring to a low-APR promotional card."
    >
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-muted mb-1">Current Balance ($)</label>
            <input type="number" value={v.balance} onChange={(e) => setV({ balance: e.target.value })} className={ic} min="0" />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Current APR (%)</label>
            <input type="number" value={v.currentApr} onChange={(e) => setV({ currentApr: e.target.value })} className={ic} step="0.01" />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Monthly Payment ($)</label>
            <input type="number" value={v.monthlyPayment} onChange={(e) => setV({ monthlyPayment: e.target.value })} className={ic} min="0" />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Transfer Fee (%)</label>
            <input type="number" value={v.transferFee} onChange={(e) => setV({ transferFee: e.target.value })} className={ic} step="0.1" />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Promo APR (%)</label>
            <input type="number" value={v.promoApr} onChange={(e) => setV({ promoApr: e.target.value })} className={ic} step="0.01" />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Promo Period (months)</label>
            <input type="number" value={v.promoPeriod} onChange={(e) => setV({ promoPeriod: e.target.value })} className={ic} min="1" />
          </div>
          <div className="col-span-2">
            <label className="block text-sm text-muted mb-1">Post-Promo APR (%)</label>
            <input type="number" value={v.postPromoApr} onChange={(e) => setV({ postPromoApr: e.target.value })} className={ic} step="0.01" />
          </div>
        </div>

        {valid && current && (
          <div className="space-y-4">
            {/* Comparison cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-xs font-semibold text-red-700 mb-2">Keep Current Card</p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted">Months:</span>
                    <span className="font-mono font-semibold">{current.months}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Total Interest:</span>
                    <span className="font-mono font-semibold">{usd(current.totalInterest)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Total Paid:</span>
                    <span className="font-mono font-semibold">{usd(current.totalPaid)}</span>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <p className="text-xs font-semibold text-green-700 mb-2">After Transfer</p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted">Months:</span>
                    <span className="font-mono font-semibold">{transferTable.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Total Interest:</span>
                    <span className="font-mono font-semibold">{usd(transferTotalInterest)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Transfer Fee:</span>
                    <span className="font-mono font-semibold">{usd(feeAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Total Paid:</span>
                    <span className="font-mono font-semibold">{usd(transferTotalPaid + feeAmount)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Net savings highlight */}
            <div className={`rounded-xl p-4 text-center ${netSavings > 0 ? "bg-green-50 border border-green-200" : "bg-yellow-50 border border-yellow-200"}`}>
              <span className="block text-sm text-muted">Net Savings After Transfer Fee</span>
              <span className={`block font-mono font-bold text-2xl ${netSavings > 0 ? "text-green-700" : "text-yellow-700"}`}>
                {netSavings > 0 ? "+" : ""}{usd(netSavings)}
              </span>
              {netSavings <= 0 && (
                <p className="text-xs text-yellow-700 mt-1">Balance transfer may not save money at these rates.</p>
              )}
            </div>

            {/* Table toggle */}
            <button onClick={() => setShowTable(!showTable)} className="w-full text-sm text-primary font-medium py-2 hover:underline">
              {showTable ? "Hide" : "Show"} Month-by-Month Transfer Schedule
            </button>
            {showTable && (
              <div className="max-h-80 overflow-y-auto rounded-lg border border-card-border">
                <table className="w-full text-xs font-mono">
                  <thead className="bg-card sticky top-0">
                    <tr>
                      <th className="px-2 py-2 text-left text-muted">#</th>
                      <th className="px-2 py-2 text-left text-muted">Phase</th>
                      <th className="px-2 py-2 text-right text-muted">Payment</th>
                      <th className="px-2 py-2 text-right text-muted">Interest</th>
                      <th className="px-2 py-2 text-right text-muted">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transferTable.map((row) => (
                      <tr key={row.month} className={`border-t border-card-border ${row.scenario === "Promo" ? "" : "bg-yellow-50"}`}>
                        <td className="px-2 py-1.5">{row.month}</td>
                        <td className="px-2 py-1.5">{row.scenario}</td>
                        <td className="px-2 py-1.5 text-right">{usd(row.payment)}</td>
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
