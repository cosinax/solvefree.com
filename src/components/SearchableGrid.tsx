"use client";

import { useState } from "react";
import { CalculatorCard } from "@/components/CalculatorCard";

interface Item {
  title: string;
  description: string;
  href: string;
  emoji?: string;
  icon?: string;
  category?: string;
}

interface SearchableGridProps {
  items: Item[];
  showCategory?: boolean;
  placeholder?: string;
}

export function SearchableGrid({ items, showCategory, placeholder = "Search calculators..." }: SearchableGridProps) {
  const [query, setQuery] = useState("");

  const q = query.toLowerCase().trim();
  const filtered = q
    ? items.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          (item.category && item.category.toLowerCase().includes(q))
      )
    : items;

  return (
    <div>
      <div className="mb-6">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-3 bg-background border border-card-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            autoComplete="off"
            spellCheck={false}
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
            >
              ✕
            </button>
          )}
        </div>
        {q && (
          <p className="text-xs text-muted mt-2">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
          </p>
        )}
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => (
            <div key={item.href} className="relative">
              <CalculatorCard
                title={item.title}
                description={item.description}
                href={item.href}
                emoji={item.emoji}
                icon={item.icon}
              />
              {showCategory && item.category && (
                <span className="absolute top-3 right-3 text-[10px] font-semibold text-muted bg-background border border-card-border rounded-full px-2 py-0.5">
                  {item.category}
                </span>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted">
          <p className="text-lg">No calculators found</p>
          <p className="text-sm mt-1">Try a different search term</p>
        </div>
      )}
    </div>
  );
}
