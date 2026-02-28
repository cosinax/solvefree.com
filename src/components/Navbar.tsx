"use client";

import Link from "next/link";
import { useState } from "react";

const categories = [
  { name: "Math", href: "/math" },
  { name: "Finance", href: "/finance" },
  { name: "Health", href: "/health" },
  { name: "Conversions", href: "/conversions" },
  { name: "Timers", href: "/timers" },
  { name: "Computer", href: "/computer" },
  { name: "Electricity", href: "/electricity" },
  { name: "AI", href: "/ai" },
  { name: "Everyday", href: "/everyday" },
  { name: "Physics", href: "/physics" },
  { name: "Space", href: "/space" },
  { name: "Network", href: "/network" },
  { name: "Security", href: "/security" },
  { name: "RF", href: "/rf" },
  { name: "Statistics", href: "/statistics" },
  { name: "Geometry", href: "/geometry" },
];

const PRIMARY = ["Math", "Finance", "Health", "Conversions", "Timers", "Computer", "Everyday"];

function Logo() {
  return (
    <svg width="118" height="28" viewBox="0 0 118 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="SolveFree">
      <rect width="28" height="28" rx="6" fill="#2563eb"/>
      <circle cx="9.5" cy="9.5" r="2.2" fill="white"/>
      <circle cx="18.5" cy="9.5" r="2.2" fill="white"/>
      <circle cx="9.5" cy="18.5" r="2.2" fill="white"/>
      <rect x="17.25" y="17.75" width="2.5" height="1.5" rx="0.6" fill="white"/>
      <rect x="18.25" y="16.75" width="1.5" height="3.5" rx="0.6" fill="white"/>
      <text x="34" y="20" fontFamily="system-ui, -apple-system, sans-serif" fontSize="15" fontWeight="700" fill="currentColor">Solve</text>
      <text x="74" y="20" fontFamily="system-ui, -apple-system, sans-serif" fontSize="15" fontWeight="700" fill="#2563eb">Free</text>
    </svg>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  const primary = categories.filter(c => PRIMARY.includes(c.name));
  const more = categories.filter(c => !PRIMARY.includes(c.name));

  return (
    <nav className="bg-card border-b border-card-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="text-foreground flex items-center shrink-0 hover:opacity-80 transition-opacity">
            <Logo />
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            <Link href="/all" className="px-2 py-1 text-sm font-bold text-primary hover:text-primary transition-colors">
              All
            </Link>
            {primary.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="px-2 py-1 text-sm font-medium text-secondary hover:text-primary transition-colors"
              >
                {cat.name}
              </Link>
            ))}
            <div className="relative">
              <button
                onClick={() => setMoreOpen(v => !v)}
                onBlur={() => setTimeout(() => setMoreOpen(false), 150)}
                className="px-2 py-1 text-sm font-medium text-secondary hover:text-primary transition-colors flex items-center gap-0.5"
              >
                More
                <svg className="w-3.5 h-3.5 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {moreOpen && (
                <div className="absolute right-0 mt-1 w-44 bg-card border border-card-border rounded-xl shadow-lg py-1 z-50">
                  {more.map(cat => (
                    <Link
                      key={cat.href}
                      href={cat.href}
                      className="block px-4 py-2 text-sm font-medium text-secondary hover:text-primary hover:bg-primary-light transition-colors"
                      onClick={() => setMoreOpen(false)}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

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

      {open && (
        <div className="lg:hidden border-t border-card-border bg-card">
          <div className="px-4 py-3 grid grid-cols-2 gap-1">
            <Link
              href="/all"
              onClick={() => setOpen(false)}
              className="col-span-2 px-3 py-2 rounded-md text-sm font-bold text-primary hover:bg-primary-light transition-colors"
            >
              All Calculators
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                onClick={() => setOpen(false)}
                className="px-3 py-2 rounded-md text-sm font-medium text-secondary hover:text-primary hover:bg-primary-light transition-colors"
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
