import { SimpleConverter } from "@/components/SimpleConverter";

export default function SpeedPage() {
  return (
    <SimpleConverter
      title="Speed Converter"
      description="Convert between MPH, KPH, knots, meters per second, and feet per second."
      units={{ "m/s": 1, "km/h": 0.277778, "mph": 0.44704, Knots: 0.514444, "ft/s": 0.3048, "Mach": 343 }}
      defaultFrom="mph"
      defaultTo="km/h"
    />
  );
}
