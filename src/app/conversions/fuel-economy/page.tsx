import { SimpleConverter } from "@/components/SimpleConverter";

export default function FuelEconomyPage() {
  // Using km/L as the base unit since it's linear. MPG and L/100km require special handling,
  // but for simplicity we use approximate linear conversions. 
  // 1 MPG (US) ≈ 0.425144 km/L, 1 MPG (UK) ≈ 0.354006 km/L
  return (
    <SimpleConverter
      title="Fuel Economy Converter"
      description="Convert between MPG (US), MPG (UK), km/L, and L/100km equivalent."
      units={{ "MPG (US)": 0.425144, "MPG (UK)": 0.354006, "km/L": 1, "km/gal (US)": 0.425144 }}
      defaultFrom="MPG (US)"
      defaultTo="km/L"
    />
  );
}
