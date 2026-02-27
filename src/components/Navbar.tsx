"use client";

import Link from "next/link";
import { useState } from "react";
import { Calculator } from "lucide-react";

const categories = [
  { name: "All", href: "/all", bold: true },
  { name: "Math", href: "/math" },
  { name: "Finance", href: "/finance" },
  { name: "Health", href: "/health" },
  { name: "Conversions", href: "/conversions" },
  { name: "Timers", href: "/timers" },
  { name: "Computer", href: "/computer" },
  { name: "Electricity", href: "/electricity" },
  { name: "AI", href: "/ai" },
  { name: "Everyday", href: "/everyday" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-card border-b border-card-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="text-xl font-bold text-primary flex items-center gap-2 shrink-0"
          >
            <Calculator className="h-6 w-6" strokeWidth={2} />
            <span>SolveFree</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className={`text-sm transition-colors hover:text-primary ${
                  "bold" in cat && cat.bold
                    ? "font-bold text-primary"
                    : "font-medium text-secondary"
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2 rounded-md text-secondary hover:text-primary"
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t border-card-border bg-card">
          <div className="px-4 py-3 space-y-1">
            {categories.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                onClick={() => setOpen(false)}
                className={`block px-3 py-2 rounded-md text-sm transition-colors hover:text-primary hover:bg-primary-light ${
                  "bold" in cat && cat.bold ? "font-bold text-primary" : "font-medium text-secondary"
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
