import { PageShell } from "@/components/PageShell";
import { SearchableGrid } from "@/components/SearchableGrid";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Network Tools",
  description: "Free networking tools: bandwidth calculator, subnet calculator, CIDR visualizer, WiFi channels, port reference, TCP throughput, and more.",
  openGraph: {
    type: "website",
    siteName: "SolveFree",
    title: "Network Calculators — SolveFree",
    description: "Free network calculators: bandwidth, subnet, CIDR, WiFi, ports, and latency.",
    url: "https://solvefree.com/network",
  },
  alternates: { canonical: "https://solvefree.com/network" },
};

const calculators = [
  { title: "Bandwidth Calculator", description: "File transfer time from speed and file size", href: "/network/bandwidth", icon: "📡" },
  { title: "TCP Throughput", description: "Max throughput from window size and RTT", href: "/network/tcp-throughput", icon: "📊" },
  { title: "CIDR Range Visualizer", description: "Subnet range, hosts, and mask from CIDR", href: "/network/cidr-range", icon: "🗺️" },
  { title: "Subnet Cheat Sheet", description: "CIDR prefixes, masks, host counts at a glance", href: "/network/subnet-cheatsheet", icon: "🕸️" },
  { title: "Packet Loss Impact", description: "How packet loss degrades TCP throughput", href: "/network/packet-loss", icon: "📉" },
  { title: "Latency Calculator", description: "Theoretical minimum latency by distance", href: "/network/latency-calculator", icon: "⏱️" },
  { title: "WiFi Channel Reference", description: "2.4 GHz & 5 GHz channels and frequencies", href: "/network/wifi-channels", icon: "📶" },
  { title: "Common Port Reference", description: "Well-known TCP/UDP port numbers", href: "/network/port-reference", icon: "🔌" },
];

export default function NetworkPage() {
  return (
    <PageShell title="Network Tools" description="Bandwidth, subnets, latency, WiFi channels, port reference, and more">
      <SearchableGrid items={calculators} placeholder="Search network tools..." />
    </PageShell>
  );
}
