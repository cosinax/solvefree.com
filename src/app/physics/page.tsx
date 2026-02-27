import { PageShell } from "@/components/PageShell";
import { SearchableGrid } from "@/components/SearchableGrid";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Physics Calculators",
  description:
    "Free physics calculators: velocity, force, energy, pressure, projectile motion, pendulum, waves, gravity, half-life, ideal gas, and more.",
};

const calculators = [
  {
    title: "Velocity Calculator",
    description: "Solve for velocity, distance, or time (v = d/t)",
    href: "/physics/velocity",
    icon: "💨",
  },
  {
    title: "Force Calculator",
    description: "F = ma — solve for force, mass, or acceleration",
    href: "/physics/force",
    icon: "💪",
  },
  {
    title: "Energy Calculator",
    description: "Kinetic energy, potential energy, and work",
    href: "/physics/energy",
    icon: "⚡",
  },
  {
    title: "Pressure Calculator",
    description: "P = F/A — solve for pressure, force, or area",
    href: "/physics/pressure",
    icon: "🔵",
  },
  {
    title: "Free Fall Calculator",
    description: "Time to fall, impact velocity, and distance",
    href: "/physics/free-fall",
    icon: "🪂",
  },
  {
    title: "Projectile Motion",
    description: "Range, max height, time of flight, trajectory table",
    href: "/physics/projectile",
    icon: "🎯",
  },
  {
    title: "Pendulum Calculator",
    description: "Period, frequency, and angular frequency",
    href: "/physics/pendulum",
    icon: "⏳",
  },
  {
    title: "Wave Calculator",
    description: "Wave speed, frequency, and wavelength (v = fλ)",
    href: "/physics/waves",
    icon: "〰️",
  },
  {
    title: "Gravitational Force",
    description: "Newton's law of gravitation, surface gravity",
    href: "/physics/gravitational",
    icon: "🌍",
  },
  {
    title: "Half-Life Calculator",
    description: "Radioactive decay, remaining quantity, decay constant",
    href: "/physics/half-life",
    icon: "☢️",
  },
  {
    title: "Ideal Gas Law",
    description: "PV = nRT — solve for pressure, volume, moles, or temperature",
    href: "/physics/ideal-gas",
    icon: "🧪",
  },
  {
    title: "Thermal Expansion",
    description: "Linear and volumetric expansion by material",
    href: "/physics/thermal-expansion",
    icon: "🌡️",
  },
  {
    title: "Percent Error",
    description: "Percent error, absolute error, and percent difference",
    href: "/physics/percent-error",
    icon: "📊",
  },
  {
    title: "Work & Power",
    description: "Work = F×d×cos(θ), Power = W/t, torque power",
    href: "/physics/work-power",
    icon: "🔧",
  },
];

export default function PhysicsPage() {
  return (
    <PageShell
      title="Physics Calculators"
      description="Velocity, force, energy, pressure, projectile motion, waves, thermodynamics, and more"
    >
      <SearchableGrid items={calculators} placeholder="Search physics calculators..." />
    </PageShell>
  );
}
