"use client";

import { useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";

function hexToRgb(hex: string): [number, number, number] | null {
  const m = hex.replace("#", "").match(/^([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : null;
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l * 100];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

export default function ColorConverterPage() {
  const [hex, setHex] = useState("#2563eb");
  const rgb = hexToRgb(hex);
  const hsl = rgb ? rgbToHsl(...rgb) : null;
  const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
  return (
    <CalculatorShell title="Color Converter" description="Convert between HEX, RGB, and HSL color formats.">
      <div className="space-y-4">
        <div><label className="block text-sm text-muted mb-1">HEX Color</label>
          <div className="flex gap-2">
            <input type="color" value={hex} onChange={(e) => setHex(e.target.value)} className="w-12 h-10 rounded border border-card-border cursor-pointer" />
            <input type="text" value={hex} onChange={(e) => setHex(e.target.value)} className={ic} />
          </div>
        </div>
        {rgb && hsl && (
          <>
            <div className="h-24 rounded-xl border border-card-border" style={{ backgroundColor: hex }} />
            <div className="space-y-2">
              <div className="px-4 py-3 bg-primary-light rounded-lg flex justify-between"><span className="text-sm text-muted">HEX</span><span className="font-mono font-semibold">{hex.toUpperCase()}</span></div>
              <div className="px-4 py-3 bg-primary-light rounded-lg flex justify-between"><span className="text-sm text-muted">RGB</span><span className="font-mono font-semibold">rgb({rgb.join(", ")})</span></div>
              <div className="px-4 py-3 bg-primary-light rounded-lg flex justify-between"><span className="text-sm text-muted">HSL</span><span className="font-mono font-semibold">hsl({hsl[0]}, {hsl[1]}%, {hsl[2]}%)</span></div>
              <div className="px-4 py-3 bg-primary-light rounded-lg flex justify-between"><span className="text-sm text-muted">CSS</span><span className="font-mono font-semibold text-xs">rgba({rgb[0]}, {rgb[1]}, {rgb[2]}, 1)</span></div>
            </div>
          </>
        )}
      </div>
    </CalculatorShell>
  );
}
