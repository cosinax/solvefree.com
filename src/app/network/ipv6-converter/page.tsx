"use client";
import { useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";

function expandIPv6(addr: string): string | null {
  addr = addr.trim().toLowerCase();
  if (!addr) return null;

  // Handle IPv4-mapped IPv6: ::ffff:192.168.1.1
  const ipv4MappedMatch = addr.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  if (ipv4MappedMatch) {
    const parts = ipv4MappedMatch[1].split(".").map(Number);
    if (parts.some(p => p > 255 || p < 0)) return null;
    const hex = parts.map(p => p.toString(16).padStart(2, "0")).join("");
    addr = `0000:0000:0000:0000:0000:ffff:${hex.slice(0, 4)}:${hex.slice(4)}`;
    return addr;
  }

  // Expand :: shorthand
  const halves = addr.split("::");
  if (halves.length > 2) return null;

  let groups: string[];
  if (halves.length === 2) {
    const left = halves[0] ? halves[0].split(":") : [];
    const right = halves[1] ? halves[1].split(":") : [];
    const missing = 8 - left.length - right.length;
    if (missing < 0) return null;
    groups = [...left, ...Array(missing).fill("0"), ...right];
  } else {
    groups = addr.split(":");
  }

  if (groups.length !== 8) return null;

  const padded = groups.map(g => {
    if (!/^[0-9a-f]{1,4}$/.test(g)) return null;
    return g.padStart(4, "0");
  });

  if (padded.some(g => g === null)) return null;
  return (padded as string[]).join(":");
}

function compressIPv6(expanded: string): string {
  const groups = expanded.split(":");

  // Find longest run of consecutive "0000" groups
  let bestStart = -1, bestLen = 0, curStart = -1, curLen = 0;
  for (let i = 0; i < groups.length; i++) {
    if (groups[i] === "0000") {
      if (curStart === -1) { curStart = i; curLen = 1; }
      else curLen++;
      if (curLen > bestLen) { bestStart = curStart; bestLen = curLen; }
    } else {
      curStart = -1; curLen = 0;
    }
  }

  let result = groups.map(g => g.replace(/^0+/, "") || "0");

  if (bestLen >= 2) {
    result = [
      ...result.slice(0, bestStart),
      "",
      ...result.slice(bestStart + bestLen),
    ];
    if (bestStart === 0) result.unshift("");
    if (bestStart + bestLen === 8) result.push("");
  }

  return result.join(":").replace(/:{3,}/, "::");
}

function ipv4ToIPv6(ipv4: string): string | null {
  const parts = ipv4.trim().split(".").map(Number);
  if (parts.length !== 4 || parts.some(p => isNaN(p) || p < 0 || p > 255)) return null;
  const hex = parts.map(p => p.toString(16).padStart(2, "0")).join("");
  return `::ffff:${hex.slice(0, 4)}:${hex.slice(4)}`;
}

function getIPv6Type(expanded: string): string {
  const g = expanded.split(":");
  if (g.every(x => x === "0000")) return "Unspecified (::)";
  if (g.slice(0, 7).every(x => x === "0000") && g[7] === "0001") return "Loopback (::1)";
  if (g.slice(0, 5).every(x => x === "0000") && g[5] === "ffff") return "IPv4-mapped (::ffff:x.x.x.x)";
  if (g[0].startsWith("fe80") || g[0].startsWith("fe9") || g[0].startsWith("fea") || g[0].startsWith("feb")) return "Link-local";
  if (g[0].startsWith("fc") || g[0].startsWith("fd")) return "Unique local (ULA)";
  if (g[0].startsWith("ff")) return "Multicast";
  if (g[0].startsWith("20") || g[0].startsWith("26") || g[0].startsWith("2a")) return "Global unicast";
  return "Global unicast";
}

export default function IPv6ConverterPage() {
  const [input, setInput] = useState("2001:db8::1");
  const [ipv4Input, setIPv4Input] = useState("192.168.1.1");

  const expanded = expandIPv6(input);
  const compressed = expanded ? compressIPv6(expanded) : null;
  const addrType = expanded ? getIPv6Type(expanded) : null;

  // Convert individual groups to decimal
  const groupDecimals = expanded
    ? expanded.split(":").map(g => parseInt(g, 16))
    : null;

  const ipv4mapped = ipv4ToIPv6(ipv4Input);

  const tb = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm";

  return (
    <CalculatorShell title="IPv6 Address Tool" description="Expand, compress, and analyze IPv6 addresses. IPv4-mapped IPv6 conversion.">
      <div className="space-y-5">

        {/* IPv6 expander/compressor */}
        <div>
          <label className="block text-sm text-muted mb-1">IPv6 Address</label>
          <input type="text" value={input} onChange={e => setInput(e.target.value)}
            className={tb} placeholder="e.g. 2001:db8::1 or ::ffff:192.168.1.1" />
          <div className="flex flex-wrap gap-1 mt-1">
            {["2001:db8::1", "::1", "::", "fe80::1", "::ffff:192.168.1.1", "2001:0db8:85a3::8a2e:0370:7334"].map(ex => (
              <button key={ex} onClick={() => setInput(ex)}
                className="text-xs px-2 py-0.5 bg-background border border-card-border rounded hover:bg-primary-light transition-colors font-mono">
                {ex}
              </button>
            ))}
          </div>
        </div>

        {expanded ? (
          <div className="space-y-2">
            <div className="space-y-1 text-xs font-mono">
              {[
                ["Expanded (full)", expanded],
                ["Compressed", compressed ?? "—"],
                ["Type", addrType ?? "—"],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between items-start px-3 py-2 bg-background border border-card-border rounded gap-3">
                  <span className="text-muted shrink-0">{label}</span>
                  <span className="font-semibold break-all text-right">{val}</span>
                </div>
              ))}
            </div>

            {/* Group breakdown */}
            <div>
              <p className="text-xs text-muted mb-1">Groups (hex → decimal):</p>
              <div className="grid grid-cols-4 gap-1">
                {expanded.split(":").map((g, i) => (
                  <div key={i} className="px-2 py-1.5 bg-background border border-card-border rounded text-center">
                    <div className="text-xs font-mono font-semibold text-primary">{g}</div>
                    <div className="text-xs text-muted">{parseInt(g, 16)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : input.trim() ? (
          <p className="text-sm text-red-500">Invalid IPv6 address.</p>
        ) : null}

        {/* IPv4 → IPv6 mapped */}
        <div className="border-t border-card-border pt-4">
          <p className="text-sm font-semibold mb-2">IPv4-Mapped IPv6 (::ffff:x.x.x.x)</p>
          <label className="block text-xs text-muted mb-1">IPv4 Address</label>
          <input type="text" value={ipv4Input} onChange={e => setIPv4Input(e.target.value)}
            className={tb} placeholder="e.g. 192.168.1.1" />
          {ipv4mapped ? (
            <div className="mt-2 space-y-1 text-xs font-mono">
              {[
                ["IPv4-mapped IPv6 (compressed)", ipv4mapped],
                ["IPv4-mapped IPv6 (expanded)", expandIPv6(ipv4mapped) ?? "—"],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between items-start px-3 py-2 bg-background border border-card-border rounded gap-3">
                  <span className="text-muted shrink-0">{label}</span>
                  <span className="font-semibold break-all text-right">{val}</span>
                </div>
              ))}
            </div>
          ) : ipv4Input.trim() ? (
            <p className="text-sm text-red-500 mt-1">Invalid IPv4 address.</p>
          ) : null}
        </div>

        {/* Quick reference */}
        <div className="border-t border-card-border pt-3">
          <p className="text-xs text-muted mb-2 font-semibold">Special IPv6 Addresses</p>
          <div className="space-y-1 text-xs font-mono">
            {[
              ["::1", "Loopback (≈ 127.0.0.1)"],
              ["::", "Unspecified (≈ 0.0.0.0)"],
              ["::ffff:0:0/96", "IPv4-mapped"],
              ["fe80::/10", "Link-local"],
              ["fc00::/7", "Unique local (ULA)"],
              ["ff00::/8", "Multicast"],
              ["2000::/3", "Global unicast"],
              ["2001:db8::/32", "Documentation (examples)"],
            ].map(([addr, desc]) => (
              <div key={addr} className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded gap-2">
                <span className="text-primary">{addr}</span>
                <span className="text-muted text-right">{desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CalculatorShell>
  );
}
