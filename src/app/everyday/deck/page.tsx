"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";
import { useMemo } from "react";

const inp = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm";

function fmt(n: number, d = 2) {
  if (!isFinite(n)) return "—";
  return n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
}

export default function DeckPage() {
  const [v, setV] = useHashState({
    length: "16",
    width: "12",
    boardWidth: "5.5",
    boardThickness: "1",
    boardLength: "16",
    gap: "0.25",
    joistSpacing: "16",
    pricePerBd: "1.5",
  });

  const result = useMemo(() => {
    const l = parseFloat(v.length) || 0;
    const w = parseFloat(v.width) || 0;
    const bw = parseFloat(v.boardWidth) / 12 || 0; // convert to ft
    const bl = parseFloat(v.boardLength) || 0;
    const gap = parseFloat(v.gap) / 12 || 0; // convert to ft
    const joistSpacing = parseFloat(v.joistSpacing) / 12 || 0; // convert to ft
    const price = parseFloat(v.pricePerBd) || 0;

    if (l <= 0 || w <= 0 || bw <= 0 || bl <= 0) return null;

    const deckArea = l * w;
    const boardsNeeded = Math.ceil(w / (bw + gap)); // across the width
    const boardsWithWaste = Math.ceil(boardsNeeded * 1.1); // 10% waste
    // Each board runs the length; how many lengths do we need?
    const lengthsPerBoard = Math.ceil(l / bl);
    const totalBoards = boardsWithWaste * lengthsPerBoard;

    // Joists
    const joists = Math.ceil(l / joistSpacing) + 1;

    // Linear ft of decking
    const linearFt = totalBoards * bl;
    const materialCost = linearFt * price;

    // Screws: ~2 per board per joist crossing
    const screws = totalBoards * joists * 2;

    return { deckArea, boardsWithWaste, totalBoards, linearFt, joists, screws, materialCost };
  }, [v]);

  return (
    <CalculatorShell title="Deck Calculator" description="Estimate decking boards, joists, and material cost for a deck project.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-muted mb-1">Deck Length (ft)</label>
            <input type="number" value={v.length} onChange={e => setV({ length: e.target.value })} className={inp} min="0" step="1" />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Deck Width (ft)</label>
            <input type="number" value={v.width} onChange={e => setV({ width: e.target.value })} className={inp} min="0" step="1" />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Board Width (inches)</label>
            <input type="number" value={v.boardWidth} onChange={e => setV({ boardWidth: e.target.value })} className={inp} min="2" max="12" step="0.5" />
            <p className="text-xs text-muted mt-1">5.5" = 2×6, 3.5" = 2×4</p>
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Board Length (ft)</label>
            <select value={v.boardLength} onChange={e => setV({ boardLength: e.target.value })} className={inp}>
              <option value="8">8 ft</option>
              <option value="10">10 ft</option>
              <option value="12">12 ft</option>
              <option value="16">16 ft</option>
              <option value="20">20 ft</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Gap Between Boards (inches)</label>
            <input type="number" value={v.gap} onChange={e => setV({ gap: e.target.value })} className={inp} min="0" max="1" step="0.0625" />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Price per Linear Foot ($)</label>
            <input type="number" value={v.pricePerBd} onChange={e => setV({ pricePerBd: e.target.value })} className={inp} min="0" step="0.1" />
          </div>
        </div>

        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-primary-light border border-primary/20 rounded-lg text-center">
                <div className="text-xs text-muted mb-1">Total Boards</div>
                <div className="font-mono font-bold text-3xl text-primary">{result.totalBoards}</div>
                <div className="text-xs text-muted mt-1">{fmt(result.linearFt, 0)} linear ft</div>
              </div>
              <div className="p-4 bg-card border border-card-border rounded-lg text-center">
                <div className="text-xs text-muted mb-1">Material Cost</div>
                <div className="font-mono font-bold text-2xl">${fmt(result.materialCost, 0)}</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs text-center">
              {[
                { label: "Deck Area", value: `${fmt(result.deckArea, 0)} ft²` },
                { label: "Joists (est.)", value: result.joists.toString() },
                { label: "Screws (est.)", value: result.screws.toLocaleString() },
              ].map(r => (
                <div key={r.label} className="p-2 bg-card border border-card-border rounded">
                  <div className="text-muted">{r.label}</div>
                  <div className="font-mono font-semibold">{r.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="text-xs text-muted">Includes 10% waste factor. Does not include posts, beams, hardware, or labor. Joist count based on selected spacing over the deck length.</p>
      </div>
    </CalculatorShell>
  );
}
