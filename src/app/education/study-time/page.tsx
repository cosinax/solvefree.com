"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";
import { useMemo } from "react";

const inp = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm";

export default function StudyTimePage() {
  const [v, setV] = useHashState({
    subjects: "5",
    weeksUntilExam: "4",
    hoursPerWeek: "10",
    difficulty: "medium",
  });

  const subjects = parseInt(v.subjects) || 1;
  const weeks = parseInt(v.weeksUntilExam) || 1;
  const hoursPerWeek = parseFloat(v.hoursPerWeek) || 0;

  const result = useMemo(() => {
    const diffMultiplier = { easy: 0.7, medium: 1.0, hard: 1.4 }[v.difficulty] ?? 1.0;
    const totalHours = hoursPerWeek * weeks;
    const hoursPerSubject = totalHours / subjects * diffMultiplier;
    const hoursPerDay = totalHours / (weeks * 7);
    const sessionsPerSubject = Math.ceil(hoursPerSubject / 1.5); // 90-min sessions
    return { totalHours, hoursPerSubject, hoursPerDay, sessionsPerSubject };
  }, [subjects, weeks, hoursPerWeek, v.difficulty]);

  return (
    <CalculatorShell title="Study Time Calculator" description="Plan how much time to allocate for studying each subject before exams.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-muted mb-1">Number of Subjects</label>
            <input type="number" value={v.subjects} onChange={e => setV({ subjects: e.target.value })} className={inp} min="1" max="20" step="1" />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Weeks Until Exam</label>
            <input type="number" value={v.weeksUntilExam} onChange={e => setV({ weeksUntilExam: e.target.value })} className={inp} min="1" max="52" step="1" />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Study Hours Per Week</label>
            <input type="number" value={v.hoursPerWeek} onChange={e => setV({ hoursPerWeek: e.target.value })} className={inp} min="1" max="80" step="0.5" />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Material Difficulty</label>
            <select value={v.difficulty} onChange={e => setV({ difficulty: e.target.value })} className={inp}>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 bg-primary-light border border-primary/20 rounded-lg text-center">
            <div className="text-xs text-muted mb-1">Hours Per Subject</div>
            <div className="font-mono font-bold text-2xl text-primary">{result.hoursPerSubject.toFixed(1)}h</div>
            <div className="text-xs text-muted mt-1">{result.sessionsPerSubject} × 90-min sessions</div>
          </div>
          <div className="p-4 bg-card border border-card-border rounded-lg text-center">
            <div className="text-xs text-muted mb-1">Total Study Hours</div>
            <div className="font-mono font-bold text-2xl">{result.totalHours.toFixed(1)}h</div>
            <div className="text-xs text-muted mt-1">{result.hoursPerDay.toFixed(1)}h/day</div>
          </div>
        </div>

        <div className="p-3 bg-card border border-card-border rounded-lg text-xs text-muted space-y-1">
          <p><strong>Tip:</strong> Space learning over time (spaced repetition). Don't cram.</p>
          <p><strong>Optimal session length:</strong> 90 minutes with a 15-minute break.</p>
          <p><strong>Research shows:</strong> Retrieval practice (testing yourself) is more effective than re-reading.</p>
        </div>
      </div>
    </CalculatorShell>
  );
}
