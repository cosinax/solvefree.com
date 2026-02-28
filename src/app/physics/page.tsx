import { PageShell } from "@/components/PageShell";
import { SearchableGrid } from "@/components/SearchableGrid";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Physics Calculators",
  description:
    "Free physics calculators: velocity, force, energy, pressure, projectile motion, pendulum, waves, gravity, half-life, ideal gas, and more.",
  openGraph: {
    type: "website",
    siteName: "SolveFree",
    title: "Physics Calculators — SolveFree",
    description: "Free physics calculators: velocity, force, energy, projectile motion, waves, thermodynamics.",
    url: "https://solvefree.com/physics",
  },
  alternates: { canonical: "https://solvefree.com/physics" },
};

const calculators = [
  {
    title: "Velocity Calculator",
    description: "Solve for velocity, distance, or time (v = d/t)",
    href: "/physics/velocity",
    icon: "wind",
  },
  {
    title: "Force Calculator",
    description: "F = ma — solve for force, mass, or acceleration",
    href: "/physics/force",
    icon: "dumbbell",
  },
  {
    title: "Energy Calculator",
    description: "Kinetic energy, potential energy, and work",
    href: "/physics/energy",
    icon: "zap",
  },
  {
    title: "Pressure Calculator",
    description: "P = F/A — solve for pressure, force, or area",
    href: "/physics/pressure",
    icon: "circle",
  },
  {
    title: "Free Fall Calculator",
    description: "Time to fall, impact velocity, and distance",
    href: "/physics/free-fall",
    icon: "wind",
  },
  {
    title: "Projectile Motion",
    description: "Range, max height, time of flight, trajectory table",
    href: "/physics/projectile",
    icon: "target",
  },
  {
    title: "Pendulum Calculator",
    description: "Period, frequency, and angular frequency",
    href: "/physics/pendulum",
    icon: "hourglass",
  },
  {
    title: "Wave Calculator",
    description: "Wave speed, frequency, and wavelength (v = fλ)",
    href: "/physics/waves",
    icon: "waves",
  },
  {
    title: "Gravitational Force",
    description: "Newton's law of gravitation, surface gravity",
    href: "/physics/gravitational",
    icon: "globe-2",
  },
  {
    title: "Half-Life Calculator",
    description: "Radioactive decay, remaining quantity, decay constant",
    href: "/physics/half-life",
    icon: "atom",
  },
  {
    title: "Ideal Gas Law",
    description: "PV = nRT — solve for pressure, volume, moles, or temperature",
    href: "/physics/ideal-gas",
    icon: "flask",
  },
  {
    title: "Thermal Expansion",
    description: "Linear and volumetric expansion by material",
    href: "/physics/thermal-expansion",
    icon: "thermometer",
  },
  {
    title: "Percent Error",
    description: "Percent error, absolute error, and percent difference",
    href: "/physics/percent-error",
    icon: "bar-chart",
  },
  {
    title: "Work & Power",
    description: "Work = F×d×cos(θ), Power = W/t, torque power",
    href: "/physics/work-power",
    icon: "wrench",
  },
  { title: "Acceleration Calculator", description: "Find acceleration via F=ma, Δv/t, or kinematics", href: "/physics/acceleration", icon: "rocket" },
  { title: "Momentum Calculator", description: "Momentum, kinetic energy, and inelastic collisions", href: "/physics/momentum", icon: "zap" },
  { title: "Torque Calculator", description: "τ = F × r × sin(θ) — solve for torque, force, or moment arm", href: "/physics/torque", icon: "settings" },
  { title: "Buoyancy Calculator", description: "Buoyant force and whether an object floats or sinks", href: "/physics/buoyancy", icon: "circle" },
  { title: "Hooke's Law", description: "F = kx — spring force, constant, or displacement", href: "/physics/hookes-law", icon: "sliders" },
  { title: "Thin Lens / Mirror", description: "1/f = 1/do + 1/di — image distance, magnification, type", href: "/physics/thin-lens", icon: "eye" },
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
