import { PageShell } from "@/components/PageShell";
import { SearchableGrid } from "@/components/SearchableGrid";
import { allCalculators } from "@/data/calculators";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Calculators",
  description: "Browse and search all 100+ free calculators on FreeCalc. Math, finance, health, conversions, timers, AI, electronics, dev tools, and more.",
};

export default function AllPage() {
  return (
    <PageShell
      title="All Calculators"
      description={`Browse and search all ${allCalculators.length} calculators`}
    >
      <SearchableGrid items={allCalculators} showCategory placeholder="Search all calculators..." />
    </PageShell>
  );
}
