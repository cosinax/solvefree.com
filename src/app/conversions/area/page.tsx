import { SimpleConverter } from "@/components/SimpleConverter";

export default function AreaPage() {
  return (
    <SimpleConverter
      title="Area Converter"
      description="Convert between square feet, square meters, acres, hectares, and more."
      units={{ "Square Meters": 1, "Square Kilometers": 1e6, "Square Centimeters": 0.0001, "Square Feet": 0.092903, "Square Yards": 0.836127, "Square Inches": 0.00064516, "Square Miles": 2.59e6, Acres: 4046.86, Hectares: 10000 }}
      defaultFrom="Square Feet"
      defaultTo="Square Meters"
    />
  );
}
