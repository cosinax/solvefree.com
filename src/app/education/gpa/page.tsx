"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";
import { useMemo, useState } from "react";

const inp = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm";

const gradeMap: Record<string, number> = {
  "A+": 4.0, "A": 4.0, "A-": 3.7,
  "B+": 3.3, "B": 3.0, "B-": 2.7,
  "C+": 2.3, "C": 2.0, "C-": 1.7,
  "D+": 1.3, "D": 1.0, "D-": 0.7,
  "F": 0.0, "W": -1, // W = withdrawn
};

const gradeOptions = Object.keys(gradeMap).filter(k => k !== "W");

interface Course {
  name: string;
  grade: string;
  credits: string;
}

export default function GpaPage() {
  const [v, setV] = useHashState({ scale: "4.0" });
  const [courses, setCourses] = useState<Course[]>([
    { name: "Course 1", grade: "A", credits: "3" },
    { name: "Course 2", grade: "B+", credits: "3" },
    { name: "Course 3", grade: "A-", credits: "4" },
    { name: "Course 4", grade: "B", credits: "3" },
  ]);

  function updateCourse(i: number, field: keyof Course, val: string) {
    setCourses(prev => prev.map((c, idx) => idx === i ? { ...c, [field]: val } : c));
  }

  function addCourse() {
    setCourses(prev => [...prev, { name: `Course ${prev.length + 1}`, grade: "B", credits: "3" }]);
  }

  function removeCourse(i: number) {
    setCourses(prev => prev.filter((_, idx) => idx !== i));
  }

  const result = useMemo(() => {
    let totalPoints = 0, totalCredits = 0;
    const details: { name: string; grade: string; points: number; credits: number; gradePoints: number }[] = [];
    for (const c of courses) {
      const cr = parseFloat(c.credits);
      const pts = gradeMap[c.grade] ?? -1;
      if (cr > 0 && pts >= 0) {
        totalPoints += pts * cr;
        totalCredits += cr;
        details.push({ name: c.name, grade: c.grade, points: pts, credits: cr, gradePoints: pts * cr });
      }
    }
    const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0;
    return { gpa, totalCredits, totalPoints, details };
  }, [courses]);

  function gpaColor(gpa: number) {
    if (gpa >= 3.7) return "text-green-600";
    if (gpa >= 3.0) return "text-blue-600";
    if (gpa >= 2.0) return "text-yellow-600";
    return "text-red-600";
  }

  function gpaLabel(gpa: number) {
    if (gpa >= 3.7) return "Summa Cum Laude";
    if (gpa >= 3.5) return "Magna Cum Laude";
    if (gpa >= 3.0) return "Cum Laude";
    if (gpa >= 2.0) return "Satisfactory";
    if (gpa > 0) return "Below Average";
    return "—";
  }

  return (
    <CalculatorShell title="GPA Calculator" description="Calculate your GPA from course grades and credit hours on a 4.0 scale.">
      <div className="space-y-4">
        <div className="space-y-2">
          {courses.map((c, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 items-center">
              <input
                type="text"
                value={c.name}
                onChange={e => updateCourse(i, "name", e.target.value)}
                className={`${inp} col-span-5`}
                placeholder="Course name"
              />
              <select
                value={c.grade}
                onChange={e => updateCourse(i, "grade", e.target.value)}
                className={`${inp} col-span-3`}
              >
                {gradeOptions.map(g => (
                  <option key={g} value={g}>{g} ({gradeMap[g].toFixed(1)})</option>
                ))}
              </select>
              <input
                type="number"
                value={c.credits}
                onChange={e => updateCourse(i, "credits", e.target.value)}
                className={`${inp} col-span-3`}
                placeholder="Credits"
                min="0.5" step="0.5"
              />
              <button
                onClick={() => removeCourse(i)}
                className="col-span-1 text-muted hover:text-red-500 text-lg leading-none"
                aria-label="Remove course"
              >×</button>
            </div>
          ))}
        </div>

        <button
          onClick={addCourse}
          className="text-sm text-primary hover:underline"
        >
          + Add course
        </button>

        {result.totalCredits > 0 && (
          <div className="space-y-3 pt-2 border-t border-card-border">
            <div className="text-center">
              <div className="text-xs text-muted mb-1">Cumulative GPA (4.0 scale)</div>
              <div className={`font-mono font-bold text-5xl ${gpaColor(result.gpa)}`}>
                {result.gpa.toFixed(2)}
              </div>
              <div className="text-sm text-muted mt-1">{gpaLabel(result.gpa)}</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-card border border-card-border rounded-lg text-center">
                <div className="text-xs text-muted mb-1">Total Credits</div>
                <div className="font-mono font-bold text-xl">{result.totalCredits}</div>
              </div>
              <div className="p-3 bg-card border border-card-border rounded-lg text-center">
                <div className="text-xs text-muted mb-1">Quality Points</div>
                <div className="font-mono font-bold text-xl">{result.totalPoints.toFixed(1)}</div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-card-border text-left text-muted">
                    <th className="pb-1 font-medium">Course</th>
                    <th className="pb-1 font-medium">Grade</th>
                    <th className="pb-1 font-medium">Credits</th>
                    <th className="pb-1 font-medium">Grade Points</th>
                  </tr>
                </thead>
                <tbody>
                  {result.details.map((d, i) => (
                    <tr key={i} className="border-b border-card-border/50 last:border-0">
                      <td className="py-1.5">{d.name}</td>
                      <td className="py-1.5 font-mono">{d.grade} ({d.points.toFixed(1)})</td>
                      <td className="py-1.5 font-mono">{d.credits}</td>
                      <td className="py-1.5 font-mono">{d.gradePoints.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <p className="text-xs text-muted">Based on the standard 4.0 scale used by most US colleges and universities.</p>
      </div>
    </CalculatorShell>
  );
}
