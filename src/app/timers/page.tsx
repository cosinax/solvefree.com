import { PageShell } from "@/components/PageShell";
import { SearchableGrid } from "@/components/SearchableGrid";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Timers & Clocks",
  description:
    "Free online timers: countdown timer, stopwatch, Pomodoro timer, world clock, date calculator, and more.",
  openGraph: {
    type: "website",
    siteName: "SolveFree",
    title: "Timers & Clocks — SolveFree",
    description: "Free timers and clocks: stopwatch, Pomodoro, world clock, date calculator, countdown.",
    url: "https://solvefree.com/timers",
  },
  alternates: { canonical: "https://solvefree.com/timers" },
};

const calculators = [
  {
    title: "Clock",
    description: "Current local time with analog and digital display",
    href: "/timers/clock",
    icon: "clock",
  },
  {
    title: "Timer & Stopwatch",
    description: "Countdown timer and stopwatch with lap times",
    href: "/timers/timer",
    icon: "timer",
  },
  {
    title: "Pomodoro Timer",
    description: "25/5 minute work/break intervals for productivity",
    href: "/timers/pomodoro",
    icon: "apple",
  },
  {
    title: "World Clock",
    description: "Current time in cities around the world",
    href: "/timers/world-clock",
    icon: "globe-2",
  },
  {
    title: "Date Calculator",
    description: "Days between dates, add or subtract days",
    href: "/timers/date-calculator",
    icon: "calendar",
  },
  {
    title: "Age Calculator",
    description: "Calculate exact age in years, months, and days",
    href: "/timers/age",
    icon: "cake",
  },
  {
    title: "Countdown to Date",
    description: "How many days until a specific date",
    href: "/timers/countdown",
    icon: "hourglass",
  },
  {
    title: "Unix Timestamp Converter",
    description: "Convert between Unix timestamps and dates",
    href: "/timers/unix-timestamp",
    icon: "hash",
  },
  {
    title: "Time Zone Converter",
    description: "Convert times between different time zones",
    href: "/timers/timezone",
    icon: "clock",
  },
];

export default function TimersPage() {
  return (
    <PageShell
      title="Timers & Clocks"
      description="Countdown timers, stopwatch, Pomodoro, world clock, date calculators, and more"
    >
      <SearchableGrid items={calculators} placeholder="Search timers..." />
    </PageShell>
  );
}
