import Link from "next/link";

interface CalculatorShellProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

// Derive category from the current path
function getCategoryFromTitle(title: string): { name: string; href: string } | null {
  // This is a simple approach - works because CalculatorShell is only used in calculator pages
  return null; // Will be enhanced with breadcrumb links via the page URL
}

export function CalculatorShell({
  title,
  description,
  children,
}: CalculatorShellProps) {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-2">
        <Link href="/" className="text-xs text-muted hover:text-primary transition-colors">
          ← Back to all calculators
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
