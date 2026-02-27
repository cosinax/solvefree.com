import { SimpleConverter } from "@/components/SimpleConverter";

export default function AnglePage() {
  return (
    <SimpleConverter
      title="Angle Converter"
      description="Convert between degrees, radians, gradians, and turns."
      units={{ Degrees: 1, Radians: 57.2958, Gradians: 0.9, Turns: 360, "Arc Minutes": 1/60, "Arc Seconds": 1/3600 }}
      defaultFrom="Degrees"
      defaultTo="Radians"
    />
  );
}
