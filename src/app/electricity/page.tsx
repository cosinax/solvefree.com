import { PageShell } from "@/components/PageShell";
import { SearchableGrid } from "@/components/SearchableGrid";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Electricity & Electronics",
  description: "Free electrical calculators: Ohm's law, power, resistance, wire gauge, LED resistor, and more.",
  openGraph: {
    title: "Electronics Calculators — SolveFree",
    description: "Free electronics calculators: Ohm's law, resistors, capacitors, voltage divider, wire gauge.",
    url: "https://solvefree.com/electricity",
  },
  alternates: { canonical: "https://solvefree.com/electricity" },
};

const calculators = [
  { title: "Ohm's Law", description: "Calculate voltage, current, resistance, and power", href: "/electricity/ohms-law", icon: "⚡" },
  { title: "Power Calculator", description: "Calculate watts, amps, volts, and ohms", href: "/electricity/power", icon: "🔋" },
  { title: "Resistor Color Code", description: "Decode resistor color bands to resistance value", href: "/electricity/resistor-color", icon: "〰️" },
  { title: "LED Resistor", description: "Calculate resistor needed for an LED circuit", href: "/electricity/led-resistor", icon: "💡" },
  { title: "Voltage Divider", description: "Calculate output voltage of a resistor divider", href: "/electricity/voltage-divider", icon: "↕️" },
  { title: "Capacitor Calculator", description: "Capacitance in series and parallel", href: "/electricity/capacitor", icon: "⬛" },
  { title: "Inductor Calculator", description: "Inductance in series and parallel", href: "/electricity/inductor", icon: "🔄" },
  { title: "RC Time Constant", description: "Calculate RC circuit time constant and charging", href: "/electricity/rc-time", icon: "⏳" },
  { title: "Wire Gauge (AWG)", description: "AWG wire size, resistance, and current capacity", href: "/electricity/wire-gauge", icon: "🔌" },
  { title: "Electricity Cost", description: "Calculate electricity cost from watts and hours", href: "/electricity/cost", icon: "💰" },
  { title: "Battery Life", description: "Estimate battery runtime from capacity and load", href: "/electricity/battery-life", icon: "🪫" },
  { title: "Transformer Calculator", description: "Calculate transformer turns ratio and voltages", href: "/electricity/transformer", icon: "🔁" },
  { title: "dBm to Watts", description: "Convert between dBm and watts/milliwatts", href: "/electricity/dbm-watts", icon: "📡" },
  { title: "PCB Trace Width", description: "Calculate PCB trace width for current carrying", href: "/electricity/pcb-trace", icon: "🖨️" },
  { title: "Frequency / Wavelength", description: "Convert between frequency and wavelength", href: "/electricity/frequency-wavelength", icon: "〜" },
];

export default function ElectricityPage() {
  return (
    <PageShell title="Electricity & Electronics" description="Ohm's law, power, resistors, capacitors, circuit calculators, and more">
      <SearchableGrid items={calculators} placeholder="Search electrical calculators..." />
    </PageShell>
  );
}
