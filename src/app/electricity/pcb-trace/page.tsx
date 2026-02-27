"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";
export default function PcbTracePage() {
  const [v, setV] = useHashState({ current: "1", tempRise: "10", thickness: "1", layer: "external" });
  const I = parseFloat(v.current), dT = parseFloat(v.tempRise), t = parseFloat(v.thickness);
  const valid = I > 0 && dT > 0 && t > 0;
  // IPC-2221 formula: I = k * dT^0.44 * A^0.725
  // Solving for A: A = (I / (k * dT^0.44))^(1/0.725)
  const k = v.layer === "external" ? 0.048 : 0.024;
  const area = valid ? Math.pow(I / (k * Math.pow(dT, 0.44)), 1 / 0.725) : 0; // mils²
  const width = area / (t * 1.378); // mils (1oz = 1.378 mils thick)
  const widthMm = width * 0.0254;
  const ic = "w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
  return (
    <CalculatorShell title="PCB Trace Width Calculator" description="Calculate PCB trace width for current carrying capacity (IPC-2221).">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div><label className="block text-sm text-muted mb-1">Current (A)</label><input type="number" value={v.current} onChange={e=>setV({current:e.target.value})} step="0.1" className={ic}/></div>
          <div><label className="block text-sm text-muted mb-1">Temp Rise (°C)</label><input type="number" value={v.tempRise} onChange={e=>setV({tempRise:e.target.value})} className={ic}/></div>
          <div><label className="block text-sm text-muted mb-1">Copper (oz)</label><input type="number" value={v.thickness} onChange={e=>setV({thickness:e.target.value})} step="0.5" className={ic}/></div>
          <div><label className="block text-sm text-muted mb-1">Layer</label>
            <div className="grid grid-cols-2 gap-1">
              <button onClick={()=>setV({layer:"external"})} className={`py-1.5 rounded text-xs font-medium ${v.layer==="external"?"bg-primary text-white":"bg-background border border-card-border"}`}>External</button>
              <button onClick={()=>setV({layer:"internal"})} className={`py-1.5 rounded text-xs font-medium ${v.layer==="internal"?"bg-primary text-white":"bg-background border border-card-border"}`}>Internal</button>
            </div></div>
        </div>
        {valid && <div className="grid grid-cols-2 gap-3">
          <div className="px-4 py-3 bg-primary-light rounded-lg text-center"><span className="block text-xs text-muted">Trace Width (mils)</span><span className="font-mono font-bold text-2xl text-primary">{width.toFixed(1)}</span></div>
          <div className="px-4 py-3 bg-primary-light rounded-lg text-center"><span className="block text-xs text-muted">Trace Width (mm)</span><span className="font-mono font-bold text-xl">{widthMm.toFixed(2)}</span></div>
          <div className="px-4 py-3 bg-primary-light rounded-lg text-center col-span-2"><span className="block text-xs text-muted">Cross-section Area</span><span className="font-mono font-bold text-xl">{area.toFixed(1)} mils²</span></div>
        </div>}
        <p className="text-xs text-muted">Based on IPC-2221 standard. {v.layer === "external" ? "External" : "Internal"} layer, {v.thickness}oz copper.</p>
      </div>
    </CalculatorShell>
  );
}
