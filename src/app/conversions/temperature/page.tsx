import { SimpleConverter } from "@/components/SimpleConverter";

export default function TemperaturePage() {
  return (
    <SimpleConverter
      title="Temperature Converter"
      description="Convert between Fahrenheit, Celsius, and Kelvin."
      units={{ Celsius: 0, Fahrenheit: 0, Kelvin: 0 }}
      defaultFrom="Fahrenheit"
      defaultTo="Celsius"
      isTemperature
    />
  );
}
