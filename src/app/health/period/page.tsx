"use client";

import { useHashState } from "@/hooks/useHashState";
import { CalculatorShell } from "@/components/CalculatorShell";

const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function formatDate(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function PeriodPage() {
  const [v, setV] = useHashState({
    lastPeriod: "",
    cycleLength: "28",
    periodDuration: "5",
  });

  const cycleLen = parseInt(v.cycleLength) || 28;
  const periodDur = parseInt(v.periodDuration) || 5;

  const cycles: Array<{
    num: number;
    start: Date;
    end: Date;
    ovulation: Date;
    fertileStart: Date;
    fertileEnd: Date;
  }> = [];

  if (v.lastPeriod) {
    const base = new Date(v.lastPeriod + "T12:00:00");
    if (!isNaN(base.getTime())) {
      for (let i = 1; i <= 6; i++) {
        const start = addDays(base, i * cycleLen);
        const end = addDays(start, periodDur - 1);
        const ovulation = addDays(start, 14);
        const fertileStart = addDays(ovulation, -5);
        const fertileEnd = addDays(ovulation, 1);
        cycles.push({ num: i, start, end, ovulation, fertileStart, fertileEnd });
      }
    }
  }

  // Current period info
  let currentPeriodEnd: Date | null = null;
  let daysUntilNext: number | null = null;
  if (v.lastPeriod && cycles.length > 0) {
    const base = new Date(v.lastPeriod + "T12:00:00");
    if (!isNaN(base.getTime())) {
      currentPeriodEnd = addDays(base, periodDur - 1);
      const today = new Date();
      const next = cycles[0].start;
      const diff = Math.round((next.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      daysUntilNext = diff;
    }
  }

  return (
    <CalculatorShell title="Period Calculator" description="Predict your next periods and ovulation windows based on your cycle.">
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-muted mb-1">First day of last period</label>
          <input type="date" value={v.lastPeriod} onChange={(e) => setV({ lastPeriod: e.target.value })} className={ic} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-muted mb-1">Cycle length (days)</label>
            <input type="number" value={v.cycleLength} onChange={(e) => setV({ cycleLength: e.target.value })} placeholder="28" min="21" max="45" className={ic} />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Period duration (days)</label>
            <input type="number" value={v.periodDuration} onChange={(e) => setV({ periodDuration: e.target.value })} placeholder="5" min="2" max="10" className={ic} />
          </div>
        </div>

        {cycles.length > 0 && (
          <div className="space-y-3">
            {daysUntilNext !== null && (
              <div className="bg-primary-light rounded-xl p-4 text-center">
                <span className="block text-sm text-muted mb-1">Next period</span>
                <span className="block font-mono font-bold text-3xl text-primary">{formatDate(cycles[0].start)}</span>
                <span className="block text-sm text-muted mt-1">
                  {daysUntilNext > 0 ? `in ${daysUntilNext} day${daysUntilNext !== 1 ? "s" : ""}` : daysUntilNext === 0 ? "today" : `${Math.abs(daysUntilNext)} day${Math.abs(daysUntilNext) !== 1 ? "s" : ""} ago`}
                </span>
              </div>
            )}

            <p className="text-xs text-muted font-semibold uppercase tracking-wide">Next 6 cycles</p>
            <div className="space-y-2">
              {cycles.map((c) => (
                <div key={c.num} className="border border-card-border rounded-lg p-3 space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="font-semibold">Cycle {c.num}</span>
                    <span className="text-muted">Period: {formatDate(c.start)} – {formatDate(c.end)}</span>
                  </div>
                  <div className="flex justify-between px-2 py-1 bg-background rounded text-xs font-mono">
                    <span className="text-muted">Fertile window</span>
                    <span>{formatDate(c.fertileStart)} – {formatDate(c.fertileEnd)}</span>
                  </div>
                  <div className="flex justify-between px-2 py-1 bg-background rounded text-xs font-mono">
                    <span className="text-muted">Ovulation (est.)</span>
                    <span>{formatDate(c.ovulation)}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-xs text-muted space-y-1 pt-1 border-t border-card-border">
              <p className="font-semibold">How this works</p>
              <p>Ovulation is estimated at day 14 of the cycle. The fertile window is 5 days before through 1 day after ovulation. Individual cycles vary.</p>
              <p className="font-semibold text-accent">For informational purposes only — not medical advice. Cycle lengths vary and this method is not suitable for contraception.</p>
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
