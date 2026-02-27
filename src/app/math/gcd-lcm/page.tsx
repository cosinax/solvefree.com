"use client";

import { useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";

function gcd(a: number, b: number): number {
  a = Math.abs(a); b = Math.abs(b);
  while (b) { [a, b] = [b, a % b]; }
  return a;
}

function lcm(a: number, b: number): number {
  return Math.abs(a * b) / gcd(a, b);
}

function gcdMultiple(nums: number[]): number {
  return nums.reduce((a, b) => gcd(a, b));
}

function lcmMultiple(nums: number[]): number {
  return nums.reduce((a, b) => lcm(a, b));
}

export default function GcdLcmPage() {
  const [input, setInput] = useState("");

  const nums = input.split(",").map(s => s.trim()).filter(s => s !== "" && !isNaN(Number(s)) && Number.isInteger(Number(s))).map(Number).filter(n => n !== 0);
  const hasData = nums.length >= 2;

  return (
    <CalculatorShell title="GCD / LCM Calculator" description="Find the greatest common divisor and least common multiple of two or more integers.">
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-muted mb-1">Enter integers (comma-separated)</label>
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. 12, 18, 24"
            className="w-full px-4 py-3 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            autoComplete="off" spellCheck={false} />
          {nums.length > 0 && nums.length < 2 && (
            <p className="text-xs text-muted mt-1">Enter at least 2 numbers</p>
          )}
        </div>

        {hasData && (
          <div className="grid grid-cols-2 gap-3">
            <div className="px-4 py-4 bg-primary-light rounded-lg text-center">
              <span className="block text-xs text-muted uppercase tracking-wide mb-1">GCD</span>
              <span className="font-mono font-bold text-2xl">{gcdMultiple(nums)}</span>
            </div>
            <div className="px-4 py-4 bg-primary-light rounded-lg text-center">
              <span className="block text-xs text-muted uppercase tracking-wide mb-1">LCM</span>
              <span className="font-mono font-bold text-2xl">{lcmMultiple(nums)}</span>
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
