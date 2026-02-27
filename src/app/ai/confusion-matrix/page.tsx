"use client";

import { useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";

export default function ConfusionMatrixPage() {
  const [tp, setTp] = useState("50");
  const [fp, setFp] = useState("10");
  const [fn, setFn] = useState("5");
  const [tn, setTn] = useState("935");
  const TP = parseInt(tp) || 0, FP = parseInt(fp) || 0, FN = parseInt(fn) || 0, TN = parseInt(tn) || 0;
  const total = TP + FP + FN + TN;
  const accuracy = total > 0 ? (TP + TN) / total : 0;
  const precision = TP + FP > 0 ? TP / (TP + FP) : 0;
  const recall = TP + FN > 0 ? TP / (TP + FN) : 0;
  const f1 = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0;
  const specificity = TN + FP > 0 ? TN / (TN + FP) : 0;
  const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-center";
  return (
    <CalculatorShell title="Confusion Matrix" description="Calculate precision, recall, F1 score, accuracy, and specificity.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div><label className="block text-sm text-muted mb-1">True Positives</label><input type="number" value={tp} onChange={(e) => setTp(e.target.value)} className={ic} /></div>
          <div><label className="block text-sm text-muted mb-1">False Positives</label><input type="number" value={fp} onChange={(e) => setFp(e.target.value)} className={ic} /></div>
          <div><label className="block text-sm text-muted mb-1">False Negatives</label><input type="number" value={fn} onChange={(e) => setFn(e.target.value)} className={ic} /></div>
          <div><label className="block text-sm text-muted mb-1">True Negatives</label><input type="number" value={tn} onChange={(e) => setTn(e.target.value)} className={ic} /></div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { l: "Accuracy", v: (accuracy * 100).toFixed(1) + "%" },
            { l: "Precision", v: (precision * 100).toFixed(1) + "%" },
            { l: "Recall", v: (recall * 100).toFixed(1) + "%" },
            { l: "F1 Score", v: (f1 * 100).toFixed(1) + "%" },
            { l: "Specificity", v: (specificity * 100).toFixed(1) + "%" },
            { l: "Total", v: total.toLocaleString() },
          ].map((m) => (
            <div key={m.l} className="px-4 py-3 bg-primary-light rounded-lg text-center">
              <span className="block text-xs text-muted">{m.l}</span>
              <span className="font-mono font-bold text-lg">{m.v}</span>
            </div>
          ))}
        </div>
      </div>
    </CalculatorShell>
  );
}
