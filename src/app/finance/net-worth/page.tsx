"use client";

import { useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";

function fmt(n: number): string {
  return n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

interface Item { name: string; value: string; }

export default function NetWorthPage() {
  const [assets, setAssets] = useState<Item[]>([
    { name: "Cash & Savings", value: "" },
    { name: "Investments", value: "" },
    { name: "Real Estate", value: "" },
    { name: "Vehicles", value: "" },
    { name: "Other Assets", value: "" },
  ]);
  const [liabilities, setLiabilities] = useState<Item[]>([
    { name: "Mortgage", value: "" },
    { name: "Car Loans", value: "" },
    { name: "Student Loans", value: "" },
    { name: "Credit Cards", value: "" },
    { name: "Other Debts", value: "" },
  ]);

  const totalAssets = assets.reduce((s, a) => s + (parseFloat(a.value) || 0), 0);
  const totalLiabilities = liabilities.reduce((s, l) => s + (parseFloat(l.value) || 0), 0);
  const netWorth = totalAssets - totalLiabilities;

  function updateItem(list: Item[], setList: (l: Item[]) => void, idx: number, val: string) {
    const copy = [...list];
    copy[idx] = { ...copy[idx], value: val };
    setList(copy);
  }

  const ic = "w-full px-3 py-2 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

  return (
    <CalculatorShell title="Net Worth Calculator" description="Track your assets and liabilities to calculate net worth.">
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-3 text-success">Assets</h2>
          <div className="space-y-2">
            {assets.map((a, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-sm text-muted w-36 shrink-0">{a.name}</span>
                <input type="number" value={a.value} onChange={(e) => updateItem(assets, setAssets, i, e.target.value)}
                  placeholder="0" className={ic} />
              </div>
            ))}
          </div>
          <div className="mt-2 text-right font-mono font-semibold text-success">Total: ${fmt(totalAssets)}</div>
        </div>

        <hr className="border-card-border" />

        <div>
          <h2 className="text-lg font-semibold mb-3 text-danger">Liabilities</h2>
          <div className="space-y-2">
            {liabilities.map((l, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-sm text-muted w-36 shrink-0">{l.name}</span>
                <input type="number" value={l.value} onChange={(e) => updateItem(liabilities, setLiabilities, i, e.target.value)}
                  placeholder="0" className={ic} />
              </div>
            ))}
          </div>
          <div className="mt-2 text-right font-mono font-semibold text-danger">Total: ${fmt(totalLiabilities)}</div>
        </div>

        <div className={`rounded-xl p-4 text-center ${netWorth >= 0 ? "bg-primary-light" : "bg-red-50 dark:bg-red-950"}`}>
          <span className="block text-sm text-muted">Net Worth</span>
          <span className={`block font-mono font-bold text-3xl ${netWorth >= 0 ? "text-primary" : "text-danger"}`}>
            ${fmt(netWorth)}
          </span>
        </div>
      </div>
    </CalculatorShell>
  );
}
