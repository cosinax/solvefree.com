"use client";
import { useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";

function calcEntropy(password: string): number {
  let charset = 0;
  if (/[a-z]/.test(password)) charset += 26;
  if (/[A-Z]/.test(password)) charset += 26;
  if (/[0-9]/.test(password)) charset += 10;
  if (/[^a-zA-Z0-9]/.test(password)) charset += 32;
  return charset > 0 ? Math.round(password.length * Math.log2(charset)) : 0;
}

function getStrength(entropy: number): { label: string; color: string; bar: string; width: string } {
  if (entropy < 28) return { label: "Very Weak 😬", color: "text-red-500", bar: "bg-red-500", width: "w-1/5" };
  if (entropy < 36) return { label: "Weak 😟", color: "text-orange-500", bar: "bg-orange-500", width: "w-2/5" };
  if (entropy < 60) return { label: "Moderate 🙂", color: "text-yellow-500", bar: "bg-yellow-500", width: "w-3/5" };
  if (entropy < 128) return { label: "Strong 💪", color: "text-green-500", bar: "bg-green-500", width: "w-4/5" };
  return { label: "Very Strong 🔒", color: "text-success", bar: "bg-success", width: "w-full" };
}

const commonPasswords = ["password", "123456", "qwerty", "admin", "letmein", "monkey", "iloveyou", "dragon", "welcome", "sunshine"];

export default function PasswordStrengthPage() {
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const entropy = calcEntropy(pw);
  const strength = getStrength(entropy);
  const isCommon = commonPasswords.includes(pw.toLowerCase());
  const hasLower = /[a-z]/.test(pw);
  const hasUpper = /[A-Z]/.test(pw);
  const hasDigit = /[0-9]/.test(pw);
  const hasSymbol = /[^a-zA-Z0-9]/.test(pw);
  const longEnough = pw.length >= 12;

  const checks = [
    { label: "At least 12 characters", ok: longEnough },
    { label: "Uppercase letters", ok: hasUpper },
    { label: "Lowercase letters", ok: hasLower },
    { label: "Numbers", ok: hasDigit },
    { label: "Special characters", ok: hasSymbol },
    { label: "Not a common password", ok: pw.length > 0 && !isCommon },
  ];

  return (
    <CalculatorShell title="Password Strength Checker" description="Analyze password strength by entropy, character set, and common patterns. Nothing leaves your browser.">
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-muted mb-1">Password</label>
          <div className="flex gap-2">
            <input
              type={show ? "text" : "password"} value={pw}
              onChange={e => setPw(e.target.value)}
              placeholder="Enter a password to analyze..."
              className="flex-1 px-4 py-3 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button onClick={() => setShow(!show)} className="px-3 py-2 bg-background border border-card-border rounded-lg text-sm hover:bg-primary-light">
              {show ? "🙈" : "👁️"}
            </button>
          </div>
        </div>
        {pw.length > 0 && (
          <>
            {isCommon && (
              <div className="px-4 py-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg text-sm text-danger font-medium">
                ⚠️ This is one of the most commonly used passwords and would be cracked instantly.
              </div>
            )}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className={`font-semibold ${strength.color}`}>{strength.label}</span>
                <span className="text-muted">{entropy} bits entropy</span>
              </div>
              <div className="w-full bg-card-border rounded-full h-2.5">
                <div className={`h-2.5 rounded-full transition-all ${strength.bar} ${strength.width}`} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="px-4 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">Length</span>
                <span className="font-mono font-bold text-xl">{pw.length}</span>
              </div>
              <div className="px-4 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">Entropy</span>
                <span className="font-mono font-bold text-xl">{entropy} bits</span>
              </div>
            </div>
            <div className="space-y-1.5">
              {checks.map(c => (
                <div key={c.label} className="flex items-center gap-2 text-sm">
                  <span className={c.ok ? "text-success" : "text-danger"}>{c.ok ? "✓" : "✗"}</span>
                  <span className={c.ok ? "text-muted" : ""}>{c.label}</span>
                </div>
              ))}
            </div>
            <div className="px-4 py-3 bg-background border border-card-border rounded-lg text-xs text-muted space-y-1">
              <p className="font-semibold">Estimated crack time (offline, modern GPU):</p>
              {entropy < 28 && <p>🚨 &lt; 1 second</p>}
              {entropy >= 28 && entropy < 40 && <p>⚠️ Minutes to hours</p>}
              {entropy >= 40 && entropy < 60 && <p>⚠️ Days to months</p>}
              {entropy >= 60 && entropy < 80 && <p>✅ Years</p>}
              {entropy >= 80 && <p>🔒 Centuries or longer</p>}
            </div>
          </>
        )}
        <p className="text-xs text-muted">🔒 Analysis is 100% local. Your password never leaves your browser.</p>
      </div>
    </CalculatorShell>
  );
}
