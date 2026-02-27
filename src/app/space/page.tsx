import { PageShell } from "@/components/PageShell";
import { SearchableGrid } from "@/components/SearchableGrid";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Space & Astronomy Calculators",
  description:
    "Free space and astronomy calculators: orbital period, escape velocity, rocket equation, Hohmann transfer, black holes, light travel time, and more.",
};

const calculators = [
  {
    title: "Orbital Period",
    description: "T = 2π√(a³/GM) — period from orbit radius and central mass",
    href: "/space/orbital-period",
    icon: "🪐",
  },
  {
    title: "Escape Velocity",
    description: "Minimum speed to escape a body's gravity well",
    href: "/space/escape-velocity",
    icon: "🚀",
  },
  {
    title: "Rocket Equation",
    description: "Tsiolkovsky Δv = Isp × g₀ × ln(m₀/mf)",
    href: "/space/rocket-equation",
    icon: "🔥",
  },
  {
    title: "Hohmann Transfer ΔV",
    description: "Minimum energy orbit transfer between two circular orbits",
    href: "/space/hohmann-transfer",
    icon: "🛸",
  },
  {
    title: "Gravitational Time Dilation",
    description: "How gravity slows time near massive bodies",
    href: "/space/gravitational-time-dilation",
    icon: "⌛",
  },
  {
    title: "Light Travel Time",
    description: "Travel time at light speed between astronomical distances",
    href: "/space/light-travel-time",
    icon: "✨",
  },
  {
    title: "Black Hole Properties",
    description: "Schwarzschild radius, Hawking temperature, evaporation time",
    href: "/space/black-hole",
    icon: "⚫",
  },
  {
    title: "Weight on Other Worlds",
    description: "Your weight on every planet, moon, and the Sun",
    href: "/space/planet-weight",
    icon: "⚖️",
  },
  {
    title: "Stellar Luminosity",
    description: "Star luminosity, temperature, radius, and habitable zone",
    href: "/space/stellar-luminosity",
    icon: "⭐",
  },
  {
    title: "Orbital Speed",
    description: "Circular orbital velocity at any altitude around any body",
    href: "/space/orbital-speed",
    icon: "🌐",
  },
  {
    title: "Delta-V Budget",
    description: "Stack mission maneuvers and estimate total Δv requirements",
    href: "/space/delta-v-budget",
    icon: "📊",
  },
  {
    title: "Angular Size",
    description: "Angular size of objects by physical size and distance",
    href: "/space/angular-size",
    icon: "🔭",
  },
];

export default function SpacePage() {
  return (
    <PageShell
      title="Space & Astronomy Calculators"
      description="Orbital mechanics, rocket science, black holes, stellar physics, and more."
    >
      <SearchableGrid items={calculators} />
    </PageShell>
  );
}
