"use client";
import { useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
const fields = ["Minute","Hour","Day of Month","Month","Day of Week"];
const ranges = ["0-59","0-23","1-31","1-12","0-7 (0,7=Sun)"];
const presets = [
  {label:"Every minute",cron:"* * * * *"},{label:"Every hour",cron:"0 * * * *"},{label:"Every day at midnight",cron:"0 0 * * *"},
  {label:"Every Monday",cron:"0 0 * * 1"},{label:"Every 5 minutes",cron:"*/5 * * * *"},{label:"Every 15 minutes",cron:"*/15 * * * *"},
  {label:"Weekdays at 9am",cron:"0 9 * * 1-5"},{label:"First of month",cron:"0 0 1 * *"},{label:"Every Sunday 3am",cron:"0 3 * * 0"},
];
function explain(cron: string): string {
  const p = cron.trim().split(/\s+/);
  if (p.length !== 5) return "Invalid: need exactly 5 fields";
  const names = ["minute","hour","day of month","month","day of week"];
  const parts = p.map((v,i) => {
    if (v === "*") return `every ${names[i]}`;
    if (v.startsWith("*/")) return `every ${v.slice(2)} ${names[i]}s`;
    if (v.includes(",")) return `${names[i]} ${v}`;
    if (v.includes("-")) return `${names[i]}s ${v}`;
    return `at ${names[i]} ${v}`;
  });
  return parts.join(", ");
}
export default function CronPage() {
  const [cron, setCron] = useState("*/15 * * * *");
  const parts = cron.trim().split(/\s+/);
  return (
    <CalculatorShell title="Cron Expression Builder" description="Build and understand cron schedule expressions.">
      <div className="space-y-4">
        <div><label className="block text-sm text-muted mb-1">Cron Expression</label>
          <input type="text" value={cron} onChange={e=>setCron(e.target.value)} className="w-full px-4 py-3 font-mono text-lg bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-center"/></div>
        <div className="grid grid-cols-5 gap-1 text-center text-xs">
          {fields.map((f,i)=><div key={f} className="px-1 py-2 bg-primary-light rounded"><span className="block font-semibold">{parts[i]||"*"}</span><span className="text-muted">{f}</span><span className="block text-muted">{ranges[i]}</span></div>)}
        </div>
        <div className="bg-primary-light rounded-lg px-4 py-3"><span className="block text-xs text-muted">Explanation</span><span className="text-sm">{explain(cron)}</span></div>
        <div><label className="block text-sm text-muted mb-1">Presets</label>
          <div className="grid grid-cols-3 gap-1.5">{presets.map(p=><button key={p.cron} onClick={()=>setCron(p.cron)} className="px-2 py-1.5 text-xs bg-background border border-card-border rounded-lg hover:bg-primary-light">{p.label}</button>)}</div></div>
      </div>
    </CalculatorShell>
  );
}
