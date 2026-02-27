"use client";
import { useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";

const ports = [
  { port: 20, proto: "TCP", name: "FTP Data" },
  { port: 21, proto: "TCP", name: "FTP Control" },
  { port: 22, proto: "TCP", name: "SSH / SFTP" },
  { port: 23, proto: "TCP", name: "Telnet" },
  { port: 25, proto: "TCP", name: "SMTP" },
  { port: 53, proto: "TCP/UDP", name: "DNS" },
  { port: 67, proto: "UDP", name: "DHCP Server" },
  { port: 68, proto: "UDP", name: "DHCP Client" },
  { port: 69, proto: "UDP", name: "TFTP" },
  { port: 80, proto: "TCP", name: "HTTP" },
  { port: 110, proto: "TCP", name: "POP3" },
  { port: 119, proto: "TCP", name: "NNTP" },
  { port: 123, proto: "UDP", name: "NTP" },
  { port: 143, proto: "TCP", name: "IMAP" },
  { port: 161, proto: "UDP", name: "SNMP" },
  { port: 194, proto: "TCP", name: "IRC" },
  { port: 389, proto: "TCP", name: "LDAP" },
  { port: 443, proto: "TCP", name: "HTTPS" },
  { port: 445, proto: "TCP", name: "SMB / CIFS" },
  { port: 465, proto: "TCP", name: "SMTPS" },
  { port: 514, proto: "UDP", name: "Syslog" },
  { port: 587, proto: "TCP", name: "SMTP (Submission)" },
  { port: 636, proto: "TCP", name: "LDAPS" },
  { port: 993, proto: "TCP", name: "IMAPS" },
  { port: 995, proto: "TCP", name: "POP3S" },
  { port: 1194, proto: "UDP", name: "OpenVPN" },
  { port: 1433, proto: "TCP", name: "MS SQL Server" },
  { port: 1521, proto: "TCP", name: "Oracle DB" },
  { port: 2049, proto: "TCP", name: "NFS" },
  { port: 3306, proto: "TCP", name: "MySQL / MariaDB" },
  { port: 3389, proto: "TCP", name: "RDP" },
  { port: 5432, proto: "TCP", name: "PostgreSQL" },
  { port: 5900, proto: "TCP", name: "VNC" },
  { port: 6379, proto: "TCP", name: "Redis" },
  { port: 6443, proto: "TCP", name: "Kubernetes API" },
  { port: 8080, proto: "TCP", name: "HTTP Alt / Proxy" },
  { port: 8443, proto: "TCP", name: "HTTPS Alt" },
  { port: 9200, proto: "TCP", name: "Elasticsearch" },
  { port: 27017, proto: "TCP", name: "MongoDB" },
];

export default function PortReferencePage() {
  const [search, setSearch] = useState("");
  const filtered = ports.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.port.toString().includes(search) ||
    p.proto.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <CalculatorShell title="Common Port Reference" description="Well-known TCP/UDP port numbers for common protocols and services.">
      <div className="space-y-4">
        <input
          type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, port, or protocol..."
          className="w-full px-4 py-2.5 bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
        />
        <div className="space-y-1 max-h-96 overflow-y-auto">
          {filtered.map(p => (
            <div key={p.port} className="flex items-center justify-between px-4 py-2 bg-background border border-card-border rounded-lg text-sm">
              <span className="font-mono font-bold text-primary w-16">{p.port}</span>
              <span className="flex-1 font-medium">{p.name}</span>
              <span className={`text-xs px-2 py-0.5 rounded font-mono ${p.proto === "TCP" ? "bg-blue-50 dark:bg-blue-950 text-blue-600" : p.proto === "UDP" ? "bg-green-50 dark:bg-green-950 text-green-600" : "bg-purple-50 dark:bg-purple-950 text-purple-600"}`}>{p.proto}</span>
            </div>
          ))}
          {filtered.length === 0 && <p className="text-sm text-muted text-center py-4">No ports found.</p>}
        </div>
        <p className="text-xs text-muted">Ports 0–1023 are well-known ports. Ports 1024–49151 are registered. Above 49151 are dynamic/private.</p>
      </div>
    </CalculatorShell>
  );
}
