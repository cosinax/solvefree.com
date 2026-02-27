"use client";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useHashState } from "@/hooks/useHashState";
function gcd(a:number,b:number):number{a=Math.abs(a);b=Math.abs(b);while(b){[a,b]=[b,a%b]}return a}
export default function ImageResolutionPage() {
  const [v, setV] = useHashState({ width: "1920", height: "1080", channels: "3", bitDepth: "8" });
  const w=parseInt(v.width), h=parseInt(v.height), c=parseInt(v.channels), bd=parseInt(v.bitDepth);
  const valid=w>0&&h>0&&c>0&&bd>0;
  const pixels=w*h;
  const g=gcd(w,h);
  const aspectW=w/g, aspectH=h/g;
  const bytesPerPixel=c*(bd/8);
  const rawBytes=pixels*bytesPerPixel;
  const megapixels=pixels/1e6;
  const ic="w-full px-3 py-2.5 font-mono bg-background border border-card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary";
  return (
    <CalculatorShell title="Image Resolution Calculator" description="Calculate pixel count, aspect ratio, memory, and megapixels.">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div><label className="block text-sm text-muted mb-1">Width (px)</label><input type="number" value={v.width} onChange={e=>setV({width:e.target.value})} className={ic}/></div>
          <div><label className="block text-sm text-muted mb-1">Height (px)</label><input type="number" value={v.height} onChange={e=>setV({height:e.target.value})} className={ic}/></div>
          <div><label className="block text-sm text-muted mb-1">Channels</label><input type="number" value={v.channels} onChange={e=>setV({channels:e.target.value})} className={ic}/></div>
          <div><label className="block text-sm text-muted mb-1">Bit Depth</label>
            <div className="grid grid-cols-3 gap-1">{[8,16,32].map(b=>
              <button key={b} onClick={()=>setV({bitDepth:b.toString()})} className={`py-1.5 rounded text-xs font-medium ${parseInt(v.bitDepth)===b?"bg-primary text-white":"bg-background border border-card-border"}`}>{b}-bit</button>
            )}</div></div>
        </div>
        {valid && <div className="grid grid-cols-2 gap-3">
          <div className="px-4 py-3 bg-primary-light rounded-lg text-center"><span className="block text-xs text-muted">Megapixels</span><span className="font-mono font-bold text-xl">{megapixels.toFixed(2)} MP</span></div>
          <div className="px-4 py-3 bg-primary-light rounded-lg text-center"><span className="block text-xs text-muted">Aspect Ratio</span><span className="font-mono font-bold text-xl">{aspectW}:{aspectH}</span></div>
          <div className="px-4 py-3 bg-primary-light rounded-lg text-center"><span className="block text-xs text-muted">Raw Size</span><span className="font-mono font-bold text-xl">{rawBytes>=1e9?(rawBytes/1e9).toFixed(2)+" GB":rawBytes>=1e6?(rawBytes/1e6).toFixed(2)+" MB":(rawBytes/1e3).toFixed(0)+" KB"}</span></div>
          <div className="px-4 py-3 bg-primary-light rounded-lg text-center"><span className="block text-xs text-muted">Total Pixels</span><span className="font-mono font-bold text-xl">{pixels.toLocaleString()}</span></div>
        </div>}
      </div>
    </CalculatorShell>
  );
}
