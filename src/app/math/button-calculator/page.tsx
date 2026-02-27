"use client";

import { useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";

export default function ButtonCalculatorPage() {
  const [display, setDisplay] = useState("0");
  const [prev, setPrev] = useState<number | null>(null);
  const [op, setOp] = useState<string | null>(null);
  const [resetNext, setResetNext] = useState(false);

  function calc(a: number, b: number, o: string): number {
    switch (o) {
      case "+": return a + b;
      case "-": return a - b;
      case "×": return a * b;
      case "÷": return b !== 0 ? a / b : NaN;
      default: return b;
    }
  }

  function fmt(n: number): string {
    if (!isFinite(n)) return "Error";
    return parseFloat(n.toPrecision(12)).toString();
  }

  function digit(d: string) {
    if (resetNext) { setDisplay(d); setResetNext(false); }
    else setDisplay(display === "0" ? d : display + d);
  }

  function decimal() {
    if (resetNext) { setDisplay("0."); setResetNext(false); return; }
    if (!display.includes(".")) setDisplay(display + ".");
  }

  function operator(nextOp: string) {
    const cur = parseFloat(display);
    if (prev !== null && op && !resetNext) {
      const result = calc(prev, cur, op);
      setDisplay(fmt(result));
      setPrev(result);
    } else {
      setPrev(cur);
    }
    setOp(nextOp);
    setResetNext(true);
  }

  function equals() {
    if (prev === null || !op) return;
    const cur = parseFloat(display);
    const result = calc(prev, cur, op);
    setDisplay(fmt(result));
    setPrev(null);
    setOp(null);
    setResetNext(true);
  }

  function clear() {
    setDisplay("0"); setPrev(null); setOp(null); setResetNext(false);
  }

  function toggleSign() {
    if (display !== "0") setDisplay(display.startsWith("-") ? display.slice(1) : "-" + display);
  }

  function percent() {
    setDisplay(fmt(parseFloat(display) / 100));
    setResetNext(true);
  }

  const btn = "flex items-center justify-center rounded-xl text-lg font-medium h-14 transition-colors active:scale-95";
  const numBtn = `${btn} bg-background border border-card-border hover:bg-primary-light`;
  const opBtn = `${btn} bg-primary text-white hover:bg-primary-hover`;
  const funcBtn = `${btn} bg-card border border-card-border text-muted hover:bg-primary-light`;

  return (
    <CalculatorShell title="Button Calculator" description="Classic button-style calculator">
      {/* Display */}
      <div className="bg-background border border-card-border rounded-xl p-4 mb-4 text-right">
        <div className="text-xs text-muted h-5">
          {prev !== null && op ? `${fmt(prev)} ${op}` : ""}
        </div>
        <div className="text-3xl font-mono font-semibold truncate">{display}</div>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-4 gap-2">
        <button onClick={clear} className={funcBtn}>C</button>
        <button onClick={toggleSign} className={funcBtn}>±</button>
        <button onClick={percent} className={funcBtn}>%</button>
        <button onClick={() => operator("÷")} className={opBtn}>÷</button>

        <button onClick={() => digit("7")} className={numBtn}>7</button>
        <button onClick={() => digit("8")} className={numBtn}>8</button>
        <button onClick={() => digit("9")} className={numBtn}>9</button>
        <button onClick={() => operator("×")} className={opBtn}>×</button>

        <button onClick={() => digit("4")} className={numBtn}>4</button>
        <button onClick={() => digit("5")} className={numBtn}>5</button>
        <button onClick={() => digit("6")} className={numBtn}>6</button>
        <button onClick={() => operator("-")} className={opBtn}>−</button>

        <button onClick={() => digit("1")} className={numBtn}>1</button>
        <button onClick={() => digit("2")} className={numBtn}>2</button>
        <button onClick={() => digit("3")} className={numBtn}>3</button>
        <button onClick={() => operator("+")} className={opBtn}>+</button>

        <button onClick={() => digit("0")} className={`${numBtn} col-span-2`}>0</button>
        <button onClick={decimal} className={numBtn}>.</button>
        <button onClick={equals} className={`${btn} bg-accent text-white hover:opacity-90`}>=</button>
      </div>
    </CalculatorShell>
  );
}
