"use client";
import { useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";

const letters = [
  { upper: "Α", lower: "α", name: "Alpha",   latex: "\\alpha",   usage: "Angles, alpha particles, significance level" },
  { upper: "Β", lower: "β", name: "Beta",    latex: "\\beta",    usage: "Beta particles, regression coefficients, type II error" },
  { upper: "Γ", lower: "γ", name: "Gamma",   latex: "\\gamma",   usage: "Gamma function, Lorentz factor, photons" },
  { upper: "Δ", lower: "δ", name: "Delta",   latex: "\\delta",   usage: "Change/difference (Δ), small quantities (δ), Dirac delta" },
  { upper: "Ε", lower: "ε", name: "Epsilon", latex: "\\epsilon", usage: "Small quantities, permittivity, error" },
  { upper: "Ζ", lower: "ζ", name: "Zeta",    latex: "\\zeta",    usage: "Riemann zeta function, damping ratio" },
  { upper: "Η", lower: "η", name: "Eta",     latex: "\\eta",     usage: "Efficiency, viscosity, learning rate (ML)" },
  { upper: "Θ", lower: "θ", name: "Theta",   latex: "\\theta",   usage: "Angles, temperature (θ), Big-Theta complexity" },
  { upper: "Ι", lower: "ι", name: "Iota",    latex: "\\iota",    usage: "Small quantities (rarely used)" },
  { upper: "Κ", lower: "κ", name: "Kappa",   latex: "\\kappa",   usage: "Curvature, dielectric constant, condition number" },
  { upper: "Λ", lower: "λ", name: "Lambda",  latex: "\\lambda",  usage: "Wavelength, eigenvalues, Poisson rate, Lambda calculus" },
  { upper: "Μ", lower: "μ", name: "Mu",      latex: "\\mu",      usage: "Mean (μ), micro- prefix (μm), friction coefficient" },
  { upper: "Ν", lower: "ν", name: "Nu",      latex: "\\nu",      usage: "Frequency (ν), kinematic viscosity" },
  { upper: "Ξ", lower: "ξ", name: "Xi",      latex: "\\xi",      usage: "Random variable, Xi baryon" },
  { upper: "Ο", lower: "ο", name: "Omicron", latex: "o",         usage: "Rarely used (looks like O)" },
  { upper: "Π", lower: "π", name: "Pi",      latex: "\\pi",      usage: "π ≈ 3.14159, product operator (Π)" },
  { upper: "Ρ", lower: "ρ", name: "Rho",     latex: "\\rho",     usage: "Density (ρ), resistivity, correlation coefficient" },
  { upper: "Σ", lower: "σ", name: "Sigma",   latex: "\\sigma",   usage: "Summation (Σ), standard deviation (σ), Stefan-Boltzmann constant" },
  { upper: "Τ", lower: "τ", name: "Tau",     latex: "\\tau",     usage: "Time constant (τ), torque, τ = 2π" },
  { upper: "Υ", lower: "υ", name: "Upsilon", latex: "\\upsilon", usage: "Rarely used in science" },
  { upper: "Φ", lower: "φ", name: "Phi",     latex: "\\phi",     usage: "Golden ratio φ, wave function, angle, magnetic flux" },
  { upper: "Χ", lower: "χ", name: "Chi",     latex: "\\chi",     usage: "Chi-squared test (χ²), chi distribution" },
  { upper: "Ψ", lower: "ψ", name: "Psi",     latex: "\\psi",     usage: "Quantum wave function (ψ), polygamma function" },
  { upper: "Ω", lower: "ω", name: "Omega",   latex: "\\omega",   usage: "Ohms (Ω), angular frequency (ω), Big-Omega complexity" },
];

export default function GreekAlphabetPage() {
  const [search, setSearch] = useState("");

  const filtered = search
    ? letters.filter(l =>
        l.name.toLowerCase().includes(search.toLowerCase()) ||
        l.upper.includes(search) ||
        l.lower.includes(search) ||
        l.latex.includes(search) ||
        l.usage.toLowerCase().includes(search.toLowerCase())
      )
    : letters;

  return (
    <CalculatorShell title="Greek Alphabet" description="Greek letters, LaTeX symbols, and their common uses in math, physics, and statistics.">
      <div className="space-y-3">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, symbol, or usage..."
          className="w-full px-3 py-2 text-sm bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />

        <div className="space-y-1.5">
          {filtered.map(l => (
            <div key={l.name} className="px-4 py-3 bg-background border border-card-border rounded-lg">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-2xl font-semibold text-primary w-8 text-center">{l.upper}</span>
                <span className="text-2xl font-semibold text-primary w-8 text-center">{l.lower}</span>
                <span className="font-semibold text-sm">{l.name}</span>
                <span className="font-mono text-xs text-muted bg-card border border-card-border px-2 py-0.5 rounded">{l.latex}</span>
              </div>
              <p className="text-xs text-muted">{l.usage}</p>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="text-sm text-muted text-center py-4">No letters match.</p>
          )}
        </div>
      </div>
    </CalculatorShell>
  );
}
