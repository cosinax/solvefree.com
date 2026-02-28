import { PageShell } from "@/components/PageShell";
import { SearchableGrid } from "@/components/SearchableGrid";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "RF & Antenna Calculators",
  description: "Free RF and antenna calculators: wavelength, dipole length, path loss, link budget, VSWR, dBm conversion, antenna gain, noise figure, skin depth, coaxial cable parameters.",
  openGraph: {
    type: "website",
    siteName: "SolveFree",
    title: "RF & Antenna Calculators — SolveFree",
    description: "Free RF calculators: wavelength, path loss, VSWR, link budget, noise figure, coax.",
    url: "https://solvefree.com/rf",
  },
  alternates: { canonical: "https://solvefree.com/rf" },
};

const calculators = [
  { title: "Wavelength / Frequency", description: "Convert between frequency and wavelength, plus half/quarter wave", href: "/rf/wavelength", icon: "waves" },
  { title: "Dipole Antenna Length", description: "Half-wave and quarter-wave dipole lengths from frequency", href: "/rf/dipole-antenna", icon: "satellite" },
  { title: "Free-Space Path Loss", description: "FSPL in dB from distance and frequency", href: "/rf/path-loss", icon: "signal" },
  { title: "RF Link Budget", description: "Received power and link margin from Tx/Rx parameters", href: "/rf/link-budget", icon: "link" },
  { title: "VSWR & Return Loss", description: "Convert VSWR, reflection coefficient, and return loss", href: "/rf/vswr", icon: "arrow-left-right" },
  { title: "dBm / Watt Converter", description: "Convert between dBm, Watts, mW, and RMS voltage", href: "/rf/dBm-converter", icon: "zap" },
  { title: "Antenna Gain & Aperture", description: "Gain, effective aperture, and beamwidth for dish antennas", href: "/rf/antenna-gain", icon: "target" },
  { title: "Noise Figure & Temperature", description: "Noise figure, noise temperature, and Friis cascaded NF", href: "/rf/noise-figure", icon: "waves" },
  { title: "Skin Depth Calculator", description: "RF skin depth in conductors by frequency and material", href: "/rf/skin-depth", icon: "flask" },
  { title: "Coaxial Cable Parameters", description: "Impedance, capacitance, inductance, and velocity factor", href: "/rf/coax-calculator", icon: "plug" },
];

export default function RfPage() {
  return (
    <PageShell title="RF & Antenna Calculators" description="Wavelength, path loss, link budgets, VSWR, antenna gain, and more.">
      <SearchableGrid items={calculators} />
    </PageShell>
  );
}
