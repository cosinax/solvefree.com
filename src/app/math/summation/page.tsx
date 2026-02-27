"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

// Safe recursive descent parser for expressions containing i, numbers, +, -, *, /, ^, ()
// No eval / Function constructor used.
function parseExpr(expr: string, iVal: number): number {
  const tokens = tokenize(expr.replace(/\s+/g, ""), iVal);
  if (tokens === null) return NaN;
  const { val, pos } = parseAddSub(tokens, 0);
  if (pos !== tokens.length) return NaN;
  return val;
}

type Token = { type: "num"; val: number } | { type: "op"; val: string } | { type: "lparen" } | { type: "rparen" };

function tokenize(expr: string, iVal: number): Token[] | null {
  if (!/^[\d.+\-*/^()i]+$/.test(expr)) return null;
  const tokens: Token[] = [];
  let k = 0;
  while (k < expr.length) {
    const ch = expr[k];
    if (ch === "i") { tokens.push({ type: "num", val: iVal }); k++; }
    else if (ch >= "0" && ch <= "9" || ch === ".") {
      let num = "";
      while (k < expr.length && (expr[k] >= "0" && expr[k] <= "9" || expr[k] === ".")) { num += expr[k++]; }
      tokens.push({ type: "num", val: parseFloat(num) });
    } else if ("+-*/^".includes(ch)) { tokens.push({ type: "op", val: ch }); k++; }
    else if (ch === "(") { tokens.push({ type: "lparen" }); k++; }
    else if (ch === ")") { tokens.push({ type: "rparen" }); k++; }
    else return null;
  }
  return tokens;
}

function parseAddSub(tokens: Token[], pos: number): { val: number; pos: number } {
  let { val: left, pos: p } = parseMulDiv(tokens, pos);
  while (p < tokens.length && tokens[p].type === "op" && (tokens[p] as any).val === "+" || (p < tokens.length && tokens[p].type === "op" && (tokens[p] as any).val === "-")) {
    const op = (tokens[p] as any).val;
    const { val: right, pos: np } = parseMulDiv(tokens, p + 1);
    left = op === "+" ? left + right : left - right;
    p = np;
  }
  return { val: left, pos: p };
}

function parseMulDiv(tokens: Token[], pos: number): { val: number; pos: number } {
  let { val: left, pos: p } = parsePow(tokens, pos);
  while (p < tokens.length && tokens[p].type === "op" && ((tokens[p] as any).val === "*" || (tokens[p] as any).val === "/")) {
    const op = (tokens[p] as any).val;
    const { val: right, pos: np } = parsePow(tokens, p + 1);
    left = op === "*" ? left * right : left / right;
    p = np;
  }
  return { val: left, pos: p };
}

function parsePow(tokens: Token[], pos: number): { val: number; pos: number } {
  const { val: base, pos: p } = parseUnary(tokens, pos);
  if (p < tokens.length && tokens[p].type === "op" && (tokens[p] as any).val === "^") {
    const { val: exp, pos: np } = parsePow(tokens, p + 1);
    return { val: Math.pow(base, exp), pos: np };
  }
  return { val: base, pos: p };
}

function parseUnary(tokens: Token[], pos: number): { val: number; pos: number } {
  if (pos < tokens.length && tokens[pos].type === "op" && (tokens[pos] as any).val === "-") {
    const { val, pos: np } = parseUnary(tokens, pos + 1);
    return { val: -val, pos: np };
  }
  if (pos < tokens.length && tokens[pos].type === "op" && (tokens[pos] as any).val === "+") {
    return parseUnary(tokens, pos + 1);
  }
  return parsePrimary(tokens, pos);
}

function parsePrimary(tokens: Token[], pos: number): { val: number; pos: number } {
  if (pos >= tokens.length) return { val: NaN, pos };
  if (tokens[pos].type === "num") return { val: (tokens[pos] as any).val, pos: pos + 1 };
  if (tokens[pos].type === "lparen") {
    const { val, pos: p } = parseAddSub(tokens, pos + 1);
    if (p < tokens.length && tokens[p].type === "rparen") return { val, pos: p + 1 };
    return { val: NaN, pos: p };
  }
  return { val: NaN, pos };
}

