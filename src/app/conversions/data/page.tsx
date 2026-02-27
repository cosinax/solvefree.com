import { SimpleConverter } from "@/components/SimpleConverter";

export default function DataPage() {
  return (
    <SimpleConverter
      title="Data Storage Converter"
      description="Convert between bytes, KB, MB, GB, TB, PB, and more."
      units={{ Bits: 0.125, Bytes: 1, Kilobytes: 1024, Megabytes: 1048576, Gigabytes: 1073741824, Terabytes: 1099511627776, Petabytes: 1125899906842624 }}
      defaultFrom="Gigabytes"
      defaultTo="Megabytes"
    />
  );
}
