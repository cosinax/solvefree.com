import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "SolveFree — Free Online Calculators",
    template: "%s | SolveFree",
  },
  description:
    "A massive collection of free online calculators. No ads, no tracking. Math, finance, health, conversions, timers, AI, electronics, and more.",
  keywords: [
    "calculator",
    "free calculator",
    "online calculator",
    "mortgage calculator",
    "BMI calculator",
    "unit converter",
    "investment calculator",
    "percentage calculator",
    "timer",
    "stopwatch",
  ],
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
