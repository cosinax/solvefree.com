"use client";
import { useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
function simpleMarkdown(md: string): string {
  return md
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold mt-4 mb-1">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold mt-4 mb-1">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mt-4 mb-2">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-1 rounded text-sm font-mono">$1</code>')
    .replace(/^\- (.+)$/gm, '<li class="ml-4">• $1</li>')
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-4">$1</li>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-primary underline">$1</a>')
    .replace(/^---$/gm, '<hr class="border-card-border my-4" />')
    .replace(/\n\n/g, '<br/><br/>')
    .replace(/\n/g, '<br/>');
}
export default function MarkdownPreviewPage() {
  const [md, setMd] = useState("# Hello World\n\nThis is **bold** and *italic* text.\n\n## Features\n\n- Item one\n- Item two\n- `inline code`\n\n[Link](https://example.com)\n\n---\n\nParagraph text here.");
  return (
    <CalculatorShell title="Markdown Preview" description="Write Markdown and see a live preview.">
      <div className="space-y-4">
        <div><label className="block text-sm text-muted mb-1">Markdown Input</label>
          <textarea value={md} onChange={e=>setMd(e.target.value)} rows={8}
            className="w-full px-4 py-3 font-mono text-sm bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-y"/></div>
        <div><label className="block text-sm text-muted mb-1">Preview</label>
          <div className="px-4 py-3 bg-background border border-card-border rounded-lg prose prose-sm max-w-none" dangerouslySetInnerHTML={{__html: simpleMarkdown(md)}}/></div>
      </div>
    </CalculatorShell>
  );
}
