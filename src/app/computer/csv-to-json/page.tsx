"use client";
import { useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
export default function CsvToJsonPage() {
  const [csv, setCsv] = useState("name,age,city\nAlice,30,NYC\nBob,25,LA\nCharlie,35,Chicago");
  let json = "", error = "";
  try {
    const lines = csv.trim().split("\n").map(l => l.split(",").map(c => c.trim()));
    if (lines.length < 2) { error = "Need header + at least one row"; }
    else {
      const headers = lines[0];
      const data = lines.slice(1).map(row => Object.fromEntries(headers.map((h, i) => [h, row[i] || ""])));
      json = JSON.stringify(data, null, 2);
    }
  } catch { error = "Invalid CSV"; }
  return (
    <CalculatorShell title="CSV to JSON" description="Convert CSV data to JSON format.">
      <div className="space-y-4">
        <div><label className="block text-sm text-muted mb-1">CSV Input</label>
          <textarea value={csv} onChange={e => setCsv(e.target.value)} rows={6} className="w-full px-4 py-3 font-mono text-sm bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-y" /></div>
        {error ? <div className="text-danger text-sm">{error}</div> : (
          <div><label className="block text-sm text-muted mb-1">JSON Output</label>
            <textarea value={json} readOnly rows={8} className="w-full px-4 py-3 font-mono text-sm bg-background border border-card-border rounded-lg resize-y" /></div>
        )}
      </div>
    </CalculatorShell>
  );
}
