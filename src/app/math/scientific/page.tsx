"use client";

import { useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";

export default function ScientificCalculatorPage() {
  const [expr, setExpr] = useState("");
  const [result, setResult] = useState("");
  const [useDeg, setUseDeg] = useState(true);

  function append(s: string) { setExpr((e) => e + s); }

  function evaluate() {
    try {
      let s = expr
        .replace(/×/g, "*").replace(/÷/g, "/").replace(/\^/g, "**")
        .replace(/π/g, `(${Math.PI})`).replace(/e(?![x])/g, `(${Math.E})`)
        .replace(/√\(/g, "Math.sqrt(").replace(/abs\(/g, "Math.abs(")
        .replace(/log\(/g, "Math.log10(").replace(/ln\(/g, "Math.log(");

      const toRad = useDeg ? `*${Math.PI}/180` : "";
      const fromRad = useDeg ? `*180/${Math.PI}` : "";
      s = s.replace(/sin\(([^)]+)\)/g, `Math.sin(($1)${toRad})`);
      s = s.replace(/cos\(([^)]+)\)/g, `Math.cos(($1)${toRad})`);
      s = s.replace(/tan\(([^)]+)\)/g, `Math.tan(($1)${toRad})`);
      s = s.replace(/asin\(([^)]+)\)/g, `(Math.asin($1)${fromRad})`);
      s = s.replace(/acos\(([^)]+)\)/g, `(Math.acos($1)${fromRad})`);
      s = s.replace(/atan\(([^)]+)\)/g, `(Math.atan($1)${fromRad})`);

      // factorial
      s = s.replace(/(\d+)!/g, (_, n) => {
        let r = 1; for (let i = 2; i <= parseInt(n); i++) r *= i; return r.toString();
      });

      const r = Function(`"use strict"; return (${s})`)();
      if (typeof r !== "number" || !isFinite(r)) { setResult("Error"); return; }
      setResult(parseFloat(r.toPrecision(12)).toString());
    } catch { setResult("Error"); }
  }

  const btn = "flex items-center justify-center rounded-lg text-sm font-medium h-11 transition-colors active:scale-95";
  const numBtn = `${btn} bg-background border border-card-border hover:bg-primary-light`;
  const opBtn = `${btn} bg-primary text-white hover:bg-primary-hover`;
  const fnBtn = `${btn} bg-card border border-card-border text-primary hover:bg-primary-light text-xs`;

  return (
    <CalculatorShell title="Scientific Calculator" description="Trig, logs, powers, roots, factorial, and constants. Toggle degrees/radians.">
      <div className="bg-background border border-card-border rounded-xl p-4 mb-4 text-right">
        <div className="text-xs text-muted h-5 truncate">{expr || " "}</div>
        <div className="text-2xl font-mono font-semibold truncate">{result || "0"}</div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <button onClick={() => setUseDeg(!useDeg)} className="text-xs px-3 py-1 rounded-full bg-primary-light text-primary font-medium">
          {useDeg ? "DEG" : "RAD"}
        </button>
        <div className="flex gap-1">
          <button onClick={() => setExpr("")} className="text-xs px-3 py-1 rounded-full bg-card border border-card-border text-muted">C</button>
          <button onClick={() => setExpr(expr.slice(0, -1))} className="text-xs px-3 py-1 rounded-full bg-card border border-card-border text-muted">⌫</button>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-1.5">
        <button onClick={() => append("sin(")} className={fnBtn}>sin</button>
        <button onClick={() => append("cos(")} className={fnBtn}>cos</button>
        <button onClick={() => append("tan(")} className={fnBtn}>tan</button>
        <button onClick={() => append("(")} className={fnBtn}>(</button>
        <button onClick={() => append(")")} className={fnBtn}>)</button>

        <button onClick={() => append("asin(")} className={fnBtn}>asin</button>
        <button onClick={() => append("acos(")} className={fnBtn}>acos</button>
        <button onClick={() => append("atan(")} className={fnBtn}>atan</button>
        <button onClick={() => append("^")} className={fnBtn}>x^y</button>
        <button onClick={() => append("√(")} className={fnBtn}>√</button>

        <button onClick={() => append("log(")} className={fnBtn}>log</button>
        <button onClick={() => append("ln(")} className={fnBtn}>ln</button>
        <button onClick={() => append("!")} className={fnBtn}>n!</button>
        <button onClick={() => append("π")} className={fnBtn}>π</button>
        <button onClick={() => append("e")} className={fnBtn}>e</button>

        <button onClick={() => append("7")} className={numBtn}>7</button>
        <button onClick={() => append("8")} className={numBtn}>8</button>
        <button onClick={() => append("9")} className={numBtn}>9</button>
        <button onClick={() => append("÷")} className={opBtn}>÷</button>
        <button onClick={() => append("×")} className={opBtn}>×</button>

        <button onClick={() => append("4")} className={numBtn}>4</button>
        <button onClick={() => append("5")} className={numBtn}>5</button>
        <button onClick={() => append("6")} className={numBtn}>6</button>
        <button onClick={() => append("-")} className={opBtn}>−</button>
        <button onClick={() => append("+")} className={opBtn}>+</button>

        <button onClick={() => append("1")} className={numBtn}>1</button>
        <button onClick={() => append("2")} className={numBtn}>2</button>
        <button onClick={() => append("3")} className={numBtn}>3</button>
        <button onClick={() => append(".")} className={numBtn}>.</button>
        <button onClick={evaluate} className={`${btn} bg-accent text-white hover:opacity-90 row-span-2`}>=</button>

        <button onClick={() => append("0")} className={`${numBtn} col-span-2`}>0</button>
        <button onClick={() => append("abs(")} className={fnBtn}>|x|</button>
        <button onClick={() => append("%")} className={fnBtn}>%</button>
      </div>
    </CalculatorShell>
  );
}
