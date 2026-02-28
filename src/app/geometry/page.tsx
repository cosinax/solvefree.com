import { PageShell } from "@/components/PageShell";
import { SearchableGrid } from "@/components/SearchableGrid";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Geometry Calculators",
  description: "Free geometry calculators: triangle, circle, polygon, area, perimeter, Pythagorean theorem, and more.",
  openGraph: {
    type: "website",
    siteName: "SolveFree",
    title: "Geometry Calculators — SolveFree",
    description: "Free geometry calculators for triangles, circles, polygons, and 2D shapes.",
    url: "https://solvefree.com/geometry",
  },
  alternates: { canonical: "https://solvefree.com/geometry" },
};

const calculators = [
  { title: "Right Triangle", description: "Sides, angles, area, and perimeter using Pythagorean theorem", href: "/geometry/right-triangle", icon: "ruler" },
  { title: "Triangle Calculator", description: "Solve any triangle from SSS, SAS, ASA, AAS, or SSA", href: "/geometry/triangle", icon: "triangle" },
  { title: "Circle Calculator", description: "Area, circumference, arc length, and sector area", href: "/geometry/circle", icon: "circle" },
  { title: "Pythagorean Theorem", description: "Find any side of a right triangle from the other two", href: "/geometry/pythagorean-theorem", icon: "ruler" },
  { title: "Trapezoid Calculator", description: "Area, perimeter, and height of a trapezoid", href: "/geometry/trapezoid", icon: "hexagon" },
  { title: "Parallelogram", description: "Area, perimeter, diagonal, and height of a parallelogram", href: "/geometry/parallelogram", icon: "square" },
  { title: "Regular Polygon", description: "Area and perimeter of any regular polygon (3–20 sides)", href: "/geometry/regular-polygon", icon: "hexagon" },
  { title: "Ellipse Calculator", description: "Area, perimeter (approximation), and foci of an ellipse", href: "/geometry/ellipse", icon: "circle" },
  { title: "Arc Length", description: "Arc length and sector area from radius and central angle", href: "/geometry/arc-length", icon: "trending-up" },
  { title: "Slope Calculator", description: "Slope, distance, midpoint, and equation of a line", href: "/geometry/slope", icon: "trending-up" },
];

export default function GeometryPage() {
  return (
    <PageShell
      title="Geometry Calculators"
      description="Triangles, circles, polygons, coordinate geometry, and 2D shapes"
    >
      <SearchableGrid items={calculators} placeholder="Search geometry calculators..." />
    </PageShell>
  );
}
