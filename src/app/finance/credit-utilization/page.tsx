"use client";

import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";
import { useMemo } from "react";

const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
const usd = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });

interface Card {
  name: string;
  balance: string;
  limit: string;
}

const DEFAULT_CARDS: Card[] = [
  { name: "Card 1", balance: "1500", limit: "5000" },
  { name: "Card 2", balance: "800", limit: "3000" },
];

function utilColor(pct: number): string {
  if (pct <= 30) return "text-green-700";
  if (pct <= 50) return "text-yellow-700";
  return "text-red-700";
}

function utilBg(pct: number): string {
  if (pct <= 30) return "bg-green-100 border-green-200";
  if (pct <= 50) return "bg-yellow-100 border-yellow-200";
  return "bg-red-100 border-red-200";
}

export default function CreditUtilizationPage() {
  const [v, setV] = useHashState({
    cards: JSON.stringify(DEFAULT_CARDS),
  });

  const cards: Card[] = useMemo(() => {
    try {
      const parsed = JSON.parse(v.cards);
      if (Array.isArray(parsed)) return parsed as Card[];
    } catch {
      // fall through
    }
    return DEFAULT_CARDS;
  }, [v.cards]);

  function setCards(updated: Card[]) {
    setV({ cards: JSON.stringify(updated) });
  }

  function updateCard(index: number, field: keyof Card, value: string) {
    const updated = cards.map((c, i) => (i === index ? { ...c, [field]: value } : c));
    setCards(updated);
  }

  function addCard() {
    if (cards.length >= 5) return;
    setCards([...cards, { name: `Card ${cards.length + 1}`, balance: "0", limit: "1000" }]);
  }

  function removeCard(index: number) {
    if (cards.length <= 1) return;
    setCards(cards.filter((_, i) => i !== index));
  }

  const totalBalance = cards.reduce((s, c) => s + (parseFloat(c.balance) || 0), 0);
  const totalLimit = cards.reduce((s, c) => s + (parseFloat(c.limit) || 0), 0);
  const overallUtil = totalLimit > 0 ? (totalBalance / totalLimit) * 100 : 0;

  // How much to pay down for target utilization
  const paydownTo30 = totalLimit > 0 ? Math.max(totalBalance - totalLimit * 0.3, 0) : 0;
  const paydownTo10 = totalLimit > 0 ? Math.max(totalBalance - totalLimit * 0.1, 0) : 0;

  return (
    <CalculatorShell
      title="Credit Utilization Calculator"
      description="Track per-card and overall utilization. Keep it under 30% for the best credit score impact."
    >
      <div className="space-y-5">
        {/* Card rows */}
        <div className="space-y-3">
          {cards.map((card, i) => (
            <div key={i} className="bg-background border border-card-border rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  value={card.name}
                  onChange={(e) => updateCard(i, "name", e.target.value)}
                  placeholder="Card name (optional)"
                  className="text-sm font-medium bg-transparent border-none outline-none w-full"
                />
                {cards.length > 1 && (
                  <button onClick={() => removeCard(i)} className="text-xs text-red-500 hover:text-red-700 ml-2 shrink-0">
                    Remove
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-muted mb-1">Balance ($)</label>
                  <input
                    type="number"
                    value={card.balance}
                    onChange={(e) => updateCard(i, "balance", e.target.value)}
                    className={ic}
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted mb-1">Credit Limit ($)</label>
                  <input
                    type="number"
                    value={card.limit}
                    onChange={(e) => updateCard(i, "limit", e.target.value)}
                    className={ic}
                    min="0"
                  />
                </div>
              </div>
              {/* Per-card utilization bar */}
              {parseFloat(card.limit) > 0 && (
                <div>
                  {(() => {
                    const pct = Math.min((parseFloat(card.balance) || 0) / (parseFloat(card.limit) || 1) * 100, 100);
                    return (
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted">Utilization</span>
                          <span className={`font-mono font-semibold ${utilColor(pct)}`}>{pct.toFixed(1)}%</span>
                        </div>
                        <div className="h-2 bg-card rounded-full overflow-hidden border border-card-border">
                          <div
                            className={`h-full rounded-full transition-all ${pct <= 30 ? "bg-green-500" : pct <= 50 ? "bg-yellow-500" : "bg-red-500"}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          ))}
        </div>

        {cards.length < 5 && (
          <button
            onClick={addCard}
            className="w-full py-2 border border-dashed border-card-border rounded-lg text-sm text-muted hover:text-primary hover:border-primary transition-colors"
          >
            + Add Card
          </button>
        )}

        {/* Overall utilization */}
        <div className={`rounded-xl p-4 border ${utilBg(overallUtil)}`}>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold">Overall Utilization</span>
            <span className={`font-mono font-bold text-xl ${utilColor(overallUtil)}`}>{overallUtil.toFixed(1)}%</span>
          </div>
          <div className="h-3 bg-white rounded-full overflow-hidden border border-white/50">
            <div
              className={`h-full rounded-full transition-all ${overallUtil <= 30 ? "bg-green-500" : overallUtil <= 50 ? "bg-yellow-500" : "bg-red-500"}`}
              style={{ width: `${Math.min(overallUtil, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted mt-2">
            <span>Total balance: {usd(totalBalance)}</span>
            <span>Total limit: {usd(totalLimit)}</span>
          </div>
        </div>

        {/* Paydown targets */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-muted">Paydown Targets</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-primary-light rounded-lg p-3 text-center">
              <span className="block text-xs text-muted">To reach 30% utilization</span>
              <span className="font-mono font-semibold text-primary">{paydownTo30 > 0 ? `Pay ${usd(paydownTo30)}` : "Already there!"}</span>
            </div>
            <div className="bg-primary-light rounded-lg p-3 text-center">
              <span className="block text-xs text-muted">To reach 10% utilization</span>
              <span className="font-mono font-semibold text-primary">{paydownTo10 > 0 ? `Pay ${usd(paydownTo10)}` : "Already there!"}</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-muted">
          Tip: Experts recommend keeping credit utilization below 30% on each card and overall for the best impact on your credit score.
        </p>
      </div>
    </CalculatorShell>
  );
}
