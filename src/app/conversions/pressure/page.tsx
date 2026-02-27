import { SimpleConverter } from "@/components/SimpleConverter";

export default function PressurePage() {
  return (
    <SimpleConverter
      title="Pressure Converter"
      description="Convert between PSI, bar, atm, pascal, mmHg, and more."
      units={{ Pascals: 1, Kilopascals: 1000, Bar: 100000, PSI: 6894.76, Atmospheres: 101325, "mmHg (Torr)": 133.322, "inHg": 3386.39 }}
      defaultFrom="PSI"
      defaultTo="Bar"
    />
  );
}
