"use client";
import { useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
function ipToNum(ip: string): number { const p=ip.split(".").map(Number); return ((p[0]<<24)|(p[1]<<16)|(p[2]<<8)|p[3])>>>0; }
function numToIp(n: number): string { return [(n>>>24)&255,(n>>>16)&255,(n>>>8)&255,n&255].join("."); }
function isValidIp(ip: string): boolean { const p=ip.split("."); return p.length===4&&p.every(o=>{const n=parseInt(o);return n>=0&&n<=255&&o===n.toString()}); }
export default function IpCalculatorPage() {
  const [ip, setIp] = useState("192.168.1.100");
  const [cidr, setCidr] = useState("24");
  const c = parseInt(cidr);
  const valid = isValidIp(ip) && c >= 0 && c <= 32;
  const ipNum = valid ? ipToNum(ip) : 0;
  const mask = valid ? (~0 << (32 - c)) >>> 0 : 0;
  const network = (ipNum & mask) >>> 0;
  const broadcast = (network | ~mask) >>> 0;
  const firstHost = network + 1;
  const lastHost = broadcast - 1;
  const totalHosts = Math.pow(2, 32 - c) - 2;
  const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
  return (
    <CalculatorShell title="IP Address Calculator" description="Subnet calculator: network, broadcast, host range, and mask.">
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2"><label className="block text-sm text-muted mb-1">IP Address</label><input type="text" value={ip} onChange={e=>setIp(e.target.value)} className={ic}/></div>
          <div><label className="block text-sm text-muted mb-1">CIDR (/{cidr})</label><input type="number" value={cidr} onChange={e=>setCidr(e.target.value)} min="0" max="32" className={ic}/></div>
        </div>
        {valid && c < 31 && <div className="space-y-2">
          {[{l:"Network",v:numToIp(network)},{l:"Subnet Mask",v:numToIp(mask)},{l:"Broadcast",v:numToIp(broadcast)},{l:"First Host",v:numToIp(firstHost)},{l:"Last Host",v:numToIp(lastHost)},{l:"Total Hosts",v:totalHosts.toLocaleString()}].map(r=>
            <div key={r.l} className="flex justify-between items-center px-4 py-2 bg-primary-light rounded-lg">
              <span className="text-sm text-muted">{r.l}</span><span className="font-mono font-semibold">{r.v}</span>
            </div>
          )}
        </div>}
        {!isValidIp(ip) && ip && <p className="text-xs text-danger">Invalid IP address format</p>}
      </div>
    </CalculatorShell>
  );
}
