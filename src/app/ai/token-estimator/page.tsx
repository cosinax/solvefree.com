"use client";

import { useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";

export default function TokenEstimatorPage() {
  const [text, setText] = useState("");
  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const tokenEstChar = Math.ceil(charCount / 4);
  const tokenEstWord = Math.ceil(wordCount * 1.3);
  const best = Math.max(tokenEstChar, tokenEstWord);

  return (
    <CalculatorShell title="Token Estimator" description="Estimate token count for LLM input. ~4 chars or ~1.3 words per token.">
      <div className="space-y-4">
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={8} placeholder="Paste your text here..."
          className="w-full px-4 py-3 font-mono text-sm bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-y" />
        <div className="grid grid-cols-2 gap-3">
          {[{ l: "Characters", v: charCount }, { l: "Words", v: wordCount }, { l: "~Tokens (char/4)", v: tokenEstChar }, { l: "Best Estimate", v: best }].map((m) => (
            <div key={m.l} className="px-4 py-3 bg-primary-light rounded-lg text-center">
              <span className="block text-xs text-muted">{m.l}</span>
              <span className="font-mono font-bold text-xl">{m.v.toLocaleString()}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted">Approximation. Actual tokenization varies by model (GPT, Claude, Llama, etc.).</p>
      </div>
    </CalculatorShell>
  );
}
