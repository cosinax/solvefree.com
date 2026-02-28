import { PageShell } from "@/components/PageShell";
import { SearchableGrid } from "@/components/SearchableGrid";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Math Calculators",
  description:
    "Free math calculators: general purpose, scientific, percentage, fraction, exponent, logarithm, and more.",
  openGraph: {
    type: "website",
    siteName: "SolveFree",
    title: "Math Calculators — SolveFree",
    description: "Free math calculators for percentages, fractions, geometry, statistics, and more.",
    url: "https://solvefree.com/math",
  },
  alternates: { canonical: "https://solvefree.com/math" },
};

const calculators = [
  { title: "Greek Alphabet", description: "Greek letters, LaTeX symbols, and uses in math and physics", href: "/math/greek-alphabet", icon: "sigma" },
  {
    title: "General Calculator",
    description: "Type expressions naturally — no buttons needed",
    href: "/math/general",
    icon: "keyboard",
  },
  {
    title: "Button Calculator",
    description: "Classic button-style calculator",
    href: "/math/button-calculator",
    icon: "calculator",
  },
  {
    title: "Scientific Calculator",
    description: "Trig, logs, powers, roots, and constants",
    href: "/math/scientific",
    icon: "flask",
  },
  {
    title: "Percentage Calculator",
    description: "Calculate percentages, increases, and decreases",
    href: "/math/percentage",
    icon: "percent",
  },
  {
    title: "Fraction Calculator",
    description: "Add, subtract, multiply, and divide fractions",
    href: "/math/fractions",
    icon: "percent",
  },
  {
    title: "Exponent Calculator",
    description: "Calculate powers and nth roots",
    href: "/math/exponents",
    icon: "superscript",
  },
  {
    title: "Logarithm Calculator",
    description: "Natural log, log base 10, and custom bases",
    href: "/math/logarithm",
    icon: "calculator",
  },
  {
    title: "Mean / Median / Mode",
    description: "Statistical averages from a set of numbers",
    href: "/math/statistics",
    icon: "bar-chart",
  },
  {
    title: "Standard Deviation",
    description: "Calculate variance and standard deviation",
    href: "/math/standard-deviation",
    icon: "sigma",
  },
  {
    title: "GCD / LCM",
    description: "Greatest common divisor and least common multiple",
    href: "/math/gcd-lcm",
    icon: "grid",
  },
  {
    title: "Number Base Converter",
    description: "Convert between binary, octal, decimal, and hex",
    href: "/math/base-converter",
    icon: "sliders",
  },
  {
    title: "Random Number Generator",
    description: "Generate random numbers within a range",
    href: "/math/random",
    icon: "dice",
  },
  { title: "Prime Checker", description: "Is it prime? Factorization and nearby primes", href: "/math/prime", icon: "key" },
  { title: "Quadratic Formula", description: "Solve ax²+bx+c=0 with roots and vertex", href: "/math/quadratic", icon: "trending-down" },
  { title: "Combinations & Permutations", description: "C(n,r) and P(n,r) calculator", href: "/math/combinations", icon: "target" },
  { title: "Number Properties", description: "Divisors, bases, perfect/prime/abundant", href: "/math/number-properties", icon: "search" },
  { title: "Square Root Calculator", description: "Nth root, square, cube, and 4th root of any number", href: "/math/square-root", icon: "radical" },
  { title: "Ratio Calculator", description: "Simplify ratios, scale to a total, equivalent ratios", href: "/math/ratio", icon: "scale" },
  { title: "Significant Figures", description: "Round to sig figs, scientific and engineering notation", href: "/math/significant-figures", icon: "hash" },
  { title: "Scientific Notation", description: "Convert between standard form and scientific notation", href: "/math/scientific-notation", icon: "eye" },
  { title: "Slope Calculator", description: "Slope, y-intercept, equation, angle, and distance", href: "/math/slope", icon: "trending-up" },
  { title: "Triangle Solver", description: "Solve any triangle: SSS, SAS, ASA, AAS, SSA", href: "/math/triangle", icon: "triangle" },
  { title: "Circle Calculator", description: "Radius, diameter, area, and circumference", href: "/math/circle", icon: "circle" },
  { title: "Pythagorean Theorem", description: "Find any side of a right triangle plus angles and area", href: "/math/pythagorean", icon: "ruler" },
  { title: "Weighted Average", description: "Weighted mean with dynamic value/weight pairs", href: "/math/weighted-average", icon: "dumbbell" },
  { title: "Roman Numerals", description: "Convert between integers and Roman numerals", href: "/math/roman-numerals", icon: "landmark" },
  { title: "Percentage Change", description: "Increase/decrease, absolute change, and reverse calc", href: "/math/percentage-change", icon: "clipboard" },
  { title: "Decimal ↔ Fraction", description: "Convert decimals to fractions and vice versa", href: "/math/decimal-fraction", icon: "percent" },
  { title: "Summation (Σ)", description: "Evaluate sigma notation over a range of integers", href: "/math/summation", icon: "sigma" },
  { title: "Trigonometry", description: "All 6 trig functions plus inverse trig (arcsin, arccos, arctan)", href: "/math/trig", icon: "ruler" },
  { title: "Z-Score Calculator", description: "Calculate z-scores, percentiles, and reverse z-score", href: "/math/z-score", icon: "sigma" },
  { title: "Confidence Interval", description: "Calculate confidence intervals for a population mean", href: "/math/confidence-interval", icon: "signal" },
  { title: "Probability Calculator", description: "Basic, complement, union, conditional, and binomial probability", href: "/math/probability", icon: "dice" },
  { title: "P-Value Calculator", description: "P-values for z-tests, t-tests, and chi-square tests", href: "/math/p-value", icon: "flask" },
  { title: "Dice Probability", description: "Probability distributions and roll simulator for any dice", href: "/math/dice", icon: "dice" },
  { title: "Odds Converter", description: "Convert between probability, decimal, fractional, and American odds", href: "/math/odds", icon: "dice" },
  { title: "Cylinder Calculator", description: "Volume, surface area, and lateral area of a cylinder", href: "/math/cylinder", icon: "settings" },
  { title: "Sphere Calculator", description: "Volume, surface area, and great circle from any known value", href: "/math/sphere", icon: "globe" },
  { title: "Cone Calculator", description: "Volume, surface area, and slant height of a cone", href: "/math/cone", icon: "triangle" },
  { title: "Rectangle Calculator", description: "Area, perimeter, and diagonal of a rectangle", href: "/math/rectangle", icon: "square" },
  { title: "Volume Calculator", description: "Volume and surface area for 6 common 3D shapes", href: "/math/volume", icon: "box" },
  { title: "Midpoint Calculator", description: "Midpoint, distance, and slope between two 2D points", href: "/math/midpoint", icon: "map-pin" },
  { title: "Distance Calculator", description: "Euclidean and Manhattan distance in 2D or 3D space", href: "/math/distance", icon: "ruler" },
];

export default function MathPage() {
  return (
    <PageShell
      title="Math Calculators"
      description="General purpose, scientific, percentage, fractions, statistics, and more"
    >
      <SearchableGrid items={calculators} placeholder="Search math calculators..." />
    </PageShell>
  );
}
