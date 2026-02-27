"use client";

import { useState, useRef, useEffect } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";

interface HistoryEntry {
  expression: string;
  result: string;
}

function safeEval(expr: string): string {
  try {
    // Replace common math syntax
    let sanitized = expr
      .replace(/\s/g, "")
      .replace(/π/g, `(${Math.PI})`)
      .replace(/pi/gi, `(${Math.PI})`)
      .replace(/(?<![0-9])e(?![x0-9])/gi, `(${Math.E})`)
      .replace(/sqrt\(/gi, "Math.sqrt(")
      .replace(/abs\(/gi, "Math.abs(")
      .replace(/sin\(/gi, "Math.sin(")
      .replace(/cos\(/gi, "Math.cos(")
      .replace(/tan\(/gi, "Math.tan(")
      .replace(/log\(/gi, "Math.log10(")
      .replace(/ln\(/gi, "Math.log(")
      .replace(/\^/g, "**")
      .replace(/%/g, "/100");

    // Validate: only allow numbers, operators, parens, dots, Math functions
    if (!/^[0-9+\-*/().Math,sqrtabsincotagle10 **]+$/.test(sanitized)) {
      return "Error: invalid expression";
    }

    // eslint-disable-next-line no-eval
    const result = Function(`"use strict"; return (${sanitized})`)();
    if (typeof result !== "number" || !isFinite(result)) {
      return "Error";
    }
    // Round to avoid floating point noise
    return parseFloat(result.toPrecision(12)).toString();
  } catch {
    return "Error";
  }
}

export default function GeneralCalculatorPage() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    const result = safeEval(input);
    setHistory((prev) => [{ expression: input, result }, ...prev]);
    setInput(result.startsWith("Error") ? input : result);
  }

  function handleClear() {
    setInput("");
    inputRef.current?.focus();
  }

  function handleClearHistory() {
    setHistory([]);
  }

  return (
    <CalculatorShell
      title="General Calculator"
      description="Type math expressions naturally. Supports +, -, *, /, ^, sqrt(), sin(), cos(), tan(), log(), ln(), pi, parentheses."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. (2 + 3) * 4 / 2"
            className="w-full px-4 py-3 text-xl font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-right"
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 bg-primary text-white py-2.5 rounded-lg font-medium hover:bg-primary-hover transition-colors"
          >
            Calculate (Enter)
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="px-4 py-2.5 bg-background border border-card-border rounded-lg font-medium hover:bg-primary-light transition-colors"
          >
            Clear
          </button>
        </div>
      </form>

      {history.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-muted uppercase tracking-wide">
              History
            </h3>
            <button
              onClick={handleClearHistory}
              className="text-xs text-muted hover:text-danger transition-colors"
            >
              Clear history
            </button>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {history.map((entry, i) => (
              <div
                key={i}
                className="flex justify-between items-center px-3 py-2 bg-background rounded-lg text-sm font-mono cursor-pointer hover:bg-primary-light transition-colors"
                onClick={() => setInput(entry.result)}
              >
                <span className="text-muted truncate mr-4">
                  {entry.expression}
                </span>
                <span className="font-semibold whitespace-nowrap">
                  = {entry.result}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </CalculatorShell>
  );
}
