"use client";

import { useHashState } from "@/hooks/useHashState";
import { CalculatorShell } from "@/components/CalculatorShell";

const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

interface Milestone {
  label: string;
  days: number;
}

const MILESTONES: Milestone[] = [
  { label: "1 week", days: 7 },
  { label: "1 month", days: 30 },
  { label: "90 days", days: 90 },
  { label: "6 months", days: 183 },
  { label: "1 year", days: 365 },
  { label: "2 years", days: 730 },
  { label: "5 years", days: 1825 },
  { label: "10 years", days: 3650 },
];

function formatDuration(days: number): string {
  if (days < 7) return `${days} day${days !== 1 ? "s" : ""}`;
  if (days < 30) {
    const w = Math.floor(days / 7), d = days % 7;
    return `${w} week${w !== 1 ? "s" : ""}${d > 0 ? ` ${d} day${d !== 1 ? "s" : ""}` : ""}`;
  }
  if (days < 365) {
    const m = Math.floor(days / 30), d = days % 30;
    return `${m} month${m !== 1 ? "s" : ""}${d > 0 ? ` ${d} day${d !== 1 ? "s" : ""}` : ""}`;
  }
  const y = Math.floor(days / 365), rem = days % 365;
  const m = Math.floor(rem / 30), d2 = rem % 30;
  let s = `${y} year${y !== 1 ? "s" : ""}`;
  if (m > 0) s += ` ${m} month${m !== 1 ? "s" : ""}`;
  if (d2 > 0 && m === 0) s += ` ${d2} day${d2 !== 1 ? "s" : ""}`;
  return s;
}

function fmtDate(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function SobrietyPage() {
  const [v, setV] = useHashState({ startDate: "" });

  const today = new Date();
  today.setHours(12, 0, 0, 0);

  let daysSober: number | null = null;
  let startDate: Date | null = null;

  if (v.startDate) {
    const d = new Date(v.startDate + "T12:00:00");
    if (!isNaN(d.getTime()) && d <= today) {
      startDate = d;
      daysSober = Math.round((today.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
    }
  }

  const reachedMilestones = daysSober !== null ? MILESTONES.filter((m) => daysSober! >= m.days) : [];
  const nextMilestone = daysSober !== null ? MILESTONES.find((m) => m.days > daysSober!) : null;
  const daysToNext = nextMilestone && daysSober !== null ? nextMilestone.days - daysSober : null;

  const weeks = daysSober !== null ? (daysSober / 7).toFixed(1) : null;
  const months = daysSober !== null ? (daysSober / 30.44).toFixed(1) : null;
  const years = daysSober !== null ? Math.floor(daysSober / 365) : null;
  const remainingDays = daysSober !== null ? daysSober % 365 : null;

  const row = (label: string, value: string, reached = false) => (
    <div className={`flex justify-between px-3 py-1.5 ${reached ? "bg-primary-light" : "bg-background"} border border-card-border rounded text-xs font-mono`}>
      <span className="text-muted">{label}</span>
      <span className={`font-semibold ${reached ? "text-primary" : ""}`}>{value}</span>
    </div>
  );

  return (
    <CalculatorShell title="Sobriety Calculator" description="Track your sobriety milestone and celebrate your progress.">
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-muted mb-1">Sobriety start date</label>
          <input type="date" value={v.startDate} onChange={(e) => setV({ startDate: e.target.value })}
            max={today.toISOString().split("T")[0]} className={ic} />
        </div>

        {daysSober !== null && startDate && (
          <div className="space-y-3">
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="block text-sm text-muted mb-1">Days sober</span>
              <span className="block font-mono font-bold text-5xl text-primary">{daysSober.toLocaleString()}</span>
              <span className="block text-sm text-muted mt-1">since {fmtDate(startDate)}</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="bg-background border border-card-border rounded-lg p-3 text-center">
                <span className="block text-xs text-muted">Weeks</span>
                <span className="block font-mono font-bold">{weeks}</span>
              </div>
              <div className="bg-background border border-card-border rounded-lg p-3 text-center">
                <span className="block text-xs text-muted">Months</span>
                <span className="block font-mono font-bold">{months}</span>
              </div>
              <div className="bg-background border border-card-border rounded-lg p-3 text-center">
                <span className="block text-xs text-muted">Years</span>
                <span className="block font-mono font-bold">{years! > 0 ? `${years}y ${remainingDays}d` : "< 1"}</span>
              </div>
            </div>

            {nextMilestone && daysToNext !== null && (
              <div className="border border-card-border rounded-lg p-3 text-center">
                <span className="block text-xs text-muted mb-0.5">Next milestone</span>
                <span className="block font-semibold">{nextMilestone.label}</span>
                <span className="block text-sm text-primary font-mono">{daysToNext} day{daysToNext !== 1 ? "s" : ""} away</span>
                <span className="block text-xs text-muted">{fmtDate(new Date(startDate.getTime() + nextMilestone.days * 86400000))}</span>
              </div>
            )}

            {reachedMilestones.length > 0 && (
              <>
                <p className="text-xs text-muted font-semibold uppercase tracking-wide">Milestones reached</p>
                <div className="space-y-1.5">
                  {MILESTONES.map((m) => {
                    const reached = daysSober! >= m.days;
                    const milestoneDate = new Date(startDate!.getTime() + m.days * 86400000);
                    return row(
                      `${reached ? "✓ " : ""}${m.label}`,
                      reached ? fmtDate(milestoneDate) : `in ${m.days - daysSober!} days`,
                      reached
                    );
                  })}
                </div>
              </>
            )}

            <div className="bg-background border border-card-border rounded-lg p-4 text-sm text-muted space-y-1">
              <p className="font-semibold text-foreground">You are doing something incredible.</p>
              <p>Every single day counts. Sobriety is a journey, and reaching this point is a real achievement worth recognizing. Be proud of yourself.</p>
              <p className="text-xs">If you need support, SAMHSA's helpline is free and confidential: 1-800-662-4357.</p>
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
