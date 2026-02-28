import { CalculatorCard } from "@/components/CalculatorCard";
import { SearchableGrid } from "@/components/SearchableGrid";
import { allCalculators } from "@/data/calculators";

const featured = [
  { title: "General Calculator", description: "Type expressions naturally — no buttons needed", href: "/math/general", icon: "calculator" },
  { title: "Mortgage Calculator", description: "Monthly payments, total interest, and amortization", href: "/finance/mortgage", icon: "home" },
  { title: "BMI Calculator", description: "Calculate your Body Mass Index", href: "/health/bmi", icon: "scale" },
  { title: "Token Estimator", description: "Estimate LLM token count for text", href: "/ai/token-estimator", icon: "type" },
  { title: "Ohm's Law", description: "Calculate voltage, current, resistance, power", href: "/electricity/ohms-law", icon: "zap" },
  { title: "Password Generator", description: "Generate secure random passwords", href: "/computer/password-generator", icon: "key" },
  { title: "Timer & Stopwatch", description: "Countdown timer and stopwatch", href: "/timers/timer", icon: "timer" },
  { title: "Pizza Calculator", description: "Compare pizza sizes by price per sq in", href: "/everyday/pizza", icon: "pizza" },
];

const categories = [
  { title: "Math", description: "General, scientific, percentage, fractions, statistics", href: "/math", icon: "calculator" },
  { title: "Finance", description: "Mortgage, loans, interest, investments, retirement", href: "/finance", icon: "dollar" },
  { title: "Health", description: "BMI, TDEE, calories, body fat, heart rate, sleep", href: "/health", icon: "heart" },
  { title: "Conversions", description: "Length, weight, temperature, speed, area, volume", href: "/conversions", icon: "arrow-left-right" },
  { title: "Timers & Clocks", description: "Timer, stopwatch, Pomodoro, world clock", href: "/timers", icon: "clock" },
  { title: "Computer & Dev", description: "JSON, regex, Base64, UUID, passwords, hashes", href: "/computer", icon: "monitor" },
  { title: "Electricity", description: "Ohm's law, resistors, capacitors, wire gauge", href: "/electricity", icon: "zap" },
  { title: "AI & ML", description: "Token estimator, API costs, model sizing, metrics", href: "/ai", icon: "brain" },
  { title: "Everyday", description: "GPA, fuel, pizza, paint, concrete, pets, photography", href: "/everyday", icon: "home" },
  { title: "Network", description: "Bandwidth, subnets, CIDR, latency, WiFi, ports", href: "/network", icon: "wifi" },
  { title: "Security", description: "Password strength, JWT decoder, entropy, hashes", href: "/security", icon: "shield-check" },
  { title: "Physics", description: "Velocity, force, energy, projectile motion, waves, thermodynamics", href: "/physics", icon: "atom" },
  { title: "RF & Antenna", description: "Wavelength, path loss, VSWR, link budget, dBm, coax, noise figure", href: "/rf", icon: "radio" },
  { title: "Space", description: "Orbital mechanics, rocket equation, black holes, stellar physics", href: "/space", icon: "globe" },
  { title: "Statistics", description: "Normal distribution, confidence intervals, probability, z-scores", href: "/statistics", icon: "chart-bar" },
  { title: "Geometry", description: "Triangles, circles, polygons, arc length, slope, and 2D shapes", href: "/geometry", icon: "triangle" },
];

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "SolveFree",
    url: "https://solvefree.com",
    description:
      "Free online calculators for math, finance, health, conversions, timers, electronics, AI, and more.",
  };

  return (
    <div>
      {/* JSON-LD: hardcoded static object, not user input — dangerouslySetInnerHTML is safe */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Hero */}
      <section className="bg-card border-b border-card-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Solve{" "}<span className="text-primary">Everything</span>{" "}for Free
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto mb-2">
            {allCalculators.length}+ free online calculators. Math, finance,
            health, conversions, timers, AI, electronics, dev tools, and much more.
          </p>
          <p className="text-sm text-muted font-medium">
            No ads · No tracking · 100% browser-side · Shareable URLs
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <CalculatorCard key={cat.href} {...cat} />
          ))}
        </div>
      </section>

      {/* Search all */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <SearchableGrid items={allCalculators} showCategory placeholder={`Search all ${allCalculators.length} calculators...`} />
      </section>

      {/* Featured */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold mb-6">Popular Calculators</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featured.map((calc) => (
            <CalculatorCard key={calc.href} {...calc} />
          ))}
        </div>
      </section>
    </div>
  );
}
