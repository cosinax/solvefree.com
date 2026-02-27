import Link from "next/link";
import { Calculator, Hash, Percent, DivideSquare, Sigma, BarChart3, TrendingUp, Home, DollarSign, CreditCard, Car, Target, Umbrella, Receipt, Tag, Coins, PiggyBank, Gem, ClipboardList, Scale, Flame, Apple, Ruler, Heart, Droplets, Moon, Beer, Drumstick, Timer, Clock, Globe, Calendar, Cake, Hourglass, Binary, MapPin, Palette, FileJson, Search, Lock, Link2, Fingerprint, Key, Type, FileText, FolderOpen, Code, Monitor, Lightbulb, Zap, CircleDot, Plug, Battery, Gauge, Radio, Waves, Brain, CircuitBoard, GraduationCap, Fuel, Pizza, Dog, Cat, Footprints, HardHat, PaintBucket, Grid3x3, Droplet, Mountain, ArrowUpDown, Bus, FlaskConical, Camera, ArrowLeftRight, Thermometer, Wind, Maximize, Beaker, Database, Activity, Wrench, SunMedium, ChefHat, TriangleRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

// Map icon names to Lucide components
const iconMap: Record<string, LucideIcon> = {
  calculator: Calculator, hash: Hash, percent: Percent, "divide-square": DivideSquare,
  sigma: Sigma, "bar-chart": BarChart3, "trending-up": TrendingUp, home: Home,
  dollar: DollarSign, "credit-card": CreditCard, car: Car, target: Target,
  umbrella: Umbrella, receipt: Receipt, tag: Tag, coins: Coins,
  "piggy-bank": PiggyBank, gem: Gem, clipboard: ClipboardList, scale: Scale,
  flame: Flame, apple: Apple, ruler: Ruler, heart: Heart, droplets: Droplets,
  moon: Moon, beer: Beer, drumstick: Drumstick, timer: Timer, clock: Clock,
  globe: Globe, calendar: Calendar, cake: Cake, hourglass: Hourglass,
  binary: Binary, "map-pin": MapPin, palette: Palette, "file-json": FileJson,
  search: Search, lock: Lock, link: Link2, fingerprint: Fingerprint, key: Key,
  type: Type, "file-text": FileText, folder: FolderOpen, code: Code,
  monitor: Monitor, lightbulb: Lightbulb, zap: Zap, "circle-dot": CircleDot,
  plug: Plug, battery: Battery, gauge: Gauge, radio: Radio, waves: Waves,
  brain: Brain, "circuit-board": CircuitBoard, "graduation-cap": GraduationCap,
  fuel: Fuel, pizza: Pizza, dog: Dog, cat: Cat, footprints: Footprints,
  "hard-hat": HardHat, "paint-bucket": PaintBucket, grid: Grid3x3,
  droplet: Droplet, mountain: Mountain, stairs: ArrowUpDown, bus: Bus,
  flask: FlaskConical, camera: Camera, "arrow-left-right": ArrowLeftRight,
  thermometer: Thermometer, wind: Wind, maximize: Maximize, beaker: Beaker,
  database: Database, activity: Activity, wrench: Wrench, sun: SunMedium,
  "chef-hat": ChefHat, triangle: TriangleRight,
};

interface CalculatorCardProps {
  title: string;
  description: string;
  href: string;
  emoji?: string; // legacy emoji support
  icon?: string;  // lucide icon name
}

export function CalculatorCard({
  title,
  description,
  href,
  emoji,
  icon,
}: CalculatorCardProps) {
  const IconComponent = icon ? iconMap[icon] : null;

  return (
    <Link
      href={href}
      className="group block bg-card border border-card-border rounded-xl p-5 hover:border-primary hover:shadow-lg transition-all duration-200"
    >
      <div className="mb-3">
        {IconComponent ? (
          <IconComponent className="h-6 w-6 text-muted group-hover:text-primary transition-colors" strokeWidth={1.5} />
        ) : emoji ? (
          <span className="text-2xl">{emoji}</span>
        ) : (
          <Calculator className="h-6 w-6 text-muted group-hover:text-primary transition-colors" strokeWidth={1.5} />
        )}
      </div>
      <h3 className="font-semibold text-base mb-1 group-hover:text-primary transition-colors">
        {title}
      </h3>
      <p className="text-sm text-muted leading-snug">{description}</p>
    </Link>
  );
}
