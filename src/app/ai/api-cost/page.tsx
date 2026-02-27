"use client";

import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

const models = [
  { name: "GPT-4o", input: 2.5, output: 10 },
  { name: "GPT-4o-mini", input: 0.15, output: 0.6 },
  { name: "o1", input: 15, output: 60 },
  { name: "o3-mini", input: 1.1, output: 4.4 },
  { name: "Claude Opus 4", input: 15, output: 75 },
  { name: "Claude Sonnet 4", input: 3, output: 15 },
  { name: "Claude Haiku 3.5", input: 0.8, output: 4 },
  { name: "Gemini 2.0 Flash", input: 0.1, output: 0.4 },
  { name: "Gemini 1.5 Pro", input: 1.25, output: 5 },
];

export default function ApiCostPage() {
  const [v, setV] = useHashState({ model: "0", inputTokens: "1000", outputTokens: "500", requests: "100" });
  const m = models[parseInt(v.model)] || models[0];
  const it = parseInt(v.inputTokens) || 0, ot = parseInt(v.outputTokens) || 0, req = parseInt(v.requests) || 0;
  const costPer = (it * m.input + ot * m.output) / 1_000_000;
  const totalCost = costPer * req;
  const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
  return (
    <CalculatorShell title="AI API Cost Calculator" description="Estimate API costs for popular LLM providers. Prices per million tokens.">
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-muted mb-1">Model</label>
          <select value={v.model} onChange={(e) => setV({ model: e.target.value })} className={ic}>
            {models.map((m, i) => <option key={i} value={i}>{m.name} (${m.input}/${m.output} per 1M)</option>)}
          </select>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div><label className="block text-sm text-muted mb-1">Input tokens</label><input type="number" value={v.inputTokens} onChange={(e) => setV({ inputTokens: e.target.value })} className={ic} /></div>
          <div><label className="block text-sm text-muted mb-1">Output tokens</label><input type="number" value={v.outputTokens} onChange={(e) => setV({ outputTokens: e.target.value })} className={ic} /></div>
          <div><label className="block text-sm text-muted mb-1">Requests</label><input type="number" value={v.requests} onChange={(e) => setV({ requests: e.target.value })} className={ic} /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="px-4 py-3 bg-primary-light rounded-lg text-center"><span className="block text-xs text-muted">Cost per Request</span><span className="font-mono font-bold text-xl">${costPer.toFixed(6)}</span></div>
          <div className="px-4 py-3 bg-primary-light rounded-lg text-center"><span className="block text-xs text-muted">Total ({req} requests)</span><span className="font-mono font-bold text-xl text-primary">${totalCost.toFixed(4)}</span></div>
        </div>
      </div>
    </CalculatorShell>
  );
}
