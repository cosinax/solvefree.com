"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

function parseDate(s: string): Date | null {
  if (!s || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
  const d = new Date(s + "T00:00:00");
  return isNaN(d.getTime()) ? null : d;
}

function diffDates(a: Date, b: Date): { years: number; months: number; days: number } {
  let start = a < b ? a : b;
  let end = a < b ? b : a;
  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();
  if (days < 0) { months--; const prev = new Date(end.getFullYear(), end.getMonth(), 0); days += prev.getDate(); }
  if (months < 0) { years--; months += 12; }
  return { years, months, days };
}

function getAge(dob: Date, at: Date): { years: number; months: number; days: number } {
  return diffDates(dob, at);
}

const TODAY = new Date().toISOString().split("T")[0];

export default function AgeDifferencePage() {
  const [v, setV] = useHashState({ dob1: "1990-06-15", dob2: "1985-03-22" });

  const d1 = parseDate(v.dob1);
  const d2 = parseDate(v.dob2);
  const today = new Date(TODAY + "T00:00:00");
  const valid = d1 && d2;

  let diff: { years: number; months: number; days: number } | null = null;
  let older: 1 | 2 | null = null;
  let age1: { years: number; months: number; days: number } | null = null;
  let age2: { years: number; months: number; days: number } | null = null;
  let olderAtBirth: number | null = null;

  if (valid && d1 && d2) {
    diff = diffDates(d1, d2);
    older = d1 < d2 ? 1 : 2;
    age1 = getAge(d1, today);
    age2 = getAge(d2, today);
    const olderDob = older === 1 ? d1 : d2;
    const youngerDob = older === 1 ? d2 : d1;
    olderAtBirth = getAge(olderDob, youngerDob).years;
  }

  const totalDays = valid && d1 && d2 ? Math.abs(Math.round((d1.getTime() - d2.getTime()) / 86400000)) : 0;

  return (
    <CalculatorShell title="Age Difference Calculator" description="Find the age difference between two people and see current ages and interesting milestones.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-muted mb-1">Person 1 Birth Date</label>
            <input type="date" value={v.dob1} onChange={e => setV({ dob1: e.target.value })} className={ic} />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Person 2 Birth Date</label>
            <input type="date" value={v.dob2} onChange={e => setV({ dob2: e.target.value })} className={ic} />
          </div>
        </div>

        {valid && diff && age1 && age2 && (
          <div className="space-y-3">
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="block text-xs text-muted mb-1">Age Difference</span>
              <span className="block font-mono font-bold text-4xl text-primary">
                {diff.years}y {diff.months}m {diff.days}d
              </span>
              <span className="text-xs text-muted">{totalDays.toLocaleString()} days total</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col px-3 py-2.5 bg-background border border-card-border rounded text-xs font-mono">
                <span className="text-muted mb-1">Person 1 Current Age</span>
                <span className="font-bold">{age1.years} yrs, {age1.months} mo, {age1.days} d</span>
              </div>
              <div className="flex flex-col px-3 py-2.5 bg-background border border-card-border rounded text-xs font-mono">
                <span className="text-muted mb-1">Person 2 Current Age</span>
                <span className="font-bold">{age2.years} yrs, {age2.months} mo, {age2.days} d</span>
              </div>
            </div>
            <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
              <span className="text-muted">Who is older</span>
              <span>Person {older}</span>
            </div>
            {olderAtBirth !== null && (
              <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
                <span className="text-muted">When younger was born, older was</span>
                <span>{olderAtBirth} years old</span>
              </div>
            )}
          </div>
        )}
        {!valid && (v.dob1 || v.dob2) && (
          <p className="text-sm text-muted">Enter valid dates in YYYY-MM-DD format.</p>
        )}
      </div>
    </CalculatorShell>
  );
}
