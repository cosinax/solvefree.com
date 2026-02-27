"use client";

import { useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";

// Offline approximate rates (USD base, ~Feb 2026)
const rates: Record<string, { name: string; rate: number }> = {
  USD: { name: "US Dollar", rate: 1 },
  EUR: { name: "Euro", rate: 0.96 },
  GBP: { name: "British Pound", rate: 0.80 },
  JPY: { name: "Japanese Yen", rate: 151.5 },
  CAD: { name: "Canadian Dollar", rate: 1.43 },
  AUD: { name: "Australian Dollar", rate: 1.61 },
  CHF: { name: "Swiss Franc", rate: 0.90 },
  CNY: { name: "Chinese Yuan", rate: 7.29 },
  INR: { name: "Indian Rupee", rate: 86.5 },
  MXN: { name: "Mexican Peso", rate: 20.4 },
  BRL: { name: "Brazilian Real", rate: 5.85 },
  KRW: { name: "South Korean Won", rate: 1450 },
  SEK: { name: "Swedish Krona", rate: 10.75 },
  NOK: { name: "Norwegian Krone", rate: 11.1 },
  NZD: { name: "New Zealand Dollar", rate: 1.78 },
  SGD: { name: "Singapore Dollar", rate: 1.35 },
  HKD: { name: "Hong Kong Dollar", rate: 7.78 },
  PLN: { name: "Polish Zloty", rate: 4.10 },
  THB: { name: "Thai Baht", rate: 33.8 },
  ZAR: { name: "South African Rand", rate: 18.4 },
};

const currencies = Object.keys(rates);

export default function CurrencyPage() {
  const [amount, setAmount] = useState("100");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");

  const a = parseFloat(amount);
  const valid = a > 0;
  const inUsd = a / rates[from].rate;
  const result = inUsd * rates[to].rate;
  const exchangeRate = rates[to].rate / rates[from].rate;

  const sc = "w-full px-3 py-2.5 bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

  return (
    <CalculatorShell title="Currency Converter" description="Convert between world currencies. Uses approximate offline rates.">
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-muted mb-1">Amount</label>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-3 text-xl font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-muted mb-1">From</label>
            <select value={from} onChange={(e) => setFrom(e.target.value)} className={sc}>
              {currencies.map((c) => <option key={c} value={c}>{c} — {rates[c].name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">To</label>
            <select value={to} onChange={(e) => setTo(e.target.value)} className={sc}>
              {currencies.map((c) => <option key={c} value={c}>{c} — {rates[c].name}</option>)}
            </select>
          </div>
        </div>
        <button onClick={() => { setFrom(to); setTo(from); }}
          className="w-full text-sm text-primary font-medium py-2 hover:underline">⇄ Swap currencies</button>
        {valid && (
          <div className="bg-primary-light rounded-xl p-4 text-center space-y-1">
            <span className="block text-sm text-muted">{amount} {from} =</span>
            <span className="block font-mono font-bold text-3xl text-primary">{result.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 4 })} {to}</span>
            <span className="block text-xs text-muted">1 {from} = {exchangeRate.toFixed(4)} {to}</span>
          </div>
        )}
        <p className="text-xs text-muted text-center">⚠️ Rates are approximate and for reference only. They are not live.</p>
      </div>
    </CalculatorShell>
  );
}
