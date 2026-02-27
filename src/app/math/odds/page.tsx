"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
const sel = "w-full px-3 py-2.5 bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

type InputMode = "percent" | "decimal" | "fraction" | "odds";

function parseProbability(mode: InputMode, val: string, num: string, den: string, oddsFor: string, oddsAgainst: string): number | null {
  if (mode === "percent") {
    const p = parseFloat(val);
    return !isNaN(p) && p >= 0 && p <= 100 ? p / 100 : null;
  }
  if (mode === "decimal") {
    const p = parseFloat(val);
    return !isNaN(p) && p >= 0 && p <= 1 ? p : null;
  }
  if (mode === "fraction") {
    const n = parseFloat(num), d = parseFloat(den);
    return !isNaN(n) && !isNaN(d) && d > 0 ? n / d : null;
  }
  if (mode === "odds") {
    const f = parseFloat(oddsFor), a = parseFloat(oddsAgainst);
    return !isNaN(f) && !isNaN(a) && f + a > 0 ? f / (f + a) : null;
  }
  return null;
}

function toAmericanOdds(p: number): string {
  if (p <= 0 || p >= 1) return "—";
  if (p >= 0.5) return `−${Math.round(p / (1 - p) * 100)}`;
  return `+${Math.round((1 - p) / p * 100)}`;
}

function toDecimalOdds(p: number): string {
  if (p <= 0) return "—";
  return (1 / p).toFixed(3);
}

function toFractionalOdds(p: number): string {
  if (p <= 0 || p >= 1) return "—";
  const against = (1 - p) / p;
  // Find simplest fraction
  const tolerance = 0.001;
  for (let d = 1; d <= 20; d++) {
    const n = Math.round(against * d);
    if (Math.abs(n / d - against) < tolerance) return `${n}/${d}`;
  }
  return `${(against).toFixed(2)}/1`;
}

function toOddsNotation(p: number): string {
  if (p <= 0 || p >= 1) return "—";
  const against = (1 - p);
  return `${p.toFixed(3)} : ${against.toFixed(3)}`;
}

export default function OddsPage() {
  const [v, setV] = useHashState({ mode: "percent", pct: "40", dec: "0.4", num: "2", den: "5", oddsFor: "2", oddsAgainst: "3" });

  const mode = v.mode as InputMode;
  const prob = parseProbability(mode, v.mode === "percent" ? v.pct : v.dec, v.num, v.den, v.oddsFor, v.oddsAgainst);

  return (
    <CalculatorShell title="Odds & Probability Converter" description="Convert between probability percentage, decimal odds, fractional odds, and American odds.">
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-muted mb-1">Input Format</label>
          <select value={v.mode} onChange={e => setV({ mode: e.target.value })} className={sel}>
            <option value="percent">Percentage (e.g. 40%)</option>
            <option value="decimal">Decimal (0.0–1.0)</option>
            <option value="fraction">Fraction (e.g. 2/5)</option>
            <option value="odds">Odds notation (e.g. 2:3)</option>
          </select>
        </div>

        {mode === "percent" && (
          <div>
            <label className="block text-sm text-muted mb-1">Probability (%)</label>
            <input type="number" value={v.pct} onChange={e => setV({ pct: e.target.value })} min="0" max="100" step="0.1" className={ic} />
          </div>
        )}
        {mode === "decimal" && (
          <div>
            <label className="block text-sm text-muted mb-1">Probability (0–1)</label>
            <input type="number" value={v.dec} onChange={e => setV({ dec: e.target.value })} min="0" max="1" step="0.01" className={ic} />
          </div>
        )}
        {mode === "fraction" && (
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-sm text-muted mb-1">Numerator</label><input type="number" value={v.num} onChange={e => setV({ num: e.target.value })} className={ic} /></div>
            <div><label className="block text-sm text-muted mb-1">Denominator</label><input type="number" value={v.den} onChange={e => setV({ den: e.target.value })} className={ic} /></div>
          </div>
        )}
        {mode === "odds" && (
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-sm text-muted mb-1">For (wins)</label><input type="number" value={v.oddsFor} onChange={e => setV({ oddsFor: e.target.value })} className={ic} /></div>
            <div><label className="block text-sm text-muted mb-1">Against (losses)</label><input type="number" value={v.oddsAgainst} onChange={e => setV({ oddsAgainst: e.target.value })} className={ic} /></div>
          </div>
        )}

        {prob !== null && (
          <div className="space-y-3">
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="block text-xs text-muted mb-1">Probability</span>
              <span className="block font-mono font-bold text-4xl text-primary">{(prob * 100).toFixed(3)}%</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
                <span className="text-muted">Decimal probability</span>
                <span>{prob.toFixed(6)}</span>
              </div>
              <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
                <span className="text-muted">Decimal odds</span>
                <span>{toDecimalOdds(prob)}</span>
              </div>
              <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
                <span className="text-muted">Fractional odds</span>
                <span>{toFractionalOdds(prob)}</span>
              </div>
              <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
                <span className="text-muted">American odds (Moneyline)</span>
                <span>{toAmericanOdds(prob)}</span>
              </div>
              <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
                <span className="text-muted">Odds notation (for:against)</span>
                <span>{toOddsNotation(prob)}</span>
              </div>
              <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
                <span className="text-muted">Implied probability</span>
                <span>{(prob * 100).toFixed(2)}%</span>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-1">
          <p className="text-xs text-muted font-semibold">Format Reference</p>
          <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono"><span className="text-muted">Decimal odds</span><span>Payout per $1 stake (incl. stake)</span></div>
          <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono"><span className="text-muted">Fractional odds</span><span>Profit / stake (e.g. 3/2 = $3 per $2)</span></div>
          <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono"><span className="text-muted">American + (underdog)</span><span>Profit per $100 bet</span></div>
          <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono"><span className="text-muted">American − (favorite)</span><span>Bet needed to win $100</span></div>
        </div>
      </div>
    </CalculatorShell>
  );
}
