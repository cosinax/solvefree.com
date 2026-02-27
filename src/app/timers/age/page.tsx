"use client";

import { useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";

export default function AgePage() {
  const [birthDate, setBirthDate] = useState("");

  const bd = birthDate ? new Date(birthDate + "T00:00:00") : null;
  const today = new Date();
  const valid = bd && bd < today;

  let years = 0, months = 0, days = 0, totalDays = 0;
  if (valid && bd) {
    totalDays = Math.floor((today.getTime() - bd.getTime()) / (24 * 60 * 60 * 1000));
    years = today.getFullYear() - bd.getFullYear();
    months = today.getMonth() - bd.getMonth();
    days = today.getDate() - bd.getDate();
    if (days < 0) { months--; const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0); days += prevMonth.getDate(); }
    if (months < 0) { years--; months += 12; }
  }

  const nextBirthday = bd ? new Date(today.getFullYear(), bd.getMonth(), bd.getDate()) : null;
  if (nextBirthday && nextBirthday < today) nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
  const daysUntilBirthday = nextBirthday ? Math.ceil((nextBirthday.getTime() - today.getTime()) / (24 * 60 * 60 * 1000)) : 0;

  return (
    <CalculatorShell title="Age Calculator" description="Calculate your exact age in years, months, and days.">
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-muted mb-1">Date of Birth</label>
          <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)}
            className="w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        {valid && (
          <div className="space-y-3">
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="block text-sm text-muted">Your Age</span>
              <span className="block font-mono font-bold text-3xl text-primary">{years} years, {months} months, {days} days</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="px-3 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">Total Days</span>
                <span className="font-mono font-semibold">{totalDays.toLocaleString()}</span>
              </div>
              <div className="px-3 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">Total Weeks</span>
                <span className="font-mono font-semibold">{Math.floor(totalDays / 7).toLocaleString()}</span>
              </div>
              <div className="px-3 py-3 bg-primary-light rounded-lg text-center">
                <span className="block text-xs text-muted">Next Birthday</span>
                <span className="font-mono font-semibold">{daysUntilBirthday} days</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
