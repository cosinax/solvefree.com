"use client";
import { useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
const words = "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum".split(" ");
function gen(count: number): string {
  const result: string[] = [];
  for (let i = 0; i < count; i++) result.push(words[Math.floor(Math.random() * words.length)]);
  return result.join(" ");
}
function genParagraphs(n: number): string[] {
  return Array.from({ length: n }, () => { const s = gen(40 + Math.floor(Math.random() * 40)); return s.charAt(0).toUpperCase() + s.slice(1) + "."; });
}
export default function LoremIpsumPage() {
  const [count, setCount] = useState("3");
  const [paragraphs, setParagraphs] = useState<string[]>([]);
  return (
    <CalculatorShell title="Lorem Ipsum Generator" description="Generate placeholder text for design and development.">
      <div className="space-y-4">
        <div className="flex gap-3 items-end">
          <div className="flex-1"><label className="block text-sm text-muted mb-1">Paragraphs</label><input type="number" value={count} onChange={e => setCount(e.target.value)} min="1" max="50" className="w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" /></div>
          <button onClick={() => setParagraphs(genParagraphs(parseInt(count) || 1))} className="px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover">Generate</button>
        </div>
        {paragraphs.length > 0 && <div className="space-y-3 max-h-96 overflow-y-auto">{paragraphs.map((p, i) => <p key={i} className="text-sm leading-relaxed">{p}</p>)}</div>}
      </div>
    </CalculatorShell>
  );
}
