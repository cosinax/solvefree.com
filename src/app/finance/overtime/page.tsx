"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

function fmt(n: number): string {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function OvertimePage() {
  const [v, setV] = useHashState({
    hourlyRate: "25",
    regularHours: "40",
    overtimeHours: "10",
    multiplier: "1.5",
    weeks: "1",
  });
  const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

  const rate     = parseFloat(v.hourlyRate);
  const regular  = parseFloat(v.regularHours);
  const ot       = parseFloat(v.overtimeHours);
  const mult     = parseFloat(v.multiplier);
  const weeks    = parseFloat(v.weeks);
  const valid    = rate > 0 && regular >= 0 && ot >= 0 && mult > 0 && weeks > 0;

  const regularPay  = valid ? rate * regular * weeks : 0;
  const overtimePay = valid ? rate * mult * ot * weeks : 0;
  const totalPay    = regularPay + overtimePay;
  const totalHours  = (regular + ot) * weeks;
  const effectiveRate = totalHours > 0 ? totalPay / totalHours : 0;

  return (
    <CalculatorShell title="Overtime Calculator" description="Calculate regular pay, overtime pay, and effective hourly rate.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-muted mb-1">Hourly Rate ($)</label>
            <input type="number" value={v.hourlyRate} onChange={e => setV({ hourlyRate: e.target.value })} className={ic} min="0" step="0.01" />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Regular Hours / Week</label>
            <input type="number" value={v.regularHours} onChange={e => setV({ regularHours: e.target.value })} className={ic} min="0" />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Overtime Hours / Week</label>
            <input type="number" value={v.overtimeHours} onChange={e => setV({ overtimeHours: e.target.value })} className={ic} min="0" />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">OT Multiplier (e.g. 1.5)</label>
            <input type="number" value={v.multiplier} onChange={e => setV({ multiplier: e.target.value })} className={ic} min="1" step="0.25" />
          </div>
          <div className="col-span-2">
            <label className="block text-sm text-muted mb-1">Number of Weeks</label>
            <input type="number" value={v.weeks} onChange={e => setV({ weeks: e.target.value })} className={ic} min="1" />
          </div>
        </div>

        {valid && (
          <div className="space-y-3">
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="block text-sm text-muted">Total Pay</span>
              <span className="block font-mono font-bold text-4xl text-primary">${fmt(totalPay)}</span>
            </div>
            <div className="space-y-2">
              {[
                { label: "Regular Pay",          value: `$${fmt(regularPay)}` },
                { label: "Overtime Pay",          value: `$${fmt(overtimePay)}` },
                { label: "OT Rate (per hour)",    value: `$${fmt(rate * mult)}` },
                { label: "Total Hours",           value: `${totalHours.toFixed(1)} hrs` },
                { label: "Effective Hourly Rate", value: `$${fmt(effectiveRate)}` },
              ].map(row => (
                <div key={row.label} className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
                  <span className="text-muted">{row.label}</span>
                  <span className="font-semibold">{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
