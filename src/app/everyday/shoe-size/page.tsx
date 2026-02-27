"use client";
import { useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
const sizes = [
  {us_m:6,us_w:7.5,uk:5.5,eu:38.5,cm:24},{us_m:6.5,us_w:8,uk:6,eu:39,cm:24.5},{us_m:7,us_w:8.5,uk:6.5,eu:40,cm:25},
  {us_m:7.5,us_w:9,uk:7,eu:40.5,cm:25.5},{us_m:8,us_w:9.5,uk:7.5,eu:41,cm:26},{us_m:8.5,us_w:10,uk:8,eu:42,cm:26.5},
  {us_m:9,us_w:10.5,uk:8.5,eu:42.5,cm:27},{us_m:9.5,us_w:11,uk:9,eu:43,cm:27.5},{us_m:10,us_w:11.5,uk:9.5,eu:44,cm:28},
  {us_m:10.5,us_w:12,uk:10,eu:44.5,cm:28.5},{us_m:11,us_w:12.5,uk:10.5,eu:45,cm:29},{us_m:12,us_w:13.5,uk:11.5,eu:46,cm:30},
  {us_m:13,us_w:14.5,uk:12.5,eu:47.5,cm:31},{us_m:14,us_w:15.5,uk:13.5,eu:48.5,cm:32},
];
export default function ShoeSizePage() {
  const [sel, setSel] = useState(5);
  const s = sizes[sel];
  return (
    <CalculatorShell title="Shoe Size Converter" description="Convert shoe sizes between US, EU, UK, and cm.">
      <div className="space-y-4">
        <div><label className="block text-sm text-muted mb-1">Select US Men&apos;s Size</label>
          <input type="range" min={0} max={sizes.length-1} value={sel} onChange={e=>setSel(+e.target.value)} className="w-full"/>
          <div className="text-center font-mono font-bold text-xl">US {s.us_m}</div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="px-4 py-3 bg-primary-light rounded-lg text-center"><span className="block text-xs text-muted">US Men&apos;s</span><span className="font-mono font-bold text-xl">{s.us_m}</span></div>
          <div className="px-4 py-3 bg-primary-light rounded-lg text-center"><span className="block text-xs text-muted">US Women&apos;s</span><span className="font-mono font-bold text-xl">{s.us_w}</span></div>
          <div className="px-4 py-3 bg-primary-light rounded-lg text-center"><span className="block text-xs text-muted">UK</span><span className="font-mono font-bold text-xl">{s.uk}</span></div>
          <div className="px-4 py-3 bg-primary-light rounded-lg text-center"><span className="block text-xs text-muted">EU</span><span className="font-mono font-bold text-xl">{s.eu}</span></div>
          <div className="px-4 py-3 bg-primary-light rounded-lg text-center col-span-2"><span className="block text-xs text-muted">Foot Length</span><span className="font-mono font-bold text-xl">{s.cm} cm</span></div>
        </div>
      </div>
    </CalculatorShell>
  );
}
