"use client";
import { useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";

const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
const sel = "w-full px-3 py-2.5 bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";

type Shape = "rectangle" | "triangle" | "circle" | "lshape" | "trapezoid";

function calcShape(shape: Shape, dims: Record<string, number>): { area: number; perimeter: number } | null {
  const { l, w, b, h, r, l2, w2, a, b2 } = dims;
  if (shape === "rectangle") {
    if (!(l > 0 && w > 0)) return null;
    return { area: l * w, perimeter: 2 * (l + w) };
  }
  if (shape === "triangle") {
    if (!(b > 0 && h > 0)) return null;
    const hyp = Math.sqrt(b * b + h * h);
    return { area: 0.5 * b * h, perimeter: b + h + hyp };
  }
  if (shape === "circle") {
    if (!(r > 0)) return null;
    return { area: Math.PI * r * r, perimeter: 2 * Math.PI * r };
  }
  if (shape === "lshape") {
    if (!(l > 0 && w > 0 && l2 > 0 && w2 > 0)) return null;
    return { area: l * w - l2 * w2, perimeter: 2 * l + 2 * w - 2 * Math.min(l2, w2) + 2 * Math.max(l2, w2) };
  }
  if (shape === "trapezoid") {
    if (!(a > 0 && b2 > 0 && h > 0)) return null;
    const leg = Math.sqrt(h * h + ((b2 - a) / 2) ** 2);
    return { area: 0.5 * (a + b2) * h, perimeter: a + b2 + 2 * leg };
  }
  return null;
}

interface Room { shape: Shape; l: string; w: string; b: string; h: string; r: string; l2: string; w2: string; a: string; b2: string; name: string; }

const defaultRoom = (): Room => ({ shape: "rectangle", l: "", w: "", b: "", h: "", r: "", l2: "", w2: "", a: "", b2: "", name: "" });

export default function SquareFootagePage() {
  const [v, setV] = useHashState({ mode: "single", shape: "rectangle", l: "12", w: "10", b: "8", h: "6", r: "5", l2: "4", w2: "3", a: "8", b2: "12" });
  const [rooms, setRooms] = useState<Room[]>([{ ...defaultRoom(), shape: "rectangle", l: "12", w: "10", name: "Room 1" }]);

  const shape = v.shape as Shape;
  const dims = { l: parseFloat(v.l), w: parseFloat(v.w), b: parseFloat(v.b), h: parseFloat(v.h), r: parseFloat(v.r), l2: parseFloat(v.l2), w2: parseFloat(v.w2), a: parseFloat(v.a), b2: parseFloat(v.b2) };
  const result = v.mode === "single" ? calcShape(shape, dims) : null;

  const totalArea = v.mode === "multi"
    ? rooms.reduce((sum, rm) => {
        const res = calcShape(rm.shape, { l: parseFloat(rm.l), w: parseFloat(rm.w), b: parseFloat(rm.b), h: parseFloat(rm.h), r: parseFloat(rm.r), l2: parseFloat(rm.l2), w2: parseFloat(rm.w2), a: parseFloat(rm.a), b2: parseFloat(rm.b2) });
        return sum + (res?.area ?? 0);
      }, 0)
    : 0;

  const updateRoom = (i: number, field: keyof Room, val: string) => {
    setRooms(prev => prev.map((r, idx) => idx === i ? { ...r, [field]: val } : r));
  };
  const addRoom = () => { if (rooms.length < 6) setRooms(prev => [...prev, { ...defaultRoom(), name: `Room ${prev.length + 1}` }]); };
  const removeRoom = (i: number) => setRooms(prev => prev.filter((_, idx) => idx !== i));

  const shapeInputs = (s: Shape, vals: Record<string, string>, onChange: (k: string, v: string) => void) => {
    if (s === "rectangle") return (
      <div className="grid grid-cols-2 gap-3">
        <div><label className="block text-xs text-muted mb-1">Length (ft)</label><input type="number" value={vals.l ?? ""} onChange={e => onChange("l", e.target.value)} className={ic} /></div>
        <div><label className="block text-xs text-muted mb-1">Width (ft)</label><input type="number" value={vals.w ?? ""} onChange={e => onChange("w", e.target.value)} className={ic} /></div>
      </div>
    );
    if (s === "triangle") return (
      <div className="grid grid-cols-2 gap-3">
        <div><label className="block text-xs text-muted mb-1">Base (ft)</label><input type="number" value={vals.b ?? ""} onChange={e => onChange("b", e.target.value)} className={ic} /></div>
        <div><label className="block text-xs text-muted mb-1">Height (ft)</label><input type="number" value={vals.h ?? ""} onChange={e => onChange("h", e.target.value)} className={ic} /></div>
      </div>
    );
    if (s === "circle") return (
      <div><label className="block text-xs text-muted mb-1">Radius (ft)</label><input type="number" value={vals.r ?? ""} onChange={e => onChange("r", e.target.value)} className={ic} /></div>
    );
    if (s === "lshape") return (
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-3">
          <div><label className="block text-xs text-muted mb-1">Total Length (ft)</label><input type="number" value={vals.l ?? ""} onChange={e => onChange("l", e.target.value)} className={ic} /></div>
          <div><label className="block text-xs text-muted mb-1">Total Width (ft)</label><input type="number" value={vals.w ?? ""} onChange={e => onChange("w", e.target.value)} className={ic} /></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="block text-xs text-muted mb-1">Cutout Length (ft)</label><input type="number" value={vals.l2 ?? ""} onChange={e => onChange("l2", e.target.value)} className={ic} /></div>
          <div><label className="block text-xs text-muted mb-1">Cutout Width (ft)</label><input type="number" value={vals.w2 ?? ""} onChange={e => onChange("w2", e.target.value)} className={ic} /></div>
        </div>
      </div>
    );
    if (s === "trapezoid") return (
      <div className="grid grid-cols-3 gap-3">
        <div><label className="block text-xs text-muted mb-1">Base 1 (ft)</label><input type="number" value={vals.a ?? ""} onChange={e => onChange("a", e.target.value)} className={ic} /></div>
        <div><label className="block text-xs text-muted mb-1">Base 2 (ft)</label><input type="number" value={vals.b2 ?? ""} onChange={e => onChange("b2", e.target.value)} className={ic} /></div>
        <div><label className="block text-xs text-muted mb-1">Height (ft)</label><input type="number" value={vals.h ?? ""} onChange={e => onChange("h", e.target.value)} className={ic} /></div>
      </div>
    );
    return null;
  };

  return (
    <CalculatorShell title="Square Footage Calculator" description="Calculate area in square feet and meters for rectangles, triangles, circles, L-shapes, and trapezoids.">
      <div className="space-y-4">
        <div className="flex gap-2">
          <button onClick={() => setV({ mode: "single" })} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${v.mode === "single" ? "bg-primary text-white" : "bg-background border border-card-border text-muted"}`}>Single Shape</button>
          <button onClick={() => setV({ mode: "multi" })} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${v.mode === "multi" ? "bg-primary text-white" : "bg-background border border-card-border text-muted"}`}>Multi-Room</button>
        </div>

        {v.mode === "single" && (
          <>
            <div>
              <label className="block text-sm text-muted mb-1">Shape</label>
              <select value={v.shape} onChange={e => setV({ shape: e.target.value })} className={sel}>
                <option value="rectangle">Rectangle</option>
                <option value="triangle">Triangle (right)</option>
                <option value="circle">Circle</option>
                <option value="lshape">L-Shape</option>
                <option value="trapezoid">Trapezoid</option>
              </select>
            </div>
            {shapeInputs(shape, { l: v.l, w: v.w, b: v.b, h: v.h, r: v.r, l2: v.l2, w2: v.w2, a: v.a, b2: v.b2 }, (k, val) => setV({ [k]: val } as Record<string, string>))}
            {result && (
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-primary-light rounded-xl p-4 text-center">
                  <span className="block text-xs text-muted mb-1">Square Feet</span>
                  <span className="block font-mono font-bold text-4xl text-primary">{result.area.toFixed(1)}</span>
                  <span className="text-xs text-muted">sq ft</span>
                </div>
                <div className="bg-primary-light rounded-xl p-4 text-center">
                  <span className="block text-xs text-muted mb-1">Square Meters</span>
                  <span className="block font-mono font-bold text-4xl text-primary">{(result.area * 0.0929).toFixed(2)}</span>
                  <span className="text-xs text-muted">m²</span>
                </div>
                <div className="flex justify-between px-3 py-1.5 bg-background border border-card-border rounded text-xs font-mono col-span-2">
                  <span className="text-muted">Perimeter</span>
                  <span>{result.perimeter.toFixed(2)} ft ({(result.perimeter * 0.3048).toFixed(2)} m)</span>
                </div>
              </div>
            )}
          </>
        )}

        {v.mode === "multi" && (
          <>
            {rooms.map((rm, i) => (
              <div key={i} className="border border-card-border rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <input type="text" value={rm.name} onChange={e => updateRoom(i, "name", e.target.value)} placeholder={`Room ${i + 1}`} className="px-2 py-1 bg-background border border-card-border rounded text-sm font-medium focus:outline-none focus:ring-1 focus:ring-primary w-40" />
                  <div className="flex items-center gap-2">
                    <select value={rm.shape} onChange={e => updateRoom(i, "shape", e.target.value)} className="px-2 py-1 bg-background border border-card-border rounded text-xs focus:outline-none">
                      <option value="rectangle">Rect</option>
                      <option value="triangle">Triangle</option>
                      <option value="circle">Circle</option>
                      <option value="lshape">L-Shape</option>
                      <option value="trapezoid">Trapezoid</option>
                    </select>
                    {rooms.length > 1 && <button onClick={() => removeRoom(i)} className="text-xs text-red-400 hover:text-red-500">Remove</button>}
                  </div>
                </div>
                {shapeInputs(rm.shape as Shape, { l: rm.l, w: rm.w, b: rm.b, h: rm.h, r: rm.r, l2: rm.l2, w2: rm.w2, a: rm.a, b2: rm.b2 }, (k, val) => updateRoom(i, k as keyof Room, val))}
                {(() => {
                  const res = calcShape(rm.shape as Shape, { l: parseFloat(rm.l), w: parseFloat(rm.w), b: parseFloat(rm.b), h: parseFloat(rm.h), r: parseFloat(rm.r), l2: parseFloat(rm.l2), w2: parseFloat(rm.w2), a: parseFloat(rm.a), b2: parseFloat(rm.b2) });
                  return res ? <div className="text-xs text-muted font-mono">{res.area.toFixed(1)} sq ft</div> : null;
                })()}
              </div>
            ))}
            {rooms.length < 6 && (
              <button onClick={addRoom} className="w-full py-2 border border-dashed border-card-border rounded-lg text-sm text-muted hover:text-primary hover:border-primary transition-colors">+ Add Room</button>
            )}
            {totalArea > 0 && (
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-primary-light rounded-xl p-4 text-center">
                  <span className="block text-xs text-muted mb-1">Total Square Feet</span>
                  <span className="block font-mono font-bold text-4xl text-primary">{totalArea.toFixed(1)}</span>
                </div>
                <div className="bg-primary-light rounded-xl p-4 text-center">
                  <span className="block text-xs text-muted mb-1">Total Square Meters</span>
                  <span className="block font-mono font-bold text-4xl text-primary">{(totalArea * 0.0929).toFixed(2)}</span>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </CalculatorShell>
  );
}