const PRESETS = [
  { label: "i", expr: "i" },
  { label: "i^2", expr: "i^2" },
  { label: "i^3", expr: "i^3" },
  { label: "2*i+1", expr: "2*i+1" },
  { label: "1/i", expr: "1/i" },
  { label: "i*(i+1)", expr: "i*(i+1)" },
];

export default function SummationPage() {
  const [v, setV] = useHashState({ expr: "i^2", start: "1", end: "10" });

  const start = parseInt(v.start);
  const end = parseInt(v.end);
  const validRange = !isNaN(start) && !isNaN(end) && end >= start && (end - start) <= 10000;
  const validExpr = /^[\d.+\-*/^()i\s]+$/.test(v.expr.trim()) && v.expr.trim() !== "";

  const terms: number[] = [];
  let total: number | null = null;
  let error = "";

  if (validRange && validExpr) {
    let sum = 0;
    let ok = true;
    for (let i = start; i <= end; i++) {
      const val = parseExpr(v.expr.trim(), i);
      if (isNaN(val)) { ok = false; error = "Could not evaluate expression for i=" + i; break; }
      sum += val;
      if (end - start <= 19) terms.push(val);
    }
    if (ok) total = sum;
  } else if (!validExpr && v.expr.trim()) {
    error = "Only i, numbers, +, -, *, /, ^, () are allowed";
  } else if (!validRange && !isNaN(start) && !isNaN(end)) {
    if (end < start) error = "End must be >= start";
    else error = "Range too large (max 10,000 terms)";
  }

  function fmt(n: number) { return parseFloat(n.toPrecision(10)).toString(); }

  return (
    <CalculatorShell title="Summation Calculator (Σ)" description="Evaluate sigma notation: sum an expression over a range of integers.">
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-muted mb-1">Expression f(i)</label>
          <input
            type="text"
            value={v.expr}
            onChange={e => setV({ expr: e.target.value })}
            className={ic}
            placeholder="e.g. i^2"
          />
          <div className="flex flex-wrap gap-1 mt-1">
            {PRESETS.map(p => (
              <button
                key={p.label}
                onClick={() => setV({ expr: p.expr })}
                className="text-xs px-2 py-1 rounded border border-card-border hover:bg-primary-light transition-colors font-mono"
              >{p.label}</button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-muted mb-1">Start (i =)</label>
            <input type="number" value={v.start} onChange={e => setV({ start: e.target.value })} className={ic} step="1" />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">End (i =)</label>
            <input type="number" value={v.end} onChange={e => setV({ end: e.target.value })} className={ic} step="1" />
          </div>
        </div>

        {total !== null && (
          <div className="space-y-3">
            <div className="bg-primary-light rounded-xl p-4 text-center">
              <span className="text-xs text-muted block mb-1">
                Σ({v.expr}) for i={v.start} to {v.end}
              </span>
              <span className="block font-mono font-bold text-4xl text-primary">{fmt(total)}</span>
            </div>

            <div className="space-y-1 text-xs font-mono">
              <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded">
                <span className="text-muted">Number of terms</span>
                <span className="font-semibold">{end - start + 1}</span>
              </div>
              <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded">
                <span className="text-muted">Sum</span>
                <span className="font-semibold">{fmt(total)}</span>
              </div>
              {terms.length > 0 && (
                <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded">
                  <span className="text-muted">Average term</span>
                  <span className="font-semibold">{fmt(total / terms.length)}</span>
                </div>
              )}
            </div>

            {terms.length > 0 && (
              <div>
                <p className="text-xs text-muted mb-1">Terms (i = {start} to {end}):</p>
                <div className="space-y-1 text-xs font-mono max-h-40 overflow-y-auto">
                  {terms.map((t, idx) => (
                    <div key={idx} className="flex justify-between px-3 py-1 bg-background border border-card-border rounded">
                      <span className="text-muted">i = {start + idx}</span>
                      <span className="font-semibold">{fmt(t)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="text-center text-sm text-danger font-medium">{error}</div>
        )}
      </div>
    </CalculatorShell>
  );
}
