import { SimpleConverter } from "@/components/SimpleConverter";

export default function VolumePage() {
  return (
    <SimpleConverter
      title="Volume Converter"
      description="Convert between gallons, liters, cups, tablespoons, milliliters, and more."
      units={{ Liters: 1, Milliliters: 0.001, "US Gallons": 3.78541, "US Quarts": 0.946353, "US Pints": 0.473176, "US Cups": 0.236588, "US Fl Oz": 0.0295735, "US Tablespoons": 0.0147868, "US Teaspoons": 0.00492892, "Cubic Meters": 1000, "Cubic Feet": 28.3168, "Cubic Inches": 0.0163871, "Imperial Gallons": 4.54609 }}
      defaultFrom="US Gallons"
      defaultTo="Liters"
    />
  );
}
