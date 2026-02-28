"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface CalculatorShellProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

const categoryLabels: Record<string, string> = {
  math: "Math",
  finance: "Finance",
  health: "Health",
  conversions: "Conversions",
  timers: "Timers",
  computer: "Computer",
  everyday: "Everyday",
  network: "Network",
  security: "Security",
  statistics: "Statistics",
  geometry: "Geometry",
  electricity: "Electricity",
  physics: "Physics",
  space: "Space",
  rf: "RF",
  ai: "AI",
};

export function CalculatorShell({
  title,
  description,
  children,
}: CalculatorShellProps) {
  const pathname = usePathname();
  // pathname looks like /category/tool-name
  const parts = pathname.split("/").filter(Boolean);
  const category = parts[0];
  const categoryLabel = category ? categoryLabels[category] : null;
  const backHref = categoryLabel ? `/${category}` : "/";
  const backLabel = categoryLabel ? `← Back to ${categoryLabel}` : "← Back to all calculators";

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-2">
        <Link href={backHref} className="text-xs text-muted hover:text-primary transition-colors">
          {backLabel}
        </Link>
      </div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">{title}</h1>
        {description && <p className="text-muted">{description}</p>}
      </div>
      <div className="bg-card border border-card-border rounded-xl p-6">
        {children}
      </div>
    </div>
  );
}
