"use client";
import { useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
export default function CharacterCounterPage() {
  const [text, setText] = useState("");
  const chars = text.length;
  const charsNoSpace = text.replace(/\s/g,"").length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const sentences = text.trim() ? text.split(/[.!?]+/).filter(s=>s.trim()).length : 0;
  const paragraphs = text.trim() ? text.split(/\n\s*\n/).filter(s=>s.trim()).length : 0;
  const lines = text ? text.split("\n").length : 0;
  const readingTime = Math.ceil(words / 200);
  const speakingTime = Math.ceil(words / 130);
  return (
    <CalculatorShell title="Character Counter" description="Count characters, words, sentences, paragraphs, and more.">
      <div className="space-y-4">
        <textarea value={text} onChange={e=>setText(e.target.value)} rows={6} placeholder="Type or paste your text here..."
          className="w-full px-4 py-3 bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-y"/>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[{l:"Characters",v:chars},{l:"No Spaces",v:charsNoSpace},{l:"Words",v:words},{l:"Sentences",v:sentences},{l:"Paragraphs",v:paragraphs},{l:"Lines",v:lines},{l:"Read Time",v:`${readingTime} min`},{l:"Speak Time",v:`${speakingTime} min`}].map(m=>
            <div key={m.l} className="px-3 py-2.5 bg-primary-light rounded-lg text-center"><span className="block text-xs text-muted">{m.l}</span><span className="font-mono font-bold">{m.v}</span></div>
          )}
        </div>
      </div>
    </CalculatorShell>
  );
}
