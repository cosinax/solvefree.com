"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

function ipToNum(ip: string): number {
  const p = ip.split(".").map(Number);
  return ((p[0] << 24) | (p[1] << 16) | (p[2] << 8) | p[3]) >>> 0;
}
function numToIp(n: number): string {
  return [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join(".");
}
function isValidIp(ip: string): boolean {
  const p = ip.split(".");
  return p.length === 4 && p.every(o => { const n = parseInt(o); return n >= 0 && n <= 255 && o === n.toString(); });
}

export default function CidrRangePage() {
  const [v, setV] = useHashState({ cidr: "192.168.1.0/24" });
  const parts = v.cidr.trim().split("/");
  const ip = parts[0];
  const prefix = parseInt(parts[1]);
  const valid = isValidIp(ip) && !isNaN(prefix) && prefix >= 0 && prefix <= 32;

  let network = 0, broadcast = 0, mask = 0, firstHost = 0, lastHost = 0, totalHosts = 0;
  if (valid) {
    const ipNum = ipToNum(ip);
    mask = (~0 << (32 - prefix)) >>> 0;
    network = (ipNum & mask) >>> 0;
    broadcast = (network | ~mask) >>> 0;
    firstHost = prefix < 31 ? network + 1 : network;
    lastHost = prefix < 31 ? broadcast - 1 : broadcast;
    totalHosts = prefix >= 31 ? Math.pow(2, 32 - prefix) : Math.pow(2, 32 - prefix) - 2;
  }

  const ic = "w-full px-4 py-3 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

  return (
    <CalculatorShell title="CIDR Range Visualizer" description="Enter a CIDR block and see the full address range, usable hosts, and subnet details.">
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-muted mb-1">CIDR Notation</label>
          <input type="text" value={v.cidr} onChange={e => setV({ cidr: e.target.value })} placeholder="e.g. 10.0.0.0/8" className={ic} />
        </div>
        {valid && (
          <div className="space-y-2">
            {[
              { l: "Network Address", v: numToIp(network) },
              { l: "Subnet Mask", v: numToIp(mask) },
              { l: "Broadcast", v: numToIp(broadcast) },
              { l: "First Usable", v: prefix < 31 ? numToIp(firstHost) : "N/A" },
              { l: "Last Usable", v: prefix < 31 ? numToIp(lastHost) : "N/A" },
              { l: "Usable Hosts", v: totalHosts.toLocaleString() },
              { l: "Total Addresses", v: Math.pow(2, 32 - prefix).toLocaleString() },
              { l: "Prefix Length", v: "/" + prefix },
              { l: "Wildcard Mask", v: numToIp(~mask >>> 0) },
            ].map(r => (
              <div key={r.l} className="flex justify-between items-center px-4 py-2.5 bg-background border border-card-border rounded-lg text-sm">
                <span className="text-muted">{r.l}</span>
                <span className="font-mono font-semibold">{r.v}</span>
              </div>
            ))}
          </div>
        )}
        {!valid && v.cidr && <p className="text-xs text-danger">Invalid CIDR notation. Example: 192.168.1.0/24</p>}
        <div className="space-y-1">
          <p className="text-xs text-muted font-semibold">Common CIDR sizes:</p>
          <div className="grid grid-cols-4 gap-1 text-xs font-mono">
            {[["/8","16M hosts"],["/16","65K hosts"],["/24","254 hosts"],["/28","14 hosts"],["/29","6 hosts"],["/30","2 hosts"],["/31","2 hosts (p2p)"],["/32","1 host"]].map(([c,h]) => (
              <button key={c} onClick={() => setV({ cidr: (v.cidr.split("/")[0] || "10.0.0.0") + c })}
                className="px-2 py-1.5 bg-background border border-card-border rounded hover:bg-primary-light text-left">
                <span className="block text-primary">{c}</span>
                <span className="text-muted">{h}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </CalculatorShell>
  );
}
