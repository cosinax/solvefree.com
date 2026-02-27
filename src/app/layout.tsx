import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { allCalculators } from "@/data/calculators";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://solvefree.com"),
  title: {
    default: "SolveFree — Free Online Calculators",
    template: "%s | SolveFree",
  },
  description: `${allCalculators.length}+ free online calculators for math, finance, health, conversions, timers, electronics, AI, and more. No ads. No tracking. 100% browser-based.`,
  keywords: [
    "free calculator",
    "online calculator",
    "math calculator",
    "mortgage calculator",
    "BMI calculator",
    "unit converter",
    "investment calculator",
    "percentage calculator",
    "scientific calculator",
    "loan calculator",
    "compound interest calculator",
    "health calculator",
    "electricity calculator",
    "AI token calculator",
    "timer",
    "stopwatch",
  ],
  alternates: {
    canonical: "https://solvefree.com",
  },
  openGraph: {
    type: "website",
    siteName: "SolveFree",
    title: "SolveFree — Free Online Calculators",
    description: `${allCalculators.length}+ free online calculators. No ads, no tracking. Math, finance, health, conversions, electronics, AI, and more.`,
    url: "https://solvefree.com",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
