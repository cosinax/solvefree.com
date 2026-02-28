import { PageShell } from "@/components/PageShell";
import { SearchableGrid } from "@/components/SearchableGrid";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Statistics Calculators",
  description: "Free statistics calculators: normal distribution, confidence intervals, z-score, probability, combinations, permutations, and more.",
  openGraph: {
    type: "website",
    siteName: "SolveFree",
    title: "Statistics Calculators — SolveFree",
    description: "Free statistics calculators for distributions, inference, probability, and more.",
    url: "https://solvefree.com/statistics",
  },
  alternates: { canonical: "https://solvefree.com/statistics" },
};

const calculators = [
  { title: "Normal Distribution", description: "PDF, CDF, and z-score lookup for the normal distribution", href: "/statistics/normal-distribution", icon: "bar-chart" },
  { title: "Confidence Interval", description: "Confidence interval for a proportion or mean", href: "/statistics/confidence-interval", icon: "target" },
  { title: "Z-Score Calculator", description: "Convert between raw scores and z-scores", href: "/statistics/z-score", icon: "trending-up" },
  { title: "Combination & Permutation", description: "Count combinations C(n,r) and permutations P(n,r)", href: "/statistics/combination-permutation", icon: "hash" },
  { title: "Probability Calculator", description: "AND, OR, conditional probability and basic events", href: "/statistics/probability", icon: "dice" },
  { title: "Binomial Distribution", description: "Binomial probability P(X=k), CDF, mean, and variance", href: "/statistics/binomial-distribution", icon: "trending-down" },
  { title: "Poisson Distribution", description: "Poisson probability for rare events", href: "/statistics/poisson-distribution", icon: "zap" },
  { title: "5-Number Summary", description: "Min, Q1, median, Q3, max, IQR, and outlier detection", href: "/statistics/five-number-summary", icon: "clipboard" },
  { title: "Standard Deviation", description: "Sample and population std dev, variance, and mean", href: "/statistics/standard-deviation", icon: "waves" },
  { title: "Margin of Error", description: "Calculate margin of error for surveys and polls", href: "/statistics/margin-of-error", icon: "sliders" },
];

export default function StatisticsPage() {
  return (
    <PageShell
      title="Statistics Calculators"
      description="Probability, distributions, confidence intervals, and descriptive statistics"
    >
      <SearchableGrid items={calculators} placeholder="Search statistics calculators..." />
    </PageShell>
  );
}
