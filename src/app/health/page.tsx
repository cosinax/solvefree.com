import { PageShell } from "@/components/PageShell";
import { SearchableGrid } from "@/components/SearchableGrid";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Health Calculators",
  description:
    "Free health calculators: BMI, TDEE, calorie, body fat, pregnancy due date, heart rate, and more.",
};

const calculators = [
  {
    title: "BMI Calculator",
    description: "Calculate your Body Mass Index",
    href: "/health/bmi",
    icon: "⚖️",
  },
  {
    title: "TDEE Calculator",
    description: "Total Daily Energy Expenditure based on activity level",
    href: "/health/tdee",
    icon: "🔥",
  },
  {
    title: "Calorie Calculator",
    description: "Daily calorie needs for weight loss, maintenance, or gain",
    href: "/health/calories",
    icon: "🍎",
  },
  {
    title: "Body Fat Calculator",
    description: "Estimate body fat percentage using measurements",
    href: "/health/body-fat",
    icon: "📏",
  },
  {
    title: "Ideal Weight",
    description: "Calculate your ideal body weight range",
    href: "/health/ideal-weight",
    icon: "🎯",
  },
  {
    title: "Pregnancy Due Date",
    description: "Estimate your due date based on last period",
    href: "/health/due-date",
    icon: "🤰",
  },
  {
    title: "Heart Rate Zones",
    description: "Calculate target heart rate zones for exercise",
    href: "/health/heart-rate",
    icon: "❤️",
  },
  {
    title: "Water Intake",
    description: "How much water you should drink daily",
    href: "/health/water-intake",
    icon: "💧",
  },
  {
    title: "Sleep Calculator",
    description: "Optimal bedtime and wake times based on sleep cycles",
    href: "/health/sleep",
    icon: "😴",
  },
  {
    title: "Blood Alcohol (BAC)",
    description: "Estimate blood alcohol content",
    href: "/health/bac",
    icon: "🍺",
  },
  {
    title: "Macro Calculator",
    description: "Calculate protein, carb, and fat targets",
    href: "/health/macros",
    icon: "🥩",
  },
  {
    title: "Pace Calculator",
    description: "Running and walking pace, speed, and finish time",
    href: "/health/pace",
    icon: "🏃",
  },
  { title: "One Rep Max (1RM)", description: "Estimate max lift and training percentages", href: "/health/one-rep-max", icon: "🏋️" },
  { title: "Calories Burned", description: "Calories burned for 25+ activities (MET)", href: "/health/calories-burned", icon: "🚴" },
  { title: "BMR Calculator", description: "Basal Metabolic Rate — calories burned at rest (Mifflin, Harris-Benedict, Katch-McArdle)", href: "/health/bmr", icon: "🧬" },
  { title: "Period Calculator", description: "Predict next 6 periods, ovulation, and fertile windows", href: "/health/period", icon: "📅" },
  { title: "Conception Calculator", description: "Calculate conception date, due date, and gestational age from any known date", href: "/health/conception", icon: "🤱" },
  { title: "Height Predictor", description: "Predict a child's adult height using mid-parental and Khamis-Roche methods", href: "/health/height-predictor", icon: "📐" },
  { title: "Lean Body Mass", description: "Calculate LBM using Boer, James, and Hume formulas plus FFMI", href: "/health/lean-body-mass", icon: "💪" },
  { title: "Keto Calculator", description: "Ketogenic diet calories and macro targets (70/25/5 split)", href: "/health/keto", icon: "🥑" },
  { title: "Weight Loss Calculator", description: "How long to reach your goal weight and daily calorie targets", href: "/health/weight-loss", icon: "🏅" },
  { title: "Sobriety Calculator", description: "Track days sober and celebrate your milestones", href: "/health/sobriety", icon: "🌟" },
  { title: "Steps Calculator", description: "Convert steps to distance and calories, or miles to steps", href: "/health/steps", icon: "👟" },
  { title: "Waist-to-Hip Ratio", description: "WHR health risk assessment per WHO guidelines", href: "/health/whr", icon: "🩺" },
  { title: "Height Percentile (CDC)", description: "Find a child's height percentile based on CDC growth charts", href: "/health/height-percentile", icon: "📊" },
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
