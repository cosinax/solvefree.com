import { PageShell } from "@/components/PageShell";
import { SearchableGrid } from "@/components/SearchableGrid";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Computer & Programming",
  description: "Free computer and programming tools: color converter, regex tester, JSON formatter, hash generator, and more.",
  openGraph: {
    title: "Developer Tools — SolveFree",
    description: "Free developer tools: JSON formatter, regex tester, Base64, UUID, hash generator, and more.",
    url: "https://solvefree.com/computer",
  },
  alternates: { canonical: "https://solvefree.com/computer" },
};

const calculators = [
  { title: "Color Converter", description: "Convert between HEX, RGB, HSL color formats", href: "/computer/color-converter", icon: "🎨" },
  { title: "JSON Formatter", description: "Format, validate, and minify JSON data", href: "/computer/json-formatter", icon: "{}" },
  { title: "Regex Tester", description: "Test regular expressions with live matching", href: "/computer/regex-tester", icon: ".*" },
  { title: "Hash Generator", description: "Generate SHA-1, SHA-256, SHA-512 hashes", href: "/computer/hash-generator", icon: "#️⃣" },
  { title: "Base64 Encoder", description: "Encode and decode Base64 strings", href: "/computer/base64", icon: "🔐" },
  { title: "URL Encoder", description: "Encode and decode URL components", href: "/computer/url-encoder", icon: "🔗" },
  { title: "Lorem Ipsum Generator", description: "Generate placeholder text", href: "/computer/lorem-ipsum", icon: "📄" },
  { title: "UUID Generator", description: "Generate random UUIDs (v4)", href: "/computer/uuid-generator", icon: "🆔" },
  { title: "Password Generator", description: "Generate secure random passwords", href: "/computer/password-generator", icon: "🔑" },
  { title: "Character Counter", description: "Count characters, words, lines, and more", href: "/computer/character-counter", icon: "🔤" },
  { title: "Chmod Calculator", description: "Calculate Unix file permissions", href: "/computer/chmod", icon: "🔒" },
  { title: "CSV to JSON", description: "Convert CSV data to JSON format", href: "/computer/csv-to-json", icon: "📊" },
  { title: "Pixel/REM Converter", description: "Convert between px, rem, and em units", href: "/computer/px-rem", icon: "📐" },
  { title: "HTML Entity Encoder", description: "Encode/decode HTML entities", href: "/computer/html-entities", icon: "🏷️" },
  { title: "Markdown Preview", description: "Write Markdown and see live preview", href: "/computer/markdown-preview", icon: "📝" },
  { title: "Diff Checker", description: "Compare two texts and see differences", href: "/computer/diff-checker", icon: "↔️" },
  { title: "Cron Expression", description: "Build and explain cron schedule expressions", href: "/computer/cron", icon: "🗓️" },
  { title: "IP Address Calculator", description: "Subnet calculator and IP address info", href: "/computer/ip-calculator", icon: "🌐" },
  { title: "Epoch Converter", description: "Convert epoch timestamps to dates", href: "/computer/epoch", icon: "⏱️" },
  { title: "Binary/Text Converter", description: "Convert between binary and text", href: "/computer/binary-text", icon: "🔢" },
  { title: "Aspect Ratio Calculator", description: "Ratios, equivalent resolutions, megapixels", href: "/computer/aspect-ratio", icon: "🖼️" },
];

export default function ComputerPage() {
  return (
    <PageShell title="Computer & Programming" description="Developer tools, text utilities, encoders, formatters, and more">
      <SearchableGrid items={calculators} placeholder="Search dev tools..." />
    </PageShell>
  );
}
