"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";
import { useMemo } from "react";

const inp = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm";

function fmt(n: number, d = 2) {
  return n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
}

export default function StudentTeacherRatioPage() {
  const [v, setV] = useHashState({ students: "450", teachers: "22", aides: "8" });

  const students = parseInt(v.students) || 0;
  const teachers = parseInt(v.teachers) || 0;
  const aides = parseInt(v.aides) || 0;

  const result = useMemo(() => {
    if (students <= 0 || teachers <= 0) return null;
    const ratio = students / teachers;
    const fullStaff = teachers + aides;
    const ratioWithAides = fullStaff > 0 ? students / fullStaff : 0;

    let label = "";
    if (ratio <= 15) label = "Excellent (≤15:1)";
    else if (ratio <= 20) label = "Good (16–20:1)";
    else if (ratio <= 25) label = "Average (21–25:1)";
    else label = "High (>25:1)";

    return { ratio, ratioWithAides, label, fullStaff };
  }, [students, teachers, aides]);

  return (
    <CalculatorShell title="Student-Teacher Ratio Calculator" description="Calculate the student-to-teacher ratio and staffing adequacy for a school or classroom.">
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-muted mb-1">Total Students</label>
            <input type="number" value={v.students} onChange={e => setV({ students: e.target.value })} className={inp} min="1" step="1" />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Teachers (FTE)</label>
            <input type="number" value={v.teachers} onChange={e => setV({ teachers: e.target.value })} className={inp} min="1" step="0.5" />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Teaching Aides (optional)</label>
            <input type="number" value={v.aides} onChange={e => setV({ aides: e.target.value })} className={inp} min="0" step="1" />
          </div>
        </div>

        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-primary-light border border-primary/20 rounded-lg text-center">
                <div className="text-xs text-muted mb-1">Student–Teacher Ratio</div>
                <div className="font-mono font-bold text-3xl text-primary">{fmt(result.ratio, 1)}:1</div>
                <div className="text-xs text-muted mt-1">{result.label}</div>
              </div>
              <div className="p-4 bg-card border border-card-border rounded-lg text-center">
                <div className="text-xs text-muted mb-1">With Aides ({result.fullStaff} staff)</div>
                <div className="font-mono font-bold text-3xl">{result.ratioWithAides > 0 ? fmt(result.ratioWithAides, 1) + ":1" : "—"}</div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-card-border text-left text-muted">
                    <th className="pb-1 font-medium">Ratio</th>
                    <th className="pb-1 font-medium">Assessment</th>
                    <th className="pb-1 font-medium">Typical Context</th>
                  </tr>
                </thead>
                <tbody className="text-muted">
                  {[
                    ["≤ 12:1", "Excellent", "Special education, elite private schools"],
                    ["13–18:1", "Good", "Well-funded public schools, private schools"],
                    ["19–24:1", "Average", "Typical US public schools"],
                    ["≥ 25:1", "High", "Under-resourced schools, developing countries"],
                  ].map(([r, a, c]) => (
                    <tr key={r} className={`border-b border-card-border/50 last:border-0 ${
                      result.ratio <= 12 && r.startsWith("≤") ? "font-semibold text-foreground" :
                      result.ratio <= 18 && r.startsWith("13") ? "font-semibold text-foreground" :
                      result.ratio <= 24 && r.startsWith("19") ? "font-semibold text-foreground" :
                      result.ratio >= 25 && r.startsWith("≥") ? "font-semibold text-foreground" : ""
                    }`}>
                      <td className="py-1.5 font-mono">{r}</td>
                      <td className="py-1.5">{a}</td>
                      <td className="py-1.5">{c}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
