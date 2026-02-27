import { SimpleConverter } from "@/components/SimpleConverter";

export default function LengthPage() {
  return (
    <SimpleConverter
      title="Length Converter"
      description="Convert between miles, kilometers, feet, meters, inches, centimeters, and more."
      units={{ Meters: 1, Kilometers: 1000, Centimeters: 0.01, Millimeters: 0.001, Micrometers: 0.000001, Miles: 1609.344, Yards: 0.9144, Feet: 0.3048, Inches: 0.0254, "Nautical Miles": 1852 }}
      defaultFrom="Miles"
      defaultTo="Kilometers"
    />
  );
}
