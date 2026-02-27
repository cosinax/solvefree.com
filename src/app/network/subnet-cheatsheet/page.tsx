"use client";
import { useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";

const subnets = [
  { cidr: "/8",  mask: "255.0.0.0",       hosts: "16,777,214",   class: "A" },
  { cidr: "/16", mask: "255.255.0.0",     hosts: "65,534",       class: "B" },
  { cidr: "/24", mask: "255.255.255.0",   hosts: "254",          class: "C" },
  { cidr: "/25", mask: "255.255.255.128", hosts: "126",          class: "" },
  { cidr: "/26", mask: "255.255.255.192", hosts: "62",           class: "" },
  { cidr: "/27", mask: "255.255.255.224", hosts: "30",           class: "" },
  { cidr: "/28", mask: "255.255.255.240", hosts: "14",           class: "" },
  { cidr: "/29", mask: "255.255.255.248", hosts: "6",            class: "" },
  { cidr: "/30", mask: "255.255.255.252", hosts: "2",            class: "" },
  { cidr: "/31", mask: "255.255.255.254", hosts: "2 (p2p)",      class: "" },
  { cidr: "/32", mask: "255.255.255.255", hosts: "1 (host)",     class: "" },
];

const privateRanges = [
  { range: "10.0.0.0/8",      desc: "Class A private (10.x.x.x)",        hosts: "16M+" },
  { range: "172.16.0.0/12",   desc: "Class B private (172.16–31.x.x)",   hosts: "1M+" },
  { range: "192.168.0.0/16",  desc: "Class C private (192.168.x.x)",     hosts: "65K+" },
  { range: "127.0.0.0/8",     desc: "Loopback (127.x.x.x)",              hosts: "—" },
  { range: "169.254.0.0/16",  desc: "Link-local / APIPA",                hosts: "—" },
  { range: "0.0.0.0/8",       desc: "Unspecified / 'this' network",      hosts: "—" },
  { range: "255.255.255.255", desc: "Limited broadcast",                  hosts: "—" },
];

export default function SubnetCheatsheetPage() {
  const [tab, setTab] = useState<"cidr" | "private">("cidr");
  return (
    <CalculatorShell title="Subnet Cheat Sheet" description="Quick reference for CIDR prefixes, subnet masks, host counts, and private IP ranges.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => setTab("cidr")} className={`py-2 rounded-lg text-sm font-medium ${tab === "cidr" ? "bg-primary text-white" : "bg-background border border-card-border"}`}>CIDR Prefixes</button>
          <button onClick={() => setTab("private")} className={`py-2 rounded-lg text-sm font-medium ${tab === "private" ? "bg-primary text-white" : "bg-background border border-card-border"}`}>Private Ranges</button>
        </div>
        {tab === "cidr" && (
          <div className="space-y-1">
            <div className="grid grid-cols-4 gap-1 px-3 py-1 text-xs text-muted font-semibold uppercase tracking-wide">
              <span>CIDR</span><span>Subnet Mask</span><span>Usable Hosts</span><span>Class</span>
            </div>
            {subnets.map(s => (
              <div key={s.cidr} className="grid grid-cols-4 gap-1 px-3 py-2 bg-background border border-card-border rounded-lg text-xs font-mono">
                <span className="text-primary font-semibold">{s.cidr}</span>
                <span>{s.mask}</span>
                <span>{s.hosts}</span>
                <span className="text-muted">{s.class}</span>
              </div>
            ))}
          </div>
        )}
        {tab === "private" && (
          <div className="space-y-2">
            {privateRanges.map(r => (
              <div key={r.range} className="px-4 py-3 bg-background border border-card-border rounded-lg">
                <div className="flex justify-between items-start">
                  <span className="font-mono font-semibold text-sm text-primary">{r.range}</span>
                  <span className="text-xs text-muted">{r.hosts}</span>
                </div>
                <p className="text-sm text-muted mt-0.5">{r.desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
