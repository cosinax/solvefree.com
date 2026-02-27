"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

function fmt(n: number): string {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const compoundOptions = [
  { label: "Annually",      value: "1" },
  { label: "Semi-annually", value: "2" },
  { label: "Quarterly",     value: "4" },
  { label: "Monthly",       value: "12" },
  { label: "Daily",         value: "365" },
];

export default function PresentValuePage() {
  const [v, setV] = useHashState({
    mode: "lump",
    fv: "20000",
    rate: "7",
    years: "10",
    n: "12",
    payment: "500",
    periods: "120",
  });
  const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
  const sc = "w-full px-3 py-2.5 bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

  const fv      = parseFloat(v.fv);
  const rate    = parseFloat(v.rate) / 100;
  const years   = parseFloat(v.years);
  const n       = parseInt(v.n);
  const payment = parseFloat(v.payment);
  const periods = parseInt(v.periods);
  const validLump = v.mode === "lump" && fv > 0 && rate >= 0 && years > 0 && n > 0;
  const validAnn  = v.mode === "annuity" && payment > 0 && rate > 0 && periods > 0 && n > 0;

  // Lump sum PV
  const pvFactor  = validLump ? 1 / Math.pow(1 + rate / n, n * years) : 0;
  const pv        = validLump ? fv * pvFactor : 0;
  const discount  = validLump ? fv - pv : 0;

  // Annuity PV
  const rPerPeriod = rate / n;
  const pvAnnuity  = validAnn
    ? payment * (1 - Math.pow(1 + rPerPeriod, -periods)) / rPerPeriod
    : 0;
  const totalPayments = validAnn ? payment * periods : 0;

  return (
    <CalculatorShell title="Present Value Calculator" description="Discount a future lump sum or annuity stream to today's value.">
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-muted mb-1">Mode</label>
          <select value={v.mode} onChange={e => setV({ mode: e.target.value })} className={sc}>
            <option value="lump">Lump Sum — discount a future amount</option>
            <option value="annuity">Annuity — PV of regular payments</option>
          </select>
        </div>

        {v.mode === "lump" ? (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-muted mb-1">Future Value ($)</label>
              <input type="number" value={v.fv} onChange={e => setV({ fv: e.target.value })} className={ic} min="0" />
            </div>
            <div>
              <label className="block text-sm text-muted mb-1">Annual Discount Rate (%)</label>
              <input type="number" value={v.rate} onChange={e => setV({ rate: e.target.value })} className={ic} step="0.1" />
            </div>
            <div>
              <label className="block text-sm text-muted mb-1">Years</label>
              <input type="number" value={v.years} onChange={e => setV({ years: e.target.value })} className={ic} min="0" step="0.5" />
            </div>
            <div>
              <label className="block text-sm text-muted mb-1">Compound Frequency</label>
              <select value={v.n} onChange={e => setV({ n: e.target.value })} className={sc}>
                {compoundOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-muted mb-1">Regular Payment ($)</label>
              <input type="number" value={v.payment} onChange={e => setV({ payment: e.target.value })} className={ic} min="0" />
            </div>
            <div>
              <label className="block text-sm text-muted mb-1">Annual Discount Rate (%)</label>
              <input type="number" value={v.rate} onChange={e => setV({ rate: e.target.value })} className={ic} step="0.1" />
            </div>
            <div>
              <label className="block text-sm text-muted mb-1">Number of Periods</label>
              <input type="number" value={v.periods} onChange={e => setV({ periods: e.target.value })} className={ic} min="1" />
            </div>
            <div>
              <label className="block text-sm text-muted mb-1">Periods per Year</label>
              <select value={v.n} onChange={e => setV({ n: e.target.value })} className={sc}>
                {compoundOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>
        )}

        {(validLump || validAnn) && (
          <div className="space-y-3">
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="block text-sm text-muted">Present Value</span>
              <span className="block font-mono font-bold text-4xl text-primary">
                ${fmt(v.mode === "lump" ? pv : pvAnnuity)}
              </span>
            </div>
            {v.mode === "lump" ? (
              <div className="grid grid-cols-2 gap-2">
                <div className="px-3 py-3 bg-primary-light rounded-lg text-center">
                  <span className="block text-xs text-muted">Discount Amount</span>
                  <span className="font-mono font-semibold">${fmt(discount)}</span>
                </div>
                <div className="px-3 py-3 bg-primary-light rounded-lg text-center">
                  <span className="block text-xs text-muted">PV Factor</span>
                  <span className="font-mono font-semibold">{pvFactor.toFixed(6)}</span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <div className="px-3 py-3 bg-primary-light rounded-lg text-center">
                  <span className="block text-xs text-muted">Total Payments</span>
                  <span className="font-mono font-semibold">${fmt(totalPayments)}</span>
                </div>
                <div className="px-3 py-3 bg-primary-light rounded-lg text-center">
                  <span className="block text-xs text-muted">Total Discount</span>
                  <span className="font-mono font-semibold">${fmt(totalPayments - pvAnnuity)}</span>
                </div>
              </div>
            )}
          </div>
        )}
        <p className="text-xs text-muted">
          {v.mode === "lump"
            ? "PV = FV / (1 + r/n)^(n×t)"
            : "PV = PMT × (1 − (1 + r/n)^(−periods)) / (r/n)"}
        </p>
      </div>
    </CalculatorShell>
  );
}
