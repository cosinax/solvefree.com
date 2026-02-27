"use client";
import { useState, useEffect } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
export default function EpochPage() {
  const [now, setNow] = useState(Date.now());
  const [epoch, setEpoch] = useState("");
  useEffect(() => { const i=setInterval(()=>setNow(Date.now()),1000); return ()=>clearInterval(i); }, []);
  const ts = parseInt(epoch);
  const date = !isNaN(ts) ? new Date(ts > 1e12 ? ts : ts * 1000) : null;
  const valid = date && !isNaN(date.getTime());
  const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
  return (
    <CalculatorShell title="Epoch / Timestamp Converter" description="Convert between epoch timestamps and human-readable dates.">
      <div className="space-y-4">
        <div className="bg-primary-light rounded-xl p-4 text-center">
          <span className="block text-sm text-muted">Current Epoch (seconds)</span>
          <span className="block font-mono font-bold text-2xl text-primary">{Math.floor(now/1000)}</span>
          <span className="block text-xs text-muted">{new Date(now).toISOString()}</span>
        </div>
        <div><label className="block text-sm text-muted mb-1">Enter Epoch Timestamp</label>
          <input type="number" value={epoch} onChange={e=>setEpoch(e.target.value)} placeholder="e.g. 1700000000" className={ic}/></div>
        {valid && date && <div className="space-y-1.5">
          {[{l:"Local",v:date.toLocaleString()},{l:"UTC",v:date.toUTCString()},{l:"ISO 8601",v:date.toISOString()},{l:"Relative",v:(() => {const d=Math.abs(Date.now()-date.getTime());const days=Math.floor(d/86400000);return days>0?`${days} days ${Date.now()>date.getTime()?"ago":"from now"}`:`${Math.floor(d/3600000)} hours ${Date.now()>date.getTime()?"ago":"from now"}`})()}].map(r=>
            <div key={r.l} className="flex justify-between items-center px-4 py-2 bg-background border border-card-border rounded-lg text-sm">
              <span className="text-muted">{r.l}</span><span className="font-mono font-semibold text-xs">{r.v}</span>
            </div>
          )}
        </div>}
      </div>
    </CalculatorShell>
  );
}
