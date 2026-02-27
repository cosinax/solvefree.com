import { PageShell } from "@/components/PageShell";
import { SearchableGrid } from "@/components/SearchableGrid";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Security Tools",
  description: "Free security tools: password strength checker, entropy calculator, JWT decoder, hash identifier, bcrypt cost estimator, and more.",
  openGraph: {
    title: "Security Tools — SolveFree",
    description: "Free security tools: password strength, JWT decoder, entropy, hash comparison.",
    url: "https://solvefree.com/security",
  },
  alternates: { canonical: "https://solvefree.com/security" },
};

const calculators = [
  { title: "Password Strength Checker", description: "Analyze password entropy and strength", href: "/security/password-strength", icon: "🔒" },
  { title: "Entropy Calculator", description: "Calculate password entropy bits", href: "/security/entropy", icon: "🎰" },
  { title: "JWT Decoder", description: "Decode and inspect JWT tokens (no verification)", href: "/security/jwt-decoder", icon: "🎫" },
  { title: "Hash Identifier", description: "Identify hash type by length and format", href: "/security/hash-identifier", icon: "🔍" },
  { title: "bcrypt Cost Calculator", description: "Estimate bcrypt hashing time by cost factor", href: "/security/bcrypt-cost", icon: "🛡️" },
  { title: "WebAuthn Tester", description: "Test passkey registration and authentication in your browser", href: "/security/webauthn", icon: "🔑" },
  { title: "Browser Fingerprint Checker", description: "See what your browser reveals: canvas, WebGL, fonts, audio, and 35+ signals", href: "/security/fingerprint", icon: "🕵️" },
];

export default function SecurityPage() {
  return (
    <PageShell title="Security Tools" description="Password analysis, JWT decoding, hash identification, and cryptographic utilities">
      <SearchableGrid items={calculators} placeholder="Search security tools..." />
    </PageShell>
  );
}
