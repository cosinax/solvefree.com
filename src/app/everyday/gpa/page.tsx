"use client";
import { useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
const gradePoints: Record<string,number> = {"A+":4.0,"A":4.0,"A-":3.7,"B+":3.3,"B":3.0,"B-":2.7,"C+":2.3,"C":2.0,"C-":1.7,"D+":1.3,"D":1.0,"D-":0.7,"F":0.0};
interface Course { grade: string; credits: string; }
export default function GpaPage() {
  const [courses, setCourses] = useState<Course[]>([{grade:"A",credits:"3"},{grade:"B+",credits:"3"},{grade:"A-",credits:"4"},{grade:"B",credits:"3"}]);
  const add = () => setCourses([...courses,{grade:"A",credits:"3"}]);
  const remove = (i:number) => setCourses(courses.filter((_,j)=>j!==i));
  const update = (i:number,f:Partial<Course>) => { const c=[...courses]; c[i]={...c[i],...f}; setCourses(c); };
  const totalCredits = courses.reduce((s,c)=>s+(parseFloat(c.credits)||0),0);
  const totalPoints = courses.reduce((s,c)=>s+(gradePoints[c.grade]||0)*(parseFloat(c.credits)||0),0);
  const gpa = totalCredits>0?totalPoints/totalCredits:0;
  return (
    <CalculatorShell title="GPA Calculator" description="Calculate GPA from letter grades and credit hours.">
      <div className="space-y-4">
        <div className="space-y-2">{courses.map((c,i)=><div key={i} className="flex gap-2 items-center">
          <select value={c.grade} onChange={e=>update(i,{grade:e.target.value})} className="flex-1 px-2 py-2 bg-background border border-card-border rounded-lg text-sm">{Object.keys(gradePoints).map(g=><option key={g}>{g}</option>)}</select>
          <input type="number" value={c.credits} onChange={e=>update(i,{credits:e.target.value})} placeholder="Credits" className="w-20 px-2 py-2 font-mono bg-background border border-card-border rounded-lg text-sm text-center"/>
          <button onClick={()=>remove(i)} className="text-danger text-sm px-2">✕</button>
        </div>)}</div>
        <button onClick={add} className="w-full py-2 text-sm text-primary font-medium border border-dashed border-card-border rounded-lg hover:bg-primary-light">+ Add Course</button>
        <div className="bg-primary-light rounded-xl p-4 text-center"><span className="block text-sm text-muted">GPA</span><span className="block font-mono font-bold text-4xl text-primary">{gpa.toFixed(2)}</span>
          <span className="block text-xs text-muted">{totalCredits} credits · {totalPoints.toFixed(1)} quality points</span></div>
      </div>
    </CalculatorShell>
  );
}
