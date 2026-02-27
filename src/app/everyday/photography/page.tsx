"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";
export default function PhotographyPage() {
  const [v, setV] = useHashState({ focal: "50", aperture: "2.8", distance: "10", sensor: "36" });
  const f=parseFloat(v.focal), N=parseFloat(v.aperture), d=parseFloat(v.distance)*1000, s=parseFloat(v.sensor);
  const valid=f>0&&N>0&&d>0&&s>0;
  const coc=s/1500; // circle of confusion
  const H=f*f/(N*coc)+f; // hyperfocal
  const Dn=d*(H-f)/(H+d-2*f); // near focus
  const Df=d<H?d*(H-f)/(H-d):Infinity; // far focus
  const dof=Df===Infinity?"∞":`${((Df-Dn)/1000).toFixed(2)} m`;
  const fov=2*Math.atan(s/(2*f))*180/Math.PI;
  const ic="w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
  return (
    <CalculatorShell title="Photography Calculator" description="Depth of field, field of view, and hyperfocal distance.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div><label className="block text-sm text-muted mb-1">Focal Length (mm)</label><input type="number" value={v.focal} onChange={e=>setV({focal:e.target.value})} className={ic}/></div>
          <div><label className="block text-sm text-muted mb-1">Aperture (f/)</label><input type="number" value={v.aperture} onChange={e=>setV({aperture:e.target.value})} step="0.1" className={ic}/></div>
          <div><label className="block text-sm text-muted mb-1">Subject Distance (m)</label><input type="number" value={v.distance} onChange={e=>setV({distance:e.target.value})} className={ic}/></div>
          <div><label className="block text-sm text-muted mb-1">Sensor Width (mm)</label>
            <select value={v.sensor} onChange={e=>setV({sensor:e.target.value})} className={ic}>
              <option value="36">Full Frame (36mm)</option><option value="23.6">APS-C (23.6mm)</option><option value="17.3">M4/3 (17.3mm)</option><option value="13.2">1&quot; (13.2mm)</option>
            </select></div>
        </div>
        {valid && <div className="grid grid-cols-2 gap-3">
          <div className="px-4 py-3 bg-primary-light rounded-lg text-center"><span className="block text-xs text-muted">Depth of Field</span><span className="font-mono font-bold text-xl text-primary">{dof}</span></div>
          <div className="px-4 py-3 bg-primary-light rounded-lg text-center"><span className="block text-xs text-muted">Hyperfocal</span><span className="font-mono font-bold text-xl">{(H/1000).toFixed(2)} m</span></div>
          <div className="px-4 py-3 bg-primary-light rounded-lg text-center"><span className="block text-xs text-muted">Near Focus</span><span className="font-mono font-bold text-xl">{(Dn/1000).toFixed(2)} m</span></div>
          <div className="px-4 py-3 bg-primary-light rounded-lg text-center"><span className="block text-xs text-muted">Far Focus</span><span className="font-mono font-bold text-xl">{Df===Infinity?"∞":(Df/1000).toFixed(2)+" m"}</span></div>
          <div className="px-4 py-3 bg-primary-light rounded-lg text-center col-span-2"><span className="block text-xs text-muted">Field of View</span><span className="font-mono font-bold text-xl">{fov.toFixed(1)}°</span></div>
        </div>}
      </div>
    </CalculatorShell>
  );
}
