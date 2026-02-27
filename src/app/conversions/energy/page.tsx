import { SimpleConverter } from "@/components/SimpleConverter";

export default function EnergyPage() {
  return (
    <SimpleConverter
      title="Energy Converter"
      description="Convert between joules, calories, BTU, kWh, and more."
      units={{ Joules: 1, Kilojoules: 1000, Calories: 4.184, Kilocalories: 4184, "Watt-hours": 3600, "Kilowatt-hours": 3600000, BTU: 1055.06, "Foot-pounds": 1.35582, "Electron-volts": 1.602e-19 }}
      defaultFrom="Kilocalories"
      defaultTo="Kilojoules"
    />
  );
}
