import { PageShell } from "@/components/PageShell";
import { SearchableGrid } from "@/components/SearchableGrid";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Health Calculators",
  description:
    "Free health calculators: BMI, TDEE, calorie, body fat, pregnancy due date, heart rate, and more.",
  openGraph: {
    type: "website",
    siteName: "SolveFree",
    title: "Health Calculators — SolveFree",
    description: "Free health calculators for BMI, TDEE, calories, body fat, heart rate, and more.",
    url: "https://solvefree.com/health",
  },
  alternates: { canonical: "https://solvefree.com/health" },
};

const calculators = [
  {
    title: "BMI Calculator",
    description: "Calculate your Body Mass Index",
    href: "/health/bmi",
    icon: "scale",
  },
  {
    title: "TDEE Calculator",
    description: "Total Daily Energy Expenditure based on activity level",
    href: "/health/tdee",
    icon: "flame",
  },
  {
    title: "Calorie Calculator",
    description: "Daily calorie needs for weight loss, maintenance, or gain",
    href: "/health/calories",
    icon: "apple",
  },
  {
    title: "Body Fat Calculator",
    description: "Estimate body fat percentage using measurements",
    href: "/health/body-fat",
    icon: "ruler",
  },
  {
    title: "Ideal Weight",
    description: "Calculate your ideal body weight range",
    href: "/health/ideal-weight",
    icon: "target",
  },
  {
    title: "Pregnancy Due Date",
    description: "Estimate your due date based on last period",
    href: "/health/due-date",
    icon: "baby",
  },
  {
    title: "Heart Rate Zones",
    description: "Calculate target heart rate zones for exercise",
    href: "/health/heart-rate",
    icon: "heart",
  },
  {
    title: "Water Intake",
    description: "How much water you should drink daily",
    href: "/health/water-intake",
    icon: "droplet",
  },
  {
    title: "Sleep Calculator",
    description: "Optimal bedtime and wake times based on sleep cycles",
    href: "/health/sleep",
    icon: "moon",
  },
  {
    title: "Blood Alcohol (BAC)",
    description: "Estimate blood alcohol content",
    href: "/health/bac",
    icon: "beer",
  },
  {
    title: "Macro Calculator",
    description: "Calculate protein, carb, and fat targets",
    href: "/health/macros",
    icon: "drumstick",
  },
  {
    title: "Pace Calculator",
    description: "Running and walking pace, speed, and finish time",
    href: "/health/pace",
    icon: "footprints",
  },
  { title: "One Rep Max (1RM)", description: "Estimate max lift and training percentages", href: "/health/one-rep-max", icon: "dumbbell" },
  { title: "Calories Burned", description: "Calories burned for 25+ activities (MET)", href: "/health/calories-burned", icon: "footprints" },
  { title: "BMR Calculator", description: "Basal Metabolic Rate — calories burned at rest (Mifflin, Harris-Benedict, Katch-McArdle)", href: "/health/bmr", icon: "fingerprint" },
  { title: "Period Calculator", description: "Predict next 6 periods, ovulation, and fertile windows", href: "/health/period", icon: "calendar" },
  { title: "Conception Calculator", description: "Calculate conception date, due date, and gestational age from any known date", href: "/health/conception", icon: "baby" },
  { title: "Height Predictor", description: "Predict a child's adult height using mid-parental and Khamis-Roche methods", href: "/health/height-predictor", icon: "ruler" },
  { title: "Lean Body Mass", description: "Calculate LBM using Boer, James, and Hume formulas plus FFMI", href: "/health/lean-body-mass", icon: "dumbbell" },
  { title: "Keto Calculator", description: "Ketogenic diet calories and macro targets (70/25/5 split)", href: "/health/keto", icon: "apple" },
  { title: "Weight Loss Calculator", description: "How long to reach your goal weight and daily calorie targets", href: "/health/weight-loss", icon: "star" },
  { title: "Sobriety Calculator", description: "Track days sober and celebrate your milestones", href: "/health/sobriety", icon: "star" },
  { title: "Steps Calculator", description: "Convert steps to distance and calories, or miles to steps", href: "/health/steps", icon: "footprints" },
  { title: "Waist-to-Hip Ratio", description: "WHR health risk assessment per WHO guidelines", href: "/health/whr", icon: "heart" },
  { title: "Height Percentile (CDC)", description: "Find a child's height percentile based on CDC growth charts", href: "/health/height-percentile", icon: "bar-chart" },
  { title: "Bra Size Calculator", description: "Find your bra size from measurements and convert between US, UK, EU, FR, AU systems", href: "/health/bra-size", icon: "heart" },
];

export default function HealthPage() {
  return (
    <PageShell
      title="Health Calculators"
      description="BMI, TDEE, calories, body fat, pregnancy, heart rate, and more"
    >
      <SearchableGrid items={calculators} placeholder="Search health calculators..." />
    </PageShell>
  );
}
