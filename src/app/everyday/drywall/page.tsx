"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";
import { useMemo } from "react";

const inp = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm";

function fmt(n: number, d = 2) {
  if (!isFinite(n) || isNaN(n)) return "—";
  return n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
}

export default function DrywallPage() {
  const [v, setV] = useHashState({
    roomLength: "20",
    roomWidth: "15",
    ceilingHeight: "9",
    numDoors: "2",
    numWindows: "3",
    sheetSize: "48x96",
    waste: "10",
  });

  const result = useMemo(() => {
    const l = parseFloat(v.roomLength) || 0;
    const w = parseFloat(v.roomWidth) || 0;
    const h = parseFloat(v.ceilingHeight) || 0;
    const doors = parseInt(v.numDoors) || 0;
    const windows = parseInt(v.numWindows) || 0;
    const waste = parseFloat(v.waste) / 100;

    if (l <= 0 || w <= 0 || h <= 0) return null;

    const wallArea = 2 * (l + w) * h;
    const ceilingArea = l * w;
    const totalArea = wallArea + ceilingArea;

    // Standard door 3'×7' = 21 sq ft, standard window 3'×4' = 12 sq ft
    const doorArea = doors * 21;
    const windowArea = windows * 12;
    const netArea = Math.max(0, totalArea - doorArea - windowArea);
    const withWaste = netArea * (1 + waste);

    const [sheetW, sheetH] = v.sheetSize.split("x").map(Number);
    const sheetArea = (sheetW * sheetH) / 144; // convert sq inches to sq ft
    const sheets = Math.ceil(withWaste / sheetArea);

    // Screws: ~32 screws per sheet
    const screws = sheets * 32;
    // Joint compound: ~1 gallon per 100 sq ft (3 coats)
    const compound = Math.ceil(withWaste / 100 * 3);
    // Joint tape: 1 roll per 500 sq ft
    const tape = Math.ceil(withWaste / 500) + 1;

    return { wallArea, ceilingArea, totalArea, netArea, withWaste, sheets, screws, compound, tape, sheetArea };
  }, [v]);

  return (
    <CalculatorShell title="Drywall Calculator" description="Estimate how many drywall sheets and materials you need for a room.">
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-muted mb-1">Room Length (ft)</label>
            <input type="number" value={v.roomLength} onChange={e => setV({ roomLength: e.target.value })} className={inp} min="0" step="0.5" />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Room Width (ft)</label>
            <input type="number" value={v.roomWidth} onChange={e => setV({ roomWidth: e.target.value })} className={inp} min="0" step="0.5" />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Ceiling Height (ft)</label>
            <input type="number" value={v.ceilingHeight} onChange={e => setV({ ceilingHeight: e.target.value })} className={inp} min="0" step="0.5" />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Number of Doors</label>
            <input type="number" value={v.numDoors} onChange={e => setV({ numDoors: e.target.value })} className={inp} min="0" step="1" />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Number of Windows</label>
            <input type="number" value={v.numWindows} onChange={e => setV({ numWindows: e.target.value })} className={inp} min="0" step="1" />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Waste Factor (%)</label>
            <input type="number" value={v.waste} onChange={e => setV({ waste: e.target.value })} className={inp} min="0" max="30" step="1" />
          </div>
        </div>

        <div>
          <label className="block text-xs text-muted mb-1">Sheet Size</label>
          <select value={v.sheetSize} onChange={e => setV({ sheetSize: e.target.value })} className={inp}>
            <option value="48x96">4×8 ft (standard)</option>
            <option value="48x120">4×10 ft</option>
            <option value="48x144">4×12 ft</option>
          </select>
        </div>

        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-primary-light border border-primary/20 rounded-lg text-center">
                <div className="text-xs text-muted mb-1">Drywall Sheets</div>
                <div className="font-mono font-bold text-3xl text-primary">{result.sheets}</div>
                <div className="text-xs text-muted mt-1">sheets needed</div>
              </div>
              <div className="p-4 bg-card border border-card-border rounded-lg text-center">
                <div className="text-xs text-muted mb-1">Total Area (with waste)</div>
                <div className="font-mono font-bold text-2xl">{fmt(result.withWaste, 0)} ft²</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {[
                { label: "Wall Area", value: `${fmt(result.wallArea, 0)} ft²` },
                { label: "Ceiling Area", value: `${fmt(result.ceilingArea, 0)} ft²` },
                { label: "Net Area", value: `${fmt(result.netArea, 0)} ft²` },
                { label: "Screws (est.)", value: `${result.screws.toLocaleString()}` },
                { label: "Joint Compound", value: `${result.compound} gal` },
                { label: "Joint Tape", value: `${result.tape} roll(s)` },
              ].map(r => (
                <div key={r.label} className="p-2 bg-card border border-card-border rounded text-center">
                  <div className="text-muted">{r.label}</div>
                  <div className="font-mono font-semibold">{r.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="text-xs text-muted">
          Assumes standard 3×7 ft doors and 3×4 ft windows. Compound estimate is for 3 coats. Always add 10–15% waste to account for cuts and mistakes.
        </p>
      </div>
    </CalculatorShell>
  );
}
