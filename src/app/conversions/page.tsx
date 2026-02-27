import { PageShell } from "@/components/PageShell";
import { SearchableGrid } from "@/components/SearchableGrid";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Unit Converters",
  description:
    "Free unit converters: length, weight, temperature, speed, area, volume, data, time, and more.",
  openGraph: {
    title: "Unit Converters — SolveFree",
    description: "Free unit converters for length, weight, temperature, speed, area, volume, and more.",
    url: "https://solvefree.com/conversions",
  },
  alternates: { canonical: "https://solvefree.com/conversions" },
};

const calculators = [
  {
    title: "Length Converter",
    description: "Miles, kilometers, feet, meters, inches, centimeters",
    href: "/conversions/length",
    icon: "📏",
  },
  {
    title: "Weight Converter",
    description: "Pounds, kilograms, ounces, grams, stones",
    href: "/conversions/weight",
    icon: "⚖️",
  },
  {
    title: "Temperature Converter",
    description: "Fahrenheit, Celsius, Kelvin",
    href: "/conversions/temperature",
    icon: "🌡️",
  },
  {
    title: "Speed Converter",
    description: "MPH, KPH, knots, meters per second",
    href: "/conversions/speed",
    icon: "🏎️",
  },
  {
    title: "Area Converter",
    description: "Square feet, square meters, acres, hectares",
    href: "/conversions/area",
    icon: "📐",
  },
  {
    title: "Volume Converter",
    description: "Gallons, liters, cups, tablespoons, milliliters",
    href: "/conversions/volume",
    icon: "🧪",
  },
  {
    title: "Data Storage Converter",
    description: "Bytes, KB, MB, GB, TB, PB",
    href: "/conversions/data",
    icon: "💾",
  },
  {
    title: "Time Converter",
    description: "Seconds, minutes, hours, days, weeks, years",
    href: "/conversions/time",
    icon: "⏰",
  },
  {
    title: "Energy Converter",
    description: "Joules, calories, BTU, kWh, electronvolts",
    href: "/conversions/energy",
    icon: "⚡",
  },
  {
    title: "Pressure Converter",
    description: "PSI, bar, atm, pascal, mmHg",
    href: "/conversions/pressure",
    icon: "🔵",
  },
  {
    title: "Fuel Economy Converter",
    description: "MPG, L/100km, km/L",
    href: "/conversions/fuel-economy",
    icon: "⛽",
  },
  {
    title: "Cooking Converter",
    description: "Cups, tablespoons, teaspoons, ml, grams for cooking",
    href: "/conversions/cooking",
    icon: "👨‍🍳",
  },
  {
    title: "Angle Converter",
    description: "Degrees, radians, gradians, turns",
    href: "/conversions/angle",
    icon: "🔄",
  },
  {
    title: "Cups to Grams",
    description: "Convert cups to grams for flour, sugar, butter, and 16 baking ingredients",
    href: "/conversions/cups-to-grams",
    icon: "🥣",
  },
  {
    title: "Cups to mL",
    description: "US cups to milliliters, tablespoons, teaspoons, fluid ounces, and more",
    href: "/conversions/cups-to-ml",
    icon: "🥤",
  },
  {
    title: "Grams to Ounces",
    description: "Grams ↔ ounces, pounds, kilograms, milligrams, and troy ounces",
    href: "/conversions/grams-to-ounces",
    icon: "🏋️",
  },
  {
    title: "Tablespoon Converter",
    description: "Tablespoons ↔ teaspoons, cups, fluid ounces, milliliters",
    href: "/conversions/tablespoons",
    icon: "🥄",
  },
  {
    title: "Pixels to Inches",
    description: "Convert px to inches, cm, mm, points, and picas at any DPI",
    href: "/conversions/pixels-to-inches",
    icon: "🖥️",
  },
  {
    title: "mg to mL Converter",
    description: "Milligrams to milliliters using liquid density presets",
    href: "/conversions/mg-to-ml",
    icon: "💊",
  },
  {
    title: "Precious Metals Weight",
    description: "Troy ounces, pennyweights, grains, grams for gold and silver",
    href: "/conversions/gold-weight",
    icon: "🥇",
  },
];

export default function ConversionsPage() {
  return (
    <PageShell
      title="Unit Converters"
      description="Length, weight, temperature, speed, area, volume, data, and more"
    >
      <SearchableGrid items={calculators} placeholder="Search converters..." />
    </PageShell>
  );
}
