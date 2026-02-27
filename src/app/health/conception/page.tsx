"use client";

import { useHashState } from "@/hooks/useHashState";
import { CalculatorShell } from "@/components/CalculatorShell";

const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

function addDays(d: Date, days: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + days);
  return r;
}

function fmt(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function fmtShort(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function weeksDays(days: number): string {
  const w = Math.floor(days / 7);
  const d = days % 7;
  return `${w} week${w !== 1 ? "s" : ""}${d > 0 ? ` ${d} day${d !== 1 ? "s" : ""}` : ""}`;
}

export default function ConceptionPage() {
  const [v, setV] = useHashState({
    mode: "lmp", // lmp | conception | due
    date: "",
  });

  let lmp: Date | null = null;
  let conception: Date | null = null;
  let due: Date | null = null;

  if (v.date) {
    const d = new Date(v.date + "T12:00:00");
    if (!isNaN(d.getTime())) {
      if (v.mode === "lmp") {
        lmp = d;
        conception = addDays(d, 14);
        due = addDays(d, 280);
      } else if (v.mode === "conception") {
        conception = d;
        lmp = addDays(d, -14);
        due = addDays(d, 266);
      } else if (v.mode === "due") {
        due = d;
        lmp = addDays(d, -280);
        conception = addDays(d, -266);
      }
    }
  }

  // Gestational age from today
  let gestDays: number | null = null;
  if (lmp) {
    const today = new Date();
    const diff = Math.round((today.getTime() - lmp.getTime()) / (1000 * 60 * 60 * 24));
    if (diff >= 0 && diff <= 295) gestDays = diff;
  }

  // Trimesters
  const tri1End = lmp ? addDays(lmp, 13 * 7) : null;
  const tri2End = lmp ? addDays(lmp, 27 * 7) : null;

  const row = (label: string, value: string) => (
    <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
      <span className="text-muted">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );

  return (
    <CalculatorShell title="Conception Calculator" description="Calculate conception date, due date, and gestational age from any known date.">
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-muted mb-1">I know my…</label>
          <div className="grid grid-cols-3 gap-2">
            {[{ id: "lmp", label: "Last Period" }, { id: "conception", label: "Conception" }, { id: "due", label: "Due Date" }].map((m) => (
              <button key={m.id} onClick={() => setV({ mode: m.id, date: "" })}
                className={`py-2 rounded-lg text-sm font-medium transition-colors ${v.mode === m.id ? "bg-primary text-white" : "bg-background border border-card-border"}`}>
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm text-muted mb-1">
            {v.mode === "lmp" ? "First day of last period" : v.mode === "conception" ? "Conception date" : "Due date"}
          </label>
          <input type="date" value={v.date} onChange={(e) => setV({ date: e.target.value })} className={ic} />
        </div>

        {due && lmp && conception && (
          <div className="space-y-3">
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="block text-sm text-muted mb-1">Estimated Due Date</span>
              <span className="block font-mono font-bold text-2xl text-primary">{fmt(due)}</span>
              {gestDays !== null && (
                <span className="block text-sm text-muted mt-1">{weeksDays(gestDays)} pregnant</span>
              )}
            </div>

            <div className="space-y-1.5">
              {row("Last menstrual period (LMP)", fmtShort(lmp))}
              {row("Estimated conception", fmtShort(conception))}
              {row("Estimated due date", fmtShort(due))}
            </div>

            {gestDays !== null && (
              <>
                <p className="text-xs text-muted font-semibold uppercase tracking-wide">Gestational age today</p>
                <div className="bg-primary-light rounded-xl p-3 text-center">
                  <span className="block font-mono font-bold text-2xl text-primary">{weeksDays(gestDays)}</span>
                  <span className="block text-xs text-muted mt-1">({gestDays} days since LMP)</span>
                </div>
              </>
            )}

            <p className="text-xs text-muted font-semibold uppercase tracking-wide">Trimester dates</p>
            <div className="space-y-1.5">
              {row("1st trimester", `${fmtShort(lmp)} – ${fmtShort(tri1End!)}`)}
              {row("2nd trimester", `${fmtShort(addDays(tri1End!, 1))} – ${fmtShort(tri2End!)}`)}
              {row("3rd trimester", `${fmtShort(addDays(tri2End!, 1))} – ${fmtShort(due)}`)}
            </div>

            <p className="text-xs text-muted font-semibold uppercase tracking-wide">Key dates</p>
            <div className="space-y-1.5">
              {row("Heartbeat detectable (~6 wks)", fmtShort(addDays(lmp, 42)))}
              {row("End of 1st trimester (13 wks)", fmtShort(tri1End!))}
              {row("Anatomy scan (~20 wks)", fmtShort(addDays(lmp, 140)))}
              {row("Viability (~24 wks)", fmtShort(addDays(lmp, 168)))}
              {row("Full term (39 wks)", fmtShort(addDays(lmp, 273)))}
            </div>

            <p className="text-xs text-muted pt-1 border-t border-card-border">
              For informational purposes only — not medical advice. Due dates are estimates; only ~5% of babies are born on their exact due date. Consult your healthcare provider.
            </p>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
