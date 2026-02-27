import { SimpleConverter } from "@/components/SimpleConverter";

export default function WeightPage() {
  return (
    <SimpleConverter
      title="Weight Converter"
      description="Convert between pounds, kilograms, ounces, grams, stones, and more."
      units={{ Kilograms: 1, Grams: 0.001, Milligrams: 0.000001, "Metric Tons": 1000, Pounds: 0.453592, Ounces: 0.0283495, Stones: 6.35029, "US Tons": 907.185, "Imperial Tons": 1016.05 }}
      defaultFrom="Pounds"
      defaultTo="Kilograms"
    />
  );
}
