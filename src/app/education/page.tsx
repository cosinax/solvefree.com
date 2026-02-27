import { PageShell } from "@/components/PageShell";
import { SearchableGrid } from "@/components/SearchableGrid";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Education Calculators",
  description: "Free education calculators: GPA, GRE, SAT, ACT, study time, and more.",
  openGraph: {
    type: "website",
    siteName: "SolveFree",
    title: "Education Calculators — SolveFree",
    description: "Free education calculators for GPA, standardized test scores, study time, and more.",
    url: "https://solvefree.com/education",
  },
  alternates: { canonical: "https://solvefree.com/education" },
};

const calculators = [
  { title: "GPA Calculator", description: "Calculate GPA from course grades and credit hours", href: "/education/gpa", icon: "🎓" },
  { title: "GRE Score Calculator", description: "Convert GRE raw scores to scaled scores and percentiles", href: "/education/gre-score", icon: "📝" },
  { title: "SAT Score Calculator", description: "Estimate SAT score and percentile from section scores", href: "/education/sat-score", icon: "📊" },
  { title: "Study Time Calculator", description: "Plan study hours based on exam difficulty and available time", href: "/education/study-time", icon: "📚" },
  { title: "Reading Level Calculator", description: "Assess reading difficulty using Flesch-Kincaid formula", href: "/education/reading-level", icon: "📖" },
  { title: "Student-Teacher Ratio", description: "Calculate class size and student-to-teacher ratios", href: "/education/student-teacher-ratio", icon: "🏫" },
];

export default function EducationPage() {
  return (
    <PageShell
      title="Education Calculators"
      description="GPA, test scores, study time, and other educational tools"
    >
      <SearchableGrid items={calculators} placeholder="Search education calculators..." />
    </PageShell>
  );
}
