import { SimpleConverter } from "@/components/SimpleConverter";

export default function TimePage() {
  return (
    <SimpleConverter
      title="Time Converter"
      description="Convert between seconds, minutes, hours, days, weeks, months, and years."
      units={{ Milliseconds: 0.001, Seconds: 1, Minutes: 60, Hours: 3600, Days: 86400, Weeks: 604800, Months: 2629746, Years: 31556952, Decades: 315569520, Centuries: 3155695200 }}
      defaultFrom="Hours"
      defaultTo="Minutes"
    />
  );
}
