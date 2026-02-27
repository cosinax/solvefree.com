"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";
import { useMemo } from "react";

const inp = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm";
const ta = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm resize-y";

// Flesch-Kincaid readability formulas
function analyzeText(text: string) {
  if (!text.trim()) return null;

  // Count sentences
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length || 1;

  // Count words
  const words = text.trim().split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length || 1;

  // Count syllables (simple heuristic)
  function countSyllables(word: string): number {
    word = word.toLowerCase().replace(/[^a-z]/g, "");
    if (!word) return 0;
    if (word.length <= 3) return 1;
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "");
    word = word.replace(/^y/, "");
    const m = word.match(/[aeiouy]{1,2}/g);
    return m ? m.length : 1;
  }

  const syllableCount = words.reduce((sum, w) => sum + countSyllables(w), 0);

  const fleschEase = 206.835 - 1.015 * (wordCount / sentences) - 84.6 * (syllableCount / wordCount);
  const fleschKincaid = 0.39 * (wordCount / sentences) + 11.8 * (syllableCount / wordCount) - 15.59;

  function fkLabel(score: number): string {
    if (score <= 1) return "Kindergarten";
    if (score <= 3) return "Grade 1–3";
    if (score <= 5) return "Grade 4–5";
    if (score <= 8) return "Grade 6–8";
    if (score <= 12) return "Grade 9–12";
    if (score <= 16) return "College";
    return "College Graduate";
  }

  function fkEaseLabel(score: number): string {
    if (score >= 90) return "Very Easy (5th grade)";
    if (score >= 80) return "Easy (6th grade)";
    if (score >= 70) return "Fairly Easy (7th grade)";
    if (score >= 60) return "Standard (8th–9th grade)";
    if (score >= 50) return "Fairly Difficult (10th–12th grade)";
    if (score >= 30) return "Difficult (College)";
    return "Very Confusing (College Graduate)";
  }

  return {
    wordCount,
    sentenceCount: sentences,
    syllableCount,
    avgWordsPerSentence: wordCount / sentences,
    avgSyllablesPerWord: syllableCount / wordCount,
    fleschEase: Math.max(0, Math.min(100, fleschEase)),
    fleschKincaid: Math.max(0, fleschKincaid),
    gradeLevel: fkLabel(fleschKincaid),
    easeLabel: fkEaseLabel(fleschEase),
  };
}

const SAMPLE = "The cat sat on the mat. It was a sunny day and the birds were singing in the trees. The children played happily in the yard while their parents watched from the porch.";

export default function ReadingLevelPage() {
  const [v, setV] = useHashState({ text: SAMPLE });

  const result = useMemo(() => analyzeText(v.text), [v.text]);

  return (
    <CalculatorShell title="Reading Level Calculator" description="Analyze text readability using the Flesch-Kincaid formula.">
      <div className="space-y-4">
        <div>
          <label className="block text-xs text-muted mb-1">Paste your text here</label>
          <textarea
            value={v.text}
            onChange={e => setV({ text: e.target.value })}
            className={ta}
            rows={6}
            placeholder="Paste or type text to analyze..."
          />
        </div>

        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-primary-light border border-primary/20 rounded-lg text-center">
                <div className="text-xs text-muted mb-1">Reading Level</div>
                <div className="font-bold text-xl text-primary">{result.gradeLevel}</div>
                <div className="text-xs text-muted mt-1">Flesch-Kincaid Grade {result.fleschKincaid.toFixed(1)}</div>
              </div>
              <div className="p-4 bg-card border border-card-border rounded-lg text-center">
                <div className="text-xs text-muted mb-1">Ease Score</div>
                <div className="font-bold text-xl">{result.fleschEase.toFixed(1)}</div>
                <div className="text-xs text-muted mt-1">{result.easeLabel}</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Words", value: result.wordCount },
                { label: "Sentences", value: result.sentenceCount },
                { label: "Syllables", value: result.syllableCount },
              ].map(r => (
                <div key={r.label} className="p-2 bg-card border border-card-border rounded-lg text-center text-sm">
                  <div className="text-xs text-muted">{r.label}</div>
                  <div className="font-mono font-bold">{r.value}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Avg words / sentence", value: result.avgWordsPerSentence.toFixed(1) },
                { label: "Avg syllables / word", value: result.avgSyllablesPerWord.toFixed(2) },
              ].map(r => (
                <div key={r.label} className="p-2 bg-card border border-card-border rounded-lg text-sm">
                  <span className="text-xs text-muted">{r.label}: </span>
                  <span className="font-mono font-semibold">{r.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="text-xs text-muted">
          Uses the Flesch-Kincaid Grade Level formula. Ease score of 100 = very easy (5th grade); 0 = very difficult (college graduate level).
        </p>
      </div>
    </CalculatorShell>
  );
}
