import Link from "next/link";
import { Calculator, Hash, Percent, DivideSquare, Sigma, BarChart3, TrendingUp, Home, DollarSign, CreditCard, Car, Target, Umbrella, Receipt, Tag, Coins, PiggyBank, Gem, ClipboardList, Scale, Flame, Apple, Ruler, Heart, Droplets, Moon, Beer, Drumstick, Timer, Clock, Globe, Calendar, Cake, Hourglass, Binary, MapPin, Palette, FileJson, Search, Lock, Link2, Fingerprint, Key, Type, FileText, FolderOpen, Code, Monitor, Lightbulb, Zap, CircleDot, Plug, Battery, Gauge, Radio, Waves, Brain, CircuitBoard, GraduationCap, Fuel, Pizza, Dog, Cat, Footprints, HardHat, PaintBucket, Grid3x3, Droplet, Mountain, ArrowUpDown, Bus, FlaskConical, Camera, ArrowLeftRight, Thermometer, Wind, Maximize, Beaker, Database, Activity, Wrench, SunMedium, ChefHat, TriangleRight,
  // New icons
  AlarmClock, Ampersand, Atom, Baby, Banknote, BookOpen, BrainCircuit, Building2, Cable, CalendarClock, ChartBar, Circle, CircleDashed, Clock4, Cpu, Dice5, Dices, Dumbbell, Egg, Eye, FastForward, FileCode, FileDiff, FunctionSquare, Globe2, Grid2X2, HandCoins, Info, KeyRound, Keyboard, Landmark, Layers, LayoutGrid, ListOrdered, LockKeyhole, Network, Orbit, PartyPopper, Pilcrow, Radical, RadioTower, ReceiptText, Rocket, Satellite, Scale3d, Scan, ScatterChart, SearchCode, Server, Settings, ShieldCheck, Signal, Sliders, Star, Subscript, Superscript, Table, Terminal, TrendingDown, Users, Utensils, Wallet, Wifi, XSquare, ZapOff,
} from "lucide-react";
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
  // New icon mappings
  "alarm-clock": AlarmClock,
  ampersand: Ampersand,
  atom: Atom,
  baby: Baby,
  banknote: Banknote,
  "book-open": BookOpen,
  "brain-circuit": BrainCircuit,
  "building-2": Building2,
  cable: Cable,
  "calendar-clock": CalendarClock,
  "chart-bar": ChartBar,
  circle: Circle,
  "circle-dashed": CircleDashed,
  "clock-4": Clock4,
  cpu: Cpu,
  "dice-5": Dice5,
  dices: Dices,
  dumbbell: Dumbbell,
  egg: Egg,
  eye: Eye,
  "fast-forward": FastForward,
  "file-code": FileCode,
  "file-diff": FileDiff,
  "function-square": FunctionSquare,
  "globe-2": Globe2,
  "grid-2x2": Grid2X2,
  "hand-coins": HandCoins,
  info: Info,
  "key-round": KeyRound,
  keyboard: Keyboard,
  landmark: Landmark,
  layers: Layers,
  "layout-grid": LayoutGrid,
  "link-2": Link2,
  "list-ordered": ListOrdered,
  "lock-keyhole": LockKeyhole,
  network: Network,
  orbit: Orbit,
  "party-popper": PartyPopper,
  pilcrow: Pilcrow,
  radical: Radical,
  "radio-tower": RadioTower,
  "receipt-text": ReceiptText,
  rocket: Rocket,
  satellite: Satellite,
  "scale-3d": Scale3d,
  scan: Scan,
  "scatter-chart": ScatterChart,
  "search-code": SearchCode,
  server: Server,
  settings: Settings,
  "shield-check": ShieldCheck,
  signal: Signal,
  sliders: Sliders,
  star: Star,
  subscript: Subscript,
  superscript: Superscript,
  table: Table,
  terminal: Terminal,
  "trending-down": TrendingDown,
  users: Users,
  utensils: Utensils,
  wallet: Wallet,
  wifi: Wifi,
  "x-square": XSquare,
  "zap-off": ZapOff,
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
