"use client";

import { useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";

export default function JsonFormatterPage() {
  const [input, setInput] = useState('{"name":"John","age":30,"city":"New York"}');
  const [indent, setIndent] = useState("2");
  let output = "", error = "";
  try { output = JSON.stringify(JSON.parse(input), null, parseInt(indent) || 2); } catch (e) { error = (e as Error).message; }
  const minified = error ? "" : JSON.stringify(JSON.parse(input));
  return (
    <CalculatorShell title="JSON Formatter" description="Format, validate, and minify JSON data.">
      <div className="space-y-4">
        <div><label className="block text-sm text-muted mb-1">Input JSON</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={6}
            className="w-full px-4 py-3 font-mono text-sm bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-y" /></div>
        <div className="flex gap-2 items-center">
          <label className="text-sm text-muted">Indent:</label>
          {["2", "4", "tab"].map((v) => (
            <button key={v} onClick={() => setIndent(v)} className={`px-3 py-1 rounded-lg text-xs font-medium ${indent === v ? "bg-primary text-white" : "bg-background border border-card-border"}`}>{v}</button>
          ))}
        </div>
        {error ? (
          <div className="px-4 py-3 bg-red-50 dark:bg-red-950 rounded-lg text-danger text-sm font-mono">{error}</div>
        ) : (
          <div><label className="block text-sm text-muted mb-1">Formatted</label>
            <textarea value={output} readOnly rows={8} className="w-full px-4 py-3 font-mono text-sm bg-background border border-card-border rounded-lg resize-y" /></div>
        )}
        {!error && <div><label className="block text-sm text-muted mb-1">Minified ({minified.length} chars)</label>
          <textarea value={minified} readOnly rows={2} className="w-full px-4 py-3 font-mono text-xs bg-background border border-card-border rounded-lg resize-y" /></div>}
      </div>
    </CalculatorShell>
  );
}
