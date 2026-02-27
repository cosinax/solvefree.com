"use client";

import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
const usd = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });

export default function HelocPage() {
  const [v, setV] = useHashState({
    homeValue: "450000",
    mortgageBalance: "280000",
    maxLtv: "85",
    helocApr: "8.5",
    drawPeriod: "10",
    repayPeriod: "20",
    drawAmount: "50000",
  });

  const homeValue = parseFloat(v.homeValue) || 0;
  const mortgageBalance = parseFloat(v.mortgageBalance) || 0;
  const maxLtv = parseFloat(v.maxLtv) / 100 || 0.85;
  const helocApr = parseFloat(v.helocApr) || 0;
  const drawPeriod = parseInt(v.drawPeriod) || 10;
  const repayPeriod = parseInt(v.repayPeriod) || 20;
  const drawAmount = parseFloat(v.drawAmount) || 0;

  const availableEquity = Math.max(homeValue - mortgageBalance, 0);
  const maxLine = Math.max(homeValue * maxLtv - mortgageBalance, 0);
  const actualDraw = Math.min(drawAmount, maxLine);

  const monthlyR = helocApr / 100 / 12;

  // Draw period: interest-only on drawn amount
  const drawMonthlyPayment = actualDraw * monthlyR;
  const drawTotalInterest = drawMonthlyPayment * drawPeriod * 12;
  const drawTotalPaid = drawMonthlyPayment * drawPeriod * 12;

  // Repayment period: amortizing payment on drawn amount
  const repayN = repayPeriod * 12;
  const repayMonthly =
    monthlyR > 0 && repayN > 0
      ? (actualDraw * monthlyR * Math.pow(1 + monthlyR, repayN)) / (Math.pow(1 + monthlyR, repayN) - 1)
      : actualDraw / repayN;
  const repayTotalPaid = repayMonthly * repayN;
  const repayTotalInterest = repayTotalPaid - actualDraw;

  const totalInterest = drawTotalInterest + repayTotalInterest;
  const valid = homeValue > 0 && drawAmount > 0;

  const ltv = homeValue > 0 ? ((mortgageBalance + actualDraw) / homeValue) * 100 : 0;

  return (
    <CalculatorShell
      title="HELOC Calculator"
      description="Calculate your available HELOC line, draw-period interest payments, and repayment-period amortizing payments."
    >
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-muted mb-1">Home Value ($)</label>
            <input type="number" value={v.homeValue} onChange={(e) => setV({ homeValue: e.target.value })} className={ic} min="0" />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Mortgage Balance ($)</label>
            <input type="number" value={v.mortgageBalance} onChange={(e) => setV({ mortgageBalance: e.target.value })} className={ic} min="0" />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Max LTV (%)</label>
            <input type="number" value={v.maxLtv} onChange={(e) => setV({ maxLtv: e.target.value })} className={ic} step="1" min="0" max="100" />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">HELOC APR (%)</label>
            <input type="number" value={v.helocApr} onChange={(e) => setV({ helocApr: e.target.value })} className={ic} step="0.01" />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Draw Period (years)</label>
            <input type="number" value={v.drawPeriod} onChange={(e) => setV({ drawPeriod: e.target.value })} className={ic} min="1" />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Repayment Period (years)</label>
            <input type="number" value={v.repayPeriod} onChange={(e) => setV({ repayPeriod: e.target.value })} className={ic} min="1" />
          </div>
          <div className="col-span-2">
            <label className="block text-sm text-muted mb-1">Draw Amount ($)</label>
            <input type="number" value={v.drawAmount} onChange={(e) => setV({ drawAmount: e.target.value })} className={ic} min="0" />
          </div>
        </div>

        {valid && (
          <div className="space-y-4">
            {/* Available equity summary */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-primary-light rounded-lg p-3 text-center">
                <span className="block text-xs text-muted">Home Equity</span>
                <span className="font-mono font-semibold">{usd(availableEquity)}</span>
              </div>
              <div className="bg-primary-light rounded-lg p-3 text-center">
                <span className="block text-xs text-muted">Max HELOC Line</span>
                <span className="font-mono font-semibold">{usd(maxLine)}</span>
              </div>
              <div className={`rounded-lg p-3 text-center ${ltv > 90 ? "bg-red-100 border border-red-200" : "bg-primary-light"}`}>
                <span className="block text-xs text-muted">Combined LTV</span>
                <span className={`font-mono font-semibold ${ltv > 90 ? "text-red-700" : ""}`}>{ltv.toFixed(1)}%</span>
              </div>
            </div>

            {drawAmount > maxLine && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 text-sm text-yellow-700">
                Draw amount exceeds max HELOC line. Calculation uses {usd(maxLine)}.
              </div>
            )}

            {/* Phase breakdown */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Phase Breakdown</h3>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm font-semibold text-blue-800 mb-2">Draw Period ({drawPeriod} years — interest only)</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between col-span-2">
                    <span className="text-muted">Monthly payment:</span>
                    <span className="font-mono font-semibold">{usd(drawMonthlyPayment)}</span>
                  </div>
                  <div className="flex justify-between col-span-2">
                    <span className="text-muted">Total interest (draw phase):</span>
                    <span className="font-mono font-semibold">{usd(drawTotalPaid)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                <p className="text-sm font-semibold text-orange-800 mb-2">Repayment Period ({repayPeriod} years — amortizing)</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between col-span-2">
                    <span className="text-muted">Monthly payment:</span>
                    <span className="font-mono font-semibold">{usd(repayMonthly)}</span>
                  </div>
                  <div className="flex justify-between col-span-2">
                    <span className="text-muted">Total paid (repay phase):</span>
                    <span className="font-mono font-semibold">{usd(repayTotalPaid)}</span>
                  </div>
                  <div className="flex justify-between col-span-2">
                    <span className="text-muted">Interest (repay phase):</span>
                    <span className="font-mono font-semibold">{usd(repayTotalInterest)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Totals */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-primary-light rounded-lg p-3 text-center">
                <span className="block text-xs text-muted">Amount Drawn</span>
                <span className="font-mono font-semibold">{usd(actualDraw)}</span>
              </div>
              <div className="bg-primary-light rounded-lg p-3 text-center">
                <span className="block text-xs text-muted">Total Interest</span>
                <span className="font-mono font-semibold">{usd(totalInterest)}</span>
              </div>
              <div className="bg-primary-light rounded-lg p-3 text-center">
                <span className="block text-xs text-muted">Total Cost</span>
                <span className="font-mono font-semibold">{usd(actualDraw + totalInterest)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
