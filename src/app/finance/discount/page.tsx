"use client";

import { useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";

function fmt(n: number): string {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function DiscountPage() {
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("20");
  const [tax, setTax] = useState("0");

  const p = parseFloat(price), d = parseFloat(discount) / 100, t = parseFloat(tax) / 100;
  const valid = p > 0;
  const savings = p * d;
  const salePrice = p - savings;
  const taxAmount = salePrice * t;
  const finalPrice = salePrice + taxAmount;

  return (
    <CalculatorShell title="Discount Calculator" description="Calculate sale prices, savings, and final price with tax.">
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-muted mb-1">Original Price ($)</label>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0.00"
            className="w-full px-4 py-3 text-xl font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-muted mb-1">Discount (%)</label>
            <input type="number" value={discount} onChange={(e) => setDiscount(e.target.value)}
              className="w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Sales Tax (%)</label>
            <input type="number" value={tax} onChange={(e) => setTax(e.target.value)}
              className="w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
        </div>
        {valid && (
          <div className="space-y-3">
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="block text-sm text-muted">Final Price</span>
              <span className="block font-mono font-bold text-3xl text-primary">${fmt(finalPrice)}</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="px-3 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">You Save</span>
                <span className="font-mono font-semibold text-success">${fmt(savings)}</span>
              </div>
              <div className="px-3 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">Sale Price</span>
                <span className="font-mono font-semibold">${fmt(salePrice)}</span>
              </div>
              <div className="px-3 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">Tax</span>
                <span className="font-mono font-semibold">${fmt(taxAmount)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
