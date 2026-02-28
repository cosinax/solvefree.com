import { PageShell } from "@/components/PageShell";
import { SearchableGrid } from "@/components/SearchableGrid";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Everyday Calculators",
  description: "Free everyday calculators: GPA, grade, fuel, pizza, paint, concrete, pets, photography, and more.",
  openGraph: {
    type: "website",
    siteName: "SolveFree",
    title: "Everyday Calculators — SolveFree",
    description: "Free everyday calculators: GPA, fuel, paint, concrete, pizza, pet age, photography.",
    url: "https://solvefree.com/everyday",
  },
  alternates: { canonical: "https://solvefree.com/everyday" },
};

const calculators = [
  { title: "GPA Calculator", description: "Calculate GPA from letter grades and credits", href: "/everyday/gpa", icon: "🎓" },
  { title: "Grade Calculator", description: "What grade do I need on the final?", href: "/everyday/grade", icon: "📝" },
  { title: "Fuel Cost", description: "Calculate fuel cost for a trip", href: "/everyday/fuel-cost", icon: "⛽" },
  { title: "MPG Calculator", description: "Calculate miles per gallon from fill-ups", href: "/everyday/mpg", icon: "🚗" },
  { title: "Pizza Calculator", description: "Compare pizza sizes and prices per square inch", href: "/everyday/pizza", icon: "🍕" },
  { title: "Dog Age", description: "Convert dog years to human years", href: "/everyday/dog-age", icon: "🐕" },
  { title: "Cat Age", description: "Convert cat years to human years", href: "/everyday/cat-age", icon: "🐱" },
  { title: "Shoe Size Converter", description: "Convert shoe sizes between US, EU, UK", href: "/everyday/shoe-size", icon: "👟" },
  { title: "Concrete Calculator", description: "Calculate concrete volume for a project", href: "/everyday/concrete", icon: "🏗️" },
  { title: "Paint Calculator", description: "Estimate paint needed for a room", href: "/everyday/paint", icon: "🎨" },
  { title: "Tile Calculator", description: "Estimate tiles needed for a floor or wall", href: "/everyday/tile", icon: "🔲" },
  { title: "Pool Volume", description: "Calculate pool water volume", href: "/everyday/pool", icon: "🏊" },
  { title: "Gravel Calculator", description: "Estimate gravel/mulch needed for landscaping", href: "/everyday/gravel", icon: "🪨" },
  { title: "Stair Calculator", description: "Calculate stair rise, run, and number of steps", href: "/everyday/stairs", icon: "🪜" },
  { title: "Commute Cost", description: "Calculate your daily commute cost", href: "/everyday/commute", icon: "🚌" },
  { title: "Dilution Calculator", description: "Calculate dilution ratios for solutions", href: "/everyday/dilution", icon: "🧴" },
  { title: "Photography", description: "Depth of field, exposure, and print sizes", href: "/everyday/photography", icon: "📷" },
  { title: "Monitor PPI", description: "Pixels per inch for any screen size and resolution", href: "/everyday/monitor-ppi", icon: "🖥️" },
  { title: "Reading Time", description: "How long to read or speak any text", href: "/everyday/reading-time", icon: "📖" },
  { title: "Recipe Scaler", description: "Scale recipe ingredients to any serving size", href: "/everyday/recipe-scaler", icon: "👨‍🍳" },
  { title: "Typing Speed", description: "Calculate WPM from word count and time", href: "/everyday/typing-speed", icon: "⌨️" },
  { title: "Square Footage", description: "Calculate area for rectangles, circles, L-shapes, and more", href: "/everyday/square-footage", icon: "📐" },
  { title: "Mulch Calculator", description: "Estimate mulch, topsoil, sand, or gravel for landscaping", href: "/everyday/mulch", icon: "🌿" },
  { title: "Flooring Calculator", description: "Calculate flooring materials needed with waste factor", href: "/everyday/flooring", icon: "🏠" },
  { title: "Insulation Calculator", description: "Estimate insulation coverage, bags, and cost by R-value", href: "/everyday/insulation", icon: "🧤" },
  { title: "Board Feet Calculator", description: "Calculate board feet for lumber: BF = (T × W × L) / 12", href: "/everyday/board-feet", icon: "🪵" },
  { title: "Brick Calculator", description: "Estimate bricks and mortar bags for a wall or paving project", href: "/everyday/brick", icon: "🧱" },
  { title: "Age Difference", description: "Find the age difference between two people", href: "/everyday/age-difference", icon: "🎂" },
  { title: "Hours Calculator", description: "Add or subtract time durations and find time between clock times", href: "/everyday/hours", icon: "⏱️" },
  { title: "Ski DIN Calculator", description: "Ski binding release settings per ISO 11088", href: "/everyday/ski-din", icon: "⛷️" },
  { title: "Ski Run Calculator", description: "Slope angle, grade, and estimated run time", href: "/everyday/ski-run", icon: "🎿" },
  { title: "Tire Size Calculator", description: "Compare two tire sizes — diameter, circumference, speedometer diff", href: "/everyday/tire-size", icon: "🛞" },
  { title: "Asphalt Calculator", description: "Estimate tons of asphalt needed for a driveway or road", href: "/everyday/asphalt", icon: "🛣️" },
  { title: "Generation Calculator", description: "Find your generation (Boomer, Gen X, Millennial, Gen Z…)", href: "/everyday/generation", icon: "👶" },
  { title: "Helium Balloons", description: "How many helium balloons to lift an object?", href: "/everyday/helium-balloons", icon: "🎈" },
  { title: "Drywall Calculator", description: "Estimate drywall sheets, screws, and compound for a room", href: "/everyday/drywall", icon: "🏠" },
  { title: "Fence Calculator", description: "Estimate fence posts, rails, boards, and cost", href: "/everyday/fence", icon: "🪵" },
  { title: "Roofing Calculator", description: "Estimate shingles, bundles, squares, and material cost", href: "/everyday/roofing", icon: "🏡" },
  { title: "Deck Calculator", description: "Estimate decking boards, joists, screws, and cost", href: "/everyday/deck", icon: "🪜" },
];

export default function EverydayPage() {
  return (
    <PageShell title="Everyday Calculators" description="Practical tools for daily life: home, pets, school, shopping, DIY, and more">
      <SearchableGrid items={calculators} placeholder="Search everyday calculators..." />
    </PageShell>
  );
}
