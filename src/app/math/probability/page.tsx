"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
const sel = "w-full px-3 py-2.5 bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

function factorial(n: number): number {
  if (n <= 1) return 1;
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

function binomCoeff(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  return factorial(n) / (factorial(k) * factorial(n - k));
}

function toFraction(p: number): string {
  // Simple rational approximation
  const tolerance = 1e-6;
  let h1 = 1, h2 = 0, k1 = 0, k2 = 1, b = p;
  do {
    const a = Math.floor(b);
    let aux = h1; h1 = a * h1 + h2; h2 = aux;
    aux = k1; k1 = a * k1 + k2; k2 = aux;
    b = 1 / (b - a);
  } while (Math.abs(p - h1 / k1) > p * tolerance && k1 < 1000);
  return k1 <= 100 ? `${h1}/${k1}` : p.toFixed(4);
}

type Mode = "basic" | "complement" | "union" | "conditional" | "binomial";

export default function ProbabilityPage() {
  const [v, setV] = useHashState({
    mode: "basic",
    events: "3", total: "10",
    pa: "0.3",
    pb: "0.5", pab: "0.15",
    pAandB: "0.12", pB: "0.4",
    n: "10", k: "3", p: "0.5",
  });

  const mode = v.mode as Mode;

  let result: number | null = null;
  let formula = "";

  if (mode === "basic") {
    const e = parseFloat(v.events), t = parseFloat(v.total);
    if (!isNaN(e) && !isNaN(t) && t > 0) { result = e / t; formula = `${e} / ${t}`; }
  } else if (mode === "complement") {
    const pa = parseFloat(v.pa);
    if (!isNaN(pa)) { result = 1 - pa; formula = `1 − ${pa}`; }
  } else if (mode === "union") {
    const pa = parseFloat(v.pa), pb = parseFloat(v.pb), pab = parseFloat(v.pab);
    if (!isNaN(pa) && !isNaN(pb) && !isNaN(pab)) { result = pa + pb - pab; formula = `${pa} + ${pb} − ${pab}`; }
  } else if (mode === "conditional") {
    const pAandB = parseFloat(v.pAandB), pB = parseFloat(v.pB);
    if (!isNaN(pAandB) && !isNaN(pB) && pB > 0) { result = pAandB / pB; formula = `${pAandB} / ${pB}`; }
  } else if (mode === "binomial") {
    const n = parseInt(v.n), k = parseInt(v.k), p = parseFloat(v.p);
    if (!isNaN(n) && !isNaN(k) && !isNaN(p) && p >= 0 && p <= 1 && k >= 0 && k <= n) {
      result = binomCoeff(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
      formula = `C(${n},${k}) × ${p}^${k} × ${(1-p).toFixed(4)}^${n-k}`;
    }
  }

  const pct = result !== null ? (result * 100).toFixed(4) + "%" : null;
  const frac = result !== null ? toFraction(result) : null;

  const MODES: { value: Mode; label: string }[] = [
    { value: "basic", label: "Basic" },
    { value: "complement", label: "Complement" },
    { value: "union", label: "Union (A or B)" },
    { value: "conditional", label: "Conditional" },
    { value: "binomial", label: "Binomial" },
  ];

  return (
    <CalculatorShell title="Probability Calculator" description="Calculate probabilities for basic events, complements, unions, conditional events, and binomial distributions.">
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-muted mb-1">Mode</label>
          <select value={v.mode} onChange={e => setV({ mode: e.target.value })} className={sel}>
            {MODES.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
        </div>

        {mode === "basic" && (
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-sm text-muted mb-1">Favorable Events</label><input type="number" value={v.events} onChange={e => setV({ events: e.target.value })} className={ic} /></div>
            <div><label className="block text-sm text-muted mb-1">Total Outcomes</label><input type="number" value={v.total} onChange={e => setV({ total: e.target.value })} className={ic} /></div>
          </div>
        )}
        {mode === "complement" && (
          <div><label className="block text-sm text-muted mb-1">P(A)</label><input type="number" value={v.pa} onChange={e => setV({ pa: e.target.value })} step="0.01" min="0" max="1" className={ic} /></div>
        )}
        {mode === "union" && (
          <div className="space-y-3">
            <div><label className="block text-sm text-muted mb-1">P(A)</label><input type="number" value={v.pa} onChange={e => setV({ pa: e.target.value })} step="0.01" min="0" max="1" className={ic} /></div>
            <div><label className="block text-sm text-muted mb-1">P(B)</label><input type="number" value={v.pb} onChange={e => setV({ pb: e.target.value })} step="0.01" min="0" max="1" className={ic} /></div>
            <div><label className="block text-sm text-muted mb-1">P(A and B)</label><input type="number" value={v.pab} onChange={e => setV({ pab: e.target.value })} step="0.01" min="0" max="1" className={ic} /></div>
          </div>
        )}
        {mode === "conditional" && (
          <div className="space-y-3">
            <div><label className="block text-sm text-muted mb-1">P(A and B)</label><input type="number" value={v.pAandB} onChange={e => setV({ pAandB: e.target.value })} step="0.01" min="0" max="1" className={ic} /></div>
            <div><label className="block text-sm text-muted mb-1">P(B)</label><input type="number" value={v.pB} onChange={e => setV({ pB: e.target.value })} step="0.01" min="0" max="1" className={ic} /></div>
            <p className="text-xs text-muted">P(A|B) = P(A and B) / P(B)</p>
          </div>
        )}
        {mode === "binomial" && (
          <div className="grid grid-cols-3 gap-3">
            <div><label className="block text-sm text-muted mb-1">Trials (n)</label><input type="number" value={v.n} onChange={e => setV({ n: e.target.value })} min="1" className={ic} /></div>
            <div><label className="block text-sm text-muted mb-1">Successes (k)</label><input type="number" value={v.k} onChange={e => setV({ k: e.target.value })} min="0" className={ic} /></div>
            <div><label className="block text-sm text-muted mb-1">Probability (p)</label><input type="number" value={v.p} onChange={e => setV({ p: e.target.value })} step="0.01" min="0" max="1" className={ic} /></div>
          </div>
        )}

        {result !== null && pct !== null && frac !== null && (
          <div className="space-y-3">
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="block text-xs text-muted mb-1">Probability</span>
              <span className="block font-mono font-bold text-4xl text-primary">{pct}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col items-center px-3 py-2.5 bg-background border border-card-border rounded text-xs font-mono text-center">
                <span className="text-muted mb-1">Decimal</span>
                <span className="font-bold">{result.toFixed(6)}</span>
              </div>
              <div className="flex flex-col items-center px-3 py-2.5 bg-background border border-card-border rounded text-xs font-mono text-center">
                <span className="text-muted mb-1">Fraction (approx)</span>
                <span className="font-bold">{frac}</span>
              </div>
            </div>
            <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono">
              <span className="text-muted">Formula</span>
              <span>{formula} = {result.toFixed(6)}</span>
            </div>
          </div>
        )}

        <div className="space-y-1">
          <p className="text-xs text-muted font-semibold">Formulas Reference</p>
          <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono"><span className="text-muted">Basic</span><span>P = events / total</span></div>
          <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono"><span className="text-muted">Complement</span><span>P(not A) = 1 − P(A)</span></div>
          <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono"><span className="text-muted">Union</span><span>P(A∪B) = P(A)+P(B)−P(A∩B)</span></div>
          <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono"><span className="text-muted">Conditional</span><span>P(A|B) = P(A∩B)/P(B)</span></div>
          <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono"><span className="text-muted">Binomial</span><span>C(n,k)·p^k·(1-p)^(n-k)</span></div>
        </div>
      </div>
    </CalculatorShell>
  );
}
