import { PageShell } from "@/components/PageShell";
import { SearchableGrid } from "@/components/SearchableGrid";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "RF & Antenna Calculators",
  description: "Free RF and antenna calculators: wavelength, dipole length, path loss, link budget, VSWR, dBm conversion, antenna gain, noise figure, skin depth, coaxial cable parameters.",
};

const calculators = [
  { title: "Wavelength / Frequency", description: "Convert between frequency and wavelength, plus half/quarter wave", href: "/rf/wavelength", icon: "〰️" },
  { title: "Dipole Antenna Length", description: "Half-wave and quarter-wave dipole lengths from frequency", href: "/rf/dipole-antenna", icon: "📡" },
  { title: "Free-Space Path Loss", description: "FSPL in dB from distance and frequency", href: "/rf/path-loss", icon: "📶" },
  { title: "RF Link Budget", description: "Received power and link margin from Tx/Rx parameters", href: "/rf/link-budget", icon: "🔗" },
  { title: "VSWR & Return Loss", description: "Convert VSWR, reflection coefficient, and return loss", href: "/rf/vswr", icon: "↔️" },
  { title: "dBm / Watt Converter", description: "Convert between dBm, Watts, mW, and RMS voltage", href: "/rf/dBm-converter", icon: "⚡" },
  { title: "Antenna Gain & Aperture", description: "Gain, effective aperture, and beamwidth for dish antennas", href: "/rf/antenna-gain", icon: "🎯" },
  { title: "Noise Figure & Temperature", description: "Noise figure, noise temperature, and Friis cascaded NF", href: "/rf/noise-figure", icon: "🔊" },
  { title: "Skin Depth Calculator", description: "RF skin depth in conductors by frequency and material", href: "/rf/skin-depth", icon: "🔬" },
  { title: "Coaxial Cable Parameters", description: "Impedance, capacitance, inductance, and velocity factor", href: "/rf/coax-calculator", icon: "🔌" },
];

export default function RfPage() {
  return (
    <PageShell title="RF & Antenna Calculators" description="Wavelength, path loss, link budgets, VSWR, antenna gain, and more.">
      <SearchableGrid items={calculators} />
    </PageShell>
  );
}
